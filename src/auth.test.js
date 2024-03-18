
import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserPasswordUpdate,
  adminUserDetails,
  adminUserDetailsUpdate,
} from './auth.js';
import { clear } from './other.js';
import { getData } from './dataStore.js';

import { requestAdminAuthRegister } from './authHelperFunctions';

beforeEach(() => {
  clear();
});

// Testing for adminAuthRegister
describe('adminAuthRegister', () => {
  test('Checks for successful registration', () => {
    const authUserId = requestAdminAuthRegister('ZeeeeeeVeeee@hotpotdot.com', '1234abc@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId).toStrictEqual({
      authUserId: expect.any(Number)
    });
  });

  test('Checks for duplicate email', () => {
    requestAdminAuthRegister('ZeeeeeeVeeee@hotpotdot.com', '1234abc@#$', 'Zeeeeee', 'Veeee');
    const authUserId2 = requestAdminAuthRegister('ZeeeeeeVeeee@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Email already registered' });
  });

  test('Checks for fail on short passwords', () => {
    const authUserId1 = requestAdminAuthRegister('test1@hotpotdot.com', '', 'Zeeeeee', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId2 = requestAdminAuthRegister('test2@hotpotdot.com', '1', 'Zeeeeee', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId3 = requestAdminAuthRegister('test3@hotpotdot.com', '1a', 'Zeeeeee', 'Veeee');
    expect(authUserId3).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId4 = requestAdminAuthRegister('test4@hotpotdot.com', '12a', 'Zeeeeee', 'Veeee');
    expect(authUserId4).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId5 = requestAdminAuthRegister('test5@hotpotdot.com', '12ab', 'Zeeeeee', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId6 = requestAdminAuthRegister('test6@hotpotdot.com', '123ab', 'Zeeeeee', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId7 = requestAdminAuthRegister('test7@hotpotdot.com', '123abc', 'Zeeeeee', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Password Less than 8 characters' });

    const authUserId8 = requestAdminAuthRegister('test8@hotpotdot.com', '1234abc', 'Zeeeeee', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Password Less than 8 characters' });
  });

  test('Checks if Email validates', () => {
    const authUserId1 = requestAdminAuthRegister('test1@@hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Email is not valid' });

    const authUserId2 = requestAdminAuthRegister('test1hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Email is not valid' });

    const authUserId3 = requestAdminAuthRegister('test1@hotpotdotcom', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId3).toStrictEqual({ error: 'Email is not valid' });

    const authUserId4 = requestAdminAuthRegister('.test1@hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId4).toStrictEqual({ error: 'Email is not valid' });

    const authUserId5 = requestAdminAuthRegister('test1@hotpotdot..com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Email is not valid' });

    const authUserId6 = requestAdminAuthRegister('test1@hotpotdot.c', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Email is not valid' });

    const authUserId7 = requestAdminAuthRegister('<test1@hotpotdot.com>', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Email is not valid' });

    const authUserId8 = requestAdminAuthRegister('"test1@hotpotdot".com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Email is not valid' });

    const authUserId9 = requestAdminAuthRegister('test1 @hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId9).toStrictEqual({ error: 'Email is not valid' });
  });

  test('Checks if NameFirst is less than 2 characters or more than 20 characters', () => {
    const authUserId1 = requestAdminAuthRegister('test1@hotpotdot.com', '1234abc!@#$', '', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Firstname is too short' });

    const authUserId2 = requestAdminAuthRegister('test2@hotpotdot.com', '1234abc!@#$', 'Z', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Firstname is too short' });

    const authUserId3 = requestAdminAuthRegister('test3@hotpotdot.com', '1234abc!@#$', 'Z ', 'Veeee');
    expect(authUserId3.error).toBeUndefined();

    const authUserId4 = requestAdminAuthRegister('test4@hotpotdot.com', '1234abc!@#$', ' Z', 'Veeee');
    expect(authUserId4.error).toBeUndefined();

    const authUserId5 = requestAdminAuthRegister('test5@hotpotdot.com', '1234abc!@#$', ' ZeeeeZeeeeZeeeeZeeee ', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Firstname is too long' });

    const authUserId6 = requestAdminAuthRegister('test6@hotpotdot.com', '1234abc!@#$', 'ZeeeeZeeeeZeeeeZeeee ', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Firstname is too long' });

    const authUserId7 = requestAdminAuthRegister('test7@hotpotdot.com', '1234abc!@#$', 'ZeeeeZeeeeZeeeeZeeeeH', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Firstname is too long' });

    const authUserId8 = requestAdminAuthRegister('test8@hotpotdot.com', '1234abc!@#$', 'ZeeeeZeeeeZeeeeZeeeeHH', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Firstname is too long' });
  });

  test('Checks if NameFirst contains invalid characters', () => {
    const authUserId1 = requestAdminAuthRegister('test9@hotpotdot.com', '1234abc!@#$', 'Zeeeeee$', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId2 = requestAdminAuthRegister('test10@hotpotdot.com', '1234abc!@#$', 'Zeeeeee@', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId3 = requestAdminAuthRegister('test11@hotpotdot.com', '1234abc!@#$', 'Zee/eee', 'Veeee');
    expect(authUserId3).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId4 = requestAdminAuthRegister('test12@hotpotdot.com', '1234abc!@#$', 'Zeeeeee*', 'Veeee');
    expect(authUserId4).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId5 = requestAdminAuthRegister('test13@hotpotdot.com', '1234abc!@#$', 'Zee+eee', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId6 = requestAdminAuthRegister('test14@hotpotdot.com', '1234abc!@#$', 'Zee?eee', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId7 = requestAdminAuthRegister('test15@hotpotdot.com', '1234abc!@#$', 'Zeeeeee:', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId8 = requestAdminAuthRegister('test16@hotpotdot.com', '1234abc!@#$', 'Zee=eee', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId9 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee~', 'Veeee');
    expect(authUserId9).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId10 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee<', 'Veeee');
    expect(authUserId10).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId11 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee>', 'Veeee');
    expect(authUserId11).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId12 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee.', 'Veeee');
    expect(authUserId12).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId13 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee!', 'Veeee');
    expect(authUserId13).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId14 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee#', 'Veeee');
    expect(authUserId14).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId15 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee%', 'Veeee');
    expect(authUserId15).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId16 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee^', 'Veeee');
    expect(authUserId16).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId17 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee(', 'Veeee');
    expect(authUserId17).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId18 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee)', 'Veeee');
    expect(authUserId18).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId19 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee_', 'Veeee');
    expect(authUserId19).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId20 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee[', 'Veeee');
    expect(authUserId20).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId21 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee]', 'Veeee');
    expect(authUserId21).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId22 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee{', 'Veeee');
    expect(authUserId22).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId23 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee}', 'Veeee');
    expect(authUserId23).toStrictEqual({ error: 'Firstname contains invalid characters' });
  });

  test('Checks if NameLast is less than 2 characters or more than 20 characters', () => {
    const authUserId1 = requestAdminAuthRegister('test11@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', '');
    expect(authUserId1).toStrictEqual({ error: 'Lastname is too short' });

    const authUserId2 = requestAdminAuthRegister('test22@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'V');
    expect(authUserId2).toStrictEqual({ error: 'Lastname is too short' });

    const authUserId3 = requestAdminAuthRegister('test33@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'V ');
    expect(authUserId3.error).toBeUndefined();

    const authUserId4 = requestAdminAuthRegister('test44@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', ' V');
    expect(authUserId4.error).toBeUndefined();

    const authUserId5 = requestAdminAuthRegister('test55@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', ' VeeeeVeeeeVeeeeVeeee ');
    expect(authUserId5).toStrictEqual({ error: 'Lastname is too long' });

    const authUserId6 = requestAdminAuthRegister('test66@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'VeeeeVeeeeVeeeeVeeee ');
    expect(authUserId6).toStrictEqual({ error: 'Lastname is too long' });

    const authUserId7 = requestAdminAuthRegister('test77@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'VeeeeVeeeeVeeeeVeeeeH');
    expect(authUserId7).toStrictEqual({ error: 'Lastname is too long' });

    const authUserId8 = requestAdminAuthRegister('test88@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'VeeeeVeeeeVeeeeVeeeeHH');
    expect(authUserId8).toStrictEqual({ error: 'Lastname is too long' });
  });

  test('Checks if NameLast contains invalid characters', () => {
    const authUserId1 = requestAdminAuthRegister('test9@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee$');
    expect(authUserId1).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId2 = requestAdminAuthRegister('test10@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee@');
    expect(authUserId2).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId3 = requestAdminAuthRegister('test11@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee/eee');
    expect(authUserId3).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId4 = requestAdminAuthRegister('test12@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee*');
    expect(authUserId4).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId5 = requestAdminAuthRegister('test13@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee+eee');
    expect(authUserId5).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId6 = requestAdminAuthRegister('test14@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee?eee');
    expect(authUserId6).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId7 = requestAdminAuthRegister('test15@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee:');
    expect(authUserId7).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId8 = requestAdminAuthRegister('test16@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee=eee');
    expect(authUserId8).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId9 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee~');
    expect(authUserId9).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId10 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee<');
    expect(authUserId10).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId11 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee>');
    expect(authUserId11).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId12 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee.');
    expect(authUserId12).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId13 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee!');
    expect(authUserId13).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId14 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee#');
    expect(authUserId14).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId15 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee%');
    expect(authUserId15).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId16 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee^');
    expect(authUserId16).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId17 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee(');
    expect(authUserId17).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId18 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee)');
    expect(authUserId18).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId19 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee_');
    expect(authUserId19).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId20 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee[');
    expect(authUserId20).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId21 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee]');
    expect(authUserId21).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId22 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee{');
    expect(authUserId22).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId23 = requestAdminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee}');
    expect(authUserId23).toStrictEqual({ error: 'Lastname contains invalid characters' });
  });

  test('Checks if password contains at least one number and at least one letter', () => {
    const authUserId1 = requestAdminAuthRegister('testp1@hotpotdot.com', '1234abcd', 'Zeeeeee', 'Veeee');
    expect(authUserId1.error).toBeUndefined();

    const authUserId2 = requestAdminAuthRegister('testp2@hotpotdot.com', '123456789', 'Zeeeeee', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Password must contain at least one number and one letter' });

    const authUserId3 = requestAdminAuthRegister('testp3@hotpotdot.com', 'abcdabcd', 'Zeeeeee', 'Veeee');
    expect(authUserId3).toStrictEqual({ error: 'Password must contain at least one number and one letter' });
  });
});

describe('adminAuthLogin', () => {
  test('Checks for successful login', () => {
    const authUserId = adminAuthRegister('successfulllogin@hotpotdot.com', '1234abc@#$', 'Zeeeeee', 'Veeee');
    const authUserId2 = adminAuthLogin('successfulllogin@hotpotdot.com', '1234abc@#$');
    expect(authUserId2.authUserId).toBe(authUserId.authUserId);
  });

  test('Checks if email exists', () => {
    const authUserId1 = adminAuthLogin('doesnotexist@hotpotdot.com', '1234abc@#$');
    expect(authUserId1).toStrictEqual({ error: 'Email does not exist' });
  });

  test('Password not correct for given email', () => {
    adminAuthRegister('correctpasswordtest@hotpotdot.com', 'CorrectPass123', 'TestName', 'TestLast');
    const authUserId2 = adminAuthLogin('correctpasswordtest@hotpotdot.com', 'WrongPass123');
    expect(authUserId2).toStrictEqual({ error: 'Password is incorrect for the given email' });
  });

  test('Successful login increments numSuccessfulLogins', () => {
    adminAuthRegister('incrementlogin@hotpotdot.com', 'incrementPass123', 'NameIncrement', 'LastIncrement');
    adminAuthLogin('incrementlogin@hotpotdot.com', 'incrementPass123');

    const users = getData().users;
    const user = users.find(user => user.email === 'incrementlogin@hotpotdot.com');

    expect(user.numSuccessfulLogins).toBe(2);
  });
});

// Testing for adminUserDetails
describe('adminUserDetails', () => {
  test('Check if authUserId exists', () => {
    const authUserId = adminAuthRegister('userdetails@hotpotdot.com', '1234abcD@#$', 'FirstName', 'LastName');
    const authUserId2 = adminUserDetails(authUserId.authUserId);
    expect(authUserId2.user).toEqual({
      userId: authUserId.authUserId,
      name: 'FirstName LastName',
      email: 'userdetails@hotpotdot.com',
      numSuccessfulLogins: authUserId2.user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: authUserId2.user.numFailedPasswordsSinceLastLogin,
    });
  });

  test('authUserId is not valid', () => {
    const authUserId = adminUserDetails(-1);
    expect(authUserId).toStrictEqual({ error: 'AuthUserId is not a valid user' });

    const authUserId2 = adminUserDetails(-2);
    expect(authUserId2).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });

  test('Check failed login', () => {
    const registerResponse = adminAuthRegister('reset@hotpotdot.com', 'Correct1$', 'Zeeeeee', 'Veeeeee');
    const authUserId = registerResponse.authUserId;

    adminAuthLogin('reset@hotpotdot.com', 'nooope1');
    adminAuthLogin('reset@hotpotdot.com', 'nooope2');

    const userDetails = adminUserDetails(authUserId);

    expect(userDetails.user.numSuccessfulLogins).toBe(1);
    expect(userDetails.user.numFailedPasswordsSinceLastLogin).toBe(2);
  });

  test('Check successful login', () => {
    const registerResponse = adminAuthRegister('reset@hotpotdot.com', 'Correct1$', 'Zeeeeee', 'Veeeeee');

    const authUserId = registerResponse.authUserId;
    adminAuthLogin('reset@hotpotdot.com', 'Correct1$');

    const userDetails = adminUserDetails(authUserId);

    expect(userDetails.user.numSuccessfulLogins).toBe(2);
    expect(userDetails.user.numFailedPasswordsSinceLastLogin).toBe(0);
  });
});

// Testing for adminUserDetailsUpdate
describe('adminUserDetailsUpdate', () => {
  test('Checks if authUserId exists', () => {
    const authUserId = adminAuthRegister('userdetailsupdate@hotpotdot.com', '1234abcD@#$', 'FirstName', 'LastName');
    const authUserId2 = adminUserDetails(authUserId.authUserId);
    expect(authUserId2.user).toEqual({
      userId: authUserId.authUserId,
      name: 'FirstName LastName',
      email: 'userdetailsupdate@hotpotdot.com',
      numSuccessfulLogins: authUserId2.user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: authUserId2.user.numFailedPasswordsSinceLastLogin,
    });
  });

  test('Checks if authUserId is valid', () => {
    const authUserId = adminUserDetails(-1);
    expect(authUserId).toStrictEqual({ error: 'AuthUserId is not a valid user' });

    const authUserId2 = adminUserDetails(-2);
    expect(authUserId2).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });

  test('Checks is email is currently being used by another user', () => {
    adminAuthRegister('user1@example.com', 'password1', 'FirstName', 'LastName');
    const authUserId2 = adminAuthRegister('user2@example.com', 'password2', 'FirstName', 'LastName');
    const authUserId3 = adminUserDetailsUpdate(authUserId2, 'user1@example.com', 'FirstName', 'LastName');
    expect(authUserId3).toStrictEqual({ error: 'Email address is used by another user' });
  });

  test('Checks if email is valid', () => {
    const authUserId1 = adminAuthRegister('test1@@hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Email is not valid' });

    const authUserId2 = adminAuthRegister('test1hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Email is not valid' });

    const authUserId3 = adminAuthRegister('test1@hotpotdotcom', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId3).toStrictEqual({ error: 'Email is not valid' });

    const authUserId4 = adminAuthRegister('.test1@hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId4).toStrictEqual({ error: 'Email is not valid' });

    const authUserId5 = adminAuthRegister('test1@hotpotdot..com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Email is not valid' });

    const authUserId6 = adminAuthRegister('test1@hotpotdot.c', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Email is not valid' });

    const authUserId7 = adminAuthRegister('<test1@hotpotdot.com>', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Email is not valid' });

    const authUserId8 = adminAuthRegister('"test1@hotpotdot".com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Email is not valid' });

    const authUserId9 = adminAuthRegister('test1 @hotpotdot.com', '1234abcd!@#$', 'Zeeeeee', 'Veeee');
    expect(authUserId9).toStrictEqual({ error: 'Email is not valid' });
  });

  test('NameFirst is less than 2 characters or more than 20 characters', () => {
    const authUserId1 = adminAuthRegister('test1@hotpotdot.com', '1234abc!@#$', '', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Firstname is too short' });

    const authUserId2 = adminAuthRegister('test2@hotpotdot.com', '1234abc!@#$', 'Z', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Firstname is too short' });

    const authUserId3 = adminAuthRegister('test3@hotpotdot.com', '1234abc!@#$', 'Z ', 'Veeee');
    expect(authUserId3.error).toBeUndefined();

    const authUserId4 = adminAuthRegister('test4@hotpotdot.com', '1234abc!@#$', ' Z', 'Veeee');
    expect(authUserId4.error).toBeUndefined();

    const authUserId5 = adminAuthRegister('test5@hotpotdot.com', '1234abc!@#$', ' ZeeeeZeeeeZeeeeZeeee ', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Firstname is too long' });

    const authUserId6 = adminAuthRegister('test6@hotpotdot.com', '1234abc!@#$', 'ZeeeeZeeeeZeeeeZeeee ', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Firstname is too long' });

    const authUserId7 = adminAuthRegister('test7@hotpotdot.com', '1234abc!@#$', 'ZeeeeZeeeeZeeeeZeeeeH', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Firstname is too long' });

    const authUserId8 = adminAuthRegister('test8@hotpotdot.com', '1234abc!@#$', 'ZeeeeZeeeeZeeeeZeeeeHH', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Firstname is too long' });
  });

  test('NameFirst contains invalid characters', () => {
    const authUserId1 = adminAuthRegister('test9@hotpotdot.com', '1234abc!@#$', 'Zeeeeee$', 'Veeee');
    expect(authUserId1).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId2 = adminAuthRegister('test10@hotpotdot.com', '1234abc!@#$', 'Zeeeeee@', 'Veeee');
    expect(authUserId2).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId3 = adminAuthRegister('test11@hotpotdot.com', '1234abc!@#$', 'Zee/eee', 'Veeee');
    expect(authUserId3).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId4 = adminAuthRegister('test12@hotpotdot.com', '1234abc!@#$', 'Zeeeeee*', 'Veeee');
    expect(authUserId4).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId5 = adminAuthRegister('test13@hotpotdot.com', '1234abc!@#$', 'Zee+eee', 'Veeee');
    expect(authUserId5).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId6 = adminAuthRegister('test14@hotpotdot.com', '1234abc!@#$', 'Zee?eee', 'Veeee');
    expect(authUserId6).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId7 = adminAuthRegister('test15@hotpotdot.com', '1234abc!@#$', 'Zeeeeee:', 'Veeee');
    expect(authUserId7).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId8 = adminAuthRegister('test16@hotpotdot.com', '1234abc!@#$', 'Zee=eee', 'Veeee');
    expect(authUserId8).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId9 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee~', 'Veeee');
    expect(authUserId9).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId10 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee<', 'Veeee');
    expect(authUserId10).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId11 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee>', 'Veeee');
    expect(authUserId11).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId12 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee.', 'Veeee');
    expect(authUserId12).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId13 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee!', 'Veeee');
    expect(authUserId13).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId14 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee#', 'Veeee');
    expect(authUserId14).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId15 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee%', 'Veeee');
    expect(authUserId15).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId16 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee^', 'Veeee');
    expect(authUserId16).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId17 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee(', 'Veeee');
    expect(authUserId17).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId18 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee)', 'Veeee');
    expect(authUserId18).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId19 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee_', 'Veeee');
    expect(authUserId19).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId20 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee[', 'Veeee');
    expect(authUserId20).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId21 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee]', 'Veeee');
    expect(authUserId21).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId22 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee{', 'Veeee');
    expect(authUserId22).toStrictEqual({ error: 'Firstname contains invalid characters' });

    const authUserId23 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee}', 'Veeee');
    expect(authUserId23).toStrictEqual({ error: 'Firstname contains invalid characters' });
  });

  test('NameLast is less than 2 characters or more than 20 characters', () => {
    const authUserId1 = adminAuthRegister('test11@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', '');
    expect(authUserId1).toStrictEqual({ error: 'Lastname is too short' });

    const authUserId2 = adminAuthRegister('test22@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'V');
    expect(authUserId2).toStrictEqual({ error: 'Lastname is too short' });

    const authUserId3 = adminAuthRegister('test33@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'V ');
    expect(authUserId3.error).toBeUndefined();

    const authUserId4 = adminAuthRegister('test44@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', ' V');
    expect(authUserId4.error).toBeUndefined();

    const authUserId5 = adminAuthRegister('test55@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', ' VeeeeVeeeeVeeeeVeeee ');
    expect(authUserId5).toStrictEqual({ error: 'Lastname is too long' });

    const authUserId6 = adminAuthRegister('test66@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'VeeeeVeeeeVeeeeVeeee ');
    expect(authUserId6).toStrictEqual({ error: 'Lastname is too long' });

    const authUserId7 = adminAuthRegister('test77@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'VeeeeVeeeeVeeeeVeeeeH');
    expect(authUserId7).toStrictEqual({ error: 'Lastname is too long' });

    const authUserId8 = adminAuthRegister('test88@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'VeeeeVeeeeVeeeeVeeeeHH');
    expect(authUserId8).toStrictEqual({ error: 'Lastname is too long' });
  });

  test('NameLast contains invalid characters', () => {
    const authUserId1 = adminAuthRegister('test9@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee$');
    expect(authUserId1).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId2 = adminAuthRegister('test10@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee@');
    expect(authUserId2).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId3 = adminAuthRegister('test11@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee/eee');
    expect(authUserId3).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId4 = adminAuthRegister('test12@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee*');
    expect(authUserId4).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId5 = adminAuthRegister('test13@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee+eee');
    expect(authUserId5).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId6 = adminAuthRegister('test14@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee?eee');
    expect(authUserId6).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId7 = adminAuthRegister('test15@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee:');
    expect(authUserId7).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId8 = adminAuthRegister('test16@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Vee=eee');
    expect(authUserId8).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId9 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee~');
    expect(authUserId9).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId10 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee<');
    expect(authUserId10).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId11 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee>');
    expect(authUserId11).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId12 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee.');
    expect(authUserId12).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId13 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee!');
    expect(authUserId13).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId14 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee#');
    expect(authUserId14).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId15 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee%');
    expect(authUserId15).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId16 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee^');
    expect(authUserId16).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId17 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee(');
    expect(authUserId17).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId18 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee)');
    expect(authUserId18).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId19 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee_');
    expect(authUserId19).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId20 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee[');
    expect(authUserId20).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId21 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee]');
    expect(authUserId21).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId22 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee{');
    expect(authUserId22).toStrictEqual({ error: 'Lastname contains invalid characters' });

    const authUserId23 = adminAuthRegister('test17@hotpotdot.com', '1234abc!@#$', 'Zeeeeee', 'Veeeeee}');
    expect(authUserId23).toStrictEqual({ error: 'Lastname contains invalid characters' });
  });
});

// Testing for adminUserPasswordUpdate
describe('adminUserPasswordUpdate', () => {
  test('Checks if null is passed into AuthUserId parameter', () => {
    expect(adminUserPasswordUpdate(null, 'OldPass99', 'NewPass99')).toStrictEqual({ error: 'AuthUserId id not a valid user' });
  });

  test('Checks if AuthUserId is not a valid user', () => {
    const user = adminAuthRegister('email@gmail.com', 'OldPass99', 'Nick', 'Ta');
    expect(adminUserPasswordUpdate(user.authUserId + 1, 'OldPass99', 'NewPass99')).toStrictEqual({ error: 'AuthUserId id not a valid user' });
  });

  test('Checks if old password is not correct', () => {
    const user = adminAuthRegister('email@gmail.com', 'OldPass99', 'Nick', 'Ta');
    expect(adminUserPasswordUpdate(user.authUserId, 'WrongPassword', 'NewPass99')).toStrictEqual({ error: 'Old password is not correct' });
  });

  test('Checks if old password and new password match exactly', () => {
    const user = adminAuthRegister('email@gmail.com', 'OldPass99', 'Nick', 'Ta');
    expect(adminUserPasswordUpdate(user.authUserId, 'OldPass99', 'OldPass99')).toStrictEqual({ error: 'Old password and new password match exactly' });
  });

  test('Checks if new password has already been used before by this user', () => {
    const user2 = adminAuthRegister('email2@gmail.com', 'OldPass99', 'Nick', 'Ta');

    // change to new password
    expect(adminUserPasswordUpdate(user2.authUserId, 'OldPass99', 'NewPass99')).toStrictEqual(
      { }
    );
    // try to update to used password
    expect(adminUserPasswordUpdate(user2.authUserId, 'NewPass99', 'OldPass99')).toStrictEqual({ error: 'New password has already been used before by this user' });
  });

  test('Checks if new password is less than 8 characters', () => {
    const user = adminAuthRegister('email@gmail.com', 'OldPass99', 'Nick', 'Ta');
    expect(adminUserPasswordUpdate(user.authUserId, 'OldPass99', 'Short<8')).toStrictEqual({ error: 'New password is less than 8 characters' });
  });

  test.each([

    { password: 'NoNumber' },
    { password: '123456789' },
    { password: '~!@#$%^&*()_+' },

  ])("Checks if new passowrd is invalid: '$password'", ({ password }) => {
    const user = adminAuthRegister('email@gmail.com', 'OldPass99', 'Nick', 'Ta');
    expect(adminUserPasswordUpdate(user.authUserId, 'OldPass99', password)).toStrictEqual({ error: 'New password does not contain at least one number and at least one letter' });
  });

  test('Checks if old password is correct and new password is valid', () => {
    const data = getData();
    const user = adminAuthRegister('email@gmail.com', 'OldPass99', 'Nick', 'Ta');
    const userIndex = data.users.findIndex(h => h.authUserId === user.authUserId);

    // checks for correct return type
    expect(adminUserPasswordUpdate(user.authUserId, 'OldPass99', 'NewPass99')).toStrictEqual(
      { }
    );
    // checks if password is updated correctly
    expect(data.users[userIndex].password).toStrictEqual('NewPass99');
  });
});
