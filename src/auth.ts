import validator from 'validator';
import { uuid } from 'uuidv4';
import { getData, setData } from './dataStore';
import { Error, EmptyObject, user } from './dataStore';
import { getHashOf } from './helperFunctions';
/**
 * Checks if string can be used for nameLast or nameFirst
 *
 * @param {string} name - nameFirst or nameLast
 *
 * @returns boolean
 */
function isNameValid(name: string): boolean {
  if (name.length > 20 || name.length < 2) {
    return false;
  }
  for (const char of name) {
    if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === ' ' || char === '-' || char === '\'')) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if string can be used for password
 *
 * @param {string} password
 *
 * @returns boolean
 */
function isPasswordValid(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  let numberInPassword = 0;
  let charInPassword = 0;
  for (const char of password) {
    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      charInPassword++;
    } else if ((char >= '0' && char <= '9')) {
      numberInPassword++;
    }
  }
  if (numberInPassword === 0) {
    return false;
  } else if (charInPassword === 0) {
    return false;
  }
  return true;
}

/**
  * Register a user with an email, password, and names,
  * then returns their authUserId value.
  *
  * @param {string} email - string containing the email of a user
  * @param {string} password - string containing the password of a user
  * @param {string} nameFirst - string containing the first name of a user
  * @param {string} nameLast - string containing the last name of a user
  *
  * @returns {
  *    authUserId: number
  * } - returns a number authUserId corresponding to the given, email,
  *                         password, nameFirst and nameLast.
  * @returns {
  *    error: string
  * } - returns error in case of invalid input.
*/
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const data = getData();

  // validating email
  for (const user of data.users) {
    if (email === user.email) {
      return { error: 'an account already exists with this email address' };
    }
  }
  if (!validator.isEmail(email)) {
    return { error: 'email address is not valid' };
  }

  // validating nameFirst
  if (isNameValid(nameFirst) !== true) {
    return { error: 'nameFirst is not valid' };
  }

  // validating nameLast
  if (isNameValid(nameLast) !== true) {
    return { error: 'nameLast is not valid' };
  }

  // validating password
  if (isPasswordValid(password) !== true) {
    return { error: 'password is not valid' };
  }

  // creating a userId
  let userId = 0;
  if (data.users.length !== 0) {
    for (const user of data.users) {
      if (userId < user.authUserId) {
        userId = user.authUserId;
      }
    }
    userId++;
  }

  const token = uuid();

  // pushing into dataStore if information is valid

  // pushing into dataStore if information is valid

  data.users.push({
    authUserId: userId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    password: getHashOf(password),
    email: email,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizIds: [],
    tokenIds: [token],
    previousPasswords: [password]
  });
  setData(data);

  return {
    token: token
  };
}

/**
 * When you recieve an email and the correct password
 * return the authUserId value
 *
 * @param {string} email - email given by the user
 * @param {string} password - password appropraite to the email
 *
 * @returns {error: string} - if given information is not valid
 * @returns {authUserId: number} - if email and password are valid, returns the authUserId corresponding to the email given
*/
export function adminAuthLogin(email: string, password: string) {
  const data = getData();
  for (const user of data.users) {
    if (user.email === email) {
      if (user.password === getHashOf(password)) {
        user.numSuccessfulLogins++;
        user.numFailedPasswordsSinceLastLogin = 0;
        const token = uuid();
        user.tokenIds.push(token);
        setData(data);
        return {
          token: token,
        };
      } else {
        user.numFailedPasswordsSinceLastLogin++;
        setData(data);
        return { error: 'password is not correct' };
      }
    }
  }
  return { error: 'email does not exist' };
}

/**
 * Function adminUserDetails takes user's ID and returns an object containing user data.
 *
 * @param {number} authUserId - unique identifier for a user.
 *
 * @returns {
 *  user: {
 *    userId: number,
 *    name: string,
 *    email: string,
 *    numSuccessfulLogins: number,
 *    numFailedPasswordsSinceLastLogin: number
 *  }
 * } upon success.
 * @returns {error: string} if authUserId is invalid.
 */
export function adminUserDetails(authUserId: number) {
  const data = getData();

  // identify user object corresponding to authUserId
  const userDetails = data.users.find((user: user) => user.authUserId === authUserId);

  // error case if no existing user object corresponds to authUserId
  if (userDetails === undefined) {
    return {
      error: 'authUserId is invalid'
    };
  }

  // return details if there is an existing user object corresponding to authUserId
  return {
    user: {
      userId: userDetails.authUserId,
      name: userDetails.nameFirst + ' ' + userDetails.nameLast,
      email: userDetails.email,
      numSuccessfulLogins: userDetails.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: userDetails.numFailedPasswordsSinceLastLogin,
    }
  };
}

/**
 * Given a set of properties, update those properties of this logged in admin user.
 * @param {token: string} string for session token
 * @param {newEmail: string} string for updated email
 * @param {newNameFirst: string} string for updated first name
 * @param {newNameLast: string} string for updated last name
 *
 * @returns {error: string} string for error returned
 * @returns {} on success return blank object
 */

export function adminAuthLogout(authUserId: number, token: string) {
  const data = getData();

  const user = data.users.find((user: user) => user.authUserId === authUserId);
  if (typeof user === 'undefined') {
    return { error: 'authUserId is invalid, no such user found.' };
  }

  if (!user.tokenIds.includes(token)) {
    return { error: 'token was not found' };
  }

  user.tokenIds.splice(user.tokenIds.indexOf(token), 1);
  setData(data);
  return {};
}

export const adminUpdateUserDetails = (token: string, newEmail: string, newNameFirst: string, newNameLast: string): Error | EmptyObject => {
  const data = getData();
  const user = data.users.find((user: user) => user.tokenIds.includes(token));

  // email has already been registered
  for (const user of data.users) {
    if (user.email === newEmail && !(user.tokenIds.includes(token))) {
      return {
        error: 'This email has already been registered'
      };
    }
  }

  if (!validator.isEmail(newEmail)) {
    return { error: 'email address is not valid' };
  }

  // validating nameFirst
  if (isNameValid(newNameFirst) !== true) {
    return { error: 'nameFirst is not valid' };
  }

  // validating nameLast
  if (isNameValid(newNameLast) !== true) {
    return { error: 'nameLast is not valid' };
  }

  // all checks have been passed

  user.email = newEmail;
  user.nameFirst = newNameFirst;
  user.nameLast = newNameLast;
  setData(data);
  return {};
};

/**
 * Given a set of properties, update those properties of this logged in admin user.
 * @param {token: string} string for session token
 * @param {oldPassword: string} string for old password
 * @param {newPassword: string} string for updated password
 *
 * @returns {error: string} string for error returned
 * @returns {} on success return blank object
 */

export const adminUpdateUserPassword = (token: string, oldPassword: string, newPassword: string): Error | EmptyObject => {
  // write ur function here

  const data = getData();
  const user = data.users.find((user: user) => user.tokenIds.includes(token));

  if (getHashOf(oldPassword) !== user.password) {
    return { error: 'old password is incorrect' };
  }
  if (oldPassword === newPassword) {
    return { error: 'new password cannot match old password' };
  }

  // validating password
  if (isPasswordValid(newPassword) !== true) {
    return { error: 'password is not valid' };
  }

  // check if previous password
  if (user.previousPasswords.includes(getHashOf(newPassword))) {
    return { error: 'cannot use a previous password' };
  }

  user.previousPasswords.push(user.password);
  user.password = getHashOf(newPassword);
  setData(data);
  return {};
};
