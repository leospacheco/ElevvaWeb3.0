export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

// Represents the combined user data from Supabase auth and the profiles table
export interface User {
  id: string; // from auth.users.id
  name: string; // from profiles.name
  email: string; // from auth.users.email
  role: UserRole; // from profiles.role
}

export enum TicketStatus {
  OPEN = 'Aberto',
  IN_PROGRESS = 'Em Andamento',
  CLOSED = 'Fechado',
}

export interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  profiles: { name: string }; // Joined sender name
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  client_id: string;
  profiles: { name: string }; // Joined client name
  subject: string;
  status: TicketStatus;
  created_at: string;
}

export enum QuoteStatus {
  PENDING = 'Pendente',
  SENT = 'Enviado',
  APPROVED = 'Aprovado',
  REJECTED = 'Rejeitado',
}

export interface Quote {
  id: string;
  client_id: string;
  profiles: { name: string }; // Joined client name
  title: string;
  details: string;
  value: number;
  status: QuoteStatus;
  created_at: string;
  observation?: string;
}

export enum ServiceStatus {
  NOT_STARTED = 'Não Iniciado',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Concluído',
  ON_HOLD = 'Em Espera',
}

export interface Service {
  id: string;
  client_id: string;
  profiles: { name: string }; // Joined client name
  title: string;
  description: string;
  status: ServiceStatus;
  start_date: string;
  end_date?: string;
  observation?: string;
}
