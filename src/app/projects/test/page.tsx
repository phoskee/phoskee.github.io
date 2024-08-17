import { ModeToggle } from "~/components/ThemeToggle";
import { Logo } from "./Logo";
import { Button } from "~/components/ui/button";
import { TextEffect } from "~/components/TextEffect";

export default function TestPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <div className="mx-4 mt-2 flex items-center justify-between">
        <Logo className="" />
        <div>
          <button className="px-3 text-xl font-black hover:border-b hover:border-black">
            Home
          </button>
          <ModeToggle />
        </div>
      </div>
      <div className="grow flex justify-center items-center">
        <div className="">
          <div className="flex flex-col items-center justify-center">
            <h2 className="font-serif text-5xl font-bold">
              Welcome
            </h2>
            <TextEffect per="char"  preset="fade" className="my-4 max-w-xl p-4 font-mono">
            Hi there, I`m a full-stack engineer featuring a glorious full beard.
            Currently focused on web technologies, web products, and UX.
          </TextEffect>
          <a
              href="https://www.linkedin.com/in/damodara-puddu-a7684914a/"
              target="_blank"
              rel="noreferrer"
              className=" "
            >
              <Button className="btnInner">Learn more</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
