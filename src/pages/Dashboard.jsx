import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  Calendar,
  Flame,
  Zap
} from "lucide-react";
import { isToday, isPast, isThisWeek } from "date-fns";
import { useTasks } from "../components/hooks/useTasks";
import { useAuth } from "../components/hooks/useAuth";
import { useKeyboardShortcuts } from "../components/hooks/useKeyboardShortcuts";

import StatsCard from "../components/dashboard/StatsCard";
import TaskSummary from "../components/dashboard/TaskSummary";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import PomodoroTimer from "../components/features/PomodoroTimer";
import NotificationScheduler from "../components/features/NotificationScheduler";

export default function Dashboard() {
  const { tasks, isLoading, updateTask } = useTasks();
  const { user } = useAuth();
  const [focusedTask, setFocusedTask] = useState(null);

  useKeyboardShortcuts([
    { key: "d", action: () => {} }, // Already on dashboard
    { key: "t", action: () => window.location.href = createPageUrl("Tasks") },
    { key: "c", action: () => window.location.href = createPageUrl("Calendar") },
  ]);

  const getTaskStats = useMemo(() => {
    const completed = tasks.filter(task => task.status === "completed").length;
    const completedToday = tasks.filter(task => 
      task.status === "completed" && 
      task.completed_at &&
      isToday(new Date(task.completed_at))
    ).length;
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
    const thisWeek = tasks.filter(task => 
      task.due_date && 
      isThisWeek(new Date(task.due_date)) && 
      task.status !== "completed"
    ).length;
    
    return { completed, completedToday, overdue, dueToday, thisWeek, total: tasks.length };
  }, [tasks]);

  const stats = getTaskStats;

  const handlePomodoroComplete = async (taskId) => {
    if (!taskId) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await updateTask.mutateAsync({
      id: taskId,
      data: {
        pomodoro_sessions: (task.pomodoro_sessions || 0) + 1,
        actual_duration: (task.actual_duration || 0) + 25
      }
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 min-h-screen transition-colors duration-300">
      <NotificationScheduler tasks={tasks} user={user} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {getGreeting()}, {user?.full_name?.split(" ")[0] || "there"}! 🌟
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Ready to make today productive? You have {stats.dueToday} tasks due today.
            </p>
          </div>
          <Link to={createPageUrl("Tasks")}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Completed Today"
            value={stats.completedToday}
            icon={CheckCircle2}
            gradient="from-green-500 to-emerald-600"
            bgGradient="from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          />
          <StatsCard
            title="Due Today"
            value={stats.dueToday}
            icon={Clock}
            gradient="from-blue-500 to-cyan-600"
            bgGradient="from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            gradient="from-red-500 to-rose-600"
            bgGradient="from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"
          />
          <StatsCard
            title="This Week"
            value={stats.thisWeek}
            icon={Calendar}
            gradient="from-purple-500 to-violet-600"
            bgGradient="from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <TaskSummary tasks={tasks} isLoading={isLoading} onSelectTask={setFocusedTask} />
            <UpcomingTasks tasks={tasks} isLoading={isLoading} />
          </div>

          {/* Right Column - Tools & Analytics */}
          <div className="space-y-6">
            <PomodoroTimer 
              task={focusedTask} 
              onSessionComplete={handlePomodoroComplete}
            />
            
            <ProductivityChart tasks={tasks} />
            
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl("Tasks")}>
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Task
                  </Button>
                </Link>
                <Link to={createPageUrl("Calendar")}>
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link to={createPageUrl("Analytics")}>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <Card className="bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Flame className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Keep Going!</h3>
                </div>
                <p className="text-orange-100">
                  You've completed {Math.round((stats.completed / stats.total) * 100) || 0}% of your tasks. 
                  Every completed task brings you closer to your goals!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}