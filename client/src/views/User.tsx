import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {User as UserType} from "../../../src/user/user.domain"

export const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, [id]);

  if (!user) {
  return <p>Loading...</p>;
}

  return (
    <>
      <h1>{user.name}</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <Link to="/users">Go back</Link>
    </>
  );
};