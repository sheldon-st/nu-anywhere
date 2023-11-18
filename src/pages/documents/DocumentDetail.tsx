import React, {
  useState,
  FC,
  useEffect,
  Component,
  IframeHTMLAttributes,
} from "react";

import {
  Card,
  Descriptions,
  Tag,
  Typography,
  List,
  Layout,
  theme,
  Space,
  Breadcrumb,
  Tree,
  TreeDataNode,
  TreeProps,
  TreeNodeProps,
  FloatButton,
  Popover,
} from "antd";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  QuestionCircleOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  FlagOutlined,
} from "@ant-design/icons";

import { IDocument } from "../../types/federalRegistry.ts/document";
import { useParams } from "react-router-dom";
import { getDocument } from "../../api/documents";
import { key } from "localforage";
const { Header, Content, Sider } = Layout;
import jsonp from "jsonp";

const getClassName = (level) => {
  switch (level) {
    case 2:
      return "head2";
    case 3:
      return "head3";
    case 4:
      return "head4";
    default:
      return null;
  }
};

export const DocumentDetail: FC = () => {
  const [document, setDocument] = useState<IDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const { documentId } = useParams();
  const [toc, setToc] = useState<TreeDataNode[]>([]);

  const {
    token: { colorBgContainer, colorFillAlter },
  } = theme.useToken();

  if (!documentId) {
    return <p>Document Number not found</p>;
  }
  const [jsonData, setJsonData] = useState(null);

  const loadDocument = async () => {
    setLoading(true);
    const document = await getDocument(documentId);
    setDocument(document);
    setLoading(false);
    console.log(document);
  };

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadHtmlContent = async () => {
    // use ssp https://fropendata.azurewebsites.net/api/fetchDocument?url=... to ssp the html content

    const htmlContent = await axios.get(
      `https://fropendata.azurewebsites.net/api/fetchDocument?url=${document?.body_html_url}`
    );

    console.log(htmlContent);
    setHtmlContent(htmlContent.data);
  };

  // iterate through array of heading with level prop and generate a tree data structure
  const nestedTreeData = (data: TreeDataNode[]): TreeDataNode[] => {
    const treeData: TreeDataNode[] = [];
    // h1s are the top level nodes and h6 are the bottom level nodes
    // iterate through the array of toc elements and generate a tree data structure
    // where each item is nested if its level is greater than the previous item or treated as a sibling if its level is equal to the previous item\
    // if the level is less than the previous item then it is a sibling of the previous item
    const stack: TreeDataNode[] = [];
    const currentLevel = 1;
    let previousLevel = 1;
    let previousItem = null;

    data.forEach((item) => {
      if (item.level === 1) {
        treeData.push(item);
        previousItem = item;
        previousLevel = item.level;
        return;
      }
      const { level } = item;
      const treeItem = { ...item };
      if (level > previousLevel) {
        stack.push(previousItem);
        previousItem.children = [];
      } else if (level < previousLevel) {
        stack.pop();
      }
      if (stack.length > 0) {
        stack[stack.length - 1].children!.push(treeItem);
      } else {
        treeData.push(treeItem);
      }
      previousItem = treeItem;
      previousLevel = level;
    });
    return treeData;
  };

  // generate table of contents component to navigate through the document using the htmlContent
  // parse the html content for the h1, h2, h3, h4, h5, h6 tags and generate a table of contents that scrolls to the section of the document
  // the htmlContent is loaded into div with id full-text
  // create props for an antd tree component
  useEffect(() => {
    const elements = Array.from(
      window.document.querySelectorAll(
        "#full-text h1, #full-text h2, #full-text h3, #full-text h4, #full-text h5, #full-text h6"
      )
    ).map((element) => {
      const id = element.getAttribute("id");
      const text = element.textContent;
      const level = Number(element.tagName.replace("H", ""));
      key: id;
      return {
        key: id || "",
        title: text || "",
        id: id || "",
        level,
      };
    });
    setToc(nestedTreeData(elements));
    console.log(elements);
  }, [htmlContent]);

  useEffect(() => {
    if (document?.body_html_url) {
      loadHtmlContent();
    }
  }, [document]);

  if (!document) {
    return <p>Document not found</p>;
  }

  return (
    <Space direction="vertical" style={{ width: "100%", textAlign: "left" }}>
      <FloatButton.Group shape="square" style={{}}>
        <Popover
          content={
            <Space
              onMouseEnter={
                (e) => {
                  // disable body scrolling when popover is open using bind 'mousewheel touchmove', lockScroll
                  window.document.getElementById("full-text")?.addEventListener(
                    "mousewheel touchmove",
                    (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    },
                    { passive: false }
                  );
                }
                // set overscroll-behavior-y to contain
              }
              onMouseLeave={(e) => {
                // enable body scrolling when popover is closed using unbind 'mousewheel touchmove', lockScroll
                window.document
                  .getElementById("full-text")
                  ?.removeEventListener("mousewheel touchmove", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  });
              }}
            >
              <Tree
                treeData={toc}
                showLine
                defaultExpandAll
                onSelect={(selectedKeys, info) => {
                  console.log("selected", selectedKeys, info);
                  window.document
                    .getElementById(selectedKeys[0].toLocaleString())
                    ?.scrollIntoView();
                }}
                onCheck={(checkedKeys, info) => {
                  console.log("onCheck", checkedKeys, info);
                }}
                style={{
                  overflowY: "scroll",
                  width: "40vw",
                  maxHeight: "80vh",
                  overscrollBehaviorY: "contain",
                }}

                // prevent body from scrolling when popover is open
              />
            </Space>
          }
          trigger="click"
          placement="left"
        >
          <FloatButton
            icon={<UnorderedListOutlined />}
            tooltip="Table of Contents"
          />
        </Popover>
        <FloatButton icon={<FlagOutlined />} tooltip="Flag Document" />
        <FloatButton.BackTop visibilityHeight={0} tooltip="Back to Top" />
      </FloatButton.Group>
      <Breadcrumb style={{ margin: "0 0 8px 0" }}>
        <Breadcrumb.Item>
          <NavLink to="/fr/document">Documents</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{document.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Content
        style={{
          backgroundColor: colorFillAlter,
          padding: "24px",
        }}
      >
        <Card
          title={document.title}
          style={{ width: "100%" }}
          loading={loading}
          actions={[
            <NavLink to={`/fr/document/${document.document_number}`}>
              <QuestionCircleOutlined />
              About this Document
            </NavLink>,
            <NavLink to={`/fr/document/${document.document_number}`}>
              <SyncOutlined />
              Versions
            </NavLink>,
          ]}
        >
          <Descriptions size="small" layout="horizontal" column={1}>
            <Descriptions.Item label="Publication Date">
              {new Date(document.publication_date).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Abstract">
              {document.abstract}
            </Descriptions.Item>
            <Descriptions.Item label="Topics">
              <List
                dataSource={document.topics}
                renderItem={(topic) => <Tag>{topic}</Tag>}
              />
            </Descriptions.Item>
            {document.agencies && (
              <Descriptions.Item label="Agencies">
                <List
                  dataSource={document.agencies}
                  renderItem={(agency) => (
                    <Tag>
                      <NavLink
                        to={`/fr/agency/${(agency.url as string)
                          .split("/")
                          .pop()}`}
                        style={{ color: "inherit" }}
                      >
                        {agency.name}
                      </NavLink>
                    </Tag>
                  )}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
        {/* Style the html content */}

        <Typography.Title level={2}>Full Text</Typography.Title>
        <Card style={{ width: "100%" }}>
          <div
            id="full-text"
            style={{ width: "100%", textAlign: "left" }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        </Card>
      </Content>
    </Space>
  );
};
