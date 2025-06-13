import { authApi } from "@/services/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserLoginInput, UserRegistartionInput } from "@cashbook/utils"
export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getProfile,
    retry: false,
  });

  const login = useMutation({
    mutationFn: ({ data } : { data: UserLoginInput }) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const register = useMutation({
    mutationFn: ({ data } : { data: UserRegistartionInput }) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
}
