import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Package as PackageType } from "../../../src/package/package.domain";

export const Package = () => {
  const { id } = useParams();
  const [pack, setPack] = useState<PackageType | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/packages/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setPack(data));
  }, [id]);

  if (!pack) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{pack.name}</h1>

      <Link to="#">Overview</Link>
      <Link to={`/packages/${id}/discussions`}>Discussions</Link>

      <pre>{JSON.stringify(pack, null, 2)}</pre>

      <Link to="/packages">Go back</Link>
    </>
  );
};
