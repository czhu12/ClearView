
import { createCanvas, loadImage } from 'canvas';

export default class ObjectDetection {
  constructor({ outputName, inputCanvasName }) {
    this.outputName = outputName;
    this.inputCanvasName = inputCanvasName;
  }

  async execute(state) {
    let src = cv.imread(state[this.inputCanvasName]);
    if (!window.ObjectDetection) {
      window.ObjectDetection = {}
      window.ObjectDetection.templimage = await loadImage("/images/abbott/object_detection/negative-1.png");
    }
    let templ = cv.imread(window.ObjectDetection.templimage);
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(src, templ, dst, cv.TM_CCORR_NORMED, mask);
    let result = cv.minMaxLoc(dst, mask);
    let maxPoint = result.maxLoc;
    let color = new cv.Scalar(255, 0, 0, 255);
    let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
    cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
    state[this.outputName] = createCanvas(state[this.inputCanvasName].width, state[this.inputCanvasName].height)
    cv.imshow(state[this.outputName], src);
    src.delete(); dst.delete(); mask.delete();
    return { result: true, reason: state.canvas }
  }
}


