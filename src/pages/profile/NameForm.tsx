import React, { useState, useEffect, FC } from "react";

import { Button, Input, Steps, Space, Form } from "antd";

/** Simple form for the user to enter their name */
export const NameForm: FC = () => {
  const [name, setName] = useState<string | null>();

  return (
    <Form>
      <Form.Item label="Name">
        <Input
          id="name"
          type="text"
          required
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};
