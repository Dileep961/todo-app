import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask } from '../redux/tasksSlice';
import '../styles.css';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const weather = useSelector((state) => state.tasks.weather);
  const error = useSelector((state) => state.tasks.error);
  const dispatch = useDispatch();

  return (
    <div className="task-list">
      {weather && (
        <p className="weather-info">
          Weather: {weather.weather[0].description}, {weather.main.temp}°C in {weather.name}
        </p>
      )}
      {error && <p className="error">Error fetching weather: {error.message}</p>}
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item priority-${task.priority.toLowerCase()}`}
          >
            <span>{task.text} (Priority: {task.priority})</span>
            <button
              className="delete-btn"
              onClick={() => dispatch(deleteTask(task.id))}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;