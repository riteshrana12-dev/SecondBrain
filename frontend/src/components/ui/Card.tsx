import type { Content } from "../../types";

interface CardProps {
  content: Content;
  onDelete?: () => void;
  onEdit?: () => void;
  onReEmbed?: () => void;
  readonly?: boolean;
}

function Card({
  content,
  onDelete,
  onEdit,
  onReEmbed,
  readonly = false,
}: CardProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 w-full border border-gray-200 flex flex-col gap-3">
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-800 leading-snug">
          {content.title}
        </h2>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* not embedded warning */}
          {content.isEmbedded === false && !readonly && (
            <span className="text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full border border-yellow-200">
              not indexed
            </span>
          )}
          <span className="text-xs font-medium bg-purple-300 text-purple-600 px-2 py-0.5 rounded-full capitalize">
            {content.type}
          </span>
        </div>
      </div>