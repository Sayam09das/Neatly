import type { ReactElement } from "react";
import { buildServiceJsonLd } from "@/lib/seo/service-json-ld";
import type { CustomerServiceDetail } from "@/types/customer";

interface ServiceJsonLdProps {
  service: CustomerServiceDetail;
  url: string | undefined;
}

export function ServiceJsonLd({
  service,
  url,
}: ServiceJsonLdProps): ReactElement {
  return (
    <script type="application/ld+json">
      {JSON.stringify(buildServiceJsonLd({ service, url }))}
    </script>
  );
}
