import VisionModel from "./VisionModel"

const TEST_TYPE_MAP = {
  "0": "abbott",
  "1": "ihealth",
}

export default class TestTypeModel {
  constructor({modelPath, inputName}) {
    this.visionModel = new VisionModel(modelPath);
    this.inputName = inputName;
  }

  async execute(state) {
    const canvas = state[this.inputName];
    const prediction = await this.visionModel.predict(canvas);
    state.prediction = prediction;
    state.predictionName = TEST_TYPE_MAP[prediction.toString()];
    return {
      result: true,
      reason: null,
    }
  }
}