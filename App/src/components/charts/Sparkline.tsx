import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data?: any[];
  color?: string;
  height?: number;
}

export function Sparkline({ data = [], color = "hsl(var(--primary))", height = 30 }: SparklineProps) {
  const chartData = (data || []).map((v, i) => {
    let num = 0;
    if (typeof v === "number") {
      num = v;
    } else if (typeof v === "object" && v !== null) {
      num = v.value ?? v.spike ?? v.gpu_utilization_pct ?? v.avg_cpu_utilization_pct ?? 0;
    }
    return { v: num, i };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={chartData}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
