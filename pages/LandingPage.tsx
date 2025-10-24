
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo, FloatingWhatsAppButton } from '../components/ui';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const Header: React.FC = () => (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Logo />
            <div className="flex items-center space-x-4">
                <a href="#services" className="text-gray-600 hover:text-elevva-blue">Serviços</a>
                <a href="#contact" className="text-gray-600 hover:text-elevva-blue">Contato</a>
                <Link to="/login" className="bg-elevva-blue text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Área do Cliente
                </Link>
            </div>
        </nav>
    </header>
);

const Footer: React.FC = () => (
    <footer id="contact" className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
            <Logo className="h-16 justify-center" />
            <p className="mt-4 text-gray-400">Transformando ideias em realidade digital.</p>
            <div className="mt-6">
                <p><strong>Email:</strong> contato@elevvaweb.com</p>
                <p><strong>Telefone:</strong> (11) 99999-9999</p>
            </div>
        </div>
    </footer>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="bg-white text-center py-20 lg:py-32">
                    <div className="container mx-auto px-6">
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-800">
                            Criação de Sites e Web Apps <br /> que <span className="text-transparent bg-clip-text bg-gradient-to-r from-elevva-green to-elevva-blue">Elevam seu Negócio</span>.
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Nossos serviços são desenvolvidos com tecnologia de ponta para garantir que sua empresa atinja um próximo nível.
                        </p>
                        <a href="#services" className="mt-8 inline-block bg-elevva-blue text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">
                            Conheça Nossos Planos
                        </a>
                    </div>
                </section>

                {/* Services/Plans Section */}
                <section id="services" className="py-20 lg:py-28 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">Planos de Criação e Crescimento Digital</h2>
                            <p className="mt-2 text-gray-600">Soluções flexíveis para cada etapa do seu projeto.</p>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
                            
                            {/* Creation Plan Card */}
                            <div className="bg-white border-2 border-emerald-400 rounded-2xl shadow-xl p-8 flex flex-col w-full max-w-lg">
                                <h3 className="text-2xl font-bold text-center text-gray-800">1. Plano de Criação</h3>
                                <p className="text-center text-gray-500 mb-6">(Pagamento Único)</p>
                                
                                <div className="divide-y divide-gray-200">
                                    <div className="py-4 flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">Site Institucional (Padrão)</span>
                                        <span className="font-bold text-xl text-emerald-600">R$ 299,90</span>
                                    </div>
                                    <div className="py-4 flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">Aplicativo Web (Web App)</span>
                                        <span className="font-bold text-xl text-emerald-600">R$ 799,90</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex-grow">
                                    <h4 className="font-bold text-gray-700 mb-2">O que inclui:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Design Moderno e Responsivo</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Hospedagem (1 ano inclusivo)</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Funcionalidade Customizada</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> SEO Básico</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Domínio incluso (seudominio.com)</li>
                                    </ul>
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <h4 className="font-bold text-gray-700 mb-2">Condições de Pagamento:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                        <li>Em até 10x de R$29,99 (sem juros)</li>
                                        <li>Pix</li>
                                        <li>Boleto Bancário</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Maintenance Plan Card */}
                             <div className="bg-white border rounded-2xl shadow-lg p-8 flex flex-col w-full max-w-lg">
                                <h3 className="text-2xl font-bold text-center text-gray-800">2. Plano de Manutenção e Suporte</h3>
                                <p className="text-center text-gray-500 mb-6">(Mensal Opcional)</p>
                                
                                <div className="bg-blue-50 p-4 rounded-lg text-center mb-6">
                                    <p className="font-semibold text-blue-800">Elevva Suporte Pro</p>
                                    <p className="font-bold text-3xl text-elevva-blue">R$ 97,00<span className="text-lg">/mês</span></p>
                                </div>
                                
                                <div className="mt-6 flex-grow">
                                    <h4 className="font-bold text-gray-700 mb-2">O que inclui:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Backups diários de banco de dados</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Monitoração de Cadastro e Login</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Atualização de segurança</li>
                                        <li className="flex items-center text-gray-600"><CheckIcon /> Suporte de velocidade</li>
                                    </ul>
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <h4 className="font-bold text-gray-700 mb-2">Benefícios Exclusivos:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                        <li>Desconto de 15% em novos projetos</li>
                                        <li>Prioridade no atendimento</li>
                                        <li>Suporte 24h</li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <FloatingWhatsAppButton />
        </div>
    );
};

export default LandingPage;
