import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function fetchCollection(resource, token) {
  const response = await fetch(`${API_BASE}/api/${resource}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data ${resource}`);
  }

  return response.json();
}

async function createItem(resource, payload, token) {
  const response = await fetch(`${API_BASE}/api/${resource}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gagal menambah ${resource}`);
  }

  return response.json();
}

async function updateItem(resource, id, payload, token) {
  const response = await fetch(`${API_BASE}/api/${resource}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gagal memperbarui ${resource}`);
  }

  return response.json();
}

async function deleteItem(resource, id, token) {
  const response = await fetch(`${API_BASE}/api/${resource}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Gagal menghapus ${resource}`);
  }

  return response.json();
}

const StockContext = createContext();

export function StockProvider({ children }) {
  const { token } = useAuth();
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    const [barangResult, kategoriResult, supplierResult] = await Promise.all([
      fetchCollection("barang", token),
      fetchCollection("kategori", token),
      fetchCollection("supplier", token),
    ]);

    setBarang(barangResult);
    setKategori(kategoriResult);
    setSupplier(supplierResult);
  };

  const refreshStockLogs = useCallback(async () => {
    const result = await fetchCollection("stock-logs", token);
    setStockLogs(result);
    return result;
  }, [token]);

  const addBarang = async (item) => {
    const saved = await createItem("barang", item, token);
    setBarang((prev) => [...prev, saved]);
    return saved;
  };

  const updateBarang = async (id, item) => {
    const saved = await updateItem("barang", id, item, token);
    setBarang((prev) => prev.map((row) => (row.id === id ? saved : row)));
    return saved;
  };

  const removeBarang = async (id) => {
    await deleteItem("barang", id, token);
    setBarang((prev) => prev.filter((row) => row.id !== id));
  };

  const addKategori = async (item) => {
    const saved = await createItem("kategori", item, token);
    setKategori((prev) => [...prev, saved]);
    return saved;
  };

  const updateKategori = async (id, item) => {
    const saved = await updateItem("kategori", id, item, token);
    setKategori((prev) => prev.map((row) => (row.id === id ? saved : row)));
    return saved;
  };

  const removeKategori = async (id) => {
    await deleteItem("kategori", id, token);
    setKategori((prev) => prev.filter((row) => row.id !== id));
  };

  const addSupplier = async (item) => {
    const saved = await createItem("supplier", item, token);
    setSupplier((prev) => [...prev, saved]);
    return saved;
  };

  const updateSupplier = async (id, item) => {
    const saved = await updateItem("supplier", id, item, token);
    setSupplier((prev) => prev.map((row) => (row.id === id ? saved : row)));
    return saved;
  };

  const removeSupplier = async (id) => {
    await deleteItem("supplier", id, token);
    setSupplier((prev) => prev.filter((row) => row.id !== id));
  };

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      if (!token) {
        if (!ignore) {
          setLoading(false);
        }
        return;
      }

      try {
        const [barangResult, kategoriResult, supplierResult] = await Promise.all([
          fetchCollection("barang", token),
          fetchCollection("kategori", token),
          fetchCollection("supplier", token),
        ]);

        if (!ignore) {
          setBarang(barangResult);
          setKategori(kategoriResult);
          setSupplier(supplierResult);
        }
      } catch (error) {
        console.error("Gagal memuat data dari MySQL:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [token]);

  return (
    <StockContext.Provider
      value={{
        barang,
        setBarang,
        kategori,
        setKategori,
        supplier,
        setSupplier,
        stockLogs,
        refreshStockLogs,
        loading,
        refreshData,
        addBarang,
        updateBarang,
        removeBarang,
        addKategori,
        updateKategori,
        removeKategori,
        addSupplier,
        updateSupplier,
        removeSupplier,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}