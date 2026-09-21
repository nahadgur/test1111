import type { SupportData } from "@/components/card-data";

export function BrokerContact({ support }: { support: SupportData }) {
  if (!support.name && !support.phone && !support.email) return <span />;

  return (
    <details className="broker-contact">
      <summary>Broker support</summary>
      <div className="broker-contact-card">
        <strong>{support.name}</strong>
        <span>{support.title}</span>
        {support.phone ? <a href={`tel:${support.phone.replace(/[^+\d]/g, "")}`}>{support.phone}</a> : null}
        {support.email ? <a href={`mailto:${support.email}`}>{support.email}</a> : null}
      </div>
    </details>
  );
}
