import { Clock, Factory, Phone } from "lucide-react";
import { getSettings } from "@/lib/data/public";
import { telLink } from "@/lib/site";

export async function TopBar() {
  const settings = await getSettings();
  return (
    <div className="bg-brand-900 text-[0.8rem] text-brand-100">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <p className="flex min-w-0 items-center gap-2">
          <Clock className="size-3.5 shrink-0 text-accent-300" aria-hidden />
          <span className="truncate">{settings.announcement || settings.hours}</span>
          <span className="hidden text-brand-200/60 sm:inline">·</span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Factory className="size-3.5 text-accent-300" aria-hidden />
            Direct from our Vasai factory · Pan-India delivery
          </span>
        </p>
        <a
          href={telLink(settings.phone)}
          className="flex shrink-0 items-center gap-1.5 font-semibold text-white hover:text-accent-200"
        >
          <Phone className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Call</span> {settings.phone}
        </a>
      </div>
    </div>
  );
}
