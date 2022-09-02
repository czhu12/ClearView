const fs = require('fs');

const parseArgs = require('minimist');
const argV = parseArgs(process.argv.slice(2));
const version = argV['_'][0]
const data = fs.readFileSync('config.json');
let config = JSON.parse(data);
console.log(version);
const modelPath = config["training"]["test_type"]["model_path"].replace("{version}", version);
console.log(modelPath);
// Create the pipeline
// Get the cropped data from the pipeline and set it up.


