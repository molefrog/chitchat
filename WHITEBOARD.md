# Whiteboard

Whiteboard is a state on the frontend for displaying certain props of the discussion.

Available props:

- "Card". Like a sticker with a text, color and optional tag. We use cards to explain difficult
  concepts.
  - "id": unique id of the card (required)
  - "color": basic colors 4 colors: red, blue, green, yellow (required)
  - "text": short text on the card, like "User" or "CEO" or "A" or "Alice" etc. Can be no longer
    than a sentence. (required)
  - "tag": optional only symbol tag that can be added to the card later on. Like "🛑" or "🔥" or
    "💡" or "🔍" etc. (optional) Tags are used to update the card after some action for example.

Layout: Props are displayed on a canvas in clusters. A clusters is a ordered list of props. Every
cluster renders a grid of props.

DATA STRUCTURE:

```json
{
  "clusters": [
    {
      "id": "default",
      "label": "C-level", (optional)
      "props": [
        {
          "id": "prop_1",
          "type": "card",
          "color": "red",
          "text": "User",
          "tag": "🛑" // or null
        },
        {
          "id": "prop_2",
          "type": "card",
          "color": "blue",
          "text": "CEO",
          "tag": "🔥" // or null
        }
      ]
    }
  ]
}
```

ACTIONS:

- Add a new card, for example, add a new card with id "alice" and text "Alice" with color "blue"
  (will be added to the default group, if no specified)
- Update a card, available options:
  - Set or update a tag
  - Move to cluster
- Remove a card
- Remove a cluster
