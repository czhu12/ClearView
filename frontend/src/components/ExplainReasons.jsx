import { isCanvas, titleCase } from "../devices/utils";
import dynamic from 'next/dynamic'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });


export default function ExplainReasons({result}) {
  const buildStepResult = (output, idx) => {
    let preview = result.state[output.outputName];
    if (preview && isCanvas(preview)) {
      preview = <img src={preview.toDataURL()} />
    }
    return (
      <div key={idx}>
        <h3>
          {idx + 1}: {titleCase(output.outputName)}
          {output.failed && <span className="text-danger ml-3">✕</span>}
          {!output.failed && <span className="text-success ml-3">✓</span>}
        </h3>
        <div>{preview}</div>
        {output.reason}
        <hr/>
      </div>
    );
  }

  return (
    <div>
      {result.outputs.map((output, idx) => buildStepResult(output, idx))}
      {result && <h3>Times</h3>}
      {result && Object.keys(result.state.timing).map((t, i) => <div>{i + 1}. {t}: {result.state.timing[t]}</div>)}
      {result && (
        <ReactJson src={result.state} />
      )}
    </div>
  )
}