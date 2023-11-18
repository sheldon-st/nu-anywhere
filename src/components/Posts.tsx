import { Link } from "react-router-dom";
import React from "react";
import { IListing } from "./ListingListItem";
import { ListingListItem } from "./ListingListItem";
import algoliasearch from "algoliasearch";
import { List } from "antd";
const client = algoliasearch("YourApplicationID", "YourWriteAPIKey");
const index = client.initIndex("your_index_name");

function Posts({ listings }: IListing[]) {
  return (
    <div>
      <h1>Posts</h1>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listings}
        bordered={false}
        grid={{ gutter: 16, column: 1 }}
        renderItem={(item: IListing) => (
          <List.Item key={item.uuid}>
            <Link to={`/blog/${item.uuid}`} style={{ border: "none" }}>
              <ListingListItem {...item} />
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Posts;
