import type { ReactElement } from "react";
import { getHomeLocalBusinessJsonLd } from "@/lib/seo/local-business-json-ld";

export function LocalBusinessJsonLd(): ReactElement {
  return (
    <script type="application/ld+json">
      {JSON.stringify(getHomeLocalBusinessJsonLd())}
    </script>
  );
}
