import Link from "next/link";
import styles from "../styles/globals.css"; // Importuojame globalius stilius

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/">
                    <span className="brand">NordBalticum</span>
                </Link>
            </div>
            <div className="navbar-links">
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/stake" className="nav-link">Stake</Link>
                <Link href="/donate" className="nav-link">Donate</Link>
                <Link href="/profile" className="nav-link">Profile</Link>
            </div>
        </nav>
    );
}
