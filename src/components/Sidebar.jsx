function Sidebar({ halamanAktif, setHalamanAktif, menuTerbuka, tutupMenu }) {

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
            nama: "Supplier",
            icon: "🚚",
        },
        {
            nama: "Expired Date",
            icon: "🗓️",
        },
        {
            nama: "Riwayat Stok",
            icon: "🧾",
        },
    ];

    return (
        <>
        <button
            className={menuTerbuka ? "drawer-backdrop visible" : "drawer-backdrop"}
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={tutupMenu}
        />
        <aside className={menuTerbuka ? "sidebar drawer-open" : "sidebar"}>
            <button
                className="drawer-close"
                type="button"
                aria-label="Tutup menu navigasi"
                onClick={tutupMenu}
            >
                ×
            </button>
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
                        onClick={() => {
                            setHalamanAktif(item.nama);
                            tutupMenu();
                        }}
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
        </>
    );

}

export default Sidebar;