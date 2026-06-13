import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { Upload, Download, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImportExport({ onImportComplete }) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      // Upload file first
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Extract data from file
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" },
                  category: { type: "string" },
                  due_date: { type: "string" },
                  status: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (result.status === "success" && result.output) {
        const tasks = Array.isArray(result.output) ? result.output : result.output.tasks;
        
        // Bulk create tasks
        await Promise.all(
          tasks.map(task => base44.entities.Task.create(task))
        );

        onImportComplete?.(tasks.length);
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import tasks. Please check the file format.");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleExport = async (tasks) => {
    setIsExporting(true);
    try {
      // Convert tasks to CSV
      const headers = ["Title", "Description", "Status", "Priority", "Category", "Due Date", "Project"];
      const rows = tasks.map(task => [
        task.title,
        task.description || "",
        task.status,
        task.priority,
        task.category,
        task.due_date || "",
        task.project || ""
      ]);

      const csv = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <FileText className="w-5 h-5 text-blue-600" />
          Import / Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
            id="import-file"
          />
          <label htmlFor="import-file">
            <Button
              className="w-full"
              variant="outline"
              disabled={isImporting}
              asChild
            >
              <span>
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import from CSV
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>

        <Button
          onClick={() => {
            // Get tasks from parent
            base44.entities.Task.list().then(handleExport);
          }}
          disabled={isExporting}
          variant="outline"
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}