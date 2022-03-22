import * as R from 'ramda';
import * as free from 'fp/free';
import { createTestHelper } from 'test/utils';

import * as db from 'app/database';
import {addVenue, addArea, addTopic, addQuestion, storeState, addSubtopic} from './tree_builder';

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
    addSubtopic('subtopic 2.1'),
    addQuestion('question 2.1.1'),
    addQuestion('question 2.1.2'),
    addSubtopic('subtopic 2.2'),
    addQuestion('question 2.2.1'),
    addQuestion('question 2.2.2'),
    addQuestion('question 2.2.3'),
    addArea('area 2'),
    addTopic('topic 1'),
    addQuestion('question 1'),
    addQuestion('question 2'),
    addQuestion('question 3'),
  )({});

  await interpret(storeState(state));
});

test('tree state to a blank pouchdb', async () => {
  const fm = db.allDocs({include_docs: true}); 

  const result = await interpret(fm);
  // Inadequate test. But checked the log to confirmed.
  expect(result).toHaveLength(19);
});

test('venue doc is with venue type', async () => {
  const fm = db.get('q_venue'); 

  const result = await interpret(fm);
  // Inadequate test. But checked the log to confirmed.
  expect(result).toMatchObject({
    _id: 'q_venue',
    value: 'venue',
    type: 'venue'
  });
});

test('area doc is with area type', async () => {
  const fm = db.get('q_venue-01'); 

  const result = await interpret(fm);
  expect(result).toMatchObject({
    _id: 'q_venue-01',
    value: 'area 1',
    type: 'area'
  });
});

test('topic doc is with topic type', async () => {
  const fm = db.get('q_venue+01-02'); 

  const result = await interpret(fm);
  expect(result).toMatchObject({
    _id: 'q_venue+01-02',
    value: 'topic 2',
    type: 'topic'
  });
});

test('subtopic doc is with subtopic type', async () => {
  const fm = db.get('q_venue+01+02-01'); 

  const result = await interpret(fm);
  expect(result).toMatchObject({
    _id: 'q_venue+01+02-01',
    value: 'subtopic 2.1',
    type: 'subtopic'
  });
});

test('quetion doc is with question type', async () => {
  const fm = db.get('q_venue+01+01-02'); 

  const result = await interpret(fm);
  // Inadequate test. But checked the log to confirmed.
  expect(result).toMatchObject({
    _id: 'q_venue+01+01-02',
    value: 'question 2',
    type: 'question'
  });
});

//test('', () => {});
//test('', () => {});
//test('', () => {});
