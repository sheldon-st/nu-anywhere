import { Link } from 'react-router-dom';
import React from 'react';

function BlogActions() {
  return (
    <div>
      <h1>Blog Actions</h1>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/posts/create">Create Post</Link>
        </li>
      </ul>
    </div>
  );
}

export default BlogActions;
