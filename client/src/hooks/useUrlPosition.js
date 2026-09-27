import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const id = searchParams.get("id");
  console.log(`lat: ${lat} : lng: ${lng}`);
  return [lat, lng, id];
}
