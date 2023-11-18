import { forwardRef, useEffect } from "react";
import {
  Input,
  Form,
  Upload,
  Select,
  InputNumber,
  DatePicker,
  Checkbox,
  Slider,
  Space,
  Col,
  Row,
  Button,
  AutoComplete,
  Card,
} from "antd";
import React, { FC } from "react";
import { IListing } from "./ListingListItem";
import type { FormInstance } from "antd/es/form";
import { Loader } from "@googlemaps/js-api-loader";
/* 
const loader = new Loader({
  apiKey: "AIzaSyApOv8j1GSr09SLkdAEWObBHkleWvAGB1U",
  version: "weekly",
  libraries: ["places", "geocoding"],
});

const { AutocompleteService } = await loader.importLibrary("places");
const { Geocoder } = await loader.importLibrary("geocoding");
 */
const { TextArea } = Input;

const NewPostForm: FC<{
  onSubmit: (listing: IListing) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: any;
}> = ({ onSubmit, onCancel, isSubmitting, error }) => {
  // form to create a new listing with fields for all the listing attributes; price range should be a slider between 0 and 5000, utility cost should be a slider between 0 and 500, and the start and end dates should be date pickers
  const { RangePicker } = DatePicker;

  const [price, setPrice] = React.useState<number | null>(1000);
  const formRef = React.useRef<FormInstance>(null);

  const [form] = Form.useForm();

  const [address, setAddress] = React.useState<string | null>(null);
  /* 
  // keep track of the selected adress as coordinates
  const [_geoLocation, setGeoLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [predictions, setPredictions] = React.useState<{ value: string }[]>([]);
  // autocomplete address with google maps api
  const handleAddressChange = (address: string) => {
    const guesses = autocompleteService.getPlacePredictions(
      {
        input: address,
        types: ["address"],
        region: "us",
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

  let autocompleteService = new AutocompleteService();
  let geocodingService = new Geocoder();

  // create new autocomplete service on component mount and try browser geolocation
  useEffect(() => {
    autocompleteService = new AutocompleteService();
    geocodingService = new Geocoder();
  }, []);

  // validate form on submit with Form rules before performing onSubmit
  const onFinish = (values: any) => {
    console.log(values);
    onSubmit(values);
  };

  return (
    <div
      style={{
        alignItems: "center",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Form
        name="basic"
        // onFinishFailed={onCancel}
        onFinish={onFinish}
        ref={formRef}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ width: "80%", textAlign: "left" }}
      >
        <Form.Item name="_geoloc"></Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input a title!" }]}
        >
          <Input
            maxLength={100}
            showCount
            placeholder="i.e. Recently renovated Mission Hill apartment with 3 roomates and a dog :)"
          />
        </Form.Item>

        <Form.Item label="Address" name="location">
          <AutoComplete
            options={predictions}
            style={{ width: "100%" }}
            onChange={handleAddressChange}
            placeholder="Address"
            onSelect={(value) => {
              console.log(value);
              setAddress(value);
            }}
          />
        </Form.Item>
        <Form.Item
          label="Availibility"
          name="dateRange"
          rules={[{ required: true, message: "Please input a date range!" }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"

          // rules={[{ required: true, message: "Please input a description!" }]}
        >
          <TextArea
            maxLength={300}
            showCount
            rows={5}
            placeholder="Describe your listing: i.e. lifestyle of roommates, size of room, what the area is like, etc."
          />
        </Form.Item>

        <Form.Item label="Monthly Costs">
          <Card style={{ width: "100%" }} bodyStyle={{ paddingBottom: 0 }}>
            <Form.Item
              label="Rent"
              name="price"
              rules={[{ required: true, message: "Please input a price!" }]}
              id="price"
            >
              <InputNumber
                suffix="/mo"
                style={{ width: "100%" }}
                id="price"
                placeholder="i.e. 1000"
              />
            </Form.Item>
            <Form.Item
              label="Utility Range"
              name="utilityCost"
              //rules={[{ required: true, message: "Please input a utility cost!" }]}
            >
              <Slider min={0} max={1000} range defaultValue={[100, 500]} />
            </Form.Item>
          </Card>
        </Form.Item>
        <Form.Item label="Property Info">
          <Card style={{ width: "100%" }} bodyStyle={{ paddingBottom: 0 }}>
            <Form.Item
              label="Property Tags"
              name="propertyTags"
              //rules={[{ required: true, message: "Please input property tags!" }]}
            >
              <Select />
            </Form.Item>

            <Form.Item label="Amenities" name="amenities">
              <Select />
            </Form.Item>
            <Form.Item label="Bedrooms" name="bedrooms">
              <InputNumber />
            </Form.Item>
          </Card>
        </Form.Item>

        <Form.Item label="Lifestyle">
          <Card style={{ width: "100%" }} bodyStyle={{ paddingBottom: 0 }}>
            <Form.Item label="Roommates" name="roommates" rules={[]}>
              <InputNumber />
            </Form.Item>

            <Form.Item label="Lifestyle Tags" name="lifestyleTags">
              <Select />
            </Form.Item>
          </Card>
        </Form.Item>

        <Form.Item
          label="Images"
          name="images"
          //rules={[{ required: true, message: "Please input images!" }]}
        >
          <Upload type="select" fileList={[]}></Upload>
        </Form.Item>

        <Form.Item
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "100%",
            flexDirection: "row-reverse",
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  ); */
  return <div></div>;
};

export default NewPostForm;
