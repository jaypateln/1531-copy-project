import { clear } from './other.js';
import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { getData } from './dataStore.js';

describe('Clear function', () => {
  // Checks if clear returns empty object
  test('Check if clear returns empty object.', () => {
    expect(clear()).toStrictEqual({});
  });

  // Simple test, also checking the dataStore data individually
  test('Checks if clear deleted quizzes and users', () => {
    // Registering users
    const authId1 = adminAuthRegister('vedantCCCCCC@gmail.com', 'T9iu9poiu', 'Ved', 'Khan');
    const authId2 = adminAuthRegister('gogooogagaaamentality@gmail.com', 'G00Googaga2', 'Gogis', 'George');

    // Registering quizzes
    adminQuizCreate(authId1.authUserId, 'vedants quiz', 'this is the best quiz bro');
    adminQuizCreate(authId2.authUserId, 'baddd quiz', 'wosrt quiz ever bro ifukwim');

    // The expected length of users array should be 2 before clearing
    const data1 = getData();
    expect(data1.users.length).toStrictEqual(2);

    // We clear(); here
    expect(clear()).toStrictEqual({});

    // Fetch the latest data, and we expect the quizzes array to be 0
    const data2 = getData();
    expect(data2.quizzes.length).toStrictEqual(0);
  });

  // Complex test, also checking the dataStore data individually
  test('Checks if clear deleted quizzes and users', () => {
    // Register users
    adminAuthRegister('vedantCCCCCC@gmail.com', 'T9iu9poiu', 'Ved', 'Khan');
    adminAuthRegister('gogooogagaaamentality@gmail.com', 'G00Googaga2', 'Gogis', 'George');

    // Expect users length to be 2
    const data1 = getData();
    expect(data1.users.length).toStrictEqual(2);

    expect(clear()).toStrictEqual({});

    // After clear(); we fetch the latest data and expect the length to be 0
    const data2 = getData();
    expect(data2.users.length).toStrictEqual(0);

    // Register users to add quizzes
    const authId3 = adminAuthRegister('vedantCCCCCC@gmail.com', 'T9iu9poiu', 'Ved', 'Khan');
    const authId4 = adminAuthRegister('gogooogagaaamentality@gmail.com', 'G00Googaga2', 'Gogis', 'George');

    // Create quizzes
    adminQuizCreate(authId3.authUserId, 'vedants', 'this is the best quiz bro');
    adminQuizCreate(authId4.authUserId, 'baddd', 'wosrt quiz ever bro ifukwim');

    // Expect quizzes length to be 2 since we created 2 quiz
    const data3 = getData();
    expect(data3.quizzes.length).toStrictEqual(2);

    expect(clear()).toStrictEqual({});

    // After clear(); we fetch latest data, and expect quizzes array length to be 0
    const data4 = getData();
    expect(data4.quizzes.length).toStrictEqual(0);
  });
});
