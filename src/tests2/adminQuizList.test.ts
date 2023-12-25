import {
  adminQuizListT2,
  adminQuizCreateT2,
  adminAuthRegisterT,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminQuizList', () => {
  test('authUserId is invalid', () => {
    expect(adminQuizListT2('1').Code).toBe(401);
  });

  test('Valid parameters with no existing quizzes', () => {
    const adminAuthRegisterReturnObject = adminAuthRegisterT(
      'validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const adminQuizListReturnObject = adminQuizListT2(adminAuthRegisterReturnObject.token);
    expect(adminQuizListReturnObject.return).toStrictEqual({
      quizzes: []
    });
  });

  test('Valid parameters with one existing quiz', () => {
    const adminAuthRegisterReturnObject = adminAuthRegisterT(
      'validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const adminQuizCreateReturnObject = adminQuizCreateT2(
      adminAuthRegisterReturnObject.token, 'Quiz', 'description');
    const adminQuizListReturnObject = adminQuizListT2(adminAuthRegisterReturnObject.token);
    expect(adminQuizListReturnObject.return).toStrictEqual({
      quizzes: [
        {
          quizId: adminQuizCreateReturnObject.return.quizId,
          name: 'Quiz'
        }
      ]
    });
  });

  test('Valid parameters with multiple existing quizzes', () => {
    const adminAuthRegisterReturnObject1 = adminAuthRegisterT(
      'validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const adminQuizCreateReturnObject1 = adminQuizCreateT2(
      adminAuthRegisterReturnObject1.token, 'Quiz', 'description');
    const adminQuizCreateReturnObject2 = adminQuizCreateT2(
      adminAuthRegisterReturnObject1.token, 'Quiz2', 'description2');
    const adminQuizListReturnObject = adminQuizListT2(adminAuthRegisterReturnObject1.token);
    expect(adminQuizListReturnObject.return).toStrictEqual({ quizzes: expect.any(Array) });

    const expectedReturnObject = {
      quizzes: [
        {
          quizId: adminQuizCreateReturnObject1,
          name: 'Quiz'
        },
        {
          quizId: adminQuizCreateReturnObject2,
          name: 'Quiz2'
        }
      ]
    };
    expect(adminQuizListReturnObject.return.quizzes.sort).toStrictEqual(expectedReturnObject.quizzes.sort);
    clearT();
  });
});
