import { useStock } from "../context/StockContext";

function Expired() {
  const { barang } = useStock();

  const hariIni = new Date();

  const getStatusExpired = (tanggal) => {
    if (!tanggal) {
      return {
        text: "Tidak Ada Tanggal",
        className: "neutral",
      };
    }

    const tanggalExpired = new Date(tanggal);

    const selisihWaktu =
      tanggalExpired.getTime() - hariIni.getTime();

    const selisihHari = Math.ceil(
      selisihWaktu / (1000 * 60 * 60 * 24)
    );

    if (selisihHari < 0) {
      return {
        text: "Sudah Expired",
        className: "danger",
      };
    }

    if (selisihHari <= 30) {
      return {
        text: `Expired ${selisihHari} hari lagi`,
        className: "warning",
      };
    }

    return {
      text: "Masih Aman",
      className: "success",
    };
  };

  const barangDenganExpired = barang.filter(
    (item) => item.expiredDate
  );

  const barangSegeraExpired = barangDenganExpired.filter(
    (item) => {
      const status = getStatusExpired(item.expiredDate);

      return (
        status.className === "warning" ||
        status.className === "danger"
      );
    }
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Expired Date Tracker</h2>
          <p>
            Pantau tanggal kedaluwarsa barang di gudang.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <p>Total Produk</p>
            <h3>{barangDenganExpired.length}</h3>
            <span>Memiliki tanggal expired</span>
          </div>

          <div className="stat-icon">📅</div>
        </div>

        <div className="stat-card">
          <div>
            <p>Segera Expired</p>
            <h3>{barangSegeraExpired.length}</h3>
            <span>Dalam 30 hari</span>
          </div>

          <div className="stat-icon">⚠️</div>
        </div>
      </div>

      <div className="panel">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Barang</th>
                <th>Expired Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {barangDenganExpired.map((item) => {
                const status = getStatusExpired(
                  item.expiredDate
                );

                return (
                  <tr key={item.id}>
                    <td>{item.kode}</td>

                    <td>{item.nama}</td>

                    <td>{item.expiredDate}</td>

                    <td>
                      <span
                        className={`badge ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {barangDenganExpired.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty">
                    Belum ada barang dengan tanggal expired.
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

export default Expired;