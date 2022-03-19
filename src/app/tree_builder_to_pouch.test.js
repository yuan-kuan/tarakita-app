import * as R from 'ramda';
import * as free from 'fp/free';
import { createTestHelper } from 'test/utils';

import * as db from 'app/database';
import {addVenue, addArea, addTopic, addQuestion, storeState} from './tree_builder';

const testHelper = createTestHelper(true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

test('tree state to a blank pouchdb', async () => {
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

  const fm = free.sequence([
    storeState(state),
    db.allDocs({include_docs: true})    
  ])
  .map(R.last);

  const result = await interpret(fm);
  // Inadequate test. But checked the log to confirmed.
  expect(result).toHaveLength(14);
});

//test('', () => {});
//test('', () => {});
//test('', () => {});
//test('', () => {});
