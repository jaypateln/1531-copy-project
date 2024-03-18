
import { getData, setData } from './dataStore.js';
import unixTimestamp from 'unix-timestamp';

/**
  * Function that provides a list of all quizzes that are owned by the currently logged in user
  *
  * @param {integer} authUserId - The unique ID of a user
  * ...
  *
  * @returns {object} - If there are no errors
  * @returns {error: 'AuthUserId is not a valid user'} - If the authUserId is not valid
*/

export function adminQuizList(authUserId) {
  const data = getData();

  // Check if authUserId is valid
  let userFound = false;
  for (const user of data.users) {
    if (authUserId === user.authUserId) {
      userFound = true;
      break;
    }
  }

  // Returns error message if authUserId is not valid
  if (!userFound) {
    return { error: 'AuthUserId is not valid' };
  }

  const userQuizzes = [];

  // Loops through all quizzes in the data and checks if the current quiz belongs to the authenticated user
  for (const quiz of data.quizzes) {
    if (quiz.quizOwner === authUserId) {
      userQuizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }
  // Returns the user's list of quizzes if authUserId is valid
  return { quizzes: userQuizzes };
}

/**
 * Function that creates a new quiz for the logged-in user based on provided details.
 *
 * @param {integer} authUserId - The unique ID of the user creating the quiz.
 * @param {string} name - The name of the new quiz.
 * @param {string} description - The description of the new quiz.
 *
 * @returns {object} - Returns an object containing the quizId if successful.
 * @returns {object} - Returns an object with an error message if any error occurs:
 *                    { error: 'AuthUserId is not a valid user' } - If the provided authUserId does not match any user.
 *                    { error: 'The name length is invalid.' } - If the length of the name is less than 3 or greater than 30 characters.
 *                    { error: 'The name contains invalid characters' } - If the name contains non-alphanumeric characters.
 *                    { error: 'Quiz with the same name already exists.' } - If a quiz with the same name already exists.
 *                    { error: 'Description is too long.' } - If the length of the description exceeds 100 characters.
 *
 */
export function adminQuizCreate (authUserId, name, description) {
  // Fetch the data
  const data = getData();

  // Error check for AuthUserId is not a valid user
  const user = data.users.find(user => user.authUserId === authUserId);
  if (user === undefined) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }

  // Checks if name has correct length
  if (name.length < 3 || name.length > 30) {
    return { error: 'The name length is invalid' };
  }

  // Error check for non-alphanumeric characters
  const invalidCharactersRegex = /[^a-zA-Z0-9' -]/;

  for (const letter of name) {
    if (letter !== ' ' && invalidCharactersRegex.test(letter)) {
      return { error: 'The name contains invalid characters' };
    }
  }

  // Check if name already exists
  const existingQuiz = data.quizzes.find(element => name === element.name);
  if (existingQuiz) {
    return { error: 'Quiz with the same name already exists' };
  }

  // Check if description length is valid
  if (description.length > 100) {
    return { error: 'Description is too long' };
  }

  // push the changes onto the data object
  data.quizzes.push({
    quizId: data.quizzes.length,
    quizOwner: authUserId,
    name: name,
    timeCreated: unixTimestamp.now(),
    timeLastEdited: unixTimestamp.now(),
    description: description
  });

  // Update the changes
  setData(data);

  // Returns the quizId
  return {
    quizId: data.quizzes.length - 1
  };
}

/**
  * Function that given a particular quiz, permanently removes the quiz.
  *
  * @param {integer} authUserId - The unique ID of a user
  * @param {integer} quizId - The unique ID of a quiz
  * ...
  *
  * @returns { } - If there are no errors
  * @returns {error: 'specific error message here'} - AuthUserId is not a valid user
  * - Quiz ID does not refer to a valid quiz
  * - Quiz ID does not refer to a quiz that this user owns
*/

export function adminQuizRemove(authUserId, quizId) {
  const data = getData();

  const user = data.users.find(user => user.authUserId === authUserId);
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (user === undefined) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }
  if (quiz === undefined) {
    return {
      error: 'QuizId does not refer to a valid quiz'
    };
  }
  if (quiz.quizOwner !== authUserId) {
    return {
      error: 'QuizId does not refer to a quiz that this user owns'
    };
  }

  data.quizzes.splice(quiz, 1);
  setData(data);

  // Return empty object
  return {

  };
}

/**
  * Function that gets all the relevant information about the current quiz
  *
  * @param {integer} authUserId - The unique ID of a user
  * @param {integer} quizId - The unique ID of a quiz
  * ...
  *
  * @returns {quizId, name, timeCreated, timeLastEdited, description} - If there are no errors
  * @returns {error: 'specific error message here'}
  * - AuthUserId is not a valid user
  * - Quiz ID does not refer to a valid quiz
  * - Quiz ID does not refer to a quiz that this user owns
  *
*/
export function adminQuizInfo(authUserId, quizId) {
  const data = getData();

  // Error check for AuthUserId is not a valid user
  const user = data.users.find(user => user.authUserId === authUserId);
  if (user === undefined) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }

  // Error check for invalid quizId
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (quiz === undefined) {
    return {
      error: 'QuizId is not valid'
    };
  }

  // Error check for  whether or not the user has access to view this quiz info
  if (quiz.quizOwner !== authUserId) {
    return {
      error: 'You do not have access to this Quiz'
    };
  }

  // If no errors then successfully returning the details
  return {
    quizId: quizId,
    name: data.quizzes[quizId].name,
    timeCreated: data.quizzes[quizId].timeCreated,
    timeLastEdited: data.quizzes[quizId].timeLastEdited,
    description: data.quizzes[quizId].description,
  };
}

/**
  * Function that updates the name of the relevant quiz.
  *
  * @param {integer} authUserId - The unique ID of a user
  * @param {integer} quizId - The unique ID of a quiz
  * @param {String} name - The new name for the quiz
  * ...
  *
  * @returns {} - If there are no errors
  * @returns {error: 'specific error message here'}
  * - AuthUserId is not a valid user
  * - Quiz ID does not refer to a valid quiz
  * - Quiz ID does not refer to a quiz that this user owns
  * - Name contains invalid characters. Valid characters are alphanumeric and spaces.
  * - Name is either less than 3 characters long or more than 30 characters long.
  * - Name is already used by the current logged in user for another quiz.
  *
*/
export function adminQuizNameUpdate(authUserId, quizId, name) {
  const data = getData();
  // Error check for AuthUserId is not a valid user
  const user = data.users.find(user => user.authUserId === authUserId);
  if (user === undefined) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }

  // Error check for  quiz does not exist
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (quiz === undefined) {
    return {
      error: 'QuizId is not valid'
    };
  }

  // Error check if non-owner tried to access quiz info
  if (quiz.quizOwner !== authUserId) {
    return {
      error: 'You do not have access to this Quiz'
    };
  }

  // Error check for non-alphanumeric characters
  const invalidCharactersRegex = /[^a-zA-Z0-9' -]/;

  for (const letter of name) {
    if (letter !== ' ' && invalidCharactersRegex.test(letter)) {
      return { error: 'The name contains invalid characters' };
    }
  }

  // Check if name has correct length
  if (name.length < 3 || name.length > 30) {
    return { error: 'The name length is invalid' };
  }

  // Check if name already exists
  for (const element of data.quizzes) {
    if (name === element.name) {
      return { error: 'Quiz with the same name already exists' };
    }
  }

  // Cf no errors proceed changing name and timeLastEdited
  data.quizzes[quizId].name = name;
  data.quizzes[quizId].timeLastEdited = unixTimestamp.now();

  // Store the data back
  setData(data);

  return {

  };
}

/**
 * Function that updates the description of the relevant quiz.
 *
 * @param {integer} authUserId - The unique ID of the user updating the quiz description.
 * @param {integer} quizId - The unique ID of the quiz to be updated.
 * @param {string} description - The new description for the quiz.
 *
 * @returns {object} - Returns an empty object if successful.
 * @returns {object} - Returns an object with an error message if any error occurs:
 *                    { error: 'AuthUserId is not a valid user' } - If the provided authUserId does not match any user.
 *                    { error: 'QuizId does not refer to a valid quiz' } - If the provided quizId does not match any existing quiz.
 *                    { error: 'QuizId does not refer to a quiz that this user owns' } - If the user does not own the quiz with the provided quizId.
 *                    { error: 'Description length is too long' } - If the length of the description exceeds 100 characters.
 */
export function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  // fetch data
  const data = getData();

  // Error check for AuthUserId is not a valid user
  const user = data.users.find(user => user.authUserId === authUserId);

  if (user === undefined) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }

  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (quiz === undefined) {
    return {
      error: 'QuizId does not refer to a valid quiz'
    };
  }

  if (quiz.quizOwner !== authUserId) {
    return {
      error: 'QuizId does not refer to a quiz that this user owns'
    };
  }

  // Valid description length
  if (description.length > 100) {
    return { error: 'Description length is too long' };
  }

  data.quizzes[quizId].description = description;
  data.quizzes[quizId].timeLastEdited = unixTimestamp.now();

  setData(data);

  return {

  };
}
