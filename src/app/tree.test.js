import * as R from 'ramda';

import * as free from 'fp/free';
import {createTestHelper} from 'test/utils';

import {addVenue, addArea, addTopic, addQuestion, storeState} from './tree_builder';
import {findRoots, findChildren } from './tree';

const testHelper = createTestHelper(true);

let interpret;
beforeEach(async () => {
  interpret = testHelper.setup();

  const state = R.pipe(
    addVenue('venue'),
    addArea('area 1'),
    addTopic('topic 1'),
    addQuestion('question 1'),
    addQuestion('question 2'),
    addQuestion('question 3'),
    addTopic('topic 2'),
    addQuestion('question 2.1'),
    addQuestion('question 2.2'),
    addArea('area 2'),
    addTopic('topic 1'),
    addQuestion('question 1'),
    addQuestion('question 2'),
    addQuestion('question 3'),
  )({});

  await interpret(storeState(state));
});

test.only('listing all venues', async () => {
  const fm = findRoots();
  const result = await interpret(fm);

  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    _id: 'q_venue',
    value: 'venue'
  });
});

test.only('going in from venue, show areas for it', async () => {
  const fm = findChildren('q_venue');
  const result = await interpret(fm);

  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({
    _id: 'q_venue.01',
    value: 'area 1'
  });
  expect(result[1]).toMatchObject({
    _id: 'q_venue.02',
    value: 'area 2'
  });

});

test('going in from area, show questions for it', async () => {

});

test('get the venue from area', async () => {

});

test('get the area from question', async () => {

});

test('go to next question', async () => {

});

test('cannot go to next question for the last one', async () => {

});

test('', async () => {

});
