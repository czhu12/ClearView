import React, { useState, useEffect } from "react";
import { Container, Button, Spinner, Badge } from "react-bootstrap";
import { PipelineBuilder } from "../../src/utils/Pipeline"
import axios from "axios";
import { BADGES } from "./utils";
import ExplainReasons from "../components/ExplainReasons";
import Select from 'react-select';

const options = [
  { value: 'abbott', label: 'Abbott V0.1' },
  { value: 'abbott-1', label: 'Abbott V0.2' },
  { value: 'abbott-2', label: 'Abbott V0.1-dl' },
  { value: 'visby', label: 'Visby' },
  { value: 'ihealth', label: 'IHealth' },
  { value: 'test', label: 'Test' },
];


const Quality = ({uid}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const fetchData = async () => {
    const res = await axios.get(`/api/inference/${uid}`)
    setData(res.data)
    setLoading(false);
  }

  const [pipelineConfig, setPipelineConfig] = useState(null);
  useEffect(() => {
    fetchData();
  }, [])

  const calculateQuality = async () => {
    const state = { base64: data.image }
    const pipeline = await PipelineBuilder.loadFromPath(`/configs/${pipelineConfig.value}.json`)
    const result = await pipeline.execute(state);
    setResult({...result, state});
  }

  return (
    <Container style={{maxWidth: "560px"}} className="py-4 px-4" id="self-checkout">
      <h3 className="my-3">Image</h3>
      <img src={data?.image} height="200"/>
      {data?.metadata && <>
        <div className="my-2">
          <Badge className="mx-1" bg={BADGES.label[data.metadata.label]}>{data.metadata.label}</Badge>
          <Badge className="mx-1" bg={BADGES.quality[data.metadata.quality]}>{data.metadata.quality}</Badge>
          <Badge className="mx-1" bg={BADGES.testType[data.metadata.testType]}>{data.metadata.testType}</Badge>
        </div>
      </>}
      {loading
        ? <Spinner animation="border" />
        : <div>
            <Select
              value={pipelineConfig}
              onChange={(value) => setPipelineConfig(value)}
              options={options}
            />
            <Button onClick={calculateQuality} className="w-100 my-2" size="lg" >Calculate quality</Button>
          </div>
      }


      {result && <ExplainReasons result={result} />}
    </Container>
  );
}

export default Quality;
