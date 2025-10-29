import Svg, { G, Path } from "react-native-svg";

interface PieChartDatum {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieChartDatum[];
  size?: number;
  innerRadius?: number;
}

export const PieChart = ({ data, size = 220, innerRadius = 0 }: PieChartProps) => {
  const radius = size / 2;
  const total = data.reduce((sum, item) => sum + Math.max(item.value, 0), 0);

  if (total <= 0) {
    return (
      <Svg width={size} height={size}>
        <Path
          d={describeArc(radius, radius, radius, 0, 360)}
          fill="#E0E0E0"
        />
      </Svg>
    );
  }

  let currentAngle = 0;
  const segments = data
    .filter((item) => item.value > 0)
    .map((item) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      return { ...item, startAngle, endAngle };
    });

  return (
    <Svg width={size} height={size}>
      <G>
        {segments.map((segment) => (
          <Path
            key={segment.label}
            d={describeSector(radius, radius, radius, innerRadius, segment.startAngle, segment.endAngle)}
            fill={segment.color}
          />
        ))}
      </G>
      {innerRadius > 0 ? (
        <Path
          d={describeArc(radius, radius, innerRadius, 0, 360)}
          fill="#FFFFFF"
        />
      ) : null}
    </Svg>
  );
};

const describeSector = (
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string => {
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  if (innerRadius <= 0) {
    return [
      `M ${centerX} ${centerY}`,
      `L ${outerEnd.x} ${outerEnd.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerStart.x} ${outerStart.y}`,
      "Z"
    ].join(" ");
  }

  const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);

  return [
    `M ${outerEnd.x} ${outerEnd.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerStart.x} ${outerStart.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
};

const describeArc = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};
