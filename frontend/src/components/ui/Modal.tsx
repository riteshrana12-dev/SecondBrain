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