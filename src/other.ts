import { setData } from './dataStore';
/**
 * Function clear resets the state of the application back to the start
 *
 * @returns {}
 */
export function clear() {
  setData(
    {
      users: [],
      quizzes: [],
      quizzesTrash: [],
      sessions: [],
    }
  );
  return {};
}
