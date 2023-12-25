import {
  adminQuizCreateT2,
  adminAuthRegisterT,
  adminQuizDescriptionUpdateT2,
  clearT,
  adminQuizInfoT2
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminQuizDescriptionUpdate', () => {
  let authUser: string;
  let quizId: number;
  beforeEach(() => {
    authUser = adminAuthRegisterT('abc123@gmail.com', 'password1', 'ray', 'li').token;
    quizId = adminQuizCreateT2(authUser, 'quiz1', 'camels').return.quizId;
  });

  /// invalid auth user ID
  test('Invalid authUserId', () => {
    expect(adminQuizDescriptionUpdateT2('-1', quizId, 'quizz').Code).toBe(401);
    expect(adminQuizDescriptionUpdateT2(authUser + 1, quizId, 'quizz').Code).toBe(401);
  });

  /// invalid quiz ID
  test('Invalid quizId', () => {
    expect(adminQuizDescriptionUpdateT2(authUser, -1, 'quizz').Code).toBe(403);
    expect(adminQuizDescriptionUpdateT2(authUser, quizId + 1, 'quizz').Code).toBe(403);
  });

  /// user does not own quiz
  test('User does not own quiz', () => {
    const authUser2: string = adminAuthRegisterT('abcd123@gmail.com', 'password1', 'raya', 'li').token;
    expect(adminQuizDescriptionUpdateT2(authUser2, quizId, 'quizz').Code).toBe(403);
  });

  test('description is more than 100 characters long', () => {
    const stringMoreThan100Chars = 'a'.repeat(101);
    expect(adminQuizDescriptionUpdateT2(authUser, quizId, stringMoreThan100Chars).Code).toBe(400);
  });

  test('valid description update', () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    expect(adminQuizDescriptionUpdateT2(authUser, quizId, 'bigcamel123!').return).toStrictEqual({});
    expect(adminQuizInfoT2(authUser, quizId).return).toStrictEqual(
      {
        quizId: quizId,
        name: 'quiz1',
        timeCreated: expect.any(Number),
        timeLastEdited: time,
        description: 'bigcamel123!',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: ''
      }
    );
  });

  test('valid description update empty string', () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    expect(adminQuizDescriptionUpdateT2(authUser, quizId, '').return).toStrictEqual({});
    expect(adminQuizInfoT2(authUser, quizId).return).toStrictEqual(
      {
        quizId: quizId,
        name: 'quiz1',
        timeCreated: expect.any(Number),
        timeLastEdited: time,
        description: '',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: ''
      }
    );
  });

  test('valid description update, updating description to same thing', () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    expect(adminQuizDescriptionUpdateT2(authUser, quizId, 'camels').return).toStrictEqual({});
    expect(adminQuizInfoT2(authUser, quizId).return).toStrictEqual(
      {
        quizId: quizId,
        name: 'quiz1',
        timeCreated: expect.any(Number),
        timeLastEdited: time,
        description: 'camels',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: ''
      }
    );
    clearT();
  });
});
