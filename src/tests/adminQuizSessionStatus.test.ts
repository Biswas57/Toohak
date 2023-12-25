import {
  adminAuthRegisterT,
  adminQuizCreateT2,
  adminQuizRemoveT2,
  adminQuizCreateQuestionT2,
  adminQuizCreateSessionT,
  adminQuizSessionStatusT,
  adminSessionUpdateStatusT,
  clearT,
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe.skip('adminQuizDescriptionUpdate SERVER', () => {
  test('user does not exist', () => {
    expect(adminQuizSessionStatusT('1', 1, 1).Code).toBe(401);
  });
  describe.skip('adminQUizSessionStatus', () => {
    let user1: {token: string};
    let user2: {token: string};
    let quiz1: {quizId: number};
    let quiz2: {quizId: number};
    let session1: {sessionId: number};
    let session2: {sessionId: number};
    let question1: {questionId: number};
    let question2: {questionId: number};

    beforeEach(() => {
      user1 = adminAuthRegisterT('mahdi123@gmail.com', 'Password123', 'Mahdi', 'Sabbagh');
      user2 = adminAuthRegisterT('UNSW@gmail.com', 'Password123', 'Harry', 'Maguire');
      quiz1 = adminQuizCreateT2(user1.token, 'quiz1', 'hello').return;
      quiz2 = adminQuizCreateT2(user2.token, 'quiz2', 'goodbye').return;
      question1 = adminQuizCreateQuestionT2(quiz1.quizId, user1.token, {
        question: "What's the tallest animal?",
        duration: 30,
        thumbnailUrl: 'http://google.com/some/image/path.jpg',
        points: 10,
        answers: [
          { answer: 'Giraffe', correct: true },
          { answer: 'Elephant', correct: false }
        ]
      }).return;
      question2 = adminQuizCreateQuestionT2(quiz1.quizId, user2.token, {
        question: "What's the smallest animal?",
        duration: 30,
        thumbnailUrl: 'http://google.com/some/image/path.jpg',
        points: 10,
        answers: [
          { answer: 'Giraffe', correct: false },
          { answer: 'Elephant', correct: true }
        ]
      }).return;
      session1 = adminQuizCreateSessionT(user1.token, quiz1.quizId, 3).return;
      session2 = adminQuizCreateSessionT(user2.token, quiz2.quizId, 3).return;
    });
    test('wrong Ids', () => {
      expect(adminQuizSessionStatusT(user1.token + 1, quiz1.quizId, session1.sessionId).Code).toBe(401);
      expect(adminQuizSessionStatusT(user2.token + 1, quiz1.quizId, session2.sessionId).Code).toBe(401);
      expect(adminQuizSessionStatusT(user1.token, quiz1.quizId + 1, session1.sessionId).Code).toBe(403);
      expect(adminQuizSessionStatusT(user2.token, quiz1.quizId, session2.sessionId).Code).toBe(403);
      expect(adminQuizSessionStatusT(user1.token, quiz2.quizId, session2.sessionId).Code).toBe(403);
      expect(adminQuizSessionStatusT(user1.token, quiz1.quizId, session2.sessionId).Code).toBe(400);
      expect(adminQuizSessionStatusT(user2.token, quiz2.quizId, session1.sessionId).Code).toBe(400);
    });
    test('valid Ids', () => {
      expect(adminQuizSessionStatusT(user1.token, quiz1.quizId, session1.sessionId).return).toStrictEqual(
        {
          state: 'LOBBY',
          atQuestion: 1,
          Players: [],
          metadata: {
            quizId: quiz1.quizId,
            name: 'quiz1',
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: 'hello',
            numQuestions: 1,
            questions: [
              {
                questionId: question1.questionId,
                question: "What's the tallest animal?",
                duration: 30,
                thumbnailUrl: 'http://google.com/some/image/path.jpg',
                points: 10,
                answers: [
                  { answer: 'Giraffe', correct: true },
                  { answer: 'Elephant', correct: false }
                ]
              }
            ],
            duration: 0,
            thumbnailUrl: ''
          }
        }
      );
      expect(adminQuizSessionStatusT(user2.token, quiz2.quizId, session2.sessionId).return).toStrictEqual(
        {
          state: 'LOBBY',
          atQuestion: 1,
          Players: [],
          metadata: {
            quizId: quiz2.quizId,
            name: 'quiz2',
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: 'goodbye',
            numQuestions: 0,
            questions: [
              {
                questionId: question2.questionId,
                question: "What's the smallest animal?",
                duration: 30,
                thumbnailUrl: 'http://google.com/some/image/path.jpg',
                points: 10,
                answers: [
                  { answer: 'Giraffe', correct: false },
                  { answer: 'Elephant', correct: true }
                ]
              }
            ],
            duration: 0,
            thumbnailUrl: ''
          }
        }
      );
    });
    test('after changing state', () => {
      expect(adminSessionUpdateStatusT(quiz1.quizId, session1.sessionId, user1.token, 'NEXT_QUESTION').return).toStrictEqual({});
      expect(adminQuizSessionStatusT(user1.token, quiz1.quizId, session1.sessionId).return).toStrictEqual(
        {
          state: 'QUESTION_COUNTDOWN',
          atQuestion: 1,
          Players: [],
          metadata: {
            quizId: quiz1.quizId,
            name: 'quiz1',
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: 'hello',
            numQuestions: 1,
            questions: [
              {
                questionId: question1.questionId,
                question: "What's the tallest animal?",
                duration: 30,
                thumbnailUrl: 'http://google.com/some/image/path.jpg',
                points: 10,
                answers: [
                  { answer: 'Giraffe', correct: true },
                  { answer: 'Elephant', correct: false }
                ]
              }
            ],
            duration: 0,
            thumbnailUrl: ''
          }
        }
      );
      expect(adminQuizSessionStatusT(user2.token, quiz2.quizId, session2.sessionId).return).toStrictEqual(
        {
          state: 'LOBBY',
          atQuestion: 1,
          Players: [],
          metadata: {
            quizId: quiz2.quizId,
            name: 'quiz2',
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: 'goodbye',
            numQuestions: 0,
            questions: [
              {
                questionId: question2.questionId,
                question: "What's the smallest animal?",
                duration: 30,
                thumbnailUrl: 'http://google.com/some/image/path.jpg',
                points: 10,
                answers: [
                  { answer: 'Giraffe', correct: false },
                  { answer: 'Elephant', correct: true }
                ]
              }
            ],
            duration: 0,
            thumbnailUrl: ''
          }
        }
      );
      expect(adminQuizRemoveT2(user2.token, quiz2.quizId).return).toStrictEqual({});
      expect(adminQuizSessionStatusT(user2.token, quiz2.quizId, session2.sessionId).Code).toBe(403);
    });
    clearT();
  });
});
