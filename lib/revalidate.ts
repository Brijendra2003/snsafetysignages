import "server-only";
import { updateTag } from "next/cache";
import { TAGS } from "@/lib/data/public";

/** Expire public caches after an admin change so the website shows it on the next request. */
export function refreshPublic(...tags: (keyof typeof TAGS)[]) {
  for (const tag of tags) updateTag(TAGS[tag]);
}
