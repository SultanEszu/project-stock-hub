import { barangData, kategoriData } from "../data/dummyData";

function Dashboard() {
  const totalBarang = barangData.length;
  const totalStok = barangData.reduce(
    (total, item) => total + Number(item.stok),
    0
  );
  const totalKategori = kategoriData.length;
  const barangMenipis = barangData.filter(
    (item) => Number(item.stok) < Number(item.minimumStok)
  ).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Ringkasan kondisi stok barang di gudang.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>Total Barang</p>
            <h3>{totalBarang}</h3>
            <span>Jenis barang</span>
          </div>
          <div className="stat-icon">📦</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Total Stok</p>
            <h3>{totalStok}</h3>
            <span>Semua barang</span>
          </div>
          <div className="stat-icon">📊</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Total Kategori</p>
            <h3>{totalKategori}</h3>
            <span>Kategori produk</span>
          </div>
          <div className="stat-icon">🏷️</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Stok Rendah</p>
            <h3>{barangMenipis}</h3>
            <span>Perlu restock</span>
          </div>
          <div className="stat-icon">⚠️</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Ringkasan Stok</h3>
          <p>Daftar barang yang membutuhkan perhatian.</p>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Stok</th>
                <th>Minimum</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {barangData.map((item) => (
                <tr key={item.id}>
                  <td>{item.kode}</td>
                  <td>{item.nama}</td>
                  <td>
                    {item.stok} {item.satuan}
                  </td>
                  <td>
                    {item.minimumStok} {item.satuan}
                  </td>
                  <td>
                    {Number(item.stok) < Number(item.minimumStok) ? (
                      <span className="badge warning">⚠ Menipis</span>
                    ) : (
                      <span className="badge success">✓ Aman</span>
                    )}
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

export default Dashboard;
