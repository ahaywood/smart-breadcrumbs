import { LayoutProps } from "rwsdk/router";
import { Breadcrumbs } from "../components/Breadcrumbs";

const Layout = ({ children, requestInfo }: LayoutProps) => {
  return (
    <div style={{ padding: "20px", background: "yellow" }}>
      <Breadcrumbs currentUrl={requestInfo?.request.url ?? ""} />
      {children}
    </div>
  );
};

export { Layout };
