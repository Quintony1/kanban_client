import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TasksContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});

  // fetching tasking before component mount
  useEffect(() => {
    function fetchTasks() {
      fetch(`${process.env.REACT_APP_API_URL}/api`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTasks(data);
        });
    }
    fetchTasks();
  }, []);

  // Create a listener for the tasks:update event
  useEffect(() => {
    socket.on("task:update", (data) => setTasks(data));
  }, [socket]);

  // this function is the value of the onDragEnd prop
  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return; // when not within draggable area
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;
    // sending a message to the Node.js server via Socket.io
    if (socket.connected) {
      socket.emit("task:dragged", {
        source,
        destination,
      });
    }
  };

  const onDeleteAction = (item,task) => {
    socket.emit("task:deleteTask", {
      id: item.id,
      category: task[1].title,
    });
  }

  return (
    <div className="container">
      {/* dragdropcontext and firing the onDragEnd event once dragged ends */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map((task) => (
          <div
            className={`${task[1].title.toLowerCase()}__wrapper`}
            key={task[1].title}
          >
            <h3>{task[1].title} Tasks</h3>
            <div className={`${task[1].title.toLowerCase()}__container`}>
              {/* here is the Droppable */}
              <Droppable droppableId={task[1].title}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {task[1].items.map((item, index) => (
                      // here is the draggable context
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${task[1].title.toLowerCase()}__items`}
                            key={item.id}
                          >
                            <p>{item.title}</p>
                            <div className="item__actions">
                              <span className="comment button">
                                <Link
                                  to={`/comments/${task[1].title}/${item.id}`}
                                >
                                  {item.comments.length > 0
                                    ? `View Comments`
                                    : "Add Comment"}
                                </Link>
                              </span>
                              <button
                                className="delete button"
                                onClick={() => onDeleteAction(item, task)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* adding a placeholder */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default TasksContainer;
