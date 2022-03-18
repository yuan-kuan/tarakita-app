import * as free from 'fp/free'
import {createTestHelper} from 'test/utils';
import {addVenue, addArea, addTopic, addQuestion} from './tree_builder';

const testHelper = createTestHelper(true, true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
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

test.only('Add root to empty state will create the first root', async () => {
  const result= addVenue('venue', new Map());
  
  expect(result).toEqual(new Map([
    ['q_venue', 'venue']
  ]));
});

test('add area to the venue', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'));

  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
  ]));
});


test('add topic to the area', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))

  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
  ]));
});

test('add couple of question to the topic', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
  ]));
});

test('adding a topic after question will end the running topic, and sequnce the next topic', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'));
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
    ['q_venue>01.02', 'topic 2'],
  ]));
});

test('adding questions following new topic will add under the topic', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'))
      .map(addQuestion('question 2.1'))
      .map(addQuestion('question 2.2'));
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
    ['q_venue>01.02', 'topic 2'],
    ['q_venue>01>02.01', 'question 2.1'],
    ['q_venue>01>02.02', 'question 2.2'],
  ]));
});

test('adding area after question to end the previous area and start a new one', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'))
      .map(addQuestion('question 2.1'))
      .map(addQuestion('question 2.2'))
      .map(addArea('area 2'))
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
    ['q_venue>01.02', 'topic 2'],
    ['q_venue>01>02.01', 'question 2.1'],
    ['q_venue>01>02.02', 'question 2.2'],
    ['q_venue.02', 'area 2'],
  ]));
});

test('adding new topic and questioni to the new area will under the new area', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'))
      .map(addQuestion('question 2.1'))
      .map(addQuestion('question 2.2'))
      .map(addArea('area 2'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
    ['q_venue>01.02', 'topic 2'],
    ['q_venue>01>02.01', 'question 2.1'],
    ['q_venue>01>02.02', 'question 2.2'],
    ['q_venue.02', 'area 2'],
    ['q_venue>02.01', 'topic 1'],
    ['q_venue>02>01.01', 'question 1'],
    ['q_venue>02>01.02', 'question 2'],
    ['q_venue>02>01.03', 'question 3'],
  ]));
});

test('adding new venue after question will start a new venue', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'))
      .map(addQuestion('question 2.1'))
      .map(addQuestion('question 2.2'))
      .map(addArea('area 2'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addVenue('venue 2'))
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
    ['q_venue>01.02', 'topic 2'],
    ['q_venue>01>02.01', 'question 2.1'],
    ['q_venue>01>02.02', 'question 2.2'],
    ['q_venue.02', 'area 2'],
    ['q_venue>02.01', 'topic 1'],
    ['q_venue>02>01.01', 'question 1'],
    ['q_venue>02>01.02', 'question 2'],
    ['q_venue>02>01.03', 'question 3'],
    ['q_venue_2', 'venue 2'],
  ]));
});

test('full test single venue', async () => {
  const fm =
    free.of(new Map())
      .map(addVenue('venue'))
      .map(addArea('area 1'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'))
      .map(addQuestion('question 2.1'))
      .map(addQuestion('question 2.2'))
      .map(addArea('area 2'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addArea('area 3'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 4'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addTopic('topic 2'))
      .map(addQuestion('question 1'))
      .map(addQuestion('question 2'))
      .map(addQuestion('question 3'))
      .map(addArea('area 5'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 6'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 7'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 8'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 9'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 10'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      .map(addArea('area 11'))
      .map(addTopic('topic 1'))
      .map(addQuestion('question 1'))
      
  const result = interpret(fm);
  expect(result).toEqual(new Map([
    ['q_venue', 'venue'],
    ['q_venue.01', 'area 1'],
    ['q_venue>01.01', 'topic 1'],
    ['q_venue>01>01.01', 'question 1'],
    ['q_venue>01>01.02', 'question 2'],
    ['q_venue>01>01.03', 'question 3'],
    ['q_venue>01.02', 'topic 2'],
    ['q_venue>01>02.01', 'question 2.1'],
    ['q_venue>01>02.02', 'question 2.2'],
    ['q_venue.02', 'area 2'],
    ['q_venue>02.01', 'topic 1'],
    ['q_venue>02>01.01', 'question 1'],
    ['q_venue>02>01.02', 'question 2'],
    ['q_venue>02>01.03', 'question 3'],
    ['q_venue.03', 'area 3'],
    ['q_venue>03.01', 'topic 1'],
    ['q_venue>03>01.01', 'question 1'],
    ['q_venue.04', 'area 4'],
    ['q_venue>04.01', 'topic 1'],
    ['q_venue>04>01.01', 'question 1'],
    ['q_venue>04>01.02', 'question 2'],
    ['q_venue>04>01.03', 'question 3'],
    ['q_venue>04.01', 'topic 1'],
    ['q_venue>04>01.01', 'question 1'],
    ['q_venue>04>01.02', 'question 2'],
    ['q_venue>04>01.03', 'question 3'],
    ['q_venue.05', 'area 5'],
    ['q_venue>05.01', 'topic 1'],
    ['q_venue>05>01.01', 'question 1'],
    ['q_venue.06', 'area 6'],
    ['q_venue>06.01', 'topic 1'],
    ['q_venue>06>01.01', 'question 1'],
    ['q_venue.07', 'area 7'],
    ['q_venue>07.01', 'topic 1'],
    ['q_venue>07>01.01', 'question 1'],
    ['q_venue.08', 'area 8'],
    ['q_venue>08.01', 'topic 1'],
    ['q_venue>08>01.01', 'question 1'],
    ['q_venue.09', 'area 9'],
    ['q_venue>09.01', 'topic 1'],
    ['q_venue>09>01.01', 'question 1'],
    ['q_venue.10', 'area 10'],
    ['q_venue>10.01', 'topic 1'],
    ['q_venue>10>01.01', 'question 1'],
    ['q_venue.11', 'area 11'],
    ['q_venue>11.01', 'topic 1'],
    ['q_venue>11>01.01', 'question 1'],
  ]));
});
