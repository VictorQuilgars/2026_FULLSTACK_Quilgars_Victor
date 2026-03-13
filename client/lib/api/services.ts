import { API_URL } from "@/lib/config";
import type { Service } from "@/types/service";

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${API_URL}/services`, {
    // Always revalidate in the background so marketing pages stay fresh
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les services.");
  }

  const data = (await response.json()) as Service[];
  return data;
};

