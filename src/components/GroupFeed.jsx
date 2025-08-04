import React, { useState } from 'react';

const GroupFeed = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handlePost = () => {
    if (!text && !file) return;

    const newPost = {
      id: Date.now(),
      text,
      file,
      likes: 0,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setText('');
    setFile(null);
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleComment = (id, commentText) => {
    if (!commentText) return;
    setPosts(posts.map(p => p.id === id ? { ...p, comments: [...p.comments, commentText] } : p));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 italic">
        The Best part of your life is making Memories
      </h2>
      <h2>📝 Share Memories</h2>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <button onClick={handlePost} style={{ marginTop: '10px', padding: '8px 16px' }}>
        🚀 Post
      </button>

      <div style={{ marginTop: '30px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
            <p>{post.text}</p>
            {post.file && (
              <>
                {post.file.type.startsWith('image') && (
                  <img
                    src={URL.createObjectURL(post.file)}
                    alt="Uploaded"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                )}
                {post.file.type.startsWith('video') && (
                  <video controls style={{ maxWidth: '100%', maxHeight: '300px' }}>
                    <source src={URL.createObjectURL(post.file)} />
                  </video>
                )}
              </>
            )}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
              <div style={{ marginTop: '10px' }}>
                <strong>💬 Comments:</strong>
                <ul>
                  {post.comments.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(post.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupFeed;
