import { useAuthStore } from "@/lib/store";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
