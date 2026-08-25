export type Article = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  date: string;
  excerpt: string
  readingTime: string
  href: string
  imageAlt: string
  topic: string
};

export type NavLink = {
  label: string;
  href: string;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
  icon: "leaf" | "star" | "truck" | "mapPin";
};

export type FooterColumn = {
  title: string;
  links: NavLink[];
};