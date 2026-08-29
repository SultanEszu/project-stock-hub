import { barangData } from "../data/dummydata";

function LowStock() {
    const barangMenipis = barangData.filter(
        (barang) => barang.stok <= barang.minimumStok
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>Low Stock Alert ⚠️</h2>
                    <p>Daftar barang yang membutuhkan restock.</p>
                </div>
            </div>

            <div className="alert-box">
                <strong>
                    ⚠️ {barangMenipis.length}
                </strong>

                <p>
                    Segera lakukan pengecekan dan restock barang yang
                    sudah mulai habis.
                </p>
            </div>

            <div className="panel">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Barang</th>
                                <th>Stok</th>
                                <th>Minimum</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {barangMenipis.map((barang) => (
                                <tr key={barang.id}>
                                    <td>{barang.kode}</td>
                                    <td>{barang.nama}</td>
                                    <td>
                                        {barang.stok} {barang.satuan}
                                    </td>
                                    <td>
                                        {barang.minimumStok} {barang.satuan}
                                    </td>
                                    <td>
                                        <span className="badge warning">
                                            Stok Menipis
                                        </span>
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

export default LowStock;