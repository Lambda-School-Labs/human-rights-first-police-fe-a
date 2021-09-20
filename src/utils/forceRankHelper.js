const forceRanks = [
  'Rank 0 - No Police Presence',
  'Rank 1 - Officer Presence',
  'Rank 2 - Empty-hand',
  'Rank 3 - Blunt Force',
  'Rank 4 - Chemical & Electric',
  'Rank 5 - Lethal Force',
];

/**
 * Allows for easy conversion from "Rank 5" or even "5" or 5
 * to "Force Rank 5 - Lethal Force"
 * @param {string | number} rank - the force_rank value as represented by the incident data or number
 * @returns {string} the longer, descriptive force rank
 */
export function getDescriptiveRank(rank) {
  if (rank == null) {
    return '';
  }

  const rankValue = rank
    .toString()
    .trim()
    .split(' ')
    .slice(-1);
  const rankIndex = parseInt(rankValue);

  if (rankIndex >= 0 && rankIndex <= 5) {
    return forceRanks[rankIndex];
  } else {
    return rank.toString();
  }
}
