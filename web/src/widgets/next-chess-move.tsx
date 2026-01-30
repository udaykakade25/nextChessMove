import "@/index.css";

import { useEffect } from "react";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import chessBg from "../../chess-background.jpg";

const VALID_PIECES = ["king", "queen", "rook", "bishop", "knight", "pawn"];

function getPieceImagePath(piece: string | undefined, color: "white" | "black"): string {
  const p = (piece || "pawn").toLowerCase();
  const safePiece = VALID_PIECES.includes(p) ? p : "pawn";
  if (safePiece === "king") return `/images/${color}-king.png`;
  return `/images/${safePiece}-${color}.png`;
}

const MOVE_PATTERN = /\b([KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]?|O-O(?:-O)?)\b/g;

function highlightMoves(text: string) {
  const parts = text.split(MOVE_PATTERN);
  return parts.map((part, i) =>
    MOVE_PATTERN.test(part) ? <strong key={i} className="chess-move">{part}</strong> : part
  );
}

function NextChessMove() {
  const { output, input } = useToolInfo<"next-chess-move">();

  useEffect(() => {
    document.body.style.background = `linear-gradient(rgba(10, 10, 18, 0.75), rgba(10, 10, 18, 0.75)), url(${chessBg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

  // Show result if we have a move
  if (output?.hasMove && output.piece && output.from && output.to) {
    const turn = output.turn || input?.turn || "white";

    return (
      <div className="container">
        <div className="result-card">
          <div className="card-glow" />

          <div className="header-section">
            <div className={`turn-indicator ${turn}`}>
              <img src={getPieceImagePath("king", turn as "white" | "black")} alt={`${turn} king`} className="turn-king-img" />
            </div>
            <div className="header-text">
              <span className="header-label">Best Move</span>
              <span className={`turn-text ${turn}`}>{turn}'s turn</span>
            </div>
          </div>

          <div className="move-section">
            <div className="piece-showcase">
              <div className={`piece-glow ${turn}`} />
              <div className="showcase-piece">
                <img src={getPieceImagePath(output.piece, turn as "white" | "black")} alt={output.piece} className="showcase-piece-img" />
              </div>
              <span className="piece-name">{output.piece}</span>
            </div>

            <div className="move-flow">
              <div className="square-container from">
                <span className="square-label">From</span>
                <div className="move-square">
                  <span className="square-text">{output.from}</span>
                </div>
              </div>

              <div className="arrow-wrapper">
                <div className="arrow-line" />
                <div className="arrow-head" />
              </div>

              <div className="square-container to">
                <span className="square-label">To</span>
                <div className="move-square">
                  <span className="square-text">{output.to}</span>
                </div>
              </div>
            </div>
          </div>

          {(() => {
            const winningRate = output.winningRate ?? 50;
            return (
              <div className="winning-rate-section">
                <div className="winning-rate-header">
                  <span className="winning-rate-label">Winning Rate</span>
                  <span className="winning-rate-value">{winningRate}%</span>
                </div>
                <div className="winning-rate-bar">
                  <div
                    className={`winning-rate-fill ${winningRate >= 50 ? 'favorable' : 'unfavorable'}`}
                    style={{ width: `${winningRate}%` }}
                  />
                  <div className="winning-rate-markers">
                    <span className="marker" style={{ left: '25%' }} />
                    <span className="marker center" style={{ left: '50%' }} />
                    <span className="marker" style={{ left: '75%' }} />
                  </div>
                </div>
                <div className="winning-rate-status">
                  {winningRate >= 70 ? (
                    <span className="status winning">Winning Position</span>
                  ) : winningRate >= 50 ? (
                    <span className="status slight-advantage">Slight Advantage</span>
                  ) : winningRate >= 30 ? (
                    <span className="status slight-disadvantage">Slight Disadvantage</span>
                  ) : (
                    <span className="status losing">Difficult Position</span>
                  )}
                </div>
              </div>
            );
          })()}

          {output.explanation && (
            <div className="explanation-section">
              <div className="explanation-header">
                <div className="explanation-icon">
                  <img src="/images/star-analysis.png" alt="analysis" className="explanation-icon-img" />
                </div>
                <span className="explanation-title">Analysis</span>
              </div>
              <div className="explanation-text">
                {(output.explanation as string).split(/(?<=\.)\s+/).filter(Boolean).map((sentence, i) => (
                  <p key={i} className="explanation-sentence">{highlightMoves(sentence)}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show waiting state
  return (
    <div className="container">
      <div className="result-card waiting-card">
        <div className="card-glow" />
        <div className="waiting-pieces">
          <div className="floating-piece p1"><img src="/images/white-king.png" alt="white king" /></div>
          <div className="floating-piece p2"><img src="/images/queen-black.png" alt="black queen" /></div>
          <div className="floating-piece p3"><img src="/images/knight-white.png" alt="white knight" /></div>
        </div>
        <div className="waiting-content">
          <h2 className="waiting-title">Chess Move Analyzer</h2>
          <p className="waiting-subtitle">
            Upload a chess board image to get AI-powered move suggestions
          </p>
        </div>
      </div>
    </div>
  );
}

export default NextChessMove;

mountWidget(<NextChessMove />);
