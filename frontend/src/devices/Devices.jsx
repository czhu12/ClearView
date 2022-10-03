import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { BADGES } from "./utils";
import Search from "../components/Search";
import { ToastContainer, toast } from 'react-toastify';

const Labeling = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [continuationKey, setContinuationKey] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);

  const fetchData = async () => {
    setLoading(true);
    const params = {}
    if (continuationKey) params.lastEvaluatedKey =  continuationKey
    if (urlParams.get("testType")) params.testType = urlParams.get("testType")
    if (urlParams.get("label")) params.label = urlParams.get("label")
    if (urlParams.get("quality")) params.quality = urlParams.get("quality")
    
    const originalData = data
    const loadedData = originalData.filter(x => x.loaded);
    const newData = originalData.filter(x => !x.loaded);

    if (newData.length < 10) {
      const response = await axios.post(`/api/inference`, params);
      for (let i = 0; i < response.data.items.length; i++) {
        const metadata = response.data.items[i]
        newData.push({uid: metadata.id, metadata, loaded: false })
      }
      setContinuationKey(response.data.lastEvaluatedKey);
    }

    for (let i = 0; i < Math.min(newData.length, 10); i++) {
      const res = await axios.get(`/api/inference/${newData[i].uid}`)
      newData[i] = {...newData[i], ...res.data, loaded: true}
      setData([...loadedData, ...newData])
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleDelete = (uid, testType) => {
    if (confirm("Are you sure you want to delete?")) {
      axios.delete(`/api/inference/destroy/${uid}?testType=${testType}`).then(() => toast.warn("Deleted!"))
    }
  }


  return (
    <Container className="py-4 px-4" id="self-checkout">
      <Search />
      <h3 className="my-3">Images</h3>
      <Row>
        {data.filter(x => x.loaded).map(d => (
          <Col
            xs={12}
            lg={3}
            md={4}
            sm={6}
            className="my-2 pointer"
            style={{position: "relative"}}
          >
            <div style={{position: "absolute", right: 30, top: 5}} onClick={() => handleDelete(d.uid, d.metadata.testType)}>❌</div>
            <a href={`/web/demo/${d.uid}`}>
              <img src={d.image} height="200" className="rounded"/>
            </a>
            <div>
              <Badge bg={BADGES.label[d.metadata.label]}>{d.metadata.label}</Badge>
              <Badge className="mx-1" bg={BADGES.quality[d.metadata.quality]}>{d.metadata.quality}</Badge>
              <Badge bg={BADGES.testType[d.metadata.testType]}>{d.metadata.testType}</Badge>
            </div>
          </Col>
        ))}
      </Row>
      {loading && <Spinner animation="border" />}
      {(continuationKey || data.filter(x => !x.loaded).length > 0) && <Button className="w-100 btn-lg" onClick={fetchData}>Load more</Button>}
      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}

export default Labeling;
