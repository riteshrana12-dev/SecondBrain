import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarItems from "./SidebarItems";
import api from "../../api/axios";

const TwitterIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const LinkIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const AllIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

const PostIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const SignOutIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const Sidebar = ({ activeFilter, onFilterChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const items = [
    { icon: <AllIcon />, text: "All", value: "all" },
    { icon: <TwitterIcon />, text: "Tweets", value: "tweet" },
    { icon: <YoutubeIcon />, text: "YouTube", value: "youtube" },
    { icon: <DocumentIcon />, text: "Documents", value: "document" },
    { icon: <LinkIcon />, text: "Links", value: "link" },
    { icon: <PostIcon />, text: "Posts", value: "post" },
  ];

  const handleFilterChange = (value: string) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await api.post("/auth/signout");
    } catch {
      // even if request fails, clear and redirect
    } finally {
      navigate("/signin");
      setSigningOut(false);
    }
  };

  return (
    <>
      {/* hamburger — mobile only */}
      <button
        className="md:hidden fixed top-3.5 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            className="size-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="size-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* overlay — mobile only */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-56 h-screen bg-white border-r border-gray-200
          flex flex-col shrink-0
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* logo */}
        <div className="px-4 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-purple-600">Second Brain</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Your personal knowledge base
          </p>
        </div>

        {/* nav items */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {items.map((item) => (
            <SidebarItems
              key={item.value}
              icon={item.icon}
              text={item.text}
              active={activeFilter === item.value}
              onClick={() => handleFilterChange(item.value)}
            />
          ))}
        </div>

        {/* signout at bottom */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <SignOutIcon />
            <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
