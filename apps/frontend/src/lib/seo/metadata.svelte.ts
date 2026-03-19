import { SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, BASE_URL, DEFAULT_KEYWORDS, TWITTER_HANDLE } from './constants';

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noindex?: boolean;
  canonical?: string;
}

const defaultMetadata: PageMetadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  url: BASE_URL,
  type: 'website',
  keywords: DEFAULT_KEYWORDS,
  noindex: false
};

let currentMetadata = $state<PageMetadata>({ ...defaultMetadata });

export const seoStore = {
  get metadata() {
    return currentMetadata;
  },
  get resolved() {
    return {
      title: currentMetadata.title ? `${currentMetadata.title} | ${SITE_NAME}` : SITE_NAME,
      description: currentMetadata.description || SITE_DESCRIPTION,
      keywords: currentMetadata.keywords || DEFAULT_KEYWORDS,
      image: currentMetadata.image || DEFAULT_OG_IMAGE,
      url: currentMetadata.url || BASE_URL,
      type: currentMetadata.type || 'website',
      publishedTime: currentMetadata.publishedTime,
      noindex: currentMetadata.noindex || false,
      canonical: currentMetadata.canonical || currentMetadata.url || BASE_URL
    };
  },
  setPageMetadata(meta: Partial<PageMetadata>) {
    currentMetadata = { ...defaultMetadata, ...meta };
  },
  reset() {
    currentMetadata = { ...defaultMetadata };
  }
};

export function buildPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
}
