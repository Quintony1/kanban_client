import React from "react";
import AddTask from "./AddTask";
import TasksContainer from "./TasksContainer";
import Nav from "./Nav";
import { io } from "socket.io-client";

/* Pass Socket.io into the required components
 * where communications are made with the server
 */
const socket = io(`${process.env.REACT_APP_API_URL}`);
const Task = () => {
  return (
    <div className="page__container">
      <Nav>ALX Team's Kanban Board</Nav>
      <main>
        <AddTask socket={socket} />
        <TasksContainer socket={socket} />
      </main>
    </div>
  );
};

export default Task;
