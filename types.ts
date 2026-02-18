export type Language = 'es' | 'en';

export interface DropdownOption {
  value: string;
  label: string; // Spanish (default)
  labelEn?: string; // English
  description: string; // Spanish
  descriptionEn?: string; // English
  promptEn?: string;
  promptEs?: string;
  type?: 'image' | 'video' | 'header';
}

export interface ShotPlan {
  id: string;
  action: string;
  shotSize: string;
  cameraAngle: string;
  composition: string;
  cameraMovement: string;
  duration?: string; // For Kling
  promptEn?: string;
}

export interface TrailerShot {
  title_es: string;
  duration_s: number;
  action_es: string;
  prompt_en: string; // English (Unified cinematic prompt)
  prompt_es: string; // Spanish (Unified cinematic prompt)
  negative_en?: string; // English
  negative_es?: string; // Spanish
}

export interface IdeaPart {
  part_index: number;
  part_label_es: string;
  total_duration_s: number;
  shots: TrailerShot[];
  master_prompt_en?: string;
  master_prompt_es?: string;
  caption_suggestions_es: string[];
  cta_options_es: string[];
  notes_es?: string[];
  // Metadata included in response
  recommended_engine_id?: string;
  recommended_engine_label?: string;
  recommendation_reason_es?: string;
  idea_title_es?: string;
  logline_es?: string;
  platform?: string;
  objective_es?: string;
  genre_es?: string;
}

export interface MarketingIdea {
  id: string; // Unique ID
  // Global Project Info (derived from Part 1)
  idea_title_es: string;
  logline_es: string;
  platform: string;
  recommended_engine_label: string;
  recommended_engine_id: string;
  
  // Content
  parts: IdeaPart[];
}

export interface TrailerResult {
  logline: string;
  structure: string;
  shots: TrailerShot[];
  musicVibe: string;
}

export interface PromptState {
  language: Language;
  engine: string;
  genre: string;
  shotSize: string;
  cameraAngle: string;
  composition: string;
  cameraMovement: string;
  lens: string;
  depthOfField: string;
  lighting: string;
  colorGrading: string;
  atmosphere: string;
  pace: string;
  quality: string;
  avoid: string[];
  aspectRatio: string;
  duration: string;
  sceneDescription: string;
  isPortraitPreset: boolean;
  activeTab: 'builder' | 'trailer';
  isMultiShotMode: boolean;
  multiShotPlan: ShotPlan[];
  trailerImage: string | null;
  // New Marketing Fields
  marketingGoal: string;
  savedIdeas: MarketingIdea[]; // Saved projects
}

export interface GeneratedResult {
  promptEn: string;
  promptEs: string;
  negativePromptEn: string;
  negativePromptEs: string;
  multiShotResults?: {
    shotId: string;
    promptEn: string;
    promptEs: string;
  }[];
  masterPromptEn?: string;
  masterPromptEs?: string;
}

export type CategoryKey = keyof Omit<PromptState, 'sceneDescription' | 'avoid' | 'isPortraitPreset' | 'activeTab' | 'isMultiShotMode' | 'multiShotPlan' | 'trailerImage' | 'language' | 'marketingGoal' | 'savedIdeas'>;