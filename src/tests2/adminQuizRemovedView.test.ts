import {
  adminAuthRegisterT,
  adminQuizCreateT2,
  adminQuizRemoveT2,
  adminQuizListT2,
  adminQuizRemovedViewT2,
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
  test('invalid id tests', () => {
    expect(adminQuizRemovedViewT2(userA + '1').Code).toBe(401);
    expect(adminQuizRemoveT2(userA, sportQuiz.quizId).return).toStrictEqual({});
    expect(adminQuizRemovedViewT2(userA + '1').Code).toBe(401);
    expect(adminQuizRemovedViewT2(userA).return).toStrictEqual(
      {
        quizzes: [
          { quizId: sportQuiz.quizId, name: 'SportQuiz' },
        ],
      }
    );
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
    clearT();
  });
});
