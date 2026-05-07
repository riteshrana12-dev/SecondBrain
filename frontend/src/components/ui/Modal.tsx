import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import api from "../../api/axios";
import { AxiosError } from "axios";
import type { Content } from "../../types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editContent?: Content | null;
}

const CONTENT_TYPES = ["youtube", "tweet", "document", "link", "post"] as const;

const Modal = ({ isOpen, onClose, onSuccess, editContent }: ModalProps) => {
  const isEditMode = !!editContent;

  const [form, setForm] = useState({
    title: editContent?.title || "",
    link: editContent?.link || "",
    type: editContent?.type || "link",
    notes: editContent?.notes || "",
    tags:
      editContent?.tags
        ?.map((t) => (typeof t === "string" ? t : t.tag))
        .join(", ") || "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.type) {
      setError("Title and type are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (isEditMode && editContent) {
        // edit — always JSON, file re-upload not supported in edit for simplicity
        await api.put(`/content/${editContent._id}`, { ...form, tags });
      } else {
        // add — use FormData if file attached, JSON otherwise
        if (file) {
          const formData = new FormData();
          formData.append("title", form.title);
          formData.append("link", form.link);
          formData.append("type", form.type);
          formData.append("notes", form.notes);
          formData.append("file", file);
          tags.forEach((t) => formData.append("tags", t));
          await api.post("/content/add", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/content/add", { ...form, tags });
        }
      }

      onSuccess();
      onClose();
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

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* sticky header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-800">
            {isEditMode ? "Edit Content" : "Add Content"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            x
          </button>
        </div>

        {/* form body */}
        <div className="flex flex-col gap-4 px-6 py-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Input
            label="Title *"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder=""
          />

          {/* type selector */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Link"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="https://..."
          />

          {/* file upload — only for document type */}
          {form.type === "document" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Upload PDF
                {isEditMode && editContent?.fileUrl && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    (leave empty to keep existing file)
                  </span>
                )}
              </label>

              {/* show existing file in edit mode */}
              {isEditMode && editContent?.fileUrl && !file && (
                <div className="flex items-center gap-2 bg-purple-300 text-purple-600 px-3 py-2 rounded-lg text-sm">
                  <span>📄</span>
                  <span className="flex-1 truncate text-xs">
                    Current file attached
                  </span>
                  <a
                    href={editContent.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </a>
                </div>
              )}

              <input
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-purple-500
                           file:mr-3 file:py-1 file:px-3 file:rounded-md
                           file:border-0 file:text-xs file:font-medium
                           file:bg-purple-300 file:text-purple-600
                           hover:file:bg-purple-400 cursor-pointer"
              />
              {file && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Selected:</span>
                  <span className="text-xs text-purple-600 font-medium truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400">
                PDF, JPG or PNG — max 10MB
              </p>
            </div>
          )}

          {/* notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Your notes about this content..."
              rows={3}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <Input
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="react, frontend, css"
          />
        </div>

        {/* sticky footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-xl">
          <Button
            variant="secondary"
            size="md"
            text="Cancel"
            onClick={onClose}
            fullWidth
          />
          <Button
            variant="primary"
            size="md"
            text={
              loading
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Content"
            }
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
