import {
  Block,
  KnownBlock,
  MrkdwnElement,
  PlainTextElement,
} from "@slack/types";
import { LibraryItemData, PublishedLibraryPayload } from "./app";

interface SlackBlocks {
  blocks: KnownBlock[];
}

const getFields = (
  array: LibraryItemData[]
): (PlainTextElement | MrkdwnElement)[] => {
  if (array.length <= 10) {
    return array.map((item) => ({
      type: "mrkdwn",
      text: `❖ ${item.name}`,
    }));
  }
  if (array.length > 10) {
    return array.slice(0, 10).map((item, index) => {
      if (index === 9)
        return { type: "mrkdwn", text: `And ${array.length - 9} more...` };
      return {
        type: "mrkdwn",
        text: `❖ ${item.name}`,
      };
    });
  }
};

const Blocks = (content: PublishedLibraryPayload): SlackBlocks => {
  const {
    created_components,
    created_styles,
    deleted_components,
    deleted_styles,
    description,
    event_type,
    file_key,
    file_name,
    modified_components,
    modified_styles,
    passcode,
    timestamp,
    triggered_by,
  } = content;

  return {
    blocks: [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "🔥 Library Update",
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*<https://www.figma.com/file/${file_key}/|${file_name}>*\n${
            description.length ? description : "No description provided."
          }`,
        },
      },
      // Created componentes
      {
        ...(created_components.length && {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🚀 *New Components*",
          },
        }),
      },
      {
        ...(created_components.length && {
          type: "section",
          fields: getFields(created_components),
        }),
      },
      // Modified components
      {
        ...(modified_components.length && {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🧱 *Affected Components*",
          },
        }),
      },
      {
        ...(modified_components.length && {
          type: "section",
          fields: getFields(modified_components),
        }),
      },
      // Modified styles
      {
        ...(created_styles.length && {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🖼 *New Styles*",
          },
        }),
      },
      {
        ...(created_styles.length && {
          type: "section",
          fields: getFields(created_styles),
        }),
      },
      // Modified styles
      {
        ...(modified_styles.length && {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🎨 *Affected Styles*",
          },
        }),
      },
      {
        ...(modified_styles.length && {
          type: "section",
          fields: getFields(modified_styles),
        }),
      },
      // Deleted components
      {
        ...(deleted_components.length && {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🪓 *Deleted Components*",
          },
        }),
      },
      {
        ...(deleted_components.length && {
          type: "section",
          fields: getFields(deleted_components),
        }),
      },
      // Deleted styles
      {
        ...(deleted_styles.length && {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🛷 *Deleted Styles*",
          },
        }),
      },
      {
        ...(deleted_styles.length && {
          type: "section",
          fields: getFields(deleted_styles),
        }),
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Published by @${triggered_by.handle}`,
          },
        ],
      },
    ],
  };
};

export default Blocks;
