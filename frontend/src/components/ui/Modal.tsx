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
