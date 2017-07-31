import { range } from './array-utils';

describe('range', () => {
  it('should return an array of integers from start to end - 1', () => {
    expect(range(3, 6)).toEqual([3, 4, 5]);
  });
});
