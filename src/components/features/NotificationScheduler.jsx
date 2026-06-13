import { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { isToday, isTomorrow, isPast, parseISO } from "date-fns";

export default function NotificationScheduler({ tasks, user }) {
  useEffect(() => {
    if (!user?.email_notifications || !tasks || tasks.length === 0) return;

    const checkAndSendNotifications = async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const reminderHour = parseInt(user?.reminder_time?.split(":")[0] || "9");

      // Only send once per day at the specified time
      if (currentHour !== reminderHour) return;

      // Check for overdue tasks
      const overdueTasks = tasks.filter(
        task => task.due_date && isPast(parseISO(task.due_date)) && task.status !== "completed"
      );

      // Check for tasks due today
      const todayTasks = tasks.filter(
        task => task.due_date && isToday(parseISO(task.due_date)) && task.status !== "completed"
      );

      // Check for tasks due tomorrow
      const tomorrowTasks = tasks.filter(
        task => task.due_date && isTomorrow(parseISO(task.due_date)) && task.status !== "completed"
      );

      // Send email if there are any important tasks
      if (overdueTasks.length > 0 || todayTasks.length > 0 || tomorrowTasks.length > 0) {
        const emailBody = `
Hello ${user.full_name},

Here's your daily task summary:

${overdueTasks.length > 0 ? `⚠️ OVERDUE TASKS (${overdueTasks.length}):
${overdueTasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}

` : ''}${todayTasks.length > 0 ? `📅 DUE TODAY (${todayTasks.length}):
${todayTasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}

` : ''}${tomorrowTasks.length > 0 ? `🔔 DUE TOMORROW (${tomorrowTasks.length}):
${tomorrowTasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}

` : ''}
Stay productive! 🚀

- TaskFlow
        `;

        try {
          await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: `TaskFlow: Your Daily Task Summary`,
            body: emailBody
          });
        } catch (error) {
          console.error("Failed to send notification email:", error);
        }
      }
    };

    // Check every hour
    const interval = setInterval(checkAndSendNotifications, 60 * 60 * 1000);
    
    // Check immediately on mount
    checkAndSendNotifications();

    return () => clearInterval(interval);
  }, [tasks, user]);

  return null; // This is a background component
}