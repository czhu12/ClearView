import { createWorker } from 'tesseract.js';

export default class ORCChecker {
  constructor({ words }) {
    this.words = words;
  }

  wordInString(text, word) {
    return new RegExp('\\b' + word + '\\b', 'i').test(text);
  }

  hasWords(text) {
    return this.words.some(word => this.wordInString(text, word))
  }

  async execute(state) {
    const buffer = Buffer.from(state.image.split(',')[1], "base64")
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return {result: this.hasWords(text), reason: ''};
  }
}
