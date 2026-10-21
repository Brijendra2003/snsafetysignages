import Image from "next/image";
import { PreloaderController } from "@/components/site/preloader-controller";

/**
 * Branded splash shown on the first page load of a browser session.
 * It is server-rendered so it covers the page before the first paint; an
 * inline script removes it instantly on repeat visits within the session,
 * and a CSS timeout hides it even if JavaScript fails.
 */
export function Preloader() {
  return (
    <>
      <div
        id="sn-preloader"
        data-state="loading"
        suppressHydrationWarning
        aria-hidden="true"
        className="fixed inset-0 z-[100] grid place-items-center bg-canvas transition-opacity duration-500 data-[state=done]:hidden data-[state=leaving]:pointer-events-none data-[state=leaving]:opacity-0 [animation:preloader-failsafe_0.4s_ease_5s_forwards]"
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <span className="absolute inset-0 -m-6 animate-ping rounded-full bg-accent-100 opacity-60 [animation-duration:1.8s]" />
            <Image src="/brand/mark.png" alt="" width={400} height={304} priority className="anim-pop relative h-24 w-auto" />
          </div>
          <p className="anim-intro mt-6 font-display text-xl font-extrabold tracking-tight text-ink-900" style={{ ["--d" as string]: "150ms" }}>
            SN Safety <span className="text-accent-600">&amp;</span> Signages
          </p>
          <p className="anim-intro mt-1 text-xs font-semibold tracking-[0.25em] text-ink-500 uppercase" style={{ ["--d" as string]: "250ms" }}>
            Safety you can see
          </p>
          <div className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-ink-100">
            <div className="hazard-stripes h-full origin-left [animation:progress_1.2s_cubic-bezier(.6,0,.3,1)_forwards]" />
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("sn-preloaded")){document.getElementById("sn-preloader").setAttribute("data-state","done")}}catch(e){}`,
        }}
      />
      <PreloaderController />
    </>
  );
}
