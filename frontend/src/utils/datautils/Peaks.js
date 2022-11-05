/**
 * Get indices of all local maxima in a sequence.
 * @param {number[]} xs - sequence of numbers
 * @returns {number[]} indices of local maxima
 */
function findLocalMaxima(xs) {
  let maxima = [];
  // iterate through all points and compare direct neighbors
  for (let i = 1; i < xs.length - 1; i++) {
    if (xs[i] > xs[i - 1] && xs[i] > xs[i + 1]) {
      maxima.push(i);
    }
  }
  return maxima;
}

/**
 * Remove peaks below minimum height.
 * @param {number[]} indices - indices of peaks in xs
 * @param {number[]} xs - original signal
 * @param {number} height - minimum peak height
 * @returns {number[]} filtered peak index list
 */
function filterByHeight(indices, xs, height) {
  return indices.filter(i => xs[i] > height);
}

let decor = (v, i) => [v, i]; // combine index and value as pair
let undecor = pair => pair[1];  // remove value from pair
const argsort = arr => arr.map(decor).sort().map(undecor);

/**
 * Remove peaks that are too close to higher ones.
 * @param {number[]} indices - indices of peaks in xs
 * @param {number[]} xs - original signal
 * @param {number} dist - minimum distance between peaks
 * @returns {number[]} filtered peak index list
 */
function filterByDistance(indices, xs, dist) {
  let toRemove = Array(indices.length).fill(false);
  let heights = indices.map(i => xs[i]);
  let sortedIndexPositions = argsort(heights).reverse();

  // adapted from SciPy find_peaks
  for (let current of sortedIndexPositions) {
    if (toRemove[current]) {
      continue;  // peak will already be removed, move on.
    }

    let neighbor = current - 1;  // check on left side of peak
    while (neighbor >= 0 && (indices[current] - indices[neighbor]) < dist) {
      toRemove[neighbor] = true;
      --neighbor;
    }

    neighbor = current + 1;  // check on right side of peak
    while (neighbor < indices.length
      && (indices[neighbor] - indices[current]) < dist) {
      toRemove[neighbor] = true;
      ++neighbor;
    }
  }
  return indices.filter((v, i) => !toRemove[i]);
}

/**
 * Filter peaks by required properties.
 * @param {number[]}} indices - indices of peaks in xs
 * @param {number[]} xs - original signal
 * @param {number} distance - minimum distance between peaks
 * @param {number} height - minimum height of peaks
 * @returns {number[]} filtered peak indices
 */
function filterMaxima(indices, xs, distance, height) {
  let newIndices = indices;
  if (height !== undefined) {
    newIndices = filterByHeight(newIndices, xs, height);
  }
  if (distance !== undefined) {
    newIndices = filterByDistance(newIndices, xs, distance);
  }
  return newIndices;
}

/**
* Simplified version of SciPy's find_peaks function.
* @param {number[]} xs - input signal
* @param {number} distance - minimum distance between peaks
* @param {number} height - minimum height of peaks
* @returns {number[]} peak indices
*/
export function minimalFindPeaks(xs, distance, height) {
  let indices = findLocalMaxima(xs)
  return filterMaxima(indices, xs, distance, height);
}

export function smooth(arr, windowSize, getter = (value) => value, setter) {
  const get = getter
  const result = []

  for (let i = 0; i < arr.length; i += 1) {
    const leftOffset = i - windowSize
    const from = leftOffset >= 0 ? leftOffset : 0
    const to = i + windowSize + 1

    let count = 0
    let sum = 0
    for (let j = from; j < to && j < arr.length; j += 1) {
      sum += get(arr[j])
      count += 1
    }

    result[i] = setter ? setter(arr[i], sum / count) : sum / count
  }

  return result
}