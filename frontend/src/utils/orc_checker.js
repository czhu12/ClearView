import { createWorker } from 'tesseract.js';

export default class ORCChecker {
  constructor(base64, { words }) {
    this.base64 = base64;
    this.words = words;
  }

  wordInString(text, word) {
    return new RegExp('\\b' + word + '\\b', 'i').test(text);
  }

  hasWords(text) {
    return this.words.some(word => this.wordInString(text, word))
  }

  async start() {
    const buffer = Buffer.from(this.base64.split(',')[1], "base64")
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return this.hasWords(text);
  }
}
