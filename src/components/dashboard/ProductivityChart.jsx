import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

export default function ProductivityChart({ tasks }) {
  const getChartData = () => {
    const categories = {};
    tasks.forEach(task => {
      const category = task.category || "uncategorized";
      if (!categories[category]) {
        categories[category] = { total: 0, completed: 0 };
      }
      categories[category].total++;
      if (task.status === "completed") {
        categories[category].completed++;
      }
    });

    return Object.entries(categories).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      completed: data.completed,
      pending: data.total - data.completed,
      total: data.total
    }));
  };

  const chartData = getChartData();
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Tasks by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No data available yet</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Bar 
                  dataKey="completed" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
                <Bar 
                  dataKey="pending" 
                  fill="#E5E7EB" 
                  radius={[4, 4, 0, 0]}
                  name="Pending"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}