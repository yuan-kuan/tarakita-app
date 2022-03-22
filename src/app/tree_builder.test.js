import * as R from 'ramda';
import * as free from 'fp/free'
import {addVenue, addArea, addTopic, addSubtopic, addQuestion} from './tree_builder';

test('lowercase, space greater dash and dot all become underscore', () => {
  const result= addVenue('Venue spAce.dOt>greAter-dAsh', {});
  
  expect(result).toMatchObject({
    'q_venue_space_dot_greater_dash': {'value': 'Venue spAce.dOt>greAter-dAsh'}
  });
});

// Tree is built in assumption that the order of insertion is in order of the full
// set of questions. The CSV is expect to be layout in such a way:}
//
// Venue
//   Area 1
//     Topic 1
//       Question 1
//       Question 2
//     Topic  2
//       SubTopic 1
  //       Question 1
  //       Question 2
  //     SubTopic 2
  //       Question 1
  //       Question 2
//   Area 2
//     Topic 1
//       Question 1
//       Question 2
//     Topic 2
//       Question 1
//       Question 2
//       Question 3
//       Question 4
test('Add root to empty state will create the first root', async () => {
  let state = {};
  const result= addVenue('venue', state);
  
  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'}
  });
  expect(state).toStrictEqual({});
});

test('add area to the venue', async () => {
  const result = R.pipe(
      addVenue('venue'),  
      addArea('area 1')
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
  });
});

test('add topic to the area', async () => {
  const result = R.pipe(
      addVenue('venue'),  
      addArea('area 1'),
      addTopic('topic 1')
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
  });
});

test('add couple of question to the topic', async () => {
  const result = R.pipe(
    addVenue('venue'),
    addArea('area 1'),
    addTopic('topic 1'),
    addQuestion('question 1'),
    addQuestion('question 2'),
    addQuestion('question 3')
  )({});
      
  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
  });
});

test('adding a topic after question will end the running topic, and sequnce the next topic', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2')
  )({});     

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
  });
});

test('adding questions following new topic will add under the topic', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addQuestion('question 2-1'),
      addQuestion('question 2-2')
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'question 2-1'},
    'q_venue+01+02-02': {'value': 'question 2-2'},
  });
});

test('adding subtopic following topic will add new sub topic', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addSubtopic('sub topic 1'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'sub topic 1'},
  });
});

test('adding question following sub topic will add new question under subtopic', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addSubtopic('sub topic 1'),
      addQuestion('question 1-2-1'),
      addQuestion('question 1-2-2'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'sub topic 1'},
    'q_venue+01+02+01-01': {'value': 'question 1-2-1'},
    'q_venue+01+02+01-02': {'value': 'question 1-2-2'},
  });
});

test('adding subtopic following question will add new subtopic under previous topic', async () => {

  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addSubtopic('sub topic 1'),
      addQuestion('question 1-2-1'),
      addQuestion('question 1-2-2'),
      addSubtopic('sub topic 2'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'sub topic 1'},
    'q_venue+01+02+01-01': {'value': 'question 1-2-1'},
    'q_venue+01+02+01-02': {'value': 'question 1-2-2'},
    'q_venue+01+02-02': {'value': 'sub topic 2'},
  });
});

test('adding question following sub topic will add new question under new subtopic', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addSubtopic('sub topic 1'),
      addQuestion('question 1-2-1'),
      addQuestion('question 1-2-2'),
      addSubtopic('sub topic 2'),
      addQuestion('question 1-2-2-1'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'sub topic 1'},
    'q_venue+01+02+01-01': {'value': 'question 1-2-1'},
    'q_venue+01+02+01-02': {'value': 'question 1-2-2'},
    'q_venue+01+02-02': {'value': 'sub topic 2'},
    'q_venue+01+02+02-01': {'value': 'question 1-2-2-1'},
  });
});

test('adding question following question under subtopic will add new topic under previous area', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addSubtopic('sub topic 1'),
      addQuestion('question 1-2-1'),
      addQuestion('question 1-2-2'),
      addSubtopic('sub topic 2'),
      addQuestion('question 1-2-2-1'),
      addTopic('topic 3'),
      addSubtopic('sub topic 3-1'),
      addQuestion('question 3-1-1'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'sub topic 1'},
    'q_venue+01+02+01-01': {'value': 'question 1-2-1'},
    'q_venue+01+02+01-02': {'value': 'question 1-2-2'},
    'q_venue+01+02-02': {'value': 'sub topic 2'},
    'q_venue+01+02+02-01': {'value': 'question 1-2-2-1'},
    'q_venue+01-03': {'value': 'topic 3'},
    'q_venue+01+03-01': {'value': 'sub topic 3-1'},
    'q_venue+01+03+01-01': {'value': 'question 3-1-1'},
  });
});

test('adding area after question to end the previous area and start a new one', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addQuestion('question 2-1'),
      addQuestion('question 2-2'),
      addArea('area 2'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'question 2-1'},
    'q_venue+01+02-02': {'value': 'question 2-2'},
    'q_venue-02': {'value': 'area 2'},
  });
});

test('adding new topic and questioni to the new area will under the new area', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addQuestion('question 2-1'),
      addQuestion('question 2-2'),
      addArea('area 2'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'question 2-1'},
    'q_venue+01+02-02': {'value': 'question 2-2'},
    'q_venue-02': {'value': 'area 2'},
    'q_venue+02-01': {'value': 'topic 1'},
    'q_venue+02+01-01': {'value': 'question 1'},
    'q_venue+02+01-02': {'value': 'question 2'},
    'q_venue+02+01-03': {'value': 'question 3'},
  });
});

test('full test single venue', async () => {
  const result = R.pipe(
      addVenue('venue'),
      addArea('area 1'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addQuestion('question 2-1'),
      addQuestion('question 2-2'),
      addArea('area 2'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addArea('area 3'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 4'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addTopic('topic 2'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
      addArea('area 5'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 6'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 7'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 8'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 9'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 10'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addArea('area 11'),
      addTopic('topic 1'),
      addQuestion('question 1'),
  )({});

  expect(result).toMatchObject({
    'q_venue': {'value': 'venue'},
    'q_venue-01': {'value': 'area 1'},
    'q_venue+01-01': {'value': 'topic 1'},
    'q_venue+01+01-01': {'value': 'question 1'},
    'q_venue+01+01-02': {'value': 'question 2'},
    'q_venue+01+01-03': {'value': 'question 3'},
    'q_venue+01-02': {'value': 'topic 2'},
    'q_venue+01+02-01': {'value': 'question 2-1'},
    'q_venue+01+02-02': {'value': 'question 2-2'},
    'q_venue-02': {'value': 'area 2'},
    'q_venue+02-01': {'value': 'topic 1'},
    'q_venue+02+01-01': {'value': 'question 1'},
    'q_venue+02+01-02': {'value': 'question 2'},
    'q_venue+02+01-03': {'value': 'question 3'},
    'q_venue-03': {'value': 'area 3'},
    'q_venue+03-01': {'value': 'topic 1'},
    'q_venue+03+01-01': {'value': 'question 1'},
    'q_venue-04': {'value': 'area 4'},
    'q_venue+04-01': {'value': 'topic 1'},
    'q_venue+04+01-01': {'value': 'question 1'},
    'q_venue+04+01-02': {'value': 'question 2'},
    'q_venue+04+01-03': {'value': 'question 3'},
    'q_venue+04-02': {'value': 'topic 2'},
    'q_venue+04+02-01': {'value': 'question 1'},
    'q_venue+04+02-02': {'value': 'question 2'},
    'q_venue+04+02-03': {'value': 'question 3'},
    'q_venue-05': {'value': 'area 5'},
    'q_venue+05-01': {'value': 'topic 1'},
    'q_venue+05+01-01': {'value': 'question 1'},
    'q_venue-06': {'value': 'area 6'},
    'q_venue+06-01': {'value': 'topic 1'},
    'q_venue+06+01-01': {'value': 'question 1'},
    'q_venue-07': {'value': 'area 7'},
    'q_venue+07-01': {'value': 'topic 1'},
    'q_venue+07+01-01': {'value': 'question 1'},
    'q_venue-08': {'value': 'area 8'},
    'q_venue+08-01': {'value': 'topic 1'},
    'q_venue+08+01-01': {'value': 'question 1'},
    'q_venue-09': {'value': 'area 9'},
    'q_venue+09-01': {'value': 'topic 1'},
    'q_venue+09+01-01': {'value': 'question 1'},
    'q_venue-10': {'value': 'area 10'},
    'q_venue+10-01': {'value': 'topic 1'},
    'q_venue+10+01-01': {'value': 'question 1'},
    'q_venue-11': {'value': 'area 11'},
    'q_venue+11-01': {'value': 'topic 1'},
    'q_venue+11+01-01': {'value': 'question 1'},
  });
});
