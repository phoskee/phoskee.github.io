"use client";
import { Highlighter } from "@/components/ui/highlighter";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { WordRotate } from "@/components/ui/word-rotate";
import { RefObject, useRef } from "react";

const scrollAllaSezione = (ref: RefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};
const sectionStyle = "grid h-svh w-full grid-rows-[1fr_3rem]";
const contentStyle =
  "row-start-1 flex items-center justify-center text-5xl font-bold";
const footerStyle = "row-start-2 flex items-center justify-center";

export default function Home() {
  const sezione1Ref = useRef<HTMLDivElement | null>(null);
  const sezione2Ref = useRef<HTMLDivElement | null>(null);
  const sezione3Ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className="">
      <Hero sectionRef={sezione1Ref} nextRef={sezione2Ref} />
      <Projects sectionRef={sezione2Ref} nextRef={sezione3Ref} />
      <About sectionRef={sezione3Ref} nextRef={sezione1Ref} />
    </div>
  );
}

type SectionProps = {
  sectionRef: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLDivElement | null>;
};

function Hero({ sectionRef, nextRef }: SectionProps) {
  return (
    <section ref={sectionRef} className={sectionStyle}>
      <div className={contentStyle}>
        <h6 className="bold flex flex-col gap-2 text-4xl italic md:text-9xl">
          <TypingAnimation
            startOnView={true}
            duration={200}
            delay={200}
            className="bold text-6xl italic md:text-9xl"
          >
            Ciao 👋
          </TypingAnimation>
          <TypingAnimation
            startOnView={true}
            duration={100}
            delay={1000}
            className="bold text-muted-foreground text-xs italic md:text-3xl"
          >
            [ click to scroll down ]
          </TypingAnimation>
        </h6>
      </div>
      <footer className={footerStyle}>
        <button
          onClick={() => scrollAllaSezione(nextRef)}
          className="animate-bounce text-5xl"
        >
          👇🏼
        </button>
      </footer>
    </section>
  );
}

function Projects({ sectionRef, nextRef }: SectionProps) {
  return (
    <section ref={sectionRef} className={sectionStyle}>
      <div className={contentStyle}>
        <div className="flex flex-col gap-6 px-4 text-center md:gap-12">
          <h6 className="w-[90svw] text-justify text-lg md:w-md md:text-3xl">
            Always tinkering with Next.js, Convex, and Tailwind, trying to build
            web apps that{" "}
            <Highlighter
              action="underline"
              color="#FF9800"
              iterations={3}
              isView={true}
            >
              hopefully
            </Highlighter>{" "}
            <Highlighter
              action="crossed-off"
              color="#FF9800"
              iterations={3}
              isView={true}
            >
              don't
            </Highlighter>{" "}
            explode on the first click (spoiler: sometimes they do, and that’s
            part of the fun). Lately, I’ve been deep into dashboards, inventory
            systems, digital boards,{" "}
            <Highlighter
              action="highlight"
              color="#FF9800"
              iterations={1}
              isView={true}
            >
              quiz's web app
            </Highlighter>{" "}
            and pretty much anything that makes my life (and everyone else’s) a
            little easier… or at least{" "}
            <Highlighter
              action="underline"
              color="#FF9800"
              iterations={2}
              isView={true}
            >
              tries
            </Highlighter>{" "}
            to.
          </h6>
          <h6 className="text-justify text-lg md:w-md md:text-3xl">
            Right now, I’m diving deeper <br />
            into{" "}
            <WordRotate
              className="inline-block w-fit items-baseline text-purple-400"
              duration={1200}
              words={[
                "React",
                "TypeScript",
                "Next.js",
                "Convex",
                "TailwindCSS",
                "shadcn/ui",
                "Prisma",
                "tRPC",
                "Docker",
              ]}
            />
          </h6>
        </div>
      </div>
      <footer className={footerStyle}>
        <button onClick={() => scrollAllaSezione(nextRef)}>
          Vai alla sezione
        </button>
      </footer>
    </section>
  );
}

function About({ sectionRef, nextRef }: SectionProps) {
  return (
    <section ref={sectionRef} className={sectionStyle}>
      <div className={contentStyle}>
        <div className="flex w-svw items-center justify-center">
          <h6 className="w-[90svw] text-lg md:w-xl md:text-3xl">
            🌱 Right now, I’m working on my complicated love-hate relationship
            with TypeScript — a saga full of cryptic errors, bug hunts, and
            those rare “aha!” moments that make it all worth it. 💡 I like
            building useful stuff, but every now and then I can’t resist
            spinning up completely pointless projects just to say, “It works! …I
            think.” 🚀 Recently, I’ve been playing around with clean database
            setups, custom auth flows, and file management systems that are
            supposed to be “simple,” but somehow turn into final boss battles
            fought with commits and caffeine. 📫 You can usually find me
            somewhere in a git log, wrestling with a migration or trying to
            figure out why something that worked perfectly yesterday decided to
            stop today.
          </h6>
        </div>
      </div>
      <footer className={footerStyle}>
        <button onClick={() => scrollAllaSezione(nextRef)}>
          Vai alla sezione
        </button>
      </footer>
    </section>
  );
}
