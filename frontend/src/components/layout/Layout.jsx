import { Outlet } from "react-router-dom";
import PageSuspense from "../PageSuspense";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      {/* Spacer to prevent content from being hidden under navbar */}
      <div className="h-16 md:h-20" />
      <main className="flex-1">
        <PageSuspense>
          <Outlet />
        </PageSuspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;