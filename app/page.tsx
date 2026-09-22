import { ScrollVcard } from "@/components/scroll-vcard";
import { defaultCardData } from "@/components/card-data";

export default function Home() {
  return <ScrollVcard data={defaultCardData} contactFileUrl="/lianne-manongsong.vcf" />;
}
