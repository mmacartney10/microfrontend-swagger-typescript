import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Task, TaskInput } from '@swagger-ts/api-client';

const TasksPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.tasksService.tasksList(),
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (newTask: TaskInput) => apiClient.tasksService.tasksCreate(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskInput }) => 
      apiClient.tasksService.tasksUpdate({ id }, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleCreateTask = () => {
    const newTask: TaskInput = {
      title: 'New Task from Microfrontend',
      description: 'Created via TanStack Query',
      priority: 'medium',
      completed: false,
    };
    createTaskMutation.mutate(newTask);
  };

  const handleToggleComplete = (task: Task) => {
    if (task.id) {
      const updatedTask: TaskInput = {
        ...task,
        completed: !task.completed,
      };
      updateTaskMutation.mutate({ id: task.id, task: updatedTask });
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Tasks Management</h2>
      <button 
        onClick={handleCreateTask}
        disabled={createTaskMutation.isPending}
        style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        {createTaskMutation.isPending ? 'Creating...' : 'Add New Task'}
      </button>

      <div style={{ display: 'grid', gap: '10px' }}>
        {tasks?.data?.map((task) => (
          <div
            key={task.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: task.completed ? '#f0f9ff' : 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                <p style={{ margin: '0 0 10px 0', color: '#666' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.9em' }}>
                  <span style={{ backgroundColor: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                    {task.priority}
                  </span>
                  {task.assignedTo && (
                    <span style={{ backgroundColor: '#10B981', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                      👤 {task.assignedTo}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggleComplete(task)}
                disabled={updateTaskMutation.isPending}
                style={{
                  backgroundColor: task.completed ? '#EF4444' : '#10B981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '5px',
                }}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;