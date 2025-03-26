import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, fetchWeather } from '../redux/tasksSlice';
import '../styles.css';

const TaskInput = () => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const dispatch = useDispatch();

  const handleAddTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now(),
        text: task,
        priority,
        location,
      };
      dispatch(addTask(newTask));
      dispatch(fetchWeather(newTask));
      setTask('');
      setLocation('');
    }
  };

  return (
    <div className="task-input">
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyup={(e) => e.key === 'Enter' && handleAddTask()}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="text"
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskInput;
