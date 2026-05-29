import { useMemo } from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getProjectTrafficHandler } from '../reqHandlers/project/getProjectTraffic.reqhandler';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-black p-2 shadow-xl">
        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-tighter">
          {payload[0].payload.day}
        </p>
        <p className="font-mono text-sm font-medium text-white">
          {payload[0].value.toLocaleString()} requests
        </p>

      </div>
    );
  }
  return null;
};

export function TrafficGraph() {
  const { id } = useParams<{ id: string }>();

  const { data: trafficData, isLoading } = useQuery({
    queryKey: ["project-traffic", id],
    queryFn: () => getProjectTrafficHandler(id!),
    enabled: !!id,
  });

  const totalTraffic = useMemo(() => trafficData?.reduce((a, b) => a + b.value, 0) || 0, [trafficData]);

  if (isLoading || !trafficData) {
    return (
      <div className="mt-12 h-[300px] flex items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm">
        <p className="font-mono text-xs text-neutral-500 animate-pulse">// loading_traffic_data...</p>
      </div>
    );
  }


  return (
    <div className="mt-12 rounded-xl ">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-mono text-sm text-neutral-500 tracking-widest">// traffic_activity</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-medium">{totalTraffic.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-tighter">requests</span>
          </div>

        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trafficData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>

            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#171717"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#525252', fontSize: 10, fontFamily: 'monospace' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#525252', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#262626', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              fillOpacity={1}

              fill="url(#colorValue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
