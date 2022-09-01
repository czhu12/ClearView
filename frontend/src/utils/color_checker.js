import { createCanvas, loadImage } from 'canvas';

export default class ColorChecker {
  constructor(canvas, rgb, tolerance) {
    this.canvas = canvas;
    this.rgb = rgb;
    this.tolerance = tolerance;
  }

  between(x, y) {
    return x >= y - this.tolerance && x <= y + this.tolerance;
  }

  within_tolerance(averageRGB) {
    this.between(this.rgb.r, averageRGB.r) &&
    this.between(this.rgb.g, averageRGB.g) &&
    this.between(this.rgb.b, averageRGB.b)
  }

  presence() {
    const averageRGB = this.getAverageRGB();
    return this.within_tolerance(averageRGB)
  }

  getAverageRGB() {
    var context = this.canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    data = context.getImageData(0, 0, width, height);
    length = data.data.length;

    while ( (i += 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
  }
}
