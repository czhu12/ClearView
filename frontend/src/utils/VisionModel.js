import * as ort from 'onnxruntime-web';
import { createCanvas } from "canvas";

const argmax = (array) => {
  let max = Number.MIN_VALUE;
  let arg;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      arg = i;
    }
  }
  return arg;
}

function processImage(originalCanvas, size) {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext("2d");
  // draw scaled image
  context.drawImage(originalCanvas, 0, 0, canvas.width, canvas.height);

  // return data
  return context.getImageData(0, 0, size, size).data;
}

function imageDataToTensor(data, dims) {
  // 1a. Extract the R, G, and B channels from the data
  const [R, G, B] = [[], [], []]
  for (let i = 0; i < data.length; i += 4) {
    R.push(data[i]);
    G.push(data[i + 1]);
    B.push(data[i + 2]);
    // 2. skip data[i + 3] thus filtering out the alpha channel
  }
  // 1b. concatenate RGB ~= transpose [224, 224, 3] -> [3, 224, 224]
  const transposedData = R.concat(G).concat(B);

  // 3. convert to float32
  let i, l = transposedData.length; // length, we need this for the loop
  const float32Data = new Float32Array(3 * 224 * 224); // create the Float32Array for output
  for (i = 0; i < l; i++) {
    float32Data[i] = transposedData[i] / 255.0; // convert to float
  }

  const inputTensor = new ort.Tensor("float32", float32Data, dims);
  return inputTensor;
}

const SIZE = 224;
const DIMS = [1, 3, SIZE, SIZE];
export default class VisionModel {
  constructor(modelPath) {
    this.session = null;
    this.modelPath = modelPath;
  }

  async predict(canvas) {
    const resizedImageData = processImage(canvas, SIZE);
    const inputTensor = imageDataToTensor(resizedImageData, DIMS);
    debugger;
    const prediction = await this.runModel(inputTensor);
    console.log(prediction);
    return prediction;
  }

  async runModel(inputData) {
    try {
      // create a new session and load the AlexNet model.
      if (!this.session) {
        this.session = await ort.InferenceSession.create(
          '/models/test_type.onnx',
        );
      }
      const feeds = { input: inputData };

      // feed inputs and run
      const results = await this.session.run(feeds);
      return argmax(results.output.data);
    } catch (e) {
      console.log(e);
    }
  }

}