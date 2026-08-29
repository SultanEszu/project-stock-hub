import { barangData } from "../data/dummydata";

function Expired() {
  const barangDenganExpired = barangData.filter(
    (barang) => barang.expiredDate
  );

  const hitungHari = (tanggal) => {
    const sekarang = new Date();
    const expired = new Date(tanggal);

    const selisih = expired - sekarang;

    return Math.ceil(
      selisih / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Expired Date Tracker 📅</h2>
          <p>
            Pantau barang berdasarkan tanggal kedaluwarsa.
          </p>
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
                <th>Sisa Hari</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {barangDenganExpired.map((barang) => {
                const sisaHari = hitungHari(
                  barang.expiredDate
                );

                let status = "Aman";
                let className = "success";

                if (sisaHari <= 0) {
                  status = "Expired";
                  className = "danger";
                } else if (sisaHari <= 7) {
                  status = "Segera Expired";
                  className = "danger";
                } else if (sisaHari <= 30) {
                  status = "Perhatian";
                  className = "warning";
                }

                return (
                  <tr key={barang.id}>
                    <td>{barang.kode}</td>
                    <td>{barang.nama}</td>
                    <td>{barang.expiredDate}</td>
                    <td>
                      {sisaHari <= 0
                        ? "Sudah lewat"
                        : `${sisaHari} hari`}
                    </td>
                    <td>
                      <span className={`badge ${className}`}>
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
    </div>
  );
}

export default Expired; 