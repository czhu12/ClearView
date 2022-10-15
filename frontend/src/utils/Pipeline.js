import axios from "axios";
import ToCanvas from "./ToCanvas";
import CropImage from "./CropImage";
import CheckColor from "./CheckColor";
import CheckText from "./CheckText";
import QRChecker from "./QRChecker";
import TestTypeModel from "./TestTypeModel";
import ResultReader from "./ResultReader";
import ColorNormalizer from "./ColorNormalizer";
import CannyEdgeDetection from "./CannyEdgeDetection";
import LinearColorSpaceProjection from "./LinearColorSpaceProjection";
import RotateCanvas from "./RotateCanvas";

const SLOW_QUALITY_CHECKS = ["CannyEdgeDetection", "CheckText", "TestTypeModel"]

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
      } else if (step.name === "ResultReader") {
        steps.push(new ResultReader(step.params));
      } else if (step.name === "ColorNormalizer") {
        steps.push(new ColorNormalizer(step.params));
      } else if (step.name === "CannyEdgeDetection") {
        steps.push(new CannyEdgeDetection(step.params));
      } else if (step.name === "LinearColorSpaceProjection") {
        steps.push(new LinearColorSpaceProjection(step.params));
      } else if (step.name === "RotateCanvas") {
        steps.push(new RotateCanvas(step.params));
      } else {
        console.error(`Step: ${step.name} not defined`);
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
    const outputs = []
    const startTime = (new Date()).getTime();
    const timing = {};
    let result = true;
    const steps = state.forWebcam
      ? this.steps.filter(x => !SLOW_QUALITY_CHECKS.includes(x.constructor.name))
      : this.steps;
    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepStartTime = (new Date()).getTime();
        const { result, reason } = await step.execute(state, this);
        timing[step.constructor.name + " " + i] = (new Date()).getTime() - stepStartTime;

        if (!result) {
          outputs.push({ result, reason, failed: true, outputName: step.outputName });
          throw new PipelineError(reason);
        }

        if (step.outputName) {
          outputs.push({ result, reason, outputName: step.outputName, name: step.constructor.name });
        }
      }
    } catch(error) {
      console.log(error);
      result = false;
    }


    timing.total = (new Date()).getTime() - startTime;
    state.timing = timing;
    return { result, outputs };
  }
}
