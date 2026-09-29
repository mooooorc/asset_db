import { NavLink, Route, Routes } from "react-router";

import "./App.css";
import { DefinitionsView } from "./views/Definitions";

function Home() {
  return <h1>AssetDB</h1>;
}

function Definitions() {
  return <DefinitionsView />;
}

function Assets() {
  return <h1>Assets</h1>;
}

function Instances() {
  return <h1>Instances</h1>;
}

function Packages() {
  return <h1>Packages</h1>;
}

function Consumers() {
  return <h1>Consumers</h1>;
}

const definitions = await fetch("http://localhost:3000/definitions").then((res) => res.json());
const definitionsCount = definitions.length;

function App() {
  return (
    <>
      <nav className="main-nav">
        <NavLink
          className={({ isActive }) => `link ${isActive ? "link-active" : ""}`}
          to="/definitions"
        >
          <span className="nav-title">Definitions</span>
          <span className="nav-counter">{definitionsCount}</span>
        </NavLink>
        
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/definitions" element={<Definitions />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/instances" element={<Instances />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/consumers" element={<Consumers />} />
      </Routes>
    </>
  );
}

export default App;
