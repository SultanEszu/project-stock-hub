function Header({halamanAktif}) {
    return (
        <header className="header">
            <div>
                <h1>{halamanAktif}</h1>
                <p>Kelola Persediaan Barang Dengan Mudah</p>
            </div>
            <div className="header-user">
                <div className="user-avatar">A</div>

                <div>
                    <strong>Admin</strong>
                    <span>Administrator</span>
                </div>
            </div>
        </header>
    );
}

export default Header;