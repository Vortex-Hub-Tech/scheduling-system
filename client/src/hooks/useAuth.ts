
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["/api/admin/status"],
    retry: false,
  });

  return {
    user: authData?.isAdmin ? { isAdmin: true } : null,
    isLoading,
    isAuthenticated: !!authData?.isAdmin,
    isAdmin: !!authData?.isAdmin,
  };
}
