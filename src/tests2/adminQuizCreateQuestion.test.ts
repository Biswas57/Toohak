import {
  adminQuizCreateT2,
  adminAuthRegisterT,
  adminQuizInfoT2,
  adminQuizCreateQuestionT2,
  clearT
} from '../tests/reqFunctions';
import { questionBody } from '../dataStore';

beforeEach(() => {
  clearT();
});

describe('adminQuizCreateQuestionT2 HTTP server', () => {
  let questionValid: questionBody;
  let userId: string;
  let quizId: number;
  beforeEach(() => {
    questionValid = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    userId = adminAuthRegisterT('student@gmail.com', 'password1', 'daniel', 'zanatta').token;
    quizId = adminQuizCreateT2(userId, 'myQuiz', 'example').return.quizId;
  });

  test('Invalid authUserId', () => {
    expect(adminQuizCreateQuestionT2(quizId, '1', questionValid).Code).toBe(401);
  });
  test('Quiz not own by user', () => {
    const userId2 = adminAuthRegisterT('unsw@gmail.com', 'password2', 'daniella', 'zanatta').token;
    expect(adminQuizCreateQuestionT2(quizId, userId2, questionValid).Code).toBe(403);
  });
  test('Question too short', () => {
    const questionShort = {
      question: 'a',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionShort).Code).toBe(400);
  });
  test('Question too long', () => {
    const questionLong = {
      question: 'This description is too long This description is too long',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionLong).Code).toBe(400);
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
    expect(adminQuizCreateQuestionT2(quizId, userId, questionManyAnswers).Code).toBe(400);
  });
  test('Not enough answers', () => {
    const questionLessAnswers = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionLessAnswers).Code).toBe(400);
  });
  test('Negative duration', () => {
    const questionNegativeDuration = {
      question: 'Who is the Monarch of England?',
      duration: -2,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionNegativeDuration).Code).toBe(400);
  });
  test('Quiz duration too long', () => {
    const questionLongDuration = {
      question: 'Who is the Monarch of England?',
      duration: 200,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionLongDuration).Code).toBe(400);
  });
  test('Not enough points', () => {
    const questionNoPoints = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 0,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionNoPoints).Code).toBe(400);
  });
  test('Too many points', () => {
    const questionManyPoints = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 23,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionManyPoints).Code).toBe(400);
  });
  test('Answer too short', () => {
    const questionShortAnswer = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: '', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionShortAnswer).Code).toBe(400);
  });
  test('Answer too long', () => {
    const questionLongAnswer = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'This answer is way too long!!!!', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionLongAnswer).Code).toBe(400);
  });
  test('Duplicate answers', () => {
    const questionSameAnswer = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Daniel', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionSameAnswer).Code).toBe(400);
  });
  test('No correct answers', () => {
    const questionNoneCorrect = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: false }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    expect(adminQuizCreateQuestionT2(quizId, userId, questionNoneCorrect).Code).toBe(400);
  });

  test('Valid question creation', () => {
    expect(adminQuizCreateQuestionT2(quizId, userId, questionValid).return).toStrictEqual({ questionId: 0 });
    expect(adminQuizInfoT2(userId, quizId).return).toStrictEqual(
      {
        quizId: expect.any(Number),
        name: 'myQuiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'example',
        numQuestions: 1,
        questions: [
          {
            questionId: expect.any(Number),
            question: 'Who is the Monarch of England?',
            duration: 4,
            thumbnailUrl: 'http://google.com/some/image/path.jpg',
            points: 5,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'Prince Charles',
                colour: expect.any(String),
                correct: true
              },
              {
                answerId: expect.any(Number),
                answer: 'Daniel',
                colour: expect.any(String),
                correct: false
              },
              {
                answerId: expect.any(Number),
                answer: 'Student',
                colour: expect.any(String),
                correct: false
              }
            ]
          }
        ],
        duration: 4,
        thumbnailUrl: ''
      }
    );
    clearT();
  });
});
