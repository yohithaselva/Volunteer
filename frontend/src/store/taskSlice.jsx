// src/store/taskSlice.js
import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [] },
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    updateTask(state, action) {
      const { id, status } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.status = status;
      }
    },
  },
});

export const { setTasks, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
