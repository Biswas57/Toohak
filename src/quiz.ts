import {
  user,
  quiz,
  getData,
  setData,
  question,
  questionBody,
  answerBody,
  session
} from './dataStore';

import { quizSessionStatusHelper } from './helperFunctions';

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId - identifer code for a user
 *
 * @returns {
 *  Array<{
 *    quizId: number,
 *    name: string
 *  }>
 * } upon success
 * @returns {error: string} if authUserId is invalid
 */
export function adminQuizList(authUserId: number) {
  const data = getData();
  // check if authUserId currently exists and returns error case if it does not
  const user = data.users.find((user: user) => user.authUserId === authUserId);
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  }
  const ownedQuizzes = data.quizzes.filter((quiz: quiz) => quiz.quizOwnerId === authUserId);

  const adminQuizListReturnObject = { quizzes: [] as Array<{quizId: number, name: string}> };
  ownedQuizzes.forEach((ownedQuiz: quiz) => {
    adminQuizListReturnObject.quizzes.push({
      quizId: ownedQuiz.quizId,
      name: ownedQuiz.name,
    });
  });

  // returns list of quizzes if given valid authUserId
  return adminQuizListReturnObject;
}

// Function adminQuizCreate creates a quiz for the currently logged in user
/**
 * @param {number} authUserId -The logged in user's id
 * @param {string} name -Name of the quiz to be created
 * @param {string} description -Description of the quiz to be created
 *
 * @returns {{number}} -Object containing newly created quiz's id
 */
export function adminQuizCreate (authUserId: number, name: string, description: string) {
  const data = getData();
  // Error checking
  // Testing if authUserId is valid
  const user = data.users.find((user: user) => user.authUserId === authUserId);
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  }

  // Testing if name contains any characters that are not alphanumeric or are spaces
  if (!/^[A-Za-z0-9 ]*$/.test(name)) {
    return {
      error: 'Name contains any characters that are not alphanumeric or are spaces'
    };
  }

  // Name < 3 or > 30 characters
  if (name.length < 3 || name.length > 30) {
    return { error: 'Name is either less than 3 characters long or more than 30 characters long' };
  }

  // Name is already being used by the current logged in user for another quiz
  const existingQuizzes = data.quizzes.filter((quiz: quiz) =>
    quiz.quizOwnerId === authUserId);

  const ownedQuizzes = existingQuizzes.find((quiz: quiz) => quiz.name === name);
  if (ownedQuizzes !== undefined) {
    return { error: 'Name is already used by the current logged in user for another quiz' };
  }

  // Checking if the description is over 100 characters in length
  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  // Creating new quizId
  let quizId = 0;
  if (data.quizzes.length !== 0) {
    for (const quiz of data.quizzes) {
      if (quizId < quiz.quizId) {
        quizId = quiz.quizId;
      }
    }
  }
  if (data.quizzesTrash.length !== 0) {
    for (const quiz of data.quizzesTrash) {
      if (quizId < quiz.quizId) {
        quizId = quiz.quizId;
      }
    }
  }
  quizId++;

  // Assumption that time edited is also time created
  const timeCreated = Math.floor((new Date()).getTime() / 1000);
  const timeLastEdited = timeCreated;

  // Creating a new quiz
  const newQuiz = {
    quizId: quizId,
    name: name,
    timeCreated: timeCreated,
    timeLastEdited: timeLastEdited,
    description: description,
    numQuestions: 0,
    questions: [] as Array<question>,
    quizOwnerId: authUserId,
    quizPlayers: [] as Array<number>,
    duration: 0,
    thumbnailUrl: ''
  };

  // Adding the quiz into dataStore
  data.quizzes.push(newQuiz);
  user.quizIds.push(quizId);
  setData(data);
  return {
    quizId: quizId,
  };
}

/**
  * Given a particular quiz, permanently remove the quiz.
  *
  * @param {number} authUserId - number corresponding to a user
  * @param {number} quizId - number corresponding to a quiz
  *
  * @returns {} - empty object
  */
export function adminQuizRemove(authUserId: number, quizId: number) {
  const data = getData();

  // validationg authUserId
  const user = data.users.find((user: user) => user.authUserId === authUserId);
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  }

  // validating quizId
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId that you have entered does not exist' };
  }

  // checking if user is the owner of quiz
  if (quiz.quizOwnerId !== authUserId) {
    return { error: 'quiz doesn\'t belong to the user that you have entered hhh' };
  }

  const sessions = data.sessions.filter((session: session) => (session.quizId === quizId && session.state !== 'END'));
  if (sessions.length !== 0) {
    return { error: 'there are sessions for this quiz that are not in END state' };
  }

  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  data.quizzesTrash.push(data.quizzes[data.quizzes.indexOf(quiz)]);
  data.quizzes.splice(data.quizzes.indexOf(quiz), 1);
  setData(data);

  return {};
}

/**
 * Recieving the authUserId and quizId to return details
 * of the quiz created by the user
 *
 * @param {number} authUserId - number corresponding to a user
 * @param {number} quizId - number corresponding to a quiz
 *
 * @returns { error: string } - if given information is not valid
 * @returns {
 *    {
 *      quizId: number,
 *      name: string,
 *      timeCreated: number,
 *      timeLastEdited: number,
 *      description: string,
 *    }
 * } - given correct authUserId and quizId, returns the quizId and all the details relating to the quiz
 */
export function adminQuizInfo(authUserId: number, quizId: number) {
  const data = getData();

  // validating quizId

  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId that you have entered does not exist' };
  }

  // checking if user is the owner of quiz
  if (quiz.quizOwnerId !== authUserId) {
    return { error: 'quiz doesn\'t belong to the user that you have entered' };
  }

  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    numQuestions: quiz.numQuestions,
    questions: quiz.questions,
    duration: quiz.duration,
    thumbnailUrl: quiz.thumbnailUrl,
  };
}

/**
 * Updates the name of the relevant quiz.
 *
 * @param {number} authUserId - unique identifier for a user.
 * @param {number} quizId - unique identifier for a quiz.
 * @param {string} name - new name of quiz.
 *
 * @returns {{}}
 */
export function adminQuizNameUpdate(authUserId: number, quizId: number, name: string) {
  let data = getData();
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  // error checking

  // case where name contains any characters that are not alphanumeric
  // or are spaces
  if (!/^[A-Za-z0-9 ]*$/.test(name)) {
    return {
      error: 'Name contains any characters that are not alphanumeric or are spaces'
    };
  }

  // case where name < 3 or > 30 characters
  if (name.length < 3 || name.length > 30) {
    return {
      error: 'Name is either less than 3 characters long or more than 30 characters long'
    };
  }

  // case where name is already being used by the current logged in
  // user for another quiz
  const existingQuizzes = data.quizzes.filter((quiz: quiz) => (quiz.quizOwnerId === authUserId && quiz.quizId !== quizId));
  const quiz1 = existingQuizzes.find((quiz: quiz) => quiz.name === name);
  if (quiz1 !== undefined) {
    return { error: 'Name is already used by the current logged in user for another quiz' };
  }

  // updates the name and time last edited
  quiz.name = name;
  // const time = Math.floor((new Date()).getTime() / 1000);
  // quiz.timeLastEdited = time;
  setData(data);
  data = getData();

  return {};
}

/**
 * Update the description of the relevant quiz.
 *
 * @param {number} authUserId - identifer code for a user
 * @param {number} quizId - identifier code for a quiz
 * @param {string} description - description of the changed quiz
 *
 * @returns {{}} - empty object
 */

export function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string) {
  const data = getData();

  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  // error checking

  // Checking if the description is over 100 characters in length
  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  // updates the description
  quiz.description = description;
  // const time = Math.floor((new Date()).getTime() / 1000);
  // quiz.timeLastEdited = time;
  setData(data);
  return {};
}

export function adminQuizRemovedView(authUserId: number) {
  const data = getData();

  // check if authUserId currently exists and returns error case if it does not

  const ownedQuizzes = data.quizzesTrash.filter((quiz: quiz) => quiz.quizOwnerId === authUserId);

  const adminQuizRemovedViewReturnObject = { quizzes: [] as Array<{quizId: number, name: string}> };
  ownedQuizzes.forEach((ownedQuiz: quiz) => {
    adminQuizRemovedViewReturnObject.quizzes.push({
      quizId: ownedQuiz.quizId,
      name: ownedQuiz.name,
    });
  });

  // returns list of quizzes if given valid authUserId
  return adminQuizRemovedViewReturnObject;
}
export function adminQuizRestore(quizId: number, authUserId: number) {
  const data = getData();

  const quiz = data.quizzesTrash.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId does not exist in the trash' };
  }

  const existingQuizzes = data.quizzes.find((quizzes: quiz) => (quizzes.quizOwnerId === authUserId && quizzes.name === quiz.name));
  if (existingQuizzes !== undefined) {
    return { error: 'Name of the quiz is used by an active quiz' };
  }

  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  data.quizzes.push(quiz);
  data.quizzesTrash.splice(data.quizzesTrash.indexOf(quiz), 1);
  setData(data);
  return {};
}

// Function createQuizQuestion creates a question for the current quiz
/**
 * @param {number} authUserId -The logged in user's id
 * @param {number} quizId -The current quiz id
 * @param {questionBody} question -Question being asked
 *
 * @returns {{number}} -Object containing newly created question's id
 * @returns { error: string } - if given information is not valid
 */

export function adminQuizCreateQuestion(quizId: number, question: questionBody) {
  const data = getData();
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  // ERROR CHECKING
  if (question.question.length < 5 || question.question.length > 50) {
    return { error: 'invalid question length' };
  }
  if (question.answers.length < 2 || question.answers.length > 6) {
    return { error: 'invalid amount of answers' };
  }
  if (question.duration < 0) {
    return { error: 'duration must be positive' };
  }
  if (quiz.duration + question.duration > 180) {
    return { error: 'quiz is too long' };
  }
  if (question.points < 1 || question.points > 10) {
    return { error: 'invalid number of points' };
  }
  for (const answer of question.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return { error: 'invalid answer length' };
    }
  }
  let sameAnswer: Array<answerBody>;
  for (const answer of question.answers) {
    sameAnswer = question.answers.filter(item => item.answer === answer.answer);
    if (sameAnswer.length > 1) {
      return { error: 'cannot have duplicate answers' };
    }
  }
  if (question.answers.find(item => item.correct === true) === undefined) {
    return { error: 'must have a correct answer' };
  }
  if (question.thumbnailUrl === '') {
    return { error: 'thumbnailUrl cannot be an empty string' };
  }
  if (!(question.thumbnailUrl.endsWith('jpg') || question.thumbnailUrl.endsWith('jpeg') || question.thumbnailUrl.endsWith('png'))) {
    return { error: 'thumbnailUrl must ends with jpg, jpeg or png' };
  }
  if (!(question.thumbnailUrl.startsWith('http://') || question.thumbnailUrl.startsWith('https://'))) {
    return { error: 'thumbnailUrl must starts with https.// or http.//' };
  }
  // CREATE QUESTION

  let questionId = 0;
  if (quiz.questions.length !== 0) {
    for (const question of quiz.questions) {
      if (questionId < question.questionId) {
        questionId = question.questionId;
      }
    }
    questionId++;
  }
  const newQuestion: question = {
    questionId: questionId,
    question: question.question,
    duration: question.duration,
    thumbnailUrl: question.thumbnailUrl,
    points: question.points,
    answers: [],
  };
  let answerId = 0;
  const colours: string[] = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  let randomColour: number;
  for (const answer of question.answers) {
    answerId++;
    randomColour = Math.floor(Math.random() * colours.length);
    newQuestion.answers.push(
      {
        answerId: answerId,
        answer: answer.answer,
        colour: colours[randomColour],
        correct: answer.correct
      }
    );
  }
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  quiz.duration = quiz.duration + newQuestion.duration;
  quiz.numQuestions++;
  quiz.questions.push(newQuestion);

  setData(data);
  return { questionId: newQuestion.questionId };
}

// Function adminQuizUpdateQuestion updates the given question for the current quiz
/**
 * @param {number} questionId -Question that needs to be updated
 * @param {number} quizId -The current quiz id
 * @param {questionBody} question -New question
 *
 * @returns {{number}} -Object containing newly created question's id
 * @returns { error: string } - if given information is not valid
 */

export function adminQuizUpdateQuestion(questionId: number, quizId: number, newQuestion: questionBody) {
  const data = getData();
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  const oldQuestion = quiz.questions.find((question: question) => question.questionId === questionId);

  // ERROR CHECKING
  if (oldQuestion === undefined) {
    return { error: 'question does not exist' };
  }
  if (newQuestion.question.length < 5 || newQuestion.question.length > 50) {
    return { error: 'invalid question length' };
  }
  if (newQuestion.answers.length < 2 || newQuestion.answers.length > 6) {
    return { error: 'invalid amount of answers' };
  }
  if (newQuestion.duration < 0) {
    return { error: 'duration must be positive' };
  }
  if (quiz.duration - oldQuestion.duration + newQuestion.duration > 180) {
    return { error: 'quiz is too long' };
  }
  if (newQuestion.points < 1 || newQuestion.points > 10) {
    return { error: 'invalid number of points' };
  }
  for (const answer of newQuestion.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return { error: 'invalid answer length' };
    }
  }
  let sameAnswer: Array<answerBody>;
  for (const answer of newQuestion.answers) {
    sameAnswer = newQuestion.answers.filter(item => item.answer === answer.answer);
    if (sameAnswer.length > 1) {
      return { error: 'cannot have duplicate answers' };
    }
  }
  if (!newQuestion.answers.find(item => item.correct === true)) {
    return { error: 'must have a correct answer' };
  }
  if (newQuestion.thumbnailUrl === '') {
    return { error: 'thumbnailUrl cannot be an empty string' };
  }
  if (!(newQuestion.thumbnailUrl.endsWith('jpg') || newQuestion.thumbnailUrl.endsWith('jpeg') || newQuestion.thumbnailUrl.endsWith('png'))) {
    return { error: 'thumbnailUrl must ends with jpg, jpeg or png' };
  }
  if (!(newQuestion.thumbnailUrl.startsWith('http://') || newQuestion.thumbnailUrl.startsWith('https://'))) {
    return { error: 'thumbnailUrl must starts with https.// or http.//' };
  }
  // UPDATE QUESTION

  quiz.duration = quiz.duration - oldQuestion.duration + newQuestion.duration;
  oldQuestion.question = newQuestion.question;
  oldQuestion.duration = newQuestion.duration;
  oldQuestion.thumbnailUrl = newQuestion.thumbnailUrl;
  oldQuestion.points = newQuestion.points;
  let answerId = 0;
  oldQuestion.answers = [];
  const colours:string[] = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  let randomColour:number;
  for (const answer of newQuestion.answers) {
    answerId++;
    randomColour = Math.floor(Math.random() * colours.length);
    oldQuestion.answers.push(
      {
        answerId: answerId,
        answer: answer.answer,
        colour: colours[randomColour],
        correct: answer.correct
      }
    );
  }
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);

  setData(data);
  return {};
}
export function adminEmptyTrash(authUserId: number, quizIds: Array<number>) {
  const data = getData();

  const searchInTrash = quizIds.map((quizId) => {
    return (data.quizzesTrash.find((quiz: quiz) => quiz.quizId === quizId));
  });
  const notExistInTrash = searchInTrash.filter(element => typeof (element) === 'undefined');
  if (notExistInTrash.length !== 0) {
    return { error: 'One or more of the Quiz IDs is not currently in the trash' };
  }

  searchInTrash.map((quiz) => {
    return data.quizzesTrash.splice(data.quizzesTrash.indexOf(quiz), 1);
  }
  );

  const user = data.users.find((user: user) => user.authUserId === authUserId);
  const position = data.users.indexOf(user);
  quizIds.map((quizId) => {
    const positionQuiz = data.users[position].quizIds.indexOf(quizId);
    return data.users[position].quizIds.splice(positionQuiz, 1);
  }
  );

  setData(data);
  return {};
}

export function adminQuizTransfer(quizId: number, authUserId: number, userEmail: string) {
  const data = getData();

  let user = data.users.find((user: user) => user.email === userEmail);
  if (user === undefined) {
    return { error: 'email is not a valid user' };
  }

  if (user.authUserId === authUserId) {
    return { error: 'email and token belong to same user' };
  }

  const transferQuiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  const newOwnerQuizzes = data.quizzes.filter((quiz: quiz) => quiz.quizOwnerId === user.authUserId);
  const newOwnerQuizzesNames = newOwnerQuizzes.map((quiz: quiz) => quiz.name);
  if (newOwnerQuizzesNames.includes(transferQuiz.name)) {
    return { error: 'target owner has a quiz by this name' };
  }

  const sessions = data.sessions.filter((session: session) => (session.quizId === quizId && session.state !== 'END'));
  if (sessions.length !== 0) {
    return { error: 'there are sessions for this quiz that are not in END state' };
  }

  user.quizIds.push(quizId);
  transferQuiz.quizOwnerId = user.authUserId;
  user = data.users.find((user: user) => user.authUserId === authUserId);
  user.quizIds.splice(user.quizIds.indexOf(quizId), 1);
  setData(data);
  return {};
}

export function adminQuizQuestionDelete(quizId: number, questionId: number, authUserId: number) {
  const data = getData();

  let quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  quiz = quiz.questions;
  const delQuestion = quiz.find((question: question) => question.questionId === questionId);
  if (delQuestion === undefined) {
    return { error: 'questionId that you have entered does not exist' };
  }

  const sessions = data.sessions.filter((session: session) => (session.quizId === quizId && session.state !== 'END'));
  if (sessions.length !== 0) {
    return { error: 'there are sessions for this quiz that are not in END state' };
  }

  quiz.splice(quiz.indexOf(delQuestion), 1);

  setData(data);
  return {};
}

export function adminQuizQuestionMove(quizId: number, questionId: number, authUserId: number, newPosition: number) {
  const data = getData();

  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  const questionsArray = quiz.questions;

  const movQuestion = questionsArray.find((question: question) => question.questionId === questionId);
  if (movQuestion === undefined) {
    return { error: 'questionId that you have entered does not exist' };
  }

  if (newPosition <= -1 || newPosition >= questionsArray.length || newPosition === questionsArray.indexOf(movQuestion)) {
    return { error: 'wrong newPosition' };
  }
  questionsArray.splice(questionsArray.indexOf(movQuestion), 1);

  const newQuestionsArray = [];
  let pushed = 0;
  for (let i = 0; i < questionsArray.length; i++) {
    if (i === newPosition && pushed === 0) {
      newQuestionsArray.push(movQuestion);
      i--;
      pushed = 1;
    } else {
      newQuestionsArray.push(questionsArray[i]);
    }
  }
  if (newPosition === questionsArray.length) {
    newQuestionsArray.push(movQuestion);
  }
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  data.quizzes[data.quizzes.indexOf(quiz)].questions = newQuestionsArray;

  setData(data);
  return {};
}

export function adminQuizQuestionDuplicate(quizId: number, questionId: number, authUserId: number) {
  const data = getData();

  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  const questionsArray = quiz.questions;
  const dupQuestion = questionsArray.find((question: question) => question.questionId === questionId);
  if (dupQuestion === undefined) {
    return { error: 'questionId that you have entered does not exist' };
  }
  const maxQuestionId = Math.max(...questionsArray.map((question: question) => question.questionId)) + 1;
  const newQuestionsArray = [];
  let pushed = 0;
  for (let i = 0; i < questionsArray.length; i++) {
    if (newQuestionsArray[newQuestionsArray.length - 1] === dupQuestion && pushed === 0) {
      newQuestionsArray.push(
        {
          questionId: maxQuestionId,
          question: dupQuestion.question,
          duration: dupQuestion.duration,
          thumbnailUrl: dupQuestion.thumbnailUrl,
          points: dupQuestion.points,
          answers: dupQuestion.answers
        }
      );
      i--;
      pushed = 1;
    } else {
      newQuestionsArray.push(questionsArray[i]);
    }
  }
  if (pushed === 0) {
    newQuestionsArray.push(
      {
        questionId: maxQuestionId,
        question: dupQuestion.question,
        duration: dupQuestion.duration,
        thumbnailUrl: dupQuestion.thumbnailUrl,
        points: dupQuestion.points,
        answers: dupQuestion.answers
      }
    );
  }
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  data.quizzes[data.quizzes.indexOf(quiz)].questions = newQuestionsArray;
  setData(data);
  return { newQuestionId: maxQuestionId };
}

// ---------------------------------------------------------------------
// -------------------------iter3 new functions-------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
export function adminQuizSessionsList(authUserId: number, quizId: number) {
  const data = getData();

  // Example logic for filtering active and inactive sessions
  // This assumes you have a structure to store session information in your dataStore
  const activeSessions = data.sessions.filter((session: session) => (session.quizId === quizId && session.state !== 'END'));
  const inactiveSessions = data.sessions.filter((session: session) => (session.quizId === quizId && session.state === 'END'));

  return {
    activeSessions: activeSessions.map((session: session) => session.sessionId).sort((a: number, b: number) => a - b),
    inactiveSessions: inactiveSessions.map((session: session) => session.sessionId).sort((a: number, b: number) => a - b),
  };
}

// Function adminQuizStartSession starts a new session for a quiz
// This copies the quiz, so that any edits whilst a session is running does not affect active session
/**
 * @param {number} authUserId - User that is starting the session
 * @param {number} quizId -The current quiz id
 * @param {number} autoStartNum - Current quiz session number
 *
 * @returns {{number}} - Object containing newly created question sessions's start number
 * @returns { error: string } - if given information is not valid
 */
export function adminQuizCreateSession (authUserId: number, quizId: number, autoStartNum: number) {
  const data = getData();

  const activeQuizSessions = data.sessions.filter((session: session) => session.quizId === quizId && session.state === 'ACTIVE');
  if (activeQuizSessions.length >= 10) {
    return { error: 'There are already 10 quiz sessions active' };
  }

  if (autoStartNum > 50) {
    return { error: 'autoStartNum cannot be greater than 50' };
  }

  const quiz = data.quizzes.find((quizs: quiz) => quizs.quizId === quizId);
  if (quiz.questions.length === 0) {
    return { error: 'Quiz does not exist or has no questions' };
  }

  const newSession: session = {
    sessionId: Math.floor(Math.random() * 10000),
    quizId: quizId,
    autoStartNum: autoStartNum,
    sessionOwnerId: authUserId,
    sessionPlayersId: [],
    userRankedByScore: [],
    questionResults: [],
    state: 'ACTIVE',
    atQuestion: 0
  };

  data.sessions.push(newSession);
  setData(data);

  return {
    sessionId: newSession.sessionId
  };
}

export function adminQuizThumbnailUpdate(quizId: number, authUserId: number, imgUrl: string) {
  return { replace: 'rplace me' };
}

export function adminSessionUpdateStatus(quizId: number, sessionId: number, authUserId: number, action: string) {
  const data = getData();
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId) {
      for (const session of data.sessions) {
        if (session.sessionId === sessionId) {
          return {
            state: session.state,
            atQuestion: session.atQuestion,
            players: quizSessionStatusHelper(quiz.quizPlayers, 'name'),
            metadata: {
              quizId: quiz.quizId,
              name: quiz.name,
              timeCreated: quiz.timeCreated,
              timeLastEdited: quiz.timeLastEdited,
              description: quiz.description,
              numQuestions: quiz.numQuestions,
              questions: quiz.questions,
              duration: quiz.duration,
              thumbnailUrl: quiz.thumbnailUrl
            }
          };
        }
      }
      return { error: 'sessionId not found 400' };
    }
  }
}

export function adminQuestionSubmission(answerIds: Array<number>, playerId: number, questionPosition: number) {
  return { replace: 'rplace me' };
}

export function adminQuizSessionStatus(authUserId: number, quizId: number, sessionId: number) {
  return { replace: 'rplace me' };
}

export function adminQuizSessionFinalResult(authUserId: number, quizId: number, sessionId: number) {
  return { replace: 'rplace me' };
}

export function adminQuizSessionFinalResultsCSV(authUserId: number, quizId: number, sessionId: number) {
  return { replace: 'rplace me' };
}

export function adminUserGuest(playerId: number) {
  return { replace: 'rplace me' };
}

export function adminQuestionInfoPlayer(playerId: number, questionPosition: number) {
  return { replace: 'rplace me' };
}

export function adminQuestionResult(playerId: number, questionPosition: number) {
  return { replace: 'rplace me' };
}

export function adminSessionFinalResults(playerId: number) {
  return { replace: 'rplace me' };
}

export function adminQuizViewMessages(playerId: number) {
  return { replace: 'rplace me' };
}

export function adminQuizCreateGuest(sessionId: number, name: string) {
  return { replace: 'rplace me' };
}

export function adminQuizSendMessage(playerId: number, message: string) {
  return { replace: 'rplace me' };
}
