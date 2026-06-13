import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SortAsc } from "lucide-react";

export default function TaskFilters({ filters, onFilterChange }) {
  const handleFilterChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select 
          value={filters.status} 
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-32 bg-white border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.priority} 
          onValueChange={(value) => handleFilterChange("priority", value)}
        >
          <SelectTrigger className="w-32 bg-white border-slate-200">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.category} 
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-32 bg-white border-slate-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
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

      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-slate-500" />
        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-32 bg-white border-slate-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="created_date">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}