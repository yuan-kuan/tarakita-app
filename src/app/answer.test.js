import * as R from 'ramda';

import * as free from 'fp/free';
import { createTestHelper } from 'test/utils';

import {
  addVenue,
  addArea,
  addTopic,
  addQuestion,
  storeState,
  addSubtopic,
} from './tree_builder';
import {
  findRoots,
  findChildren,
  findParent,
  hasNextSibling,
  getNextSibling,
  typeOf,
  hasSubtopic,
} from './tree';
import * as answer from './answer';
import { createAndSave } from './user';

const testHelper = createTestHelper(true, true);

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
    addSubtopic('sub topic 2-1'),
    addQuestion('question 2-1-1'),
    addQuestion('question 2-1-2'),
    addSubtopic('sub topic 2-2'),
    addQuestion('question 2-2-1'),
    addQuestion('question 2-2-2'),
    addTopic('topic 3'),
    addQuestion('question 3-1'),
    addQuestion('question 3-2'),
    addArea('area 2'),
    addTopic('topic 1'),
    addQuestion('question 1'),
    addQuestion('question 2')
  )({});

  const userFormData = {
    name: 'test user ali',
    oku: true,
    forms: ['blind'],
  };

  await interpret(
    free.sequence([
      storeState(state),
      createAndSave(userFormData),
      answer.init(),
    ])
  );
});

test('at the beginning, all answer are not given', async () => {
  const fm = answer.ratio('q_venue');
  const result = await interpret(fm);

  expect(result).toMatchObject({
    answered: 0,
    total: 11,
  });
});

test('submitting an anwer will reduce the total unanswered', async () => {
  const submission = answer.createSubmission(2);
  const fm = free
    .sequence([
      answer.submit('q_venue+01+01-01', submission),
      answer.ratio('q_venue'),
    ])
    .map(R.last);
  const result = await interpret(fm);

  expect(result).toMatchObject({
    answered: 1,
    total: 11,
  });
});

test('submitting an anwer will update the answer/not answer ratio, for all parents', async () => {
  const submission = answer.createSubmission(2);
  const fm = free
    .sequence([
      answer.submit('q_venue+01+01-01', submission),
      answer.submit('q_venue+01+01-02', submission),
      answer.submit('q_venue+01+02+01-01', submission),
      answer.submit('q_venue+01+03-01', submission),
      answer.ratio('q_venue+01-01'),
      answer.ratio('q_venue+01-02'),
      answer.ratio('q_venue-01'),
    ])
    .map(R.takeLast(3));
  const result = await interpret(fm);

  expect(result[0]).toMatchObject({
    answered: 2,
    total: 3,
  });

  expect(result[1]).toMatchObject({
    answered: 1,
    total: 4,
  });

  expect(result[2]).toMatchObject({
    answered: 4,
    total: 9,
  });
});

test('submitting all answer under a topic and subtopic will mark it complete', async () => {
  const submission = answer.createSubmission(3);
  const fm = free
    .sequence([
      answer.submit('q_venue+01+02+01-01', submission),
      answer.submit('q_venue+01+02+01-02', submission),
      answer.submit('q_venue+01+02+02-01', submission),
      answer.submit('q_venue+01+02+02-02', submission),
      answer.ratio('q_venue+01+02-01'),
      answer.ratio('q_venue+01+02-02'),
      answer.ratio('q_venue+01-02'),
    ])
    .map(R.takeLast(3));
  const result = await interpret(fm);

  expect(result[0]).toMatchObject({
    answered: 2,
    total: 2,
  });

  expect(result[1]).toMatchObject({
    answered: 2,
    total: 2,
  });

  expect(result[2]).toMatchObject({
    answered: 4,
    total: 4,
  });
});

test('calculate a total score after a venue is fully answered', async () => {
  const submission = answer.createSubmission(4);
  const fm = free
    .sequence([
      answer.submit('q_venue+01+01-01', submission),
      answer.submit('q_venue+01+01-02', submission),
      answer.submit('q_venue+01+01-03', submission),
      answer.submit('q_venue+01+02+01-01', submission),
      answer.submit('q_venue+01+02+01-01', submission),
      answer.submit('q_venue+01+02+01-02', submission),
      answer.submit('q_venue+01+02+02-01', submission),
      answer.submit('q_venue+01+02+02-02', submission),
      answer.submit('q_venue+01+03-01', submission),
      answer.submit('q_venue+01+03-02', submission),
      answer.submit('q_venue+02+01-01', submission),
      answer.submit('q_venue+02+01-02', submission),
      answer.finalResult('q_venue'),
    ])
    .map(R.last);
  const result = await interpret(fm);

  expect(result).toBe(44);
});

test('get an unanswered answer for the question', async () => {
  const fm = answer.getAnswer('q_venue+01+01-01');
  const result = await interpret(fm);

  expect(result).not.toHaveProperty('rating');
});

test('get an answer for the question', async () => {
  const fm = free
    .sequence([
      answer.submit('q_venue+01+01-01', answer.createSubmission(3)),
      answer.getAnswer('q_venue+01+01-01'),
    ])
    .map(R.last);
  const result = await interpret(fm);

  expect(result).toMatchObject({
    rating: 3,
  });
});

test('change the answer for the question', async () => {
  const fm = free
    .sequence([
      answer.submit('q_venue+01+01-01', answer.createSubmission(3)),
      answer.submit('q_venue+01+01-01', answer.createSubmission(1)),
      answer.getAnswer('q_venue+01+01-01'),
    ])
    .map(R.last);
  const result = await interpret(fm);

  expect(result).toMatchObject({
    rating: 1,
  });
  expect(result._rev[0]).toBe('3');
});

test('do no push an unchanged answer', async () => {
  const fm = free
    .sequence([
      answer.submit('q_venue+01+01-01', answer.createSubmission(3)),
      answer.submit('q_venue+01+01-01', answer.createSubmission(3)),
      answer.submit('q_venue+01+01-01', answer.createSubmission(3)),
      answer.submit('q_venue+01+01-01', answer.createSubmission(3)),
      answer.getAnswer('q_venue+01+01-01'),
    ])
    .map(R.last);
  const result = await interpret(fm);

  expect(result).toMatchObject({
    rating: 3,
  });
  expect(result._rev[0]).toBe('2');
});

test('get uninitialized comment doc will result in empty comment', async () => {
  const fm = free.sequence([
    answer.getComment('q_venue+01-01'),
    answer.getComment('q_venue+01+02-01'),
  ]);

  const result = await interpret(fm);
  expect(result[0]).toMatchObject({
    positive: '',
    negative: '',
  });
  expect(result[1]).toMatchObject({
    positive: '',
    negative: '',
  });
});

test('putting comment and getting comment', async () => {
  const fm = free.sequence([
    answer.putComment(
      'q_venue+01-01',
      answer.createCommentSubmission('pos 1', 'neg 1')
    ),
    answer.putComment(
      'q_venue+01+02-01',
      answer.createCommentSubmission('', 'neg 2')
    ),
  ]);

  const result = await interpret(fm);
  expect(result[0]).toMatchObject({
    type: 'comment',
    positive: 'pos 1',
    negative: 'neg 1',
  });
  expect(result[1]).toMatchObject({
    type: 'comment',
    positive: '',
    negative: 'neg 2',
  });
});

test('putting empty comment do not save', async () => {
  const fm = free
    .sequence([
      answer.putComment(
        'q_venue+01-01',
        answer.createCommentSubmission('', '')
      ),
      answer.putComment(
        'q_venue+01+02-01',
        answer.createCommentSubmission('', '')
      ),
      answer.putComment(
        'q_venue+01-01',
        answer.createCommentSubmission('', '')
      ),
      answer.putComment(
        'q_venue+01+02-01',
        answer.createCommentSubmission('', '')
      ),
      answer.putComment(
        'q_venue+01-01',
        answer.createCommentSubmission('', '')
      ),
      answer.putComment(
        'q_venue+01+02-01',
        answer.createCommentSubmission('', '')
      ),
      answer.getComment('q_venue+01-01'),
      answer.getComment('q_venue+01+02-01'),
    ])
    .map(R.takeLast(2));

  const result = await interpret(fm);
  expect(result[0]).toMatchObject({
    positive: '',
    negative: '',
  });
  expect(result[1]).toMatchObject({
    positive: '',
    negative: '',
  });
  expect(result[0]).not.toHaveProperty('_rev');
  expect(result[1]).not.toHaveProperty('_rev');
});

test('putting same comment do not save', async () => {
  const fm = free
    .sequence([
      answer.putComment(
        'q_venue+01-01',
        answer.createCommentSubmission('pos 1', 'neg 1')
      ),
      answer.putComment(
        'q_venue+01+02-01',
        answer.createCommentSubmission('', 'neg 2')
      ),
      answer.putComment(
        'q_venue+01-01',
        answer.createCommentSubmission('pos 1', 'neg 1')
      ),
      answer.putComment(
        'q_venue+01+02-01',
        answer.createCommentSubmission('', 'neg 2')
      ),
      answer.putComment(
        'q_venue+01-01',
        answer.createCommentSubmission('pos 1', 'neg 1')
      ),
      answer.putComment(
        'q_venue+01+02-01',
        answer.createCommentSubmission('', 'neg 2')
      ),
      answer.getComment('q_venue+01-01'),
      answer.getComment('q_venue+01+02-01'),
    ])
    .map(R.takeLast(2));

  const result = await interpret(fm);
  expect(result[0]._rev[0]).toBe('1');
  expect(result[1]._rev[0]).toBe('1');
});
