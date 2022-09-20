import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { BADGES } from "./utils";

// TODO: celina-lopez: add filtering

const Labeling = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [continuationKey, setContinuationKey] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const params = {}
    if (continuationKey) params.lastEvaluatedKey =  continuationKey
    const response = await axios.post(`/api/inference`, params);
    const originalData = !!continuationKey ? data : [];
    const newData = [];
    for (let i = 0; i < response.data.items.length; i++) {
      const metadata = response.data.items[i]
      const res = await axios.get(`/api/inference/${metadata.id}`)
      newData.push({...res.data, uid: metadata.id, metadata })
      setData([...originalData, ...newData])
    }
    setContinuationKey(response.data.lastEvaluatedKey);
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
          <Col
            xs={12}
            lg={3}
            md={4}
            sm={6}
            className="my-2 pointer"
          >
            <a href={`/web/demo/${d.uid}`}>
              <img src={d.image} height="200"/>
              <div>
                <Badge className="mx-1" bg={BADGES.label[d.metadata.label]}>{d.metadata.label}</Badge>
                <Badge className="mx-1" bg={BADGES.quality[d.metadata.quality]}>{d.metadata.quality}</Badge>
                <Badge className="mx-1" bg={BADGES.testType[d.metadata.testType]}>{d.metadata.testType}</Badge>
              </div>
            </a>
          </Col>
        ))}
      </Row>
      {loading && <Spinner animation="border" />}
      {continuationKey && <Button className="w-100 btn-lg" onClick={fetchData}>Load more</Button>}
    </Container>
  );
}

export default Labeling;
