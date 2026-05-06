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

      {/* youtube embed */}
      {content.type === "youtube" && content.link && (
        <iframe
          className="w-full h-48 rounded-lg"
          src={`https://www.youtube.com/embed/${extractYouTubeId(content.link)}`}
          title={content.title || "YouTube video"}
          allowFullScreen
        />
      )}

      {/* tweet */}
      {content.type === "tweet" && content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 text-sm underline underline-offset-2 hover:text-purple-500"
        >
          View Tweet
        </a>
      )}

      {/* document */}
      {content.type === "document" && (
        <div className="border border-gray-200 rounded-lg bg-gray-100 overflow-hidden">
          {content.fileUrl ? (
            <a
              href={content.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 transition-colors group"
            >
              <div className="size-9 rounded-lg bg-purple-300 flex items-center justify-center shrink-0">
                <svg
                  className="size-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {getFileName(content.fileUrl)}
                </p>
                <p className="text-xs text-gray-400">Click to open</p>
              </div>
              <svg
                className="size-4 text-gray-400 group-hover:text-purple-600 transition-colors shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : content.link ? (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 transition-colors group"
            >
              <div className="size-9 rounded-lg bg-purple-300 flex items-center justify-center shrink-0">
                <svg
                  className="size-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {content.link}
                </p>
                <p className="text-xs text-gray-400">Click to open</p>
              </div>
              <svg
                className="size-4 text-gray-400 group-hover:text-purple-600 transition-colors shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="size-9 rounded-lg bg-purple-300 flex items-center justify-center shrink-0">
                <svg
                  className="size-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Document</p>
            </div>
          )}
        </div>
      )}

      {/* link */}
      {content.type === "link" && content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 text-sm underline underline-offset-2 hover:text-purple-500 break-all"
        >
          {content.link}
        </a>
      )}

      {/* post */}
      {content.type === "post" && (
        <div className="flex flex-col gap-2">
          {content.notes && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {content.notes}
            </p>
          )}
          {content.link && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:underline font-medium"
            >
              Open
            </a>
          )}
        </div>
      )}
      {/* notes for non-post types */}
      {content.type !== "post" && content.notes && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
          {content.notes}
        </p>
      )}

      {/* tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {content.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs border border-gray-200"
            >
              {typeof tag === "string" ? tag : tag.tag}
            </span>
          ))}
        </div>
      )}

