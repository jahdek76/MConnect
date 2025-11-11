import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * API Base URL
 */
const API_URL = import.meta.env.VITE_HOME_OO;

async function fetchCurrentUser() {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (!token) throw new Error("No token");

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) {
    console.error("Fetch /me failed:", res.status, await res.text());
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  console.log("✅ /me response:", data);
  return data;
}

/**
 * Logout request
 */
// async function logoutRequest() {
//   const token = localStorage.getItem("ACCESS_TOKEN");
//   if (token) {
//     await fetch(`${API_URL}/logout`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   }

//   localStorage.removeItem("ACCESS_TOKEN");
// }

/**
 * ✅ Main useAuth Hook
 */
export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(true);

  // Fetch current user
  const {
    data: userData,
    isLoading: userLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: !!localStorage.getItem("ACCESS_TOKEN"),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.removeQueries(["authUser"]);
      localStorage.removeItem("ACCESS_TOKEN");
      navigate("/auth");
    },
  });

  React.useEffect(() => {
    if (!userLoading) setLoading(false);
  }, [userLoading]);

  const signOut = async () => {
    await logoutMutation.mutateAsync();
  };

  const user = userData?.user || null;
  const roles = userData?.roles || (user?.role ? [user.role] : []);
  const hasRole = (role) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager") || isAdmin;
  const isStaff = roles.some((r) => ["admin", "manager", "sales_agent"].includes(r));

  return {
    user,
    session: userData,
    loading,
    signOut,
    roles,
    hasRole,
    isAdmin,
    isManager,
    isStaff,
    refetch,
    isError,
  };
}