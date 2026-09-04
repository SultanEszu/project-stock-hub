import { useStock } from "../context/StockContext";

function LowStock() {
  const { barang } = useStock();

  const barangMenipis = barang.filter(
    (item) =>
      Number(item.stok) < Number(item.minimumStok)
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Low Stock Alert</h2>
          <p>Daftar barang yang memiliki stok rendah.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>Barang Menipis</p>
            <h3>{barangMenipis.length}</h3>
          </div>

          <div className="stat-icon">⚠️</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Daftar Stok Rendah</h3>
          <p>Barang yang perlu segera dilakukan restock.</p>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Minimum Stok</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {barangMenipis.map((item) => (
                <tr key={item.id}>
                  <td>{item.kode}</td>

                  <td>{item.nama}</td>

                  <td>{item.kategori}</td>

                  <td>
                    {item.stok} {item.satuan}
                  </td>

                  <td>
                    {item.minimumStok} {item.satuan}
                  </td>

                  <td>
                    <span className="badge warning">
                      ⚠ Stok Menipis
                    </span>
                  </td>
                </tr>
              ))}

              {barangMenipis.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    Semua stok barang masih aman.
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

export default LowStock;