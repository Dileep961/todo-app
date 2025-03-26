import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {  loadAuthFromStorage } from './redux/authSlice';
import { loadTasksFromStorage } from './redux/tasksSlice';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './styles.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
    dispatch(loadTasksFromStorage());
  }, [dispatch]);

 
  return (
    <div className="app-container">
      <h1>Advanced To-Do App</h1> 
          <TaskInput />
          <TaskList />
    </div>
  );
};

export default App;