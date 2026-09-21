import type { Metadata } from "next";
import { CardBuilder } from "@/components/card-builder";

export const metadata: Metadata = {
  title: "FAI Digital Card Builder",
  description: "Create and edit a mobile-first FAI digital business card.",
};

export default function BuilderPage() {
  return <CardBuilder />;
}
