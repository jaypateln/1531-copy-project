import { setData } from './dataStore.js';
// Function that resets the state of the application back to the start
export function clear() {
  const data = {
    users: [],
    quizzes: [],
  };
  setData(data);
  // Returns an empty object
  return {

  };
}
