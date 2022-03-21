import * as R from 'ramda';

import * as free from 'fp/free';
import {createTestHelper} from 'test/utils';

import {createAndSave, loadPreviousUser, hasPreviousUser} from 'app/user';

const testHelper = createTestHelper(true, true);

let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

test('generate a hard to crash user id from user form', async () => {
  const userFormData = {
    name: 'test user ali',
    oku: true,
    forms: ['blind']
  };
  
  const fm = free.sequence([
    createAndSave(userFormData),
    loadPreviousUser(),
    createAndSave(userFormData),
    loadPreviousUser(),
    createAndSave(userFormData),
    loadPreviousUser(),
  ]);


  const result = await interpret(fm);
  expect(result[1]).not.toEqual(result[3]);
  expect(result[5]).not.toEqual(result[3]);
  expect(result[1]).not.toEqual(result[5]);
0});

test('save user id with user info, return it with a load api', async () => {
  const userFormData = {
    name: 'test user alice',
    oku: true,
    forms: ['deaf']
  };
  
  const fm = free.sequence([
    createAndSave(userFormData),
    loadPreviousUser()
  ]).map(R.last);

  const result = await interpret(fm);
  expect(result).toMatchObject(userFormData);
});

test('does not have previous user when no user ever created', async () => {
  const fm = hasPreviousUser();
  const result = await interpret(fm);
  expect(result).toBeFalsy();
});

test('has previous user if user was created before', async () => {
  const userFormData = {
    name: 'test user alice',
    oku: true,
    forms: ['deaf']
  };
  
  const fm = free.sequence([
    createAndSave(userFormData),
    hasPreviousUser()
  ]).map(R.last);

  const result = await interpret(fm);
  expect(result).toBeTruthy();
});
//test('', async () => {});
