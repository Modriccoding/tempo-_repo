import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Totem: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest text-white">
      <div className="flex-grow">
        <Navbar />
        <main className="max-w-5xl mx-auto py-16">
          <h1 className="text-5xl font-extrabold mb-8">Totem</h1>
          <p className="text-xl text-gray-300">Page Totem à personnaliser.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Totem;
