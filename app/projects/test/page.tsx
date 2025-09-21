import { Logo } from "./Logo";
import { Button } from "~/components/ui/button";
import { TextEffect } from "~/components/TextEffect";
import { ThemeSwitcher } from "~/components/ThemeToggle";

export default function TestPage() {
  return (
    <div className="flex min-h-dvh flex-col w-full">
      <div className="mx-4 mt-2 flex items-center justify-between">
        <Logo className="" />
        <div>
          <button className="px-3 text-xl font-black hover:border-b hover:border-black">
            Home
          </button>
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex grow items-center justify-center">
        <div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="font-serif text-5xl font-bold">Welcome</h2>
            <TextEffect
              per="char"
              preset="fade"
              className="my-4 max-w-xl p-4 font-mono"
            >
              Hi there, I`m a full-stack engineer featuring a glorious full
              beard. Currently focused on web technologies, web products, and
              UX.
            </TextEffect>
            <a
              href="https://www.linkedin.com/in/damodara-puddu-a7684914a/"
              target="_blank"
              rel="noreferrer"
              className=" "
            >
              <Button>Learn more</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
