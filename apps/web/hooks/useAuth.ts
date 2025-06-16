import { authApi } from "@/services/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserLoginInput, UserRegistartionInput } from "@cashbook/utils"
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getProfile,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const login = useMutation({
    mutationFn: ({ data } : { data: UserLoginInput }) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful")
    },
    onError: () => {
      toast.error("Failed to Login")
    }
  });

  const register = useMutation({
    mutationFn: ({ data } : { data: UserRegistartionInput }) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful")
    },
    onError: () => {
      toast.error("Failed to register")
    }
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      toast.success("Successfully logged out")
    },
    onError: () => {
      toast.error("Failed to log out")
    }
  });

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
