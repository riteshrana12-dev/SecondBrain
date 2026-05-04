import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/ui/Sidebar";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import ChatPanel from "../components/ChatPanel";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import api from "../api/axios";
import type { Content } from "../types";

const Home = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await api.get("/content/get");
      setContents(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchContent();
    })();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return contents;
    return contents.filter((c) => c.type === activeFilter);
  }, [activeFilter, contents]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/content/${id}`);
      setContents((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (content: Content) => {
    setEditContent(content);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditContent(null);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      await fetchContent();
      return;
    }
    try {
      const res = await api.get(`/search?query=${encodeURIComponent(query)}`);
      setContents(res.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    setShareLoading(true);
    try {
      const res = await api.post("/brain/share", { share: true });
      const link = `${window.location.origin}/shared/${res.data.hash}`;
      setShareLink(link);
      await navigator.clipboard.writeText(link);
      alert(`Share link copied!\n\n${link}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate share link");
    } finally {
      setShareLoading(false);
    }
  };

  return (
    
  );
};

export default Home;
