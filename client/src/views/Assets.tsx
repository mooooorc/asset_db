import { useEffect, useState } from "react";
import "../App.css"

type Definition = {
  id: string;
  name: string;
  description?: string;
  type?: "string" | "number" | "boolean";
  definitions?: string[];
};

type AssetDefinition = {
  definition: string;
  required?: true;
  identifiable?: true;
};

type Asset = {
  id: string;
  name: string;
  description?: string;
  definitions?: AssetDefinition[];
};

type SelectedDefinition = {
  definition: string;
  required: boolean;
  identifiable: boolean;
};

export function AssetsView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [definitions, setDefinitions] = useState<Definition[]>([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDefinitions, setSelectedDefinitions] = useState<
    SelectedDefinition[]
  >([]);

  const loadAssets = async () => {
    const response = await fetch("http://localhost:3000/assets");
    const assets: Asset[] = await response.json();

    setAssets(assets);
  };

  const loadDefinitions = async () => {
    const response = await fetch("http://localhost:3000/definitions");
    const definitions: Definition[] = await response.json();

    setDefinitions(definitions);
  };

  useEffect(() => {
    loadAssets();
    loadDefinitions();
  }, []);

  const addDefinition = (definitionId: string) => {
    if (!definitionId) {
      return;
    }

    if (
      selectedDefinitions.some(
        (selected) => selected.definition === definitionId,
      )
    ) {
      return;
    }

    setSelectedDefinitions((current) => [
      ...current,
      {
        definition: definitionId,
        required: false,
        identifiable: false,
      },
    ]);
  };

  const removeDefinition = (definitionId: string) => {
    setSelectedDefinitions((current) =>
      current.filter((selected) => selected.definition !== definitionId),
    );
  };

  const updateDefinition = (
    definitionId: string,
    changes: Partial<SelectedDefinition>,
  ) => {
    setSelectedDefinitions((current) =>
      current.map((selected) => {
        if (selected.definition !== definitionId) {
          return selected;
        }

        const updated = {
          ...selected,
          ...changes,
        };

        if (changes.identifiable === true) {
          updated.required = true;
        }

        return updated;
      }),
    );
  };

  const createAsset = async () => {
    const payload = {
      id,
      name,
      description: description || undefined,
      definitions: selectedDefinitions.map((selected) => ({
        definition: selected.definition,
        ...(selected.required && { required: true }),
        ...(selected.identifiable && { identifiable: true }),
      })),
    };

    const response = await fetch("http://localhost:3000/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }

    await loadAssets();

    setId("");
    setName("");
    setDescription("");
    setSelectedDefinitions([]);
  };

  return (
    <main className="def-main">
      <section className="main-view">
        <h1 className="page-title">Assets</h1>

        <div className="asset-table">
          <div className="header"></div>

          {assets.map((asset) => (
            <div className="asset-ui" key={asset.id}>
              <div className="asset-main-info">
                <span className="asset-name">{asset.name}</span>
                <span className="asset-id">{asset.id}</span>
              </div>

              {asset.description && (
                <span className="asset-desc">{asset.description}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <aside className="new-def">
        <h2 className="page-title">New asset</h2>

        <label>
          ID
          <input
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
        </label>

        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label>
          Definitions
          <select
            value=""
            onChange={(event) => addDefinition(event.target.value)}
          >
            <option value="">Select a definition</option>

            {definitions
              .filter(
                (definition) =>
                  !selectedDefinitions.some(
                    (selected) => selected.definition === definition.id,
                  ),
              )
              .map((definition) => (
                <option key={definition.id} value={definition.id}>
                  {definition.name} [{definition.id}]
                </option>
              ))}
          </select>
        </label>

        <div className="asset-definitions">
          {selectedDefinitions.map((selected) => {
            const definition = definitions.find(
              (definition) => definition.id === selected.definition,
            );

            if (!definition) {
              return null;
            }

            return (
              <div
                className="asset-definition"
                key={selected.definition}
              >
                <div className="asset-definition-info">
                  <span>{definition.name}</span>
                  <span className="asset-id">
                    {definition.id}
                  </span>
                </div>

                <label>
                  <input
                    type="checkbox"
                    checked={selected.required}
                    disabled={selected.identifiable}
                    onChange={(event) =>
                      updateDefinition(selected.definition, {
                        required: event.target.checked,
                      })
                    }
                  />
                  Required
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={selected.identifiable}
                    onChange={(event) =>
                      updateDefinition(selected.definition, {
                        identifiable: event.target.checked,
                      })
                    }
                  />
                  Identifiable
                </label>

                <button
                  type="button"
                  onClick={() => removeDefinition(selected.definition)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div>
          <button type="button">Cancel</button>

          <button type="button" onClick={createAsset}>
            Save
          </button>
        </div>
      </aside>
    </main>
  );
}