import {
  adminAuthRegisterT,
  adminQuizCreateT2,
  adminQuizRemoveT2,
  adminEmptyTrashT2,
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
  let swimmingQuiz: {quizId: number};

  beforeEach(() => {
    userA = adminAuthRegisterT('sampleemail1@gmail.com', 'SecurePass1', 'Alvin', 'He').token;
    userB = adminAuthRegisterT('sampleemail2@gmail.com', 'SecurePass2', 'Aaryan', 'Nambissan').token;
    sportQuiz = adminQuizCreateT2(userA, 'SportQuiz', 'Football Basics').return;
    basketballQuiz = adminQuizCreateT2(userA, 'BasketballQuiz', 'Basketball Basics').return;
    swimmingQuiz = adminQuizCreateT2(userA, 'swimming Quiz123', 'swimming Basics').return;
    tennisQuiz = adminQuizCreateT2(userB, 'TennisQuiz', 'Tennis Rules').return;
  });
  test('valid id tests', () => {
    expect(adminQuizRemoveT2(userA, sportQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
        ],
      }
    );
    expect(adminEmptyTrashT2(userA, `[${sportQuiz.quizId + 100}]`).Code).toBe(403);
    expect(adminEmptyTrashT2(userA + '1', `[${sportQuiz.quizId}]`).Code).toBe(401);
    expect(adminEmptyTrashT2(userA + '1', `[${sportQuiz.quizId + 100}]`).Code).toBe(401);
    expect(adminEmptyTrashT2(userB, `[${sportQuiz.quizId}]`).Code).toBe(403);
    expect(adminEmptyTrashT2(userA, `[${sportQuiz.quizId}]`).return).toStrictEqual({});
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    expect(adminQuizRemoveT2(userA, basketballQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizRemoveT2(userA, swimmingQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );
    expect(adminQuizRestoreT2(basketballQuiz.quizId, userA).return).toStrictEqual({});
    expect(adminQuizRestoreT2(swimmingQuiz.quizId, userA).return).toStrictEqual({});
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    expect(adminQuizRemoveT2(userA, basketballQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizRemoveT2(userA, swimmingQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );
    expect(adminEmptyTrashT2(userA, `[${basketballQuiz.quizId}, ${swimmingQuiz.quizId}]`).return).toStrictEqual({});
    expect(adminQuizRestoreT2(basketballQuiz.quizId, userA).Code).toBe(403);
    expect(adminQuizRestoreT2(swimmingQuiz.quizId, userA).Code).toBe(403);
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
  });
  test('valid id tests', () => {
    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
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
    expect(adminQuizRemoveT2(userA, swimmingQuiz.quizId).return).toStrictEqual({});
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
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );

    expect(adminQuizRemovedViewT2(userB).return).toStrictEqual({
      quizzes: [
        { quizId: tennisQuiz.quizId, name: 'TennisQuiz' },
      ]
    });

    expect(adminEmptyTrashT2('invalidToken', `[${sportQuiz.quizId}]`).Code).toBe(401);
    expect(adminEmptyTrashT2(userA, `[${sportQuiz.quizId}, ${tennisQuiz.quizId}]`).Code).toBe(403);
    expect(adminEmptyTrashT2(userB, `[${sportQuiz.quizId}]`).Code).toBe(403);

    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
          { quizId: swimmingQuiz.quizId, name: 'swimming Quiz123' },
        ],
      }
    );
    expect(adminEmptyTrashT2(userA, `[${basketballQuiz.quizId}]`).Code).toBe(400);
    expect(adminEmptyTrashT2(userA, `[${swimmingQuiz.quizId}]`).return).toStrictEqual({});
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
        ],
      }
    );
    expect(adminEmptyTrashT2(userA, `[${sportQuiz.quizId}]`).return).toStrictEqual({});
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    expect(adminEmptyTrashT2(userB, `[${tennisQuiz.quizId}]`).return).toStrictEqual({});
    expect(adminQuizRemovedViewT2(userB).return).toStrictEqual(
      {
        quizzes: [],
      }
    );

    expect(adminQuizListT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: basketballQuiz.quizId, name: 'BasketballQuiz' },
        ],
      }
    );

    expect(adminQuizListT2(userB).return).toStrictEqual(
      {
        quizzes: [],
      }
    );
    clearT();
  });
});
