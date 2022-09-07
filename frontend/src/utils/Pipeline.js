import axios from "axios";
import ToCanvas from "./ToCanvas";
import CropImage from "./CropImage";
import ColorChecker from "./ColorChecker";

class PipelineError extends Error {
  constructor(message) {
    super(message);
    this.message = message
  }
}

export class PipelineBuilder {
  static async loadFromPath(configPath) {
    const response = await axios.get(configPath);
    return new PipelineBuilder(response.data).create();
  }

  constructor(config) {
    this.config = config;
  }

  create() {
    const steps = [];
    for (let i = 0; i < this.config.steps.length; i++) {
      const step = this.config.steps[i];
      if (step.name === "CropImage") {
        steps.push(new CropImage(step.params));
      } else if (step.name === "ColorChecker") {
        steps.push(new ColorChecker(step.params));
      } else if (step.name === "ToCanvas") {
        steps.push(new ToCanvas(step.params));
      }
    }

    return new Pipeline(steps);
  }
}

export default class Pipeline {
  constructor(steps, definition={}) {
    this.definition = definition
    this.steps = steps;
  }

  async execute(state) {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      const { result, reason } = await step.execute(state, this);
      if (!result) {
        throw new PipelineError(reason);
      }
    }
    return {result: true, reason: null};
  }
}
