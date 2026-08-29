import { supplierData } from "../data/dummydata";

function Supplier() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Supplier</h2>
          <p>Kelola data pemasok barang.</p>
        </div>

        <button className="primary-button">
          + Tambah Supplier
        </button>
      </div>

      <div className="panel">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama Supplier</th>
                <th>Kontak</th>
                <th>Telepon</th>
                <th>Email</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {supplierData.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.nama}</td>
                  <td>{supplier.kontak}</td>
                  <td>{supplier.telepon}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <button className="edit-button">
                      Edit
                    </button>

                    <button className="delete-button">
                      Hapus
                    </button>
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

export default Supplier;