import { API_URL } from "@/lib/config";
import type { Appointment } from "@/types/appointment";

export const getMyAppointments = async (
  token: string,
): Promise<Appointment[]> => {
  const response = await fetch(`${API_URL}/my-appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as Appointment[];
  return data;
};
