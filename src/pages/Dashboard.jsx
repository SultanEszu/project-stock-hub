import StatCard from "../components/statcard";
import { barangData, kategoriData, supplierData } from "../data/dummydata";

const hitungSisaHari = (tanggal) => {
  if (!tanggal) {
    return null;
  }

  const sekarang = new Date();
  const expired = new Date(tanggal);
  const selisih = expired - sekarang;

  return Math.ceil(selisih / (1000 * 60 * 60 * 24));
};

function Dashboard() {
  const totalBarang = barangData.length;

  const totalStok = barangData.reduce(
    (total, item) => total + Number(item.stok),
    0
  );

  const totalNilaiStok = barangData.reduce(
    (total, item) => total + Number(item.stok) * Number(item.hargaBeli || 0),
    0
  );

  const stokRendah = barangData.filter(
    (item) => Number(item.stok) <= Number(item.minimumStok)
  );

  const barangExpired = barangData.filter((item) => {
    const sisaHari = hitungSisaHari(item.expiredDate);
    return sisaHari !== null && sisaHari <= 0;
  });

  const dekatExpired = barangData.filter((item) => {
    const sisaHari = hitungSisaHari(item.expiredDate);
    return sisaHari !== null && sisaHari <= 30 && sisaHari > 0;
  });

  const kategoriTerbanyak = [...barangData].sort(
    (a, b) => Number(b.stok) - Number(a.stok)
  )[0];

  const supplierTeraktif = [...supplierData]
    .map((supplier) => ({
      ...supplier,
      jumlah: barangData.filter((barang) => barang.supplier === supplier.nama).length,
    }))
    .sort((a, b) => b.jumlah - a.jumlah)[0];

  return (
    <div>
      <div className="welcome">
        <div>
          <h2>Selamat Datang di Stok Hub 👋</h2>
          <p>
            Dashboard operasional gudang untuk memantau stok.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="📦"
          title="Total SKU"
          value={totalBarang}
          description="Jenis barang"
        />

        <StatCard
          icon="📊"
          title="Total Stok"
          value={totalStok}
          description="Unit tersimpan"
        />

        <StatCard
          icon="💰"
          title="Nilai Stok"
          value={`Rp ${totalNilaiStok.toLocaleString("id-ID")}`}
          description="Estimasi modal"
        />

        <StatCard
          icon="⚠️"
          title="Butuh Restock"
          value={stokRendah.length}
          description="Barang di bawah minimum"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Prioritas Operasional</h3>
              <p>Barang yang membutuhkan perhatian segera</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {barangData.map((item) => {
                  const sisaHari = hitungSisaHari(item.expiredDate);
                  const status =
                    sisaHari !== null && sisaHari <= 7
                      ? "Urgent"
                      : Number(item.stok) <= Number(item.minimumStok)
                        ? "Restock"
                        : "Aman";

                  return (
                    <tr key={item.id}>
                      <td>{item.kode}</td>
                      <td>{item.nama}</td>
                      <td>{item.kategori}</td>
                      <td>{item.stok} {item.satuan}</td>
                      <td>
                        <span
                          className={`badge ${
                            status === "Urgent"
                              ? "danger"
                              : status === "Restock"
                                ? "warning"
                                : "success"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Ringkasan Gudang</h3>
              <p>Insight operasional hari ini</p>
            </div>
          </div>

          <div className="summary-item">
            <span>Total Kategori</span>
            <strong>{kategoriData.length}</strong>
          </div>

          <div className="summary-item">
            <span>Barang Expired</span>
            <strong className="text-danger">{barangExpired.length}</strong>
          </div>

          <div className="summary-item">
            <span>Segera Expired</span>
            <strong className="text-warning">{dekatExpired.length}</strong>
          </div>

          <div className="summary-item">
            <span>Supplier Teraktif</span>
            <strong>{supplierTeraktif?.nama || "-"}</strong>
          </div>

          <div className="summary-item">
            <span>Barang Terbanyak</span>
            <strong>{kategoriTerbanyak?.nama || "-"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;