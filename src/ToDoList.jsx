import axios from "axios";
import "./App.css";
import "./ToDoList.css";
import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import Select from "react-dropdown-select";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const pageSize = 1000;

  // Load tasks function
  const loadMoreTasks = async (currentPage) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://releasetrain.io/api/c/names?start=${currentPage * pageSize}&limit=${pageSize}`
      );

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        const newTasks = response.data.map((item) => ({
          text: item,
          id: item,
        }));

        const uniqueTasks = [
          ...new Map(
            [...tasks, ...newTasks].map((task) => [task.id, task])
          ).values(),
        ];

        setTasks(uniqueTasks);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error loading more tasks:", error);
    }
    setIsLoading(false);
  };

  // Fetch dropdown options once
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get("https://releasetrain.io/api/c/names");
        const options = response.data.map((name) => ({
          label: name,
          value: name,
        }));
        setDropdownOptions(options);
      } catch (error) {
        console.error("Failed to fetch dropdown names", error);
      }
    };

    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    loadMoreTasks(0);
  }, []);

  // Filter on both input and dropdown
  useEffect(() => {
    const textFiltered = tasks.filter((task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedOptions.length > 0) {
      const selectedFiltered = textFiltered.filter((task) =>
        selectedOptions.some((opt) =>
          task.text.toLowerCase().includes(opt.value.toLowerCase())
        )
      );
      setFilteredTasks(selectedFiltered);
    } else {
      setFilteredTasks(textFiltered);
    }
  }, [searchTerm, selectedOptions, tasks]);

  const loadMoreItems = async () => {
    if (!isLoading && hasMore) {
      await loadMoreTasks(page);
    }
  };

  const isItemLoaded = (index) => index < filteredTasks.length;

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      {/* Dropdown Search */}
      <Select
        multi
        options={dropdownOptions}
        onChange={(values) => setSelectedOptions(values)}
        placeholder="Search using dropdown..."
        values={selectedOptions}
      />
      

      {/* Input Search
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      /> */}

      {/* Infinite Scrolling */}
      {/* <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={hasMore ? filteredTasks.length + 1 : filteredTasks.length}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            height={600}
            width="100%"
            itemSize={60}
            itemCount={filteredTasks.length}
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {({ index, style }) => {
              const task = filteredTasks[index];
              return (
                <div style={style} className="task-item">
                  <span>{task.text}</span>
                </div>
              );
            }}
          </FixedSizeList>
        )}
      </InfiniteLoader> */}

      {isLoading && <p className="loading-text">Loading more tasks...</p>}
    </div>
  );
}

export default ToDoList;
