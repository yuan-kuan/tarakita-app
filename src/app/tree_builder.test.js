import * as R from 'ramda';
import * as free from 'fp/free'
import {addVenue, addArea, addTopic, addQuestion} from './tree_builder';

test('lowercase, space greater dash and dot all become underscore', () => {
  const result= addVenue('Venue spAce.dOt>greAter-dAsh', {});
  
  expect(result).toMatchObject({
    'q_venue_space_dot_greater_dash': 'Venue spAce.dOt>greAter-dAsh'
  });
});

// Tree is built in assumption that the order of insertion is in order of the full
// set of questions. The CSV is expect to be layout in such a way:
//
// Venue
//   Area 1
//     Topic 1
//       Question 1
//       Question 2
//     Topic  2
//       Question 1
//       Question 2
//       Question 3
//       Question 4
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
    'q_venue': 'venue'
  });
  expect(state).toStrictEqual({});
});

test('add area to the venue', async () => {
  const result = R.pipe(
      addVenue('venue'),  
      addArea('area 1')
  )({});

  expect(result).toMatchObject({
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
  });
});

test('add topic to the area', async () => {
  const result = R.pipe(
      addVenue('venue'),  
      addArea('area 1'),
      addTopic('topic 1')
  )({});

  expect(result).toMatchObject({
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
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
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
    'q_venue>01>01.01': 'question 1',
    'q_venue>01>01.02': 'question 2',
    'q_venue>01>01.03': 'question 3',
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
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
    'q_venue>01>01.01': 'question 1',
    'q_venue>01>01.02': 'question 2',
    'q_venue>01>01.03': 'question 3',
    'q_venue>01.02': 'topic 2',
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
      addQuestion('question 2.1'),
      addQuestion('question 2.2')
  )({});

  expect(result).toMatchObject({
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
    'q_venue>01>01.01': 'question 1',
    'q_venue>01>01.02': 'question 2',
    'q_venue>01>01.03': 'question 3',
    'q_venue>01.02': 'topic 2',
    'q_venue>01>02.01': 'question 2.1',
    'q_venue>01>02.02': 'question 2.2',
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
      addQuestion('question 2.1'),
      addQuestion('question 2.2'),
      addArea('area 2'),
  )({});

  expect(result).toMatchObject({
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
    'q_venue>01>01.01': 'question 1',
    'q_venue>01>01.02': 'question 2',
    'q_venue>01>01.03': 'question 3',
    'q_venue>01.02': 'topic 2',
    'q_venue>01>02.01': 'question 2.1',
    'q_venue>01>02.02': 'question 2.2',
    'q_venue.02': 'area 2',
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
      addQuestion('question 2.1'),
      addQuestion('question 2.2'),
      addArea('area 2'),
      addTopic('topic 1'),
      addQuestion('question 1'),
      addQuestion('question 2'),
      addQuestion('question 3'),
  )({});

  expect(result).toMatchObject({
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
    'q_venue>01>01.01': 'question 1',
    'q_venue>01>01.02': 'question 2',
    'q_venue>01>01.03': 'question 3',
    'q_venue>01.02': 'topic 2',
    'q_venue>01>02.01': 'question 2.1',
    'q_venue>01>02.02': 'question 2.2',
    'q_venue.02': 'area 2',
    'q_venue>02.01': 'topic 1',
    'q_venue>02>01.01': 'question 1',
    'q_venue>02>01.02': 'question 2',
    'q_venue>02>01.03': 'question 3',
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
      addQuestion('question 2.1'),
      addQuestion('question 2.2'),
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
    'q_venue': 'venue',
    'q_venue.01': 'area 1',
    'q_venue>01.01': 'topic 1',
    'q_venue>01>01.01': 'question 1',
    'q_venue>01>01.02': 'question 2',
    'q_venue>01>01.03': 'question 3',
    'q_venue>01.02': 'topic 2',
    'q_venue>01>02.01': 'question 2.1',
    'q_venue>01>02.02': 'question 2.2',
    'q_venue.02': 'area 2',
    'q_venue>02.01': 'topic 1',
    'q_venue>02>01.01': 'question 1',
    'q_venue>02>01.02': 'question 2',
    'q_venue>02>01.03': 'question 3',
    'q_venue.03': 'area 3',
    'q_venue>03.01': 'topic 1',
    'q_venue>03>01.01': 'question 1',
    'q_venue.04': 'area 4',
    'q_venue>04.01': 'topic 1',
    'q_venue>04>01.01': 'question 1',
    'q_venue>04>01.02': 'question 2',
    'q_venue>04>01.03': 'question 3',
    'q_venue>04.02': 'topic 2',
    'q_venue>04>02.01': 'question 1',
    'q_venue>04>02.02': 'question 2',
    'q_venue>04>02.03': 'question 3',
    'q_venue.05': 'area 5',
    'q_venue>05.01': 'topic 1',
    'q_venue>05>01.01': 'question 1',
    'q_venue.06': 'area 6',
    'q_venue>06.01': 'topic 1',
    'q_venue>06>01.01': 'question 1',
    'q_venue.07': 'area 7',
    'q_venue>07.01': 'topic 1',
    'q_venue>07>01.01': 'question 1',
    'q_venue.08': 'area 8',
    'q_venue>08.01': 'topic 1',
    'q_venue>08>01.01': 'question 1',
    'q_venue.09': 'area 9',
    'q_venue>09.01': 'topic 1',
    'q_venue>09>01.01': 'question 1',
    'q_venue.10': 'area 10',
    'q_venue>10.01': 'topic 1',
    'q_venue>10>01.01': 'question 1',
    'q_venue.11': 'area 11',
    'q_venue>11.01': 'topic 1',
    'q_venue>11>01.01': 'question 1',
  });
});
