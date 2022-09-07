import CheckColor from "./CheckColor"
import Pipeline from "./Pipeline";
import { RED_IMAGE } from "./testConstants";
import CropImage from "./CropImage";
import ToCanvas from "./ToCanvas";

test('ToCanvas', async () => {
  const state = { base64: RED_IMAGE };
  const toCanvas = new ToCanvas({width: 512, height: 512});
  const { result, reason } = await toCanvas.execute(state);
  expect(result).toEqual(true);
  expect(!!state.canvas).toEqual(true);
  const context = state.canvas.getContext("2d");
  const canvasColor = context.getImageData(1, 1, 1, 1).data; // rgba e [0,255]
  expect(canvasColor[0]).toEqual(254);
});

test('CropImage', async () => {
  const state = { base64: RED_IMAGE };
  const pipeline = new Pipeline([
    new ToCanvas({width: 512, height: 512}),
    new CropImage({
      percentageOfX: 0,
      percentageOfY: 0,
      width: 10,
      height: 10,
      outputName: "cropped"
    }),
  ]);

  const { result, reason } = await pipeline.execute(state);
  expect(result).toEqual(true);
  expect(!!state.cropped).toEqual(true);
});


test('CheckColor', async () => {
  const state = { base64: RED_IMAGE };
  const pipeline = new Pipeline([
    new ToCanvas({width: 512, height: 512}),
    new CropImage({
      percentageOfX: 0,
      percentageOfY: 0,
      width: 10,
      height: 10,
      outputName: "color_crop"
    }),
    new CheckColor({
      rgb: {r: 256, g: 3, b: 20},
      tolerance: 10,
      outputName: "color_check",
      inputCanvasName: "color_crop"
    }),
  ]);

  const { result, reason } = await pipeline.execute(state);
  expect(result).toEqual(true);
  expect(!!state.color_crop).toEqual(true);
});
