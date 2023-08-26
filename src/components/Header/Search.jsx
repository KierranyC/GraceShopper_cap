import React, { useState } from "react";
import { Dropdown, Button, Form } from "react-bootstrap";

// This is the search bar component. It should have a field for users to search for products, categories to click on to further filter searches, and a voice search button for customers who may have a hard time typing.
export const Search = ({ onSearch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All products");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = async (category, search) => {
    try {
      const filteredProducts = await getProductsByCategoryAndSearch({
        category,
        searchTerm: search,
      });
      setFilteredProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  return (
    <div className="search-bar-container">
      <Form inline="true" className="search-bar-container">
        <Dropdown>
          <Dropdown.Toggle id="category-dropdown">
            {selectedCategory}
          </Dropdown.Toggle>
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
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>
    </div>
  );
};
