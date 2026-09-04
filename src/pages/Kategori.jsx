import { useMemo, useState } from "react";
import { useStock } from "../context/StockContext";
import { useAuth } from "../context/AuthContext";

function Kategori() {
  const { kategori, loading, addKategori, updateKategori, removeKategori } = useStock();
  const { isAdmin } = useAuth();
  const [namaKategori, setNamaKategori] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const klasterKategori = useMemo(() => {
    const total = kategori.length;
    const kategoriDenganNama = kategori.filter(
      (item) => item.nama.trim().length > 0
    ).length;

    return {
      total,
      aktif: kategoriDenganNama,
      tersisa: Math.max(total - kategoriDenganNama, 0),
    };
  }, [kategori]);

  const resetForm = () => {
    setNamaKategori("");
    setEditId(null);
    setShowForm(false);
  };

  const simpanKategori = async (e) => {
    e.preventDefault();
    const namaTerformat = namaKategori.trim();
    if (!namaTerformat) return;

    try {
      if (editId !== null) {
        await updateKategori(editId, { nama: namaTerformat });
      } else {
        await addKategori({ nama: namaTerformat });
      }
    } catch (error) {
      console.error("Gagal menyimpan kategori:", error);
      window.alert("Gagal menyimpan kategori ke MySQL.");
      return;
    }

    resetForm();
  };

  const editKategori = (item) => {
    setNamaKategori(item.nama);
    setEditId(item.id);
    setShowForm(true);
  };

  const hapusKategori = async (id) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus kategori ini?");
    if (!konfirmasi) return;

    try {
      await removeKategori(id);
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      window.alert("Gagal menghapus kategori dari MySQL.");
    }
  };

  const toggleForm = () => {
    if (showForm) {
      resetForm();
      return;
    }
    setShowForm(true);
  };

  if (loading) {
    return <div className="page"><div className="panel"><p>Memuat data kategori dari MySQL...</p></div></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Kategori Produk</h2>
          <p>Kelola klasifikasi barang berdasarkan kebutuhan operasional gudang.</p>
        </div>

        {isAdmin && <button className="primary-button" onClick={toggleForm}>
          {showForm ? "Tutup Form" : "+ Tambah Kategori"}
        </button>}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <p>Total Kategori</p>
            <h2>{klasterKategori.total}</h2>
            <span>Kelompok produk</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p>Kategori Aktif</p>
            <h2>{klasterKategori.aktif}</h2>
            <span>Sudah terpakai</span>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="panel form-panel">
          <div className="panel-header">
            <h3>{editId !== null ? "Edit Kategori" : "Tambah Kategori"}</h3>
            <p>Masukkan nama kategori untuk pengelompokan item di gudang.</p>
          </div>

          <form className="simple-form" onSubmit={simpanKategori}>
            <div className="form-group">
              <label>Nama Kategori</label>
              <input
                type="text"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                placeholder="Contoh: Makanan, Minuman, Perawatan"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editId !== null ? "Simpan Perubahan" : "Simpan Kategori"}
              </button>
              <button type="button" className="cancel-button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="category-grid">
        {kategori.map((item) => (
          <div className="category-card" key={item.id}>
            <div className="category-icon">🏷️</div>
            <div>
              <h3>{item.nama}</h3>
              <p>Kelompok produk</p>
            </div>
            <div className="category-actions">
              {isAdmin && <>
                <button className="edit-button" onClick={() => editKategori(item)}>Edit</button>
                <button className="delete-button" onClick={() => hapusKategori(item.id)}>Hapus</button>
              </>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kategori;
