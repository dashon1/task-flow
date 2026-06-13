import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "../components/hooks/useTasks";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar,
  Award,
  Zap
} from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";

export default function Analytics() {
  const { tasks, isLoading } = useTasks();

  const completionTrend = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date())
    });

    return last7Days.map(day => {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));

      const completed = tasks.filter(task => 
        task.completed_at &&
        isWithinInterval(parseISO(task.completed_at), { start: dayStart, end: dayEnd })
      ).length;

      const created = tasks.filter(task =>
        isWithinInterval(parseISO(task.created_date), { start: dayStart, end: dayEnd })
      ).length;

      return {
        day: format(day, "EEE"),
        completed,
        created
      };
    });
  }, [tasks]);

  const categoryDistribution = useMemo(() => {
    const categories = {};
    tasks.forEach(task => {
      const cat = task.category || "uncategorized";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [tasks]);

  const priorityStats = useMemo(() => {
    const priorities = { urgent: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach(task => {
      priorities[task.priority] = (priorities[task.priority] || 0) + 1;
    });

    return Object.entries(priorities).map(([priority, count]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count,
      completed: tasks.filter(t => t.priority === priority && t.status === "completed").length
    }));
  }, [tasks]);

  const productivityMetrics = useMemo(() => {
    const totalEstimated = tasks.reduce((sum, task) => sum + (task.estimated_duration || 0), 0);
    const totalActual = tasks.reduce((sum, task) => sum + (task.actual_duration || 0), 0);
    const avgCompletionTime = tasks.filter(t => t.actual_duration).length > 0
      ? totalActual / tasks.filter(t => t.actual_duration).length
      : 0;
    const pomodoroSessions = tasks.reduce((sum, task) => sum + (task.pomodoro_sessions || 0), 0);

    return {
      totalEstimated: Math.round(totalEstimated / 60), // hours
      totalActual: Math.round(totalActual / 60), // hours
      avgCompletionTime: Math.round(avgCompletionTime),
      pomodoroSessions
    };
  }, [tasks]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#EC4899'];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Deep insights into your productivity</p>
        </div>

        {/* Productivity Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {productivityMetrics.totalActual}h
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Time Spent</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {productivityMetrics.avgCompletionTime}m
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg. Completion Time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {productivityMetrics.pomodoroSessions}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pomodoro Sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100) || 0}%
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Completion Trend */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Weekly Completion Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="created" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Created"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Tasks by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Analysis */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Tasks by Priority Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" name="Total Tasks" />
                  <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}