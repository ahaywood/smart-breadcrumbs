import { LayoutProps } from "rwsdk/router";
import { SmartBreadcrumbs } from "../components/SmartBreadcrumbs";

const Layout = ({ children, requestInfo }: LayoutProps) => {
  return (
    <div style={{ padding: "20px", background: "yellow" }}>
      <SmartBreadcrumbs currentUrl={requestInfo?.request.url ?? ""} />
      {children}
    </div>
  );
};

export { Layout };
