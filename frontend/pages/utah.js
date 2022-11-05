import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ExplainReasons from "../src/components/ExplainReasons";
import Header from "../src/components/Header";
import { PipelineBuilder } from "../src/utils/Pipeline";

let pipeline;
export default function Demo() {
  const [result, setResult] = useState(null);
  const bindPasteHandler = () => {
    document.onpaste = function(event) {
      const data = (event.clipboardData || window.clipboardData);
      const image = data.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        // Image data stored in reader.result
        const base64 = reader.result;
        makePrediction(base64);
      }.bind(this);
      reader.readAsDataURL(image);
    }
  }

  const makePrediction = async (base64) => {
    const state = { base64 }
    const { result: _result, outputs } = await pipeline.execute(state);
    setResult({outputs, state});
  }

  const initializePipeline = async () => {
    pipeline = await PipelineBuilder.loadFromPath(`/configs/utah.json`)
  }

  useEffect(() => {
    bindPasteHandler();
    initializePipeline();
  }, []);

  return (
    <div>
      <Header />
      <Container style={{maxWidth: "560px"}}>
        <div className="text-center">
          <div className="display-4">Paste your image</div>
          <div className="text-muted">(cmd + shift + ctrl + 4)</div>
          {result && (
            <ExplainReasons result={result} />
          )}
        </div>
      </Container>
    </div>
  );
}