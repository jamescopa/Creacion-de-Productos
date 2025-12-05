
export type BadgeType = 'none' | 'hot' | 'black_friday' | 'coming_soon' | 'pre_order' | 'sold_out';

export interface ProductData {
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  description: string;
  images: string[];
  buyLink: string;
  buttonText: string;
  whatsAppNumber: string;
  rating: number;
  badgeType: BadgeType;
  showStars: boolean;
  colors: string[];
  inStock: boolean;
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
