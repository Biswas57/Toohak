import { adminAuthLogoutT, adminAuthRegisterT, adminAuthLoginT, clearT, adminUserDetailsT } from './reqFunctions';

beforeEach(() => {
  clearT();
});

const ERROR = { error: expect.any(String) };

describe('tests for function clear', () => {
  test('return value', () => {
    expect(clearT()).toStrictEqual({});
  });
  test('dataStore has not been cleared', () => {
    const userId1 = adminAuthRegisterT('admin@gmail.com', 'abcd12345', 'Aaryan', 'Nambissan');
    expect(adminAuthLoginT('admin@gmail.com', 'abcd12345')).toStrictEqual({ token: expect.any(String) });
    expect(adminUserDetailsT(userId1.token)).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: 'Aaryan Nambissan',
          email: 'admin@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0
        }
      }
    );
    expect(adminAuthLogoutT(userId1.token)).toStrictEqual({});
    expect(adminUserDetailsT(userId1.token)).toStrictEqual(ERROR);
    expect(adminAuthLoginT('admin@gmail.com', 'abcd12345')).toStrictEqual({ token: expect.any(String) });
    expect(clearT()).toStrictEqual({});
    expect(adminAuthLoginT('admin@gmail.com', 'abcd12345')).toStrictEqual(ERROR);
    clearT();
  });
});
