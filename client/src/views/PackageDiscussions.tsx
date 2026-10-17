import { useEffect, useState } from "react";
import type { Discussion as DiscussionType } from "../../../src/discussion/discussion.domain";
import { Link, useParams } from "react-router-dom";

export const PackageDiscussions = () => {
  const { id } = useParams();
  const [discussions, setDiscussions] = useState<DiscussionType[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/packages/${id}/discussions`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setDiscussions(data));
  }, [id]);

  return (
    <>
      <h1>Discussions</h1>

        <Link to={`/packages/${id}`}>Overview</Link>
        <Link to="#">Discussions</Link>

      {discussions.map((discussion) => (
        <div key={discussion.id}>
          <h2>{discussion.title}</h2>

          <p>
            Author:{" "}
            <Link to={`/users/${discussion.author}`}>
              {discussion.author}
            </Link>
          </p>

          <p>
            Consumer:{" "}
            <Link to={`/consumers/${discussion.consumer}`}>
              {discussion.consumer}
            </Link>
          </p>

          <p>Discussion: DIS-{discussion.index}</p>
        </div>
      ))}

      <Link to={`/packages/${id}`}>Go back</Link>
    </>
  );
};
