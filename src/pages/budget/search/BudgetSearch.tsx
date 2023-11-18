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
import { useSearchParams, useNavigate } from "react-router-dom";
import { baCodes, agencies } from "../../../types";
const { Option } = Select;

interface ProgramElement {
  pe_number: string;
  pe_title: string;
  description: string;
  appropration_type: string;
  budget_activity: string;
  agency_code: string;
  content: string;
}

function BudgetSearch() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  //const history = useHistory();
  const location = useLocation();
  let navigate = useNavigate();

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

  // Initial search params
  useEffect(() => {}, []);

  const advancedSearch = () => {
    const children: React.ReactNode[] = [];

    children.push(
      <>
        <Form.Item
          label="Search Specificity"
          style={{ width: "100%" }}
          name={"search_level"}
        >
          <Segmented
            options={[
              {
                label: "Program Element",
                value: "program",
              },
              {
                label: "Project",
                value: "project",
                disabled: true,
                title: "Coming soon",
              },
            ]}
            block
          />
          {/* Hint with info about levels of specificity */}
          <Typography.Text
            type="secondary"
            style={{ padding: 8, justifyContent: "left", textAlign: "left" }}
          >
            Searching at the PE level returns a higher-order view of the program
            elements matching specified criteria. Searching project level will
            return a more granular view of sub-projects but may include
            incomplete data.
          </Typography.Text>
        </Form.Item>
      </>
    );

    return children;
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    console.log(form.getFieldsValue());
    const formState = form.getFieldsValue();

    // if value present for a field, add to search params then navigate
    setSearchParams({
      keywords: formState.keywords || [],
      agency_code: formState.agency_code || [],
      budget_activity: formState.budget_activity || [],
    });

    console.log(searchParams.toString());

    // navigate(`/budget/search?${searchParams.toString()}`);
  };
  // console.log(searchParams.toString());
  //navigate(`/budget/search?${searchParams.toString()}`);

  // if search params change, navigate to new search but not on initial render
  useEffect(
    () => {
      if (searchParams.toString() !== "") {
        navigate(`/budget/search?${searchParams.toString()}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row>
        {" "}
        {/* Full width segmented control to switch between searching at program level or project level of granularity */}
        <Form.Item label="Keywords" style={{ width: "100%" }} name={"keywords"}>
          <Select
            placeholder="Comma separated list of keywords"
            mode="tags"
            style={{ width: "100%", textAlign: "left" }}
            tokenSeparators={[","]}
            // defaultValue={searchParams.getAll("keywords") || []}
            notFoundContent={
              <Typography.Text type="secondary" style={{ padding: 8 }}>
                Login to save commonly used keywords
              </Typography.Text>
            }
          />
        </Form.Item>
      </Row>
      <Row gutter={24} key={1}>
        <Col span={8} key={1}>
          <Form.Item label="Funding Agency" name={"agency_code"}>
            <Select
              placeholder="Funding Agency"
              style={{ width: "100%", textAlign: "left" }}
              // defaultValue={searchParams.getAll("agency_code") || []}
              options={agencies.map((agency) => ({
                value: agency.value,
                label: agency.label,
              }))}
              filterOption={filterOption}
              showSearch
              mode="multiple"
            />
          </Form.Item>
        </Col>
        <Col span={8} key={1}>
          <Form.Item label="Budget Activity" name={"budget_activity"}>
            <Select
              placeholder="Budget Activity"
              style={{ width: "100%", textAlign: "left" }}
              // defaultValue={searchParams.getAll("budget_activity") || []}
              options={baCodes.map((ba) => ({
                value: ba.value,
                label: ba.label,
              }))}
              filterOption={filterOption}
              showSearch
              mode="multiple"
            />
          </Form.Item>
        </Col>
      </Row>
      {expand ? advancedSearch() : null}

      <Row style={{ justifyContent: "space-between", alignItems: "self-end" }}>
        <a
          style={{ fontSize: 12 }}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? <UpOutlined /> : <DownOutlined />} Additional Options
        </a>

        <Space>
          <Select
            placeholder="Dataset to search"
            //defaultValue={searchParams.get("content") || []}
            value={"FY2024"}
            options={[
              {
                value: "FY2024",
                label: "FY2024 Requests",
              },
            ]}
          />
          {/* <NavLink to={`/budget/search/${searchParams.toString()}`}> */}
          <Button type="primary" htmlType="submit" style={{ margin: "0 " }}>
            Search
          </Button>
          {/* </NavLink> */}
          <Button
            style={{ margin: "0 " }}
            onClick={() => {
              form.resetFields();
              setSearchParams({});
            }}
          >
            Clear
          </Button>
        </Space>
      </Row>
    </Form>
  );
}

export default BudgetSearch;
