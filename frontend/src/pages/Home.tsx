import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/ui/Sidebar";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";


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
