import React, { useState } from "react";
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

const labelOptions = createSelectOptions([
  'positive', 'negative', 'inconclusive'
], "label")

const qualityOptions = createSelectOptions(['good', "bad"], "quality");

const Search = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({
    testType: urlParams.get('testType'),
    quality: urlParams.get('quality'),
    label: urlParams.get('label'),
  })
  const handleChange = (e) => setForm({...form, [e.name]: e.value})

  const formParams = () => {
    const params = {}
    Object.keys(form).map(k => {
      if (form[k]) params[k] = form[k]
    });
    return params;
  }

  return (
    <Row>
      <Col>
        <Select
          value={testTypeOptions.find(option => option.value == form.testType)}
          onChange={handleChange}
          options={testTypeOptions}
        />
      </Col>
      <Col>
        <Select
          value={labelOptions.find(option => option.value == form.label)}
          onChange={handleChange}
          options={labelOptions}
        />
      </Col>
      <Col>
        <Select
          value={qualityOptions.find(option => option.value == form.quality)}
          onChange={handleChange}
          options={qualityOptions}
        />
      </Col>
      <Col>
        <Button onClick={() => {
          window.location.href = "?" + new URLSearchParams(formParams())
        }}>Search</Button>
      </Col>
    </Row>
  );
}

export default Search;
