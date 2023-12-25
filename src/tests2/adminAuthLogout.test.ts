import {
  adminAuthLogoutT2,
  adminUserDetailsT2,
  adminAuthRegisterT,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('Testing Quiz Deletion', () => {
  test('invalid token', () => {
    adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe');
    expect(adminAuthLogoutT2('1').Code).toBe(401);
    expect(adminAuthLogoutT2('').Code).toBe(401);
  });
  test('valid logout token', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    expect(adminUserDetailsT2(userId).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'John Doe',
        email: 'testemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(adminAuthLogoutT2(userId).return).toStrictEqual({});
    expect(adminUserDetailsT2(userId).Code).toBe(401);
  });

  test('logout erro1r', () => {
    const userId = adminAuthRegisterT('testemail@gmail.com', 'pass123!', 'John', 'Doe').token;
    expect(adminAuthLogoutT2(userId + 'string').Code).toBe(401);
    clearT();
  });
});
