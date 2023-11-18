import React, { useState, useEffect, FC, useRef } from "react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../hooks/Auth";
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

import { GenericSinglePageForm } from "./profile/GenericSinglePageFormFIeld";
import { use } from "express/lib/application";
import { majors, interests } from "../types";

import { Loader } from "@googlemaps/js-api-loader";
import { UserRegistration } from "./profile/Registration";
import posthog from "posthog-js";

export function Profile() {
  const { user } = useAuth();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>();
  const [website, setWebsite] = useState<string | null>();

  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleRegistrationComplete = () => {
    posthog.capture("registration complete", {
      property: "successful registration",
    });
    setRegistrationComplete(true);
  };

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

  return (
    <>
      {registrationComplete ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={2}>Welcome {user.email}</Typography.Title>
          <Typography.Paragraph id="registration-complete">
            This is the profile page. You can update your profile here.
          </Typography.Paragraph>
        </Space>
      ) : (
        <UserRegistration
          setRegistrationComplete={handleRegistrationComplete}
          //user={user}
        />
      )}
    </>
  );
}

export default Profile;

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
