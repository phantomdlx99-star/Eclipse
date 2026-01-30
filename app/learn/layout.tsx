import GoBack from "@/components/GoBack";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-auto">
      <div className="w-full h-auto px-5 py-4">
        <GoBack />
      </div>
      {children}
    </main>
  );
};

export default Layout;
