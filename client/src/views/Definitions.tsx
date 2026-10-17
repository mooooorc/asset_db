import { useEffect, useState } from "react";
import type {Definition as DefinitionType} from "../../../src/definition/definition.domain"


export const Definitions = () => {
  const [definitions, setDefinitions] = useState<DefinitionType[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/definitions", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setDefinitions(data));
  }, []);

  return (
    <>
        <div className="toolbar">
    <div className="breadcrumb">
        <span>Build</span>
        <span> &gt; </span>
        <span>Definitions <span>{definitions.length}</span></span>
    </div>
    </div>

      <pre>{JSON.stringify(definitions, null, 2)}</pre>
    </>
  );
};