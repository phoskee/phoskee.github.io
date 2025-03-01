import Link from "next/link";
import { ThemeSwitcher } from "./ThemeToggle";

function Navbar() {
  return (
    <header className="container mx-auto py-6 flex items-center justify-between border-b">
    <Link href="/" className="text-2xl font-bold tracking-tighter">
      PHOSKEE
    </Link>
    <ThemeSwitcher />
  </header>
  );
}

export default Navbar;
