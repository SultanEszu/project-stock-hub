import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Kategori from "./pages/Kategori";
import LowStock from "./pages/LowStock";
import Expired from "./pages/Expired";
import Supplier from "./pages/Supplier";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  const [halamanAktif, setHalamanAktif] =
    useState("Dashboard");
  const [menuTerbuka, setMenuTerbuka] = useState(false);

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

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        halamanAktif={halamanAktif}
        setHalamanAktif={setHalamanAktif}
        menuTerbuka={menuTerbuka}
        tutupMenu={() => setMenuTerbuka(false)}
      />

      <main className="main-content">
        <Header
          halamanAktif={halamanAktif}
          bukaMenu={() => setMenuTerbuka(true)}
        />

        <section className="content">
          {tampilkanHalaman()}
        </section>
      </main>
    </div>
  );
}

export default App;