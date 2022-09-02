import ColorChecker from "./ColorChecker";
import ORCChecker from "./OrcChecker";

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
    const value = await new STEPS[step.check](step.params).execute(this);
    this.quality[step.name] = value;
  }

  async execute() {
    for (var i = 0; i < this.steps.length; i++) {
      await this.startStep(this.steps[i])
    }
    return this.quality;
  }
}
