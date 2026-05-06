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