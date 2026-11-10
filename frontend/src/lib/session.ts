// Session cache ownership: login/signup call beginSession() so every query refetches
// under the new httpOnly cookie; sign-out MUST go through endSession() so the previous
// account's cached data never leaks into the next login on this browser.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "./api";
import type { User } from "./types";

const PRIVATE_QUERY_ROOTS = new Set([
  "me",
  "bookings",
  "booking",
  "wishlist",
  "notifications",
  "demo-cards",
  "admin-stats",
  "admin-concerts",
  "admin-bookings",
  "admin-customers",
]);

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiGet<User | null>("/auth/me"),
    staleTime: 30_000,
    retry: false,
  });
}

export function useSession() {
  const qc = useQueryClient();
  return {
    beginSession: async () => {
      await qc.cancelQueries();
      await qc.resetQueries();
    },
    endSession: async () => {
      await apiPost("/auth/logout");
      await qc.cancelQueries();
      // Publish the signed-out state before removing private queries so mounted
      // screens immediately stop rendering the previous account's data.
      qc.setQueryData(["me"], null);
      qc.setQueryData(["bookings", "mine"], []);
      qc.setQueryData(["wishlist"], []);
      qc.setQueryData(["notifications"], []);
      qc.removeQueries({
        predicate: (query) => PRIVATE_QUERY_ROOTS.has(String(query.queryKey[0] ?? "")),
      });
      qc.setQueryData(["me"], null);
    },
  };
}
