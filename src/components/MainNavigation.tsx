import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import React from "react";
import { Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { useLocation } from "react-router-dom";
function MainNavigation() {
  const { user } = useAuth();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  // Menu with items Home, Listings, on left; Login on right if not logged in, Create Listing and Profile with submenus if logged in on right

  const items: MenuProps["items"] = [
    {
      label: <NavLink to="/">Home</NavLink>,
      key: "home",
    },
    /*  {
      label: <NavLink to="/blog">Listings</NavLink>,
      key: "blog",
    }, */

    {
      label: <NavLink to="/events">Events</NavLink>,
      key: "events",
    },
    {
      label: <NavLink to="/connections">Connections</NavLink>,
      key: "connections",
    },

    {
      style: { marginLeft: "auto" },
      label: (
        <NavLink to="/login">
          <Button type="primary">Login</Button>
        </NavLink>
      ),
      key: "7",
    },
  ];

  if (user) {
    // remove login button
    items.pop();
    // add create listing
    items.push({
      label: <NavLink to="/contribute"></NavLink>,
      key: "contribute",
      style: { marginLeft: "auto" },
    });
    // add documents

    items.push({
      label: <NavLink to="/profile">Profile</NavLink>,
      key: "profile",
      children: [
        {
          label: <NavLink to="/profile">View Profile</NavLink>,
          key: "profile",
        },
        {
          style: { padding: "0px" },
          label: (
            <Button
              onClick={handleLogout}
              type="primary"
              danger
              style={{ width: "100%" }}
            >
              Logout
            </Button>
          ),
          key: "profile:2",
        },
      ],
    });
  }

  // set active link based on first part of pathname
  const location = useLocation();
  const root = location.pathname.split("/")[1];
  console.log(root);
  const selectedKey = items.find((item) => {
    if (item.key === root) {
      return true;
    }
    if (item.children) {
      return item.children.find((subItem) => {
        return subItem.key === root;
      });
    }
    // home key is '/' so need to check for that
    if (item.key === "home" && root === "") {
      return true;
    }
    return false;
  });

  return (
    <Menu
      mode="horizontal"
      items={items}
      selectedKeys={[selectedKey?.key || ""]}
    />
  );
}

export default MainNavigation;
