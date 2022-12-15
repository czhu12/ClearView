import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Header from "../../src/components/Header";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from "axios";

export default function Data() {
  const { query, isReady } = useRouter();


  const [isAuthenticated, setAuthentication] = useState(false);

  const checkAuthentication = () => {
    if (query.password) {
      axios.post("/api/utah/authenticate", { password: query.password }).
        then(_ => setAuthentication(true)).
        catch(_ => alert("Not authorized"))
    }
  }

  const downloadData = async () => {
    const res = await axios.post("/api/utah/download", {password: query.password}),
          items = res.data.items,
          replacer = (_, value) => value === null ? '' : value,
          header = Object.keys(items[0]),
          csv = [
                  "number_one,tag,number_three,id,number_two,number_four,number_five",
                  ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
                ].join('\r\n'),
          blob = new Blob([csv], { type: 'text/csv' }),
          url = window.URL.createObjectURL(blob),
          a = document.createElement('a'),
          today = new Date().toLocaleDateString('en-US').split("/").join("-");

    a.setAttribute('href', url)
    a.setAttribute('download', `utah_data_${today}.csv`);
    a.click()
  }

  useEffect(checkAuthentication, [isReady]);

  return (
    <div>
      <Header />
      <Container style={{maxWidth: "560px"}}>
        <div className="text-center">
          <div className="display-4">Download CSV</div>

          {isAuthenticated ? (
            <Button onClick={downloadData}>Download CSV</Button>
          ) : <div className="text-danger">Unauthorized</div>}
        </div>
      </Container>
    </div>
  );
}