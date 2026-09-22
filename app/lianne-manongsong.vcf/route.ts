import { defaultCardData } from "@/components/card-data";
import { createVCard, vCardFilename } from "@/components/vcard-utils";

export const dynamic = "force-static";

export function GET() {
  const profile = defaultCardData.profile;
  const content = createVCard(profile);

  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `attachment; filename="${vCardFilename(profile)}"`,
      "Content-Type": "text/vcard; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
