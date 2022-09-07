import React, { useState, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { PipelineBuilder } from "../../src/utils/Pipeline"
import axios from "axios";


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

  const qualityTest = async () => {
    const state = { base64: data.image }
    const pipeline = await PipelineBuilder.loadFromPath("/configs/abbott.json")
    const quality = await pipeline.execute(state);
    setResult(quality)
  }

  return (
    <Container style={{maxWidth: "560px"}} className="py-4 px-4" id="self-checkout">
      <h3 className="my-3">Image</h3>
      {data && <>
        <img src={data.image} height="200"/>
      <div>{data.metadata.quality} {data.metadata.label} {data.metadata.testType}</div>
      </>}
      {loading && <Spinner animation="border" />}
      <Button onClick={qualityTest}> test quality</Button>
      {result && Object.keys(result.reasons).map((q, idx) => {
        return <div key={idx}>
          <h3>{q}</h3>
          {result.reasons[q].reason}
        </div>
      })}
    </Container>
  );
}

export default Quality;
