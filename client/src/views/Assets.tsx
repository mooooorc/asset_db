import { useEffect, useState } from "react";
import type { Definition } from "./Definitions";

type Asset = {
  id: string;
  name: string;
  definitions: string[];
};

export function AssetsView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [selectedDefinitions, setSelectedDefinitions] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/assets")
      .then((response) => response.json())
      .then(setAssets);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/definitions")
      .then((response) => response.json())
      .then(setDefinitions);
  }, []);

  const createAsset = async () => {
    await fetch("http://localhost:3000/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        definitions: selectedDefinitions,
      }),
    });

    setId("");
    setName("");
    setSelectedDefinitions([]);
    setIsModalOpen(false);

    const response = await fetch("http://localhost:3000/assets");
    const assets = await response.json();

    setAssets(assets);
  };

  const deleteAsset = async (id: string) => {
    await fetch(`http://localhost:3000/assets/${id}`, {
      method: "DELETE",
    });

    const response = await fetch("http://localhost:3000/assets");
    const assets = await response.json();

    setAssets(assets);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4>Assets</h4>

        <button style={{ height: "32px" }} onClick={() => setIsModalOpen(true)}>
          Create
        </button>
      </div>

      <div className="table">
        <div className="row header">
          <div>Id</div>
          <div>Name</div>
          <div>Definitions</div>
          <div></div>
        </div>

        {assets.map((asset) => (
          <div className="row" key={asset.id}>
            <div>{asset.id}</div>
            <div>{asset.name}</div>
            <div>{asset.definitions.length}</div>
            <div>
              <button onClick={() => deleteAsset(asset.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div>
          <h2>Create asset</h2>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />

          <h3>Definitions</h3>

          {definitions.map((definition) => (
            <div key={definition.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedDefinitions.includes(definition.id)}
                  onChange={() => {
                    setSelectedDefinitions((current) =>
                      current.includes(definition.id)
                        ? current.filter((id) => id !== definition.id)
                        : [...current, definition.id],
                    );
                  }}
                />

                {definition.name}
              </label>
            </div>
          ))}

          <button onClick={createAsset}>Create</button>

          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}
