import { useEffect, useState } from "react";
import { useStock } from "../context/StockContext";

const formatTanggal = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function StockLog() {
  const { stockLogs, refreshStockLogs } = useStock();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadLogs() {
      try {
        await refreshStockLogs();
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Gagal memuat riwayat stok.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      ignore = true;
    };
  }, [refreshStockLogs]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Riwayat Perubahan Stok</h2>
          <p>Audit trail setiap perubahan stok barang.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Stock Log</h3>
          <p>Catatan perubahan stok, pengguna, waktu, dan alasan.</p>
        </div>

        {loading && <p className="empty">Memuat riwayat stok...</p>}
        {!loading && error && <p className="empty">{error}</p>}

        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Stok Sebelum</th>
                  <th>Perubahan</th>
                  <th>Stok Sesudah</th>
                  <th>Alasan</th>
                  <th>Diubah Oleh</th>
                </tr>
              </thead>
              <tbody>
                {stockLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatTanggal(log.created_at)}</td>
                    <td>{log.kode}</td>
                    <td>{log.nama_barang}</td>
                    <td>{log.stok_sebelum}</td>
                    <td>
                      <span className={`badge ${Number(log.perubahan) > 0 ? "success" : "danger"}`}>
                        {Number(log.perubahan) > 0 ? "+" : ""}{log.perubahan}
                      </span>
                    </td>
                    <td>{log.stok_sesudah}</td>
                    <td>{log.alasan}</td>
                    <td>{log.user_nama}</td>
                  </tr>
                ))}
                {stockLogs.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty">
                      Belum ada riwayat perubahan stok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockLog;
