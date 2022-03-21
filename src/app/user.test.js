import * as R from 'ramda';

import * as free from 'fp/free';
import {createTestHelper} from 'test/utils';

import {createAndSave, loadPreviousUser} from 'app/user';

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
    createAndSave(userFormData),
    createAndSave(userFormData),
  ]);


  const result = await interpret(fm);
  console.log(result);
  expect(result[0]).not.toEqual(result[1]);
  expect(result[2]).not.toEqual(result[1]);
  expect(result[0]).not.toEqual(result[2]);
0});

test.skip('save user id with user info, return it with a load api', async () => {
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

//test('', async () => {});
//test('', async () => {});
