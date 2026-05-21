import './CitiesTable.css';

export interface CityRow {
  transport_company: string;
  trucks_per_day: number;
}

interface CitiesTableProps {
  cities: CityRow[];
}

export function CitiesTable({ cities }: CitiesTableProps) {
  return (
    <div className="cities-table-wrapper">
      <table className="cities-table">
        <thead>
          <tr>
            <th>Transport Company</th>
            <th>Trucks per Day</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities.map((city, index) => (
              <tr key={`${city.transport_company}-${index}`}>
                <td>{city.transport_company}</td>
                <td>{city.trucks_per_day}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="cities-table__empty">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
