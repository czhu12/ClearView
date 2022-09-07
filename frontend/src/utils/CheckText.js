import { createWorker } from 'tesseract.js';

export default class CheckText {
  constructor({ words, outputName, canvasId }) {
    this.words = words;
    this.outputName = outputName;
    this.canvasId = canvasId;
  }

  wordInString(text, word) {
    return new RegExp('\\b' + word + '\\b', 'i').test(text);
  }

  hasWords(text) {
    return this.words.filter(word => this.wordInString(text, word))
  }

  async execute(state) {
    const buffer = Buffer.from(state[this.canvasId].toDataURL().split(',')[1], "base64")
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    const hasWords = this.hasWords(text)
    console.log(text)
    return {result: hasWords.length > 0, reason: `Matching words: ${hasWords.join(",")}`};
  }
}
