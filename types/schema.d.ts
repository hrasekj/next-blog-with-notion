export type Tag = {
  color: string;
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  cover: string | null;
  title: string;
  tags: Tag[];
  description: string;
  date: Date;
};
