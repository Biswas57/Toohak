import {
  adminQuizCreateT2,
  adminQuizInfoT2,
  adminAuthRegisterT,
  adminQuizRemoveT2,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminQuizInfo SERVER', () => {
  test('user does not exist', () => {
    expect(adminQuizInfoT2('1', 1).Code).toBe(401);
  });
  describe('more adminQuizInfo', () => {
    let user1: {token: string};
    let user2: {token: string};
    let quiz1: {quizId: number};
    let quiz2: {quizId: number};
    beforeEach(() => {
      user1 = adminAuthRegisterT('mahdi123@gmail.com', 'Password123', 'Mahdi', 'Sabbagh');
      user2 = adminAuthRegisterT('UNSW@gmail.com', 'Password123', 'Harry', 'Maguire');
      quiz1 = adminQuizCreateT2(user1.token, 'quiz1', 'hello').return;
      quiz2 = adminQuizCreateT2(user2.token, 'quiz2', 'goodbye').return;
    });
    test('wrong Ids', () => {
      expect(adminQuizInfoT2(user1.token + 1, quiz1.quizId).Code).toBe(401);
      expect(adminQuizInfoT2(user1.token, quiz1.quizId + 1).Code).toBe(403);
      expect(adminQuizInfoT2(user2.token, quiz1.quizId).Code).toBe(403);
      expect(adminQuizInfoT2(user1.token, quiz2.quizId).Code).toBe(403);
    });
    test('valid Ids', () => {
      expect(adminQuizInfoT2(user1.token, quiz1.quizId).return).toStrictEqual(
        {
          quizId: quiz1.quizId,
          name: 'quiz1',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'hello',
          numQuestions: 0,
          questions: [],
          duration: 0,
          thumbnailUrl: ''
        }
      );
      expect(adminQuizInfoT2(user2.token, quiz2.quizId).return).toStrictEqual(
        {
          quizId: quiz2.quizId,
          name: 'quiz2',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'goodbye',
          numQuestions: 0,
          questions: [],
          duration: 0,
          thumbnailUrl: ''
        }
      );
    });
    test('after removing the quizzes', () => {
      expect(adminQuizRemoveT2(user1.token, quiz1.quizId).return).toStrictEqual({});
      expect(adminQuizInfoT2(user1.token, quiz1.quizId).return).toStrictEqual({ error: expect.any(String) });
      expect(adminQuizInfoT2(user2.token, quiz2.quizId).return).toStrictEqual(
        {
          quizId: quiz2.quizId,
          name: 'quiz2',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'goodbye',
          numQuestions: 0,
          questions: [],
          duration: 0,
          thumbnailUrl: ''
        }
      );
      expect(adminQuizRemoveT2(user2.token, quiz2.quizId).return).toStrictEqual({});
      expect(adminQuizInfoT2(user2.token, quiz2.quizId).Code).toBe(403);
    });
    clearT();
  });
});
