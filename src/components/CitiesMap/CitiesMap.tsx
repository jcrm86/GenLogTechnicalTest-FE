/// <reference types="google.maps" />
import { useEffect, useRef, useState } from 'react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import './CitiesMap.css';

interface CitiesMapProps {
  origin: string;
  destination: string;
  onRoutesChange?: (routes: Array<{ summary: string; distance: string; duration: string }>) => void;
}

function DirectionsRenderer({ origin, destination, onRoutesChange }: CitiesMapProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const renderersRef = useRef<google.maps.DirectionsRenderer[]>([]);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    const service = new routesLib.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: routesLib.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status !== 'OK' || !result) return;

        // Clear previous renderers
        renderersRef.current.forEach((r) => r.setMap(null));
        renderersRef.current = [];

        result.routes.forEach((_, index) => {
          const renderer = new routesLib.DirectionsRenderer({
            map,
            directions: result,
            routeIndex: index,
            suppressMarkers: index !== 0,
            polylineOptions: {
              strokeColor: index === 0 ? '#1a73e8' : '#9e9e9e',
              strokeWeight: index === 0 ? 5 : 3,
              strokeOpacity: index === 0 ? 1 : 0.6,
            },
          });
          renderersRef.current.push(renderer);
        });

        setRoutes(result.routes);
        onRoutesChange?.(result.routes.map((route) => ({
          summary: route.summary,
          distance: route.legs[0].distance?.text ?? '',
          duration: route.legs[0].duration?.text ?? '',
        })));
      }
    );

    return () => {
      renderersRef.current.forEach((r) => r.setMap(null));
      renderersRef.current = [];
      onRoutesChange?.([]);
    };
  }, [routesLib, map, origin, destination]);

  return (
    <>
      {routes.length > 0 && (
        <div className="cities-map__legend">
          <p className="cities-map__legend-title">Routes found: {routes.length}</p>
          {routes.map((route, index) => (
            <div key={index} className="cities-map__legend-item">
              <span
                className="cities-map__legend-color"
                style={{ backgroundColor: index === 0 ? '#1a73e8' : '#9e9e9e' }}
              />
              <span>
                {index === 0 ? 'Recommended' : `Alternative ${index}`} —{' '}
                {route.legs[0].distance?.text}, {route.legs[0].duration?.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function CitiesMap({ origin, destination, onRoutesChange }: CitiesMapProps) {
  return (
    <div className="cities-map">
      <Map
        style={{ width: '100%', height: '400px' }}
        defaultCenter={{ lat: 39.5, lng: -98.35 }}
        defaultZoom={4}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {origin && destination && (
          <DirectionsRenderer origin={origin} destination={destination} onRoutesChange={onRoutesChange} />
        )}
      </Map>
    </div>
  );
}
