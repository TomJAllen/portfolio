"use client";

import { useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { startStory } from "./engine";

const EMAIL = "hello@tomjallen.me";

const STEPS = [
  [
    "Get inside the chaos.",
    "I learn a business from the inside, fast and deep, until I understand it like the people who run it.",
  ],
  [
    "Find the centre of gravity.",
    "Then I form a view of what everything really revolves around, and put it out there to be tested.",
  ],
  [
    "Decide how to measure it.",
    "Agree what good looks like before building anything, so the results speak for themselves.",
  ],
  ["Bring each part into orbit.", "One small experiment at a time. Keep what holds, drop what doesn’t."],
  [
    "Then simplify.",
    "Strip out whatever doesn’t earn its place. What’s left becomes the standard everyone builds on.",
  ],
];

const guide = { vectorEffect: "non-scaling-stroke" as const };

/**
 * The homepage opening: a hero over drifting planets that scrolls through five steps of how Tom
 * works, building the TJA orrery as it goes. The text is rendered here, so it is there without
 * JavaScript; the animation is drawn into the SVG by ./engine.js.
 */
export default function OrreryStory() {
  useEffect(() => startStory(), []);

  return (
    <>
      <header className="strip">
        <a className="wordmark" id="wordmark" href="#top" aria-label="Tom J Allen, back to top">
          <span className="wm-a">
            TJA
            <i aria-hidden="true" />
          </span>
          <span className="wm-b" aria-hidden="true">
            Tom J Allen
          </span>
        </a>
        <div className="strip-right">
          <a className="skip" id="skip" href="#settled">
            Skip the story
          </a>
          <ThemeToggle />
          <a className="ask" href={`mailto:${EMAIL}`}>
            Email me
          </a>
        </div>
      </header>

      <button type="button" className="next" id="next" aria-label="Next step">
        Next <span aria-hidden="true">&darr;</span>
      </button>

      <div className="story" id="top">
        <span id="settled" />
        <div className="stage" id="stage">
          <svg
            className="sky"
            id="sky"
            role="group"
            aria-label="The TJA orrery: five orbits, each linking to a section"
          >
            <defs id="defs">
              <radialGradient id="sunfill" cx=".38" cy=".34" r=".75">
                <stop offset="0" style={{ stopColor: "var(--sun1)" }} />
                <stop offset="1" style={{ stopColor: "var(--sun2)" }} />
              </radialGradient>
              <radialGradient id="corona" r=".5">
                <stop offset=".45" style={{ stopColor: "var(--sun2)", stopOpacity: 0.38 }} />
                <stop offset=".7" style={{ stopColor: "var(--sun1)", stopOpacity: 0.12 }} />
                <stop offset="1" style={{ stopColor: "var(--sun1)", stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="moon-shade" cx=".35" cy=".3" r=".8">
                <stop offset="0" stopColor="#F4F2EE" />
                <stop offset=".6" stopColor="#C9C6C0" />
                <stop offset="1" stopColor="#77746F" />
              </radialGradient>
              <clipPath id="disc">
                <circle r="10" />
              </clipPath>
            </defs>
            <g id="specks" aria-hidden="true" />
            <g id="system">
              <g id="guides" style={{ opacity: 0, stroke: "var(--text)" }} aria-hidden="true">
                <line x1="-336" y1="0" x2="336" y2="0" style={guide} strokeWidth=".7" strokeDasharray="2 5" />
                <line x1="0" y1="-336" x2="0" y2="336" style={guide} strokeWidth=".7" strokeDasharray="2 5" />
                <line
                  x1="-238"
                  y1="-238"
                  x2="238"
                  y2="238"
                  style={guide}
                  strokeWidth=".6"
                  strokeDasharray="1 6"
                />
                <line
                  x1="-238"
                  y1="238"
                  x2="238"
                  y2="-238"
                  style={guide}
                  strokeWidth=".6"
                  strokeDasharray="1 6"
                />
              </g>
              <g id="rings" />
              <g id="sun" aria-hidden="true">
                <g id="sun-art">
                  <circle r="96" fill="url(#corona)" />
                  <circle r="54" fill="url(#sunfill)" />
                </g>
                <circle id="sun-flat" r="54" style={{ fill: "var(--text)" }} opacity="0" />
                <text className="sun-mark" id="sun-mark" textAnchor="middle" dominantBaseline="central" y="1">
                  TJA
                </text>
              </g>
            </g>
            <g id="stars" aria-hidden="true" />
            <g id="moon" role="button" tabIndex={0} aria-label="Switch between light and dark">
              <circle className="moon-hit" r="24" fill="transparent" />
              <g id="moon-detail">
                <circle r="10" fill="url(#moon-shade)" />
                <circle cx="-3" cy="-2.5" r="2.4" fill="#000" opacity=".14" />
                <circle cx="3.6" cy="2" r="1.6" fill="#000" opacity=".14" />
                <circle cx="-.5" cy="4.6" r="1.1" fill="#000" opacity=".14" />
                <circle cx="4" cy="-4.6" r=".9" fill="#000" opacity=".14" />
              </g>
              <g id="moon-flat" opacity="0">
                <circle r="10" style={{ fill: "var(--text)" }} />
              </g>
            </g>
            <g id="planets" />
            <g id="lens" style={{ opacity: 0 }} aria-hidden="true" />
          </svg>

          <div className="story-hero" id="story-hero">
            <h1>
              <span className="h-name">Tom J Allen.</span>{" "}
              <span className="h-tag">Order from chaos, done beautifully.</span>
            </h1>
            <p className="sub">I turn messy businesses into clear models that AI products can be built on.</p>
            <p className="cue">
              Scroll to see how<span aria-hidden="true">&darr;</span>
            </p>
          </div>

          {STEPS.map(([line, sub], i) => (
            <div className="step" key={line}>
              <span className="num">0{i + 1}</span>
              <p className="line">{line}</p>
              <small>{sub}</small>
            </div>
          ))}

          <div className="readout" id="readout" aria-hidden="true" />

          <div className="story-intro" id="story-intro">
            <p className="fname">Tom J Allen</p>
            <p className="ftag">Order from chaos, done beautifully.</p>
            <p className="lede">
              I turn messy businesses into clear models that AI products can be built on.
            </p>
            <p>
              Ontology &amp; Standards Manager at Decidr. Before that I co-led discovery and build of the four
              products its platform was founded on.
            </p>
            <p className="where">Sydney, Australia</p>
            <p className="go">
              <a href="#work">Pick an orbit, or see the work &darr;</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
