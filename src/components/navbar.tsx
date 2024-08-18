import Link from "next/link";
import { ThemeSwitcher } from "./ThemeToggle";

function Navbar() {
  return (
    <nav className="dark:border-darkNavBorder dark:bg-secondaryBlack m500:h-16 mx-4 mt-2 flex items-center justify-between border-b-4 border-border bg-white p-2">
      <div className="dark:text-darkText text-text mx-auto flex w-[1300px] max-w-full items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            className="m900:w-[unset] font-heading m500:text-xl w-[172px] text-4xl"
            href={"/"}
          >
            PHOSKEE
          </Link>
        </div>

        <div className="m800:w-[unset] m400:gap-3 flex w-[172px] items-center justify-end gap-5">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
