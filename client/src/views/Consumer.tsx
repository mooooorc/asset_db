import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {Consumer as ConsumerType} from "../../../src/consumer/consumer.domain"


export const Consumer = () => {
  const { id } = useParams();
  const [consumer, setConsumer] = useState<ConsumerType | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/consumers/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setConsumer(data));
  }, [id]);

  if (!consumer) {
  return <p>Loading...</p>;
}

  return (
    <>
      <h1>{consumer.name}</h1>

      <pre>{JSON.stringify(consumer, null, 2)}</pre>

      <Link to="/consumers">Go back</Link>
    </>
  );
};