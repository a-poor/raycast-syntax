import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import TurndownService from "turndown";

const SYNTAX_API_BASE = "https://syntax.fm/api";

const turndownService = new TurndownService();
turndownService.addRule("strip-links", {
  filter: "a",
  replacement: function(content, node) {
    return content;
    
    // try {
    //   const aNode = node as HTMLAnchorElement;
    //   const href = aNode?.getAttribute?.("href");
    //   if (!href) {
    //     return content;
    //   }

    //   let url = href;
    //   if (url.startsWith("/")) {
    //     url = "https://syntax.fm" + url;
    //   }
    //   if (url.startsWith("#")) {
    //     url = "https://syntax.fm" + url;
    //   }
    //   return `[${content}](${url})`;
    // } catch (error) {
    //   console.error(error);
    //   return content;
    // }
  }
});

interface IEpisodeData {
  id: number;
  title: string;
  slug: string;
  date: number;
  displayDate: string;
  displayNumber: string;
  url: string;
  number: number;
  html: string;
}

// function fetchAllEpisodes() {}

// function fetchEpisode() {}

// async function fetchLatestEpisode() {
//   const url = SYNTAX_API_BASE + "/shows/latest";
//   const response = await fetch(url);
//   const data = await response.json();
// }

function formatMarkdown({data}: {data: IEpisodeData}) {
  const content = turndownService.turndown(data.html);
  return  `
  # [Ep. ${data.displayNumber}] ${data.title}
  
  _published ${data.displayDate}_

  URL: ${data.url}

  ${content}
  `;
}

function LatestEpisode() {
  const url = SYNTAX_API_BASE + "/shows/latest";
  const { 
    isLoading, 
    data,
    error,
  } = useFetch(url, {
    parseResponse: res => res.json(),
  });
  if (error) { 
    return (
      <Detail 
        isLoading={isLoading}
        markdown={
          isLoading 
          ? "" 
          : "# Error\n\n" + `${error.message}`
        }
      />
    );
  }
  const episodeData = data as IEpisodeData;
  return (
    <Detail 
      isLoading={isLoading}
      markdown={
        isLoading 
        ? "" 
        : formatMarkdown({data: episodeData})
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser 
            title="Open in Browser" 
            url={"https://syntax.fm/" + episodeData.slug}
          />
        </ActionPanel>
      }
    />
  );
}


export default function Command() {
  return (
    <List navigationTitle="Syntax Episodes">
      <List.Item
        icon="list-icon.png"
        title="Latest Episode"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={(
              <LatestEpisode />
            )} />
          </ActionPanel>
        }
      />
      <List.Item
        icon="list-icon.png"
        title="Browse Episodes"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
      <List.Item
        icon="list-icon.png"
        title="Search Episode"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
