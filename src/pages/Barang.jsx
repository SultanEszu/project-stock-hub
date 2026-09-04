import { useMemo, useState } from "react";
import { useStock } from "../context/StockContext";
import { useAuth } from "../context/AuthContext";

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

  return Math.ceil(
    selisih / (1000 * 60 * 60 * 24)
  );
};

const hitungStatusBarang = (item) => {
  const sisaHari = hitungSisaHari(item.expiredDate);

  const stokRendah =
    Number(item.stok) < Number(item.minimumStok);

  if (sisaHari !== null && sisaHari <= 7) {
    return {
      label: "Urgent",
      className: "danger",
      level: "Urgent",
    };
  }

  if (stokRendah) {
    return {
      label: "Restock",
      className: "warning",
      level: "Restock",
    };
  }

  if (sisaHari !== null && sisaHari <= 30) {
    return {
      label: "Waspada",
      className: "warning",
      level: "Watch",
    };
  }

  return {
    label: "Aman",
    className: "success",
    level: "Aman",
  };
};

function Barang() {
  /*
    Data barang sekarang berasal dari StockContext.
    Jadi data tidak lagi hanya tersimpan di halaman Barang.
  */
  const { barang, loading, addBarang, updateBarang, removeBarang } = useStock();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  const [form, setForm] = useState(defaultForm);

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  /*
    Mengatur perubahan input form
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
    Mengembalikan form ke kondisi awal
  */
  const resetForm = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(false);
  };

  /*
    Tambah / Edit barang
  */
  const simpanBarang = async (e) => {
    e.preventDefault();

    const dataBarang = {
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

    try {
      if (editId !== null) {
        await updateBarang(editId, dataBarang);
      } else {
        await addBarang(dataBarang);
      }
    } catch (error) {
      console.error("Gagal menyimpan barang:", error);
      window.alert("Gagal menyimpan barang ke MySQL.");
      return;
    }

    resetForm();
  };

  /*
    Membuka form edit
  */
  const editBarang = (item) => {
    setForm({
      kode: item.kode || "",
      nama: item.nama || "",
      kategori: item.kategori || "",
      stok: item.stok ?? "",
      satuan: item.satuan || "",
      minimumStok: item.minimumStok ?? "",
      supplier: item.supplier || "",
      expiredDate: item.expiredDate || "",
      rak: item.rak || "",
      catatan: item.catatan || "",
    });

    setEditId(item.id);

    setShowForm(true);
  };

  /*
    Menghapus barang
  */
  const hapusBarang = async (id) => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus barang ini?"
    );

    if (!yakin) return;

    try {
      await removeBarang(id);
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
      window.alert("Gagal menghapus barang dari MySQL.");
    }
  };

  /*
    Search + filter kategori
  */
  const hasilPencarian = useMemo(() => {
    return barang.filter((item) => {
      const namaBarang =
        item.nama?.toLowerCase() || "";

      const kodeBarang =
        item.kode?.toLowerCase() || "";

      const kataKunci =
        search.toLowerCase();

      const cocokSearch =
        namaBarang.includes(kataKunci) ||
        kodeBarang.includes(kataKunci);

      const cocokKategori =
        filterKategori === "" ||
        item.kategori === filterKategori;

      return (
        cocokSearch &&
        cocokKategori
      );
    });
  }, [
    barang,
    search,
    filterKategori,
  ]);

  /*
    Ringkasan data inventori
  */
  const ringkasan = useMemo(() => {
    const totalItem = barang.length;

    const butuhRestock =
      barang.filter(
        (item) =>
          Number(item.stok) <
          Number(item.minimumStok)
      ).length;

    const dekatExpired =
      barang.filter((item) => {
        const sisaHari =
          hitungSisaHari(
            item.expiredDate
          );

        return (
          sisaHari !== null &&
          sisaHari <= 30
        );
      }).length;

    const nilaiEstimasi =
      barang.reduce(
        (total, item) => {
          return (
            total +
            Number(item.stok) *
            Number(
              item.hargaBeli || 0
            )
          );
        },
        0
      );

    return {
      totalItem,
      butuhRestock,
      dekatExpired,
      nilaiEstimasi,
    };
  }, [barang]);

  if (loading) {
    return <div className="page"><div className="panel"><p>Memuat data barang dari MySQL...</p></div></div>;
  }

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h2>Inventori Barang</h2>

          <p>
            Monitoring stok, prioritas
            pengadaan, dan resiko
            kadaluwarsa.
          </p>
        </div>

        {isAdmin && <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "Tutup Form"
            : "+ Tambah Barang"}
        </button>}

      </div>


      {/* STATISTIK */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div className="stat-content">

            <p>Total SKU</p>

            <h2>
              {ringkasan.totalItem}
            </h2>

            <span>
              Barang di gudang
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            ⚠️
          </div>

          <div className="stat-content">

            <p>Butuh Restock</p>

            <h2>
              {ringkasan.butuhRestock}
            </h2>

            <span>
              Di bawah minimum
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            🗓️
          </div>

          <div className="stat-content">

            <p>Segera Expired</p>

            <h2>
              {ringkasan.dekatExpired}
            </h2>

            <span>
              Dalam 30 hari
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            💰
          </div>

          <div className="stat-content">

            <p>Nilai Stok</p>

            <h2>
              Rp{" "}
              {ringkasan.nilaiEstimasi.toLocaleString(
                "id-ID"
              )}
            </h2>

            <span>
              Estimasi persediaan
            </span>

          </div>

        </div>

      </div>


      {/* FORM TAMBAH / EDIT */}

      {showForm && (

        <div className="panel form-panel">

          <div className="panel-header">

            <h3>
              {editId !== null
                ? "Edit Barang"
                : "Tambah Barang"}
            </h3>

            <p>
              {editId !== null
                ? "Perbarui data inventori barang."
                : "Input barang baru ke gudang."}
            </p>

          </div>


          <form
            className="barang-form"
            onSubmit={simpanBarang}
          >

            <div className="form-group">

              <label>
                Kode Barang
              </label>

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

              <label>
                Nama Barang
              </label>

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

              <label>
                Kategori
              </label>

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

              <label>
                Rak Penyimpanan
              </label>

              <input
                type="text"
                name="rak"
                value={form.rak}
                onChange={handleChange}
                placeholder="Contoh: A-03"
              />

            </div>


            <div className="form-group">

              <label>
                Stok
              </label>

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

              <label>
                Satuan
              </label>

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

              <label>
                Minimum Stok
              </label>

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

              <label>
                Supplier
              </label>

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

              <label>
                Expired Date
              </label>

              <input
                type="date"
                name="expiredDate"
                value={form.expiredDate}
                onChange={handleChange}
              />

            </div>


            <div className="form-actions">

                      {isAdmin && <button
                type="submit"
                className="primary-button"
              >
                {editId !== null
                  ? "Simpan Perubahan"
                  : "Simpan Barang"}
                      </button>}


                      {isAdmin && <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Batal
                      </button>}

            </div>

          </form>

        </div>

      )}


      {/* FILTER */}

      <div className="panel">

        <div className="toolbar">

          <input
            type="text"
            placeholder="Cari kode atau nama barang..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            value={filterKategori}
            onChange={(e) =>
              setFilterKategori(
                e.target.value
              )
            }
          >

            <option value="">
              Semua Kategori
            </option>

            <option value="Makanan">
              Makanan
            </option>

            <option value="Minuman">
              Minuman
            </option>

            <option value="Alat Tulis">
              Alat Tulis
            </option>

          </select>

        </div>


        {/* TABEL */}

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>Kode</th>

                <th>Nama Barang</th>

                <th>Kategori</th>

                <th>Stok</th>

                <th>Kondisi Stok</th>

                <th>Status</th>

                <th>Supplier</th>

                <th>Aksi</th>

              </tr>

            </thead>


            <tbody>

              {hasilPencarian.map(
                (item) => {

                  const status =
                    hitungStatusBarang(
                      item
                    );

                  const sisaHari =
                    hitungSisaHari(
                      item.expiredDate
                    );

                  return (

                    <tr
                      key={item.id}
                    >

                      <td>

                        <span className="kode-pill">
                          {item.kode}
                        </span>

                      </td>


                      <td>

                        <div className="product-name-box">

                          <strong>
                            {item.nama}
                          </strong>

                          <small>
                            {item.supplier}
                          </small>

                        </div>

                      </td>


                      <td>
                        {item.kategori}
                      </td>


                      <td>
                        {item.stok}{" "}
                        {item.satuan}
                      </td>


                      {/* KONDISI STOK */}

                      <td>

                        {Number(
                          item.stok
                        ) <
                          Number(
                            item.minimumStok
                          ) ? (

                          <span className="badge warning">
                            ⚠ Menipis
                          </span>

                        ) : (

                          <span className="badge success">
                            ✓ Aman
                          </span>

                        )}

                      </td>


                      {/* STATUS EXPIRED */}

                      <td>

                        <span
                          className={`badge ${status.className}`}
                        >

                          {status.label}

                          {sisaHari !== null &&
                            status.level !==
                            "Aman"
                            ? ` · ${sisaHari} hari`
                            : ""}

                        </span>

                      </td>


                      <td>
                        {item.supplier}
                      </td>


                      {/* AKSI */}

                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            editBarang(item)
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="delete-button"
                          onClick={() =>
                            hapusBarang(
                              item.id
                            )
                          }
                        >
                          Hapus
                        </button>

                      </td>

                    </tr>

                  );
                }
              )}


              {hasilPencarian.length ===
                0 && (

                  <tr>

                    <td
                      colSpan="8"
                      className="empty"
                    >
                      Tidak ada barang yang
                      cocok dengan filter
                      saat ini.
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