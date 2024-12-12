import { Layout, Menu } from "antd";
import {
  homeMenuItem,
  leftMenuItems,
  middleMenuItems,
  rightMenuItems,
  userMenuItems,
} from "@/layouts/header/consts/menu-items";
import { LogoutButton } from "@/features/login-page/hooks/useLogoutUser";
import useUser from "@/common/users/useUser";
import "@/assets/layouts-styles/header.css";

const { Header } = Layout;

export const LandingPageHeader = () => {
  const { user } = useUser();

  const isLoggedIn = !!user;

  return (
    <Header className="header">
      <div className="header__content">
        <Menu
          mode="horizontal"
          theme="light"
          items={homeMenuItem}
          className="home-item"
        />
        {isLoggedIn ? (
          <Menu
            mode="horizontal"
            theme="light"
            items={leftMenuItems}
            className="left-menu"
          />
        ) : null}

        <Menu
          mode="horizontal"
          theme="light"
          items={middleMenuItems}
          className="middle-menu"
        />

        {isLoggedIn ? (
          <Menu mode="horizontal" theme="light" items={userMenuItems} />
        ) : null}
        {isLoggedIn ? (
          <LogoutButton />
        ) : (
          <Menu
            mode="horizontal"
            theme="light"
            items={rightMenuItems}
            className="right-menu"
          />
        )}
      </div>
    </Header>
  );
};
