import { createCanvas } from "canvas";

export default class RotateCanvas {
  static name = 'RotateCanvas';
  constructor({inputName, outputName, rotation}) {
    this.inputName = inputName;
    this.outputName = outputName;
    this.rotation = rotation
  }

  async execute(state) {
    debugger;
    const canvas = state[this.inputName];
    const outputCanvas = createCanvas(canvas.width, canvas.height);
    const outputContext = outputCanvas.getContext('2d');
    
    outputContext.translate(canvas.width/2,canvas.height/2);

    outputContext.rotate(this.rotation * Math.PI / 180)
    outputContext.drawImage(canvas, -canvas.width/2,-canvas.height/2);

    state[this.outputName] = outputCanvas
    return {result: true, reason: ""}
  }
}