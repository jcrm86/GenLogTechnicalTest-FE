const DIRECTIONS_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export interface RouteResult {
  summary: string;
  distance: string;
  duration: string;
}

interface DirectionsLeg {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
}

interface DirectionsRoute {
  summary: string;
  legs: DirectionsLeg[];
}

interface DirectionsResponse {
  routes: DirectionsRoute[];
  status: string;
}

export const directionsService = {
  getRoutes: async (origin: string, destination: string): Promise<RouteResult[]> => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

    const params = new URLSearchParams({
      origin,
      destination,
      alternatives: 'true',
      key: apiKey,
    });

    const response = await fetch(`${DIRECTIONS_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: DirectionsResponse = await response.json() as DirectionsResponse;

    if (data.status !== 'OK') {
      throw new Error(`Directions API error: ${data.status}`);
    }

    return data.routes.map((route) => ({
      summary: route.summary,
      distance: route.legs[0].distance.text,
      duration: route.legs[0].duration.text,
    }));
  },
};
