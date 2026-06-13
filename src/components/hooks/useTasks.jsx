import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useTasks(filters = {}) {
  const queryClient = useQueryClient();

  // Fetch all tasks with React Query
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return await base44.entities.Task.list("-created_date");
    },
    staleTime: 30000, // 30 seconds
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: (taskData) => base44.entities.Task.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task mutation
  const updateTask = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onMutate: async ({ id, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old) => 
        old.map(task => task.id === id ? { ...task, ...data } : task)
      );
      
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: (taskId) => base44.entities.Task.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Bulk delete mutation
  const bulkDelete = useMutation({
    mutationFn: async (taskIds) => {
      await Promise.all(taskIds.map(id => base44.entities.Task.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Bulk update mutation
  const bulkUpdate = useMutation({
    mutationFn: async ({ taskIds, updates }) => {
      await Promise.all(
        taskIds.map(id => base44.entities.Task.update(id, updates))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    bulkDelete,
    bulkUpdate
  };
}