export interface User {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  address: string;
  age: number;
  date_of_birth: string;
  bio: string;
  job: string;
  image?: Image;
  posts?: Post[];
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
}
export interface Image {
  id: number;
  url: string;
  formats: {
    thumbnail?: ImageFormat;
  };
}

export interface ImageFormat {
  url: string;
}

// export interface Image {
//   id: number;
//   documentId: string;
//   name: string;
//   alternativeText?: any;
//   caption?: any;
//   width?: number;
//   height?: number;
//   formats?: Formats;
//   hash?: string;
//   ext?: string;
//   mime?: string;
//   size?: number;
//   url?: string;
//   previewUrl?: any;
//   provider?: string;
//   provider_metadata?: any;
//   createdAt?: string;
//   updatedAt?: string;
//   publishedAt?: string;
// }

export interface Formats {
  large?: Large;
  small?: Small;
  medium?: Medium;
  thumbnail?: Thumbnail;
}

export interface Large {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: any;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Small {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: any;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Medium {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: any;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Thumbnail {
  ext?: string;
  url?: string;
  hash?: string;
  mime?: string;
  name?: string;
  path?: any;
  size?: number;
  width?: number;
  height?: number;
  sizeInBytes?: number;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
