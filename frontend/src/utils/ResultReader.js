import ColorFilter from "./ColorFilter"

class ImageClustering {
  constructor(imageData, image) {
    this.imageData = imageData;
    this.image = image;
    this.assigned = {};
    this.assignedAspectRatioByGroupId = {};
    this.currentGroup = 0;
  }

  execute(){
    //  TODO - COMMENT: Don't we need to check the surrounding pixels for a blob? not just right or left?
    for (let x = 0; x < this.imageData.width; x++){
      for (let y = 0; y < this.imageData.height; y++) {
        if (this.isValidPixel(x, y) && this.assigned[x - 1]?.[y]) {
          this.connectToExistingBlob(x, y, this.assigned[x - 1][y])
        } else if (this.isValidPixel(x, y) && this.assigned[x]?.[y - 1]) {
          this.connectToExistingBlob(x, y, this.assigned[x][y - 1]) 
        } else if (this.isValidPixel(x, y)) {
          // found a new blob
          this.currentGroup++;
          this.assignX(x);
          this.assigned[x][y] = this.currentGroup;
          this.assignedAspectRatioByGroupId[this.currentGroup] = {minX: x, maxX: x, minY: y, maxY: y, count: 1};
        }
      }
    }

    return Object.keys(this.assignedAspectRatioByGroupId).map(groupId => (
      {
        id: groupId,
        ratio: this.aspectRatio(this.assignedAspectRatioByGroupId[groupId]),
        numPixels: this.assignedAspectRatioByGroupId[groupId].count
      }
    ))
  }

  connectToExistingBlob(x, y, value) {
    this.assignX(x)
    this.assigned[x][y] = value;
    this.assignAspectRatioForGroupId(x, y)
  }

  assignAspectRatioForGroupId(x, y){
    this.assignedAspectRatioByGroupId[this.currentGroup] = {
      ...this.minMaxes(this.assignedAspectRatioByGroupId[this.currentGroup], x, y),
      count: this.assignedAspectRatioByGroupId[this.currentGroup].count + 1
    }
  }

  assignX(x) {
    if (!this.assigned[x]) this.assigned[x] = {};
  }


  isValidPixel(x, y){
    return this.image[(x * 4) + (y * (this.imageData.width * 4))]
  }

  minMaxes(currentAspectRatio, x, y) {
    const maxX = Math.max(currentAspectRatio.maxX, x)
    const minX = Math.min(currentAspectRatio.minX, x)
    const minY = Math.min(currentAspectRatio.minY, y)
    const maxY = Math.max(currentAspectRatio.maxY, y)
    return { maxX, minX, minY, maxY }
  }

  aspectRatio({maxX, minX, minY, maxY}) {
    return `${maxX - minX}:${maxY - minY}`
  }
}

export default class ResultReader {
  constructor({ threshold, colorTarget, inputCanvasName, outputName, testType }) {
    this.colorTarget = colorTarget;
    this.threshold = threshold;
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
    this.testType = testType;
  }

  async execute(state){
    const { imageData, data } = new ColorFilter({
      threshold: this.threshold,
      colorTarget: this.colorTarget,
      inputCanvasName: this.inputCanvasName,
      outputName: this.outputName,
    }).execute(state);
    const imageClusteringData = new ImageClustering(imageData, data).execute()

    return {
      result: true,
      reason: JSON.stringify(imageClusteringData),
    }
  }

}
