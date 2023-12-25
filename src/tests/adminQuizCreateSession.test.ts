import {
  adminAuthRegisterT,
  adminQuizCreateT2,
  adminQuizCreateSessionT,
  adminQuizCreateQuestionT2,
  clearT
} from './reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminQuizStartSession tests', () => {
  let authUserToken: string;
  let createdQuizId: number;

  beforeEach(() => {
    authUserToken = adminAuthRegisterT('abc123@gmail.com', 'password1', 'Ray', 'Li').token;
    const quiz = adminQuizCreateT2(authUserToken, 'quiz1', 'Camels').return;
    createdQuizId = quiz.quizId;
    adminQuizCreateQuestionT2(createdQuizId, authUserToken, {
      question: "What's the tallest animal?",
      duration: 30,
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      points: 10,
      answers: [
        { answer: 'Giraffe', correct: true },
        { answer: 'Elephant', correct: false }
      ]
    });
  });

  test('Invalid user Id error', () => {
    const invalidToken = 'invalidToken';
    expect(adminQuizCreateSessionT(invalidToken, createdQuizId, 3).Code).toBe(401);
  });

  test('autoStartNum greater than 50', () => {
    expect(adminQuizCreateSessionT(authUserToken, createdQuizId, 51).Code).toBe(400);
  });

  test('10 sessions already active', () => {
    for (let i = 0; i < 10; i++) {
      adminQuizCreateSessionT(authUserToken, createdQuizId, 3);
    }
    expect(adminQuizCreateSessionT(authUserToken, createdQuizId, 3).Code).toBe(400);
  });

  test('Session start success', () => {
    const sessionResponse = adminQuizCreateSessionT(authUserToken, createdQuizId, 3);
    expect(sessionResponse.return).toStrictEqual({ sessionId: expect.any(Number) });
  });

  /*
  test('Session start success', () => {
    const sessionResponse = adminQuizCreateSessionT(authUserToken, createdQuizId, 3);
    return (
        expect(sessionResponse).toStrictEqual({
        sessionId: expect.any(Number),
        quizId: createdQuizId,
        autoStartNum: 3,
        sessionOwnerId: expect.any(Number),
        sessionPlayersId: expect.any(Array),
        state: expect.any(String)
      }))
    })
  */
});
