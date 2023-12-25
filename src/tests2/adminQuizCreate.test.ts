import {
  adminAuthRegisterT,
  adminQuizListT2,
  adminQuizCreateT2,
  adminQuizRemoveT2,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('Testing adminQuizCreate', () => {
  test('invalid authUserId error', () => {
    const response = adminQuizCreateT2('1', 'QuizTest', 'This is a description');
    expect(response.Code).toBe(401);
  });

  test('invalid name for users', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    const response = adminQuizCreateT2(userId, 'InvalidName.#$', 'This is a description');
    expect(response.Code).toBe(400);
  });

  test('invalid user name length', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    expect(adminQuizCreateT2(userId, 'Qz', 'This is a description').Code).toBe(400);
    expect(adminQuizCreateT2(userId, 'NameThatIsWayTooLongAndShouldFailBecauseOfThat', 'This is a description').Code).toBe(400);
  });

  test('duplicate quiz names', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    adminQuizCreateT2(userId, 'SameName', 'This is a description');
    const response = adminQuizCreateT2(userId, 'SameName', 'This is another description');
    expect(response.Code).toBe(400);
  });

  test('invalid quiz description length', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    const longDescription = 'a'.repeat(101);
    const response = adminQuizCreateT2(userId, 'QuizTest', longDescription);
    expect(response.Code).toBe(400);
  });
  test('duplicate quiz names', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    expect(adminQuizCreateT2(userId, 'SameName', 'This is a description').return).toStrictEqual({ quizId: expect.any(Number) });
    const response = adminQuizCreateT2(userId, 'SameName2', 'This is another description').return;
    expect(response).toStrictEqual({ quizId: expect.any(Number) });
    expect(adminQuizListT2(userId).return).toStrictEqual(
      {
        quizzes: [
          {
            quizId: 1,
            name: 'SameName'
          },
          {
            quizId: 2,
            name: 'SameName2'
          }
        ]
      }
    );
    expect(adminQuizRemoveT2(userId, response.quizId).return).toStrictEqual({});
    expect(adminQuizCreateT2(userId, 'SameName3', 'This is a description').return).toStrictEqual({ quizId: expect.any(Number) });
    expect(adminQuizListT2(userId).return).toStrictEqual(
      {
        quizzes: [
          {
            quizId: 1,
            name: 'SameName'
          },
          {
            quizId: 3,
            name: 'SameName3'
          }
        ]
      }
    );
    clearT();
  });
});
