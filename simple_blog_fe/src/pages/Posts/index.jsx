import { Outlet } from "react-router-dom";
export default function Posts() {
  return (
    <>
      <h1>This is Posts Page !</h1>
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </>
  );
}
