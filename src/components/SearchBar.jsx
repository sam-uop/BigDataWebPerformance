import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import axios from 'axios';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get("https://releasetrain.io/api/c/names");
        const options = response.data.map((name) => ({ label: name, value: name }));
        setDropdownOptions(options);
      } catch (error) {
        console.error("Failed to fetch dropdown names", error);
      }
    };
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setSearchTerm(selectedOptions.map(opt => opt.value).join(", "));
    } else {
      setSearchTerm(""); // Clear when no dropdown items are selected
    }
  }, [selectedOptions]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <Select
        multi
        searchable
        options={dropdownOptions}
        onChange={setSelectedOptions}
        placeholder="Search or select a version name..."
        values={selectedOptions}
        style={{
          width: '100%',
        }}
      />
    </div>
  );
};

export default SearchBar;
