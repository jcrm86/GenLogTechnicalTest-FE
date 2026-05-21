import { useState, useEffect } from 'react';
import { CitiesMap } from '../../components/CitiesMap';
import { GeneralTable, type CityRow, type DirectionRow } from '../../components/GeneralTable';
import { DropdownList, type DropdownOption } from '../../components/DropdownList';
import { citiesService } from '../../services/citiesService';
import type { City } from '../../services/citiesService';
import './CitiesView.css';

export function CitiesView() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [truckRows, setTruckRows] = useState<CityRow[]>([]);
  const [directionRows, setDirectionRows] = useState<DirectionRow[]>([]);

  useEffect(() => {
    citiesService.getCities().then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (origin && destination) {
      citiesService
        .getTrucks(origin, destination)
        .then(setTruckRows)
        .catch(console.error);
    } else {
      setTruckRows([]);
      setDirectionRows([]);
    }
  }, [origin, destination]);

  const cityOptions: DropdownOption[] = cities.map((c: City) => ({
    value: c.name,
    label: c.name,
  }));

  function handleSearch() {
    setOrigin(selectedOrigin);
    setDestination(selectedDestination);
  }

  return (
    <div className="cities-view">
      <div className="cities-view__map-section">
        <h2 className="cities-view__map-title">Route Between Cities</h2>
        <div className="cities-view__map-selectors">
          <DropdownList
            label="Origin"
            options={cityOptions}
            value={selectedOrigin}
            onChange={setSelectedOrigin}
            placeholder="Select origin city…"
          />
          <DropdownList
            label="Destination"
            options={cityOptions}
            value={selectedDestination}
            onChange={setSelectedDestination}
            placeholder="Select destination city…"
          />
        </div>
        <button className="cities-view__search-btn" onClick={handleSearch}>
          Search
        </button>
        <CitiesMap origin={origin} destination={destination} onRoutesChange={setDirectionRows} />
        <GeneralTable
          rows={directionRows}
          columns={['summary', 'distance', 'duration']}
          headers={['Summary', 'Distance', 'Duration']}
        />
        <GeneralTable
          rows={truckRows}
          columns={['transport_company', 'trucks_per_day']}
          headers={['Transport Company', 'Trucks per Day']}
        />
      </div>
    </div>
  );
}
