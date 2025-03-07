// src/app/panel/index.tsx
"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

// Import pages
import Home from "./pages/Home";
import Play from "./pages/Play";
import Cart from "./pages/Cart";
import Bets from "./pages/Bets";
import Profile from "./pages/Profile";

type PanelRoute = "PROFILE" | "PLAY" | "CART" | "BETS" | "Inicio";

export default function Panel() {
  const [currentRoute, setCurrentRoute] = useState<PanelRoute>("Inicio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Render the content
  const renderContent = () => {
    switch (currentRoute) {
      case "Inicio":
        return <Home setCurrentRoute={setCurrentRoute} />;
      case "PLAY":
        return <Play />;
      case "CART":
        return <Cart />;
      case "BETS":
        return <Bets />;
      case "PROFILE":
        return <Profile />;
      default:
        return <Home setCurrentRoute={setCurrentRoute} />;
    }
  };

  // Handler to open/close sidebar from hamburger
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handler to close sidebar from inside the sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Hamburger Button */}
      <div className="relative top-0 left-4">
        <button
          onClick={toggleSidebar}
          className="text-[#042460] hover:text-blue-600 text-4xl font-extrabold "
        >
          &#9776; {/* Simple hamburger icon: ≡ */}
        </button>
      </div>
      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
          isOpen={isSidebarOpen}
          onClose={closeSidebar} // pass the onClose prop
        />

        {/* Main content */}
        <main
          className={`
    flex-grow p-4 transition-all duration-300 bg-cover bg-center bg-no-repeat
    ${isSidebarOpen ? "ml-64" : "ml-0"}
  `}
        >
          <div className=" bg-white rounded-lg p-4 shadow-md max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
