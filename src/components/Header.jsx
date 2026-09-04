import { useAuth } from "../context/AuthContext";

function Header({ halamanAktif }) {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div>
                <h1>{halamanAktif}</h1>
                <p>Kelola Persediaan Barang Dengan Mudah</p>
            </div>
            <div className="header-user">
                <div className="user-avatar">{user.nama.charAt(0)}</div>

                <div>
                    <strong>{user.nama}</strong>
                    <span>{user.role === "admin" ? "Administrator" : "Bos"}</span>
                </div>
                <button className="logout-button" onClick={logout}>Keluar</button>
            </div>
        </header>
    );
}

export default Header;