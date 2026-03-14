export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "DONE";

export type AppointmentService = {
  id: number;
  nom: string;
  description: string;
  prices: Record<string, number>;
  dureeMinutes: number;
};

export type Appointment = {
  id: number;
  date: string;
  slot: string;
  gamme: string;
  prix: number;
  status: AppointmentStatus;
  service: AppointmentService;
};
