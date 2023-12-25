import {
  adminQuizCreateT2,
  adminAuthRegisterT,
  adminQuizNameUpdateT2,
  clearT,
  adminQuizInfoT2
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminQuizNameUpdate', () => {
  let authUser: string;
  let quizId: number;
  beforeEach(() => {
    authUser = adminAuthRegisterT('abc123@gmail.com', 'password1', 'ray', 'li').token;
    quizId = adminQuizCreateT2(authUser, 'quiz1', 'camels').return.quizId;
  });

  // invalid auth user ID
  test('Invalid authUserId', () => {
    expect(adminQuizNameUpdateT2('-1', quizId, 'quizz').Code).toBe(401);
    expect(adminQuizNameUpdateT2(authUser + 1, quizId, 'quizz').Code).toBe(401);
  });

  // invalid quiz ID
  test('Invalid quizId', () => {
    expect(adminQuizNameUpdateT2(authUser, -1, 'quizz').Code).toBe(403);
    expect(adminQuizNameUpdateT2(authUser, quizId + 1, 'quizz').Code).toBe(403);
  });

  // user does not own quiz
  test('User does not own quiz', () => {
    const authUser2: string = adminAuthRegisterT('abcd123@gmail.com', 'password1', 'raya', 'li').token;
    expect(adminQuizNameUpdateT2(authUser2, quizId, 'quizz').Code).toBe(403);
  });

  // invalid name i.e. name less than 3 characters or longer than 30
  test.each([
    { name: '' },
    { name: 'ab' },
    { name: 'a1' },
    { name: '1' },
    { name: 'thsidjvhdk123405jgjdnsjehtisheish' },
    { name: '123456789087654321234567898765432345678' },
    { name: 'reallylonginvalidquiznamelongerthanthirtycharacters' },
  ])("invalid name, less than 3 characters or longer than 30: '$name'", ({ name }) => {
    expect(adminQuizNameUpdateT2(authUser, quizId, name).Code).toBe(400);
  });

  /// invalid name, contains non alphanumeric or spaces
  test.each([
    { name: '?' },
    { name: 'sjdja skdk$' },
    { name: '$$$$$' },
    { name: '#$%^&*(*&^%$#%^&*' },
    { name: '123   !' },
    { name: '   abc&' },
    { name: 'invalidname!' },
  ])("invalid name, not alphanumeric or conrains spaces: '$name'", ({ name }) => {
    expect(adminQuizNameUpdateT2(authUser, quizId, name).Code).toBe(400);
  });

  // name is already used by the current logged in user for another quiz
  test('name already used by current logged in user for another quiz', () => {
    const quizId2 = adminQuizCreateT2(authUser, 'quiz2', 'lemurs').return;
    expect(adminQuizNameUpdateT2(authUser, quizId2.quizId, 'quiz1').Code).toBe(400);
    expect(adminQuizNameUpdateT2(authUser, quizId, 'quiz2').Code).toBe(400);
  });

  // test that it can handle updating the the name to itself
  test('valid name update changing the quiz name to be the same', () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    expect(adminQuizNameUpdateT2(authUser, quizId, 'quiz1').return).toStrictEqual({});
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
  });

  // test for valid name update
  test('valid name update', () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    expect(adminQuizNameUpdateT2(authUser, quizId, 'quiz1camel').return).toStrictEqual({});
    expect(adminQuizInfoT2(authUser, quizId).return).toStrictEqual(
      {
        quizId: quizId,
        name: 'quiz1camel',
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
