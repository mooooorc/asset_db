import { useState } from "react";
import { DefinitionsView } from "./views/Definitions";
import { AssetsView } from "./views/Assets";
import { InstancesView } from "./views/Instances";





function App() {
  const [view, setView] = useState<"definitions" | "assets" | "instances">(
    "definitions",
  );

  

  

  return (
    <>
      <nav>
        <button onClick={() => setView("definitions")}>Definitions</button>

        <button onClick={() => setView("assets")}>Assets</button>

        <button onClick={() => setView("instances")}>Instances</button>
      </nav>
      <hr/>

      {view === "definitions" && (
       <DefinitionsView />
      )}
      {view === "assets" && (
        <AssetsView />
      )}
      {view === "instances" && (
        <>
       <InstancesView />
        </>
      )}
      
    </>
  );
}

export default App;
