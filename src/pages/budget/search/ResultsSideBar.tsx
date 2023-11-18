import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Radio,
  Divider,
  Select,
  theme,
  Space,
} from "antd";

type LayoutType = Parameters<typeof Form>[0]["layout"];

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { baCodes, agencies } from "../../../types";

const getFormState = (searchParams: URLSearchParams) => {
  const keywords = searchParams.getAll("keywords") || [];
  const agency_code = searchParams.getAll("agency_code") || [];
  const budget_activity = searchParams.getAll("budget_activity") || [];

  return {
    keywords,
    agency_code,
    budget_activity,
  };
};

const FilterControls: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  //const history = useHistory();
  const location = useLocation();

  // Create a state to check if the search params have changed
  const [searchTermsChanged, setSearchTermsChanged] = useState(false);

  // Check if the search params have changed
  const formUpdated = () => {
    const formState = getFormState(searchParams);
    const formValues = form.getFieldsValue();

    console.log(formState);
    console.log(formValues);

    // check if the form values are different from the search params
    const formValuesChanged = Object.keys(formState).some(
      (key) =>
        JSON.stringify(formState[key]) !== JSON.stringify(formValues[key])
    );

    setSearchTermsChanged(formValuesChanged);

    console.log(searchTermsChanged);
  };

  //get the search params from the url
  console.log(searchParams.toString());

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // Initial search params
  useEffect(() => {
    form.setFieldValue("keywords", searchParams.getAll("keywords") || []);
    form.setFieldValue("agency_code", searchParams.getAll("agency_code") || []);
    form.setFieldValue(
      "budget_activity",
      searchParams.getAll("budget_activity") || []
    );
  }, []);

  const onFinish = (values: any) => {
    console.log("Searching");
    console.log(values);
    // set the search params unless the value is undefined
    const formState = form.getFieldsValue();

    // setSearchParams to form values unless they are undefined
    setSearchParams({
      keywords: (formState.keywords !== undefined && formState.keywords) || [],
      agency_code:
        (formState.agency_code !== undefined && formState.agency_code) || [],
      budget_activity:
        (formState.budget_activity !== undefined &&
          formState.budget_activity) ||
        [],
    });
    // navigate to the search results
    //navigate(`/budget/search/${searchParams.toString()}`);
  };

  return (
    <Form
      layout={"vertical"}
      form={form}
      style={{ width: "100%", gap: "8px", padding: "8px" }}
      onFinish={onFinish}
    >
      <Form.Item label="Keywords" style={{ width: "100%" }} name={"keywords"}>
        <Select
          placeholder="Search by keyword"
          mode="tags"
          style={{ width: "100%", textAlign: "left" }}
          tokenSeparators={[","]}
          popupMatchSelectWidth={false}
          onChange={formUpdated}
          // defaultValue={searchParams.getAll("keywords") || []}
        />
      </Form.Item>
      <Divider />
      <Form.Item label="Funding Agency" name={"agency_code"}>
        <Select
          placeholder="Funding Agency"
          style={{ width: "100%", textAlign: "left" }}
          onChange={formUpdated}
          // defaultValue={searchParams.getAll("agency_code") || []}
          options={agencies.map((agency) => ({
            value: agency.value,
            label: agency.label,
          }))}
          filterOption={filterOption}
          showSearch
          mode="multiple"
          popupMatchSelectWidth={false}
          
        />
      </Form.Item>
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
          popupMatchSelectWidth={false}
          onChange={formUpdated}
        />
      </Form.Item>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* <NavLink to={`/budget/search/${searchParams.toString()}`}> */}
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!searchTermsChanged}
        >
          Search
        </Button>
        {/* </NavLink> */}
        <Button
          block
          onClick={() => {
            form.resetFields();
            setSearchParams({});
            setSearchTermsChanged(false);
          }}
        >
          Clear
        </Button>
      </Space>
    </Form>
  );
};

export default FilterControls;
