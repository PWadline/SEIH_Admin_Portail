import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
];

const TransferByHospitalChart = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 8px 30px rgba(0,0,0,0.18)",
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 mb-6">
        <h2 className="text-xl font-bold dark:text-gray-800 text-white">
          Transferts par hôpital
        </h2>

        <p className="text-sm dark:text-gray-500 text-gray-300 mt-1">
          Répartition des transferts par institution
        </p>
      </div>

      <div className="relative z-10 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap={35}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#9CA3AF",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#9CA3AF",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(255,255,255,0.03)",
              }}
              contentStyle={{
                background:
                  "rgba(15,23,42,0.92)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                backdropFilter: "blur(10px)",
                color: "white",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.25)",
              }}
              labelStyle={{
                color: "#fff",
                fontWeight: 700,
              }}
              itemStyle={{
                color: "#fff",
                fontWeight: 500,
              }}
            />

            <Bar
              dataKey="value"
              radius={[14, 14, 0, 0]}
              onMouseEnter={(_, index) =>
                setHoveredIndex(index)
              }
              onMouseLeave={() =>
                setHoveredIndex(null)
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                  opacity={
                    hoveredIndex === null ||
                      hoveredIndex === index
                      ? 1
                      : 0.45
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TransferByHospitalChart;

