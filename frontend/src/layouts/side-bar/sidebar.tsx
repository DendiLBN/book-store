import { useState } from "react";
import { Layout, Menu } from "antd";

import { itemsSideBar } from "@/layouts/side-bar/states/items-side-bar";
import { useIsLoggedIn } from "@/common/hooks/use-is-logged-in";

import "@/assets/layouts-styles/sidebar.css";

const { Sider } = Layout;

export const LandingPageSideBar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const isLoggedIn = useIsLoggedIn();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Sider
      className="landing-page-sidebar"
      theme="light"
      defaultCollapsed
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      style={{ maxHeight: "645px", overflow: "auto" }}
    >
      <Menu
        mode="inline"
        theme="light"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        items={itemsSideBar}
      />
    </Sider>
  );
};