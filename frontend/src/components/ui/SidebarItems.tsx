// src/components/ui/SidebarItems.tsx
import { type ReactElement } from "react";

interface SidebarItemProps {
  icon: ReactElement;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItems = ({ icon, text, active, onClick }: SidebarItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
        ${active ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

export default SidebarItems;
