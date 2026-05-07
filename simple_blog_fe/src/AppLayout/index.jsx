import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Error404 from "../pages/Error404";
import Posts from "../pages/Posts";
import PostLists from "../pages/Posts/PostLists";
import PostDetail from "../pages/Posts/PostDetail";
import { useState, useEffect } from "react";
import Login from "../pages/Login";
import Stats from "../pages/Stats";
import NewPost from "../pages/NewPost";
import ProtectedRoute from "../ProtectedRoute";
import Register from "../pages/Register";
import EditPost from "../pages/EditPost";

function AppLayout() {
  const [user, setUser] = useState();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/users/me", {
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const currentUser = await res.json();
          setUser(currentUser);
        }
      } finally {
        setLoadingAuth(false);
      }
    }
    fetchMe();
  }, []);
  const navigate = useNavigate();
  async function logOut() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }
  if (loadingAuth) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <nav style={{ margin: 10 }}>
        <NavLink to="/" style={{ padding: 5 }}>
          Home
        </NavLink>
        <NavLink to="/about" style={{ padding: 5 }}>
          About
        </NavLink>
        <NavLink to="/posts" style={{ padding: 5 }}>
          Posts
        </NavLink>
        {!user && <span> | </span>}
        {user && (
          <NavLink to="/newpost" style={{ padding: 5 }}>
            New Post
          </NavLink>
        )}
        {user && (
          <NavLink to="/stats" style={{ padding: 5 }}>
            Stats
          </NavLink>
        )}
        {!user && (
          <NavLink to="/login" style={{ padding: 5 }}>
            Login
          </NavLink>
        )}
        {user && <span> | </span>}
        {user && (
          <span onClick={logOut} style={{ padding: 5, cursor: "pointer" }}>
            Logout
          </span>
        )}
        {!user && (
          <NavLink to="/register" style={{ padding: 5 }}>
            Register
          </NavLink>
        )}
      </nav>
      {/* prettier-ignore */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<Posts />}>
          <Route index element={<PostLists />} />
          <Route path=":slug" element={<ProtectedRoute user = {user}><PostDetail user = {user} /></ProtectedRoute>} />
          <Route path=":slug/edit" element={<ProtectedRoute user={user}><EditPost /></ProtectedRoute>} />
        </Route>
        <Route path="/newpost" element={<ProtectedRoute user={user}><NewPost /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute user={user}><Stats user={user} /></ProtectedRoute>} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element= {<Register/>}/>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default AppLayout;
