export const isCanvas = (i) => i instanceof HTMLCanvasElement;
export const isObject = (i) => i instanceof Object;

export const titleCase = (s) =>
  s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())

export const BADGES = {
    quality: {
      good: "success",
      bad: "danger",
    },
    label: {
      negative: "success",
      positive: "danger",
      inconclusive: "warning",
    },
    testType: {
      abbott: "pink",
      ihealth: "danger"
    }
  }