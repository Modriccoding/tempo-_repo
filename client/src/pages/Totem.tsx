import React from "react";
import Navbar from "../components/Navbar";

const Totem: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto py-16">
        <h1 className="text-5xl font-extrabold mb-8">Totem</h1>
        <p className="text-xl text-gray-300">Page Totem à personnaliser.</p>
      </main>
    </div>
  );
};

export default Totem;
