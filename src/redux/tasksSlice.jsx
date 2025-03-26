import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Geocoding helper (optional, if you want city names)
const geocodeCity = async (city) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
  const data = await response.json();
  if (data.length === 0) throw new Error('City not found');
  return { lat: data[0].lat, lon: data[0].lon };
};

export const fetchWeather = createAsyncThunk(
  'tasks/fetchWeather',
  async (task, { rejectWithValue }) => {
    try {
      // If location is provided, geocode it; otherwise, use London
      const { lat, lon } = task.location
        ? await geocodeCity(task.location)
        : { lat: 51.5074, lon: -0.1278 }; // London coordinates

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&units=metric`;
      console.log('Fetching weather from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Weather data:', data);

      // Map Open-Meteo data to your app's expected format
      return {
        name: task.location || 'London',
        main: { temp: data.current.temperature_2m },
        weather: [{ description: mapWeatherCode(data.current.weathercode) }],
      };
    } catch (error) {
      console.error('Fetch error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Simple weather code mapper (expand as needed)
const mapWeatherCode = (code) => {
  const codes = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    61: 'rain',
    80: 'rain showers',
  };
  return codes[code] || 'unknown';
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    weather: null,
    error: null,
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    loadTasksFromStorage: (state) => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (storedTasks) state.tasks = storedTasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addTask, deleteTask, loadTasksFromStorage } = tasksSlice.actions;
export default tasksSlice.reducer;