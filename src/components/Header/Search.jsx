import React, { useState, useEffect } from "react";
import { Dropdown, Button, Form } from "react-bootstrap";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// We need to make a function that fetches all categories from the database
import { fetchAllCategories } from "../../api/index";

// This is the search bar component. It should have a field for users to search for products, categories to click on to further filter searches, and a voice search button for customers who may have a hard time typing.
export const Search = ({ setIsLoading, setSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All products");
  const [isListening, setIsListening] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await fetchAllCategories();
        setCategoryList(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const results = await fetchQueryResults({
        category: selectedCategory,
        searchTerm: searchTerm,
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Stop listening
      recognition.start();
    } else {
      // Start listening
      recognition.stop();
    }
  };

  const recognition = new window.webkitSpeechRecognition(); // Initialize the SpeechRecognition object

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    setSearchTerm(transcript);
  };

  return (
    <div className="search-bar-container">
      <Form
        inline="true"
        className="search-bar-container"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <Dropdown>
          <Dropdown.Toggle id="category-dropdown">
            {selectedCategory}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedCategory("All products")}>
              All products
            </Dropdown.Item>
            {categoryList.map((category) => (
              <Dropdown.Item
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Dropdown.Item>
            ))}
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
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="secondary" onClick={handleVoiceSearch}>
          <FontAwesomeIcon icon={faMicrophone} />
        </Button>
      </Form>
    </div>
  );
};
