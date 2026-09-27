import { useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SourceReference } from "@/types";
import { Panel, DemoTag } from "./common";
import { SourceCitation } from "./SourceCitation";
import { Button } from "@/components/ui/button";

export const C = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const axis = { fontSize: 11, fill: "var(--muted-foreground)" } as const;
const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600 },
};

export function ChartCard({
  title,
  source,
  note,
  children,
  height = 260,
  className,
  dataRows,
}: {
  title: string;
  source: SourceReference;
  note?: string;
  children: ReactNode;
  height?: number;
  className?: string;
  dataRows?: Row[];
}) {
  const [showData, setShowData] = useState(false);
  const columns = dataRows?.length ? Object.keys(dataRows[0]).filter((key) => key !== "id") : [];
  return (
    <Panel
      className={className}
      title={title}
      action={<DemoTag label="Source-derived" />}
      bodyClassName="p-4"
    >
      <div style={{ height }}>{children}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        {note ? <span className="text-[11px] text-muted-foreground">{note}</span> : <span />}
        <div className="flex items-center gap-3">
          {dataRows && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              aria-expanded={showData}
              onClick={() => setShowData((v) => !v)}
            >
              {showData ? "Hide Data" : "View Data"}
            </Button>
          )}
          <SourceCitation source={source} variant="link">
            Source
          </SourceCitation>
        </div>
      </div>
      {showData && dataRows && (
        <div className="mt-3 max-h-64 overflow-auto rounded border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="border-b px-2.5 py-2 text-left font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {dataRows.map((row, index) => (
                <tr key={String(row.id ?? index)}>
                  {columns.map((column) => (
                    <td key={column} className="px-2.5 py-2 tabular">
                      {row[column] == null
                        ? "—"
                        : typeof row[column] === "number"
                          ? row[column]?.toLocaleString("en-IN")
                          : row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

type Row = Record<string, string | number | null | undefined>;
type Series = { key: string; name: string; dashed?: boolean };

export function SimpleBar({
  data,
  x,
  series,
  horizontal = false,
}: {
  data: Row[];
  x: string;
  series: Series[];
  horizontal?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ left: horizontal ? 20 : -10, right: 8, top: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={horizontal}
          horizontal={!horizontal}
        />
        {horizontal ? (
          <>
            <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey={x}
              tick={axis}
              axisLine={false}
              tickLine={false}
              width={90}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={x}
              tick={axis}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={data.length > 6 ? -30 : 0}
              textAnchor={data.length > 6 ? "end" : "middle"}
              height={data.length > 6 ? 50 : 30}
            />
            <YAxis tick={axis} axisLine={false} tickLine={false} />
          </>
        )}
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={C[i === 0 && series.length > 1 ? 1 : i === 1 ? 0 : i]}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            maxBarSize={36}
            animationDuration={700}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SimpleLine({ data, x, series }: { data: Row[]; x: string; series: Series[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -10, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={x} tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {series.map((s, i) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stroke={C[i]}
            strokeWidth={2.25}
            strokeDasharray={s.dashed ? "5 4" : undefined}
            dot={{ r: 3.5 }}
            connectNulls={false}
            animationDuration={800}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SimpleArea({ data, x, series }: { data: Row[]; x: string; series: Series[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -10, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={x} tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stroke={C[i]}
            fill={C[i]}
            fillOpacity={s.key === "total" ? 0.08 : 0.18}
            strokeWidth={2}
            strokeDasharray={s.dashed ? "5 4" : undefined}
            animationDuration={800}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
