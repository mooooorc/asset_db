import { useEffect, useState } from "react";

type Definition = {
  id: string;
  name: string;
  description?: string;
  type?: "string" | "number" | "boolean";
  definitions?: string[];
};

type DefinitionRowProps = {
  definition: Definition;
  definitions: Definition[];
  onDelete: (id: string) => void;
  nested?: boolean;
};

function DefinitionRow({
  definition,
  definitions,
  onDelete,
  nested = false,
}: DefinitionRowProps) {
  const { name, id, type, description, definitions: childIds } = definition;

  const children =
    childIds
      ?.map((childId) =>
        definitions.find((definition) => definition.id === childId),
      )
      .filter(
        (definition): definition is Definition => definition !== undefined,
      ) ?? [];

  const isComposite = childIds !== undefined;

  return (
    <div className={`def-ui ${nested ? "def-ui-nested" : ""}`}>
      <div className="def-main-info">
        <span className="def-name">{name}</span>
        <span className="def-id">{id}</span>
        <hr />
        <span className="def-type">
          {isComposite ? `Composite (${children.length})` : type}
        </span>

        {!nested && (
          <button type="button" onClick={() => onDelete(id)}>
            Delete
          </button>
        )}
      </div>

      {description && <span className="def-desc">{description}</span>}

      {isComposite && children.length > 0 && (
        <div className="def-children">
          {children.map((child) => (
            <DefinitionRow
              key={child.id}
              definition={child}
              definitions={definitions}
              onDelete={onDelete}
              nested
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DefinitionsView() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isComposite, setIsComposite] = useState(false);
  const [type, setType] = useState<"string" | "number" | "boolean">("string");
  const [selectedDefinitions, setSelectedDefinitions] = useState<string[]>([]);

  const loadDefinitions = async () => {
    const response = await fetch("http://localhost:3000/definitions");
    const definitions: Definition[] = await response.json();

    setDefinitions(definitions);
  };

  useEffect(() => {
    loadDefinitions();
  }, []);

  const createDefinition = async () => {
    const payload = isComposite
      ? {
          id,
          name,
          description: description || undefined,
          definitions: selectedDefinitions,
        }
      : {
          id,
          name,
          description: description || undefined,
          type,
        };

    const response = await fetch("http://localhost:3000/definitions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }

    await loadDefinitions();

    setId("");
    setName("");
    setDescription("");
    setIsComposite(false);
    setType("string");
    setSelectedDefinitions([]);
  };

  const deleteDefinition = async (id: string) => {
    const confirmed = window.confirm(`Delete definition "${id}"?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`http://localhost:3000/definitions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    await loadDefinitions();
  };

  return (
    <main className="def-main">
      <section className="main-view">
        <h1 className="page-title">Definitions</h1>

      

        <div className="def-table">
          <div className="header"></div>

          {definitions.map((definition) => (
            <DefinitionRow
              key={definition.id}
              definition={definition}
              definitions={definitions}
              onDelete={deleteDefinition}
            />
          ))}
        </div>
      </section>

      <aside className="new-def">
        <h2 className="page-title">New definition</h2>

        <label>
          ID
          <input value={id} onChange={(event) => setId(event.target.value)} />
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
          <input
            type="checkbox"
            checked={isComposite}
            onChange={(event) => setIsComposite(event.target.checked)}
          />
          Composite definition
        </label>

        {isComposite ? (
          <label>
            Definitions
            <select
              multiple
              value={selectedDefinitions}
              onChange={(event) => {
                const values = Array.from(
                  event.target.selectedOptions,
                  (option) => option.value,
                );

                setSelectedDefinitions(values);
              }}
            >
              {definitions.map((definition) => (
                <option key={definition.id} value={definition.id}>
                  {definition.name} [{definition.id}]
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Type
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as "string" | "number" | "boolean")
              }
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
          </label>
        )}

        <div>
          <button type="button">Cancel</button>
          <button type="button" onClick={createDefinition}>
            Save
          </button>
        </div>
      </aside>
    </main>
  );
}
