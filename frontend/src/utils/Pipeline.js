import axios from "axios";
import ToCanvas from "./ToCanvas";
import CropImage from "./CropImage";
import CheckColor from "./CheckColor";
import CheckText from "./CheckText";
import QRChecker from "./QRChecker";
import TestTypeModel from "./TestTypeModel";
import ColorFilter from "./ColorFilter";


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
      } else if (step.name === "CheckColor") {
        steps.push(new CheckColor(step.params));
      } else if (step.name === "QRChecker") {
        steps.push(new QRChecker(step.params));
      } else if (step.name === "ToCanvas") {
        steps.push(new ToCanvas(step.params));
      } else if (step.name === "TestTypeModel") {
        steps.push(new TestTypeModel(step.params));
      } else if (step.name === "CheckText") {
        steps.push(new CheckText(step.params));
      } else if (step.name === "ColorFilter") {
        steps.push(new ColorFilter(step.params));
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
    const reasons = {}
    const startTime = (new Date()).getTime();
    const timing = {};
    try {
      for (let i = 0; i < this.steps.length; i++) {
        const step = this.steps[i];
        const stepStartTime = (new Date()).getTime();
        const { result, reason } = await step.execute(state, this);
        timing[step.constructor.name] = (new Date()).getTime() - stepStartTime;

        if (!result) {
          reasons[step.outputName] = {result, reason, failed: true}
          throw new PipelineError(reason);
        }

        if (step.outputName) {
          reasons[step.outputName] = { result, reason }
        }
      }
    } catch(error) {
      //console.log(error);
    }


    timing.total = (new Date()).getTime() - startTime;
    state.timing = timing;
    return { result: true, reasons: reasons };
  }
}
