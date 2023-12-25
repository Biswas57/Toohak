import request from 'sync-request-curl';

import { port, url } from '../config.json';
const SERVER_URL = `${url}:${port}`;

function requestadminAuthLogin(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        email,
        password,
      }
    }
  );
  // NOTE: information about status code can also be checked/returned
  // if necessary, through res.statusCode
  return JSON.parse(res.body.toString());
}

function requestAdminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      json: {
        email,
        password,
        nameFirst,
        nameLast,
      }
    }
  );
  // NOTE: information about status code can also be checked/returned
  // if necessary, through res.statusCode
  return JSON.parse(res.body.toString());
}

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear', { json: {} });
});

const ERROR = { error: expect.any(String) };

// test case for valid email and password
test('Everything is valid', () => {
  requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He');
  expect(requestadminAuthLogin('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
});

// test case for valid email, invalid password
test('email is valid but invalid password', () => {
  requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He');
  expect(requestadminAuthLogin('Alvinhe9@gmail.com', 'n')).toStrictEqual(ERROR);
});

// test case for invalud email, and valid password
test('email is invalid but valid password', () => {
  requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He');
  expect(requestadminAuthLogin('erfoinejrgi', 'Carsarecool98')).toStrictEqual(ERROR);
});

// test case for invalud email, and invalid password
test('email is invalid and password is invalid', () => {
  requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He');
  expect(requestadminAuthLogin('wekfnwef', 'ekfnlngrqef')).toStrictEqual(ERROR);
  request('DELETE', SERVER_URL + '/clear', { json: {} });
});
