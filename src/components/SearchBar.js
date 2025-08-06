import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <InputGroup className="mb-4">
      <Form.Control type="text" placeholder="Search for stocks" />
      <InputGroup.Text><FaSearch /></InputGroup.Text>
    </InputGroup>
  );
}
