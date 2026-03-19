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

export type AppointmentReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type AppointmentStaff = {
  id: string;
  nom: string;
  prenom: string;
  role: string | null;
};

export type Appointment = {
  id: number;
  date: string;
  slot: string;
  gamme: string;
  prix: number;
  status: AppointmentStatus;
  service: AppointmentService;
  review: AppointmentReview | null;
  staff: AppointmentStaff | null;
};
