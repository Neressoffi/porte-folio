"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

type DayPoint = {
  label: string;
  count: number;
};

const CHART_W = 640;
const CHART_H = 200;
const PAD = { top: 28, right: 12, bottom: 36, left: 12 };

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function formatDayLabel(label: string) {
  const trimmed = label.replace(/\.$/, "");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function AdminActivityChart({
  data,
  title = "Activité — 7 derniers jours",
  summaryPrefix = "message",
  emptyMessage = "Aucun message sur cette période — le graphique se remplira dès la première soumission.",
}: {
  data: DayPoint[];
  title?: string;
  summaryPrefix?: string;
  emptyMessage?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = useMemo(() => Math.max(1, ...data.map((day) => day.count)), [data]);
  const total = useMemo(() => data.reduce((sum, day) => sum + day.count, 0), [data]);
  const hasActivity = total > 0;

  const plot = useMemo(() => {
    const innerW = CHART_W - PAD.left - PAD.right;
    const innerH = CHART_H - PAD.top - PAD.bottom;
    const baselineY = PAD.top + innerH;

    const points = data.map((day, index) => {
      const x =
        data.length === 1
          ? PAD.left + innerW / 2
          : PAD.left + (index / (data.length - 1)) * innerW;
      const ratio = day.count / max;
      const y = PAD.top + (1 - ratio) * innerH;

      return { x, y, baselineY, ...day };
    });

    const linePath = buildSmoothPath(points);
    const areaPath = linePath
      ? `${linePath} L ${points[points.length - 1]?.x ?? PAD.left} ${baselineY} L ${points[0]?.x ?? PAD.left} ${baselineY} Z`
      : "";

    const gridLines = Array.from({ length: 4 }, (_, index) => {
      const y = PAD.top + (index / 3) * innerH;
      return y;
    });

    return { points, linePath, areaPath, gridLines, baselineY, innerH };
  }, [data, max]);

  const active = activeIndex !== null ? plot.points[activeIndex] : null;

  return (
    <section className="admin-chart">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-stone-400">
            {hasActivity
              ? `${total} ${summaryPrefix}${total > 1 ? "s" : ""} cette semaine`
              : emptyMessage}
          </p>
        </div>
        <div className="admin-chart-badge">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-stone-500">Pic</span>
          <span className="mt-1 block text-xl font-semibold text-white">{max > 0 && hasActivity ? max : "—"}</span>
        </div>
      </div>

      <div className="admin-chart-frame mt-6">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="admin-chart-svg"
          role="img"
          aria-label="Graphique d'activité des sept derniers jours"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="admin-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0.38)" />
              <stop offset="55%" stopColor="rgba(220, 38, 38, 0.18)" />
              <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
            </linearGradient>
            <linearGradient id="admin-chart-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <filter id="admin-chart-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {plot.gridLines.map((y, index) => (
            <line
              key={y}
              x1={PAD.left}
              y1={y}
              x2={CHART_W - PAD.right}
              y2={y}
              className="admin-chart-grid-line"
            />
          ))}

          <line
            x1={PAD.left}
            y1={plot.baselineY}
            x2={CHART_W - PAD.right}
            y2={plot.baselineY}
            className="admin-chart-baseline"
          />

          {plot.areaPath ? (
            <motion.path
              d={plot.areaPath}
              fill="url(#admin-chart-fill)"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : null}

          {plot.linePath ? (
            <motion.path
              d={plot.linePath}
              fill="none"
              stroke="url(#admin-chart-stroke)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#admin-chart-glow)"
              initial={
                prefersReducedMotion
                  ? false
                  : { pathLength: 0, opacity: 0.4 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            />
          ) : null}

          {plot.points.map((point, index) => {
            const isActive = activeIndex === index;
            const isZero = point.count === 0;

            return (
              <g key={`${point.label}-${index}`}>
                <rect
                  x={point.x - 28}
                  y={PAD.top}
                  width={56}
                  height={plot.innerH}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(index)}
                />
                <motion.line
                  x1={point.x}
                  y1={PAD.top}
                  x2={point.x}
                  y2={plot.baselineY}
                  className="admin-chart-hover-line"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 7 : isZero ? 4 : 5}
                  className={isZero ? "admin-chart-dot admin-chart-dot-empty" : "admin-chart-dot"}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { scale: 0, opacity: 0 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                    delay: prefersReducedMotion ? 0 : 0.12 + index * 0.06,
                  }}
                />
                {isActive ? (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={14}
                    className="admin-chart-dot-ring"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : null}
                <text
                  x={point.x}
                  y={CHART_H - 10}
                  textAnchor="middle"
                  className={`admin-chart-day ${isActive ? "admin-chart-day-active" : ""}`}
                >
                  {formatDayLabel(point.label)}
                </text>
              </g>
            );
          })}
        </svg>

        <motion.div
          className="admin-chart-tooltip"
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : 8,
            scale: active ? 1 : 0.96,
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            left: active ? `${(active.x / CHART_W) * 100}%` : "50%",
          }}
        >
          {active ? (
            <>
              <span className="admin-chart-tooltip-label">{formatDayLabel(active.label)}</span>
              <span className="admin-chart-tooltip-value">
                {active.count} {summaryPrefix}{active.count > 1 ? "s" : ""}
              </span>
            </>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
