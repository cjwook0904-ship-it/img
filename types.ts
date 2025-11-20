export enum AspectRatio {
  Square = '1:1',
  Landscape = '16:9',
  Portrait = '9:16',
  StandardLandscape = '4:3',
  StandardPortrait = '3:4',
}

export enum GenerationMode {
  Generate = 'GENERATE',
  Edit = 'EDIT',
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: AspectRatio | null; // null for edited images if not applicable
  createdAt: number;
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
}