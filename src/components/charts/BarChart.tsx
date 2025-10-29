import Svg, { G, Line, Rect, Text } from "react-native-svg";

interface BarChartDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartDatum[];
  width?: number;
  height?: number;
  barColor?: string;
}

export const BarChart = ({
  data,
  width = 320,
  height = 200,
  barColor = "#2F80ED"
}: BarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 0);
  const chartHeight = height - 24;
  const barWidth = data.length > 0 ? width / data.length - 8 : 0;

  return (
    <Svg width={width} height={height}>
      <Line x1={0} y1={chartHeight} x2={width} y2={chartHeight} stroke="#CCCCCC" strokeWidth={1} />
      <G>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * (chartHeight - 16) : 0;
          const x = index * (barWidth + 8) + 8;
          const y = chartHeight - barHeight;
          return (
            <G key={item.label}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                rx={4}
              />
              <Text
                x={x + barWidth / 2}
                y={chartHeight + 12}
                fill="#666666"
                fontSize={10}
                textAnchor="middle"
              >
                {item.label}
              </Text>
            </G>
          );
        })}
      </G>
    </Svg>
  );
};
