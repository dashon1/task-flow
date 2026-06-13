import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Briefcase, GraduationCap, Heart, ShoppingCart } from "lucide-react";

export default function TaskTemplates({ onSelectTemplate }) {
  const templates = [
    {
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
      name: "Work Project",
      template: {
        title: "New Work Project",
        category: "work",
        priority: "high",
        subtasks: [
          { id: "1", title: "Define project scope", completed: false },
          { id: "2", title: "Create timeline", completed: false },
          { id: "3", title: "Assign resources", completed: false },
          { id: "4", title: "Set milestones", completed: false },
        ],
        estimated_duration: 120,
      }
    },
    {
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
      name: "Learning Goal",
      template: {
        title: "New Learning Goal",
        category: "learning",
        priority: "medium",
        is_recurring: true,
        recurring_interval: "weekly",
        subtasks: [
          { id: "1", title: "Research resources", completed: false },
          { id: "2", title: "Create study plan", completed: false },
          { id: "3", title: "Practice daily", completed: false },
          { id: "4", title: "Review progress", completed: false },
        ],
        estimated_duration: 60,
      }
    },
    {
      icon: Heart,
      color: "from-red-500 to-rose-500",
      name: "Health Routine",
      template: {
        title: "Health & Fitness Routine",
        category: "health",
        priority: "high",
        is_recurring: true,
        recurring_interval: "daily",
        subtasks: [
          { id: "1", title: "Morning exercise", completed: false },
          { id: "2", title: "Healthy meals", completed: false },
          { id: "3", title: "Drink water", completed: false },
          { id: "4", title: "Evening stretch", completed: false },
        ],
        estimated_duration: 30,
      }
    },
    {
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500",
      name: "Shopping List",
      template: {
        title: "Weekly Shopping",
        category: "shopping",
        priority: "medium",
        is_recurring: true,
        recurring_interval: "weekly",
        subtasks: [
          { id: "1", title: "Groceries", completed: false },
          { id: "2", title: "Household items", completed: false },
          { id: "3", title: "Personal care", completed: false },
        ],
        estimated_duration: 90,
      }
    },
  ];

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          Quick Start Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <Button
              key={template.name}
              variant="outline"
              className="h-auto flex-col gap-2 p-4 hover:shadow-md transition-all"
              onClick={() => onSelectTemplate(template.template)}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                <template.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium">{template.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}