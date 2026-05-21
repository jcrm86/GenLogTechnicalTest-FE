import './GeneralTable.css';

export interface CityRow {
  transport_company: string;
  trucks_per_day: number;
}

export interface DirectionRow {
  summary: string;
  distance: string;
  duration: string;
}

type TableRow = CityRow | DirectionRow;

interface GeneralTableProps {
  rows: TableRow[];
  columns: string[];
  headers: string[];
}

export function GeneralTable({ rows, columns, headers }: GeneralTableProps) {
  return (
    <div className="general-table-wrapper">
      <table className="general-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>
                    {(row as Record<string, unknown>)[col] as string}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="general-table__empty">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
