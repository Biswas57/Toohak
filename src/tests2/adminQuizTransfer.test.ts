import {
  adminAuthRegisterT,
  adminQuizCreateT2,
  adminQuizTransferT2,
  adminQuizListT2,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('Testing adminQuizTransfer', () => {
  test('invalid quiz transfer', () => {
    const oldOwnerId = adminAuthRegisterT('oldowner@gmail.com', 'pass123!', 'John', 'Doe').token;
    adminAuthRegisterT('newowner@gmail.com', 'pass123!', 'Jane', 'Doe');
    const quizId = adminQuizCreateT2(oldOwnerId, 'QuizTest', 'This is a description').return.quizId;

    expect(adminQuizTransferT2(quizId + 1, oldOwnerId, 'newowner@gmail.com').Code).toBe(403);
    expect(adminQuizTransferT2(quizId + 1, oldOwnerId, 'newowner@gmail.com').Code).toBe(403);
    expect(adminQuizTransferT2(quizId, oldOwnerId + '1', 'newowner@gmail.com').Code).toBe(401);
    expect(adminQuizTransferT2(quizId + 1, oldOwnerId + '1', 'newowner@gmail.com').Code).toBe(401);
    expect(adminQuizTransferT2(quizId, oldOwnerId, 'ewowner@gmail.com').Code).toBe(400);
    expect(adminQuizTransferT2(quizId, oldOwnerId, 'oldowner@gmail.com').Code).toBe(400);
    expect(adminQuizTransferT2(quizId, oldOwnerId, 'newowner@gmail.com').return).toStrictEqual({});
  });
  test('valid quiz transfer', () => {
    const oldOwnerId = adminAuthRegisterT('oldowner@gmail.com', 'pass123!', 'John', 'Doe').token;
    adminAuthRegisterT('newowner@gmail.com', 'pass123!', 'Jane', 'Doe');
    const quizId = adminQuizCreateT2(oldOwnerId, 'QuizTest', 'This is a description').return.quizId;

    const response = adminQuizTransferT2(quizId, oldOwnerId, 'newowner@gmail.com');
    expect(response.return).toStrictEqual({});
  });

  test('Testing old and new userID', () => {
    const oldOwnerId = adminAuthRegisterT('oldowner@gmail.com', 'pass123!', 'John', 'Doe').token;
    const newOwnerId = adminAuthRegisterT('newowner@gmail.com', 'pass123!', 'Jane', 'Doe').token;
    const quizId = adminQuizCreateT2(oldOwnerId, 'QuizTest', 'This is a description').return.quizId;
    expect(adminQuizListT2(oldOwnerId).return).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'QuizTest'
        }
      ]

    });
    expect(adminQuizListT2(newOwnerId).return).toStrictEqual({
      quizzes: []

    });
    const response = adminQuizTransferT2(quizId, oldOwnerId, 'newowner@gmail.com');
    expect(response.return).toStrictEqual({});
    expect(adminQuizListT2(newOwnerId).return).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'QuizTest'
        }
      ]

    });
    expect(adminQuizListT2(oldOwnerId).return).toStrictEqual({
      quizzes: []

    });
  });

  test('invalid quiz transfer', () => {
    const oldOwnerId = adminAuthRegisterT('oldowner@gmail.com', 'pass123!', 'John', 'Doe').token;
    const newOwnerId = adminAuthRegisterT('newowner@gmail.com', 'pass123!', 'Jane', 'Doe').token;
    const quizId = adminQuizCreateT2(oldOwnerId, 'QuizTest', 'This is a description').return.quizId;
    adminQuizCreateT2(newOwnerId, 'QuizTest', 'This is a description');

    const response = adminQuizTransferT2(quizId, oldOwnerId, 'newowner@gmail.com');
    expect(response.Code).toBe(400);
    clearT();
  });
});
