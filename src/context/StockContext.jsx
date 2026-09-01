import { createContext, useContext, useState } from "react";
import { barangData, kategoriData, supplierData } from "../data/dummyData";

const StockContext = createContext();

export function StockProvider({ children }) {
  const [barang, setBarang] = useState(barangData);
  const [kategori, setKategori] = useState(kategoriData);
  const [supplier, setSupplier] = useState(supplierData);

  return (
    <StockContext.Provider
      value={{
        barang,
        setBarang,
        kategori,
        setKategori,
        supplier,
        setSupplier,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}