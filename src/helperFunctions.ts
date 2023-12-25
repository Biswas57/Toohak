import { ERROR, getData, user, session } from './dataStore';
import crypto from 'crypto';

export function validateAndReturnAuthUserId(token: string): number | ERROR {
  const data = getData();

  const user = data.users.find((user: user) => user.tokenIds.includes(token));
  if (user === undefined) {
    return { error: 'token is invalid' };
  }
  return user.authUserId;
}

export function checkQuizOwnership(userId: number, quizId: number): number | ERROR {
  const data = getData();
  const user = data.users.find((user: user) => user.authUserId === userId);
  if (!user.quizIds.includes(quizId)) {
    return { error: 'user is not an owner of this quiz' };
  }
  return quizId;
}


export function quizSessionStatusHelper(array, key) {
  return array.map(obj => array[key]);
}

export function playerIdToSession(playerId: number) {
  const data = getData();
  for (const session of data.sessions) {
    for (const setPlayerId of session) {
      if (setPlayerId === playerId) {
        return session;
      }
    }
  }
  return { error: 'no session for this playerId 400' };
}

export function playerIdtoQuiz(playerId: number) {
  const data = getData();
  for (const quiz of data.quizzes) {
    const playerIds = quizSessionStatusHelper(quiz.quizPlayers, 'playerId');
    for (const setPlayerId of playerIds) {
      if (setPlayerId === playerId) {
        return quiz;
      }
    }
  }
  return { error: 'no quiz for this player id 400' };
}

export function hasDuplicates(array) {
  const uniqueSet = new Set();

  for (const item of array) {
    if (uniqueSet.has(item)) {
      return true;
    }

    uniqueSet.add(item);
  }
  return false;
}

export function checkSessionOwnership(userId: number, sessionId: number): number | ERROR {
  const data = getData();
  const session = data.sessions.find((session: session) => session.sessionId === sessionId);
  if (session === undefined) {
    return { error: 'sessionId does not exist' };
  }
  if (session.sessionOwnerId !== userId) {
    return { error: 'user is not an owner of this session' };
  }
  return sessionId;
}

export function getHashOf(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}
