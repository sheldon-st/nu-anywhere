import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";

const { Header, Content, Sider } = Layout;
import BudgetVisualization from "./BudgetVisualization";
import BudgetSearch from "./search/BudgetSearch";
import FilterControls from "./search/ResultsSideBar";
const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const SearchResults: React.FC = () => {
  const {
    token: { colorBgContainer, colorFillAlter },
  } = theme.useToken();

  return (
    <>
      <Sider width={225} style={{ background: colorFillAlter }}>
        <FilterControls />
      </Sider>
      <Content
        style={{
          padding: "0 0 0 24px",
          margin: 0,
          minHeight: 280,
          background: colorBgContainer,
          height: "90vh",
          overflow: "visible",
        }}
      >
        <BudgetVisualization />
      </Content>
    </>
  );
};

export default SearchResults;
