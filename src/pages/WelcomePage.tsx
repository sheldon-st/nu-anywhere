import React from "react";
import NewTableFromJson from "./NewBudget";
import BudgetVisualization from "./budget/BudgetVisualization";
import BudgetSearch from "./budget/search/BudgetSearch";
import { Navigate } from "react-router-dom";
import { Space, Typography, Button, Empty } from "antd";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
function WelcomePage() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("session from getSession");
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session from onAuthStateChange");
      setSession(session);
    });
  }, []);

  return (
    <>
      {!session ? (
        <div>
          <Space direction="vertical" style={{ width: "75%" }}>
            <Typography.Title>Welcome to NUAnywhere!</Typography.Title>
            <Typography.Title level={3}>
              Our goal is to help you stay connected to the Northeastern
              community, no matter where you are. We aim to provide you with the
              tools you need to build and maintain a network of peers (and
              friends) to support you throughout your time at Northeastern.
            </Typography.Title>
            <Button type="primary" href="/login">
              Get Started!
            </Button>
          </Space>
        </div>
      ) : (
        <Empty
          description={
            <Typography.Title level={3}>
              You are logged in! The home page for logged in users is currently under construction.
            </Typography.Title>
          }
        />
      )}
    </>
  );
}

export default WelcomePage;
