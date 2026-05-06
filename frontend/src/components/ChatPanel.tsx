import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Source {
  _id: string;
  title: string;
  type: string;
  link: string;
  score: number;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
