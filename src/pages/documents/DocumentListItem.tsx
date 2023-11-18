import React, { useState, FC } from "react";

import { Card, Descriptions, Tag, Space, Typography, List } from "antd";

import { NavLink } from "react-router-dom";

import { IDocument } from "../../types/federalRegistry.ts/document";

export const DocumentListItem: FC<{ document: IDocument }> = ({ document }) => {
  const [loading, setLoading] = useState<boolean>(false);
  console.log(document);

  return (
    /*  <NavLink
      to={`/documents/${document.document_number}`}
      //style={{ marginBottom: "24px" }}
    > */
    <List.Item
      /* title={
          <Space
            direction="horizontal"
            style={{ justifyContent: "space-between", display: "flex" }}
          >
            <Typography.Text>{document.title}</Typography.Text>
            <Typography.Text>
              Published{" "}
              {new Date(document.publication_date).toLocaleDateString()}
            </Typography.Text>
          </Space>
        } */
      //title={document.title}
      key={document.document_number}
      // size="small"
      // hoverable
      style={{ textAlign: "left" }}
    >
      <List.Item.Meta
        title={
          <Space
            direction="horizontal"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <NavLink to={`/fr/document/${document.document_number}`}>
              <Typography.Link>{document.title}</Typography.Link>
            </NavLink>
            <Typography.Text>
              {new Date(document.publication_date).toLocaleDateString()}
            </Typography.Text>
          </Space>
        }
        description={document.abstract}
      />
      <Descriptions size="small" layout="horizontal" column={1}>
        {/* <Descriptions.Item>{document.abstract}</Descriptions.Item> */}
        {document.topics && (
          <Descriptions.Item label="Topics">
            <List
              dataSource={document.topics}
              renderItem={(topic) => <Tag>{topic}</Tag>}
            />
          </Descriptions.Item>
        )}
        {document.agencies && (
          <Descriptions.Item label="Agencies">
            <List
              dataSource={document.agencies}
              renderItem={(agency) => (
                <Tag>
                  <NavLink
                    to={`/fr/agency/${(agency.url as string).split("/").pop()}`}
                  >
                    {agency.name}
                  </NavLink>
                </Tag>
              )}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </List.Item>
    // </NavLink>
  );
};
