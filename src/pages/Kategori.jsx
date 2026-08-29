import { useState } from "react";
import { kategoriData } from "../data/dummydata";

function Kategori() {
  const [kategori, setKategori] = useState(kategoriData);

  const [namaKategori, setNamaKategori] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const simpanKategori = (e) => {
    e.preventDefault();

    if (editId !== null) {
      const dataUpdate = kategori.map((item) => {
        if (item.id === editId) {
          return {
            ...item,
            nama: namaKategori,
          };
        }

        return item;
      });

      setKategori(dataUpdate);
    } else {
      const dataBaru = {
        id: Date.now(),
        nama: namaKategori,
      };

      setKategori([...kategori, dataBaru]);
    }

    resetForm();
  };

  const editKategori = (item) => {
    setNamaKategori(item.nama);
    setEditId(item.id);
    setShowForm(true);
  };

  const hapusKategori = (id) => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus kategori ini?"
    );

    if (yakin) {
      setKategori(
        kategori.filter((item) => item.id !== id)
      );
    }
  };

  const resetForm = () => {
    setNamaKategori("");
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <h2>Kategori Produk</h2>

          <p>
            Kelola kategori barang di gudang.
          </p>
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
          {showForm
            ? "Tutup Form"
            : "+ Tambah Kategori"}
        </button>

      </div>

      {showForm && (
        <div className="panel form-panel">

          <div className="panel-header">

            <h3>
              {editId !== null
                ? "Edit Kategori"
                : "Tambah Kategori"}
            </h3>

            <p>
              Masukkan nama kategori produk.
            </p>

          </div>

          <form
            className="simple-form"
            onSubmit={simpanKategori}
          >

            <div className="form-group">

              <label>
                Nama Kategori
              </label>

              <input
                type="text"
                value={namaKategori}
                onChange={(e) =>
                  setNamaKategori(e.target.value)
                }
                placeholder="Contoh: Makanan"
                required
              />

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                {editId !== null
                  ? "Simpan Perubahan"
                  : "Simpan Kategori"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Batal
              </button>

            </div>

          </form>

        </div>
      )}

      <div className="category-grid">

        {kategori.map((item) => (

          <div
            className="category-card"
            key={item.id}
          >

            <div className="category-icon">
              🏷️
            </div>

            <div>
              <h3>{item.nama}</h3>

              <p>
                Kategori produk
              </p>
            </div>

            <div className="category-actions">

              <button
                className="edit-button"
                onClick={() =>
                  editKategori(item)
                }
              >
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() =>
                  hapusKategori(item.id)
                }
              >
                Hapus
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Kategori;