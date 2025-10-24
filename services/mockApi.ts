import { User, UserRole, Ticket, TicketStatus, Message, Quote, QuoteStatus, Service, ServiceStatus } from '../types';

export const mockUsers: User[] = [
  { id: 'admin-1', name: 'Admin Elevva', email: 'admin@elevva.com', role: UserRole.ADMIN },
  { id: 'customer-1', name: 'Cliente Exemplo', email: 'cliente@exemplo.com', role: UserRole.CUSTOMER },
  { id: 'customer-2', name: 'Empresa XYZ', email: 'contato@xyz.com', role: UserRole.CUSTOMER },
];

export let mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    // FIX: Changed clientId to client_id to match Ticket type.
    client_id: 'customer-1',
    // FIX: Changed clientName to profiles to match Ticket type.
    profiles: { name: 'Cliente Exemplo' },
    subject: 'Problema com o login no meu site',
    status: TicketStatus.OPEN,
    // FIX: Changed createdAt to created_at and converted to ISO string to match Ticket type.
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
   {
    id: 'ticket-2',
    // FIX: Changed clientId to client_id to match Ticket type.
    client_id: 'customer-2',
    // FIX: Changed clientName to profiles to match Ticket type.
    profiles: { name: 'Empresa XYZ' },
    subject: 'Site fora do ar',
    status: TicketStatus.IN_PROGRESS,
    // FIX: Changed createdAt to created_at and converted to ISO string to match Ticket type.
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// FIX: Added mockMessages array to separate messages from tickets, aligning with data model.
export let mockMessages: Message[] = [
    { id: 'msg-1', ticket_id: 'ticket-1', sender_id: 'customer-1', profiles: { name: 'Cliente Exemplo' }, content: 'Não consigo acessar meu painel administrativo.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-2', ticket_id: 'ticket-1', sender_id: 'admin-1', profiles: { name: 'Admin Elevva' }, content: 'Olá! Recebemos sua solicitação e já estamos verificando.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-3', ticket_id: 'ticket-2', sender_id: 'customer-2', profiles: { name: 'Empresa XYZ' }, content: 'Nosso site principal parece estar offline. Podem verificar por favor?', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export let mockQuotes: Quote[] = [
    // FIX: Corrected property names and date format to align with Quote type.
    { id: 'quote-1', client_id: 'customer-1', profiles: { name: 'Cliente Exemplo' }, title: 'Orçamento para E-commerce', details: 'Desenvolvimento de uma loja virtual completa com integração de pagamento.', value: 8500.00, status: QuoteStatus.SENT, created_at: new Date().toISOString(), observation: 'Orçamento válido por 15 dias.' },
];

export let mockServices: Service[] = [
    // FIX: Corrected property names and date format to align with Service type.
    { id: 'service-1', client_id: 'customer-2', profiles: { name: 'Empresa XYZ' }, title: 'Desenvolvimento de Web App', description: 'Criação de aplicativo web para gestão interna de clientes.', status: ServiceStatus.IN_PROGRESS, start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), observation: 'Fase de testes iniciais concluída.' },
];

// In a real app, these would be API calls.
// For this example, we just manipulate the mock data arrays.

export const api = {
    getTickets: async (userId: string, userRole: UserRole) => {
        if (userRole === UserRole.ADMIN) return mockTickets;
        // FIX: Property 'clientId' does not exist on type 'Ticket'. Did you mean 'client_id'?
        return mockTickets.filter(t => t.client_id === userId);
    },
    getTicketById: async (ticketId: string) => {
        return mockTickets.find(t => t.id === ticketId);
    },
    addMessageToTicket: async (ticketId: string, message: Message) => {
        const ticket = mockTickets.find(t => t.id === ticketId);
        if (ticket) {
            // FIX: Property 'messages' does not exist on type 'Ticket'. Pushing to mockMessages instead.
            mockMessages.push(message);
            // If customer sends a message, re-open the ticket if it was closed.
            // FIX: Property 'senderId' does not exist on type 'Message'. Did you mean 'sender_id'?
            if (message.sender_id !== 'admin-1' && ticket.status === TicketStatus.CLOSED) {
                ticket.status = TicketStatus.OPEN;
            }
        }
        return ticket;
    },
    updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
        const ticket = mockTickets.find(t => t.id === ticketId);
        if (ticket) {
            ticket.status = status;
        }
        return ticket;
    },
    // FIX: The Ticket type was updated but this function parameter was not.
    createTicket: async (ticket: Omit<Ticket, 'id' | 'created_at' | 'profiles'>) => {
        // FIX: Property 'clientId' does not exist on type. Did you mean 'client_id'?
        const client = mockUsers.find(u => u.id === ticket.client_id);
        const newTicket: Ticket = {
            ...ticket,
            id: `ticket-${Date.now()}`,
            // FIX: Object literal may only specify known properties, and 'clientName' does not exist in type 'Ticket'.
            profiles: { name: client?.name || 'Desconhecido' },
            created_at: new Date().toISOString(),
        };
        mockTickets.unshift(newTicket);
        return newTicket;
    },
    getClients: async () => {
        return mockUsers.filter(u => u.role === UserRole.CUSTOMER);
    },
    getQuotes: async (userId: string, userRole: UserRole) => {
        if (userRole === UserRole.ADMIN) return mockQuotes;
        // FIX: Property 'clientId' does not exist on type 'Quote'. Did you mean 'client_id'?
        return mockQuotes.filter(q => q.client_id === userId);
    },
    getQuoteById: async (quoteId: string) => {
        return mockQuotes.find(q => q.id === quoteId);
    },
    // FIX: The Quote type was updated but this function parameter was not.
    createQuote: async (quoteData: Omit<Quote, 'id'|'created_at'|'profiles'>) => {
        // FIX: Property 'clientId' does not exist on type. Did you mean 'client_id'?
        const client = mockUsers.find(u => u.id === quoteData.client_id);
        const newQuote: Quote = {
            ...quoteData,
            id: `quote-${Date.now()}`,
            // FIX: Object literal may only specify known properties, and 'clientName' does not exist in type 'Quote'.
            profiles: { name: client?.name || 'Desconhecido' },
            created_at: new Date().toISOString()
        };
        mockQuotes.push(newQuote);
        return newQuote;
    },
    updateQuote: async (quoteId: string, data: Partial<Quote>) => {
        mockQuotes = mockQuotes.map(q => q.id === quoteId ? { ...q, ...data } : q);
        return mockQuotes.find(q => q.id === quoteId);
    },
    getServices: async (userId: string, userRole: UserRole) => {
        if (userRole === UserRole.ADMIN) return mockServices;
        // FIX: Property 'clientId' does not exist on type 'Service'. Did you mean 'client_id'?
        return mockServices.filter(s => s.client_id === userId);
    },
    getServiceById: async (serviceId: string) => {
        return mockServices.find(s => s.id === serviceId);
    },
    // FIX: The Service type was updated but this function parameter was not.
    createService: async (serviceData: Omit<Service, 'id'|'profiles'>) => {
        // FIX: Property 'clientId' does not exist on type. Did you mean 'client_id'?
        const client = mockUsers.find(u => u.id === serviceData.client_id);
        const newService: Service = {
            ...serviceData,
            id: `service-${Date.now()}`,
            // FIX: Object literal may only specify known properties, and 'clientName' does not exist in type 'Service'.
            profiles: { name: client?.name || 'Desconhecido' }
        };
        mockServices.push(newService);
        return newService;
    },
    updateService: async (serviceId: string, data: Partial<Service>) => {
        mockServices = mockServices.map(s => s.id === serviceId ? { ...s, ...data } : s);
        return mockServices.find(s => s.id === serviceId);
    },
    inviteEmployee: async (email: string) => {
        // In a real app, this would send an invitation email.
        console.log(`Sending invitation to ${email}`);
        return { success: true };
    }
};