import React, { useState, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import QualityChecker from "../utils/QualityChecker";
import abbottQualityChecker from "../../src/quality_steps/abbott.json";

const Quality = ({uid}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await axios.get(`/api/inference/${uid}`)
    setData(res.data)
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  const qualityTest = async () => {
    const quality = await new QualityChecker(data.image, abbottQualityChecker).execute(data);
    console.log(quality)
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
    </Container>
  );
}

export default Quality;
