import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {enter, fade} from '../anim';
import {theme} from '../theme';

type Node = {id: string; label: string; x: number; y: number; glyph: 'library' | 'coop' | 'center' | 'nonprofit' | 'school' | 'new'};

const nodes: Node[] = [
  {id: 'lib', label: 'Library', x: 1000, y: 390, glyph: 'library'},
  {id: 'coop', label: 'Tech co-op', x: 1330, y: 310, glyph: 'coop'},
  {id: 'center', label: 'Community center', x: 1640, y: 450, glyph: 'center'},
  {id: 'np', label: 'Nonprofit', x: 1130, y: 680, glyph: 'nonprofit'},
  {id: 'school', label: 'University', x: 1480, y: 730, glyph: 'school'},
  {id: 'new', label: 'Joining', x: 1760, y: 740, glyph: 'new'},
];

const edges: [string, string][] = [
  ['lib', 'coop'],
  ['coop', 'center'],
  ['lib', 'np'],
  ['np', 'school'],
  ['school', 'center'],
  ['coop', 'school'],
  ['school', 'new'],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

// A message hops lib → coop → school → center; each hop only lights one piece.
const route = ['lib', 'coop', 'school', 'center'];

const Glyph: React.FC<{kind: Node['glyph']}> = ({kind}) => {
  const s = {stroke: theme.green800, strokeWidth: 3.2, fill: 'none', strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  switch (kind) {
    case 'library':
      return <g {...s}><path d="M-22 -6 L0 -20 L22 -6" /><path d="M-16 -4v20M-5 -4v20M5 -4v20M16 -4v20M-22 18h44" /></g>;
    case 'coop':
      return <g {...s}><rect x={-20} y={-14} width={40} height={26} rx={4} /><path d="M-10 18h20M0 12v6" /></g>;
    case 'center':
      return <g {...s}><path d="M-22 18V-2L0 -18 22 -2v20z" /><path d="M-6 18V6h12v12" /></g>;
    case 'nonprofit':
      return <g {...s}><path d="M0 16 C-24 0 -18 -18 -6 -16 C-2 -15 0 -12 0 -10 C0 -12 2 -15 6 -16 C18 -18 24 0 0 16z" /></g>;
    case 'school':
      return <g {...s}><path d="M-24 -6 L0 -18 L24 -6 L0 6z" /><path d="M-14 -1v12c8 6 20 6 28 0V-1" /></g>;
    case 'new':
      return <g {...s}><path d="M0 -14v28M-14 0h28" /></g>;
  }
};

export const Scene6: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const towerFade = 1 - fade(frame, 60, 120) * 0.78;
  const netIn = (i: number) => enter(frame, 150 + i * 14);
  const joinIn = enter(frame, 230, 30);
  // Packet travels across route between frames 390 and 510.
  const hop = Math.max(0, Math.min(route.length - 1, (frame - 318) / 40));
  const hopIdx = Math.floor(hop);
  const hopT = hop - hopIdx;
  const a = byId[route[hopIdx]];
  const b = byId[route[Math.min(hopIdx + 1, route.length - 1)]];
  const px = a.x + (b.x - a.x) * hopT;
  const py = a.y + (b.y - a.y) * hopT;
  const packetOn = frame >= 318 && frame < 560;
  const packetOpacity = 1 - fade(frame, 530, 556);
  const encrypted = frame >= 441;
  const openSource = enter(frame, 556, 24);

  return (
    <SceneFrame headline="Run by a network of trusted operators, not a large tech company." captions={captions}>
      {/* The single company in the middle, fading out */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: towerFade}}>
        {[[140, 800], [250, 840], [530, 840], [640, 800], [180, 680], [600, 680]].map(([x, y], i) => (
          <g key={i}>
            <line x1={390} y1={560} x2={x} y2={y} stroke={theme.muted} strokeWidth={3} />
            <circle cx={x} cy={y} r={18} fill={theme.border} stroke={theme.muted} strokeWidth={3} />
          </g>
        ))}
        <rect x={320} y={260} width={140} height={560} rx={8} fill="#8a969c" />
        {Array.from({length: 10}).map((_, r) =>
          [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={338 + c * 40} y={272 + r * 50} width={24} height={30} fill="#c9d0d3" />),
        )}
        <text x={390} y={240} textAnchor="middle" fontFamily={theme.fontBody} fontWeight={700} fontSize={30} fill={theme.muted}>
          Big Tech Co.
        </text>
      </svg>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {edges.map(([f, t], i) => {
          const A = byId[f];
          const B = byId[t];
          const isNew = t === 'new';
          const o = isNew ? joinIn : netIn(i);
          return (
            <line
              key={f + t}
              x1={A.x}
              y1={A.y}
              x2={A.x + (B.x - A.x) * o}
              y2={A.y + (B.y - A.y) * o}
              stroke={theme.green500}
              strokeWidth={5}
              strokeDasharray={isNew ? '10 12' : undefined}
              strokeLinecap="round"
            />
          );
        })}
        {nodes.map((n, i) => {
          const isNew = n.glyph === 'new';
          const t = isNew ? joinIn : netIn(i);
          const lit = packetOn && route.indexOf(n.id) !== -1 && route.indexOf(n.id) <= hop + 0.2;
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y}) scale(${t})`} opacity={t}>
              <circle r={62} fill={lit ? theme.green100 : theme.white} stroke={isNew ? theme.green500 : theme.green800} strokeWidth={5} strokeDasharray={isNew ? '10 10' : undefined} />
              <Glyph kind={n.glyph} />
              {/* operator's own card badge */}
              {!isNew && (
                <g transform="translate(38 -46)">
                  <rect x={-18} y={-12} width={36} height={24} rx={4} fill={theme.green800} stroke={theme.white} strokeWidth={2.5} />
                  <rect x={-12} y={2} width={18} height={4} rx={2} fill={theme.green200} />
                </g>
              )}
              <text y={96} textAnchor="middle" fontFamily={theme.fontDisplay} fontWeight={700} fontSize={28} fill={theme.navy}>
                {n.label}
              </text>
            </g>
          );
        })}
        {packetOn && (
          <g transform={`translate(${px} ${py})`} opacity={packetOpacity}>
            <rect x={-30} y={-22} width={60} height={44} rx={8} fill={theme.coral} />
            <path d="M-30 -18 L0 4 L30 -18" stroke={theme.white} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
            {/* only a fragment is visible to each operator */}
            <g transform="translate(0 -52)">
              <rect x={-100} y={-18} width={200} height={32} rx={16} fill={theme.navy} />
              <text textAnchor="middle" y={6} fontFamily={theme.fontBody} fontWeight={600} fontSize={18} fill={theme.white}>
                {encrypted ? 'encrypted by default' : hop >= route.length - 1 ? 'delivered' : 'sees only one piece'}
              </text>
            </g>
          </g>
        )}
      </svg>
      {/* Open source, owned by no one — takes the place the company tower used to hold */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 400,
          width: 560,
          opacity: openSource,
          transform: `translateY(${(1 - openSource) * 24}px)`,
          background: theme.white,
          border: `4px solid ${theme.green600}`,
          borderRadius: 28,
          padding: '32px 36px',
          boxShadow: '0 12px 32px rgba(10,35,55,0.12)',
        }}
      >
        <div style={{fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: 48, color: theme.green800}}>Open source</div>
        <div style={{fontFamily: theme.fontBody, fontWeight: 500, fontSize: 32, color: theme.bodyText, marginTop: 8}}>Nobody owns the protocol.</div>
      </div>
    </SceneFrame>
  );
};
