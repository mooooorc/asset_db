import { useEffect, useState } from "react";
import type { Package as PackageType} from "../../../src/package/package.domain"
import { Link } from "react-router-dom";

export const Packages = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/packages", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setPackages(data));
  }, []);

 

  return (
    <>
      <h1>Packages</h1>

      <pre>{JSON.stringify(packages, null, 2)}</pre>

      {packages.map((pack) => (
    <div key={pack.id}>
      <Link to={`/packages/${pack.id}`}>View {pack.name}</Link>
    </div>
  ))}
    </>
  );
};