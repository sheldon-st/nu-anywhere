import BudgetSearch from "./budget/search/BudgetSearch";

import { Layout, Button, Space, Typography, Tabs, Alert } from "antd";
import React, { FC, useState } from "react";
import { NavLink } from "react-router-dom";

// Tabs for Search or explore by agency
export const BudgetHome: FC = () => {
  return (
    <Layout
      style={{
        width: "100%",
        margin: 0,
        background: "#fff",
      }}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="New Search" key="1">
          <Space direction="vertical" style={{ width: "100%" }}>
            <BudgetSearch />
            <Alert
              message="Disclaimer: The data presented on this website is for informational purposes only. All data is taken from U.S. Government budget justification documents and has undergone minimal quality assurance. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of data. Any reliance you place on such information is therefore strictly at your own discretion."
              type="warning"
              style={{ textAlign: "left" }}
              showIcon
            />
            <Alert
              message="The provided dataset currently only includes information on a subset of DoD agencies derived from FY 2024 RDT&E budget requests published Spring 2023. We are working to expand the dataset to include other agencies and all budget categories."
              type="info"
              style={{ textAlign: "left" }}
            />
          </Space>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Explore by agency" key="2" disabled>
          Content of Tab Pane 2
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};
