import React from "react";

// This component acts as a subnav for the AllProducts page. It should display a list of clickable cateogries to filter the products displayed.
export const Sidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    onSelectCategory(selectedCategory);
  };

  return (
    <div className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li key="All">
          <label>
            <input
              type="radio"
              name="category"
              value="All"
              checked={selectedCategory === "All"}
              onChange={handleCategoryChange}
            />
            All
          </label>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <label>
              <input
                type="radio"
                name="category"
                value={category.name}
                checked={selectedCategory === category.name}
                onChange={handleCategoryChange}
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
