import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIAssistant({ task, onSuggestionApply }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const analyzeTask = async () => {
    setIsAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this task and provide intelligent suggestions:
        
Title: ${task.title}
Description: ${task.description || "No description"}
Priority: ${task.priority}
Category: ${task.category}

Please provide:
1. Suggested category if the current one doesn't fit well
2. Estimated duration in minutes
3. Suggested priority level
4. 3-5 actionable subtasks to complete this task
5. Any potential blockers or dependencies

Return as JSON with keys: suggested_category, estimated_duration, suggested_priority, subtasks (array of strings), blockers (array of strings)`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_category: { type: "string" },
            estimated_duration: { type: "number" },
            suggested_priority: { type: "string" },
            subtasks: { type: "array", items: { type: "string" } },
            blockers: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setSuggestions(response);
    } catch (error) {
      console.error("Error analyzing task:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestions = () => {
    if (!suggestions) return;
    
    const subtasksArray = suggestions.subtasks.map((title, index) => ({
      id: `subtask-${Date.now()}-${index}`,
      title,
      completed: false
    }));

    onSuggestionApply({
      category: suggestions.suggested_category,
      estimated_duration: suggestions.estimated_duration,
      priority: suggestions.suggested_priority,
      subtasks: subtasksArray
    });
    
    setSuggestions(null);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-5 h-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestions ? (
          <Button
            onClick={analyzeTask}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Smart Suggestions
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Suggestions:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Category:</span>
                  <Badge>{suggestions.suggested_category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <Badge>{suggestions.estimated_duration} mins</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Priority:</span>
                  <Badge>{suggestions.suggested_priority}</Badge>
                </div>
              </div>
            </div>

            {suggestions.subtasks && suggestions.subtasks.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Suggested Subtasks:</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {suggestions.subtasks.map((subtask, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      {subtask}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.blockers && suggestions.blockers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Potential Blockers:</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {suggestions.blockers.map((blocker, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600">⚠</span>
                      {blocker}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={applySuggestions} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Apply Suggestions
              </Button>
              <Button onClick={() => setSuggestions(null)} variant="outline">
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}