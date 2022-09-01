import { createCanvas } from 'canvas';

export default class CropImage {
  constructor(base64, {percentageOfX, percentageOfY, maxWidth, maxHeight}) {
    this.base64 = base64;
    this.percentageOfX = percentageOfX;
    this.percentageOfY = percentageOfY;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
  }

  ratio(image) {
    return Math.min(this.maxWidth / image.width, this.maxHeight / image.height);
  }

  image() {
    const img = new Image();
    img.src = this.base64;
    return img;
  }

  async start() {
    const image = this.image();
    const ratio = this.ratio(image);
    const width = image.width * ratio;
    const height = image.height * ratio;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, image.width / this.percentageOfX, image.height / this.percentageOfY, width, height, 0, 0, width, height);
    return canvas;
  }
}

