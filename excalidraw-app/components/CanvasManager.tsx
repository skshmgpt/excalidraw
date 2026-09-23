import { useEffect, useRef, useState } from "react";

import "./CanvasManager.scss";

type ManagedCanvasSummary = {
  id: string;
  name: string;
  elementCount: number;
  preview?: string;
};

type CanvasManagerProps = {
  activeCanvasId: string;
  canvases: ManagedCanvasSummary[];
  disabled: boolean;
  isLoadingPreviews: boolean;
  onCreate: () => void;
  onDelete: (canvasId: string) => void;
  onRename: (canvasId: string, name: string) => void;
  onRequestPreviews: () => void;
  onSelect: (canvasId: string) => void;
};

export const CanvasManager = ({
  activeCanvasId,
  canvases,
  disabled,
  isLoadingPreviews,
  onCreate,
  onDelete,
  onRename,
  onRequestPreviews,
  onSelect,
}: CanvasManagerProps) => {
  const managerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const activeCanvas = canvases.find((canvas) => canvas.id === activeCanvasId);

  useEffect(() => {
    if (!isOpen || !managerRef.current) {
      return;
    }

    const ownerDocument = managerRef.current.ownerDocument;
    const onPointerDown = (event: PointerEvent) => {
      if (!managerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    ownerDocument.addEventListener("pointerdown", onPointerDown);
    return () => {
      ownerDocument.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) {
      onRequestPreviews();
    }
  };

  const saveName = (canvas: ManagedCanvasSummary) => {
    const name = editingName.trim();
    if (name) {
      onRename(canvas.id, name);
    }
    setEditingCanvasId(null);
  };

  return (
    <div
      className="canvas-manager"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      }}
      ref={managerRef}
    >
      <button
        aria-expanded={isOpen}
        className="canvas-manager__trigger"
        disabled={disabled}
        onClick={toggleOpen}
        title="Manage canvases"
        type="button"
      >
        <span className="canvas-manager__trigger-name">
          {activeCanvas?.name ?? "Canvases"}
        </span>
        <span aria-hidden="true" className="canvas-manager__chevron">
          ▾
        </span>
      </button>

      {isOpen && (
        <section
          aria-label="Canvases"
          className="Island canvas-manager__panel"
        >
          <header className="canvas-manager__header">
            <div>
              <h2>Canvases</h2>
              <span>{canvases.length} saved canvases</span>
            </div>
            <button
              className="canvas-manager__create"
              disabled={disabled}
              onClick={onCreate}
              type="button"
            >
              + New canvas
            </button>
          </header>

          <ul className="canvas-manager__list">
            {canvases.map((canvas) => {
              const isActive = canvas.id === activeCanvasId;
              const isEditing = canvas.id === editingCanvasId;
              return (
                <li
                  aria-current={isActive ? "true" : undefined}
                  className={
                    isActive
                      ? "canvas-manager__card canvas-manager__card--active"
                      : "canvas-manager__card"
                  }
                  key={canvas.id}
                >
                  <button
                    aria-label={"Open " + canvas.name}
                    aria-pressed={isActive}
                    className="canvas-manager__select"
                    disabled={disabled}
                    onClick={() => {
                      setIsOpen(false);
                      onSelect(canvas.id);
                    }}
                    type="button"
                  >
                    <span aria-hidden="true" className="canvas-manager__preview">
                      {canvas.preview ? (
                        <img alt="" src={canvas.preview} />
                      ) : (
                        <span>
                          {canvas.elementCount === 0
                            ? "Empty canvas"
                            : isLoadingPreviews
                              ? "Loading preview…"
                              : "Preview unavailable"}
                        </span>
                      )}
                    </span>
                    <span className="canvas-manager__name" title={canvas.name}>
                      {canvas.name}
                    </span>
                    <span className="canvas-manager__count">
                      {canvas.elementCount}{" "}
                      {canvas.elementCount === 1 ? "element" : "elements"}
                    </span>
                  </button>

                  {isEditing ? (
                    <form
                      className="canvas-manager__rename-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveName(canvas);
                      }}
                    >
                      <input
                        aria-label={"Canvas name for " + canvas.name}
                        autoFocus
                        maxLength={80}
                        onChange={(event) => setEditingName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            event.stopPropagation();
                            setEditingCanvasId(null);
                          }
                        }}
                        value={editingName}
                      />
                      <button disabled={disabled} type="submit">
                        Save
                      </button>
                      <button
                        disabled={disabled}
                        onClick={() => setEditingCanvasId(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="canvas-manager__actions">
                      <button
                        aria-label={"Rename " + canvas.name}
                        disabled={disabled}
                        onClick={() => {
                          setEditingCanvasId(canvas.id);
                          setEditingName(canvas.name);
                        }}
                        title="Rename canvas"
                        type="button"
                      >
                        Rename
                      </button>
                      <button
                        aria-label={"Delete " + canvas.name}
                        disabled={disabled || canvases.length < 2}
                        onClick={() => onDelete(canvas.id)}
                        title="Delete canvas"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
};
