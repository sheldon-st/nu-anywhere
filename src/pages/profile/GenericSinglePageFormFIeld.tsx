import React, { useState, useEffect, FC } from "react";

import { Button, Input, Steps, Space, Form, Typography } from "antd";

/** Generic Component to construct a single page of a multi-page form, accepts the following props:
 * @param formData - the data to be updated by the form
 * @param setFormData - the function to update the data
 * @param next - the function to go to the next page
 * @param prev - the function to go to the previous page
 * @param title - the title of the page
 * @param description - the description of the page
 * @param formItems - the form items to be displayed on the page
 */

interface GenericSinglePageFormProps {
  formData: any;
  setFormData: any;
  next: any;
  prev: any;
  title: string;
  description: string;
  formItems: any;
}

export const GenericSinglePageForm: FC<GenericSinglePageFormProps> = ({
  formData,
  setFormData,
  next,
  prev,
  title,
  description,
  formItems,
}) => {
  return (
    <Form>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Typography.Paragraph>{description}</Typography.Paragraph>
      <Form.Item
        style={{ alignSelf: "center", width: "100%" }}
      >
        {formItems}
      </Form.Item>
    </Form>
  );
};
