import axios from 'axios';
import './App.css';
import './ToDoList.css';
import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function ToDoList() {
    const [tasks, setTasks] = useState([]); // Store all tasks (initial + fetched)
    const [newTask, setNewTask] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const pageSize = 20005;

    // Load tasks on initial render
    useEffect(() => {
        loadMoreTasks(0); // Load the first 50 tasks on page load
    }, []);

    // Load more tasks function (pagination logic)
    const loadMoreTasks = useCallback(async (currentPage) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5001/tasks?start=${currentPage * pageSize}&limit=${pageSize}`);
            if (response.data.length === 0) {
                setHasMore(false); // Stop loading if no more data
            } else {
                setTasks((prevTasks) => [...prevTasks, ...response.data]); // Append new tasks to existing ones
                setPage(currentPage + 1); // Increment page for next load
            }
        } catch (error) {
            console.error('Error loading more tasks:', error);
        }
        setIsLoading(false);
    }, [isLoading, hasMore, page]);

    // Filter tasks based on search term
    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isItemLoaded = (index) => index < filteredTasks.length;

    // Trigger load when reaching the bottom
    const loadMoreItems = async () => {
        if (!isLoading && hasMore) {
            await loadMoreTasks(page);
        }
    };

    // Handle new task input
    const handleInputChange = (e) => setNewTask(e.target.value);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    // Add new task
    const addTask = async () => {
        if (newTask.trim()) {
            try {
                const response = await axios.post('http://localhost:5001/tasks', { text: newTask });
                setTasks((prevTasks) => [response.data, ...prevTasks]);
                setNewTask('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/tasks/${id}`);
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Move task up
    const moveTaskUp = async (index) => {
        if (index > 0) {
            try {
                const response = await axios.put('http://localhost:5001/tasks/reorder', {
                    sourceIndex: index,
                    destinationIndex: index - 1,
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error moving task up:', error);
            }
        }
    };

    // Move task down
    const moveTaskDown = async (index) => {
        if (index < tasks.length - 1) {
            try {
                const response = await axios.put('http://localhost:5001/tasks/reorder', {
                    sourceIndex: index,
                    destinationIndex: index + 1,
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error moving task down:', error);
            }
        }
    };

    return (
        <div className="to-do-list">
            <h1>To-Do List</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />

            {/* Task input */}
            <div>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                    className="task-input"
                />
                <button onClick={addTask} className="add-button">
                    Add
                </button>
            </div>

            {/* Infinite Scrolling */}
            <InfiniteLoader
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
                                    <div className="task-buttons">
                                        <button onClick={() => deleteTask(task._id)} className="delete-button">
                                            Delete
                                        </button>
                                        <button onClick={() => moveTaskUp(index)} className="move-button">
                                            ▲
                                        </button>
                                        <button onClick={() => moveTaskDown(index)} className="move-button">
                                            ▼
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    </FixedSizeList>
                )}
            </InfiniteLoader>

            {isLoading && <p className="loading-text">Loading more tasks...</p>}
        </div>
    );
}

export default ToDoList;
