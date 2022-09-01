import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const Labeling = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [continuationKey, setContinuationKey] = useState(null);
 
  const fetchData = async () => {
    setLoading(true);
    const response = await axios.get(`/api/inference?startAfter=${continuationKey}`);
    const originalData = data;
    const newData = [];
    for (let i = 0; i < response.data.uids.length; i++) {
      const uid = response.data.uids[i]
      const res = await axios.get(`/api/inference/${uid}`)
      newData.push(res.data)
      setData([...originalData, ...newData])
    }
    setContinuationKey(response.data.startAfter);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])


  return (
    <Container className="py-4 px-4" id="self-checkout">
      <h3 className="my-3">Images</h3>
      <Row>
        {data.map(d => (
          <Col xs={12} lg={3} md={4} sm={6}>
            <img src={d.image} height="200"/>
            <div>{d.metadata.quality} {d.metadata.label} {d.metadata.testType}</div>
          </Col>
        ))}
      </Row>
      {loading && <Spinner animation="border" />}
      {continuationKey && <Button block onClick={fetchData}>Load more</Button>}
    </Container>
  );
}

export default Labeling;