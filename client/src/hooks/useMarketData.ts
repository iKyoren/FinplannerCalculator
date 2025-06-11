import { useQuery } from "@tanstack/react-query";
import { fetchMarketData } from "@/lib/api";

export function useMarketData() {
  return useQuery({
    queryKey: ["/api/market-data"],
    queryFn: fetchMarketData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
