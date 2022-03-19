import * as R from 'ramda';

import * as free from 'fp/free';
import {createTestHelper} from 'test/utils';

import {addVenue, addArea, addTopic, addQuestion, storeState} from './tree_builder';
import {findRoots, findChildren, findParent, hasNextSibling, getNextSibling, typeOf} from './tree';

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
    addQuestion('question 2-1'),
    addQuestion('question 2-2'),
    addTopic('topic 3'),
    addQuestion('question 3-1'),
    addQuestion('question 3-2'),
    addArea('area 2'),
    addTopic('topic 1'),
    addQuestion('question 1'),
    addQuestion('question 2'),
  )({});

  await interpret(storeState(state));
});

test('listing all venues', async () => {
  const fm = findRoots();
  const result = await interpret(fm);

  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    _id: 'q_venue',
    value: 'venue'
  });
});

test('going in from venue, show areas for it', async () => {
  const fm = findChildren('q_venue');
  const result = await interpret(fm);

  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({
    _id: 'q_venue-01',
    value: 'area 1'
  });
  expect(result[1]).toMatchObject({
    _id: 'q_venue-02',
    value: 'area 2'
  });
});

test('going in from area 1, show topics for it', async () => {
  const fm = findChildren('q_venue-01');
  const result = await interpret(fm);

  expect(result).toHaveLength(3);
  expect(result[0]).toMatchObject({
    _id: 'q_venue+01-01',
    value: 'topic 1'
  });
  expect(result[1]).toMatchObject({
    _id: 'q_venue+01-02',
    value: 'topic 2'
  });
  expect(result[2]).toMatchObject({
    _id: 'q_venue+01-03',
    value: 'topic 3'
  });
});

test('going in from area 2, show topics for it', async () => {
  const fm = findChildren('q_venue-02');
  const result = await interpret(fm);

  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    _id: 'q_venue+02-01',
    value: 'topic 1'
  });
});

test('going in from topic 1, show answer for it', async () => {
  const fm = findChildren('q_venue+01-01');
  const result = await interpret(fm);

  expect(result).toHaveLength(3);
  expect(result[0]).toMatchObject({
    _id: 'q_venue+01+01-01',
    value: 'question 1'
  });
  expect(result[1]).toMatchObject({
    _id: 'q_venue+01+01-02',
    value: 'question 2'
  });
  expect(result[2]).toMatchObject({
    _id: 'q_venue+01+01-03',
    value: 'question 3'
  });
});

test('going in from topic 2, show answer for it', async () => {
  const fm = findChildren('q_venue+01-02');
  const result = await interpret(fm);

  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({
    _id: 'q_venue+01+02-01',
    value: 'question 2-1'
  });
  expect(result[1]).toMatchObject({
    _id: 'q_venue+01+02-02',
    value: 'question 2-2'
  });
});

test('get the venue from area', async () => {
  const fm = findParent('q_venue-02');
  const result = await interpret(fm);

  expect(result).toMatchObject({
    _id: 'q_venue',
    value: 'venue' 
  });
});

test('get the area from topic', async () => {
  const fm = findParent('q_venue+02-01');
  const result = await interpret(fm);

  expect(result).toMatchObject({
    _id: 'q_venue-02',
    value: 'area 2' 
  });
});

test('get the topic from question', async () => {
  const fm = findParent('q_venue+01+03-02');
  const result = await interpret(fm);

  expect(result).toMatchObject({
    _id: 'q_venue+01-03',
    value: 'topic 3' 
});
});

test('has next question', async () => {
  const fm = hasNextSibling('q_venue+01+01-01');
  const result = await interpret(fm);

  expect(result).toBeTruthy();
});

test('get next qustion', async () => {
  const fm = getNextSibling('q_venue+01+01-01');
  const result = await interpret(fm);

  expect(result).toMatchObject({
    _id: 'q_venue+01+01-02',
    value: 'question 2' 
  });
});

test('does not have next question', async () => {
  const fm = hasNextSibling('q_venue+01+01-03');
  const result = await interpret(fm);

  expect(result).toBeFalsy();
});

test('recognize the type of id', () => {
  const v = typeOf('q_venue');
  const a = typeOf('q_venue-02');
  const t = typeOf('q_venue+02-03');
  const q = typeOf('q_venue+02+03-04');

  expect(v).toBe('venue');
  expect(a).toBe('area');
  expect(t).toBe('topic');
  expect(q).toBe('question');
});

