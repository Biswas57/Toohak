import {
  adminQuizCreateT2,
  adminAuthRegisterT,
  adminQuizCreateQuestionT2,
  adminQuizQuestionDeleteT2,
  adminQuizQuestionDuplicateT2,
  adminQuizQuestionMoveT2,
  adminQuizInfoT2,
  clearT,

} from '../tests/reqFunctions';
import { questionBody } from '../dataStore';

beforeEach(() => {
  clearT();
});

describe('adminQuizQuestionDuplicateT2 HTTP server', () => {
  let question: questionBody;
  let question2: questionBody;
  let question3: questionBody;
  let userId: string;
  let quizId: number;
  let questionId: number;
  let questionId3: number;

  beforeEach(() => {
    question = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      thumbnailUrl: 'http://google.com/2some/image/path.jpg',
      points: 4,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'Daniel', correct: false }, { answer: 'Student', correct: false }]
    };
    question2 = {
      question: 'why is UNSW so bad???',
      duration: 5,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 5,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'tutors suck', correct: false }, { answer: 'lecturer suck', correct: false }]
    };
    question3 = {
      question: 'why is UNSW so good???',
      duration: 6,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 6,
      answers: [{ answer: 'Prince Charles', correct: true }, { answer: 'tutors suck', correct: false }, { answer: 'lecturer suck', correct: false }]
    };
    userId = adminAuthRegisterT('student@gmail.com', 'password1', 'daniel', 'zanatta').token;
    quizId = adminQuizCreateT2(userId, 'myQuiz', 'example').return.quizId;
    questionId = adminQuizCreateQuestionT2(quizId, userId, question).return.questionId;
    adminQuizCreateQuestionT2(quizId, userId, question2);
    questionId3 = adminQuizCreateQuestionT2(quizId, userId, question3).return.questionId;
  });

  test('Invalid authUserId', () => {
    expect(adminQuizQuestionDuplicateT2(quizId, questionId, '1').Code).toBe(401);
  });
  test('Quiz not own by user', () => {
    const userId2 = adminAuthRegisterT('unsw@gmail.com', 'password2', 'daniella', 'zanatta').token;
    expect(adminQuizQuestionDuplicateT2(quizId, questionId, userId2).Code).toBe(403);
  });
  test('Invalid questionId', () => {
    expect(adminQuizQuestionDuplicateT2(quizId, 100, userId).Code).toBe(400);
  });

  test('Valid question duplicate', () => {
    adminAuthRegisterT('unsw@gmail.com', 'password2', 'daniella', 'zanatta');
    expect(adminQuizInfoT2(userId, quizId).return.questions).toStrictEqual(
      [
        {
          questionId: 0,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: 'http://google.com/2some/image/path.jpg',
          points: 4,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'Daniel', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'Student', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 1,
          question: 'why is UNSW so bad???',
          duration: 5,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 5,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 2,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        }
      ]
    );
    const questionId4 = adminQuizQuestionDuplicateT2(quizId, questionId3, userId).return;
    expect(questionId4).toStrictEqual({ newQuestionId: expect.any(Number) });
    expect(adminQuizInfoT2(userId, quizId).return.questions).toStrictEqual(
      [
        {
          questionId: 0,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: 'http://google.com/2some/image/path.jpg',
          points: 4,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'Daniel', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'Student', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 1,
          question: 'why is UNSW so bad???',
          duration: 5,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 5,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 2,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 3,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
      ]
    );
    expect(adminQuizQuestionMoveT2(quizId, questionId4.newQuestionId, userId, 0).return).toStrictEqual({});
    expect(adminQuizInfoT2(userId, quizId).return.questions).toStrictEqual(
      [
        {
          questionId: 3,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 0,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: 'http://google.com/2some/image/path.jpg',
          points: 4,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'Daniel', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'Student', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 1,
          question: 'why is UNSW so bad???',
          duration: 5,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 5,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 2,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },

      ]
    );
    expect(adminQuizQuestionDuplicateT2(quizId, questionId, userId).return).toStrictEqual({ newQuestionId: expect.any(Number) });
    expect(adminQuizInfoT2(userId, quizId).return.questions).toStrictEqual(
      [
        {
          questionId: 3,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 0,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: 'http://google.com/2some/image/path.jpg',
          points: 4,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'Daniel', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'Student', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 4,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: 'http://google.com/2some/image/path.jpg',
          points: 4,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'Daniel', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'Student', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 1,
          question: 'why is UNSW so bad???',
          duration: 5,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 5,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 2,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },

      ]
    );
    expect(adminQuizQuestionDeleteT2(quizId, questionId, userId).return).toStrictEqual({});
    expect(adminQuizQuestionDuplicateT2(quizId, questionId, userId).Code).toBe(400);
    expect(adminQuizQuestionDuplicateT2(quizId, questionId3, userId).return).toStrictEqual({ newQuestionId: expect.any(Number) });
    expect(adminQuizInfoT2(userId, quizId).return.questions).toStrictEqual(
      [
        {
          questionId: 3,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 4,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: 'http://google.com/2some/image/path.jpg',
          points: 4,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'Daniel', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'Student', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 1,
          question: 'why is UNSW so bad???',
          duration: 5,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 5,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 2,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
        {
          questionId: 5,
          question: 'why is UNSW so good???',
          duration: 6,
          thumbnailUrl: 'http://google.com/some/image/path.jpg',
          points: 6,
          answers: [{ answerId: expect.any(Number), answer: 'Prince Charles', colour: expect.any(String), correct: true }, { answerId: expect.any(Number), answer: 'tutors suck', colour: expect.any(String), correct: false }, { answerId: expect.any(Number), answer: 'lecturer suck', colour: expect.any(String), correct: false }]
        },
      ]
    );
    clearT();
  });
});
