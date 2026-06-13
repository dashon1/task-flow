import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PomodoroTimer({ task, onSessionComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (sessionType === "work") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      onSessionComplete?.(task?.id);
      
      // Switch to break
      if (newSessions % 4 === 0) {
        setSessionType("longBreak");
        setTimeLeft(durations.longBreak);
      } else {
        setSessionType("shortBreak");
        setTimeLeft(durations.shortBreak);
      }
    } else {
      // Switch back to work
      setSessionType("work");
      setTimeLeft(durations.work);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[sessionType]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((durations[sessionType] - timeLeft) / durations[sessionType]) * 100;

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <Timer className="w-5 h-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-red-900 mb-2">
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-red-700 capitalize">
            {sessionType === "work" ? "Focus Time" : sessionType === "shortBreak" ? "Short Break" : "Long Break"}
          </p>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleTimer}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={resetTimer}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-slate-600">
            Sessions completed: <span className="font-bold text-red-900">{sessionsCompleted}</span>
          </p>
        </div>

        {task && (
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">Working on:</p>
            <p className="font-medium text-slate-900">{task.title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}