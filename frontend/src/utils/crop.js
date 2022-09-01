import { createCanvas } from 'canvas';

export default class CropImage {
  constructor(base64, x, y, width, height) {
    this.base64 = base64;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  image() {
    const img = new Image();
    img.src = this.base64;
    return img;
  }

  create() {
    const canvas = createCanvas(this.width, this.height);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const image = this.image();
    context.drawImage(image, this.x, this.y, this.width, this.height, 0, 0, this.width, this.height);
    return canvas;
  }
}

