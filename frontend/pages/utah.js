import { useEffect, useState } from "react";
import ExplainReasons from "../src/components/ExplainReasons";
import { useRouter } from "next/router";
import Header from "../src/components/Header";
import { PipelineBuilder } from "../src/utils/Pipeline";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Badge, Row, Form, Col, Button, Container } from "react-bootstrap";

let pipeline;
export default function Demo() {
  const { query, isReady } = useRouter();
  if (!isReady) return <></>;
  const [form, setForm] = useState({tag: query.tag});
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

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onSubmit = (e) => {
    if (e.currentTarget.checkValidity() === true) {
      e.preventDefault();
      try {
        axios.post("/api/utah/create", form).then((r) => {
          toast.success('Success');
          setForm({tag: query.tag});
          setResult(null);
        })
      } catch(error) {
        alert("Something went wrong!");
      }
    } else {
      e.preventDefault();
      e.stopPropagation();
      setForm({...form, validated: true})
    }
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
            <>
              <Form  noValidate validated={form.validated} onSubmit={onSubmit}>
                <Badge bg="secondary">{form.tag}</Badge>
                <Row>
                  <Col xs={5}>
                    <Form.Group className="mb-3" controlId="formID">
                      <Form.Label>ID</Form.Label>
                      <Form.Control required onChange={handleChange} name="id" placeholder="ID" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formNumberOne">
                      <Form.Label>#</Form.Label>
                      <Form.Control required onChange={handleChange} name="number_one" placeholder="#" type="number"/>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formNumberTwo">
                      <Form.Label>#</Form.Label>
                      <Form.Control placeholder="#" onChange={handleChange} name="number_two" type="number" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formNumberTwo">
                      <Form.Label>#</Form.Label>
                      <Form.Control placeholder="#" onChange={handleChange} name="number_three" type="number" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button size="lg" variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              <ExplainReasons result={result} />
            </>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </Container>
    </div>
  );
}