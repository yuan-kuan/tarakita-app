import {createTestHelper} from 'test/utils';

const testHelper = createTestHelper(true, true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

test('listing all venues', async () => {
  const fm = tree_ops.findRoots();
  const result = await interpret(fm);
});

test('going in from venue, show areas for it', async () => {

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
