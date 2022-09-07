export default class CheckColor {
  constructor({rgb, tolerance, canvasId, outputName}) {
    this.rgb = rgb;
    this.tolerance = tolerance;
    this.canvasId = canvasId;
    this.outputName = outputName;
  }

  between(x, y) {
    return x >= y - this.tolerance && x <= y + this.tolerance;
  }

  withinTolerance(averageRGB) {
    return this.between(this.rgb.r, averageRGB.r) &&
    this.between(this.rgb.g, averageRGB.g) &&
    this.between(this.rgb.b, averageRGB.b)
  }

  async execute(state) {
    const canvas = state[this.canvasId];
    const averageRGB = await this.getAverageRGB(canvas);
    return {
      result: this.withinTolerance(averageRGB),
      reason: `Average RGB: (${averageRGB.r},${averageRGB.g},${averageRGB.b})`,
    }
    
  }

  async getAverageRGB(canvas) {
    var context = canvas.getContext('2d'),
        data,
        i = -4,
        length,
        rgb = { r:0, g:0, b:0 },
        count = 0;

    data = await context.getImageData(0, 0, canvas.width, canvas.height);
    length = data.data.length;

    while ((i += 4) < length) {
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
