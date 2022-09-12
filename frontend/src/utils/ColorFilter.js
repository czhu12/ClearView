import { createCanvas } from "canvas";

class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  divide(scalar) {
    return new Color(this.r / scalar, this.g / scalar, this.b / scalar);
  }

  magnitude() {
    return Math.sqrt((this.r * this.r) + (this.g * this.g) + (this.b * this.b))
  }

  dot(other) {
    return (other.r * this.r) + (other.g * this.g) + (other.b * this.b);
  }

  normalize() {
    return this.divide(this.magnitude());
  }
}

class ImageClustering {
  constructor(imageData, image) {
    this.imageData = imageData;
    this.image = image;
  }

  execute(){
    const assigned = {};
    let currentGroup = 0;


    for (let x = 0; x < this.imageData.width; x++){
      for (let y = 0; y < this.imageData.height; y++) {
        if (this.image[(x * 4) + (y * (this.imageData.width * 4))] && assigned[x - 1]?.[y]) {
          // Connected to existing blob
          if (!assigned[x]) assigned[x] = {}
          assigned[x][y] = assigned[x - 1][y];
        } else if (this.image[(x * 4) + (y * (this.imageData.width * 4))] && assigned[x]?.[y - 1]) {
          // Connected to existing blob
          if (!assigned[x]) assigned[x] = {}
          assigned[x][y] = assigned[x][y - 1];
        } else if (this.image[(x * 4) + (y * (this.imageData.width * 4))]) {
          // found a new blob
          currentGroup++;
          if (!assigned[x]) assigned[x] = {}
          assigned[x][y] = currentGroup;
        }
      }
    }
console.log(assigned)
  

    return {
      id: 1,
      aspectRatio: "6:1",
      numPixels: 100,
    }
  }

  aspectRatio(assigned, minY, maxY) {
    const maxX = Math.max(...Object.keys(assigned))
    const minX = Math.min(...Object.keys(assigned))
    return `${maxX - minX}:${maxY - minY}`
  }
}

class ResultReader {
  constructor({ threshold, colorTarget, inputCanvasName, outputName, testType }) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

}

function getGrouping(imageData, coloredNodes) {
  let groups = 0;
  const checkedColoredNodes = {}

  coloredNodes.map(x => checkedColoredNodes[x] = {checked: false, matches: 0});

  function isSurrounded(index, currentMatches) {
    let matches = currentMatches;
    let neighbors = []                             // clear array
    neighbors[0] = index - imageData.width * 4 - 4 // Upper left
    neighbors[1] = index - imageData.width * 4     // Upper middle
    neighbors[2] = index - imageData.width * 4 + 4 // Upper right
    neighbors[3] = index - 4                       // left
    neighbors[4] = index + 4                       // right
    neighbors[5] = index + imageData.width * 4 - 4 // Lower left
    neighbors[6] = index + imageData.width * 4     // lower middle
    neighbors[7] = index + imageData.width * 4 + 4 // Lower right

    checkedColoredNodes[index].checked = true
    neighbors.map(neighbor => {
      if (checkedColoredNodes[neighbor] && !checkedColoredNodes[neighbor].checked) {
        matches++;
        matches = isSurrounded(neighbor, matches)
      }
    })
    return matches;
  }

  coloredNodes.map((coloredNode) => {
    if (!checkedColoredNodes[coloredNode].checked) {
      const matched = isSurrounded(coloredNode, 0);
      if (matched > 4) groups++                    // More than 4 pixel grouping
    }
  });

  return groups
}


export default class ColorFilter {
  constructor({ threshold, colorTarget, inputCanvasName, outputName }) {
    this.colorTarget = colorTarget;
    this.threshold = threshold;
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
  }

  async execute(state) {
    const canvas = state[this.inputCanvasName];
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let coloredNodes = []

    const outputCanvas = createCanvas(canvas.width, canvas.height);
    const outputContext = outputCanvas.getContext("2d");

    const colorTarget = new Color(
      this.colorTarget[0],
      this.colorTarget[1],
      this.colorTarget[2],
    ).normalize();
    for (let i = 0; i < data.length; i += 4) {
      const color = new Color(data[i], data[i + 1], data[i + 2]);
      const normalized = color.normalize();
      const score = normalized.dot(colorTarget);
      if (score > this.threshold) {
        data[i] = color.r;     // red
        data[i + 1] = color.g; // green
        data[i + 2] = color.b; // blue
        coloredNodes.push(i)
      } else {
        data[i] = 0;     // red
        data[i + 1] = 0; // green
        data[i + 2] = 0; // blue
      }
    }
    outputContext.putImageData(imageData, 0, 0);
    state[this.outputName] = outputCanvas;
    const numberOfColorGroups = getGrouping(imageData, coloredNodes)
    new ImageClustering(imageData, data).execute()
    return {
      result: numberOfColorGroups,
      reason: `Number of color groups: ${numberOfColorGroups}`,
    }
  }

}