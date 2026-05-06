import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import SearchBar from "../components/ui/SearchBar";
import Sidebar from "../components/ui/Sidebar";
import type { Content } from "../types";

const SharedBrain = () => {
  const { hash } = useParams<{ hash: string }>();
  const [allContents, setAllContents] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await api.get(`/brain/${hash}`);
        setAllContents(res.data.content);
        setUsername(res.data.username);
      } catch {
        setError("This share link is invalid or has been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [hash]);

  const contents = useMemo(() => {
    let result = allContents;
    if (activeFilter !== "all") {
      result = result.filter((c) => c.type === activeFilter);
    }
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.notes?.toLowerCase().includes(lower) ||
          c.tags.some((t) =>
            (typeof t === "string" ? t : t.tag).toLowerCase().includes(lower),
          ),
      );
    }
    return result;
  }, [allContents, activeFilter, searchQuery]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        showSignOut={false}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* ── Top bar ── */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* search */}
          <div className="w-full md:max-w-sm pl-10 md:pl-0">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          {/* user info — compact on mobile */}
          <div className="flex flex-col items-start md:items-end shrink-0 pl-10 md:pl-0">
            <span className="text-sm font-semibold text-purple-600 truncate max-w-[180px]">
              {username}'s Brain
            </span>
            <span className="text-xs text-gray-400">
              {allContents.length} items · read only
            </span>
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {contents.length === 0 ? (
            <p className="text-gray-400 text-sm">No content found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contents.map((content) => (
                <Card key={content._id} content={content} readonly={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedBrain;
