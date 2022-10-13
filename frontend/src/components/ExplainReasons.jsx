import { isCanvas, isObject, titleCase } from "../devices/utils";
import dynamic from 'next/dynamic'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line }            from 'react-chartjs-2'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });


export default function ExplainReasons({result}) {

  const buildStepResult = (output, idx) => {
    let preview = result.state[output.outputName];
    if (preview && isCanvas(preview)) {
      preview = <img src={preview.toDataURL()} />
    }
    // if (preview && isObject(preview)) {
    //   preview = <Line data={preview} options={{plugins: {title: output.outputName}}}/>
    // }
    if (output.outputName == "fakeGraph") {
      var data = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
          {
              label: "Reds",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
          },
          {
              label: "Blues",
              backgroundColor: 'rgb(0, 0, 255)',
              borderColor: 'rgb(0, 0, 255)',
              data: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
          }
        ]
      };
      preview = <Line data={data} options={{plugins: {title: output.outputName}}}/>
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
      {/* REMOVE BELOW when ready */}
      {result && buildStepResult({result: true, reason: "test graph", outputName: "fakeGraph"}, 10)}
      {result && <h3>Times</h3>}
      {result && Object.keys(result.state.timing).map((t, i) => <div>{i + 1}. {t}: {result.state.timing[t]}</div>)}
      {result && (
        <ReactJson src={result.state} />
      )}
    </div>
  )
}