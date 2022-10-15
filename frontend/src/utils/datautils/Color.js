export default class Color {
  constructor(r, g, b, a=0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  divide(scalar) {
    return new Color(this.r / scalar, this.g / scalar, this.b / scalar);
  }

  magnitude() {
    return Math.sqrt((this.r * this.r) + (this.g * this.g) + (this.b * this.b))
  }

  dot(other) {
    return (other.r * this.r) + (other.g * this.g) + (other.b * this.b);
  }

  normalize() {
    return this.divide(this.magnitude());
  }
}
