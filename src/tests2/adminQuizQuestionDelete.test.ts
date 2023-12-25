import {
  adminQuizCreateT2,
  adminAuthRegisterT,
  adminQuizCreateQuestionT2,
  adminQuizQuestionDeleteT2,
  adminQuizInfoT2,
  clearT,

} from '../tests/reqFunctions';
import { questionBody } from '../dataStore';

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
    expect(adminQuizQuestionDeleteT2(quizId, questionId, '1').Code).toBe(401);
  });
  test('Quiz not own by user', () => {
    const userId2 = adminAuthRegisterT('unsw@gmail.com', 'password2', 'daniella', 'zanatta').token;
    expect(adminQuizQuestionDeleteT2(quizId, questionId, userId2).Code).toBe(403);
  });
  test('Invalid questionId', () => {
    expect(adminQuizQuestionDeleteT2(quizId, 1, userId).Code).toBe(400);
  });

  test('Valid question creation', () => {
    adminAuthRegisterT('unsw@gmail.com', 'password2', 'daniella', 'zanatta');
    expect(adminQuizQuestionDeleteT2(quizId, questionId, userId).return).toStrictEqual({});
    expect(adminQuizInfoT2(userId, quizId).return.questions).toStrictEqual([]);
    clearT();
  });
});
