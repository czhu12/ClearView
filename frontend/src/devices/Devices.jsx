import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { BADGES } from "./utils";
import Select from 'react-select';

const Search = () => {
  const [form, setForm] = useState({
    testType: null,
    quality: null,
    result: null,
    id: null,
  });
 
  const search = async () => {
    const response = await axios.get(`/api/inference?startAfter=${continuationKey}`);
    for (let i = 0; i < response.data.uids.length; i++) {
      const uid = response.data.uids[i]
      const res = await axios.get(`/api/inference/${uid}`)
      newData.push({...res.data, uid})
      setData([...originalData, ...newData])
    }
    setContinuationKey(response.data.startAfter);
    setLoading(false);
  }



  return (
    <Container className="py-4 px-4" id="self-checkout">
      <Select
        value={pipelineConfig}
        onChange={(value) => setPipelineConfig(value)}
        options={options}
      />
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
                {Object.keys(d.metadata).map(k => <Badge className="mx-1" bg={BADGES[k][d.metadata[k]]}>{d.metadata[k]}</Badge> )}
              </div>
            </a>
          </Col>
        ))}
      </Row>
      {loading && <Spinner animation="border" />}
      {continuationKey && <Button block onClick={fetchData}>Load more</Button>}
    </Container>
  );
}

export default Search;
