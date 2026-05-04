import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api/axios";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/signin", { email, password });
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { signIn };
};
