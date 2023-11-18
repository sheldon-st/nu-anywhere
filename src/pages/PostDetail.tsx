import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { getPost } from "../api/posts";

import Listing from "../components/BlogPost";
import { IListing } from "../components/ListingListItem";
function PostDetailPage() {
  const [error, setError] = useState<any>();
  const [post, setPost] = useState<IListing>();
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      try {
        console.log(params);
        console.log("uuid: " + id);
        const post = await getPost(id!);
        setPost(post);
      } catch (err: any) {
        setError(err.message);
      }
      setIsLoading(false);
    }

    loadPost();
  }, [id]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!error && post && <Listing {...post} />}
    </div>
  );
}

export default PostDetailPage;
