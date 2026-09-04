import { useMemo, useState } from "react";
import { useStock } from "../context/StockContext";
import { useAuth } from "../context/AuthContext";

const formAwal = {
  nama: "",
  kontak: "",
  telepon: "",
  email: "",
};

function Supplier() {
  const { supplier, loading, addSupplier, updateSupplier, removeSupplier } = useStock();
  const { isAdmin } = useAuth();
  const [form, setForm] = useState(formAwal);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const ringkasanSupplier = useMemo(() => {
    const jumlahSupplier = supplier.length;
    const totalKontak = supplier.reduce(
      (total, item) => total + (item.kontak ? 1 : 0),
      0
    );

    return { jumlahSupplier, totalKontak };
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(formAwal);
    setEditId(null);
    setShowForm(false);
  };

  const simpanSupplier = async (e) => {
    e.preventDefault();

    const dataBaru = {
      nama: form.nama.trim(),
      kontak: form.kontak.trim(),
      telepon: form.telepon.trim(),
      email: form.email.trim(),
    };

    if (!dataBaru.nama || !dataBaru.kontak || !dataBaru.telepon || !dataBaru.email) {
      return;
    }

    try {
      if (editId !== null) {
        await updateSupplier(editId, dataBaru);
      } else {
        await addSupplier(dataBaru);
      }
    } catch (error) {
      console.error("Gagal menyimpan supplier:", error);
      window.alert("Gagal menyimpan supplier ke MySQL.");
      return;
    }

    resetForm();
  };

  const editSupplier = (item) => {
    setForm({
      nama: item.nama,
      kontak: item.kontak,
      telepon: item.telepon,
      email: item.email,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const hapusSupplier = async (id) => {
    const yakin = window.confirm("Apakah Anda yakin ingin menghapus supplier ini?");
    if (!yakin) return;

    try {
      await removeSupplier(id);
    } catch (error) {
      console.error("Gagal menghapus supplier:", error);
      window.alert("Gagal menghapus supplier dari MySQL.");
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
    return <div className="page"><div className="panel"><p>Memuat data supplier dari MySQL...</p></div></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Supplier</h2>
          <p>Kelola mitra pemasok untuk menunjang kelancaran distribusi stok.</p>
        </div>

        {isAdmin && <button className="primary-button" onClick={toggleForm}>
          {showForm ? "Tutup Form" : "+ Tambah Supplier"}
        </button>}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <p>Total Supplier</p>
            <h2>{ringkasanSupplier.jumlahSupplier}</h2>
            <span>Partner aktif</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <p>Kontak Tersedia</p>
            <h2>{ringkasanSupplier.totalKontak}</h2>
            <span>Data kontak lengkap</span>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="panel form-panel">
          <div className="panel-header">
            <h3>{editId !== null ? "Edit Supplier" : "Tambah Supplier"}</h3>
            <p>Masukkan informasi mitra pemasok yang akan mendukung supply chain gudang.</p>
          </div>

          <form className="supplier-form" onSubmit={simpanSupplier}>
            <div className="form-group">
              <label>Nama Supplier</label>
              <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Contoh: PT Sumber Makmur" required />
            </div>

            <div className="form-group">
              <label>Nama Kontak</label>
              <input type="text" name="kontak" value={form.kontak} onChange={handleChange} placeholder="Nama orang yang dapat dihubungi" required />
            </div>

            <div className="form-group">
              <label>Nomor Telepon</label>
              <input type="tel" name="telepon" value={form.telepon} onChange={handleChange} placeholder="Contoh: 081234567890" required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="supplier@email.com" required />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editId !== null ? "Simpan Perubahan" : "Simpan Supplier"}
              </button>
              <button type="button" className="cancel-button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kontak</th>
                <th>Telepon</th>
                <th>Email</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {supplier.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.kontak}</td>
                  <td>{item.telepon}</td>
                  <td>{item.email}</td>
                  <td>
                    {isAdmin && <>
                      <button className="edit-button" onClick={() => editSupplier(item)}>Edit</button>
                      <button className="delete-button" onClick={() => hapusSupplier(item.id)}>Hapus</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Supplier;
