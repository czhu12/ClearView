import ColorChecker from "./color_checker";
import CropImage from "./crop";

class QualityChecker {
  constructor(image, checkJson) {
    this.image = image;
    this.steps = checkJson.steps;
  }
  
  getStep(step) {
    if (step.check == "color") {
      return ColorChecker
    } else if (step.check == "crop") {
      return CropImage
    }
  }

  start() {
    // const quality = {};
    // this.steps.map(step => {
    //   this.getStep(step)
    // })
    return({});
  }
}
