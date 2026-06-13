import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SubtasksList({ subtasks = [], onChange }) {
  const [newSubtask, setNewSubtask] = useState("");

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const updated = [
      ...(subtasks || []),
      {
        id: `subtask-${Date.now()}`,
        title: newSubtask,
        completed: false
      }
    ];
    onChange(updated);
    setNewSubtask("");
  };

  const toggleSubtask = (id) => {
    const updated = subtasks.map(st =>
      st.id === id ? { ...st, completed: !st.completed } : st
    );
    onChange(updated);
  };

  const deleteSubtask = (id) => {
    onChange(subtasks.filter(st => st.id !== id));
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-700">Subtasks</h4>
        {subtasks.length > 0 && (
          <span className="text-xs text-slate-500">
            {completedCount} of {subtasks.length} completed
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <Progress value={progress} className="h-2" />
      )}

      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 group">
            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => toggleSubtask(subtask.id)}
            />
            <span className={`flex-1 text-sm ${subtask.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteSubtask(subtask.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a subtask..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addSubtask()}
          className="text-sm"
        />
        <Button onClick={addSubtask} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}