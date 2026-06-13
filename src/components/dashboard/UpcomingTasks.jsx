import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";

export default function UpcomingTasks({ tasks, isLoading }) {
  const getProductivityMetrics = () => {
    const completed = tasks.filter(task => task.status === "completed").length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const highPriorityTasks = tasks.filter(task => 
      task.priority === "high" || task.priority === "urgent"
    );
    const completedHighPriority = highPriorityTasks.filter(task => 
      task.status === "completed"
    ).length;
    const highPriorityRate = highPriorityTasks.length > 0 ? 
      Math.round((completedHighPriority / highPriorityTasks.length) * 100) : 0;

    return {
      completionRate,
      highPriorityRate,
      totalTasks: total,
      completedTasks: completed
    };
  };

  const metrics = getProductivityMetrics();

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Target className="w-5 h-5 text-purple-600" />
          Productivity Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Overall Completion</span>
                <span className="text-sm font-bold text-slate-900">{metrics.completionRate}%</span>
              </div>
              <Progress 
                value={metrics.completionRate} 
                className="h-3"
              />
              <p className="text-xs text-slate-500">
                {metrics.completedTasks} of {metrics.totalTasks} tasks completed
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">High Priority Tasks</span>
                <span className="text-sm font-bold text-slate-900">{metrics.highPriorityRate}%</span>
              </div>
              <Progress 
                value={metrics.highPriorityRate} 
                className="h-3"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Productivity Tip</span>
              </div>
              <p className="text-xs text-slate-600">
                Focus on completing high-priority tasks first to maximize your impact!
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}