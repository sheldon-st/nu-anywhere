import React, { useState, useEffect, FC } from "react";
import {
  Button,
  Input,
  Steps,
  Space,
  Form,
  Select,
  DatePicker,
  Typography,
  Tag,
  AutoComplete,
  Card,
  Descriptions,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { majors, interests } from "../../types";
import { Loader } from "@googlemaps/js-api-loader";
import posthog from "posthog-js";
import { useNavigate } from "react-router-dom";
import { GenericSinglePageForm } from "../profile/GenericSinglePageFormFIeld";
const { RangePicker } = DatePicker;
const { CheckableTag } = Tag;

export const CreateEvent: FC = ({}) => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null,
    location: "",
    organizer: "",
    attendees: [],
    visibility: "public",
    id: "",
    motivation: "",
  });

  const formItems = [
    "title",
    "description",
    "date",
    "location",
    "organizer",
    "attendees",
    "visibility",
    "id",
    "motivation",
  ];

  const [currentFormValid, setCurrentFormValid] = useState(false);

  const nextPage = () => {
    setPage((prev) => prev + 1);
    setCurrentFormValid(validateForm());
  };

  const validateForm = (currentPage = page) => {
    switch (currentPage) {
      default:
        return true;
    }
  };

  useEffect(() => {
    setCurrentFormValid(validateForm());
  }, [formData]);

  const handleRegistrationComplete = () => {
    setRegistrationComplete(true);
    console.log("registration complete");
  };

  const inputFieldStyle = {
    width: "100%",
    margin: "auto",
    textAlign: "left",
  };

  const conditionalRender = () => {
    switch (page) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: "50%" }}>
            <GenericSinglePageForm
              title="To start, give your event a name."
              description="This is what people will see when they browse events."
              formItems={
                <Input
                  autoFocus
                  id="name"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  style={inputFieldStyle}
                  placeholder="i.e. Thursday Night Trivia"
                />
              }
            />
          </Space>
        );
      case 1:
        return (
          <Space direction="vertical" style={{ width: "50%" }}>
            <GenericSinglePageForm
              title="Tell us a little bit about your event."
              description="This description helps people understand what your event is about."
              formItems={
                <Input.TextArea
                  id="description"
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={inputFieldStyle}
                  placeholder="i.e. Join us for a night of trivia!"
                />
              }
            />
          </Space>
        );
      case 2:
        return (
          <Space direction="vertical" size={12}>
            <Form.Item
              label="Attendees"
              name="attendees"
              rules={[{ required: true }]}
            >
              <Select mode="tags" />
            </Form.Item>
          </Space>
        );
      case 3:
        return (
          <Space direction="vertical" size={12}>
            <Form.Item
              label="Visibility"
              name="visibility"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="public">Public</Select.Option>
                <Select.Option value="private">Private</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="ID" name="id" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Motivation"
              name="motivation"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Space>
        );
      default:
        return null;
    }
  };

  return (
    <Space
      direction="vertical"
      size={12}
      style={{
        padding: 16,
      }}
    >
      <Steps current={page} size="small" onChange={(e) => setPage(e)}>
        <Steps.Step title="Event Details" />
        <Steps.Step title="Location" />
        <Steps.Step title="Attendees" />
        <Steps.Step title="Visibility" />
      </Steps>

      {conditionalRender()}
      {page !== -1 && page !== 5 && (
        <div>
          <Button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button onClick={nextPage} disabled={!validateForm()}>
            Next
          </Button>
        </div>
      )}

      {/* Display current form data: */}
      {/*  <div>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        <pre>{currentFormValid}</pre>
      </div> */}
    </Space>
  );
};

export default CreateEvent;
