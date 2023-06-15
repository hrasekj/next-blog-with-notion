import { BlogPost } from '@/types/schema';
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

    console.dir(response, { depth: null });

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

    return {
      id: page.id,
      cover,
      title: page.properties.Name.title[0].plain_text,
      tags: page.properties.Tags.multi_select,
      description: page.properties.Description.rich_text[0].plain_text,
      date: new Date(page.properties.CreatedAt.created_time),
      slug: page.properties.Slug.formula.string,
    };
  }
}

type ValueOf<T> = T[keyof T];

function getPropContent(prop: ValueOf<PageObjectResponse['properties']>) {
  const type = prop.type;
  return prop[type] ?? null;
}
