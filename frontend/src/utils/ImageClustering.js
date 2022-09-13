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

export default class ImageClustering {
  constructor(imageData, coloredNodes) {
    this.imageData = imageData;
    this.coloredNodes = coloredNodes;
    this.checkedColoredNodes = {}
    this.pixelState = [];
  }

  findMatches(index, currentMatches) {
    let matches = currentMatches;
    this.checkedColoredNodes[index] = true
    for (let i = 0; i < DIRECTION_KEYS.length; i++) {
      const direction = DIRECTION_KEYS[i]
      const coloredNode = DIRECTIONS[direction](index, this.imageData.width)
      if (this.checkedColoredNodes[coloredNode] == false) {
        matches++;
        this.pixelState.push(coloredNode)
        matches = this.findMatches(coloredNode, matches)
      }
    }
    return matches;
  }

  findRatio(pixels) {
    const min = Math.min(...pixels),
          max = Math.max (...pixels),
          x1  = (min / 4) / this.imageData.width,
          x2  = (max / 4) / this.imageData.width,
          y1  = (min / 4) % this.imageData.width,
          y2  = (max / 4) % this.imageData.width,
          widthRatio = Math.floor(x2 - x1),
          heightRatio = Math.floor(y2 - y1);

    return `${widthRatio}:${heightRatio}`;
  }

  execute() {
    let blobCount = 0;
    this.coloredNodes.map(x => this.checkedColoredNodes[x] = false);
    const blobsById = [];

    this.coloredNodes.map((coloredNode) => {
      if (this.checkedColoredNodes[coloredNode] == false) {
        this.pixelState = [coloredNode]
        const matched = this.findMatches(coloredNode, 0);
        if (matched > MIN_BLOB_SIZE) {
          blobCount++
          blobsById.push({id: blobCount, pixels: this.pixelState.length, ratio: this.findRatio(this.pixelState)})
        }
        this.pixelState = []
      }
    });

    return blobsById;
  }
}
