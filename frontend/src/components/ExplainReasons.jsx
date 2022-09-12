import { isCanvas, titleCase } from "../devices/utils";

export default function ExplainReasons({result}) {
  const buildStepResult = (q, idx) => {    
    let preview = result.state[q];
    if (preview && isCanvas(preview)) {
      preview = <img src={preview.toDataURL()} />
    }
    return (
      <div key={idx}>
        <h3>{idx + 1}: {titleCase(q)}</h3>
        {result.reasons[q].reason}
        {preview}
        <hr/>
      </div>
    );
  }

  return (
    <div>
      {Object.keys(result.reasons).map((q, idx) => buildStepResult(q, idx))}
    </div>
  )
}