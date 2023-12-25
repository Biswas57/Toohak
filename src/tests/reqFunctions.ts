import request from 'sync-request-curl';

import { port, url } from '../config.json';
import { questionBody } from '../dataStore';
const SERVER_URL = `${url}:${port}`;

export function adminAuthRegisterT(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminAuthLoginT(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email: email,
        password: password
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminUserDetailsT(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizListT(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list',
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizCreateT(token: string, name: string, description: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
      json: {
        token: token,
        name: name,
        description: description
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizRemoveT(token: string, quizId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizInfoT(token: string, quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}`,
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizNameUpdateT(token: string, quizId: number, name: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/name`,
    {
      json: {
        token: token,
        name: name
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizDescriptionUpdateT(token: string, quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/description`,
    {
      json: {
        token: token,
        description: description
      }
    }
  );
  return JSON.parse(res.body.toString());
}

export function clearT() {
  request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      qs: {}
    }
  );
  return ({});
}

export function adminAuthLogoutT(token: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/logout',
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminUserDetailsUpdateT(token: string, email: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/user/details',
    {
      json: {
        token: token,
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminPasswordUpdateT(token: string, oldPssword: string, newPassword: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/user/password',
    {
      json: {
        token: token,
        oldPassword: oldPssword,
        newPassword: newPassword
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizRemovedViewT(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/trash',
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizRestoreT(quizId: number, token: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/restore`,
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminEmptyTrashT(token: string, quizIds: string) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/trash/empty',
    {
      qs: {
        token: token,
        quizIds: quizIds
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizTransferT(quizId: number, token: string, userEmail: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/transfer`,
    {
      json: {
        token: token,
        userEmail: userEmail
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizCreateQuestionT(quizId: number, token: string, question: questionBody) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question`,
    {
      json: {
        token: token,
        questionBody: question
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizQuestionUpdateT(quizId: number, questionId: number, token: string, question: questionBody) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      json: {
        token: token,
        questionBody: question
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizQuestionDeleteT(quizId: number, questionId: number, token: string) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizQuestionMoveT(quizId: number, questionId: number, token: string, newPosition: number) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}/move`,
    {
      json: {
        token: token,
        newPosition: newPosition
      }
    }
  );
  return JSON.parse(res.body.toString());
}
export function adminQuizQuestionDuplicateT(quizId: number, questionId: number, token: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}

// ---------------------------------------------------------------------
// -------------------------iter3 req functions-------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// v2 Request functions

export function adminAuthLogoutT2(token: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/auth/logout',
    {
      headers: {
        token: token
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body.toString())
  };
}

export function adminUserDetailsT2(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminUserDetailsUpdateT2(token: string, email: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token
      },
      json: {
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminPasswordUpdateT2(token: string, oldPssword: string, newPassword: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/user/password',
    {
      headers: {
        token: token
      },
      json: {
        oldPassword: oldPssword,
        newPassword: newPassword
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizListT2(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/list',
    {
      headers: {
        token: token
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizCreateT2(token: string, name: string, description: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/quiz',
    {
      headers: {
        token: token
      },
      json: {
        name: name,
        description: description
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizRemoveT2(token: string, quizId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v2/admin/quiz/${quizId}`,
    {
      headers: {
        token: token
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizInfoT2(token: string, quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v2/admin/quiz/${quizId}`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizNameUpdateT2(token: string, quizId: number, name: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v2/admin/quiz/${quizId}/name`,
    {
      headers: {
        token: token
      },
      json: {
        name: name
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizDescriptionUpdateT2(token: string, quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v2/admin/quiz/${quizId}/description`,
    {
      headers: {
        token: token
      },
      json: {
        description: description
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizRemovedViewT2(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/trash',
    {
      headers: {
        token: token
      },
    }
  );

  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizRestoreT2(quizId: number, token: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v2/admin/quiz/${quizId}/restore`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminEmptyTrashT2(token: string, quizIds: string) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/trash/empty',
    {
      headers: {
        token: token
      },
      qs: {
        quizIds: quizIds
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizTransferT2(quizId: number, token: string, userEmail: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v2/admin/quiz/${quizId}/transfer`,
    {
      headers: {
        token: token
      },
      json: {
        userEmail: userEmail
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizCreateQuestionT2(quizId: number, token: string, question: questionBody) {
  const res = request(
    'POST',
    SERVER_URL + `/v2/admin/quiz/${quizId}/question`,
    {
      headers: {
        token: token
      },
      json: {
        questionBody: question
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizQuestionUpdateT2(quizId: number, questionId: number, token: string, question: questionBody) {
  const res = request(
    'PUT',
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}`,
    {
      headers: {
        token: token
      },
      json: {
        questionBody: question
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizQuestionDeleteT2(quizId: number, questionId: number, token: string) {
  const res = request(
    'DELETE',
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizQuestionMoveT2(quizId: number, questionId: number, token: string, newPosition: number) {
  const res = request(
    'PUT',
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}/move`,
    {
      headers: {
        token: token
      },
      json: {
        newPosition: newPosition
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body.toString())
  };
}
export function adminQuizQuestionDuplicateT2(quizId: number, questionId: number, token: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}

// ---------------------------------------------------------------------
// -----------------------iter3 new req functions-----------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

export function adminQuizThumbnailUpdateT(quizId: number, token: string, imgUrl: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/thumbnail`,
    {
      headers: {
        token: token
      },
      json: {
        imgUrl: imgUrl
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminSessionUpdateStatusT(quizId: number, sessionId: number, token: string, action: string) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}`,
    {
      headers: {
        token: token
      },
      json: {
        action: action
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuestionSubmissionT(answerIds: Array<number>, playerId: number, questionPosition: number) {
  const res = request(
    'PUT',
    SERVER_URL + `/v1/player/${playerId}/question/${questionPosition}/answer`,
    {
      json: {
        answerIds: answerIds
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}

export function adminQuizSessionsListT(token: string, quizId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/sessions`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizSessionStatusT(token: string, quizId: number, sessionId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}

export function adminQuizSessionFinalResultT(token: string, quizId: number, sessionId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}/results`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizSessionFinalResultsCSVT(token: string, quizId: number, sessionId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/${sessionId}/results/csv`,
    {
      headers: {
        token: token
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminUserGuestT(playerId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}`,
    {
      headers: {}
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuestionInfoPlayerT(playerId: number, questionPosition: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/question/${questionPosition}`,
    {
      headers: {},
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuestionResultT(playerId: number, questionPosition: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/question/${questionPosition}/results`,
    {
      headers: {},
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminSessionFinalResultsT(playerId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/results`,
    {
      headers: {},
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizViewMessagesT(playerId: number) {
  const res = request(
    'GET',
    SERVER_URL + `/v1/player/${playerId}/chat`,
    {
      headers: {},
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}

export function adminQuizCreateSessionT(token: string, quizId: number, autoStartNum: number) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/admin/quiz/${quizId}/session/start`,
    {
      headers: {
        token: token
      },
      json: {
        autoStartNum: autoStartNum
      }
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizCreateGuestT(sessionId: number, name: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/player/join',
    {
      json: {
        sessionId: sessionId,
        name: name
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
export function adminQuizSendMessageT(playerId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + `/v1/player/${playerId}/chat`,
    {
      json: {
        message: { messageBody: message }
      },
    }
  );
  return {
    Code: res.statusCode,
    return: JSON.parse(res.body as string)
  };
}
