import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/ui/Sidebar";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import ChatPanel from "../components/ChatPanel"; // ← fixed path
import { SkeletonGrid } from "../components/ui/SkeletonCard";
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [share, setShare] = useState(false);

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

  const fetchShareStatus = async () => {
    try {
      const res = await api.get("/brain/share");
      setShare(res.data.share);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchShareStatus(), fetchContent()]);
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
    setShare(true);
    try {
      const res = await api.post("/brain/share", { share: true });
      const link = `${window.location.origin}/shared/${res.data.hash}`;
      await navigator.clipboard.writeText(link);
      if (res.data.message) {
        alert(`Link already shared\nShare link copied!\n\n${link}`);
      } else {
        alert(`Share link copied!\n\n${link}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate share link");
    } finally {
      setShareLoading(false);
    }
  };

  const disableShare = async () => {
    setShareLoading(true);

    try {
      const res = await api.post("/brain/share", { share: false });
      if (res.data.hash === undefined) {
        alert("Link disabled");
        setShare(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to disable the share link");
    } finally {
      setShareLoading(false);
    }
  };

  const handleReEmbed = async (id: string) => {
    try {
      await api.post(`/content/reembed/${id}`);
      setContents((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isEmbedded: false } : c)),
      );
      setTimeout(fetchContent, 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* top bar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-sm pl-10 md:pl-0">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleShare}
              disabled={shareLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md bg-purple-300 text-purple-600 hover:bg-purple-400 transition-colors disabled:opacity-50"
            >
              <ShareIcon size="sm" />
              <span className="hidden sm:inline">
                {share ? "Shared" : "Private"}
              </span>
            </button>
            {share && (
              <button
                onClick={disableShare}
                disabled={shareLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md bg-purple-300 text-purple-600 hover:bg-purple-400 transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-ban"></i>
                <span className="hidden sm:inline">
                  {share && "Link Disabled"}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                setEditContent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <PlusIcon size="sm" />
              <span className="hidden sm:inline">Add Content</span>
            </button>
          </div>
        </div>

        {/* content grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="size-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="size-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">No content found</p>
              <button
                onClick={() => {
                  setEditContent(null);
                  setIsModalOpen(true);
                }}
                className="text-sm text-purple-600 font-medium hover:underline"
              >
                Add your first content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((content) => (
                <Card
                  key={content._id}
                  content={content}
                  onDelete={() => handleDelete(content._id)}
                  onEdit={() => handleEdit(content)}
                  onReEmbed={
                    content.isEmbedded === false
                      ? () => handleReEmbed(content._id)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* floating chat button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`
          fixed bottom-6 right-6 z-30
          size-14 rounded-full shadow-lg hover:shadow-xl
          bg-purple-600 hover:bg-purple-700 text-white
          flex items-center justify-center
          transition-all duration-200
          ${isChatOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
        `}
        title="Ask Brain AI"
      >
        <svg
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <span className="absolute inline-flex size-full rounded-full bg-purple-400 opacity-30 animate-ping" />
      </button>

      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Modal
        key={editContent?._id || "add"}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchContent}
        editContent={editContent}
      />
    </div>
  );
};

export default Home;
