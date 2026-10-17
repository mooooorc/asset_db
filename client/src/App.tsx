
import './App.css'
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SignIn } from "./views/SignIn";
import type { User as UserType } from '../../src/user/user.domain';


const App = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/users/me", {
      credentials: "include",
    })
      .then((response) => {
        setAuthenticated(response.ok);

        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setUser(data);
        }
      });
  }, []);

  if (authenticated === null || (authenticated && !user)) {
    return <p>Checking session...</p>;
  }

  if (!authenticated) {
    return <SignIn />;
  }

  if (!user) {
    return <h1> Loading...</h1>
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-group general">
          <Link to="#">Inbox</Link>
        </div>

        {user.roles.includes("Builder") && (
          <div className="sidebar-group builder">
            <h4>Build</h4>
            <Link to="#">Overview</Link>
            <Link to="/definitions">Definitions</Link>
            <Link to="/assets">Assets</Link>
            <Link to="/packages">Packages</Link>
          </div>
        )}

        {user.roles.includes("Admin") && (
          <div className="sidebar-group admin">
            <h4>Administrate</h4>
            <Link to="/users">Users</Link>
            <Link to="/consumers">Consumers</Link>
          </div>
        )}

        {user.roles.includes("Viewer") && (
          <div className="sidebar-group explorer">
            <h4>Explore</h4>
            <Link to="#">Your discussions</Link>
          </div>
        )}
      </aside>

      <main className="main">
        <div className="main-content">
          
        <Outlet />
        </div>
      </main>
    </div>
  );
};

export default App;