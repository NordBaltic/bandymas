import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <span className="brand">NordBalticum</span>
        </Link>
      </div>
      <div className="navbarLinks">
        <Link href="/dashboard" className="navLink">Dashboard</Link>
        <Link href="/stake" className="navLink">Stake</Link>
        <Link href="/donate" className="navLink">Donate</Link>
        <Link href="/profile" className="navLink">Profile</Link>
      </div>
    </nav>
  );
}
