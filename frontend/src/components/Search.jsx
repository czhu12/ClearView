import React from "react";
import {Row, Col, Button } from "react-bootstrap";
import Select from 'react-select';

const createSelectOptions = (options, name) => options.map(o => ({label: o, value: o, name: name}))

const testTypeOptions = createSelectOptions([
  'abbott',
  'ihealth',
  'flowflex',
  'atomo',
  'visby',
], "testType")

const qualityOptions = createSelectOptions([
  'positive', 'negative', 'inconclusive'
], "quality")

const resultOptions = createSelectOptions(['good', "bad"], "result");

const Search = ({setForm, form, submit}) => {
  const handleChange = (e) => setForm({...form, [e.name]: e.value})

  return (
    <Row>
      <Col>
        <Select
          value={testTypeOptions.find(option => option.value == form.testType)}
          onChange={handleChange}
          options={testTypeOptions}
        />
      </Col>
      {/* <Col>
        <Select
          value={qualityOptions.find(option => option.value == form.quality)}
          onChange={handleChange}
          options={qualityOptions}
        />
      </Col>
      <Col>
        <Select
          value={resultOptions.find(option => option.value == form.result)}
          onChange={handleChange}
          options={resultOptions}
        />
      </Col> */}
      <Col>
        <Button onClick={() => {
          window.location.href = "?" + new URLSearchParams(form)
        }}>Search</Button>
      </Col>
    </Row>
  );
}

export default Search;
