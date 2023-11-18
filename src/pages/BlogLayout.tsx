import { Outlet } from "react-router-dom";

import BlogActions from "../components/BlogActions";
import React from "react";
function BlogLayout() {
  return (
    <>
      <BlogActions />
      <Outlet />
    </>
  );
}

export default BlogLayout;
