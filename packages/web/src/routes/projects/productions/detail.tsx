import { useParams } from "@solidjs/router";

export function ProductionDetailRoute() {
  const params = useParams();
  return <div>{params.productionId}</div>;
}
