import Webcam from 'react-webcam';
import React, { useState, useRef, useCallback } from "react";
import { Container, Button, Form } from "react-bootstrap";
import axios from 'axios';
import CheckboxCard from '../components/CheckBoxCard';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { testTypeOptions } from '../components/Search';

const CAMERA_DIMENSION = 500;
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getImageOutline = (testType) => {
  if (testType === "abbott") {
    return "/images/abbott/transparent-full-outline-dotted.png"
  }
  if (testType === "ihealth") {
    return "/images/ihealth/transparent-outline-dotted.png"
  }
  if (testType === "flowflex") {
    return "/images/flowflex/transparent-outline-dotted.png"
  }
}

const Labeling = () => {
  const [imageData, setImageData] = useState(null);
  const [testType, setTestType] = useState("abbott");
  const [label, setLabel] = useState(null);
  const [quality, setQuality] = useState(null);
  const webcamRef = useRef(null);

  const requiredQuestionsAnswered = !!(quality && label && testType);

  const saveLabel = async (image) => {
    if (requiredQuestionsAnswered) {
      const body = {
        metadata: {
          quality,
          label,
          testType,
        },
        image,
      }
      try {
        axios.post("/api/inference/create", body).then((r) => {
          toast.success('Success')
        })
        setImageData(null);
      } catch(error) {
        alert("Something went wrong!");
      }
    } else {
      setImageData(image);
    }
  };

  const capture = useCallback(async () => {
      const newImageData = webcamRef.current.getScreenshot();
      saveLabel(newImageData);
    }, [webcamRef]
  );

  const uploadFile = async (e) => {
    const image = e.target.files[0];
    const newImageData = await toBase64(image)
    setImageData(newImageData);
  }
  return (
    <Container style={{maxWidth: "560px"}} className="py-4 px-4" id="self-checkout">
      <h4 className="my-3">Select the test type</h4>
      <Select
        value={testTypeOptions.find(option => option.value == testType)}
        onChange={(e) => setTestType(e.value)}
        options={testTypeOptions}
      />
      <div>
        <h4 className="my-3">Select the result</h4>
        {[['positive', '#e74c3c'], ['negative', '#27ae60'], ['inconclusive', '#f39c12']].map(c => {
          const value = c[0];
          const color = c[1];
          return <CheckboxCard
            name={value}
            label={capitalizeFirstLetter(value)}
            radio
            onChange={() => {
              setLabel(value)
            }}
            checked={label === value}
            style={{color: color, fontWeight: "bold"}}
          />
        })}
        <h4 className="my-3">Select the image quality</h4>
        {[['good', '#27ae60'], ['bad', '#e74c3c']].map(c => {
          const value = c[0];
          const color = c[1];
          return <CheckboxCard
            name={value}
            label={capitalizeFirstLetter(value)}
            radio
            onChange={() => {
              setQuality(value)
            }}
            checked={quality === value}
            style={{color: color, fontWeight: "bold"}}
          />
        })}
      </div>
      <div className="pb-3">
        <h3 className="my-5">Hold the test in front of the camera</h3>
        {!imageData && (
          <div className="mb-4" style={{width: "max-content"}}>
            <div className="camera-wrapper">
              <div className="camera-image-overlay">
                <img src={getImageOutline(testType)} />
              </div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: CAMERA_DIMENSION,
                  height: CAMERA_DIMENSION,
                  facingMode: "environment"
                }}
                style={{ cursor: "pointer" }}
              />
              <div className="clearfix"></div>
            </div>
            <Button
              className="btn-block w-100"
              onClick={() => {
                capture();
              }}
            >
              Capture
            </Button>
          </div>
        )}
        {!imageData && (
          <div>
            <div className="or-container">
              <div className="line-separator"></div>
              <div className="or-label">or</div>
              <div className="line-separator"></div>
            </div>
            <h3 className="my-5">Upload an image</h3>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={uploadFile} />
            </Form.Group>
          </div>
        )}
      </div>
      {imageData && (
        <div>
          <img src={imageData} />
          {requiredQuestionsAnswered && (
            <Button
              className="btn-block"
              onClick={() => {
                saveLabel(imageData);
              }}
            >
              Submit Label
            </Button>
          )}
          
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
  );
}

export default Labeling;
