import { useEffect, useState } from "react";
import type { Definition } from "./Definitions";



type Asset = {
  id: string;
  name: string;
  definitions: string[];
};

type Instance = {
  asset_db_id: string;
  type: string;
  properties: Record<string, unknown>;
};

export function InstancesView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState<Record<string, unknown>>({});

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

  useEffect(() => {
    if (!selectedAsset) {
      return;
    }

    fetch(`http://localhost:3000/instances/${selectedAsset}`)
      .then((response) => response.json())
      .then(setInstances);
  }, [selectedAsset]);

  const selectedAssetDefinitions =
    assets
      .find((asset) => asset.id === selectedAsset)
      ?.definitions
      .map((definitionId) =>
        definitions.find(
          (definition) => definition.id === definitionId,
        ),
      )
      .filter(
        (definition): definition is Definition =>
          definition !== undefined,
      ) ?? [];

  const createInstance = async () => {
    await fetch("http://localhost:3000/instances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: selectedAsset,
        properties,
      }),
    });

    setProperties({});
    setIsModalOpen(false);

    const response = await fetch(
      `http://localhost:3000/instances/${selectedAsset}`,
    );

    const instances = await response.json();

    setInstances(instances);
  };

  const deleteInstance = async (
  type: string,
  assetDbId: string,
) => {
  await fetch(
    `http://localhost:3000/instances/${type}/${assetDbId}`,
    {
      method: "DELETE",
    },
  );

  const response = await fetch(
    `http://localhost:3000/instances/${selectedAsset}`,
  );

  const instances = await response.json();

  setInstances(instances);
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
        <h4>Instances</h4>

        {selectedAsset && (
          <button
            style={{ height: "32px" }}
            onClick={() => setIsModalOpen(true)}
          >
            Create
          </button>
        )}
      </div>

      <select
        value={selectedAsset}
        onChange={(event) => {
          setSelectedAsset(event.target.value);
          setProperties({});
        }}
      >
        <option value="">Select an Asset</option>

        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.name}
          </option>
        ))}
      </select>

      {selectedAsset && (
        <div className="table">
          <div className="row header">
           

            {selectedAssetDefinitions.map((definition) => (
              <div key={definition.id}>{definition.name}</div>
            ))}

            <div></div>
          </div>

          {instances.map((instance) => (
            <div className="row" key={instance.asset_db_id}>
              

              {selectedAssetDefinitions.map((definition) => (
                <div key={definition.id}>
                  {String(instance.properties[definition.id] ?? "")}
                </div>
              ))}

              <div>
                <button
  onClick={() =>
    deleteInstance(instance.type, instance.asset_db_id)
  }
>
  🗑️
</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div>
          <h2>Create instance</h2>

          {selectedAssetDefinitions.map((definition) => (
            <div key={definition.id}>
              <label>
                {definition.name}

                <input
                  value={String(properties[definition.id] ?? "")}
                  onChange={(event) =>
                    setProperties((current) => ({
                      ...current,
                      [definition.id]: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          ))}

          <button onClick={createInstance}>Create</button>

          <button onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}