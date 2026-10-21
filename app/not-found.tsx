import { ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Character } from "@/components/site/character";
import { buttonClasses } from "@/components/ui/button";
import { SignArt } from "@/components/ui/sign-art";
import { characters } from "@/lib/characters";

export default function NotFound() {
  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden px-4 py-16">
      <div aria-hidden className="hazard-stripes absolute inset-x-0 top-0 h-2" />
      <div aria-hidden className="absolute -top-40 -left-40 size-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
      <div aria-hidden className="absolute -right-32 bottom-0 size-[22rem] rounded-full bg-accent-100/60 blur-3xl" />
      <div className="relative grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="mx-auto w-full max-w-sm">
          <Character
            slot={characters.notFound}
            fallback={
              <div className="anim-float" style={{ ["--rot" as string]: "-8deg", ["--spin" as string]: "8deg" }}>
                <SignArt kind="direction" title="Exit direction sign" />
              </div>
            }
          />
        </div>
        <div className="text-center md:text-left">
          <Link href="/" className="inline-block">
            <Image src="/brand/mark.png" alt="SN Safety & Signages" width={400} height={304} className="mx-auto h-12 w-auto md:mx-0" />
          </Link>
          <p className="eyebrow mt-8">Error 404</p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Wrong turn. <span className="text-accent-600">Follow the exit signs.</span>
          </h1>
          <p className="mt-4 text-lg text-ink-500">
            The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you back on a safe route.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/" className={buttonClasses({ size: "lg" })}>
              <ArrowLeft className="size-5" /> Back to home
            </Link>
            <Link href="/products" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              <Search className="size-4.5" /> Browse products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
