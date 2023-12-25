import {
  adminAuthRegisterT,
  adminUserDetailsT2,
  adminQuizCreateT2,
  adminQuizRemoveT2,
  adminQuizListT2,
  adminQuizRemovedViewT2,
  adminQuizRestoreT2,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('Testing Quiz Deletion', () => {
  let userA: string;
  let userB: string;
  let sportQuiz: {quizId: number};
  let basketballQuiz: {quizId: number};
  let tennisQuiz: {quizId: number};

  beforeEach(() => {
    userA = adminAuthRegisterT('sampleemail1@gmail.com', 'SecurePass1', 'Alvin', 'He').token;
    userB = adminAuthRegisterT('sampleemail2@gmail.com', 'SecurePass2', 'Aaryan', 'Nambissan').token;
    sportQuiz = adminQuizCreateT2(userA, 'SportQuiz', 'Football Basics').return;
    basketballQuiz = adminQuizCreateT2(userA, 'BasketballQuiz', 'Basketball Basics').return;
    tennisQuiz = adminQuizCreateT2(userB, 'TennisQuiz', 'Tennis Rules').return;
  });

  test('invalid inputs', () => {
    expect(adminQuizRestoreT2(sportQuiz.quizId, userA).Code).toBe(400);
    expect(adminQuizRemoveT2(userA, sportQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizRestoreT2(sportQuiz.quizId + 1111111, userA).Code).toBe(403);
    expect(adminQuizRestoreT2(sportQuiz.quizId, userA + 'aaaaaaa').Code).toBe(401);
    expect(adminQuizRestoreT2(sportQuiz.quizId + 11111111, userA + 'aaaaaaaaa').Code).toBe(401);
    expect(adminQuizRestoreT2(sportQuiz.quizId, userA).return).toStrictEqual({});
  });

  test('valid id tests', () => {
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );

    expect(adminQuizListT2(userB).return).toStrictEqual(
      {
        quizzes: [
          { quizId: tennisQuiz.quizId, name: 'TennisQuiz' },
        ],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );

    expect(adminQuizRemovedViewT2(userB).return).toStrictEqual(
      {
        quizzes: [],
      }
    );

    expect(adminQuizRemoveT2(userA, sportQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizRemoveT2(userB, tennisQuiz.quizId).return).toStrictEqual({});

    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );

    expect(adminQuizListT2(userB).return).toStrictEqual({
      quizzes: []
    });
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
        ],
      }
    );

    expect(adminQuizRemovedViewT2(userB).return).toStrictEqual({
      quizzes: [
        { quizId: tennisQuiz.quizId, name: 'TennisQuiz' },
      ]
    });
    expect(adminUserDetailsT2(userA).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Alvin He',
        email: 'sampleemail1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(adminQuizRestoreT2(sportQuiz.quizId, userA).return).toStrictEqual({});
    expect(adminQuizRestoreT2(sportQuiz.quizId, userB).Code).toBe(403);
    expect(adminQuizRestoreT2(tennisQuiz.quizId, userB).return).toStrictEqual({});
    expect(adminQuizRestoreT2(sportQuiz.quizId, userA).Code).toBe(400);
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
        ],
      }
    );

    expect(adminQuizListT2(userB).return).toStrictEqual(
      {
        quizzes: [
          { quizId: tennisQuiz.quizId, name: 'TennisQuiz' },
        ],
      }
    );
    expect(adminQuizRemoveT2(userA, sportQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );
    const sportQuiz2 = adminQuizCreateT2(userA, 'SportQuiz', 'Football Basics').return;
    expect(sportQuiz2).toStrictEqual({ quizId: expect.any(Number) });
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: sportQuiz2.quizId, name: 'SportQuiz' },
        ],
      }
    );

    expect(adminQuizRestoreT2(sportQuiz.quizId, userA).Code).toBe(400);
    clearT();
  });
});
