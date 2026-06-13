import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

export default function TaskSummary({ tasks, isLoading, onSelectTask }) {
  const getRecentTasks = () => {
    return tasks
      .filter(task => task.status !== "completed")
      .sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      })
      .slice(0, 5);
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800 animate-pulse"
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Clock className="w-5 h-5 text-blue-600" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : getRecentTasks().length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-slate-500">All caught up! No pending tasks.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {getRecentTasks().map(task => {
              const isOverdue = task.due_date && isPast(new Date(task.due_date));
              const isDueToday = task.due_date && isToday(new Date(task.due_date));
              
              return (
                <div 
                  key={task.id} 
                  onClick={() => onSelectTask?.(task)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    isOverdue ? "border-red-200 bg-red-50" : 
                    isDueToday ? "border-yellow-200 bg-yellow-50" : "border-slate-200 bg-white"
                  }`}
                >
                  {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {isDueToday && <Clock className="w-4 h-4 text-yellow-600" />}
                  {!isOverdue && !isDueToday && <div className="w-4 h-4 bg-slate-200 rounded-full" />}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={priorityColors[task.priority]} variant="secondary">
                        {task.priority}
                      </Badge>
                      {task.due_date && (
                        <span className={`text-xs ${
                          isOverdue ? "text-red-600 font-medium" : 
                          isDueToday ? "text-yellow-700 font-medium" : "text-slate-500"
                        }`}>
                          {isOverdue ? "Overdue" : isDueToday ? "Due today" : format(new Date(task.due_date), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}