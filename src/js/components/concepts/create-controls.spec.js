import { scndWithoutFirst } from './create-controls';

describe('second without first', () => {
  it('returns true if the first argument is empty but the second one is not empty', () => {
    expect(scndWithoutFirst('', 'hello')).toBe(true);
  });

  it('returns false if both arguments are empty', () => {
    expect(scndWithoutFirst('', '')).toBe(false);
  });

  it('returns false if the first argumnent is not empty and the second argument is empty', () => {
    expect(scndWithoutFirst('hello', '')).toBe(false);
  });
});
