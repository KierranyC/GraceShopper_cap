import React, { useState } from "react";
import { Dropdown, Button, Form } from "react-bootstrap";

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="search-bar-container">
      <Form inline className="search-bar-container">
        <Dropdown>
          <Dropdown.Toggle id="category-dropdown">Category</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Category 1</Dropdown.Item>
            <Dropdown.Item>Category 2</Dropdown.Item>
            <Dropdown.Item>Category 3</Dropdown.Item>
            <Dropdown.Item>And so on...</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="mr-sm-2"
        />
        {/* <Button className="mr-2" onClick={handleVoiceSearch}>
        <FaSearch />
      </Button> */}
        <Button variant="primary">Search</Button>
      </Form>
    </div>
  );
};

export default Search;
