export type ServicePriceMap = Record<string, number>;

export type Service = {
  id: number;
  nom: string;
  description: string | null;
  prices: ServicePriceMap;
  dureeMinutes: number;
};

