import { useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import "./index.css";
import TableAtividades from "./components/Table/TableAtividades";

function App() {

  return (
    <div className="p-5">
      <div className="nav relative flex items-center w-full">
        <img src="/img/LogoPreto.png" className="logo shadow-lg" alt="Logo" />
      </div>
      <div className="mt-[2%]">
        <div className="min-w-[100%] max-w-[100%]  min-h-[80vh] p-6 rounded-[15px] shadow bg-[#d7d4e6]">
          <TableAtividades />
        </div> 
      </div>
    </div>
  );
}

export default App;
