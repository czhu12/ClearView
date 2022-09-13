const MIN_BLOB_SIZE = 4,
      PIXEL_SIZE = 4;

const DIRECTIONS = {
    upperLeft(index, width) { return index - width * PIXEL_SIZE - PIXEL_SIZE },
    upperMiddle(index, width) { return index - width * PIXEL_SIZE },
    upperRight(index, width) { return index - width * PIXEL_SIZE + PIXEL_SIZE },
    left(index, _) { return index - PIXEL_SIZE },
    right(index, _) { return index + PIXEL_SIZE },
    lowerLeft(index, width) { return index + width * PIXEL_SIZE - PIXEL_SIZE },
    lowerMiddle(index, width) { return index + width * PIXEL_SIZE },
    lowerRight(index, width) { return index + width * PIXEL_SIZE + PIXEL_SIZE },
}

const DIRECTION_KEYS = Object.keys(DIRECTIONS)

export class ImageClustering {
  constructor(imageData, coloredNodes) {
    this.imageData = imageData;
    this.coloredNodes = coloredNodes;
    this.checkedColoredNodes = {}
  }

  findMatches(index, currentMatches) {
    let matches = currentMatches;
    checkedColoredNodes[index].checked = true
    for (let i = 0; i < DIRECTION_KEYS.length; i++) {
      const direction = DIRECTION_KEYS[i]
      const coloredNode = DIRECTIONS[direction](index, this.imageData.width)
      if (checkedColoredNodes[coloredNode]?.checked == false) {
        matches++;
        matches = this.findMatches(coloredNode, matches)
      }
    }
    return matches;
  }

  execute() {
    let blobCount =0;
    this.coloredNodes.map(x => this.checkedColoredNodes[x] = {checked: false, matches: 0});
  
    this.coloredNodes.map((coloredNode) => {
      if (this.checkedColoredNodes[coloredNode].checked == false) {
        const matched = this.findMatches(coloredNode, 0);
        if (matched > MIN_BLOB_SIZE) {
          blobCount++
          this.checkedColoredNodes[coloredNode].matches = matched
        }
      }
    });
 
    return blobCount;
  }
}
