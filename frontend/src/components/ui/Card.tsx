import type { Content } from "../../types";

interface CardProps {
  content: Content;
  onDelete?: () => void;
  onEdit?: () => void;
  onReEmbed?: () => void;
  readonly?: boolean;
}
