function Sidebar({ halamanAktif, setHalamanAktif }) {
    const menu = [
        {
            nama: "Dashboard",
            icon: "📊",
        },
        {
            nama: "Manajemen Barang",
            icon: "📦",
        },
        {
            nama: "Kategori Produk",
            icon: "🏷️",
        },
        {
            nama: "Low Stock Alert",
            icon: "⚠️",
        },
        {
            nama: "Expired Date",
            icon: "🗓️",
        },
        {
            nama: "Supplier",
            icon: "🚚",
        },
    ];

    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">S</div>

                <div>
                    <h2>Stock Hub</h2>
                    <span>Warehouse System</span>
                </div>
            </div>
            <nav className="menu">
                {menu.map((item) => (
                    <button
                        key={item.nama}
                        className={
                            halamanAktif === item.nama
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => setHalamanAktif(item.nama)}
                    >
                        <span>{item.icon}</span>
                        {item.nama}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>Stock Hub</p>
                <small>Warehouse Management</small>
            </div>
        </aside>
    );

}

export default Sidebar;