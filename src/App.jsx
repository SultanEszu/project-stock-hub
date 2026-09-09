import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/dashboard";
import Barang from "./pages/barang";
import Kategori from "./pages/kategori";
import LowStock from "./pages/LowStock";
import Expired from "./pages/expired";
import Supplier from "./pages/supplier";
import StockLog from "./pages/stockLog";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  const [halamanAktif, setHalamanAktif] =
    useState("Dashboard");

  if (!user) {
    return <Login />;
  }

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

      case "Riwayat Stok":
        return <StockLog />;

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