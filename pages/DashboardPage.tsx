import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../services/AuthService';
import { UserRole, Ticket, Quote, Service, TicketStatus, User, Message, QuoteStatus, ServiceStatus } from '../types';
import { supabase } from '../services/supabaseClient';
import { Logo, Button, Card, Input, Textarea, Select, Modal } from '../components/ui';
import { useNavigate } from 'react-router-dom';

// Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg>;
const QuoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ServiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ClientsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EmployeesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const ticketStatusColors: Record<string, string> = {
    [TicketStatus.OPEN]: 'bg-green-100 text-green-800',
    [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-800',
};

const quoteStatusColors: Record<string, string> = {
    [QuoteStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [QuoteStatus.SENT]: 'bg-blue-100 text-blue-800',
    [QuoteStatus.APPROVED]: 'bg-green-100 text-green-800',
    [QuoteStatus.REJECTED]: 'bg-red-100 text-red-800',
};

const serviceStatusColors: Record<string, string> = {
    [ServiceStatus.NOT_STARTED]: 'bg-gray-100 text-gray-800',
    [ServiceStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [ServiceStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [ServiceStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
};

const StatusBadge: React.FC<{ status: string; colors: Record<string, string> }> = ({ status, colors }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
    </span>
);

type DashboardView = 'summary' | 'tickets' | 'ticket-detail' | 'quotes' | 'quote-detail' | 'services' | 'service-detail' | 'clients' | 'employees';

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [view, setView] = useState<DashboardView>('summary');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    const [isNewTicketModalOpen, setNewTicketModalOpen] = useState(false);
    const [isNewQuoteModalOpen, setNewQuoteModalOpen] = useState(false);
    const [isNewServiceModalOpen, setNewServiceModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            let ticketsQuery = supabase.from('tickets').select('*, profiles(name)');
            let quotesQuery = supabase.from('quotes').select('*, profiles(name)');
            let servicesQuery = supabase.from('services').select('*, profiles(name)');
            let clientsQuery = supabase.from('profiles').select('*').eq('role', UserRole.CUSTOMER);

            if (user.role === UserRole.CUSTOMER) {
                ticketsQuery = ticketsQuery.eq('client_id', user.id);
                quotesQuery = quotesQuery.eq('client_id', user.id);
                servicesQuery = servicesQuery.eq('client_id', user.id);
            }

            const [ticketRes, quoteRes, serviceRes, clientRes] = await Promise.all([
                ticketsQuery.order('created_at', { ascending: false }),
                quotesQuery.order('created_at', { ascending: false }),
                servicesQuery.order('start_date', { ascending: false }),
                // FIX: Used clientsQuery variable instead of clientRes which was not yet declared.
                user.role === UserRole.ADMIN ? clientsQuery : Promise.resolve({ data: [] }),
            ]);

            if (ticketRes.error) throw ticketRes.error;
            if (quoteRes.error) throw quoteRes.error;
            if (serviceRes.error) throw serviceRes.error;
            if (clientRes.error) throw clientRes.error;

            setTickets(ticketRes.data as Ticket[]);
            setQuotes(quoteRes.data as Quote[]);
            setServices(serviceRes.data as Service[]);
            setClients(clientRes.data as User[]);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const hasOpenTickets = useMemo(() => tickets.some(t => t.status === TicketStatus.OPEN), [tickets]);

    const customerNavItems = [
        { id: 'summary', label: 'Resumo', icon: HomeIcon },
        { id: 'tickets', label: 'Chamados', icon: TicketIcon, notification: hasOpenTickets },
        { id: 'quotes', label: 'Orçamentos', icon: QuoteIcon },
        { id: 'services', label: 'Meus Serviços', icon: ServiceIcon },
    ];

    const adminNavItems = [ ...customerNavItems, { id: 'clients', label: 'Clientes', icon: ClientsIcon, notification: false }, { id: 'employees', label: 'Funcionários', icon: EmployeesIcon, notification: false }, ];
    
    const navItems = user?.role === UserRole.ADMIN ? adminNavItems : customerNavItems;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navigateToTicketDetail = (ticketId: string) => { setSelectedTicketId(ticketId); setView('ticket-detail'); };
    const navigateToQuoteDetail = (quoteId: string) => { setSelectedQuoteId(quoteId); setView('quote-detail'); };
    const navigateToServiceDetail = (serviceId: string) => { setSelectedServiceId(serviceId); setView('service-detail'); };

    const renderView = () => {
        if (isLoading) return <div className="text-center p-10">Carregando dados...</div>;
        switch (view) {
            case 'summary': return <SummaryView stats={{ tickets, quotes, services, clients }} />;
            case 'tickets': return <TicketsView tickets={tickets} onTicketSelect={navigateToTicketDetail} onNewTicket={() => setNewTicketModalOpen(true)} />;
            case 'ticket-detail': return selectedTicketId && <TicketDetailView ticketId={selectedTicketId} onBack={() => setView('tickets')} onSuccess={fetchData} />;
            case 'quotes': return <QuotesView quotes={quotes} onQuoteSelect={navigateToQuoteDetail} onNewQuote={() => setNewQuoteModalOpen(true)} />;
            case 'quote-detail': return selectedQuoteId && <QuoteDetailView quoteId={selectedQuoteId} onBack={() => setView('quotes')} onSuccess={fetchData} />;
            case 'services': return <ServicesView services={services} onServiceSelect={navigateToServiceDetail} onNewService={() => setNewServiceModalOpen(true)}/>;
            case 'service-detail': return selectedServiceId && <ServiceDetailView serviceId={selectedServiceId} onBack={() => setView('services')} onSuccess={fetchData} />;
            case 'clients': return user?.role === UserRole.ADMIN && <ClientsView clients={clients} />;
            case 'employees': return user?.role === UserRole.ADMIN && <EmployeesView />;
            default: return <SummaryView stats={{ tickets, quotes, services, clients }} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className={`bg-elevva-dark text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
                <div className="px-4"><Logo className="h-10 text-white" /></div>
                <nav>
                    {navItems.map(item => (
                        <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setView(item.id as DashboardView); setSidebarOpen(false);}}
                            className={`flex items-center justify-between px-4 py-2 my-1 rounded-md transition-colors ${view === item.id ? 'bg-elevva-blue' : 'hover:bg-gray-700'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon />
                                <span>{item.label}</span>
                            </div>
                            {item.notification && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>}
                        </a>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full left-0 px-2 pb-4">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-3 rounded-md hover:bg-red-500 transition-colors text-red-300 hover:text-white">
                        <LogoutIcon />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between md:justify-end items-center p-4 bg-white border-b">
                     <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className="text-right">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderView()}
                </main>
            </div>
            {isNewTicketModalOpen && <NewTicketModal isOpen={isNewTicketModalOpen} onClose={() => setNewTicketModalOpen(false)} clients={clients} onSuccess={fetchData} />}
            {isNewQuoteModalOpen && <NewQuoteModal isOpen={isNewQuoteModalOpen} onClose={() => setNewQuoteModalOpen(false)} clients={clients} onSuccess={fetchData} />}
            {isNewServiceModalOpen && <NewServiceModal isOpen={isNewServiceModalOpen} onClose={() => setNewServiceModalOpen(false)} clients={clients} onSuccess={fetchData} />}
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => ( <Card className="flex items-center p-5"> <div className="p-3 rounded-full bg-elevva-blue/20 text-elevva-blue mr-4">{icon}</div> <div> <p className="text-sm font-medium text-gray-500">{title}</p> <p className="text-2xl font-bold text-gray-800">{value}</p> </div> </Card> );

const SummaryView: React.FC<{ stats: { tickets: Ticket[]; quotes: Quote[]; services: Service[]; clients: User[] } }> = ({ stats }) => {
    const { user } = useAuth();
    const summary = useMemo(() => {
        if (user?.role === UserRole.ADMIN) {
            return {
                stat1: { title: "Clientes Ativos", value: stats.clients.length, icon: <ClientsIcon /> },
                stat2: { title: "Chamados Abertos", value: stats.tickets.filter(t => t.status === TicketStatus.OPEN).length, icon: <TicketIcon /> },
                stat3: { title: "Orçamentos Pendentes", value: stats.quotes.filter(q => q.status === QuoteStatus.PENDING || q.status === QuoteStatus.SENT).length, icon: <QuoteIcon /> },
                stat4: { title: "Serviços em Andamento", value: stats.services.filter(s => s.status === ServiceStatus.IN_PROGRESS).length, icon: <ServiceIcon /> },
            };
        }
        return {
            stat1: { title: "Seus Chamados Abertos", value: stats.tickets.filter(t => t.status === TicketStatus.OPEN).length, icon: <TicketIcon /> },
            stat2: { title: "Seus Orçamentos Pendentes", value: stats.quotes.filter(q => q.status === QuoteStatus.PENDING || q.status === QuoteStatus.SENT).length, icon: <QuoteIcon /> },
            stat3: { title: "Seus Serviços em Andamento", value: stats.services.filter(s => s.status === ServiceStatus.IN_PROGRESS).length, icon: <ServiceIcon /> },
        };
    }, [stats, user]);

    return ( <div> <h1 className="text-3xl font-bold text-gray-800 mb-6">Bem-vindo(a), {user?.name}!</h1> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {summary.stat1 && <StatCard {...summary.stat1} />} {summary.stat2 && <StatCard {...summary.stat2} />} {summary.stat3 && <StatCard {...summary.stat3} />} {summary.stat4 && <StatCard {...summary.stat4} />} </div> </div> );
};

const TicketsView: React.FC<{ tickets: Ticket[]; onTicketSelect: (id: string) => void; onNewTicket: () => void; }> = ({ tickets, onTicketSelect, onNewTicket }) => {
    const { user } = useAuth();
    return (
        <div>
            <div className="flex justify-between items-center mb-6"> <h1 className="text-2xl font-bold text-gray-800">Chamados</h1> <Button onClick={onNewTicket}>Abrir Novo Chamado</Button> </div>
            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {user?.role === UserRole.ADMIN && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    {user?.role === UserRole.ADMIN && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.profiles.name}</td>}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={ticket.status} colors={ticketStatusColors} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> <button onClick={() => onTicketSelect(ticket.id)} className="text-elevva-blue hover:underline">Ver Detalhes</button> </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const TicketDetailView: React.FC<{ ticketId: string; onBack: () => void; onSuccess: () => void; }> = ({ ticketId, onBack, onSuccess }) => {
    const { user } = useAuth();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const fetchTicketDetails = useCallback(async () => {
        const { data: ticketData, error: ticketError } = await supabase.from('tickets').select('*, profiles(name)').eq('id', ticketId).single();
        if (ticketError) throw ticketError;
        setTicket(ticketData as Ticket);

        const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*, profiles(name)').eq('ticket_id', ticketId).order('timestamp', { ascending: true });
        if (messagesError) throw messagesError;
        setMessages(messagesData as Message[]);
    }, [ticketId]);

    useEffect(() => {
        fetchTicketDetails();
    }, [fetchTicketDetails]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !ticket) return;
        const { error } = await supabase.from('messages').insert({ ticket_id: ticket.id, sender_id: user.id, content: newMessage });
        if (!error) {
            setNewMessage('');
            await fetchTicketDetails();
            onSuccess();
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(!ticket) return;
        const newStatus = e.target.value as TicketStatus;
        await supabase.from('tickets').update({ status: newStatus }).eq('id', ticket.id);
        await fetchTicketDetails();
        onSuccess();
    };

    if (!ticket) return <div>Carregando...</div>;

    return (
        <div>
            <button onClick={onBack} className="text-elevva-blue hover:underline mb-4">&larr; Voltar para Chamados</button>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{ticket.subject}</h1>
                        <p className="text-sm text-gray-500">Cliente: {ticket.profiles.name}</p>
                    </div>
                    <div>
                        {user?.role === UserRole.ADMIN ? (
                             <Select value={ticket.status} onChange={handleStatusChange}> {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)} </Select>
                        ) : ( <StatusBadge status={ticket.status} colors={ticketStatusColors} /> )}
                    </div>
                </div>
                <div className="mt-6 border-t pt-6 h-96 overflow-y-auto bg-gray-50 p-4 rounded-md flex flex-col space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-lg ${msg.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="font-bold text-sm">{msg.profiles.name}</p>
                                <p>{msg.content}</p>
                                <p className="text-xs text-right opacity-75 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 border-t pt-4">
                    <Textarea rows={3} value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Digite sua mensagem..." disabled={ticket.status === TicketStatus.CLOSED && user?.role === UserRole.CUSTOMER}/>
                    <div className="text-right mt-2"> <Button onClick={handleSendMessage} disabled={ticket.status === TicketStatus.CLOSED && user?.role === UserRole.CUSTOMER}>Enviar Mensagem</Button> </div>
                </div>
            </Card>
        </div>
    );
};

const QuotesView: React.FC<{ quotes: Quote[], onQuoteSelect: (id: string) => void, onNewQuote: () => void }> = ({ quotes, onQuoteSelect, onNewQuote }) => {
    const { user } = useAuth();
    return (
        <Card className="!p-0">
            <div className="flex justify-between items-center p-6"> <h1 className="text-2xl font-bold text-gray-800">Orçamentos</h1> {user?.role === UserRole.ADMIN && <Button onClick={onNewQuote}>Criar Orçamento</Button>} </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {user?.role === UserRole.ADMIN && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {quotes.map(quote => (
                            <tr key={quote.id}>
                                {user?.role === UserRole.ADMIN && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.profiles.name}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`R$ ${quote.value.toFixed(2)}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={quote.status} colors={quoteStatusColors} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(quote.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> <button onClick={() => onQuoteSelect(quote.id)} className="text-elevva-blue hover:underline">Ver Detalhes</button> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const QuoteDetailView: React.FC<{ quoteId: string; onBack: () => void; onSuccess: () => void; }> = ({ quoteId, onBack, onSuccess }) => {
    const { user } = useAuth();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const fetchQuote = useCallback(async () => {
        const { data } = await supabase.from('quotes').select('*, profiles(name)').eq('id', quoteId).single();
        setQuote(data as Quote);
    }, [quoteId]);

    useEffect(() => { fetchQuote(); }, [fetchQuote]);
    
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!quote) return;
        const newStatus = e.target.value as QuoteStatus;
        await supabase.from('quotes').update({ status: newStatus }).eq('id', quote.id);
        fetchQuote();
        onSuccess();
    };

    const handleEditSuccess = () => { fetchQuote(); onSuccess(); setEditModalOpen(false); }

    if (!quote) return <div>Carregando...</div>;

    return (
        <div>
            <button onClick={onBack} className="text-elevva-blue hover:underline mb-4">&larr; Voltar para Orçamentos</button>
            <Card>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{quote.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">Cliente: {quote.profiles.name}</p>
                        <p className="text-2xl font-bold text-elevva-blue mt-2">{`R$ ${quote.value.toFixed(2)}`}</p>
                    </div>
                    <div className="text-right">
                         {user?.role === UserRole.ADMIN ? (
                             <Select value={quote.status} onChange={handleStatusChange}> {Object.values(QuoteStatus).map(s => <option key={s} value={s}>{s}</option>)} </Select>
                        ) : ( <StatusBadge status={quote.status} colors={quoteStatusColors} /> )}
                        <p className="text-xs text-gray-400 mt-1">Criado em: {new Date(quote.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                {user?.role === UserRole.ADMIN && ( <div className="text-right mt-4"> <Button onClick={() => setEditModalOpen(true)}>Editar Orçamento</Button> </div> )}
                <div className="mt-6 border-t pt-6 space-y-4">
                    <div> <h3 className="font-semibold text-gray-700">Detalhes do Serviço</h3> <p className="text-gray-600 whitespace-pre-wrap">{quote.details || 'Nenhum detalhe fornecido.'}</p> </div>
                    {quote.observation && ( <div> <h3 className="font-semibold text-gray-700">Observações</h3> <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{quote.observation}</p> </div> )}
                </div>
            </Card>
            {user?.role === UserRole.ADMIN && quote && <EditQuoteModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} quote={quote} onSuccess={handleEditSuccess} />}
        </div>
    );
};

const ServicesView: React.FC<{ services: Service[], onServiceSelect: (id: string) => void; onNewService: () => void }> = ({ services, onServiceSelect, onNewService }) => {
    const { user } = useAuth();
    return (
        <Card className="!p-0">
             <div className="flex justify-between items-center p-6"> <h1 className="text-2xl font-bold text-gray-800">Serviços Contratados</h1> {user?.role === UserRole.ADMIN && <Button onClick={onNewService}>Criar Serviço</Button>} </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {user?.role === UserRole.ADMIN && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map(service => (
                            <tr key={service.id}>
                                {user?.role === UserRole.ADMIN && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.profiles.name}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={service.status} colors={serviceStatusColors} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(service.start_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> <button onClick={() => onServiceSelect(service.id)} className="text-elevva-blue hover:underline">Ver Detalhes</button> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const ServiceDetailView: React.FC<{ serviceId: string; onBack: () => void; onSuccess: () => void; }> = ({ serviceId, onBack, onSuccess }) => {
    const { user } = useAuth();
    const [service, setService] = useState<Service | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const fetchService = useCallback(async () => {
        const { data } = await supabase.from('services').select('*, profiles(name)').eq('id', serviceId).single();
        setService(data as Service);
    }, [serviceId]);

    useEffect(() => { fetchService(); }, [fetchService]);
    
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!service) return;
        const newStatus = e.target.value as ServiceStatus;
        await supabase.from('services').update({ status: newStatus }).eq('id', service.id);
        fetchService();
        onSuccess();
    };

    const handleEditSuccess = () => { fetchService(); onSuccess(); setEditModalOpen(false); }

    if (!service) return <div>Carregando...</div>;

    return (
        <div>
            <button onClick={onBack} className="text-elevva-blue hover:underline mb-4">&larr; Voltar para Serviços</button>
            <Card>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{service.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">Cliente: {service.profiles.name}</p>
                    </div>
                    <div className="text-right">
                         {user?.role === UserRole.ADMIN ? (
                             <Select value={service.status} onChange={handleStatusChange}> {Object.values(ServiceStatus).map(s => <option key={s} value={s}>{s}</option>)} </Select>
                        ) : ( <StatusBadge status={service.status} colors={serviceStatusColors} /> )}
                        <p className="text-xs text-gray-400 mt-1">Início em: {new Date(service.start_date).toLocaleDateString()}</p>
                    </div>
                </div>
                {user?.role === UserRole.ADMIN && ( <div className="text-right mt-4"> <Button onClick={() => setEditModalOpen(true)}>Editar Serviço</Button> </div> )}
                <div className="mt-6 border-t pt-6 space-y-4">
                    <div> <h3 className="font-semibold text-gray-700">Descrição do Serviço</h3> <p className="text-gray-600 whitespace-pre-wrap">{service.description || 'Nenhuma descrição fornecida.'}</p> </div>
                    {service.observation && ( <div> <h3 className="font-semibold text-gray-700">Observações</h3> <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{service.observation}</p> </div> )}
                </div>
            </Card>
            {user?.role === UserRole.ADMIN && service && <EditServiceModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} service={service} onSuccess={handleEditSuccess} />}
        </div>
    );
};

const ClientsView: React.FC<{ clients: User[] }> = ({ clients }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = useMemo(() => clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()) ), [clients, searchTerm]);
    return (
        <Card>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Clientes</h1>
            <Input placeholder="Buscar por nome ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mb-4" />
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th> </tr> </thead>
                    <tbody className="bg-white divide-y divide-gray-200"> {filteredClients.map(client => ( <tr key={client.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td></tr> ))} </tbody>
                </table>
            </div>
        </Card>
    );
};

const EmployeesView: React.FC = () => { return (<Card><h1 className="text-2xl font-bold text-gray-800">Gerenciar Funcionários</h1><p className="mt-4">Funcionalidade de convite e gerenciamento de funcionários será implementada aqui, conectando-se a um backend real para enviar emails e gerenciar permissões.</p></Card>);};

interface CreationModalProps { isOpen: boolean; onClose: () => void; clients: User[]; onSuccess: () => void; }

const NewTicketModal: React.FC<CreationModalProps> = ({ isOpen, onClose, clients, onSuccess }) => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
    useEffect(() => { if (clients.length > 0 && !selectedClientId) setSelectedClientId(clients[0].id); }, [clients, selectedClientId]);

    const handleSubmit = async () => {
        const clientId = user?.role === UserRole.ADMIN ? selectedClientId : user?.id;
        if (!subject.trim() || !content.trim() || !user || !clientId) return;

        const { data: newTicket, error: ticketError } = await supabase.from('tickets').insert({ client_id: clientId, subject: subject, status: TicketStatus.OPEN }).select().single();
        if (ticketError) { console.error(ticketError); return; }

        const { error: messageError } = await supabase.from('messages').insert({ ticket_id: newTicket.id, sender_id: user.id, content: content });
        if (messageError) { console.error(messageError); return; }
        
        setSubject(''); setContent('');
        onSuccess();
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Abrir Novo Chamado">
            <div className="space-y-4">
                {user?.role === UserRole.ADMIN && ( <div><label>Cliente</label><Select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div> )}
                <Input placeholder="Assunto do chamado" value={subject} onChange={e => setSubject(e.target.value)} />
                <Textarea placeholder="Descreva o problema ou dúvida..." rows={6} value={content} onChange={e => setContent(e.target.value)} />
                <div className="text-right"><Button onClick={handleSubmit}>Enviar Chamado</Button></div>
            </div>
        </Modal>
    );
};

const NewQuoteModal: React.FC<CreationModalProps> = ({ isOpen, onClose, clients, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [value, setValue] = useState('');
    const [observation, setObservation] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
    useEffect(() => { if (clients.length > 0 && !selectedClientId) setSelectedClientId(clients[0].id); }, [clients, selectedClientId]);

    const handleSubmit = async () => {
        if (!title.trim() || !selectedClientId || !value) return;
        await supabase.from('quotes').insert({ client_id: selectedClientId, title, details, value: parseFloat(value), status: QuoteStatus.PENDING, observation });
        setTitle(''); setDetails(''); setValue(''); setObservation('');
        onSuccess();
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Orçamento">
            <div className="space-y-4">
                <div><label>Cliente</label><Select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
                <Input placeholder="Título do Orçamento" value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder="Detalhes do serviço" value={details} onChange={e => setDetails(e.target.value)} rows={4} />
                <Input type="number" placeholder="Valor (ex: 799.90)" value={value} onChange={e => setValue(e.target.value)} />
                <Textarea placeholder="Observações (opcional)" value={observation} onChange={e => setObservation(e.target.value)} rows={2} />
                <div className="text-right"><Button onClick={handleSubmit}>Criar Orçamento</Button></div>
            </div>
        </Modal>
    )
};

const EditQuoteModal: React.FC<{isOpen: boolean; onClose: () => void; quote: Quote; onSuccess: () => void;}> = ({ isOpen, onClose, quote, onSuccess }) => {
    const [formData, setFormData] = useState(quote);
    useEffect(() => { setFormData(quote); }, [quote]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'value' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async () => {
        const { profiles, ...updateData } = formData; // Exclude joined data
        await supabase.from('quotes').update(updateData).eq('id', quote.id);
        onSuccess();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Orçamento">
            <div className="space-y-4">
                <Input name="title" placeholder="Título do Orçamento" value={formData.title} onChange={handleChange} />
                <Textarea name="details" placeholder="Detalhes do serviço" value={formData.details} onChange={handleChange} rows={4} />
                <Input name="value" type="number" placeholder="Valor (ex: 799.90)" value={formData.value} onChange={handleChange} />
                <Textarea name="observation" placeholder="Observações (opcional)" value={formData.observation || ''} onChange={handleChange} rows={2} />
                <div className="text-right"><Button onClick={handleSubmit}>Salvar Alterações</Button></div>
            </div>
        </Modal>
    );
};

const NewServiceModal: React.FC<CreationModalProps> = ({ isOpen, onClose, clients, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
    useEffect(() => { if (clients.length > 0 && !selectedClientId) setSelectedClientId(clients[0].id); }, [clients, selectedClientId]);
    
    const handleSubmit = async () => {
        if(!title.trim() || !selectedClientId) return;
        await supabase.from('services').insert({ client_id: selectedClientId, title, description, status: ServiceStatus.NOT_STARTED, start_date: startDate });
        setTitle(''); setDescription('');
        onSuccess();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Serviço">
             <div className="space-y-4">
                <div><label>Cliente</label><Select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
                <Input placeholder="Título do Serviço" value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder="Descrição do serviço" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                <div><label>Data de Início</label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div className="text-right"><Button onClick={handleSubmit}>Criar Serviço</Button></div>
            </div>
        </Modal>
    );
};

const EditServiceModal: React.FC<{isOpen: boolean; onClose: () => void; service: Service; onSuccess: () => void;}> = ({ isOpen, onClose, service, onSuccess }) => {
    const [formData, setFormData] = useState(service);
    useEffect(() => { setFormData(service); }, [service]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { profiles, ...updateData } = formData; // Exclude joined data
        await supabase.from('services').update(updateData).eq('id', service.id);
        onSuccess();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Serviço">
            <div className="space-y-4">
                <Input name="title" placeholder="Título do Serviço" value={formData.title} onChange={handleChange} />
                <Textarea name="description" placeholder="Descrição do serviço" value={formData.description} onChange={handleChange} rows={4} />
                <Textarea name="observation" placeholder="Observações (opcional)" value={formData.observation || ''} onChange={handleChange} rows={2} />
                <div className="text-right"><Button onClick={handleSubmit}>Salvar Alterações</Button></div>
            </div>
        </Modal>
    );
};

export default DashboardPage;