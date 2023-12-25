import {
  adminQuizCreateT2,
  adminAuthRegisterT,
  adminQuizCreateQuestionT2,
  adminQuizQuestionUpdateT2,
  clearT,
  adminQuizInfoT2
} from '../tests/reqFunctions';
import { question, questionBody } from '../dataStore';

beforeEach(() => {
  clearT();
});

describe('adminQuizCreateQuestionT2 HTTP server', () => {
  let question: questionBody;
  let userId: string;
  let quizId: number;
  let questionId: number;
  beforeEach(() => {
    question = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    userId = adminAuthRegisterT('student@gmail.com', 'password1', 'daniel', 'zanatta').token;
    quizId = adminQuizCreateT2(userId, 'myQuiz', 'example').return.quizId;
    questionId = adminQuizCreateQuestionT2(quizId, userId, question).return.questionId;
  });

  test('Invalid authUserId', () => {
    expect(adminQuizQuestionUpdateT2(quizId, questionId, '1', question).Code).toBe(401);
  });
  test('Quiz not own by user', () => {
    const userId2 = adminAuthRegisterT('unsw@gmail.com', 'password2', 'daniella', 'zanatta').token;
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId2, question).Code).toBe(403);
  });
  test('Invalid questionId', () => {
    expect(adminQuizQuestionUpdateT2(quizId, 1, userId, question).Code).toBe(400);
  });
  test('Question too short', () => {
    const questionShort = {
      question: 'a',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionShort).Code).toBe(400);
  });
  test('Question too long', () => {
    const questionLong = {
      question: 'This description is too long This description is too long',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionLong).Code).toBe(400);
  });
  test('Too many answers', () => {
    const questionManyAnswers = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Me', correct: false }, { answer: 'You', correct: false },
        { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }, { answer: 'UNSW', correct: false }, { answer: 'COMP1531', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionManyAnswers).Code).toBe(400);
  });
  test('Not enough answers', () => {
    const questionLessAnswers = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionLessAnswers).Code).toBe(400);
  });
  test('Negative duration', () => {
    const questionNegativeDuration = {
      question: 'Who is the Monarch of England?',
      duration: -2,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionNegativeDuration).Code).toBe(400);
  });
  test('Quiz duration too long', () => {
    const questionLongDuration = {
      question: 'Who is the Monarch of England?',
      duration: 200,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionLongDuration).Code).toBe(400);
  });
  test('Not enough points', () => {
    const questionNoPoints = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 0,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionNoPoints).Code).toBe(400);
  });
  test('Too many points', () => {
    const questionManyPoints = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 23,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionManyPoints).Code).toBe(400);
  });
  test('Answer too short', () => {
    const questionShortAnswer = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: '', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionShortAnswer).Code).toBe(400);
  });
  test('Answer too long', () => {
    const questionLongAnswer = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'This answer is way too long!!!!', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionLongAnswer).Code).toBe(400);
  });
  test('Duplicate answers', () => {
    const questionSameAnswer = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Daniel', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionSameAnswer).Code).toBe(400);
  });
  test('No correct answers', () => {
    const questionNoneCorrect = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: false }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, questionNoneCorrect).Code).toBe(400);
  });

  test('Valid question creation', () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    const newQuestionBody: questionBody = {
      question: 'Is COMP1531 hard?',
      duration: 5,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 6,
      answers: [{ answer: 'No', correct: true }, { answer: 'Yes', correct: false }, { answer: 'Maybe', correct: false }]
    };
    const newQuestion: question = {
      questionId: questionId,
      question: 'Is COMP1531 hard?',
      duration: 5,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 6,
      answers: [{ answerId: expect.any(Number), answer: 'No', colour: expect.any(String), correct: true },
        { answerId: expect.any(Number), answer: 'Yes', colour: expect.any(String), correct: false },
        { answerId: expect.any(Number), answer: 'Maybe', colour: expect.any(String), correct: false }]
    };
    expect(adminQuizQuestionUpdateT2(quizId, questionId, userId, newQuestionBody).return).toStrictEqual({});
    expect(adminQuizInfoT2(userId, quizId).return).toStrictEqual(
      {
        quizId: quizId,
        name: 'myQuiz',
        timeCreated: expect.any(Number),
        timeLastEdited: time,
        description: 'example',
        numQuestions: 1,
        questions: [newQuestion],
        duration: 5,
        thumbnailUrl: ''
      }
    );
    clearT();
  });
});
