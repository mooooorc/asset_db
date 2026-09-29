import { NavLink, Route, Routes } from "react-router";

import "./App.css";
import { DefinitionsView } from "./views/Definitions";
import { AssetsView } from "./views/Assets";

function Home() {
  return <h1>AssetDB</h1>;
}

function Definitions() {
  return <DefinitionsView />;
}

function Assets() {
  return <AssetsView />;
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

const assets = await fetch("http://localhost:3000/assets").then((res) => res.json())
const assetsCount = assets.length

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

         <NavLink
          className={({ isActive }) => `link ${isActive ? "link-active" : ""}`}
          to="/assets"
        >
          <span className="nav-title">Assets</span>
          <span className="nav-counter">{assetsCount}</span>
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
