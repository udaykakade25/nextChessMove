import { McpServer } from "skybridge/server";
import { z } from "zod";

const server = new McpServer(
  {
    name: "next-chess-move",
    version: "0.0.1",
  },
  { capabilities: {} },
).registerWidget(
  "next-chess-move",
  {
    description: "Chess move analyzer widget",
  },
  {
    description: `Analyze a chess board image and display the best next move.

REQUIREMENTS:
- The user MUST provide a chess board image in their message
- Analyze the position from the image
- Determine whose turn it is (ask if not specified)
- Suggest the best move with piece, from square, to square, and explanation
- ALWAYS estimate the winningRate (0-100) based on material, position, and tactical advantages

Call this tool with ALL parameters (turn, piece, from, to, explanation, winningRate) after analyzing the chess board image.

IMPORTANT: Do NOT call this tool without an image. If the user asks about chess moves without providing an image, ask them to upload a chess board image first.`,
    inputSchema: {
      imageUrl: z
        .string()
        .optional()
        .describe("URL of the chess board image being analyzed. Include this so the user can see which position is being analyzed."),
      turn: z
        .enum(["white", "black"])
        .describe("Whose turn it is to move."),
      piece: z
        .string()
        .describe("The piece to move (e.g., 'Queen', 'Knight', 'Pawn')."),
      from: z
        .string()
        .describe("Current position in algebraic notation (e.g., 'e2')."),
      to: z
        .string()
        .describe("Target position in algebraic notation (e.g., 'e4')."),
      explanation: z
        .string()
        .describe("1 to 3 short, punchy sentences explaining why this is the best move. Keep each sentence under 12 words. Use chess notation where relevant. Example: 'Nf3 controls the center. Pins the bishop to the king. Opens the d-file for the rook.'"),
      winningRate: z
        .number()
        .min(0)
        .max(100)
        .describe("Winning percentage for the current player (0-100). REQUIRED. Estimate based on material count, piece activity, king safety, and positional advantages."),
    },
  },
  async (input) => {
    const turn = input.turn || "white";
    const hasMove = !!(input.piece && input.from && input.to);
    const explanation = input.explanation || "";
    const winningRate = input.winningRate <= 1 ? Math.round(input.winningRate * 100) : Math.round(input.winningRate);

    return {
      structuredContent: {
        imageUrl: input.imageUrl,
        turn,
        piece: input.piece,
        from: input.from,
        to: input.to,
        explanation,
        winningRate,
        hasMove,
      },
      content: [
        {
          type: "text",
          text: hasMove
            ? "The best move is displayed in the widget above. Do not repeat the move, explanation, or winning rate — the widget already shows everything."
            : "Please provide a chess board image to analyze.",
        },
      ],
      isError: false,
    };
  },
);

export default server;
export type AppType = typeof server;
