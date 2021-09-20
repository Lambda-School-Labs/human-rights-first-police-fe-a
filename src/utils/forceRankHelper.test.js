import { getDescriptiveRank } from './forceRankHelper';

describe('getDescriptiveRank() tests', () => {
  test('returns correct description', () => {
    let res = getDescriptiveRank(4);
    expect(res).toMatch('Rank 4 - Chemical & Electric');

    res = getDescriptiveRank('Rank 3');
    expect(res).toMatch('Rank 3 - Blunt Force');

    res = getDescriptiveRank('2');
    expect(res).toMatch('Rank 2 - Empty-hand');
  });

  test('returns the input string without breaking for an invalid rank', () => {
    let res = getDescriptiveRank(-3);
    expect(res).toMatch('-3');

    res = getDescriptiveRank('eff');
    expect(res).toMatch('eff');

    res = getDescriptiveRank('Rank Rainbow');
    expect(res).toMatch('Rank Rainbow');

    res = getDescriptiveRank('Rank 7');
    expect(res).toMatch('Rank 7');
  });

  test('returns an empty string with a null or empty input', () => {
    let res = getDescriptiveRank('');
    expect(res).toMatch('');

    res = getDescriptiveRank(null);
    expect(res).toMatch('');

    res = getDescriptiveRank([]);
    expect(res).toMatch('');

    res = getDescriptiveRank({});
    expect(res).toMatch('');
  });
});
