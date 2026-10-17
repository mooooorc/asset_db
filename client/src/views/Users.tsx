import { useEffect, useState } from "react";
import type { User as UserType } from "../../../src/user/user.domain";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/breadcrumb/Breadcrumb";
import { Button } from "../components/button/Button";
import { Search } from "../components/search/Search";

export const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleRoleChange = (role: string) => {
    setRoles((currentRoles) =>
      currentRoles.includes(role)
        ? currentRoles.filter((currentRole) => currentRole !== role)
        : [...currentRoles, role],
    );
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, roles }),
    });

    if (!response.ok) {
      console.error(await response.json());
      return;
    }

    const newUser = await response.json();
    setUsers((currentUsers) => [...currentUsers, newUser]);

    setName("");
    setEmail("");
    setPassword("");
    setRoles([]);
    setShowCreateUser(false);
  };

  return (
      <>
      <header className="toolbar">
        <Breadcrumb
          items={[
            {
              label: "Users",
              count: users.length,
              
            }
          ]}
        />

        <div className="toolbar-actions">

          <Search />
          <Button label="New user" onClick={() => setShowCreateUser(true)}/>
            
        </div>
      </header>
      
      <div className="content">
        
        <div className="table">
          <header className="header">
            <span>Name</span>
            <span>User tag</span>
            <span>Roles</span>
          </header>

          <hr />

          <div className="body">
            <div className="table-content"></div>
          </div>
          <hr />
          <footer className="footer">
            <span>Users: {users.length}</span>
          </footer>
        </div>
        
      </div>
      </>

      

     

  );
};
