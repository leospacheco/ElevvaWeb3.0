
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#34D399', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#2DD4BF', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="logoGradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <path d="M18 14C18 18.4183 14.4183 22 10 22C5.58172 22 2 18.4183 2 14C2 9.58172 5.58172 6 10 6" stroke="url(#logoGradientBlue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 6L10 12L14 8" stroke="url(#logoGradientBlue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 6C10 3.79086 11.7909 2 14 2C16.2091 2 18 3.79086 18 6L22 6L18 2M18 10L14 6" stroke="url(#logoGradientGreen)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-3xl font-bold tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-elevva-green to-green-400">Elevva</span>
            <span className="text-gray-600">Web</span>
        </span>
    </div>
);

export const FloatingWhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/5511999999999" // Replace with your WhatsApp number
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-50 flex items-center justify-center"
    aria-label="Contact us on WhatsApp"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l-1.317 4.814 4.893-1.282zM9.062 8.609c-.161-.355-.322-.363-.466-.371-.144-.008-.306-.008-.466 0-.16.008-.427.06-.652.328-.225.268-.862.846-.862 2.062 0 1.217.882 2.384 1.002 2.545.12.16 1.733 2.786 4.223 3.73.593.225 1.054.363 1.414.466.524.152.993.129 1.362.078.427-.058 1.32-.542 1.508-1.063.188-.521.188-.973.129-1.063-.059-.09-.188-.152-.377-.268-.188-.117-1.109-.542-1.282-.619-.172-.078-.291-.117-.41.059-.119.176-.466.583-.571.702-.105.119-.21.137-.377.079-.168-.059-.702-.259-1.336-.813-.502-.451-.837-.813-.932-.973-.095-.16-.019-.248.059-.327.068-.078.152-.197.229-.292.078-.095.105-.152.152-.258.048-.105.028-.197-.03-.258-.059-.06-.522-1.258-.71-1.728z"/>
    </svg>
  </a>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: 'bg-elevva-blue text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elevva-blue ${className}`}
    {...props}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elevva-blue ${className}`}
    {...props}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => (
  <select
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elevva-blue bg-white ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
