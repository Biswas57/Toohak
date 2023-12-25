import {
  adminAuthRegisterT,
  adminQuizCreateT2,
  adminQuizRemoveT2,
  adminQuizListT2,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('Testing Quiz Deletion', () => {
  let userA: {token: string};
  let userB: {token: string};
  let sportQuiz: {quizId: number};
  let basketballQuiz: {quizId: number};
  let tennisQuiz: {quizId: number};

  beforeEach(() => {
    userA = adminAuthRegisterT('sampleemail1@gmail.com', 'SecurePass1', 'Alvin', 'He');
    userB = adminAuthRegisterT('sampleemail2@gmail.com', 'SecurePass2', 'Aaryan', 'Nambissan');
    sportQuiz = adminQuizCreateT2(userA.token, 'SportQuiz', 'Football Basics').return;
    basketballQuiz = adminQuizCreateT2(userA.token, 'BasketballQuiz', 'Basketball Basics').return;
    tennisQuiz = adminQuizCreateT2(userB.token, 'TennisQuiz', 'Tennis Rules').return;
  });

  test('invalid id tests', () => {
    expect(adminQuizRemoveT2('1', tennisQuiz.quizId).Code).toBe(401);
    expect(adminQuizRemoveT2(userA.token, tennisQuiz.quizId).Code).toBe(403);
    expect(adminQuizRemoveT2(userB.token, sportQuiz.quizId).Code).toBe(403);
    expect(adminQuizRemoveT2(userB.token, basketballQuiz.quizId).Code).toBe(403);
  });

  test('valid id tests', () => {
    expect(adminQuizListT2(userA.token).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );

    expect(adminQuizListT2(userB.token).return).toStrictEqual(
      {
        quizzes: [
          { quizId: tennisQuiz.quizId, name: 'TennisQuiz' },
        ],
      }
    );
    expect(adminQuizRemoveT2(userA.token, sportQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizRemoveT2(userB.token, tennisQuiz.quizId).return).toStrictEqual({});

    expect(adminQuizListT2(userA.token).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );
    expect(adminQuizListT2(userB.token).return).toStrictEqual({ quizzes: [] });
    clearT();
  });
});
