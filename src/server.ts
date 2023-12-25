import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import HTTPError from 'http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { adminUserDetails, adminAuthRegister, adminAuthLogin, adminUpdateUserDetails, adminUpdateUserPassword, adminAuthLogout } from './auth';
import { adminQuizInfo, adminQuizCreate, adminQuizRemove, adminQuizUpdateQuestion, adminQuizCreateQuestion, adminQuizList, adminQuizDescriptionUpdate, adminQuizNameUpdate, adminQuizRemovedView, adminQuizRestore, adminEmptyTrash, adminQuizTransfer, adminQuizQuestionDelete, adminQuizQuestionMove, adminQuizQuestionDuplicate, adminQuizSessionsList, adminQuizCreateSession, adminQuizThumbnailUpdate, adminSessionUpdateStatus, adminQuestionSubmission, adminQuizSessionStatus, adminQuizSessionFinalResult, adminQuizSessionFinalResultsCSV, adminUserGuest, adminQuestionInfoPlayer, adminQuestionResult, adminSessionFinalResults, adminQuizViewMessages, adminQuizCreateGuest, adminQuizSendMessage } from './quiz';
import { validateAndReturnAuthUserId, checkQuizOwnership, checkSessionOwnership } from './helperFunctions';
import { clear } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  const ret = echo(data);
  if ('error' in ret) {
    res.status(400);
  }
  return res.json(ret);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.query.token as string;

  const User = validateAndReturnAuthUserId(token);
  if (typeof User !== 'number') {
    return res.status(401).json(User);
  }

  const ret = adminQuizList(User);
  if ('error' in ret) {
    return res.status(401).json(ret);
  }

  return res.json(ret);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const ret = adminUserDetails(user);
  if ('error' in ret) {
    return res.status(401).json(ret);
  }

  return res.json(ret);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const response = adminAuthLogin(email, password);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.body.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const ret = adminAuthLogout(user, token);
  if ('error' in ret) {
    return res.status(401).json(ret);
  }

  return res.json(ret);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;

  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const response = adminQuizCreate(user, name, description);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    return res.status(401).json(user);
  }

  const response = adminUpdateUserDetails(token, email, nameFirst, nameLast);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    return res.status(401).json(user);
  }

  const response = adminUpdateUserPassword(token, oldPassword, newPassword);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const quizId = parseInt(req.params.quizid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizNameUpdate(User, quizId, name);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizstring = req.query.quizIds as string;
  const quizIds = JSON.parse(String(quizstring));

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const checkQuizOwnershipReturn = quizIds.map((quizId: number) => checkQuizOwnership(user, quizId));
  const notOwnedQuiz = checkQuizOwnershipReturn.find((element: number) => typeof (element) !== 'number');
  if (notOwnedQuiz !== undefined) {
    return res.status(403).json(notOwnedQuiz);
  }

  const response = adminEmptyTrash(user, quizIds);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const { token, userEmail } = req.body;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizTransfer(quizId, user, userEmail);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { token, description } = req.body;
  const quizId = parseInt(req.params.quizid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizDescriptionUpdate(User, quizId, description);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizRestore(quizId, User);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const ret = adminQuizRemovedView(user);
  if ('error' in ret) {
    return res.status(401).json(ret);
  }

  return res.status(200).json(ret);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizCreateQuestion(quizId, questionBody);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  return res.json(response);
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const ret = adminQuizRemove(user, quizId);
  if ('error' in ret) {
    return res.status(403).json(ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    return res.status(401).json(user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const ret = adminQuizInfo(user, quizId);
  if ('error' in ret) {
    return res.status(403).json(ret);
  }
  return res.json(ret);
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizQuestionDelete(quizId, questionId, User);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const { token, newPosition } = req.body;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizQuestionMove(quizId, questionId, User, newPosition);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizUpdateQuestion(questionId, quizId, questionBody);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const User = validateAndReturnAuthUserId(token);
  if (typeof (User) !== 'number') {
    return res.status(401).json(User);
  }

  const Quiz = checkQuizOwnership(User, quizId);
  if (typeof (Quiz) !== 'number') {
    return res.status(403).json(Quiz);
  }

  const response = adminQuizQuestionDuplicate(quizId, questionId, User);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.json(response);
});
// ---------------------------------------------------------------------
// ----------------------------iter3 servers----------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const ret = adminAuthLogout(user, token);

  return res.json(ret);
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const ret = adminUserDetails(user);

  return res.json(ret);
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const response = adminUpdateUserDetails(token, email, nameFirst, nameLast);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const response = adminUpdateUserPassword(token, oldPassword, newPassword);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const ret = adminQuizList(user);

  return res.json(ret);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const { name, description } = req.body;
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const response = adminQuizCreate(user, name, description);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const name = req.body.name as string;
  const quizId = parseInt(req.params.quizid as string);
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizNameUpdate(user, quizId, name);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const description = req.body.description as string;
  const quizId = parseInt(req.params.quizid as string);
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizDescriptionUpdate(user, quizId, description);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const ret = adminQuizRemovedView(user);

  return res.status(200).json(ret);
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizRestore(quizId, user);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizstring = req.query.quizIds as string;
  const quizIds = JSON.parse(String(quizstring));

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const checkQuizOwnershipReturn = quizIds.map((quizId: number) => checkQuizOwnership(user, quizId));
  const notOwnedQuiz = checkQuizOwnershipReturn.find((element: number) => typeof (element) !== 'number');
  if (notOwnedQuiz !== undefined) {
    throw HTTPError(403, { error: 'one or more quizIds do not belong to the user' });
  }

  const response = adminEmptyTrash(user, quizIds);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const userEmail = req.body.userEmail as string;
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizTransfer(quizId, user, userEmail);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { questionBody } = req.body;
  const quizId = parseInt(req.params.quizid as string);
  const token = req.headers.token as string;

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizCreateQuestion(quizId, questionBody);
  if ('error' in response) {
    throw HTTPError(400, response);
  }
  return res.json(response);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { questionBody } = req.body;
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizUpdateQuestion(questionId, quizId, questionBody);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizQuestionDelete(quizId, questionId, user);
  if ('error' in response) {
    throw HTTPError(400, { error: response.error });
  }

  return res.json(response);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const { newPosition } = req.body;
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizQuestionMove(quizId, questionId, user, newPosition);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizQuestionDuplicate(quizId, questionId, user);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizInfo(user, quizId);
  if ('error' in ret) {
    throw HTTPError(403, ret);
  }

  return res.json(ret);
});

app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizRemove(user, quizId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});
// ---------------------------------------------------------------------
// -------------------------iter3 (new) servers-------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const imgUrl = req.body.imgUrl as string;
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminQuizThumbnailUpdate(quizId, user, imgUrl);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const action = req.body.action as string;
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const sessionId = parseInt(req.params.sessionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof (user) !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkSessionOwnership(user, sessionId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const response = adminSessionUpdateStatus(quizId, sessionId, user, action);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const answerIds = req.body.answerIds;
  const playerId = parseInt(req.params.playerid as string);
  const questionposition = parseInt(req.params.questionposition as string);

  const response = adminQuestionSubmission(answerIds, playerId, questionposition);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.get('/v1/admin/quiz/:quizId/sessions', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizSessionsList(user, quizId);

  return res.status(200).json(ret);
});

app.get('/v1/admin/quiz/:quizId/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const sessionId = parseInt(req.params.sessionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizSessionStatus(user, quizId, sessionId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/admin/quiz/:quizId/session/:sessionid/results', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const sessionId = parseInt(req.params.sessionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizSessionFinalResult(user, quizId, sessionId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/admin/quiz/:quizId/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid as string);
  const sessionId = parseInt(req.params.sessionid as string);

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizSessionFinalResultsCSV(user, quizId, sessionId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid as string);

  const ret = adminUserGuest(playerId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid as string);
  const questionPosition = parseInt(req.params.questionPosition as string);

  const ret = adminQuestionInfoPlayer(playerId, questionPosition);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid as string);
  const questionPosition = parseInt(req.params.questionPosition as string);

  const ret = adminQuestionResult(playerId, questionPosition);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid as string);

  const ret = adminSessionFinalResults(playerId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid as string);

  const ret = adminQuizViewMessages(playerId);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  return res.status(200).json(ret);
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const token = req.headers.token as string;
  const { autoStartNum } = req.body;

  const user = validateAndReturnAuthUserId(token);
  if (typeof user !== 'number') {
    throw HTTPError(401, user);
  }

  const Quiz = checkQuizOwnership(user, quizId);
  if (typeof (Quiz) !== 'number') {
    throw HTTPError(403, Quiz);
  }

  const ret = adminQuizCreateSession(user, quizId, autoStartNum);
  if ('error' in ret) {
    throw HTTPError(400, ret);
  }

  res.status(200).json(ret);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;

  const response = adminQuizCreateGuest(sessionId, name);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const message = req.body.message;
  const playerId = parseInt(req.params.playerid as string);

  const response = adminQuizSendMessage(playerId, message);
  if ('error' in response) {
    throw HTTPError(400, response);
  }

  return res.json(response);
});
// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
