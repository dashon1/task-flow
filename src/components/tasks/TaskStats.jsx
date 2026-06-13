import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, Target } from "lucide-react";
import { isPast, isToday } from "date-fns";

export default function TaskStats({ tasks }) {
  const getStats = () => {
    const completed = tasks.filter(task => task.status === "completed").length;
    const pending = tasks.filter(task => task.status !== "completed").length;
    const overdue = tasks.filter(task => 
      task.due_date && 
      isPast(new Date(task.due_date)) && 
      task.status !== "completed"
    ).length;
    const dueToday = tasks.filter(task => 
      task.due_date && 
      isToday(new Date(task.due_date)) && 
      task.status !== "completed"
    ).length;

    return { completed, pending, overdue, dueToday };
  };

  const stats = getStats();

  const statItems = [
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Pending", 
      value: stats.pending,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Due Today",
      value: stats.dueToday,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-red-600", 
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat) => (
        <Card key={stat.label} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}