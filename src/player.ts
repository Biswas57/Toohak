import { getData, setData } from './dataStore';
import { message, answerId } from './dataStore';
import { playerIdToSession, playerIdtoQuiz, hasDuplicates } from './helperFunctions';

export function getCurrentQuestion(playerId: number, questionPosition: number) {
  const data = getData();
  if ((playerIdToSession(playerId)) !== { error: expect.any(String) }) {
    const session = playerIdToSession(playerId);
    if (session.atQuestion !== questionPosition) {
      return { error: 'session is not currently on this question 400' };
    } if (session.state === 'LOBBY' || session.state === 'END') {
      return { error: 'session in lobby or end state 400' };
    }
    for (const quiz of data.quizzes) {
      if (quiz.quizId === session.quizId) {
        if (questionPosition > (quiz.questions).length || questionPosition < 0) {
          return { error: 'question position is not valid for the session this player is in 400' };
        }
        return quiz.questions[questionPosition];
      }
    }
  }
  return { error: 'error playerId does not exist 400' };
}
export function sendChat(playerId: number, message: message) {
  // get session
  const data = getData();
  if (message.length < 1 || message.length > 100) {
    return { error: 'message length is too short or long 400' };
  } if ((playerIdToSession(playerId)) !== { error: expect.any(String) }) {
    const session = playerIdToSession(playerId);
    const players = playerIdtoQuiz(playerId).quizPlayers;
    let findPlayerName = '';
    for (const player of players) {
      if (player.playerId === playerId) {
        findPlayerName = player.name;
      }
    }

    const addMessage = {
      messageBody: message,
      playerId: playerId,
      playerName: findPlayerName,
      timeSent: Math.floor((new Date()).getTime() / 1000)
    };
    (session.messages).push(addMessage);
    setData(data);
  }
  return { error: 'no session for this playerId 400' };
}

export function playerSubmitAnswer(answers: Array< answerId >, playerId: number, questionPosition: number) {
  // const data = getData();
  if (playerIdtoQuiz(playerId) === { error: expect.any(String) }) {
    return { error: 'no quiz for this player id 400' };
  }

  const quiz = playerIdtoQuiz(playerId);
  const session = playerIdToSession(playerId);
  if (session.atQuestion !== questionPosition) {
    return { error: 'question position is not valid for the session this player is in 400' };
  } if (questionPosition > (quiz.questions).length || questionPosition < 0) {
    return { error: 'question position is not valid 400' };
  } if (session.state !== 'QUESTION_OPEN') {
    return { error: 'session lobby is not in question_open 400' };
  } if ((answers.answerIds).length < 1) {
    return { error: 'less than 1 answer ID was submitted 400' };
  } if (hasDuplicates(answers.answerIds)) {
    return { error: "duplicate id's in answerIds 400" };
  } // not sure what does ids are not valud for this particular question means
  // const question = quiz.questions[questionPosition];
  // how can i add answerId to answer array in question where are the other key values like the answer as a string
  // (question.answers).push(answer);
  // setData(data);
}
