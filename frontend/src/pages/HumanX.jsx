import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/HumanX.css";

const HumanX = () => {
  const [posts, setPosts] = useState([]);
  const [trustData, setTrustData] = useState({});
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("doubt");

  const [activePost, setActivePost] = useState(null);
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await API.get("humanx/posts/");
      setPosts(res.data);

      const uniqueUsers = [...new Set(res.data.map(p => p.user))];
      const trustObj = {};

      for (let uid of uniqueUsers) {
        const trustRes = await API.get(`humanx/trust/${uid}/`);
        trustObj[uid] = trustRes.data;
      }

      setTrustData(trustObj);

    } catch (err) {
      console.error(err);
    }
  };

  const createPost = async () => {
    if (!content.trim()) return;

    await API.post("humanx/posts/", {
      type: postType,
      content,
    });

    setContent("");
    setPostType("doubt");
    loadPosts();
  };

  const submitInteraction = async () => {
    const endpoint =
      mode === "help"
        ? `humanx/posts/${activePost.id}/help/`
        : `humanx/posts/${activePost.id}/collab/`;

    await API.post(endpoint, { message });

    setSent(true);
  };

  return (
    <div className="humanx-container">

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 25
      }}>
        <h2>HumanX</h2>

        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/inbox" className="action-chip">
            Inbox
          </Link>
          <Link to="/sessions" className="action-chip">
            Sessions
          </Link>
        </div>
      </div>

      <div className="create-post glass">
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          <option value="doubt">Doubt</option>
          <option value="project">Project</option>
          <option value="career">Career</option>
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something meaningful..."
        />

        <button className="post-btn" onClick={createPost}>
          Post
        </button>
      </div>

      <div className="posts-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card glass">

            <div className="post-header">
      <Link to={`/profile/${post.user}`} className="username">
        @{post.username}
      </Link>


              {trustData[post.user] && (
                <span className="trust-badge">
                  Trust: {trustData[post.user].trust_score}
                </span>
              )}
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-actions">
              {post.type === "doubt" && (
                <button
                  className="action-chip"
                  onClick={() => {
                    setActivePost(post);
                    setMode("help");
                    setSent(false);
                  }}
                >
                  I can help
                </button>
              )}

              {post.type === "project" && (
                <button
                  className="action-chip collab"
                  onClick={() => {
                    setActivePost(post);
                    setMode("collab");
                    setSent(false);
                  }}
                >
                  Request to collab
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {activePost && (
        <div className="modal-backdrop">
          <div className="modal glass">

            {!sent ? (
              <>
                <h3>{mode === "help" ? "Offer Help" : "Request Collaboration"}</h3>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className="modal-actions">
                  <button
                    className="ghost"
                    onClick={() => setActivePost(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="post-btn"
                    onClick={submitInteraction}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Sent ✔</h3>
                <button
                  className="post-btn"
                  onClick={() => setActivePost(null)}
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default HumanX;
