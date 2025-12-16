// src/components/BarChart.tsx
interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bar-chart" style={{ height: `${height}px` }}>
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="bar-container">
            <div className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#ba4949',
                }}
                title={`${item.label}: ${item.value.toFixed(1)}h`}
              >
                <span className="bar-value">{item.value.toFixed(1)}h</span>
              </div>
            </div>
            <div className="bar-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}