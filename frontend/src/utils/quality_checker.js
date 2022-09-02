import ColorChecker from "./color_checker";
import ORCChecker from "./orc_checker";

const STEPS = {
  "color": ColorChecker,
  "orc": ORCChecker,
}

export default class QualityChecker {
  constructor(image, checkJson) {
    this.image = image;
    this.steps = checkJson.steps;
    this.quality = {};
  }
  
  async startStep(step) {
    const value = await new STEPS[step.check](this.image, step.params).start();
    this.quality[step.name] = value;
  }

  async start() {
    for (var i = 0; i < this.steps.length; i++) {
      await this.startStep(this.steps[i])
    }
    return this.quality;
  }
}
