import {
  adminAuthRegisterT,
  adminAuthLogoutT2,
  adminUserDetailsUpdateT2,
  adminUserDetailsT2,
  clearT,
} from '../tests/reqFunctions';

beforeEach(() => {
  clearT();
});

describe('adminUserDetailsUpdate', () => {
  let authUser: string;
  let authUser2: string;
  beforeEach(() => {
    // console.log(adminAuthRegisterT('abc123@gmail.com', 'password1', 'ray', 'li').token);
    authUser = adminAuthRegisterT('abc123@gmail.com', 'password1', 'ray', 'li').token;
    authUser2 = adminAuthRegisterT('abc321@gmail.com', 'password1', 'ray', 'li').token;
  });

  /// invalid auth user ID
  test('Invalid email', () => {
    expect(adminUserDetailsUpdateT2('1', 'abc321d@gmail.com.com', 'ray', 'li').Code).toBe(401);
  });
  test('email already registered', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abc321@gmail.com', 'ray', 'li').Code).toBe(400);
  });

  /// invalid quiz ID
  test('Invalid email', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abc321bon.bon.com', 'ray', 'li').Code).toBe(400);
  });

  /// user does not own quiz
  test('invalid firstname', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abcd321@gmail.com', 'ray&&', 'li').Code).toBe(400);
  });
  test('invalid firstname', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abcd321@gmail.com', 'r', 'li').Code).toBe(400);
  });
  test('invalid firstname', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abcd321@gmail.com', 'thisis a very long and long and long and long and long and long name', 'li').Code).toBe(400);
  });

  test('invalid lasttname', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abcd321@gmail.com', 'ray and friends', 'l').Code).toBe(400);
  });
  test('invalid lasttname', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abcd321@gmail.com', 'ray and - frined', 'li**$%^&').Code).toBe(400);
  });
  test('invalid lasttname', () => {
    expect(adminUserDetailsUpdateT2(authUser, 'abcd321@gmail.com', 'li', 'thisis a very long and long and long and long and long and long name').Code).toBe(400);
  });

  test('valid description update', () => {
    expect(adminUserDetailsT2(authUser).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'ray li',
        email: 'abc123@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(adminUserDetailsT2(authUser2).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'ray li',
        email: 'abc321@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(adminUserDetailsUpdateT2(authUser, 'newemail@gmail.com', 'mahdi and nds', 'suppp').return).toStrictEqual({});
    expect(adminUserDetailsUpdateT2(authUser2, 'newemail2@gmail.com', 'mahdi-\' nemies', 'whatsupp').return).toStrictEqual({});
    expect(adminUserDetailsT2(authUser).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'mahdi and nds suppp',
        email: 'newemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(adminUserDetailsT2(authUser2).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'mahdi-\' nemies whatsupp',
        email: 'newemail2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    expect(adminAuthLogoutT2(authUser).return).toStrictEqual({});
    expect(adminUserDetailsT2(authUser).Code).toBe(401);
    expect(adminUserDetailsT2(authUser2).return).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'mahdi-\' nemies whatsupp',
        email: 'newemail2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0
      }
    });
    clearT();
  });
});
