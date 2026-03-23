import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/comments.css";

function Comments() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const post = state?.post;

  const [reply, setReply] = useState("");
  const [comments, setComments] = useState([
    "Start with easy problems and stay consistent.",
    "React is enough if you build real projects.",
  ]);

  if (!post) {
    return (
      <div className="comments-page">
        <p>Post not found</p>
        <button onClick={() => navigate("/humanx")}>Go back</button>
      </div>
    );
  }

  return (
    <div className="comments-page">

      <header className="comments-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h3>Replies</h3>
      </header>

      {/* Original Post */}
      <div className="post-card">
        <p className="username">{post.user}</p>
        <span className={`post-type ${post.type}`}>
          {post.type.toUpperCase()}
        </span>
        <p className="post-content">{post.content}</p>
      </div>

      {/* Replies */}
      <div className="comments-list">
        {comments.map((c, i) => (
          <div key={i} className="comment">
            <span>👤</span>
            <p>{c}</p>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div className="reply-box">
        <input
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button
          onClick={() => {
            if (!reply.trim()) return;
            setComments([...comments, reply]);
            setReply("");
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default Comments;
