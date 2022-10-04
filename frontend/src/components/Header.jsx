import { Container, Navbar, Nav } from "react-bootstrap";

export default function Header() {
  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Clear View</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="/">Labeling</Nav.Link>
            <Nav.Link href="/predict">Predict</Nav.Link>
            <Nav.Link href="/web/demo">Data</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}