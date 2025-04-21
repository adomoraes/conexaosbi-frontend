import fetch from 'node-fetch';
// Certifique-se de instalar o pacote: npm install node-fetch
import { array, number, object, optional, parse, string } from 'valibot';

import { dasherize } from '@/utils/dasherize';
import { truncate } from '@/utils/truncate';

export interface Episode {
  id: string;
  title: string;
  published: number;
  description?: string;
  content?: string;
  episodeImage?: string;
  episodeNumber?: string | number;
  audio: {
    src: string;
    type: string;
  };
}

export async function getAllEpisodes() {
  const apiUrl =
    'http://wrecktecnologia1.hospedagemdesites.ws/tino/sbi/wp-json/stream/v1/conteudos';

  let feed: unknown;
  try {
    // Faz a requisição para o endpoint
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro ao acessar o endpoint: ${response.statusText}`);
    }
    feed = await response.json();
  } catch (error) {
    throw new Error(
      `Erro ao consumir o endpoint "${apiUrl}": ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    );
  }

  // Verifica se a propriedade "items" existe e é um array
  if (
    !feed ||
    typeof feed !== 'object' ||
    !Array.isArray((feed as any).items)
  ) {
    throw new Error(
      `A resposta do endpoint não contém uma propriedade "items" válida. Verifique o conteúdo do endpoint: ${apiUrl}.`,
    );
  }

  let FeedSchema = object({
    items: array(
      object({
        id: string(),
        title: string(),
        published: number(),
        description: optional(string()),
        itunes_episode: optional(number()),
        itunes_episodeType: string(),
        itunes_image: optional(object({ href: optional(string()) })),
        enclosures: array(
          object({
            url: string(),
            type: string(),
          }),
        ),
      }),
    ),
  });

  let items = parse(FeedSchema, feed).items;

  let episodes: Array<Episode> = items
    .filter((item) => item.itunes_episodeType !== 'trailer')
    .map(
      ({
        description,
        id,
        title,
        enclosures,
        published,
        itunes_episode,
        itunes_episodeType,
        itunes_image,
      }) => {
        const episodeNumber =
          itunes_episodeType === 'bonus' ? 'Bonus' : itunes_episode;
        const episodeSlug = dasherize(title);

        // Lógica corrigida para o campo "publishedDate"
        const publishedDate = (() => {
          if (typeof published === 'string') {
            const parsedDate = Date.parse(published);
            return isNaN(parsedDate) ? Date.now() : parsedDate;
          }
          if (typeof published === 'number') {
            return published.toString().length === 10
              ? published * 1000
              : published;
          }
          return Date.now();
        })();

        return {
          id,
          title: `${title}`,
          content: description,
          description: truncate(description ?? '', 260),
          episodeImage: itunes_image?.href,
          episodeNumber,
          episodeSlug,
          published: publishedDate, // Garante que o valor seja um timestamp
          audio: enclosures.map((enclosure) => ({
            src: enclosure.url,
            type: enclosure.type,
          }))[0],
        };
      },
    );

  return episodes;
}
