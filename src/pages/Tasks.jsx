import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Keyboard } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useTasks } from "../components/hooks/useTasks";
import { useKeyboardShortcuts } from "../components/hooks/useKeyboardShortcuts";
import { Checkbox } from "@/components/ui/checkbox";

import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskItem from "../components/tasks/TaskItem";
import TaskStats from "../components/tasks/TaskStats";
import BulkActions from "../components/features/BulkActions";
import KeyboardShortcutsDialog from "../components/features/KeyboardShortcutsDialog";
import ImportExport from "../components/features/ImportExport";
import TaskTemplates from "../components/features/TaskTemplates";
import FocusMode from "../components/features/FocusMode";
import { Target } from "lucide-react";

export default function Tasks() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, bulkDelete, bulkUpdate } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ 
    status: "all", 
    priority: "all", 
    category: "all",
    search: "",
    sortBy: "due_date"
  });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const searchInputRef = React.useRef(null);

  useKeyboardShortcuts([
    { key: "n", action: () => setShowForm(true) },
    { key: "s", action: () => searchInputRef.current?.focus() },
    { key: "?", action: () => setShowShortcuts(true) },
    { key: "f", action: () => setShowFocusMode(true) },
    { key: "t", action: () => {} }, // Already on tasks
  ]);

  const handleSubmit = async (taskData) => {
    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, data: taskData });
    } else {
      await createTask.mutateAsync(taskData);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleStatusChange = async (task, newStatus) => {
    const updateData = { status: newStatus };
    if (newStatus === "completed") {
      updateData.completed_at = new Date().toISOString();
    }
    await updateTask.mutateAsync({ id: task.id, data: updateData });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask.mutateAsync(taskId);
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkUpdate = async (updates) => {
    await bulkUpdate.mutateAsync({ taskIds: selectedTasks, updates });
    setSelectedTasks([]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      await bulkDelete.mutateAsync(selectedTasks);
      setSelectedTasks([]);
    }
  };

  const handleTemplateSelect = (template) => {
    setEditingTask(template);
    setShowForm(true);
  };

  const filteredTasks = useMemo(() => tasks
    .filter(task => {
      const statusMatch = filters.status === "all" || task.status === filters.status;
      const priorityMatch = filters.priority === "all" || task.priority === filters.priority;
      const categoryMatch = filters.category === "all" || task.category === filters.category;
      const searchMatch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      return statusMatch && priorityMatch && categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      if (filters.sortBy === "due_date") {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (filters.sortBy === "priority") {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.created_date) - new Date(a.created_date);
    }), [tasks, filters]);

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Tasks</h1>
            <p className="text-slate-600">Manage your tasks and boost productivity</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowFocusMode(true)}
              variant="outline"
              className="px-6 py-3"
            >
              <Target className="w-5 h-5 mr-2" />
              Focus Mode
            </Button>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </div>
        </div>

        {/* Task Form */}
        <AnimatePresence>
          {showForm && (
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                ref={searchInputRef}
                placeholder="Search tasks... (Press S)"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowShortcuts(true)}
              className="flex items-center gap-2"
            >
              <Keyboard className="w-4 h-4" />
              Shortcuts
            </Button>
          </div>
          <TaskFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </div>

        {/* Import/Export & Templates */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ImportExport onImportComplete={(count) => alert(`Successfully imported ${count} tasks!`)} />
          <TaskTemplates onSelectTemplate={handleTemplateSelect} />
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <AnimatePresence>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <Filter className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No tasks found</h3>
                <p className="text-slate-500">Try adjusting your filters or create a new task</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                    className="mt-7"
                  />
                  <div className="flex-1">
                    <TaskItem
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <BulkActions
          selectedTasks={selectedTasks}
          onBulkUpdate={handleBulkUpdate}
          onBulkDelete={handleBulkDelete}
          onClear={() => setSelectedTasks([])}
        />

        {/* Keyboard Shortcuts Dialog */}
        <KeyboardShortcutsDialog
          open={showShortcuts}
          onOpenChange={setShowShortcuts}
        />

        {/* Focus Mode */}
        {showFocusMode && (
          <FocusMode
            tasks={filteredTasks}
            onTaskSelect={(task) => {
              setShowFocusMode(false);
              handleEdit(task);
            }}
            onClose={() => setShowFocusMode(false)}
          />
        )}
      </div>
    </div>
  );
}