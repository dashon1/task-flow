import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Play,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  Repeat
} from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskItem({ task, onStatusChange, onEdit, onDelete }) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200 animate-pulse"
  };

  const categoryColors = {
    work: "bg-indigo-100 text-indigo-800",
    personal: "bg-purple-100 text-purple-800",
    health: "bg-green-100 text-green-800",
    finance: "bg-emerald-100 text-emerald-800",
    learning: "bg-amber-100 text-amber-800",
    shopping: "bg-pink-100 text-pink-800",
    project: "bg-cyan-100 text-cyan-800"
  };

  const statusIcons = {
    todo: <Circle className="w-5 h-5 text-slate-400" />,
    in_progress: <Play className="w-5 h-5 text-blue-500" />,
    completed: <CheckCircle2 className="w-5 h-5 text-green-500" />
  };

  const getDateStatus = () => {
    if (!task.due_date) return null;
    
    const dueDate = new Date(task.due_date);
    if (isPast(dueDate) && task.status !== "completed") {
      return { label: "Overdue", color: "text-red-600", icon: AlertTriangle };
    }
    if (isToday(dueDate)) {
      return { label: "Due today", color: "text-yellow-600", icon: Clock };
    }
    if (isTomorrow(dueDate)) {
      return { label: "Due tomorrow", color: "text-blue-600", icon: Calendar };
    }
    return { label: format(dueDate, "MMM d"), color: "text-slate-500", icon: Calendar };
  };

  const dateStatus = getDateStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card className={`bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Status Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="mt-1 hover:opacity-70 transition-opacity">
                  {statusIcons[task.status]}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusChange(task, "todo")}>
                  <Circle className="w-4 h-4 mr-2 text-slate-400" />
                  Mark as Todo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task, "in_progress")}>
                  <Play className="w-4 h-4 mr-2 text-blue-500" />
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task, "completed")}>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  Mark as Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-semibold text-slate-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(task)}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(task.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="text-slate-600 mb-3 leading-relaxed">{task.description}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={priorityColors[task.priority]} variant="outline">
                  {task.priority}
                </Badge>
                
                <Badge className={categoryColors[task.category]} variant="secondary">
                  {task.category}
                </Badge>

                {task.is_recurring && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Repeat className="w-3 h-3 mr-1" />
                    {task.recurring_interval}
                  </Badge>
                )}

                {task.project && (
                  <Badge variant="outline" className="bg-slate-50 text-slate-700">
                    {task.project}
                  </Badge>
                )}
              </div>

              {/* Due Date and Duration */}
              <div className="flex items-center gap-4 text-sm">
                {dateStatus && (
                  <div className={`flex items-center gap-1 ${dateStatus.color}`}>
                    <dateStatus.icon className="w-4 h-4" />
                    <span className="font-medium">{dateStatus.label}</span>
                  </div>
                )}

                {task.estimated_duration && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimated_duration}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}