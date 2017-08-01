import { isDateIn, isDateInDumb } from './moment';

describe('is date in', () => {
  it('returns true if the dates match', () => {
    const toTest = '2017-07-15T10:51:47.812';
    const start = '2017-07-01T10:51:47.812';
    const end = '2017-07-31T10:51:47.812';
    expect(isDateIn(toTest, start, end)).toBe(true);
  });

  it('returns false if the dates do not match', () => {
    const toTest = '2017-06-25T10:51:47.812';
    const start = '2017-07-01T10:51:47.812';
    const end = '2017-07-31T10:51:47.812';
    expect(isDateIn(toTest, start, end)).toBe(false);
  });
});

describe('is date in dumb', () => {
  it('returns true if the dates match', () => {
    const toTest = '2017-07-15T10:51:47.812';
    const start = '2017-07-01T10:51:47.812';
    const end = '2017-07-31T10:51:47.812';
    expect(isDateInDumb(toTest, start, end)).toBe(true);
  });

  it('returns false if the dates do not match', () => {
    const toTest = '2017-06-25T10:51:47.812';
    const start = '2017-07-01T10:51:47.812';
    const end = '2017-07-31T10:51:47.812';
    expect(isDateInDumb(toTest, start, end)).toBe(false);
  });
});
