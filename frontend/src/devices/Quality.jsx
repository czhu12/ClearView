import React, { useState, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import QualityChecker from "../utils/quality_checker";

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
      const quality = await new QualityChecker(data.image, {
      "steps": [
        {
          "name": "bannerColorIsPink",
          "check": "color",
          "params": {
            "cropParams": {
              "percentageOfX": 2,
              "percentageOfY": 20,
              "maxWidth": 50,
              "maxHeight": 50
            },
            "rgb": {"r": 221, "g": 84, "b": 153},
            "tolerance": 25
          }
        }
      ]
    }).start();
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
