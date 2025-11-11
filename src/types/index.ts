export interface Image {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  size?: number;
  labels?: string[];
}

export interface UploadResponse {
  success: boolean;
  image?: Image;
  error?: string;
}

export interface SearchResponse {
  success: boolean;
  images?: Image[];
  error?: string;
}

export interface ImageListResponse {
  images: string[];
}

export interface ImageWithLabels {
  blob_url: string;
  label: string[];
}

export interface ImageListWithLabelsResponse {
  images: ImageWithLabels[];
}

