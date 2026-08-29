import { useMemo, useState } from "react";
import { barangData } from "../data/dummydata";

const defaultForm = {
  kode: "",
  nama: "",
  kategori: "",
  stok: "",
  satuan: "",
  minimumStok: "",
  supplier: "",
  expiredDate: "",
  rak: "",
  catatan: "",
};

const hitungSisaHari = (tanggal) => {
  if (!tanggal) return null;

  const sekarang = new Date();
  const tanggalExpired = new Date(tanggal);
  const selisih = tanggalExpired - sekarang;

  return Math.ceil(selisih / (1000 * 60 * 60 * 24));
};

const hitungStatusBarang = (item) => {
  const sisaHari = hitungSisaHari(item.expiredDate);
  const stokRendah = Number(item.stok) <= Number(item.minimumStok);

  if (sisaHari !== null && sisaHari <= 7) {
    return { label: "Urgent", className: "danger", level: "Urgent" };
  }

  if (stokRendah) {
    return { label: "Restock", className: "warning", level: "Restock" };
  }

  if (sisaHari !== null && sisaHari <= 30) {
    return { label: "Waspada", className: "warning", level: "Watch" };
  }

  return { label: "Aman", className: "success", level: "Aman" };
};

function Barang() {
  const [barang, setBarang] = useState(barangData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const simpanBarang = (e) => {
    e.preventDefault();

    const dataBarang = {
      id: editId ?? Date.now(),
      kode: form.kode,
      nama: form.nama,
      kategori: form.kategori,
      stok: Number(form.stok),
      satuan: form.satuan,
      minimumStok: Number(form.minimumStok),
      supplier: form.supplier,
      expiredDate: form.expiredDate || null,
      rak: form.rak,
      catatan: form.catatan,
      hargaBeli: 3000,
      hargaJual: 5000,
    };

    if (editId !== null) {
      setBarang((prev) =>
        prev.map((item) => (item.id === editId ? dataBarang : item))
      );
    } else {
      setBarang((prev) => [...prev, dataBarang]);
    }

    resetForm();
  };

  const editBarang = (item) => {
    setForm({
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori,
      stok: item.stok,
      satuan: item.satuan,
      minimumStok: item.minimumStok,
      supplier: item.supplier,
      expiredDate: item.expiredDate || "",
      rak: item.rak || "",
      catatan: item.catatan || "",
    });

    setEditId(item.id);
    setShowForm(true);
  };

  const hapusBarang = (id) => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus barang ini?"
    );

    if (yakin) {
      setBarang((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(false);
  };

  const hasilPencarian = useMemo(() => {
    const keyword = search.toLowerCase();

    return barang.filter((item) => {
      const cocokPencarian =
        item.nama.toLowerCase().includes(keyword) ||
        item.kode.toLowerCase().includes(keyword) ||
        item.kategori.toLowerCase().includes(keyword) ||
        item.supplier.toLowerCase().includes(keyword);

      if (!cocokPencarian) return false;

      if (filterStatus === "Semua") return true;

      return hitungStatusBarang(item).level === filterStatus;
    });
  }, [barang, search, filterStatus]);

  const ringkasan = useMemo(() => {
    const totalItem = barang.length;
    const butuhRestock = barang.filter(
      (item) => Number(item.stok) <= Number(item.minimumStok)
    ).length;
    const dekatExpired = barang.filter((item) => {
      const sisaHari = hitungSisaHari(item.expiredDate);
      return sisaHari !== null && sisaHari <= 30;
    }).length;
    const nilaiEstimasi = barang.reduce((total, item) => {
      return total + Number(item.stok) * Number(item.hargaBeli || 0);
    }, 0);

    return { totalItem, butuhRestock, dekatExpired, nilaiEstimasi };
  }, [barang]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Inventori Barang</h2>
          <p>Monitoring stok, prioritas pengadaan, dan resiko kadaluwarsa.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Tutup Form" : "+ Tambah Barang"}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <p>Total SKU</p>
            <h2>{ringkasan.totalItem}</h2>
            <span>Barang di gudang</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p>Butuh Restock</p>
            <h2>{ringkasan.butuhRestock}</h2>
            <span>Di bawah minimum</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🗓️</div>
          <div className="stat-content">
            <p>Segera Expired</p>
            <h2>{ringkasan.dekatExpired}</h2>
            <span>Dalam 30 hari</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p>Nilai Stok</p>
            <h2>Rp {ringkasan.nilaiEstimasi.toLocaleString("id-ID")}</h2>
            <span>Estimasi persediaan</span>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="panel form-panel">
          <div className="panel-header">
            <h3>{editId !== null ? "Edit Barang" : "Tambah Barang"}</h3>
            <p>
              {editId !== null
                ? "Perbarui data inventori barang."
                : "Input barang baru ke gudang."}
            </p>
          </div>

          <form className="barang-form" onSubmit={simpanBarang}>
            <div className="form-group">
              <label>Kode Barang</label>
              <input
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Contoh: BRG005"
                required
              />
            </div>

            <div className="form-group">
              <label>Nama Barang</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama barang"
                required
              />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <input
                type="text"
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                placeholder="Contoh: Makanan"
                required
              />
            </div>

            <div className="form-group">
              <label>Rak Penyimpanan</label>
              <input
                type="text"
                name="rak"
                value={form.rak}
                onChange={handleChange}
                placeholder="Contoh: A-03"
              />
            </div>

            <div className="form-group">
              <label>Stok</label>
              <input
                type="number"
                name="stok"
                value={form.stok}
                onChange={handleChange}
                placeholder="Jumlah stok"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Satuan</label>
              <input
                type="text"
                name="satuan"
                value={form.satuan}
                onChange={handleChange}
                placeholder="pcs / botol / kotak"
                required
              />
            </div>

            <div className="form-group">
              <label>Minimum Stok</label>
              <input
                type="number"
                name="minimumStok"
                value={form.minimumStok}
                onChange={handleChange}
                placeholder="Contoh: 10"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Supplier</label>
              <input
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Nama supplier"
                required
              />
            </div>

            <div className="form-group">
              <label>Expired Date</label>
              <input
                type="date"
                name="expiredDate"
                value={form.expiredDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Catatan Operasional</label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                placeholder="Contoh: Prioritas restock bulan ini, permintaan tinggi dari cabang..."
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editId !== null ? "Simpan Perubahan" : "Simpan Barang"}
              </button>

              <button type="button" className="cancel-button" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Cari kode, nama, kategori, atau supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-group">
            {[
              "Semua",
              "Urgent",
              "Restock",
              "Watch",
              "Aman",
            ].map((status) => (
              <button
                key={status}
                type="button"
                className={filterStatus === status ? "chip active" : "chip"}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Rak</th>
                <th>Stok</th>
                <th>Minimum</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {hasilPencarian.map((item) => {
                const status = hitungStatusBarang(item);
                const sisaHari = hitungSisaHari(item.expiredDate);

                return (
                  <tr key={item.id}>
                    <td>
                      <span className="kode-pill">{item.kode}</span>
                    </td>

                    <td>
                      <div className="product-name-box">
                        <strong>{item.nama}</strong>
                        <small>{item.supplier}</small>
                      </div>
                    </td>

                    <td>{item.kategori}</td>
                    <td>{item.rak || "—"}</td>
                    <td>
                      {item.stok} {item.satuan}
                    </td>
                    <td>
                      {item.minimumStok} {item.satuan}
                    </td>
                    <td>
                      <span className={`badge ${status.className}`}>
                        {status.label}
                        {sisaHari !== null && status.level !== "Aman"
                          ? ` · ${sisaHari} hari`
                          : ""}
                      </span>
                    </td>
                    <td>
                      <button className="edit-button" onClick={() => editBarang(item)}>
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => hapusBarang(item.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}

              {hasilPencarian.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty">
                    Tidak ada barang yang cocok dengan filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Barang;