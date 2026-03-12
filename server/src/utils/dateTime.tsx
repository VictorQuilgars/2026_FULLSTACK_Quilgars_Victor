import { AppError } from "./appError";

const SLOT_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const parseSlotToMinutes = (slot: string) => {
  const match = SLOT_PATTERN.exec(slot);

  if (!match) {
    throw new AppError("Le slot doit respecter le format HH:mm.", 400);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours * 60 + minutes;
};

export const getAppointmentDate = (date: string) => {
  const appointmentDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(appointmentDate.getTime())) {
    throw new AppError("La date doit respecter le format YYYY-MM-DD.", 400);
  }

  return appointmentDate;
};

export const buildDateTimeFromSlot = (date: Date, slot: string) => {
  const [hours, minutes] = slot.split(":").map(Number);
  const dateTime = new Date(date);

  dateTime.setUTCHours(hours, minutes, 0, 0);

  return dateTime;
};

export const addMinutes = (value: Date, minutes: number) => {
  return new Date(value.getTime() + minutes * 60 * 1000);
};

export const slotsOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
) => {
  return startA < endB && startB < endA;
};
