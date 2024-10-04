import { BrowserRouter } from "react-router-dom";

import { Layout } from "antd";

import { AntdNotificationProvider } from "@/common/contexts/antd-notification-context";
import { ThemeProvider } from "@/common/contexts/theme-context";

import { LandingPageHeader } from "@/layouts/header/header";
import { LandingPageSideBar } from "@/layouts/side-bar/sidebar";
import { LandingPageContent } from "@/layouts/content/content";
import LandingPageFooter from "@/layouts/footer/footer";

import ErrorBoundary from "./common/error-boundary";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AntdNotificationProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <LandingPageHeader />
            <Layout>
              <LandingPageSideBar />
              <LandingPageContent />
            </Layout>
            <LandingPageFooter />
          </ErrorBoundary>
        </BrowserRouter>
      </AntdNotificationProvider>
    </ThemeProvider>
  );
};
export default App;
