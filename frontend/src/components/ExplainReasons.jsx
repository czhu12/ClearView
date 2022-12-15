import { isCanvas, titleCase } from "../devices/utils";
import dynamic from 'next/dynamic'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line }            from 'react-chartjs-2'
import { Col, Row } from "react-bootstrap";
import { calcAverage } from "../utils/datautils/CanvasStatistics";

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });


const clamp = (data) => {
  const threshold = [...data].sort()[parseInt(data.length * 0.75)]
  return data.filter(d => d < threshold);
}
function RenderPreview({preview, previewType}) {
  let colors;
  let normalizedColors;
  let opponencyColors;
  let opponencyBaseline;
  let bOpponencyColors;

  let bOpponencyBaseline;
  if (previewType === "LinearColorSpaceProjection") {
    let opponencyBaselineData = clamp(preview.opponencyAlongX);
    let bOpponencyBaselineData = clamp(preview.bOpponencyAlongX);
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
    opponencyBaseline = {
      labels: labels,
      datasets: [
        {
            label: "Opponency Baseline",
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: opponencyBaselineData
        },
      ]
    }
    bOpponencyColors = {
      labels: labels,
      datasets: [
        {
            label: "Blue Opponency",
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: preview.bOpponencyAlongX
        },
      ]
    };
    bOpponencyBaseline = {
      labels: labels,
      datasets: [
        {
            label: "Blue Opponency Baseline ",
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: bOpponencyBaselineData
        },
      ]
    }
    return (
      <div>
        <Row className="my-4">
          <Col>
            <Line data={opponencyColors} options={{
              plugins: {title: "Opponency"},
            }}/>
          </Col>
          <Col>
            <Line data={opponencyBaseline} options={{
              plugins: {title: "Opponency Baseline"},
            }}/>
            Average: {calcAverage(opponencyBaselineData)}
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <Line data={bOpponencyColors} options={{
              plugins: {title: "Blue Opponency"},
            }}/>
          </Col>
          <Col>
            <Line data={bOpponencyBaseline} options={{
              plugins: {title: "Blue Opponency Baseline"},
            }}/>
            Average: {calcAverage(bOpponencyBaselineData)}
          </Col>
        </Row>
        <Line data={normalizedColors} options={{
          plugins: {title: "Normalized Colors"},
        }}/>
        <Line data={colors} options={{
          plugins: {title: "Colors"},
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
      preview = <img className="main-image" src={preview.toDataURL()} />
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