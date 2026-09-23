import type { CSSProperties } from "react";

type CanvasManagerProps = {
  activeCanvasId: string;
  canvases: { id: string; name: string }[];
  disabled: boolean;
  onCreate: () => void;
  onDelete: () => void;
  onRename: () => void;
  onSelect: (canvasId: string) => void;
};

const controlStyle: CSSProperties = {
  border: "1px solid var(--color-surface-low)",
  borderRadius: 6,
  background: "var(--island-bg-color)",
  color: "var(--color-on-surface)",
  font: "inherit",
  height: 32,
  padding: "0 8px",
};

export const CanvasManager = ({
  activeCanvasId,
  canvases,
  disabled,
  onCreate,
  onDelete,
  onRename,
  onSelect,
}: CanvasManagerProps) => (
  <div
    aria-label="Canvas manager"
    role="toolbar"
    style={{
      alignItems: "center",
      background: "var(--island-bg-color)",
      border: "1px solid var(--color-surface-low)",
      borderRadius: 8,
      boxShadow: "0 2px 8px #0002",
      display: "flex",
      gap: 6,
      left: "50%",
      padding: 6,
      position: "fixed",
      top: 10,
      transform: "translateX(-50%)",
      zIndex: 10,
    }}
  >
    <label htmlFor="excalidraw-canvas-select">Canvas</label>
    <select
      id="excalidraw-canvas-select"
      aria-label="Active canvas"
      disabled={disabled}
      onChange={(event) => onSelect(event.currentTarget.value)}
      style={{ ...controlStyle, maxWidth: 180 }}
      value={activeCanvasId}
    >
      {canvases.map((canvas) => (
        <option key={canvas.id} value={canvas.id}>
          {canvas.name}
        </option>
      ))}
    </select>
    <button
      aria-label="Create canvas"
      disabled={disabled}
      onClick={onCreate}
      style={controlStyle}
      title="Create canvas"
      type="button"
    >
      +
    </button>
    <button
      disabled={disabled}
      onClick={onRename}
      style={controlStyle}
      type="button"
    >
      Rename
    </button>
    <button
      aria-label="Delete canvas"
      disabled={disabled || canvases.length < 2}
      onClick={onDelete}
      style={controlStyle}
      type="button"
    >
      Delete
    </button>
  </div>
);
