import { isCanvas, titleCase } from "../devices/utils";
import dynamic from 'next/dynamic'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });


export default function ExplainReasons({result}) {
  const buildStepResult = (q, idx) => {    
    let preview = result.state[q];
    if (preview && isCanvas(preview)) {
      preview = <img src={preview.toDataURL()} />
    }
    return (
      <div key={idx}>
        <h3>
          {idx + 1}: {titleCase(q)}
          {result.reasons[q].failed && <span className="text-danger ml-3">✕</span>}
          {!result.reasons[q].failed && <span className="text-success ml-3">✓</span>}
        </h3>
        <div>{preview}</div>
        {result.reasons[q].reason}
        <hr/>
      </div>
    );
  }

  return (
    <div>
      {Object.keys(result.reasons).map((q, idx) => buildStepResult(q, idx))}
      {result && <h3>Times</h3>}
      {result && Object.keys(result.state.timing).map((t, i) => <div>{i + 1}. {t}: {result.state.timing[t]}</div>)}
      {result && (
        <ReactJson src={result.state} />
      )}
    </div>
  )
}