
export interface WebsiteArticle {
  title: string;
  body: string;
}

export interface Scores {
  virality: number;
  localization: number;
  seo: number;
  ctaClarity: number;
}

export interface GeneratedArticle {
  id: number;
  theme: string;
  googleBusinessProfile: string;
  websiteArticle: WebsiteArticle;
  socialMediaPost: string;
  scores: Scores;
  overallScore: number;
}

export enum ContentType {
  GBP = 'Google Business Profile',
  Website = 'Website',
  Social = 'Social Media',
}
