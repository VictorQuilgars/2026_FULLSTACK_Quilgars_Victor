import type { AppointmentService, AppointmentReview, AppointmentStatus } from "./appointment";

export type AppointmentClient = {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  tel: string;
};

export type AppointmentStaffFull = {
  id: string;
  nom: string;
  prenom: string;
  role: string | null;
  email: string | null;
};

export type AdminAppointment = {
  id: number;
  date: string;
  slot: string;
  gamme: string;
  prix: number;
  status: AppointmentStatus;
  service: AppointmentService;
  review: AppointmentReview | null;
  client: AppointmentClient;
  staff: AppointmentStaffFull | null;
};
