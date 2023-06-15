import { BlogPost, Tag } from '@/types/schema';
import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';

export class NotionService {
  client: Client;
  n2m: NotionToMarkdown;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.n2m = new NotionToMarkdown({ notionClient: this.client });
  }

  public async getPublishedBlogPots(): Promise<BlogPost[]> {
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID ?? '';

    const response = await this.client.databases.query({
      database_id: databaseId,
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
      if (NotionService.isPartialPageObjectResponse(page)) {
        // eslint-disable-next-line no-console
        console.error('Page is not complete');
        return acc;
      }

      return acc.concat(NotionService.pageToPostTransformer(page));
    }, []);
  }

  private static isPartialPageObjectResponse(
    page: PartialPageObjectResponse | PageObjectResponse
  ): page is PartialPageObjectResponse {
    return page.hasOwnProperty('object') && page.hasOwnProperty('id') && Object.keys(page).length === 2;
  }

  private static pageToPostTransformer(page: PageObjectResponse): BlogPost {
    return {
      id: page.id,
      cover: getCoverImage(page),
      title: getTitle(page),
      tags: getMultiSelect(page, 'Tags'),
      description: getRichText(page, 'Description'),
      date: getCreatedTime(page, 'CreatedAt'),
      slug: getFormula(page, 'Slug'),
    };
  }
}

const getCoverImage = (page: PageObjectResponse): string | null => {
  let cover: string | null = null;

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
