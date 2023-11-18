import React, { useEffect, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  theme,
  Alert,
  Typography,
  Segmented,
} from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { DocumentTopics } from "../../types/federalRegistry.ts/topics";
import { useSearchParams, useNavigate } from "react-router-dom";

function DocumentSearch() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <h1>Document Search</h1>
      <p>Search for documents</p>
      <Form form={form} style={formStyle} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="topics" label="Topics">
              <Select
                mode="multiple"
                allowClear
                placeholder="Select topics"
                filterOption={filterOption}
                options={Object.keys(DocumentTopics).map((topic) => ({
                  label: DocumentTopics[topic],
                  value: topic,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default DocumentSearch;