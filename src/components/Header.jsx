import { useAuth } from "../context/AuthContext";

function Header({ halamanAktif, bukaMenu }) {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="mobile-topbar">
                <button
                    className="mobile-menu-button"
                    type="button"
                    aria-label="Buka menu navigasi"
                    onClick={bukaMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="mobile-brand">
                    <div className="mobile-brand-icon">S</div>
                    <strong>Stock Hub</strong>
                </div>
            </div>

            <div>
                <h1>{halamanAktif}</h1>
                <p>Kelola Persediaan Barang Dengan Mudah</p>
            </div>
            <div className="header-user">
                <div className="user-avatar">{user.nama.charAt(0)}</div>

                <div>
                    <strong>{user.nama}</strong>
                    <span>{user.role === "admin" ? "Admin" : "Bos"}</span>
                </div>
                <button className="logout-button" onClick={logout}>Keluar</button>
            </div>
        </header>
    );
}

export default Header;