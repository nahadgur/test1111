import { displayName, type ProfileData } from "@/components/card-data";

function escapeVCard(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,");
}

export function createVCard(profile: ProfileData) {
  const name = displayName(profile);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(profile.lastName)};${escapeVCard(profile.firstName)};${escapeVCard(profile.middleName)};;`,
    `FN:${escapeVCard(name)}`,
  ];
  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`);
  if (profile.role) lines.push(`TITLE:${escapeVCard(profile.role)}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCard(profile.phone)}`);
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${escapeVCard(profile.email)}`);
  if (profile.website) lines.push(`URL:${escapeVCard(profile.website)}`);
  if (profile.facebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${escapeVCard(profile.facebook)}`);
  if (profile.location) lines.push(`NOTE:${escapeVCard(profile.location)}`);
  lines.push(`REV:${new Date().toISOString()}`, "END:VCARD");
  return lines.join("\r\n");
}

export function downloadVCard(profile: ProfileData) {
  const blobUrl = URL.createObjectURL(new Blob([createVCard(profile)], { type: "text/vcard;charset=utf-8" }));
  const link = document.createElement("a");
  const filename = `${profile.firstName}-${profile.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "contact";
  link.href = blobUrl;
  link.download = `${filename}.vcf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}
