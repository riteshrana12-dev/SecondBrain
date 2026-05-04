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

  const addContent = async (data: {
    title: string;
    link: string;
    type: string;
    notes: string;
    tags: string[];
  }) => {
    try {
      const res = await api.post<{ content: Content }>("/content/add", data); // ← was /content/add
      setContents((prev) => [res.data.content, ...prev]);
      return true;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Unexpected error");
      }
      return false;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await api.delete(`/content/${id}`);
      setContents((prev) => prev.filter((c) => c._id !== id));
      return true;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
      return false;
    }
  };

  const updateContent = async (
    id: string,
    data: {
      title: string;
      link: string;
      type: string;
      notes: string;
      tags: string[];
    },
  ) => {
    try {
      const res = await api.put<{ updated: Content }>(`/content/${id}`, data);
      setContents((prev) =>
        prev.map((c) => (c._id === id ? res.data.updated : c)),
      );
      return true;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
      return false;
    }
  };

  const searchContent = async (query: string) => {
    if (!query.trim()) {
      await fetchContent(); // reset to all content
      return;
    }
    try {
      const res = await api.get<{ results: Content[] }>(
        `/search?query=${encodeURIComponent(query)}`,
      );
      setContents(res.data.results);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
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
    addContent,
    deleteContent,
    updateContent,
    searchContent,
  };
};
