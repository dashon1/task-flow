import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

export default function KeyboardShortcutsDialog({ open, onOpenChange }) {
  const shortcuts = [
    { keys: ["N"], description: "Create new task" },
    { keys: ["S"], description: "Focus search" },
    { keys: ["F"], description: "Enter focus mode" },
    { keys: ["?"], description: "Show keyboard shortcuts" },
    { keys: ["D"], description: "Go to Dashboard" },
    { keys: ["T"], description: "Go to Tasks" },
    { keys: ["C"], description: "Go to Calendar" },
    { keys: ["Esc"], description: "Close dialogs" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-slate-700">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-400 mx-1">+</span>}
                    <Badge variant="outline" className="font-mono">
                      {key}
                    </Badge>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}