const convertForeignGridToLocalGrid = require('../src/convertForeignGridToLocalGrid');
const {input, output } = require('./sampleInputAndExpectedOutput');

test('sample input[0] matches expected output[0]', () => {
  expect(convertForeignGridToLocalGrid(input[0])).toEqual(output[0]);
});

test('sample input[1] matches expected output[1]', () => {
  expect(convertForeignGridToLocalGrid(input[1])).toEqual(output[1]);
});

test('sample input[2] matches expected output[2]', () => {
  expect(convertForeignGridToLocalGrid(input[2])).toEqual(output[2]);
});

test('sample input[3] matches expected output[3]', () => {
  expect(convertForeignGridToLocalGrid(input[3])).toEqual(output[3]);
});

test('sample input[4] matches expected output[4]', () => {
  expect(convertForeignGridToLocalGrid(input[4])).toEqual(output[4]);
});

test('sample input[5] matches expected output[5]', () => {
  expect(convertForeignGridToLocalGrid(input[5])).toEqual(output[5]);
});

test('sample input[6] matches expected output[6]', () => {
  expect(convertForeignGridToLocalGrid(input[6])).toEqual(output[6]);
});

test('throw exception if input has seat without width', () => {
  const inp = input[0].map(e => ({ ...e}));
  delete inp[0].width;
  expect(() => convertForeignGridToLocalGrid(inp)).toThrowError('all seats should have width>0');
});

test('throw exception if input has seat without x', () => {
  const inp = input[0].map(e => ({ ...e}));
  delete inp[0].x;
  expect(() => convertForeignGridToLocalGrid(inp)).toThrowError('all seats should have x>=0');
});

test('throw exception if input has seat without y', () => {
  const inp = input[0].map(e => ({ ...e}));
  delete inp[0].y;
  expect(() => convertForeignGridToLocalGrid(inp)).toThrowError('all seats should have y>=0');
});

