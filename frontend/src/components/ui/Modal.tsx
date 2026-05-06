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
            placeholder="e.g. React hooks tutorial"
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

          {/* link — hide for post type since posts are text only */}
          {form.type !== "post" && (
            <Input
              label="Link"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://..."
            />
          )}