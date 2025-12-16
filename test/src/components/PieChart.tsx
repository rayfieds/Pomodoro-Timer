// src/components/PieChart.tsx
interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="pie-chart-empty" style={{ width: size, height: size }}>
        <div className="empty-circle" />
        <p>No data yet</p>
      </div>
    );
  }

  let currentAngle = -90; // Start from top
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="pie-chart-container">
      <svg width={size} height={size} viewBox="0 0 100 100" className="pie-chart">
        {segments.map((segment, index) => {
          const startAngle = (segment.startAngle * Math.PI) / 180;
          const endAngle = (segment.endAngle * Math.PI) / 180;
          
          const x1 = 50 + 50 * Math.cos(startAngle);
          const y1 = 50 + 50 * Math.sin(startAngle);
          const x2 = 50 + 50 * Math.cos(endAngle);
          const y2 = 50 + 50 * Math.sin(endAngle);
          
          const largeArc = segment.percentage > 50 ? 1 : 0;
          
          const path = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 50 50 0 ${largeArc} 1 ${x2} ${y2}`,
            `Z`,
          ].join(' ');

          return (
            <path
              key={index}
              d={path}
              fill={segment.color}
              className="pie-segment"
            >
              <title>{`${segment.label}: ${segment.value.toFixed(1)}h (${segment.percentage.toFixed(1)}%)`}</title>
            </path>
          );
        })}
      </svg>
      
      <div className="pie-legend">
        {segments.map((segment, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: segment.color }}
            />
            <span className="legend-label">{segment.label}</span>
            <span className="legend-value">
              {segment.value.toFixed(1)}h ({segment.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}