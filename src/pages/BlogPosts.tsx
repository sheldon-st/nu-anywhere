import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import React from "react";
import Posts from "../components/Posts";
import { Spin } from "antd";
import { IListing } from "../components/ListingListItem";
function BlogPostsPage() {
  const [error, setError] = useState();
  const [posts, setPosts] = useState<IListing[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (err: any) {
        setError(err.message);
      }
      setIsLoading(false);
    }

    loadPosts();
  }, []);

  return (
    <div>
      {isLoading && <Spin size="large" />}
      {error && <p>{error}</p>}
      {!error && posts && <Posts listings={posts} />}
    </div>
  );
}

export default BlogPostsPage;
