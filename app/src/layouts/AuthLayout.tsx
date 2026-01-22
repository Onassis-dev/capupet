import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="bg-sidebar flex flex-col min-h-screen items-center pt-12 sm:pt-32">
      <Outlet />
    </div>
  );
}
