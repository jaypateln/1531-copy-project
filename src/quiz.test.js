
import { clear } from './other.js';
import { adminQuizList, adminQuizCreate, adminQuizInfo, adminQuizRemove, adminQuizDescriptionUpdate, adminQuizNameUpdate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { getData } from './dataStore.js';

beforeEach(() => {
  clear();
});

// Testing for adminQuizList
describe('adminQuizList', () => {
  test('Check if authUserId exists', () => {
    adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    expect(adminQuizList(-1)).toStrictEqual({ error: 'AuthUserId is not valid' });
  });

  test('Success Case', () => {
    const authUserId1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    const quiz = adminQuizCreate(authUserId1.authUserId, 'Animals', 'The description');
    expect(adminQuizList(authUserId1.authUserId)).toStrictEqual(
      { quizzes: [{ name: 'Animals', quizId: quiz.quizId }] });
  });
});

describe('adminQuizList', () => {
  test('Check if authUserId exists', () => {
    // Test with non-existing authUserId
    expect(adminQuizList(-1)).toStrictEqual({ error: 'AuthUserId is not valid' });
  });

  test('Success Case', () => {
    const authUserId1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    // Test with a user who has created quizzes
    const quiz1 = adminQuizCreate(authUserId1.authUserId, 'Animals', 'The description');
    const quiz2 = adminQuizCreate(authUserId1.authUserId, 'History', 'The description');
    expect(adminQuizList(authUserId1.authUserId)).toStrictEqual({
      quizzes: [
        { name: 'Animals', quizId: quiz1.quizId },
        { name: 'History', quizId: quiz2.quizId }
      ]
    });
  });

  test('No quizzes created by user', () => {
    const authUserId2 = adminAuthRegister('janedoe@gmail.com', '5678Def@#$', 'Alice', 'Smith');
    // Test with a user who hasn't created any quizzes
    expect(adminQuizList(authUserId2.authUserId)).toStrictEqual({ quizzes: [] });
  });

  test('Multiple users with quizzes', () => {
    const authUserId3 = adminAuthRegister('alice@example.com', 'p@ssw0rd', 'Alice', 'Johnson');
    const authUserId4 = adminAuthRegister('bob@example.com', 'p@ssw0rd', 'Bob', 'Smith');
    // Create quizzes for both users
    const quiz1 = adminQuizCreate(authUserId3.authUserId, 'Math', 'The description');
    const quiz2 = adminQuizCreate(authUserId4.authUserId, 'Science', 'The description');
    expect(adminQuizList(authUserId3.authUserId)).toStrictEqual({ quizzes: [{ name: 'Math', quizId: quiz1.quizId }] });
    expect(adminQuizList(authUserId4.authUserId)).toStrictEqual({ quizzes: [{ name: 'Science', quizId: quiz2.quizId }] });
  });
});

// Testing for adminQuizRemove
describe('adminQuizRemove', () => {
  test('Checks if AuthUserId is valid', () => {
    const user = adminAuthRegister('Nick@gmail.com', 'OldPass99', 'Nick', 'Ta');
    const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'description');

    expect(adminQuizRemove(-1, quiz.quizId)).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });

  test('Checks if QuizId is valid', () => {
    const user = adminAuthRegister('Nick@gmail.com', 'OldPass99', 'Nick', 'Ta');
    adminQuizCreate(user.authUserId, 'Quiz1', 'description');

    expect(adminQuizRemove(user.authUserId, -1)).toStrictEqual({ error: 'QuizId does not refer to a valid quiz' });
  });

  test('Checks if QuizId does not refer to a quiz that this user owns', () => {
    const user = adminAuthRegister('Nick@gmail.com', 'OldPass99', 'Nick', 'Ta');
    const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'description');
    const userNotQuizOwner = adminAuthRegister('NotOwner@gmail.com', 'Password99', 'Vedant', 'Tan');

    expect(adminQuizRemove(userNotQuizOwner.authUserId, quiz.quizId)).toStrictEqual({ error: 'QuizId does not refer to a quiz that this user owns' });
  });

  test('Checks if AuthUserId and QuizId are both valid and user also owns quiz', () => {
    const data = getData();
    const user2 = adminAuthRegister('Nick2@gmail.com', 'OldPass99', 'Nick', 'Ta');
    const quiz2 = adminQuizCreate(user2.authUserId, 'Quiz2', 'description');

    const deletedQuizId = quiz2.quizId;

    // Checks for correct return type
    expect(adminQuizRemove(user2.authUserId, quiz2.quizId)).toStrictEqual(
      { }
    );

    // Checks if quiz is removed correctly
    expect(data.quizzes.find(quiz => quiz2.quizId === deletedQuizId)).toBeUndefined();
  });
});

// Testing for adminQuizCreate
describe('adminQuizCreate', () => {
  test('Check if adminUserId exists', () => {
    const authUser = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    expect(adminQuizCreate(authUser.authUserId, 'Animals', 'Quiz that asks questions about different animals.')).toStrictEqual({
      quizId: expect.any(Number),
    });
  });
  test('Checks if name has correct length', () => {
    const authUser1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeqeese', 'Veede');
    expect(adminQuizCreate(authUser1.authUserId, '', 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'The name length is invalid' });

    const authUser2 = adminAuthRegister('johndo@gmail.com', '12345bc@#$', 'Zeeleese', 'Veete');
    expect(adminQuizCreate(authUser2.authUserId, ' ', 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'The name length is invalid' });

    const authUser3 = adminAuthRegister('johnd@gmail.com', '1234A9c@#$', 'Zeepeese', 'Veere');
    expect(adminQuizCreate(authUser3.authUserId, 'AB', 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'The name length is invalid' });

    const authUser4 = adminAuthRegister('john@gmail.com', '1234Ab1@#$', 'Zeeaeese', 'Veeue');
    expect(adminQuizCreate(authUser4.authUserId, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'The name length is invalid' });
  });

  test('Checks if name contains valid characters', () => {
    const authUser1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Vepee');
    expect(adminQuizCreate(authUser1.authUserId, 'Animals', 'Quiz that asks questions about different animals.')).toStrictEqual({
      quizId: expect.any(Number),
    });

    const authUser2 = adminAuthRegister('johndo@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    expect(adminQuizCreate(authUser2.authUserId, 'About Animals', 'Quiz that asks questions about different animals.')).toStrictEqual({
      quizId: expect.any(Number),
    });

    const authUser3 = adminAuthRegister('johnd@gmail.com', '1234Abc@#$', 'Zeeeexse', 'Venee');
    expect(adminQuizCreate(authUser3.authUserId, 'About Animals 1', 'Quiz that asks questions about different animals.')).toStrictEqual({
      quizId: expect.any(Number),
    });

    const authUser4 = adminAuthRegister('john@gmail.com', '1234Abc@#$', 'Zeeeqese', 'Veere');
    expect(adminQuizCreate(authUser4.authUserId, 'About Animal$', 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'The name contains invalid characters' });
  });

  test('Checks if name already exists', () => {
    const authUser1 = adminAuthRegister('johnde@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Vepee');
    adminQuizCreate(authUser1.authUserId, 'Animals', 'Quiz that asks questions about different animals.');

    const authUser2 = adminAuthRegister('johndo@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    expect(adminQuizCreate(authUser2.authUserId, 'Animals', 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'Quiz with the same name already exists' });
  });

  test('Checks if quizId is returning', () => {
    const authUser1 = adminAuthRegister('johndo@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    expect(adminQuizCreate(authUser1.authUserId, 'Planes', 'Quiz that asks questions about different planes.')).toStrictEqual({
      quizId: expect.any(Number),
    });
  });

  test('Checks if description is valid', () => {
    const authUser1 = adminAuthRegister('johndo@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    expect(adminQuizCreate(authUser1.authUserId, 'Planes', '')).toStrictEqual({
      quizId: expect.any(Number),
    });

    const authUser2 = adminAuthRegister('Jamesbond@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    expect(adminQuizCreate(authUser2.authUserId,
      'Planes 2', 'Quiz that asks questions about different planes. You will really enjoy this quiz. Play it with your friends and family')).toStrictEqual(
      { error: 'Description is too long' }
    );

    const authUser3 = adminAuthRegister('Helloworld@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    expect(adminQuizCreate(authUser3.authUserId, 'Planes 3', 'This quiz is about planes!')).toStrictEqual({
      quizId: expect.any(Number),
    });
  });

  test('Checks if the Quiz has been fixed correctly', () => {
    const authUser1 = adminAuthRegister('johndo@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    const quizId1 = adminQuizCreate(authUser1.authUserId, 'Planes', 'This quiz is about planes!');
    const QuizInfoReturn = adminQuizInfo(authUser1.authUserId, quizId1.quizId);

    expect(QuizInfoReturn.quizId).toStrictEqual(quizId1.quizId);
    expect(QuizInfoReturn.name).toStrictEqual('Planes');
    expect(QuizInfoReturn.description).toStrictEqual('This quiz is about planes!');
  });
});

// Test for adminQuizInfo
describe('adminQuizInfo', () => {
  // Successful return case
  test('Successful return if no errors', () => {
    const authId = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizId = adminQuizCreate(authId.authUserId, 'thisQuiz', 'the Description');

    const quizDetails = adminQuizInfo(authId.authUserId, quizId.quizId);

    // check all the fields if they're working as expected
    expect(quizDetails.quizId).toStrictEqual(quizId.quizId);
    expect(quizDetails.name).toStrictEqual('thisQuiz');
    expect(quizDetails.timeCreated).toStrictEqual(expect.any(Number));
    expect(quizDetails.timeLastEdited).toStrictEqual(quizDetails.timeCreated);
    expect(quizDetails.description).toStrictEqual('the Description');
  });

  // rigouros testing with adminQuizNameUpdate function
  test('Successful return with updated lastEditedTime', async() => {
    clear();
    const authId1 = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizId = adminQuizCreate(authId1.authUserId, 'thisQuiz', 'the Description');

    // Add a delay using setTimeout (just to make sure that time created and edited will be different)

    jest.useFakeTimers();
    setTimeout(() => {
      const nameUpdateReturn = adminQuizNameUpdate(authId1.authUserId, quizId.quizId, 'thatQUiz');
      expect(nameUpdateReturn).toStrictEqual({});
      const quizDetails = adminQuizInfo(authId1.authUserId, quizId.quizId);

      // check all the fields for expected behavior
      expect(quizDetails.quizId).toStrictEqual(quizId.quizId);
      expect(quizDetails.name).toStrictEqual('thatQUiz');
      expect(quizDetails.timeCreated).toStrictEqual(expect.any(Number));
      expect(quizDetails.timeLastEdited).not.toStrictEqual(quizDetails.timeCreated);
      expect(quizDetails.description).toStrictEqual('the Description');
    }, 2000);
    jest.runAllTimers();
  });

  // passing in -1 since authUserId will only be positive, so -1 is invalid id
  test('AuthUserId is not a valid user.', () => {
    const authId = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizId = adminQuizCreate(authId.authUserId, 'thisQuiz', 'the Description');
    const quizDetails = adminQuizInfo(-1, quizId.quizId);

    expect(quizDetails).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });

  // dont create quiz, pass in -1 since quizId can only be positive
  test('Quiz ID does not refer to a valid quiz.', () => {
    const authId = adminAuthRegister('thisisemail1@gmail.com', 'and1Mndi', 'Terry', 'Mandiaki');
    const quizDetails = adminQuizInfo(authId.authUserId, -1);

    expect(quizDetails).toStrictEqual({ error: 'QuizId is not valid' });
  });

  // creating two users, where random tried to access quiz owned not by them
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const authIdRandom = adminAuthRegister('thisisemail1@gmail.com', 'and1MnUi', 'fifiee', 'gigie');
    const authIdOwner = adminAuthRegister('thisisowner@gmail.com', 'r22iunH2', 'ufgugs', 'jbhiohs');

    const quizId = adminQuizCreate(authIdOwner.authUserId, 'mitochondria', 'thisismi tochondria');

    const quizDetails = adminQuizInfo(authIdRandom.authUserId, quizId.quizId);
    expect(quizDetails).toStrictEqual({ error: 'You do not have access to this Quiz' });
  });
});

// Test for adminQuizNameUpdate
describe('adminQuizNameUpdate', () => {
  // pass in -1 as user, since -1 is always invalid
  test('AuthUserId is not a valid user.', () => {
    const authId = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizId = adminQuizCreate(authId.authUserId, 'thisQuiz', 'the Description');
    const quizDetails = adminQuizNameUpdate(-1, quizId.quizId, 'new Name');

    expect(quizDetails).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });

  // pass in -1 for quizId since -1 is always invalid
  test('Quiz ID does not refer to a valid quiz.', () => {
    const authId = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizDetails = adminQuizNameUpdate(authId.authUserId, -1, 'non existing-quiz');

    expect(quizDetails).toStrictEqual({ error: 'QuizId is not valid' });
  });

  // creating two users, where random tried to access quiz owned not by them
  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const authIdRandom = adminAuthRegister('thisisemail1@gmail.com', 'and1MnUi', 'fifiee', 'gigie');
    const authIdOwner = adminAuthRegister('thisisowner@gmail.com', 'r22iunH2', 'ufgugs', 'jbhiohs');

    const quizId = adminQuizCreate(authIdOwner.authUserId, 'mitochondria', 'thisismi tochondria');
    const nameUpdate = adminQuizNameUpdate(authIdRandom.authUserId, quizId.quizId, 'new name');

    expect(nameUpdate).toStrictEqual({ error: 'You do not have access to this Quiz' });
  });

  // basic successful return case
  test('Successful return test', () => {
    const authId = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizId = adminQuizCreate(authId.authUserId, 'Mitochondria', 'This is mitochondria');

    adminQuizNameUpdate(authId.authUserId, quizId.quizId, 'Medulla Oblungata');
    const quizDetails = adminQuizInfo(authId.authUserId, quizId.quizId);

    expect(quizDetails.name).toEqual('Medulla Oblungata');
  });

  test('Checks if name has correct length', () => {
    const authId = adminAuthRegister('didip2@gmail.com', '3RtiiI8jHjj', 'Fiennn', 'Fitrnnss');
    const quizId = adminQuizCreate(authId.authUserId, 'mitochondria', 'description is good');

    // different length error checks for length of name
    expect(adminQuizNameUpdate(authId.authUserId, quizId.quizId, 'Quiz that asks questions about different animals')).toStrictEqual({ error: 'The name length is invalid' });
    expect(adminQuizNameUpdate(authId.authUserId, quizId.quizId, ' ')).toStrictEqual({ error: 'The name length is invalid' });
    expect(adminQuizNameUpdate(authId.authUserId, quizId.quizId, 'AB')).toStrictEqual({ error: 'The name length is invalid' });
    expect(adminQuizNameUpdate(authId.authUserId, quizId.quizId, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')).toStrictEqual({ error: 'The name length is invalid' });
  });

  // ~ and $ are invalid characters, testing for them below (non-alphanumeric)
  test('Checks if name contains valid characters', () => {
    const authId = adminAuthRegister('didip2@gmail.com', '3RtiiI8jHjj', 'Fiennn', 'Fitrnnss');
    const quizId = adminQuizCreate(authId.authUserId, 'mitochondria', 'description is good');

    expect(adminQuizNameUpdate(authId.authUserId, quizId.quizId, 'Quiz that$$~~~~~')).toStrictEqual({ error: 'The name contains invalid characters' });
  });

  // creating quiz with a same name as before
  test('Checks if name already exists', () => {
    const authUser1 = adminAuthRegister('johnde@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Vepee');
    adminQuizCreate(authUser1.authUserId, 'Animals', 'Quiz that asks questions about different animals.');

    const authUser2 = adminAuthRegister('johndo@gmail.com', '1234Abc@#$', 'Zeeezese', 'Veyee');
    const quizId2 = adminQuizCreate(authUser2.authUserId, 'Chocolates', 'Quiz that asks questions about different animals.');

    const nameUpdate = adminQuizNameUpdate(authUser2.authUserId, quizId2.quizId, 'Animals');
    expect(nameUpdate).toStrictEqual({ error: 'Quiz with the same name already exists' });
  });

  // Successful return case
  test('Successful return test', () => {
    const authId = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    const quizId = adminQuizCreate(authId.authUserId, 'Mitochondria', 'This is mitochondria');

    adminQuizNameUpdate(authId.authUserId, quizId.quizId, 'Medulla Oblungata');
    const quizDetails = adminQuizInfo(authId.authUserId, quizId.quizId);

    expect(quizDetails.name).toEqual('Medulla Oblungata');
  });

  // Rigouors testing with other functions, checks for timeLastEdited
  test('Successful return test', () => {
    const authId1 = adminAuthRegister('jhondoe@gmail.com', 'jH0nd999oe', 'Jhon', 'Doe');
    adminQuizCreate(authId1.authUserId, 'Mitochondria', 'This is mitochondria');

    const authId2 = adminAuthRegister('plsHogaddi@gmail.com', 'Ui0iiggf7', 'Himaa', 'Challl');
    const quizId2 = adminQuizCreate(authId2.authUserId, 'Brain', 'About Cerebral Cortex');

    // introducing a delay of 2 seconds to test if the timeLast Edited is different than timeCreated
    jest.useFakeTimers();
    setTimeout(() => {
      const nameUpdate = adminQuizNameUpdate(authId2.authUserId, quizId2.quizId, 'Cerebral Cortex');
      expect(nameUpdate).toStrictEqual({});

      const quizDetails = adminQuizInfo(authId2.authUserId, quizId2.quizId);
      expect(quizDetails.name).toEqual('Cerebral Cortex');
      expect(quizDetails.timeLastEdited).not.toEqual(quizDetails.timeCreated);
    }, 2000);
    jest.runAllTimers();
  });
});

// Testing for adminQuizDescriptionUpdate
describe('adminQuizDescriptionUpdate', () => {
  test('Check if authUserId exists', () => {
    const authUserId = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    const quizId = adminQuizCreate(authUserId.authUserId, 'Animals', 'the Description');
    expect(adminQuizDescriptionUpdate(-1, quizId.quizId, 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'AuthUserId is not a valid user' });
  });

  test('Check if quizId exists.', () => {
    const authUserId = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    adminQuizCreate(authUserId.authUserId, 'Animals', 'the Description');
    expect(adminQuizDescriptionUpdate(authUserId.authUserId, -1, 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'QuizId does not refer to a valid quiz' });
  });

  test('Check if Quiz Id does not refer to a quiz that this user owns.', () => {
    const authUserId1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    const quizId1 = adminQuizCreate(authUserId1.authUserId, 'Animals', 'The description');
    const authUserId2 = adminAuthRegister('johndang@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    expect(adminQuizDescriptionUpdate(authUserId2.authUserId, quizId1.quizId, 'Quiz that asks questions about different animals.')).toStrictEqual({ error: 'QuizId does not refer to a quiz that this user owns' });
  });

  test('Check if description length is valid.', () => {
    const authUserId1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    const quizId1 = adminQuizCreate(authUserId1.authUserId, 'Animals', 'The description');
    expect(adminQuizDescriptionUpdate(authUserId1.authUserId, quizId1.quizId, 'Quiz that asks questions about different planes. You will really enjoy this quiz. Play it with your friends and family.')).toStrictEqual({ error: 'Description length is too long' });
  });

  test('Success Case', async () => {
    const authUserId1 = adminAuthRegister('johndoe@gmail.com', '1234Abc@#$', 'Zeeeeese', 'Veeee');
    const quizId1 = adminQuizCreate(authUserId1.authUserId, 'Planes', 'The description');

    jest.useFakeTimers();
    setTimeout(() => {
      expect(adminQuizDescriptionUpdate(authUserId1.authUserId, quizId1.quizId, 'Quiz that asks questions about different planes')).toStrictEqual({});
      const quizDetails = adminQuizInfo(authUserId1.authUserId, quizId1.quizId);
      expect(quizDetails.description).toStrictEqual('Quiz that asks questions about different planes');
      expect(quizDetails.timeLastEdited).not.toStrictEqual(quizDetails.timeCreated);
    }, 2000);

    jest.runAllTimers();
  });
});
