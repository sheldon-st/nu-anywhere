import React, { useState, useEffect, FC, useRef } from "react";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../hooks/Auth";
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
  theme,
  AutoComplete,
  Card,
  Descriptions,
} from "antd";
import type { InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { GenericSinglePageForm } from "./GenericSinglePageFormFIeld";
import { use } from "express/lib/application";
import { majors, interests } from "../../types";

import { Loader } from "@googlemaps/js-api-loader";

import posthog from "posthog-js";
// import stuff needed to navigate to next page on enter from react-router-dom
import { useNavigate, Navigate } from "react-router-dom";

const loader = new Loader({
  apiKey: import.meta.env.GOOGLE_API_KEY,
  version: "weekly",
  libraries: ["places", "geocoding"],
});

const { RangePicker } = DatePicker;
const { CheckableTag } = Tag;

interface IUserRegistrationProps {
  setRegistrationCompletes?: any;
}
export const UserRegistration: FC<IUserRegistrationProps> = ({
  setRegistrationCompletes,
}) => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { user } = useAuth();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>();
  const [website, setWebsite] = useState<string | null>();

  const [page, setPage] = useState(-1);

  const [formData, setFormData] = useState({
    name: "",
    educationStatus: "",
    graduationYear: "",
    major: [],
    location: "",
    interests: [],
    employmentStatus: "",
    employmentType: "",
    employmentDates: "",
    employer: "",
    jobTitle: "",
  });

  const formItems = [
    "name",
    "educationStatus",
    "graduationYear",
    "major",
    "location",
    "interests",
    "employmentStatus",
    "employmentType",
    "employer",
    "jobTitle",
  ];

  // keep track of validation status for current page of form
  const [currentFormValid, setCurrentFormValid] = useState(false);
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder | null>(null);

  // Wrap the code inside an async function
  const loadGoogleMaps = async () => {
    // Load the Google Maps Platform JS API asynchronously
    await loader.load();
    setAutocompleteService(new google.maps.places.AutocompleteService());
    setGeocodingService(new google.maps.Geocoder());
  };

  // create new autocomplete service and try browser geolocation on component mount
  useEffect(() => {
    const initializeServices = async () => {
      await loadGoogleMaps();
    };

    initializeServices();
  }, []);

  // create new autocomplete service on component mount and try browser geolocation
  useEffect(() => {
    const initializeServices = async () => {
      await loadGoogleMaps();
      autocompleteService = new google.maps.places.AutocompleteService();
      geocodingService = new google.maps.Geocoder();
    };

    initializeServices();
  }, []);

  /** Geolocation */
  const [_geoLocation, setGeoLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [predictions, setPredictions] = React.useState<{ value: string }[]>([]);
  // autocomplete address with google maps api
  const handleAddressChange = (address: string) => {
    //autocompleteService.
    const guesses = autocompleteService.getPlacePredictions(
      {
        input: address,
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
      (guess) => {
        console.log(guess);
        setPredictions(guess.map((p) => ({ value: p.description })));

        // if there is only one guess, set _geoLocation to the coordinates of the guess
        if (guess.length === 1) {
          geocodingService.geocode(
            {
              address: guess[0].description,
            },
            (results) => {
              console.log(results);
              form.setFieldsValue({
                _geoloc: {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                },
              });
            }
          );
        }
        console.log(_geoLocation);
      }
    );
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
    setCurrentFormValid(validateForm());
  };

  const validateForm = (forPage = page) => {
    switch (forPage) {
      case 0:
        return formData.name !== "";
      case 1:
        if (formData.educationStatus === "yes") {
          return (
            formData.graduationYear !== "" &&
            formData.major.length !== 0 &&
            formData.major.every((major: string) => majors[major])
          );
        } else if (formData.educationStatus === "no") {
          return true;
        } else {
          return false;
        }
      case 2:
        if (formData.employmentStatus === "yes") {
          return (
            formData.employmentType !== "" &&
            formData.employmentDates !== "" &&
            formData.employer !== "" &&
            formData.jobTitle !== ""
          );
        } else if (formData.employmentStatus === "no") {
          return true;
        } else {
          return false;
        }
      case 3:
        return formData.location !== "";
      case 4:
        return formData.interests.length >= 3;
      default:
        return false;
    }
  };

  useEffect(() => {
    setCurrentFormValid(validateForm());
  }, [formData]);

  // because of protected route, we can assume that user is not null but if it is, we can return null
  if (!user) {
    return null;
  }

  async function updateProfile({ username, website }) {
    try {
      setLoading(true);

      const updates = {
        id: user?.id,
        username,
        website,
        updated_at: new Date(),
      };

      /* let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      let error 
 */

      let error = null;
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const inputFieldStyle = {
    width: "100%",
    margin: "auto",
    textAlign: "left",
  };

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !formData.interests.includes(inputValue)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, inputValue],
      });
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...formData.interests];
    newTags[editInputIndex] = editInputValue;
    setFormData({ ...formData, interests: newTags });
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  // call nextPage() whenever the current form is valid and the user presses enter
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && validateForm()) {
        nextPage();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [currentFormValid]);

  const handleRegistrationComplete = () => {
    setRegistrationComplete(true);
    //setRegistrationCompletes(true);
    console.log("registration complete");
  };
  const conditionalRender = () => {
    switch (page) {
      case 0:
        return (
          <GenericSinglePageForm
            formData={formData}
            setFormData={setFormData}
            next={() => setPage((prev) => prev + 1)}
            prev={() => setPage((prev) => prev - 1)}
            title="To start, what's your full name?"
            description="This is the name that will be displayed on your profile."
            formItems={
              <Input
                autoFocus
                id="name"
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  validateForm();
                }}
                style={inputFieldStyle}
                placeholder="Full Name"
              />
            }
          />
        );
      case 1:
        return (
          <Space direction="vertical" size={12} style={{}}>
            <GenericSinglePageForm
              formData={formData}
              setFormData={setFormData}
              next={() => setPage((prev) => prev + 1)}
              prev={() => setPage((prev) => prev - 1)}
              title="Are you still in school?"
              description="Master's students, PhD students, and postdocs count too!"
              formItems={
                <Select
                  // defaultValue="2021"
                  id="educationStatus"
                  style={inputFieldStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, educationStatus: e })
                  }
                  status={formData.educationStatus ? "" : "error"}
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  value={formData.educationStatus}
                  placeholder="Select an option"
                ></Select>
              }
            />

            {formData.educationStatus === "yes" && (
              <GenericSinglePageForm
                formData={formData}
                setFormData={setFormData}
                next={() => setPage((prev) => prev + 1)}
                prev={() => setPage((prev) => prev - 1)}
                title="When do you plan to graduate?"
                description="It's okay if you don't know yet, just give us your best guess!"
                formItems={
                  <DatePicker
                    id="graduationYear"
                    style={inputFieldStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, graduationYear: e })
                    }
                    status={formData.graduationYear ? "" : "error"}
                    value={formData.graduationYear}
                    picker="year"
                    placeholder="Select a year"
                  ></DatePicker>
                }
              />
            )}
            {formData.graduationYear !== "" &&
              formData.educationStatus === "yes" && (
                <GenericSinglePageForm
                  formData={formData}
                  setFormData={setFormData}
                  next={() => setPage((prev) => prev + 1)}
                  prev={() => setPage((prev) => prev - 1)}
                  title="What are you studying?"
                  description="Select all that apply, or add your own if it's not listed here."
                  formItems={
                    <Select
                      // defaultValue="2021"
                      id="major"
                      style={inputFieldStyle}
                      onChange={(e) => setFormData({ ...formData, major: e })}
                      status={formData.major ? "" : "error"}
                      mode="multiple"
                      filterOption={filterOption}
                      options={Object.keys(majors).map((major) => ({
                        label: majors[major],
                        value: major,
                      }))}
                      value={formData.major}
                      placeholder="Select major(s)/minor(s)"
                    ></Select>
                  }
                />
              )}
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size={12}>
            <GenericSinglePageForm
              formData={formData}
              setFormData={setFormData}
              next={() => setPage((prev) => prev + 1)}
              prev={() => setPage((prev) => prev - 1)}
              title="Are you currently/planning to be employed?"
              description="This could be a co-op, internship, or full-time job."
              formItems={
                <Select
                  // defaultValue="2021"
                  id="employmentStatus"
                  style={inputFieldStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, employmentStatus: e })
                  }
                  status={formData.employmentStatus ? "" : "error"}
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  value={formData.employmentStatus}
                ></Select>
              }
            />
            {formData.employmentStatus === "yes" && (
              <GenericSinglePageForm
                formData={formData}
                setFormData={setFormData}
                next={() => setPage((prev) => prev + 1)}
                prev={() => setPage((prev) => prev - 1)}
                title="Cool! What type of employment is it?"
                description="Select all that apply."
                formItems={
                  <Select
                    // defaultValue="2021"
                    id="employmentType"
                    style={inputFieldStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentType: e })
                    }
                    status={formData.employmentType ? "" : "error"}
                    filterOption={filterOption}
                    options={[
                      { label: "Co-op", value: "coop" },
                      { label: "Internship", value: "internship" },
                      { label: "Full-time", value: "fulltime" },
                    ]}
                    value={formData.employmentType}
                  ></Select>
                }
              />
            )}

            {formData.employmentStatus === "yes" &&
              (formData.employmentType === "coop" ||
                formData.employmentType === "internship") && (
                <GenericSinglePageForm
                  formData={formData}
                  setFormData={setFormData}
                  next={() => setPage((prev) => prev + 1)}
                  prev={() => setPage((prev) => prev - 1)}
                  title="When do you plan to be working?"
                  description="If you don't know yet, just give us your best guess!"
                  formItems={
                    <RangePicker
                      id="employmentDates"
                      style={inputFieldStyle}
                      onChange={(e) =>
                        setFormData({ ...formData, employmentDates: e })
                      }
                      status={formData.employmentDates ? "" : "error"}
                      value={formData.employmentDates}
                      picker="month"
                    ></RangePicker>
                  }
                />
              )}
            {formData.employmentDates !== "" && (
              <GenericSinglePageForm
                formData={formData}
                setFormData={setFormData}
                next={() => setPage((prev) => prev + 1)}
                prev={() => setPage((prev) => prev - 1)}
                title="Tell us a little more about your job!"
                description="This won't be displayed on your profile by default, but you can choose to share it with other users."
                formItems={
                  <Space
                    direction="horizontal"
                    style={{
                      gap: 8,
                      margin: "0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    //itemProp={{style}}
                  >
                    <Input
                      id="jobTitle"
                      type="text"
                      required
                      value={formData.jobTitle || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, jobTitle: e.target.value });
                        validateForm();
                      }}
                      style={inputFieldStyle}
                      placeholder="Job Title"
                    />
                    <Typography.Text style={{ margin: 0 }}>at</Typography.Text>
                    <Input
                      id="employer"
                      type="text"
                      required
                      value={formData.employer || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, employer: e.target.value });
                        validateForm();
                      }}
                      style={inputFieldStyle}
                      placeholder="Company"
                    />
                  </Space>
                }
              />
            )}
          </Space>
        );
      case 3:
        return (
          <GenericSinglePageForm
            formData={formData}
            setFormData={setFormData}
            next={() => setPage((prev) => prev + 1)}
            prev={() => setPage((prev) => prev - 1)}
            title="Where are you hoping to meet people?"
            description="Please be as specific as possible, this will help us connect you with people in your area. Don't worry, you can always change this later."
            formItems={
              <AutoComplete
                options={predictions}
                style={inputFieldStyle}
                onChange={handleAddressChange}
                placeholder="Address"
                onSelect={(value) => {
                  console.log(value);
                  setFormData({ ...formData, location: value });
                }}
                defaultValue={formData.location}
              />
            }
          />
        );
      case 4:
        return (
          <GenericSinglePageForm
            formData={formData}
            setFormData={setFormData}
            next={() => setPage((prev) => prev + 1)}
            prev={() => setPage((prev) => prev - 1)}
            title="What do you like to do for fun?"
            description="We'll use this to help you find people with similar interests. Please choose at least (3) that apply, or add your own if it's not listed here (adding custom under construction)."
            formItems={
              <Space
                size={[0, 8]}
                wrap
                style={{
                  backgroundColor: token.colorBgLayout,
                  padding: 16,
                  borderRadius: 8,
                  width: "75%",
                }}
              >
                {Object.keys(interests).map((interest) => (
                  <CheckableTag
                    key={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={(checked) => {
                      const nextSelectedTags = checked
                        ? [...formData.interests, interest]
                        : formData.interests.filter((tag) => tag !== interest);
                      setFormData({
                        ...formData,
                        interests: nextSelectedTags,
                      });
                    }}
                  >
                    {interests[interest]}
                  </CheckableTag>
                ))}
                {/*                     
                  
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag
                  style={tagPlusStyle}
                  icon={<PlusOutlined />}
                  onClick={showInput}
                >
                  New Tag
                </Tag>
              )} */}
              </Space>
            }
          />
        );
      case 5:
        return (
          <Space direction="vertical" size={12}>
            <Typography.Title level={2}>
              Phew! That was a lot of questions.
            </Typography.Title>

            <Card style={{ width: "50%" }}>
              <Descriptions title="Profile Preview">
                <Descriptions.Item label="Name">
                  {formData.name}
                </Descriptions.Item>
                <Descriptions.Item label="Education Status">
                  {formData.educationStatus === "yes" ? "In School" : "Alumni"}
                </Descriptions.Item>
                {formData.educationStatus === "yes" && (
                  <Descriptions.Item label="Graduation Year">
                    {formData.graduationYear.format("YYYY")}
                  </Descriptions.Item>
                )}
                {formData.educationStatus === "yes" && (
                  <Descriptions.Item label="Major">
                    {formData.major.map((major: string) => majors[major])}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Location">
                  {formData.location}
                </Descriptions.Item>
                <Descriptions.Item label="Interests">
                  {formData.interests.map((interest: string) => (
                    <Tag key={interest}>{interests[interest]}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="Employment Status">
                  {formData.employmentStatus === "yes"
                    ? "Employed"
                    : "Unemployed"}
                </Descriptions.Item>
                {formData.employmentStatus === "yes" && (
                  <Descriptions.Item label="Employment Type">
                    {formData.employmentType === "coop"
                      ? "Co-op"
                      : formData.employmentType === "internship"
                      ? "Internship"
                      : "Full-time"}
                  </Descriptions.Item>
                )}
                {formData.employmentStatus === "yes" &&
                  formData.employmentType === "coop" && (
                    <Descriptions.Item label="Employment Dates">
                      {formData.employmentDates[0].format("MMMM YYYY")} -{" "}
                      {formData.employmentDates[1].format("MMMM YYYY")}
                    </Descriptions.Item>
                  )}
              </Descriptions>
            </Card>
            <Typography.Title level={3}>
              Just make sure everything looks good, and then you're all set!
            </Typography.Title>
            <Space direction="horizontal">
              <Button onClick={() => setPage((prev) => prev - 1)}>
                Go Back
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  console.log(formData);
                  // setRegistrationComplete(true);
                  posthog.identify(user.id, {
                    $email: user.email,
                    $name: formData.name,
                    $username: formData.name,
                    educationStatus: formData.educationStatus,
                    // graduationYear: formData.graduationYear.format("YYYY"),
                    major: formData.major.map((major: string) => majors[major]),
                    location: formData.location,
                    interests: formData.interests.map(
                      (interest: string) => interests[interest]
                    ),
                    employmentStatus: formData.employmentStatus,
                    employmentType: formData.employmentType,
                    employmentDates: formData.employmentDates,
                    employer: formData.employer,
                    jobTitle: formData.jobTitle,
                  });
                  handleRegistrationComplete();
                }}
              >
                Looks good!
              </Button>
              {registrationComplete && <Navigate to="/profile" replace />}
            </Space>
          </Space>
        );
      default:
        return <div> </div>;
    }
  };

  // the container space should be styles to take up entire screen height and cover header that it is wrapped in
  return (
    <Space
      direction="vertical"
      size={12}
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: token.colorBgContainer,
        padding: 32,
      }}
    >
      <Steps current={page} size="small" onChange={(e) => setPage(e)}>
        <Steps.Step title="Basics" />
        <Steps.Step
          title="Education"
          disabled={validateForm(0) ? false : true}
        />
        <Steps.Step title="Work" disabled={validateForm(1) ? false : true} />
        <Steps.Step
          title="Location"
          disabled={validateForm(2) ? false : true}
        />
        <Steps.Step
          title="Interests"
          disabled={validateForm(3) ? false : true}
        />
        <Steps.Step title="Review" disabled={validateForm(4) ? false : true} />
      </Steps>
      {page === -1 && (
        <Space direction="vertical">
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Hey there!{" "}
          </Typography.Title>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            Before we continue, we need to get to know you a little better.
          </Typography.Title>

          <Typography.Paragraph>
            We know that filling out forms can be a pain, but this will help us
            make sure that you get the most out of this platform, and will only
            take a couple minutes!
          </Typography.Paragraph>
          <Button onClick={() => setPage((prev) => prev + 1)} type="primary">
            Let's get started!
          </Button>
        </Space>
      )}

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

export default UserRegistration;

/* <form onSubmit={updateProfile} className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          type="button"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </form> */
