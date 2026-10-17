import { useEffect, useState } from "react";
import type { Asset as AssetType } from "../../../src/asset/asset.domain";

export const Assets = () => {
  const [assets, setAssets] = useState<AssetType[]>([]);


  useEffect(() => {
    fetch("http://localhost:3000/assets", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setAssets(data));
  }, []);



  return (
    <>
      <h1>Assets</h1>

      <pre>{JSON.stringify(assets, null, 2)}</pre>
     
    </>
  );
};