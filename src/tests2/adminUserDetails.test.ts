import {
  adminAuthRegisterT,
  adminUserDetailsT2,
  adminAuthLoginT,
  clearT
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminUserDetails', () => {
  test('authUserId is invalid', () => {
    expect(adminUserDetailsT2('1').Code).toBe(401);
  });

  test('Valid parameters', () => {
    const adminAuthRegisterReturnObject = adminAuthRegisterT(
      'validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');

    expect(adminUserDetailsT2(adminAuthRegisterReturnObject.token).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Jake Renzella',
        email: 'validemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
  });
  test('Valid parameters', () => {
    const adminAuthRegisterReturnObject = adminAuthRegisterT(
      'validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user2 = adminAuthRegisterT('email@yahoo.com', 'password123', 'Mahdi', 'Sabbagh');

    expect(adminUserDetailsT2(adminAuthRegisterReturnObject.token).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Jake Renzella',
        email: 'validemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    adminAuthLoginT('email@yahoo.com', 'wrongpassword');
    expect(adminUserDetailsT2(user2.token).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Mahdi Sabbagh',
        email: 'email@yahoo.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1,
      }
    }
    );
    clearT();
  });
});
