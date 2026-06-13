import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Save, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubtasksList from "../features/SubtasksList";
import AIAssistant from "../features/AIAssistant";
import { base44 } from "@/api/base44Client";

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [currentTask, setCurrentTask] = React.useState(task || {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category: "personal",
    due_date: "",
    is_recurring: false,
    recurring_interval: "weekly",
    estimated_duration: "",
    project: "",
    tags: [],
    subtasks: [],
    attachments: [],
    reminder_enabled: false
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentTask);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const newAttachment = {
        url: file_url,
        name: file.name,
        type: file.type
      };

      setCurrentTask({
        ...currentTask,
        attachments: [...(currentTask.attachments || []), newAttachment]
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeAttachment = (index) => {
    setCurrentTask({
      ...currentTask,
      attachments: currentTask.attachments.filter((_, i) => i !== index)
    });
  };

  const handleAISuggestion = (suggestions) => {
    setCurrentTask({
      ...currentTask,
      ...suggestions
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-2xl">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="flex items-center justify-between">
            <span className="text-slate-900">
              {task ? "Edit Task" : "Create New Task"}
            </span>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="basic" className="space-y-6">
            {/* Title and Description */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  placeholder="Project name"
                  value={currentTask.project}
                  onChange={(e) => setCurrentTask({...currentTask, project: e.target.value})}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add details about this task..."
                value={currentTask.description}
                onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 h-24"
              />
            </div>

            {/* Priority, Category, Due Date */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={currentTask.priority}
                  onValueChange={(value) => setCurrentTask({...currentTask, priority: value})}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={currentTask.category}
                  onValueChange={(value) => setCurrentTask({...currentTask, category: value})}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={currentTask.due_date}
                  onChange={(e) => setCurrentTask({...currentTask, due_date: e.target.value})}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
            </div>

              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {/* Subtasks */}
                <SubtasksList
                  subtasks={currentTask.subtasks}
                  onChange={(subtasks) => setCurrentTask({...currentTask, subtasks})}
                />

                {/* Attachments */}
                <div className="space-y-4">
                  <Label>Attachments</Label>
                  <div className="space-y-2">
                    {currentTask.attachments?.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{attachment.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isUploading}
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Uploading..." : "Upload File"}
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reminder"
                      checked={currentTask.reminder_enabled}
                      onCheckedChange={(checked) => setCurrentTask({...currentTask, reminder_enabled: checked})}
                    />
                    <Label htmlFor="reminder">Enable reminder notifications</Label>
                  </div>
                </div>

                {/* Recurring Options */}
                <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={currentTask.is_recurring}
                  onCheckedChange={(checked) => setCurrentTask({...currentTask, is_recurring: checked})}
                />
                <Label htmlFor="recurring">Make this a recurring task</Label>
              </div>

              {currentTask.is_recurring && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recurring Interval</Label>
                    <Select
                      value={currentTask.recurring_interval}
                      onValueChange={(value) => setCurrentTask({...currentTask, recurring_interval: value})}
                    >
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={currentTask.estimated_duration}
                      onChange={(e) => setCurrentTask({...currentTask, estimated_duration: parseInt(e.target.value)})}
                      className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                </div>
              )}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <AIAssistant
                  task={currentTask}
                  onSuggestionApply={handleAISuggestion}
                />
              </TabsContent>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/60">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}