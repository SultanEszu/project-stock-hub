import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Kategori from "./pages/Kategori";
import LowStock from "./pages/LowStock";
import Expired from "./pages/Expired";
import Supplier from "./pages/Supplier";

function App() {
  const [halamanAktif, setHalamanAktif] =
    useState("Dashboard");

  const tampilkanHalaman = () => {
    switch (halamanAktif) {
      case "Dashboard":
        return <Dashboard />;

      case "Manajemen Barang":
        return <Barang />;

      case "Kategori Produk":
        return <Kategori />;

      case "Low Stock Alert":
        return <LowStock />;

      case "Expired Date":
        return <Expired />;

      case "Supplier":
        return <Supplier />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        halamanAktif={halamanAktif}
        setHalamanAktif={setHalamanAktif}
      />

      <main className="main-content">
        <Header halamanAktif={halamanAktif} />

        <section className="content">
          {tampilkanHalaman()}
        </section>
      </main>
    </div>
  );
}

export default App;