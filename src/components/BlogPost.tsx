import React, { FC } from "react";
import { IListing } from "./ListingListItem";
import * as antd from "antd";
import {
  Carousel,
  Descriptions,
  Space,
  Tag,
  Timeline,
  Calendar,
  Image,
} from "antd";

/** Detail page for a listing displaying all of its available information. */
export const ListingDetail: FC<IListing> = (args) => {
  const {
    title,
    description,
    price,
    _geoloc,
    location,
    images,
    startDate,
    endDate,
    averageUtilityCost,
    lifestyleTags,
    propertyTags,
    amenities,
    roomates,
    bedrooms,
    bathrooms,
    parking,
    pets,
    smoking,
    furniture,
    user,
  } = args;

  /** Title at top with metadata for user, price start and end date. Below that a carosuel of images. Below that section for lifestyle (roomates, lifestyle tags, smoking, furtniture). Next to a timeline with start and end dates. Below that section for property info (rooms, amenatites, etc ) */
  return (
    <antd.Card title={title} style={{ textAlign: "left" }} size="default">
      <Space direction="vertical" style={{ color: "red" }}>
        <p>{description}</p>s
        <p>{price}</p>
        <p>{}</p>
      </Space>
      <Carousel
        style={{
          height: "300px",
          overflow: "hidden",
          justifyItems: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        {images?.map((img) => (
          <Image src={img} width={"100%"} />
        ))}
      </Carousel>

      <Timeline
        mode="left"
        items={[
          {
            label: startDate?.toString(),
            children: "Move In",
          },
          {
            label: endDate?.toString(),
            children: "Move Out",
          },
        ]}
      />
      <Descriptions
        title="Property Info"
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Location">{location}</Descriptions.Item>
        <Descriptions.Item label="Rooms">{bedrooms}</Descriptions.Item>
        <Descriptions.Item label="Bathrooms">{bathrooms}</Descriptions.Item>
        <Descriptions.Item label="Parking">
          {parking ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Pets">
          {pets ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Smoking">
          {smoking ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Furniture">
          {furniture?.map((f) => (
            <Tag>{f}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Amenities">
          {amenities?.map((a) => (
            <Tag>{a}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="Lifestyle"
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Roomates">
          {roomates?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Lifestyle Tags">
          {lifestyleTags?.map((l) => (
            <Tag>{l}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </antd.Card>
  );
};

export default ListingDetail;
