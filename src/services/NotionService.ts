import { BlogPost, PostPage, Tag } from '@/types/schema';
import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';

export class NotionService {
  databaseId: string;
  client: Client;
  n2m: NotionToMarkdown;

  constructor() {
    this.databaseId = process.env.NOTION_BLOG_DATABASE_ID ?? '';

    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.n2m = new NotionToMarkdown({ notionClient: this.client });
  }

  public async getPublishedBlogPots(): Promise<BlogPost[]> {
    const response = await this.client.databases.query({
      database_id: this.databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending',
        },
      ],
    });

    return response.results.reduce<BlogPost[]>((acc, page) => {
      if (isPartialPageObjectResponse(page)) {
        // eslint-disable-next-line no-console
        console.error('Page is not complete');
        return acc;
      }

      return acc.concat(pageToPostTransformer(page));
    }, []);
  }

  public async getSingleBlogPost(slug: string): Promise<PostPage> {
    // list of blog posts
    const response = await this.client.databases.query({
      database_id: this.databaseId,
      filter: {
        property: 'Slug',
        formula: {
          string: { equals: slug },
        },
        // TODO add option for tags in the future
      },
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending',
        },
      ],
    });

    if (response.results.length === 0) {
      throw new Error('No results available');
    }

    // grab page from notion
    const page = response.results[0];

    if (isPartialPageObjectResponse(page)) {
      throw new Error('Page is not complete');
    }

    const typeHackPage = page as PageObjectResponse;

    const mdBlocks = await this.n2m.pageToMarkdown(typeHackPage.id);
    const markdown = this.n2m.toMarkdownString(mdBlocks);

    const post = pageToPostTransformer(typeHackPage);

    return {
      post,
      markdown,
    };
  }
}

const isPartialPageObjectResponse = (
  page: PartialPageObjectResponse | PageObjectResponse
): page is PartialPageObjectResponse => {
  return page.hasOwnProperty('object') && page.hasOwnProperty('id') && Object.keys(page).length === 2;
};

const pageToPostTransformer = (page: PageObjectResponse): BlogPost => {
  return {
    id: page.id,
    cover: getCoverImage(page),
    title: getTitle(page),
    tags: getMultiSelect(page, 'Tags'),
    description: getRichText(page, 'Description'),
    date: getCreatedTime(page, 'CreatedAt'),
    slug: getFormula(page, 'Slug'),
  };
};

const getCoverImage = (page: PageObjectResponse): string | undefined => {
  let cover: string | undefined;

  /* eslint-disable indent */
  switch (page.cover?.type) {
    case 'file':
      cover = page.cover?.file.url ?? '';
      break;
    case 'external':
      cover = page.cover?.external.url ?? '';
      break;
  }
  /* eslint-disable */

  return cover;
};

const getTitle = (page: PageObjectResponse): string => {
  const prop = page.properties.Name;
  if (prop.type === 'title' && prop.title.length > 0) {
    return prop.title.reduce((acc, text) => {
      if (text.type === 'text') {
        return acc + text.plain_text;
      }
      return acc;
    }, '');
  }
  return '';
};

const getMultiSelect = (page: PageObjectResponse, key: string): Tag[] => {
  const prop = page.properties[key];
  if (prop.type === 'multi_select') {
    return prop.multi_select;
  }
  return [];
};

const getRichText = (page: PageObjectResponse, key: string): string => {
  const prop = page.properties[key];
  if (prop.type === 'rich_text' && prop.rich_text.length > 0) {
    return prop.rich_text[0].plain_text;
  }
  return '';
};

const getCreatedTime = (page: PageObjectResponse, key: string): Date => {
  const prop = page.properties[key];
  if (prop.type === 'created_time') {
    return new Date(prop.created_time);
  }
  return new Date(page.created_time);
};

const getFormula = (page: PageObjectResponse, key: string): string => {
  const prop = page.properties[key];
  if (prop.type === 'formula' && prop.formula.type === 'string') {
    return prop.formula.string ?? '';
  }
  return '';
};
