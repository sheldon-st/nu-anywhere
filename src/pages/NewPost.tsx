import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../api/posts";
import { IListing } from "../components/ListingListItem";
import NewPostForm from "../components/NewPostForm";
import React from "react";

// generate uuid

function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<any>();
  const navigate = useNavigate();

  // create a new entry in the supabase 'listings' table with the form data
  async function submitHandler(listing: IListing) {
    console.log("submitHandler");
    setIsSubmitting(true);
    try {
      await createListing({
        uuid: Math.random().toString(36).substring(2, 15),
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        //contact: listing.contact,
        //image: listing.image,
        startDate: listing.startDate,
        endDate: listing.endDate,
        _geoloc: listing._geoloc,
      });
      //  navigate("/blog");
    } catch (err: any) {
      setError(err.message);
    }
    setIsSubmitting(false);
  }

  function cancelHandler() {
    navigate("/blog");
  }

  return (
    <div>
      <h1>New Post</h1>
      <NewPostForm
        onSubmit={submitHandler}
        onCancel={cancelHandler}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}

export default NewPostPage;
