# Next Chess Move

A ChatGPT connector that analyzes chess board images and suggests the best next move.

## Features

- Upload chess board images (drag & drop or click to upload)
- Select whose turn it is (White/Black)
- Get AI-powered move suggestions with explanations
- Beautiful dark-themed UI with chess piece icons

## How It Works

1. User uploads a chess board image through the widget
2. User selects whose turn it is
3. The image is sent to ChatGPT for analysis
4. ChatGPT uses its vision capabilities to analyze the board position
5. The best move is displayed with algebraic notation (e.g., "Queen e3 to e5")

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- ngrok or similar tunnel for ChatGPT connection

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The server runs at http://localhost:3000

### Connect to ChatGPT

1. Start ngrok tunnel:
   ```bash
   ngrok http 3000
   ```

2. In ChatGPT, go to **Settings > Connectors > Create**

3. Add your ngrok URL with `/mcp` suffix:
   ```
   https://your-ngrok-url.ngrok-free.app/mcp
   ```

### Usage

1. In ChatGPT, say something like "Help me find the best chess move"
2. Upload a chess board image in the widget
3. Select whose turn it is (White or Black)
4. Click "Get Best Move"
5. ChatGPT will analyze the position and show the recommended move

## Example Output

```
Best Move for White:
Queen e3 -> e7

This move threatens the opponent's king while also
attacking the undefended rook on a7.
```

## Project Structure

```
next-chess-move/
├── server/
│   └── src/
│       ├── index.ts      # Express server entry
│       ├── middleware.ts # MCP middleware
│       └── server.ts     # Widget registration
├── web/
│   └── src/
│       ├── helpers.ts    # Type-safe hooks
│       ├── index.css     # Styles
│       └── widgets/
│           └── next-chess-move.tsx  # Main widget
├── package.json
└── tsconfig.json
```
