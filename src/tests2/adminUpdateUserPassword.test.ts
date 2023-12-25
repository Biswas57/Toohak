import {
  adminAuthRegisterT,
  adminPasswordUpdateT2,
  adminAuthLoginT,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

const ERROR = { error: expect.any(String) };
describe('Testing adminQuizCreate', () => {
  let authUser: string;
  beforeEach(() => {
    authUser = adminAuthRegisterT('Alvinhe9@gmail.com', 'Carsarecool98', 'Alvin', 'He').token;
  });
  test('Everything is valid', () => {
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
    expect(adminPasswordUpdateT2(authUser + '1', 'Carsarecool98', 'CarsareSad54').Code).toBe(401);
    expect(adminPasswordUpdateT2(authUser, 'Carsarecool98', 'CarsareSad54').return).toStrictEqual({});
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'CarsareSad54')).toStrictEqual({ token: expect.any(String) });
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual(ERROR);
    expect(adminPasswordUpdateT2(authUser, 'Carsarecool98', 'CarsareSad54').Code).toBe(400);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'CarsareSad54')).toStrictEqual({ token: expect.any(String) });
  });

  test('new password is one of the old password', () => {
    expect(adminPasswordUpdateT2(authUser, 'Carsarecool98', 'CarsareSad54').return).toStrictEqual({});
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'CarsareSad54')).toStrictEqual({ token: expect.any(String) });
    expect(adminPasswordUpdateT2(authUser, 'CarsareSad54', 'Carsarecool98').Code).toBe(400);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'CarsareSad54')).toStrictEqual({ token: expect.any(String) });
  });

  test('invalid token', () => {
    expect(adminPasswordUpdateT2('1', 'Carsarecool98', 'CarsareSad54').Code).toBe(401);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'CarsareSad54')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
  });
  // Old Password is not the correct old password
  test('Old Password is not the correct old password', () => {
    expect(adminPasswordUpdateT2(authUser, 'weojdweof', 'CarsareSad54').Code).toBe(400);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'CarsareSad54')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
  });

  // Old Password and New Password match exactly
  test('Old Password and New Password match exactly', () => {
    expect(adminPasswordUpdateT2(authUser, 'Carsarecool98', 'Carsarecool98').Code).toBe(400);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
  });

  // New Password has already been used before by this user  //need to keep track of old passwords

  // New Password is less than 8 characters
  test('New Password is less than 8 characters', () => {
    expect(adminPasswordUpdateT2(authUser, 'Carsarecool98', 'feR9d').Code).toBe(400);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'feR9d')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
  });

  // New Password does not contain at least one number and at least one letter
  test('New Password does not contain at least one number and at least one letter', () => {
    expect(adminPasswordUpdateT2(authUser, 'Carsarecool98', 'wefffffffffff').Code).toBe(400);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'wefffffffffff')).toStrictEqual(ERROR);
    expect(adminAuthLoginT('Alvinhe9@gmail.com', 'Carsarecool98')).toStrictEqual({ token: expect.any(String) });
    clearT();
  });
});
