import React, { useState, useEffect } from "react";
import { Container, Button, Spinner, Badge } from "react-bootstrap";
import { PipelineBuilder } from "../../src/utils/Pipeline"
import axios from "axios";
import { isCanvas, titleCase, BADGES } from "./utils";

const Quality = ({uid}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const fetchData = async () => {
    const res = await axios.get(`/api/inference/${uid}`)
    setData(res.data)
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  const calculateQuality = async () => {
    const state = { base64: data.image }
    const pipeline = await PipelineBuilder.loadFromPath(`/configs/${data.metadata.testType}.json`)
    const { result, reasons } = await pipeline.execute(state);
    setResult({reasons: reasons, state})
  }

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
    <Container style={{maxWidth: "560px"}} className="py-4 px-4" id="self-checkout">
      <h3 className="my-3">Image</h3>
      {data && <>
        <img src={data.image} height="200"/>
        <div className="my-2">
        
          {Object.keys(data.metadata).map(k => (
            <Badge className="mx-1" bg={BADGES[k][data.metadata[k]]}>
              {data.metadata[k]}
            </Badge>
          ))}
        </div>
      </>}
      {loading
        ? <Spinner animation="border" />
        : <div><Button onClick={calculateQuality} className="w-100 my-2" size="lg" >Calculate quality</Button></div>
      }
      {result && Object.keys(result.reasons).map((q, idx) => buildStepResult(q, idx))}
    </Container>
  );
}

export default Quality;
