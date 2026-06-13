import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import { useTasks } from "../components/hooks/useTasks";

export default function Calendar() {
  const { tasks: allTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const tasks = allTasks.filter(task => task.due_date);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => task.due_date && isSameDay(new Date(task.due_date), date));
  };

  const selectedTasks = getTasksForDate(selectedDate);

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Calendar</h1>
            <p className="text-slate-600">View your tasks by date</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    {format(currentMonth, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center font-medium text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth().map(day => {
                    const dayTasks = getTasksForDate(day);
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative p-3 text-center rounded-xl transition-all duration-200 hover:bg-blue-50 min-h-[60px] flex flex-col justify-between
                          ${isSelected ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : ""}
                          ${isCurrentDay && !isSelected ? "bg-blue-100 text-blue-800 font-semibold" : ""}
                          ${!isSameMonth(day, currentMonth) ? "text-slate-300" : "text-slate-700"}
                        `}
                      >
                        <span className="text-sm font-medium">{format(day, "d")}</span>
                        {dayTasks.length > 0 && (
                          <div className="flex justify-center">
                            <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-blue-600"}`} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Details */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Tasks for {format(selectedDate, "MMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No tasks scheduled for this day</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{task.title}</h4>
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-slate-600 text-sm mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Badge variant="outline">{task.category}</Badge>
                          {task.status === "completed" && (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}