"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props<T> {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, index: number) => React.ReactNode;
  itemLabel: (item: T, index: number) => string;
  className?: string;
  layout?: "list" | "grid";
}

/** Drag-and-drop list with keyboard-accessible move buttons. */
export function SortableList<T>({ items, onChange, render, itemLabel, className, layout = "list" }: Props<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };

  return (
    <ul className={cn(layout === "grid" ? "grid grid-cols-2 gap-3 sm:grid-cols-4" : "space-y-2", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          draggable
          onDragStart={(e) => { setDragIndex(i); e.dataTransfer.effectAllowed = "move"; }}
          onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
          onDragLeave={() => setOverIndex((o) => (o === i ? null : o))}
          onDrop={(e) => { e.preventDefault(); if (dragIndex != null) move(dragIndex, i); setDragIndex(null); setOverIndex(null); }}
          onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
          className={cn(
            "group relative rounded-lg border bg-paper transition-colors",
            overIndex === i && dragIndex !== i ? "border-accent" : "border-line",
            dragIndex === i && "opacity-50",
          )}
        >
          <div className={cn("flex gap-2", layout === "grid" ? "flex-col p-2" : "items-start p-2")}>
            {layout === "list" && <GripVertical aria-hidden className="mt-2.5 size-4 shrink-0 cursor-grab text-ink-soft" />}
            <div className="min-w-0 flex-1">{render(item, i)}</div>
            <div className={cn("flex shrink-0 gap-0.5", layout === "grid" ? "justify-between" : "")}>
              <button type="button" className="adm-icon" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${itemLabel(item, i)} up`}><ArrowUp className="size-4" /></button>
              <button type="button" className="adm-icon" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${itemLabel(item, i)} down`}><ArrowDown className="size-4" /></button>
              <button type="button" className="adm-icon hover:text-[#b3261e]" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${itemLabel(item, i)}`}><Trash2 className="size-4" /></button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
