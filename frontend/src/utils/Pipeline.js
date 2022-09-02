class PipelineError extends Error {
  constructor(message) {
    super(message);
    this.message = message
  }
}
export default class Pipeline {
  constructor(steps, definition={}) {
    this.definition = definition
    this.steps = steps;
  }

  async execute(state) {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      const { result, reason } = await step.execute(state, this);
      if (!result) {
        throw new PipelineError(reason);
      }
    }
    return {result: true, reason: null};
  }
}
