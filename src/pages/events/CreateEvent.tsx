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
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { majors, interests } from "../../types";
import { Loader } from "@googlemaps/js-api-loader";
import posthog from "posthog-js";
import { useNavigate, Navigate } from "react-router-dom";
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
    message.success("Event created!");
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
          <Space direction="vertical" style={{ width: "50%" }}>
            <GenericSinglePageForm
              title="When is your event?"
              description="This is the date and time your event will take place."
              formItems={
                <DatePicker
                  id="date"
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e })}
                  style={inputFieldStyle}
                  placeholder="i.e. Thursday, 4/15/2024"
                />
              }
            />
          </Space>
        );
      case 3:
        return (
          <Space direction="vertical" style={{ width: "50%" }}>
            <GenericSinglePageForm
              title="Where is your event?"
              description="This is the location of your event."
              formItems={
                <Input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  style={inputFieldStyle}
                  placeholder="i.e. 123 Main Street, San Francisco, CA"
                />
              }
            />
          </Space>
        );
      case 4:
        return (
          <Space direction="vertical" style={{ width: "50%" }}>
            <GenericSinglePageForm
              title="Who should be able to see your event?"
              description="This is the visibility of your event."
              formItems={
                <Select
                  id="visibility"
                  type="text"
                  required
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e })}
                  style={inputFieldStyle}
                  placeholder="i.e. Public"
                >
                  <Select.Option value="public">Everyone</Select.Option>
                  <Select.Option value="private">
                    Just my connections
                  </Select.Option>
                </Select>
              }
            />
          </Space>
        );
      case 5:
        return (
          <Space direction="vertical" style={{ width: "50%" }}>
            <GenericSinglePageForm
              title="Nice! The review page for events is still under construction but this is where you would check out the details "
              description=""
              formItems={
                <div>
                  <Button type="primary" onClick={handleRegistrationComplete}>
                    Looks good!
                  </Button>
                  <pre>{JSON.stringify(formData, null, 2)}</pre>
                  <pre>{currentFormValid}</pre>
                </div>
              }
            />
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
        <Steps.Step title="Event Name" />
        <Steps.Step title="Description" />
        <Steps.Step title="Date" />
        <Steps.Step title="Location" />
        <Steps.Step title="Visibility" />
        <Steps.Step title="Review" />
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
      {registrationComplete && (
        <div>
          <Navigate to="/events" />
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
