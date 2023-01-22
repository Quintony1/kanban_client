import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

// connect to the socket server
const socket = io.connect(`${process.env.REACT_APP_API_URL}`);
const Comments = () => {
  const { category, id } = useParams();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  // fetch the comments when the page is loaded to the browser.
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${category}/${id}`).then((res) =>
      res.json().then((data) => setTitle(data.title))
    );
    socket.emit("task:fetchComments", { category, id });
  }, [category, id]);

  // Listens to the comments event
  useEffect(() => {
    socket.on("task:updateComments", (data) => setCommentList(data));
  }, []);

  const addComment = (e) => {
    e.preventDefault();
    // sends the comment, the task category, item's id and the userID.
    socket.emit("task:addComment", {
      comment: comment.trim(),
      category,
      id,
      userId: localStorage.getItem("userId"),
    });
    setComment("");
  };

  return (
    <div className="comments__container">
      <Nav showBackButton>{title}</Nav>
      <main>
        <form className="comment__form" onSubmit={addComment}>
          <label htmlFor="comment">Add a comment</label>
          <textarea
            placeholder="Type your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            id="comment"
            name="comment"
            required
          ></textarea>
          <button className="commentBtn">ADD COMMENT</button>
        </form>
        <div className="comments__section">
          <h2>Existing Comments</h2>
          {commentList.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </main>
    </div>
  );
};

const Comment = ({ comment }) => {
  // renders a beautiful comment box for each comment containing the comment and the user's name
  return (
    <div className="comment__box">
      <p className="comment__text">
        {comment.text.split("\n").map((text) => (
          <span>
            {text}
            <br />
          </span>
        ))}
      </p>
      <span className="comment__user">{comment.name}</span>
    </div>
  );
};

export default Comments;
