import { useEffect, useState } from "react";
import type {Consumer as ConsumerType} from "../../../src/consumer/consumer.domain"
import { Link } from "react-router-dom";

export const Consumers = () => {
  const [consumers, setConsumers] = useState<ConsumerType[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/consumers", {
        credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => setConsumers(data));
  }, []);



  return (
    <>

   <div className="toolbar">
    <div className="breadcrumb">
        <span>Administrate</span>
        <span> &gt; </span>
        <span>Users <span>{consumers.length}</span></span>
    </div>
    </div>

  <pre>{JSON.stringify(consumers, null, 2)}</pre>

  {consumers.map((consumer) => (
    <div key={consumer.id}>
      <Link to={`/consumers/${consumer.id}`}>View {consumer.name}</Link>
    </div>
  ))}
</>
  );
};