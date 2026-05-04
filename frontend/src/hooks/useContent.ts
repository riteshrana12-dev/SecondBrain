import { useState, useEffect } from "react";
import api from "../api/axios";
import { AxiosError } from "axios";
import type { Content } from "../types";

export const useContent = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ content: Content[] }>("/content/get"); // ← was /content/get
      setContents(res.data.content);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ async wrapper to avoid cascading render warning
  useEffect(() => {
    (async () => {
      await fetchContent();
    })();
  }, []);

  return {
    contents,
    loading,
    error,
    fetchContent,
  };
};
