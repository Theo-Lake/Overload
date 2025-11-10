"use client";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md" sticky="top">
      <Container>
        <img
          src="/LU - Logo - Reversed _Mono_.png"
          width="150"
          height="150"
          className="d-inline-block align-top"
          alt="LancLogo"
        />
        <Nav className="ms-auto">
          <Nav.Link href="/">Scheduler</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
//TODO: Add name and course dynamically. With a Login (and create a DB)
