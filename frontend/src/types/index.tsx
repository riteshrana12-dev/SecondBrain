export interface IconsProps {
  size: "sm" | "md" | "lg";
}

export const sizeVariants = {
  sm: "size-2",
  md: "size-4",
  lg: "size-6",
};

export type ContentType = "youtube" | "tweet" | "document" | "link" | "post";

export interface Tag {
  _id: string;
  tag: string;
}

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  notes?: string;
  fileUrl?: string;
  extractedText?: string;
  isEmbedded?: boolean;
  tags: Tag[];
  userId?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}
