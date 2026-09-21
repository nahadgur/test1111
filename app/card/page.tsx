import type { Metadata } from "next";
import { SharedCard } from "@/components/shared-card";

export const metadata: Metadata = {
  title: "Digital Business Card",
  description: "Mobile-first digital business card and property portfolio.",
};

export default function CardPage() {
  return <SharedCard />;
}
