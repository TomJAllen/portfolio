// The scroll story behind the homepage orrery.
//
// Scroll position drives a single progress value (0 to 1) that steps through:
//   hero → 01 get inside the chaos (telescope) → 02 centre of gravity (sun rises)
//   → 03 measure (stars form the dial) → 04 orbit (planets spiral in) → 05 simplify (flatten)
//   → the finished orrery beside the introduction.
// Everything is drawn into the SVG skeleton rendered by OrreryStory.tsx.
// startStory() returns a cleanup function that removes everything it added.

const NS = "http://www.w3.org/2000/svg";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const win = (p, a, b) => smooth(clamp((p - a) / (b - a)));
const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};
const angleOf = (dx, dy) => (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = up, clockwise
const mod = (a, n) => ((a % n) + n) % n;
const el = (tag, attrs, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
};

// The story, as progress from 0 to 1
const T = {
  dock: [0, 0.08], // hero lifts away
  calm: [0.1, 0.17], // drift calms during step 1
  steps: [
    [0.08, 0.24],
    [0.24, 0.4],
    [0.4, 0.57],
    [0.57, 0.75],
    [0.75, 0.91],
  ],
  sun: [0.25, 0.34],
  stars: [0.41, 0.45, 0.06], // first start, last start, duration
  planets: [0.58, 0.02, 0.045], // first start, gap, duration
  flatten: [0.76, 0.84],
  moon: [0.64, 0.7],
  settle: [0.89, 0.97], // orrery slides into place, introduction arrives
  labels: [0.91, 0.97],
};

// Lock points: the hero, each step once its motion has finished, and the finished orrery.
// Scroll maps to progress with a short hold at each lock, and a long one at the end so the
// finished orrery can be reached and lingered on without moving.
const LOCKS = [0, 0.19, 0.35, 0.52, 0.71, 0.86, 1],
  HOLD = 0.04,
  END_HOLD = 0.14;
const PL = (() => {
  const holds = LOCKS.map((p, i) => (i === 0 ? HOLD / 2 : i === LOCKS.length - 1 ? END_HOLD : HOLD));
  const free = 1 - holds.reduce((a, b) => a + b, 0);
  let r = 0;
  return LOCKS.map((p, i) => {
    const seg = { r0: r, r1: r + holds[i], p };
    r += holds[i] + (i < LOCKS.length - 1 ? free * (LOCKS[i + 1] - p) : 0);
    return seg;
  });
})();
const lockRaw = PL.map((s, i) => (i === 0 ? 0 : i === PL.length - 1 ? 1 : (s.r0 + s.r1) / 2));
function remap(raw) {
  for (let i = 0; i < PL.length; i++) {
    const s = PL[i];
    if (raw <= s.r1)
      return raw >= s.r0 ? s.p : lerp(PL[i - 1].p, s.p, (raw - PL[i - 1].r1) / (s.r0 - PL[i - 1].r1));
  }
  return 1;
}

// Orbits in orrery units (the sun is r 54). size: detailed planet; dot: final flat dot.
// home: where each planet floats round the hero; field: where it drifts once the story starts.
// Both are fractions of the stage, [desktop, narrow].
const ORBITS = [
  {
    key: "product",
    label: "Product",
    href: "#work",
    c: "--ultramarine",
    r: 104,
    size: 16,
    dot: 13,
    kind: "bands",
    period: 70,
    home: [
      [0.16, 0.26],
      [0.14, 0.16],
    ],
    field: [
      [0.47, 0.28],
      [0.2, 0.2],
    ],
  },
  {
    key: "ai",
    label: "AI platforms",
    href: "#drives",
    c: "--teal",
    r: 152,
    size: 15,
    dot: 11,
    kind: "ringed",
    period: 95,
    home: [
      [0.82, 0.2],
      [0.8, 0.12],
    ],
    field: [
      [0.72, 0.2],
      [0.76, 0.13],
    ],
  },
  {
    key: "build",
    label: "Build",
    href: "#building",
    c: "--ochre",
    r: 200,
    size: 12,
    dot: 9,
    kind: "craters",
    period: 120,
    dashed: true,
    home: [
      [0.86, 0.92],
      [0.86, 0.82],
    ],
    field: [
      [0.86, 0.7],
      [0.82, 0.44],
    ],
  },
  {
    key: "play",
    label: "Play",
    href: "#games",
    c: "--moon",
    r: 248,
    size: 10,
    dot: 7,
    kind: "jupiter",
    period: 150,
    hollow: true,
    home: [
      [0.62, 0.9],
      [0.52, 0.93],
    ],
    field: [
      [0.6, 0.8],
      [0.48, 0.52],
    ],
  },
  {
    key: "endurance",
    label: "Endurance",
    href: "#off",
    c: "--red",
    r: 290,
    size: 11,
    dot: 8,
    kind: "mars",
    period: 190,
    dashed: true,
    home: [
      [0.1, 0.9],
      [0.14, 0.8],
    ],
    field: [
      [0.4, 0.66],
      [0.18, 0.44],
    ],
  },
];
const DIAL = 314;

// Hover readouts: what's involved in each orbit. Add stats as [label, level 1-5] pairs to show bars.
const READOUT = {
  product: {
    line: "Ontology & Standards at Decidr, and product leadership at KOKO and 9ine before that.",
    stats: [],
  },
  ai: {
    line: "Semantic layers, knowledge graphs, ontologies and the agent platforms that run on them.",
    stats: [],
  },
  build: { line: "Things I design and build myself, from Patrol Ready to a home lab.", stats: [] },
  play: {
    line: "Small Unity projects, and hunting for hidden gems in the lowest-rated corners of Steam.",
    stats: [],
  },
  endurance: {
    line: "Rowing, triathlons and adventure racing. The bigger the challenge, the better.",
    stats: [],
  },
};

export function startStory() {
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const sky = $("sky"),
    defs = $("defs"),
    stage = $("stage"),
    story = $("top");
  const hero = $("story-hero"),
    intro = $("story-intro"),
    wordmark = $("wordmark"),
    skipLink = $("skip");
  const readout = $("readout"),
    nextBtn = $("next"),
    lensG = $("lens");
  const system = $("system"),
    sun = $("sun"),
    ringsG = $("rings"),
    starsG = $("stars"),
    planetsG = $("planets"),
    specksG = $("specks");
  const moonEl = $("moon"),
    moonDetail = $("moon-detail"),
    moonFlat = $("moon-flat");
  const sunArt = $("sun-art"),
    sunFlat = $("sun-flat"),
    sunMark = $("sun-mark"),
    guidesG = $("guides");
  const stepEls = [...document.querySelectorAll(".step")];

  // Everything this run adds, so cleanup can take it away again
  for (const g of [ringsG, starsG, planetsG, specksG, lensG]) g.textContent = "";
  for (const n of defs.querySelectorAll(".dyn")) n.remove();
  const off = [];
  const on = (target, ev, fn, opts) => {
    target.addEventListener(ev, fn, opts);
    off.push(() => target.removeEventListener(ev, fn, opts));
  };
  let alive = true;

  // ---- Readout ----
  let roKey = null;
  function showReadout(pl) {
    if (!pl) {
      readout.classList.remove("on");
      roKey = null;
      return;
    }
    if (roKey !== pl.o.key) {
      roKey = pl.o.key;
      const d = READOUT[pl.o.key];
      readout.style.setProperty("--c", pl.o.hollow ? "var(--text)" : `var(${pl.o.c})`);
      readout.innerHTML =
        `<p class="ro-name"><i></i>${pl.o.label}</p><p class="ro-line">${d.line}</p>` +
        d.stats
          .map(
            ([k, v]) =>
              `<div class="ro-row"><span>${k}</span><span class="ro-bar">${[1, 2, 3, 4, 5].map((n) => `<b class="${n <= v ? "on" : ""}"></b>`).join("")}</span></div>`,
          )
          .join("");
    }
    readout.classList.add("on");
  }

  // ---- Planets: a detailed body for the opening, a flat dot for the end ----
  function drawPlanet(o, i, parent) {
    const g = el("radialGradient", { id: `pg-${i}`, class: "dyn", cx: ".34", cy: ".3", r: ".78" }, defs);
    el("stop", { offset: "0", style: `stop-color: color-mix(in srgb, var(${o.c}) 55%, white)` }, g);
    el("stop", { offset: ".55", style: `stop-color: var(${o.c})` }, g);
    el("stop", { offset: "1", style: `stop-color: color-mix(in srgb, var(${o.c}) 62%, black)` }, g);

    const detail = el("g", {}, parent);
    const ringStyle = `stroke: color-mix(in srgb, var(${o.c}) 55%, white)`;
    if (o.kind === "ringed")
      el(
        "path",
        {
          d: "M -19 0 A 19 5.5 0 0 1 19 0",
          fill: "none",
          style: ringStyle,
          "stroke-width": 1.8,
          transform: "rotate(-18)",
        },
        detail,
      );
    el("circle", { r: 10, fill: `url(#pg-${i})` }, detail);
    const f = el("g", { "clip-path": "url(#disc)" }, detail);
    if (o.kind === "bands") {
      el("rect", { x: -12, y: -4.2, width: 24, height: 1.6, fill: "white", opacity: 0.22 }, f);
      el("rect", { x: -12, y: 1.2, width: 24, height: 2.6, fill: "white", opacity: 0.14 }, f);
      el("ellipse", { cx: 3.5, cy: 2.5, rx: 2.4, ry: 1.3, fill: "black", opacity: 0.18 }, f);
    } else if (o.kind === "jupiter") {
      // A pale gas giant in charcoal and white bands, so it reads as the hollow ring once flattened
      for (const [y, h, c, op] of [
        [-6.5, 1.4, "#3A3A3E", 0.35],
        [-3.2, 2.2, "#3A3A3E", 0.5],
        [-0.4, 1.2, "#FFFFFF", 0.55],
        [2.2, 2.6, "#3A3A3E", 0.45],
        [6, 1.6, "#3A3A3E", 0.3],
      ]) {
        el("rect", { x: -12, y, width: 24, height: h, fill: c, opacity: op }, f);
      }
      el("ellipse", { cx: 3.2, cy: 3.6, rx: 2.3, ry: 1.25, fill: "#2A2A2E", opacity: 0.6 }, f);
      el("circle", { r: 9.4, fill: "none", stroke: "#2A2A2E", "stroke-width": 1.2, opacity: 0.4 }, f);
    } else {
      const cr =
        o.kind === "mars"
          ? [
              [-3.5, 2, 2],
              [3, -3.5, 1.4],
              [4.5, 3.5, 1],
            ]
          : [
              [2.5, -3, 1.8],
              [-4, 1.5, 1.3],
            ];
      for (const [x, y, r] of cr) el("circle", { cx: x, cy: y, r, fill: "black", opacity: 0.16 }, f);
    }
    el("circle", { cx: 5, cy: 5, r: 12, fill: "black", opacity: 0.12 }, f);
    if (o.kind === "ringed")
      el(
        "path",
        {
          d: "M -19 0 A 19 5.5 0 0 0 19 0",
          fill: "none",
          style: ringStyle,
          "stroke-width": 1.8,
          transform: "rotate(-18)",
        },
        detail,
      );
    if (o.kind === "mars")
      el(
        "circle",
        { cx: 15, cy: -10, r: 2.2, style: `fill: color-mix(in srgb, var(${o.c}) 50%, white)` },
        detail,
      );

    const flat = o.hollow
      ? el(
          "circle",
          { r: 9, style: "fill: var(--ground); stroke: var(--text)", "stroke-width": 2.6, opacity: 0 },
          parent,
        )
      : el("circle", { r: 10, style: `fill: var(${o.c})`, opacity: 0 }, parent);
    return { detail, flat };
  }

  const planets = ORBITS.map((o, i) => {
    const colour = `var(${o.hollow ? "--text" : o.c})`;
    const og = el("g", { class: "orbit", style: `--c: ${colour}` }, ringsG);
    const a = el("a", { href: o.href, "aria-label": `${o.label}: go to section` }, og);
    el("circle", { r: o.r, class: "hit" }, a);
    const ring = el("circle", { r: o.r, class: o.dashed ? "ring dashed" : "ring" }, a);
    // The orbit's name rides along the top of its ring
    el(
      "path",
      {
        id: `rp-${i}`,
        class: "dyn",
        d: `M ${-o.r},0 a ${o.r},${o.r} 0 1,1 ${2 * o.r},0 a ${o.r},${o.r} 0 1,1 ${-2 * o.r},0`,
        fill: "none",
      },
      defs,
    );
    const rlabel = el("text", { class: "rlabel", "aria-hidden": "true" }, a);
    el("textPath", { href: `#rp-${i}`, startOffset: "25%", "text-anchor": "middle" }, rlabel).textContent =
      o.label.toLowerCase();
    rlabel.style.opacity = 0;
    const link = el(
      "a",
      { href: o.href, class: "planet-link", tabindex: "-1", "aria-hidden": "true" },
      planetsG,
    );
    const { detail, flat } = drawPlanet(o, i, link);
    return {
      o,
      og,
      a,
      ring,
      rlabel,
      link,
      detail,
      flat,
      circ: 2 * Math.PI * o.r,
      start: T.planets[0] + i * T.planets[1],
      dur: T.planets[2],
      rev: 0,
      hot: 0,
      hotT: 0,
      wob: { f: 0.25 + rnd() * 0.25, ph: rnd() * 6.28, amp: 14 + rnd() * 10 },
      zoom: 0,
      orb: 0,
      push: { x: 0, y: 0 },
    };
  });

  // Hover or focus on a ring or planet lights it up
  const setHot = (key) => {
    for (const p of planets) {
      const lit = p.o.key === key;
      p.hotT = lit ? 1 : 0;
      p.og.classList.toggle("hot", lit);
    }
  };
  for (const p of planets)
    for (const n of [p.a, p.link]) {
      on(n, "mouseenter", () => setHot(p.o.key));
      on(n, "mouseleave", () => setHot(null));
      on(n, "focus", () => setHot(p.o.key));
      on(n, "blur", () => setHot(null));
    }

  // Easter egg: the little moon by the sun is the one body that links nowhere. It has a dark side.
  const flipTheme = (e) => {
    e.preventDefault();
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      window.dispatchEvent(new Event("themechange"));
    };
    const r = moonEl.getBoundingClientRect();
    const x = r.x + r.width / 2,
      y = r.y + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }
    const vt = document.startViewTransition(apply);
    vt.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          {
            duration: 750,
            easing: "cubic-bezier(.45, 0, .2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  };
  on(moonEl, "click", flipTheme);
  on(moonEl, "keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") flipTheme(e);
  });

  // ---- Stars: sparkles and dots that drift, form the dial in step 3, become its ticks in step 5 ----
  const SPARK = "M0,-1 Q.14,-.14 1,0 Q.14,.14 0,1 Q-.14,.14 -1,0 Q-.14,-.14 0,-1Z";
  const stars = Array.from({ length: 60 }, (_, i) => {
    const big = i % 5 === 0;
    const g = el("g", {}, starsG);
    const spark = big ? el("path", { d: SPARK, class: "star" }, g) : null;
    const dot = el("circle", { r: 1, class: "star" }, g);
    const tick = el("line", { class: "tick" }, g);
    tick.style.opacity = 0;
    if (big) dot.style.opacity = 0;
    return {
      g,
      spark,
      dot,
      tick,
      big,
      fx: rnd(),
      fy: rnd(),
      start: lerp(T.stars[0], T.stars[1], rnd()),
      dur: T.stars[2],
      tw: { f: 0.8 + rnd() * 1.6, ph: rnd() * 6.28 },
      base: big ? 4.5 + rnd() * 2.5 : 1 + rnd() * 0.8,
      depth: 0.3 + rnd() * 0.7,
      wob: { f: 0.15 + rnd() * 0.3, ph: rnd() * 6.28, amp: 5 + rnd() * 9 },
    };
  });
  const specks = Array.from({ length: 70 }, () => ({
    node: el("circle", { class: "speck" }, specksG),
    fx: rnd(),
    fy: rnd(),
    r: 0.5 + rnd() * 0.8,
    o: 0.12 + rnd() * 0.3,
    depth: 0.1 + rnd() * 0.3,
    tw: { f: 0.5 + rnd(), ph: rnd() * 6.28 },
  }));

  // Evenly spaced end angles in the order bodies sit round the sun, turned to keep every journey short
  function assign(items, step, minTravel) {
    const order = [...items].sort((a, b) => a.a0 - b.a0);
    let best = null;
    for (let base = 0; base < 360; base += 3) {
      let worst = 0;
      order.forEach((it, k) => {
        let d = mod(base + k * step - it.a0, 360);
        if (d < minTravel) d += 360;
        worst = Math.max(worst, d);
      });
      if (!best || worst < best.worst) best = { base, worst };
    }
    order.forEach((it, k) => {
      let d = mod(best.base + k * step - it.a0, 360);
      if (d < minTravel) d += 360;
      it.travel = d;
      it.fa = it.a0 + d;
      it.slot = k;
    });
  }

  // ---- Geometry, recomputed on resize ----
  let G = null,
    lensOrder = [],
    lensTicks = null,
    lensT = 0;
  const moonPath = { rev: 0 };
  function layout() {
    const W = stage.clientWidth,
      H = stage.clientHeight,
      top = 56;
    sky.setAttribute("viewBox", `0 0 ${W} ${H}`);
    // Below ~980px there isn't room for the introduction and a readable orrery side by side, so stack them
    const mobile = W < 980;

    const hw = hero.offsetWidth,
      hh = hero.offsetHeight;
    const hx = (W - hw) / 2,
      hy0 = top + (H - top - hh) / 2;
    const below = top + 8;

    // The orrery while it is being built: centred, with steps either side (or beneath when narrow)
    let side = 0,
      RC,
      cyC;
    const cxC = W / 2;
    if (!mobile) {
      side = Math.min(330, W * 0.27);
      RC = Math.min((W - 2 * side) / 2, (H - below - 28) / 2);
      cyC = below + (H - below) / 2;
    } else {
      RC = Math.min(W / 2 - 14, (H - 180 - below - 10) / 2);
      cyC = below + 10 + RC;
    }

    // The finished layout: introduction left, orrery right (or stacked when narrow)
    const iw = intro.offsetWidth,
      ih = intro.offsetHeight;
    let ix, iy, cxF, cyF, RF;
    if (!mobile) {
      ix = Math.max(24, W * 0.06);
      iy = top + (H - top - ih) / 2;
      const lx = ix + iw + 40,
        aw = W - lx - 24;
      RF = Math.min(aw / 2, (H - top - 32) / 2);
      cxF = lx + aw / 2;
      cyF = top + (H - top) / 2 + 4;
    } else {
      ix = (W - iw) / 2;
      iy = top + 14;
      const zt = iy + ih + 26,
        zb = H - 14;
      RF = Math.min(W / 2 - 12, (zb - zt) / 2);
      cxF = W / 2;
      cyF = zt + (zb - zt) / 2;
    }
    intro.style.left = ix + "px";

    stepEls.forEach((s, i) => {
      if (!mobile) {
        const w = Math.max(200, side - 40);
        s.style.width = w + "px";
        const left = i % 2 === 0;
        const colCx = left ? (cxC - RC) / 2 : cxC + RC + (W - cxC - RC) / 2;
        s.style.left = colCx - w / 2 + "px";
        s.style.textAlign = left ? "right" : "left";
        s.dataset.y = cyC - s.offsetHeight / 2;
      } else {
        s.style.width = W - 40 + "px";
        s.style.left = "20px";
        s.style.textAlign = "";
        s.dataset.y = cyC + RC + 18;
      }
    });

    const sC = RC / (DIAL + 8);
    G = {
      W,
      H,
      top,
      mobile,
      hx,
      hy0,
      iy,
      cxC,
      cyC,
      sC,
      cxF,
      cyF,
      sF: RF / (DIAL + 8),
      cx: cxC,
      cy: cyC,
      s: sC,
    };

    for (const p of planets) {
      const [fx, fy] = p.o.home[mobile ? 1 : 0];
      p.X0 = fx * W;
      p.Y0 = top + fy * (H - top);
      const [gx, gy] = p.o.field[mobile ? 1 : 0];
      const FX = gx * W,
        FY = top + gy * (H - top);
      p.a0 = angleOf(FX - cxC, FY - cyC);
      p.r0 = Math.hypot(FX - cxC, FY - cyC) / sC;
    }
    assign(planets, 72, 40);
    for (const st of stars) {
      const X = st.fx * W;
      let Y = top + st.fy * (H - top);
      if (X > hx - 16 && X < hx + hw + 16 && Y > hy0 - 16 && Y < hy0 + hh + 16)
        Y = st.fy < 0.5 ? hy0 - 24 - st.fx * 50 : hy0 + hh + 24 + st.fx * 50;
      st.X0 = X;
      st.Y0 = Y;
      st.a0 = angleOf(X - cxC, Y - cyC);
      st.r0 = Math.hypot(X - cxC, Y - cyC) / sC;
    }
    assign(stars, 6, 20);
    for (const sp of specks) {
      sp.X = sp.fx * W;
      sp.Y = top + sp.fy * (H - top);
      sp.node.setAttribute("r", sp.r);
    }
    moonPath.X0 = W * 0.86;
    moonPath.Y0 = top + (mobile ? 40 : 90);
    moonPath.a0 = angleOf(moonPath.X0 - cxC, moonPath.Y0 - cyC);
    moonPath.r0 = Math.hypot(moonPath.X0 - cxC, moonPath.Y0 - cyC) / sC;
    moonPath.travel = mod(62 - moonPath.a0, 360);
    if (moonPath.travel < 40) moonPath.travel += 360;

    // The telescope lens used in step 1
    lensOrder = [...planets].sort(
      (a, b) => angleOf(a.X0 - W / 2, a.Y0 - H / 2) - angleOf(b.X0 - W / 2, b.Y0 - H / 2),
    );
    const LR = mobile ? 46 : 68;
    lensG.textContent = "";
    el("circle", { r: LR, class: "lens-ring" }, lensG);
    el("circle", { r: LR - 7, class: "lens-ring thin" }, lensG);
    lensTicks = el("g", {}, lensG);
    for (let i = 0; i < 48; i++) {
      const a = i * 7.5,
        long = i % 6 === 0;
      const [x1, y1] = polar(LR - 7, a),
        [x2, y2] = polar(LR - 7 - (long ? 7 : 3.5), a);
      el("line", { x1, y1, x2, y2, class: "lens-tick" }, lensTicks);
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      el(
        "line",
        { x1: dx * LR * 0.3, y1: dy * LR * 0.3, x2: dx * (LR + 10), y2: dy * (LR + 10), class: "lens-cross" },
        lensG,
      );
    G.LR = LR;
    for (const b of [...stars, ...planets]) {
      b.sx = b.X0;
      b.sy = b.Y0;
    }

    // "Skip the story" lands inside the final hold, so there's room to scroll either side
    $("settled").style.top =
      Math.round((PL[PL.length - 1].r0 + END_HOLD * 0.4) * (story.offsetHeight - innerHeight)) + "px";
  }

  // A point on the way in: radius closes in while the angle winds clockwise by `travel`
  function along(body, rEnd, e, extra = 0) {
    const ang = body.a0 + body.travel * e + extra;
    const [x, y] = polar(lerp(body.r0, rEnd, e) * G.s, ang);
    return [G.cx + x, G.cy + y, ang];
  }

  function rawProgress() {
    const span = story.offsetHeight - innerHeight;
    return span > 0 ? -story.getBoundingClientRect().top / span : 1;
  }
  const target = () => (reduce ? 1 : remap(clamp(rawProgress())));

  let mouse = null,
    mx = 0,
    my = 0;
  on(stage, "pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = stage.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  on(stage, "pointerleave", () => {
    mouse = null;
  });

  let sp = target(),
    lastT = performance.now(),
    raf = 0;
  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    const t = now / 1000;
    if (story.getBoundingClientRect().bottom < 0) return;

    // Progress glides toward the real scroll position, so each scroll step eases in
    const goal = target();
    sp += (goal - sp) * (1 - Math.exp(-dt * 4.5));
    if (Math.abs(goal - sp) < 0.0005) sp = goal;
    const p = sp;

    const ptx = mouse ? mouse.x : G.W / 2,
      pty = mouse ? mouse.y : G.H / 2;
    mx += (ptx - mx) * (1 - Math.exp(-dt * 4));
    my += (pty - my) * (1 - Math.exp(-dt * 4));
    const parX = (mx - G.W / 2) / G.W,
      parY = (my - G.H / 2) / G.H;

    // The hero lifts away and hands the name to the top bar; the introduction arrives at the end
    const dk = win(p, T.dock[0], T.dock[1]);
    const st = win(p, T.settle[0], T.settle[1]);
    hero.style.transform = `translate(${G.hx.toFixed(1)}px, ${(G.hy0 - dk * 40).toFixed(1)}px)`;
    hero.style.opacity = (1 - dk).toFixed(3);
    wordmark.classList.toggle("named", p > 0.04);
    const io = win(p, T.settle[0] + 0.03, T.settle[1]);
    intro.style.opacity = io.toFixed(3);
    intro.style.transform = `translateY(${(G.iy + (1 - io) * 14).toFixed(1)}px)`;

    T.steps.forEach(([a, b], i) => {
      const fin = win(p, a, a + 0.05),
        fout = 1 - win(p, b - 0.03, b);
      const s = stepEls[i];
      s.style.opacity = Math.min(fin, fout).toFixed(3);
      s.style.transform = `translateY(${(+s.dataset.y + (1 - fin) * 46 - (1 - fout) * 46).toFixed(1)}px)`;
    });

    // The system is built in the centre, then slides to its finished place
    G.cx = lerp(G.cxC, G.cxF, st);
    G.cy = lerp(G.cyC, G.cyF, st);
    G.s = lerp(G.sC, G.sF, st);
    system.setAttribute(
      "transform",
      `translate(${G.cx.toFixed(1)} ${G.cy.toFixed(1)}) scale(${G.s.toFixed(4)})`,
    );

    for (const s of specks) {
      const tw = 0.7 + 0.3 * Math.sin(t * s.tw.f + s.tw.ph);
      s.node.setAttribute("cx", (s.X - parX * 30 * s.depth * (1 - p)).toFixed(1));
      s.node.setAttribute("cy", (s.Y - parY * 30 * s.depth * (1 - p)).toFixed(1));
      s.node.style.opacity = (s.o * tw * lerp(1, 0.3, p)).toFixed(3);
    }

    // The sun rises glowing, then settles to a flat disc
    const se = win(p, T.sun[0], T.sun[1]);
    sun.setAttribute("transform", `scale(${lerp(0.15, 1, se).toFixed(3)})`);
    sun.style.opacity = se;
    const fl = win(p, T.flatten[0], T.flatten[1]);
    sunArt.style.opacity = 1 - fl;
    sunFlat.style.opacity = fl;
    sunMark.style.fill = fl > 0.5 ? "var(--ground)" : "";
    guidesG.style.opacity = (0.5 * fl).toFixed(3);

    const calm = 1 - 0.65 * win(p, T.calm[0], T.calm[1]);
    for (const s of stars) {
      const e = smooth(clamp((p - s.start) / s.dur)),
        free = 1 - e;
      let [x, y] = along(s, DIAL, e);
      x += (Math.sin(t * s.wob.f + s.wob.ph) * s.wob.amp * calm - parX * 50 * s.depth) * free;
      y += (Math.cos(t * s.wob.f * 1.2 + s.wob.ph) * s.wob.amp * calm - parY * 50 * s.depth) * free;
      s.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const tw = 0.55 + 0.45 * Math.sin(t * s.tw.f + s.tw.ph);
      const endR = Math.max(1, (s.big ? 1.8 : 1.15) * Math.min(1.2, G.s));
      if (s.big) {
        const sz = lerp(s.base, Math.max(3.5, 4.5 * G.s), e);
        s.spark.setAttribute("transform", `scale(${lerp(sz, endR * 2, fl).toFixed(2)})`);
        s.spark.style.opacity = 1 - fl;
      } else {
        s.dot.setAttribute("r", lerp(s.base, endR, e).toFixed(2));
        s.dot.style.opacity = 1 - fl;
      }
      // Simplify: every star becomes a tick on the dial
      if (fl > 0) {
        const long = s.slot % 5 === 0,
          L = (long ? 14 : 6) * Math.min(1.2, Math.max(0.7, G.s));
        const [x1, y1] = polar(-L / 2, s.fa),
          [x2, y2] = polar(L / 2, s.fa);
        s.tick.setAttribute("x1", x1.toFixed(1));
        s.tick.setAttribute("y1", y1.toFixed(1));
        s.tick.setAttribute("x2", x2.toFixed(1));
        s.tick.setAttribute("y2", y2.toFixed(1));
        s.tick.style.strokeWidth = long ? 1.6 : 1;
      }
      s.tick.style.opacity = fl;
      s.g.style.opacity = lerp(lerp(tw * 0.85, s.big ? 0.8 : 0.55, e), 0.8, fl).toFixed(3);
    }

    // The telescope, in step 1 only. With a mouse it is the cursor, magnifying whatever planet it
    // passes over; without one it works round the planets by itself.
    const s1w = T.steps[0];
    const lensV = win(p, s1w[0] + 0.01, s1w[0] + 0.05) * (1 - win(p, s1w[1] - 0.05, s1w[1] - 0.01));
    const cursorMode = finePointer && !!mouse && lensV > 0;
    let lensFocus = null,
      lensZoom = 0,
      lx = 0,
      ly = 0;
    if (cursorMode) {
      lx = mouse.x;
      ly = mouse.y;
      lensT = 0;
      let bd = G.LR * 0.95;
      for (const pl of planets) {
        const d = Math.hypot(pl.sx - lx, pl.sy - ly);
        if (d < bd) {
          bd = d;
          lensFocus = pl;
        }
      }
      lensZoom = 1;
    } else if (lensV > 0) {
      lensT += dt;
      const n = lensOrder.length,
        cyc = 2.8,
        i = Math.floor(lensT / cyc) % n,
        f = lensT % cyc;
      const b = lensOrder[i],
        a = lensT < cyc ? b : lensOrder[(i + n - 1) % n];
      const m = smooth(clamp(f / 1.1));
      lx = lerp(a.sx, b.sx, m);
      ly = lerp(a.sy, b.sy, m);
      lensZoom = smooth(clamp((f - 0.9) / 0.5)) * (1 - smooth(clamp((f - 2.4) / 0.4)));
      lensFocus = b;
    } else lensT = 0;
    lensG.style.opacity = lensV.toFixed(3);
    if (lensV > 0) {
      lensG.setAttribute(
        "transform",
        `translate(${lx.toFixed(1)} ${ly.toFixed(1)}) scale(${lerp(0.7, 1, lensV).toFixed(3)})`,
      );
      lensTicks.setAttribute("transform", `rotate(${((t * 12) % 360).toFixed(1)})`);
    }
    stage.classList.toggle("lens-cursor", cursorMode && lensV > 0.5);

    // Readout beside the lens, or beside the cursor when hovering the finished orrery
    const hovered = p >= T.labels[0] && mouse ? planets.find((pl) => pl.hotT === 1) : null;
    const autoRo = !cursorMode && lensV > 0.5 && lensZoom > 0.6 ? lensFocus : null;
    const roPl = cursorMode && lensV > 0.5 ? lensFocus : autoRo || hovered;
    showReadout(roPl);
    if (roPl) {
      const byLens = cursorMode || !!autoRo;
      const ax = byLens ? lx : mouse.x,
        ay = byLens ? ly : mouse.y;
      const gap = byLens ? G.LR + 14 : 22,
        rw = readout.offsetWidth,
        rh = readout.offsetHeight;
      let rx = ax + gap;
      if (rx + rw > G.W - 12) rx = ax - gap - rw;
      rx = clamp(rx, 8, G.W - rw - 8);
      const yMax = (G.mobile ? +stepEls[0].dataset.y - 12 : G.H - 8) - rh;
      const ry = clamp(ay - rh / 2, G.top + 8, Math.max(G.top + 8, yMax));
      readout.style.transform = `translate(${rx.toFixed(0)}px, ${ry.toFixed(0)}px)`;
    }

    const lab = win(p, T.labels[0], T.labels[1]);
    const ready = p >= T.labels[0];
    const pull = win(p, T.sun[0], T.sun[1]);
    const spread = win(p, T.dock[0], T.steps[0][0] + 0.06);
    for (const pl of planets) {
      const lt = clamp((p - pl.start) / pl.dur);
      const e = smooth(lt),
        free = 1 - e;
      if (lt >= 1 && !reduce) pl.rev = mod(pl.rev + (dt * 360) / pl.o.period, 360);
      // Once the sun appears, everything starts slowly circling it, inner planets faster
      if (!reduce)
        pl.orb = pull > 0.01 ? pl.orb + dt * pull * (7 - pl.o.r / 60) : pl.orb * Math.exp(-dt * 1.5);
      let [x, y, ang] = along(pl, pl.o.r, e, (lt >= 1 ? pl.rev : 0) + pl.orb * (1 - e));
      // As the story starts, planets leave the hero's frame and spread through the field
      x = lerp(pl.X0, x, spread);
      y = lerp(pl.Y0, y, spread);

      // A planet under the lens grows as if magnified and holds still; the rest keep drifting
      pl.zoom += ((pl === lensFocus ? lensZoom : 0) - pl.zoom) * (1 - Math.exp(-dt * 9));
      const hold = calm * (1 - 0.8 * pl.zoom);
      x += Math.sin(t * pl.wob.f + pl.wob.ph) * pl.wob.amp * hold * free;
      y += Math.cos(t * pl.wob.f * 1.3 + pl.wob.ph) * pl.wob.amp * hold * 0.8 * free;
      // Outside the telescope, the cursor gently nudges nearby planets aside
      let gx = 0,
        gy = 0;
      if (mouse && !cursorMode && free > 0.02) {
        const dx = x - mouse.x,
          dy = y - mouse.y,
          d = Math.hypot(dx, dy) || 1;
        if (d < 220) {
          const f = smooth(1 - d / 220) * 34;
          gx = (dx / d) * f;
          gy = (dy / d) * f;
        }
      }
      const nudge = 1 - Math.exp(-dt * 1.4);
      pl.push.x += (gx - pl.push.x) * nudge;
      pl.push.y += (gy - pl.push.y) * nudge;
      x += pl.push.x * free;
      y += pl.push.y * free;
      pl.sx = x;
      pl.sy = y;

      pl.hot += (pl.hotT - pl.hot) * (1 - Math.exp(-dt * 12));
      const big = ((G.mobile ? 1.35 : 1.9) * pl.o.size) / 10;
      const inOrbit = (pl.o.size * Math.max(0.75, G.s)) / 10;
      const dotK = ((pl.o.dot * Math.max(0.7, G.s)) / 10) * (1 + 0.3 * pl.hot);
      const k = lerp(lerp(big, inOrbit, e), dotK, fl) * (1 + 0.75 * pl.zoom);
      pl.link.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(3)})`);
      pl.detail.style.opacity = 1 - fl;
      pl.flat.style.opacity = fl;

      // The orbit is traced behind the planet as it arrives
      const draw = smooth(clamp((lt - 0.15) / 0.85));
      const L = pl.circ * draw;
      pl.ring.setAttribute("transform", `rotate(${(ang - 90).toFixed(2)})`);
      if (pl.o.dashed && draw >= 1) {
        pl.ring.style.strokeDasharray = "";
        pl.ring.style.strokeDashoffset = "";
      } else {
        pl.ring.style.strokeDasharray = `${L} ${pl.circ}`;
        pl.ring.style.strokeDashoffset = `${L - pl.circ}`;
      }
      pl.ring.style.opacity = draw > 0 ? 1 : 0;
      pl.ring.style.strokeWidth = ((1 + 0.8 * pl.hot) / G.s).toFixed(2);

      pl.rlabel.style.opacity = (G.s < 0.42 ? 0 : lab).toFixed(3);
      if (lab > 0) {
        pl.rlabel.style.fontSize = ((G.mobile ? 10 : 11) / G.s).toFixed(2) + "px";
        pl.rlabel.setAttribute("dy", (-5 / G.s).toFixed(2));
      }

      for (const n of [pl.a, pl.link]) n.style.pointerEvents = ready ? "auto" : "none";
      pl.a.setAttribute("tabindex", ready ? "0" : "-1");
    }

    nextBtn.classList.toggle("show", G.mobile && !reduce && p < 0.97);

    // At the end, the skip link turns round and offers the way back
    const atEnd = rawProgress() >= PL[PL.length - 1].r0 - 0.01;
    if (skipLink.dataset.back !== String(atEnd)) {
      skipLink.dataset.back = String(atEnd);
      skipLink.textContent = atEnd
        ? G.mobile
          ? "Back to start"
          : "Back to the beginning"
        : "Skip the story";
      skipLink.setAttribute("href", atEnd ? "#top" : "#settled");
    }

    // The little moon settles last, close to the sun: grey and cratered, then a solid disc
    const tlt = clamp((p - T.moon[0]) / (T.moon[1] - T.moon[0])),
      te = smooth(tlt);
    if (tlt >= 1 && !reduce) moonPath.rev = mod(moonPath.rev + (dt * 360) / 24, 360);
    const [tx, ty] = along(moonPath, 76, te, tlt >= 1 ? moonPath.rev : 0);
    const mX = tx + Math.sin(t * 0.6) * 10 * (1 - te),
      mY = ty + Math.cos(t * 0.5) * 8 * (1 - te);
    const mr = lerp(G.mobile ? 7 : 9, Math.max(4, 5.5 * G.s), te);
    moonEl.setAttribute(
      "transform",
      `translate(${mX.toFixed(1)} ${mY.toFixed(1)}) scale(${(mr / 10).toFixed(3)})`,
    );
    moonDetail.style.opacity = 1 - fl;
    moonFlat.style.opacity = fl;
  }

  // Touch screens: when a swipe ends between two steps, glide on to the next step in that direction.
  // Mouse wheels and trackpads scroll freely.
  let auto = false,
    touching = false,
    viaTouch = false,
    idle = 0,
    settledRaw = rawProgress();
  function goTo(raw) {
    const top = story.getBoundingClientRect().top + scrollY + raw * (story.offsetHeight - innerHeight);
    if (Math.abs(top - scrollY) < 2) return;
    auto = true;
    scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
  function settle() {
    if (touching) return;
    const raw = rawProgress();
    if (auto) {
      auto = false;
      settledRaw = raw;
      return;
    }
    const atLock = PL.some((s, i) => i > 0 && raw >= s.r0 - 0.002 && raw <= s.r1 + 0.002);
    if (reduce || raw <= 0.001 || raw >= 0.999 || atLock) {
      settledRaw = raw;
      return;
    }
    const to = raw >= settledRaw ? lockRaw.find((r) => r > raw) : [...lockRaw].reverse().find((r) => r < raw);
    if (to === undefined) {
      settledRaw = raw;
      return;
    }
    goTo(to);
  }
  const queue = () => {
    if (!viaTouch) return;
    clearTimeout(idle);
    idle = setTimeout(settle, 140);
  };
  on(window, "scroll", queue, { passive: true });
  on(
    window,
    "wheel",
    () => {
      viaTouch = false;
      clearTimeout(idle);
    },
    { passive: true },
  );
  on(window, "keydown", () => {
    viaTouch = false;
    clearTimeout(idle);
  });
  on(
    window,
    "touchstart",
    () => {
      touching = true;
      if (!viaTouch) settledRaw = rawProgress();
      viaTouch = true;
    },
    { passive: true },
  );
  on(
    window,
    "touchend",
    () => {
      touching = false;
      queue();
    },
    { passive: true },
  );
  on(nextBtn, "click", () => {
    const raw = rawProgress(),
      to = lockRaw.find((r) => r > raw + 0.005);
    if (to !== undefined) goTo(to);
  });

  // Skip / back: a slower, eased glide so the story visibly fast-forwards or rewinds
  let glideId = 0;
  function glideTo(y, ms) {
    const id = ++glideId,
      y0 = scrollY,
      t0 = performance.now();
    const step = (now) => {
      if (id !== glideId || !alive) return;
      const k = ms ? Math.min(1, (now - t0) / ms) : 1;
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      scrollTo({ top: y0 + (y - y0) * e, behavior: "instant" });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  for (const ev of ["wheel", "touchstart", "keydown"])
    on(
      window,
      ev,
      () => {
        glideId++;
      },
      { passive: true },
    );
  on(skipLink, "click", (e) => {
    e.preventDefault();
    const back = skipLink.dataset.back === "true";
    const to = back
      ? story.getBoundingClientRect().top + scrollY
      : $("settled").getBoundingClientRect().top + scrollY;
    glideTo(to, reduce ? 0 : 2400);
  });

  layout();
  raf = requestAnimationFrame(frame);
  on(window, "resize", layout);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      if (alive) layout();
    });

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(idle);
    glideId++;
    for (const f of off) f();
    for (const g of [ringsG, starsG, planetsG, specksG, lensG]) g.textContent = "";
    for (const n of defs.querySelectorAll(".dyn")) n.remove();
    stage.classList.remove("lens-cursor");
  };
}
