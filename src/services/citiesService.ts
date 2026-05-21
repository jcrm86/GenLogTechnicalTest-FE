export interface City {
  id: number;
  name: string;
}

export interface TruckAvailability {
  transport_company: string;
  trucks_per_day: number;
}

const BASE_URL = "https://genlogtechnicaltest-be-production.up.railway.app";

export const citiesService = {
  getCities: (): Promise<City[]> =>
    fetch(`${BASE_URL}/cities`).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json() as Promise<City[]>;
    }),

  getTrucks: (origin: string, destination: string): Promise<TruckAvailability[]> =>
    fetch(`${BASE_URL}/trucks/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json() as Promise<TruckAvailability[]>;
    }),
};
