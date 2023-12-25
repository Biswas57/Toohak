import request from 'sync-request-curl';

import { port, url } from '../config.json';
const SERVER_URL = `${url}:${port}`;

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

// when clear function is written uncomment this

beforeEach(() => {
  request('DELETE', SERVER_URL + '/v1/clear', { json: {} });
});

const ERROR = { error: expect.any(String) };

// test with everything valid
test('valid register', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He')).toStrictEqual({ token: expect.any(String) });
});

// test with everything valid expect email registered
test('invalid register (email registered)', () => {
  requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He');
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He')).toStrictEqual(ERROR);
});

// test with everything valid expect email is invalid
test('invalid register (email wrong)', () => {
  expect(requestAdminAuthRegister('efiwhjefonh', 'Carsarecool98', 'Alvin', 'He')).toStrictEqual(ERROR);
});

// test with everything valid except first name is not only letters..
test('invalid register (first name is not valid characters)', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Pringle&&', 'He')).toStrictEqual(ERROR);
});

// test with everything valid except first name is less than 2 or greater than 20
test('invalid register (first name is too short or long)', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'j', 'He')).toStrictEqual(ERROR);
});

// test with everything valid except last name is not only letters
test('invalid register (last name is not valid characters)', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'j')).toStrictEqual(ERROR);
});

// test with everything valid except last name is less than 2 or greater 20 and contains correct stuff
test('invalid register (last name is too short or long)', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'j')).toStrictEqual(ERROR);
});

// test with everything valid except password length is too short
test('invalid register (password too short)', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'h', 'Alvin', 'He')).toStrictEqual(ERROR);
});

// test with everything valid except password dont not contain one number and letter but longer than 8
test('invalid register (password no number)', () => {
  expect(requestAdminAuthRegister('Alvinhe9@gmail.com', 'hofowjefoiern', 'Alvin', 'He')).toStrictEqual(ERROR);
  request('DELETE', SERVER_URL + '/v1/clear', { json: {} });
});
