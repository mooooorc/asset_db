import { useEffect, useState } from "react";

type Package = {
  id: string;
  name: string;
};

type PackageInstance = {
  assetId: string;
  instanceId: string;
};

export function PackageView() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [instances, setInstances] = useState<PackageInstance[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/packages")
      .then((response) => response.json())
      .then(setPackages);
  }, []);

  useEffect(() => {
    if (!selectedPackage) {
      return;
    }

    fetch(
      `http://localhost:3000/packages/${selectedPackage}/instances`,
    )
      .then((response) => response.json())
      .then(setInstances);
  }, [selectedPackage]);

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
        <h4>Packages</h4>
      </div>

      <select
        value={selectedPackage}
        onChange={(event) => setSelectedPackage(event.target.value)}
      >
        <option value="">Select a Package</option>

        {packages.map((pck) => (
          <option key={pck.id} value={pck.id}>
            {pck.name}
          </option>
        ))}
      </select>

      {selectedPackage && (
        <div className="table">
          <div className="row header">
            <div>Asset</div>
            <div>Instance</div>
          </div>

          {instances.map((instance) => (
            <div
              className="row"
              key={`${instance.assetId}-${instance.instanceId}`}
            >
              <div>{instance.assetId}</div>
              <div>{instance.instanceId}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}