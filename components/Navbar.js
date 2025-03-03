import Link from "next/link";
import styles from "../styles/Navbar.module.css"; // Vietoj `globals.css`, naudokime atskirą CSS modulį

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    <span className={styles.brand}>NordBalticum</span>
                </Link>
            </div>
            <div className={styles.navbarLinks}>
                <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
                <Link href="/stake" className={styles.navLink}>Stake</Link>
                <Link href="/donate" className={styles.navLink}>Donate</Link>
                <Link href="/profile" className={styles.navLink}>Profile</Link>
            </div>
        </nav>
    );
}
