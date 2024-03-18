
import { getData, setData } from './dataStore.js';
import validator from 'validator';

/**
 * Registers a new administrator user with provided credentials.
 * @param {string} email - The email of a user for registration.
 * @param {string} password - The user's password for registration.
 * @param {string} nameFirst - The user's first name for registration.
 * @param {string} nameLast - The user's last name for registration.
 * ----
 * @returns {Object} An object containing either the `authUserId` of the newly registered user if registration is successful, or an error message in case of failure.
 *
 * @returns {Object} - On success: { authUserId: number }
 * @returns {Object} - On failure: { error: string } where the error message could be one of the following:
 * - "Email already registered" if the email address is already in use.
 * - "Email does not validate" if the email does not satisfy validator.isEmail function criteria. See https://www.npmjs.com/package/validator for more details.
 * - "NameFirst contains invalid characters" if NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
 * - "NameFirst is too short" if NameFirst is less than 2 characters.
 * - "NameFirst is too long" if NameFirst is more than 20 characters.
 * - "NameLast contains invalid characters" if NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
 * - "NameLast is too short" if NameLast is less than 2 characters.
 * - "NameLast is too long" if NameLast is more than 20 characters.
 * - "Password Less than 8 characters" if the password is less than 8 characters.
 * - "Password must contain at least one number and one letter" if the password does not contain at least one number and at least one letter.
 */

// Function that registers a user with an email, password, and names, then returns their authUserId value
export function adminAuthRegister(email, password, nameFirst, nameLast) {
  const data = getData();

  // Checks if an email is valid or not
  if (!validator.isEmail(email)) {
    return { error: 'Email is not valid' };
  }

  // Checks if an email has already been registered
  if (data.users.find(user => user.email === email)) {
    return { error: 'Email already registered' };
  }

  // Checks if nameFirst only contains the allowedChars and has no invalid chars
  const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -'";
  let isNameFirstValid = true;

  for (const char of nameFirst) {
    if (!allowedChars.includes(char)) {
      isNameFirstValid = false;
      break;
    }
  }

  if (!isNameFirstValid) {
    return { error: 'Firstname contains invalid characters' };
  }

  // Checks if nameFirst is too short or too long
  if (nameFirst.length < 2) {
    return { error: 'Firstname is too short' };
  } else if (nameFirst.length > 20) {
    return { error: 'Firstname is too long' };
  }

  // Checks if nameLast only contains the allowedChars and has no invalid chars
  let isNameLastValid = true;
  for (const char of nameLast) {
    if (!allowedChars.includes(char)) {
      isNameLastValid = false;
      break;
    }
  }

  if (!isNameLastValid) {
    return { error: 'Lastname contains invalid characters' };
  }

  // Checks if nameLast is too short or too long
  if (nameLast.length < 2) {
    return { error: 'Lastname is too short' };
  } else if (nameLast.length > 20) {
    return { error: 'Lastname is too long' };
  }

  // Checks if password has more than 8 characters
  if (password.length < 8) {
    return { error: 'Password Less than 8 characters' };
  }

  // Checks if password contains at least one number and one letter
  const passowrdHasLetter = /[a-zA-Z]/.test(password);
  const passwordHasNumber = /\d/.test(password);
  if (!passowrdHasLetter || !passwordHasNumber) {
    return { error: 'Password must contain at least one number and one letter' };
  }

  const authUserId = data.users.length;
  // Pushes the user data to the dataStore.js
  data.users.push({
    email: email,
    password: password,
    name: `${nameFirst} ${nameLast}`,
    authUserId: authUserId,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  });

  setData(data);

  return {
    authUserId: authUserId
  };
}

/**
  *
  * @param {string} email - The email of a user for loggin in
  * @param {string} password - The user's password for their email
  * ---
  * @returns { authUserId } - If there are no errors
  * @returns {error: 'any error message'}
  * - Email address does not exist.
  * - Password is not correct for the given email.
*/

// Function that given a registered user's email and password, returns their authUserId value
export function adminAuthLogin(email, password) {
  // Get the data from the dataStore.js
  const data = getData();

  // Loops through the data and checks if the email and password exists
  for (const user of data.users) {
    if (user.email === email) {
      if (user.password === password) {
        user.numSuccessfulLogins += 1;
        user.numFailedPasswordsSinceLastLogin = 0;
        setData(data);

        return {
          authUserId: user.authUserId
        };
      } else {
        user.numFailedPasswordsSinceLastLogin += 1;
        setData(data);
        // If the password is not correct, then it returns an error
        return { error: 'Password is incorrect for the given email' };
      }
    }
  }

  return { error: 'Email does not exist' };
}

/**
  * @param {number} authUserId - The authUserId is data.users.length of the user
  * ---
  * @returns { user: {
  *     userId,
  *     name,
  *     email,
  *     numSuccessfulLogins,
  *     numFailedPasswordsSinceLastLogin,
  *    }
  * } - If there are no errors
  *
  * @returns {error: 'error message'}
  * - AuthUserId is not a valid user
*/

// Function that given an admin user's authUserId, return details about the user
export function adminUserDetails(authUserId) {
  // Returns the UserId, name, email, numSuccessfulLogins, numFailedPasswordsSinceLastLogin
  const data = getData();

  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      return {
        user: {
          userId: user.authUserId,
          name: user.name,
          email: user.email,
          numSuccessfulLogins: user.numSuccessfulLogins,
          numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
        }
      };
    }
  }
  return { error: 'AuthUserId is not a valid user' };
}

/**
 * Function that given an admin user's authUserId, updates the properties of this logged in admin user
 *
 * @param {number} authUserId - The unique authentication user ID.
 * @param {string} email - The updated email address.
 * @param {string} nameFirst - The updated first name.
 * @param {string} nameLast - The updated last name.
 *
 * @returns {Object} If there are no errors, returns an empty object.
 *
 * @returns {Object} If authUserId is not valid, returns { error: 'User Id is not valid' }.
 *
 * @returns {Object} If the email is not a valid email address, returns { error: 'Email is not a valid email address' }.
 *
 * @returns {Object} If the email address is used by another user, returns { error: 'Email address is used by another user' }.
 *
 * @returns {Object} If the first name is not valid, returns { error: 'First name is not valid' }.
 *
 * @returns {Object} If the last name is not valid, returns { error: 'Last name is not valid' }.
 */
export function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
  const data = getData();

  // Returns error message if the email is not valid
  if (!validator.isEmail(email)) {
    return { error: 'Email is not a valid email address' };
  }

  // Find the user with the given authUserId
  let userFound = false;
  for (const user of data.users) {
    if (user.authUserId === authUserId) {
      userFound = true;
      break;
    }
  }

  // Returns error message if the email is being used by another user
  let otherUser;
  for (let i = 0; i < data.users.length; i++) {
    const user = data.users[i];
    if (user.email === email && user.authUserId !== authUserId) {
      otherUser = user;
      break;
    }
  }
  if (otherUser) {
    return { error: 'Email address is used by another user' };
  }

  // Returns error message if authUserId is not valid
  if (!userFound) {
    return { error: 'User Id is not valid' };
  }

  const nameRegex = /^[a-zA-Z' -]*$/;
  const firstNameLength = nameFirst.length;
  const lastNameLength = nameLast.length;

  // Returns error message if the first name is not valid
  if (!nameRegex.test(nameFirst) || firstNameLength < 2 || firstNameLength > 20) {
    return { error: 'First name is not valid' };
  }

  // Returns error message if the last name is not valid
  if (!nameRegex.test(nameLast) || lastNameLength < 2 || lastNameLength > 20) {
    return { error: 'Last name is not valid' };
  }

  // Updates the user properties
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].authUserId === authUserId) {
      data.users[i].email = email;
      data.users[i].name = `${nameFirst} ${nameLast}`;
      break;
    }
  }

  setData(data);
  // Returns an empty object
  return {};
}

/**
  * Given the details relating to a password change, updates the password of a logged in user
  *
  * @param {integer} authUserId - The unique user ID of a user
  * @param {string} oldPassword - The user's old password to be replaced by new password
  * @param {string} newPassword - The user's new password that replaces the old password
  * ...
  *
  * @returns { } - If there are no errors
  * @returns {error: 'specific error message here'} - AuthUserId is not a valid user
  * - Old password is not correct old password
  * - Old Password and New Password match exactly
  * - New Password has already been used before by this user
  * - New Password is less than 8 characters
  * - New Password does not contain at least one number and at least one letter
*/

export function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
  // Get data from dataStore.js
  const data = getData();

  const user = data.users.find(user => user.authUserId === authUserId);
  const userIndex = data.users.findIndex(user => user.authUserId === authUserId);

  if (user === undefined) {
    return {
      error: 'AuthUserId id not a valid user'
    };
  }

  if (oldPassword !== user.password) {
    return {
      error: 'Old password is not correct'
    };
  }

  if (oldPassword === newPassword) {
    return {
      error: 'Old password and new password match exactly'
    };
  }

  // initialize passwordHistory list for first time passwordUpdate is called
  if (!user.passwordHistory) {
    user.passwordHistory = [];
  }

  if (data.users[userIndex].passwordHistory.includes(newPassword)) {
    return {
      error: 'New password has already been used before by this user'
    };
  }

  if (newPassword.length < 8) {
    return {
      error: 'New password is less than 8 characters'
    };
  }

  if (!passwordIsValid(newPassword)) {
    return {
      error: 'New password does not contain at least one number and at least one letter'
    };
  }

  data.users[userIndex].password = newPassword;
  data.users[userIndex].passwordHistory.push(oldPassword);

  // Returns an empty object
  return {

  };
}

function passwordIsValid(string) {
  return /\d/.test(string) && /[a-zA-Z]/.test(string);
}
