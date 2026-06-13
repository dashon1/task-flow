import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";

export default function FocusMode({ tasks, onTaskSelect, onClose }) {
  const urgentTasks = tasks.filter(
    task => 
      task.status !== "completed" && 
      (task.priority === "urgent" || task.priority === "high")
  ).sort((a, b) => {
    // Sort by due date, then priority
    if (a.due_date && b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return a.priority === "urgent" ? -1 : 1;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTask = urgentTasks[currentIndex];

  const handleNext = () => {
    if (currentIndex < urgentTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (urgentTasks.length === 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">All Caught Up! 🎉</h2>
            <p className="text-slate-600">No urgent tasks at the moment. Great work!</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Focus Mode</h2>
              <p className="text-sm text-slate-600">
                Task {currentIndex + 1} of {urgentTasks.length}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={
                    currentTask.priority === "urgent" 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-orange-500 text-white"
                  }>
                    {currentTask.priority}
                  </Badge>
                  <Badge variant="outline">{currentTask.category}</Badge>
                  {currentTask.due_date && (
                    <Badge 
                      variant="outline" 
                      className={isPast(new Date(currentTask.due_date)) ? "border-red-500 text-red-600" : ""}
                    >
                      {isPast(new Date(currentTask.due_date)) ? "OVERDUE: " : "Due: "}
                      {format(new Date(currentTask.due_date), "MMM d")}
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  {currentTask.title}
                </h3>
                
                {currentTask.description && (
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    {currentTask.description}
                  </p>
                )}

                {currentTask.subtasks && currentTask.subtasks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Subtasks:</h4>
                    <div className="space-y-2">
                      {currentTask.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2 p-2 bg-white rounded-lg"
                        >
                          <div className={`w-4 h-4 rounded border-2 ${
                            subtask.completed ? "bg-green-500 border-green-500" : "border-slate-300"
                          }`} />
                          <span className={subtask.completed ? "line-through text-slate-400" : ""}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentTask.estimated_duration && (
                  <div className="mt-6 p-4 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">
                      Estimated time: <span className="font-semibold">{currentTask.estimated_duration} minutes</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => onTaskSelect(currentTask)}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg py-6"
                >
                  Start Working on This
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === urgentTasks.length - 1}
            variant="outline"
          >
            Next →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}