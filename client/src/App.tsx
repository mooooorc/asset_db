import { useEffect, useState } from "react";


type Definition = {
  id: string;
  name: string;
  valueType?: "string" | "number" | "boolean";
  definitions?: string[];
};

function App() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [valueType, setValueType] =
    useState<"string" | "number" | "boolean">("string");

  useEffect(() => {
    fetch("http://localhost:3000/definitions")
      .then((response) => response.json())
      .then(setDefinitions);
  }, []);

  const createDefinition = async () => {
    await fetch("http://localhost:3000/definitions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        valueType,
      }),
    });

    setName("");
    setValueType("string");
    setIsModalOpen(false);

    const response = await fetch("http://localhost:3000/definitions");
    const definitions = await response.json();
    setDefinitions(definitions);
  };

 const deleteDefinition = async (id: string) => {
  await fetch(`http://localhost:3000/definitions/${id}`, {
    method: "DELETE",
  });

  const response = await fetch("http://localhost:3000/definitions");
  const definitions = await response.json();

  setDefinitions(definitions);
};

  return (
    <>
      <h1>AssetDB</h1>

      <button onClick={() => setIsModalOpen(true)}>
        Create
      </button>

      <div className="table">
        <div className="row header">
          <div>Name</div>
          <div>Type</div>
          <div>ID</div>
          <div></div>
        </div>

        {definitions.map((definition) => (
          <div className="row" key={definition.id}>
            <div>{definition.name}</div>
            <div>
              {definition.valueType ??
                `Composite (${definition.definitions?.length ?? 0})`}
            </div>
            <div>{definition.id}</div>
            <div>
    <button onClick={() => deleteDefinition(definition.id)}>
      🗑️
    </button>
  </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div>
          <h2>Create definition</h2>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />

          <select
            value={valueType}
            onChange={(event) =>
              setValueType(
                event.target.value as
                  | "string"
                  | "number"
                  | "boolean",
              )
            }
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>

          <button onClick={createDefinition}>
            Create
          </button>

          <button onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}

export default App;