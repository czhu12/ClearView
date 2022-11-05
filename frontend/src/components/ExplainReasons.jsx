import { isCanvas, titleCase } from "../devices/utils";
import dynamic from 'next/dynamic'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line }            from 'react-chartjs-2'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });


function RenderPreview({preview, previewType}) {
  let colors;
  let normalizedColors;
  let opponencyColors;
  let smoothedOpponencyColors;
  if (previewType === "LinearColorSpaceProjection") {
    const labels = Array(preview.colorsAlongX.length).fill(1).map((n, i) => n + i);
    colors = {
      labels: labels,
      datasets: [
        {
            label: "Reds",
            backgroundColor: 'rgb(255, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            data: preview.colorsAlongX.map(c => c.r)
        },
        {
            label: "Greens",
            backgroundColor: 'rgb(0, 255, 0)',
            borderColor: 'rgb(0, 255, 0)',
            data: preview.colorsAlongX.map(c => c.g)
        },
        {
            label: "Blues",
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgb(0, 0, 255)',
            data: preview.colorsAlongX.map(c => c.b)
        }
      ]
    };

    normalizedColors = {
      labels: labels,
      datasets: [
        {
            label: "nReds",
            backgroundColor: 'rgb(255, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            data: preview.normalizedColorsAlongX.map(c => c.r)
        },
        {
            label: "nGreens",
            backgroundColor: 'rgb(0, 255, 0)',
            borderColor: 'rgb(0, 255, 0)',
            data: preview.normalizedColorsAlongX.map(c => c.g)
        },
        {
            label: "nBlues",
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgb(0, 0, 255)',
            data: preview.normalizedColorsAlongX.map(c => c.b)
        }
      ]
    };
    opponencyColors = {
      labels: labels,
      datasets: [
        {
            label: "Opponency",
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: preview.opponencyAlongX
        },
      ]
    };
    smoothedOpponencyColors = {
      labels: labels,
      datasets: [
        {
            label: "Smoothed Opponency",
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: preview.smoothedOpponencyAlongX
        },
      ]
    }
    return (
      <div>
        <Line data={colors} options={{
          plugins: {title: "Colors"},
        }}/>
        <Line data={normalizedColors} options={{
          plugins: {title: "Normalized Colors"},
        }}/>
        <Line data={opponencyColors} options={{
          plugins: {title: "Opponency"},
        }}/>
        <Line data={smoothedOpponencyColors} options={{
          plugins: {title: "Smoothed Opponency"},
        }}/>
      </div>
    );
  }
  return (
    <div>
      {preview}
    </div>
  );
}
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
        <div><RenderPreview previewType={output.name} preview={preview} /></div>
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