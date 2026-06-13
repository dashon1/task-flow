import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Trash2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BulkActions({ selectedTasks, onBulkUpdate, onBulkDelete, onClear }) {
  if (selectedTasks.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        <Badge variant="secondary" className="bg-white/20 text-white">
          {selectedTasks.length} selected
        </Badge>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                Mark as
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onBulkUpdate({ status: "todo" })}>
                Mark as Todo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkUpdate({ status: "in_progress" })}>
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkUpdate({ status: "completed" })}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                Set Priority
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onBulkUpdate({ priority: "urgent" })}>
                Urgent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkUpdate({ priority: "high" })}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkUpdate({ priority: "medium" })}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkUpdate({ priority: "low" })}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:bg-red-500/20"
            onClick={onBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}