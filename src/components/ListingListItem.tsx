import React, { FC } from "react";
import { Card, Image, Space } from "antd";

export interface IListing {
  uuid: string;
  title?: string;
  description?: string;
  price?: number;
  averageUtilityCost?: number;
  startDate: Date;
  endDate: Date;
  location: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
  images?: string[];
  lifestyleTags?: string[];
  propertyTags?: string[];
  amenities?: string[];
  roomates?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: boolean;
  pets?: boolean;
  smoking?: boolean;
  furniture?: string[];
  user?: string;
}

/** Represents a rental listing for a sublet within a list of listings. */
export const ListingListItem: FC<IListing> = (args) => {
  const { title, description, price, _geoloc, location, images, ...props } =
    args;

  return (
    <Card hoverable cover={<Image src={images ? images[0] : ""} />}>
      <Card.Meta
        title={title}
        description={
          <Space direction="vertical" style={{ color: "red" }}>
            <p>{description}</p>
            <p>{price}</p>
            <p>{}</p>
          </Space>
        }
      />
    </Card>
  );
};
