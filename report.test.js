const { test, expect } = require("@jest/globals");

const { sortPages } = require("./report.js");

test("sortPages", () => {
  const input = {
    url1: 2,
    url2: 1,
    url3: 3,
    url4: 10,
    url5: 7,
  };
  const actual = sortPages(input);
  const expected = [
    ["url4", 10],
    ["url5", 7],
    ["url3", 3],
    ["url1", 2],
    ["url2", 1],
  ];
  expect(actual).toEqual(expected);
});

test("sortPages with empty pages object", () => {
  const input = {};
  const actual = sortPages(input);
  const expected = [];
  expect(actual).toEqual(expected);
});
