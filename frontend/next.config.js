/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");

if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, {  }) => {

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm.wasm',
            to: 'static/chunks/pages',
          },             {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
            to: 'static/chunks/pages',
          },
        ],
      }),
    );

    return config;
  }

}

module.exports = nextConfig
