import type { ReactNode } from "react";
import Orrery from "@/components/Orrery";
import ThemeToggle from "@/components/ThemeToggle";
import { ChatRecapIcon, GamesIcon, HomeLabIcon, SurfFlagIcon } from "@/components/BuildIcons";

const EMAIL = "hello@tomjallen.me";

const drives = [
  {
    title: "AI platforms",
    text: "Semantic layers, knowledge graphs, ontologies and the agent platforms that run on them.",
  },
  {
    title: "Frameworks",
    text: "Finding the structure that gives a messy problem rules and purpose.",
  },
  { title: "Craft", text: "Things done properly, at every level of zoom." },
  {
    title: "Teaching",
    text: "Bringing people up to speed on the hard stuff is half the fun.",
  },
];

const before = [
  {
    org: "KOKO",
    place: "London",
    role: "Head of Digital",
    text: "Digital strategy and product ownership across a complex, multi-venue business: ticketing, a members' club app and a spread of satellite services.",
  },
  {
    org: "9ine Consulting",
    role: "Product Manager",
    text: "Built a cyber security and data protection governance platform.",
  },
  {
    org: "Subscribed",
    role: "Co-founder",
    text: "Co-founded a subscription-management startup and led the build of its first version.",
  },
];

type Build = {
  id?: string;
  title: string;
  text: string;
  status: string;
  repo?: string; // GitHub repository
  site?: string; // live website
  icon: ReactNode;
};

const building: Build[] = [
  {
    title: "Surf Signals",
    text: "Learn the surf lifesaving signals, including practising them on camera.",
    status: "Live",
    repo: "https://github.com/TomJAllen/Surf-Signals",
    site: "https://surf-signals.vercel.app",
    icon: <SurfFlagIcon />,
  },
  {
    title: "Group chat recaps",
    text: "A year-in-review for your group chat: stats, awards and the moments worth remembering.",
    status: "In progress",
    icon: <ChatRecapIcon />,
  },
  {
    title: "Home lab",
    text: "Proxmox, Docker and local AI models running on my own hardware.",
    status: "Always tinkering",
    icon: <HomeLabIcon />,
  },
  {
    id: "games",
    title: "Games",
    text: "Small Unity projects, and hunting for hidden gems in the lowest-rated corners of Steam.",
    status: "For fun",
    repo: "https://github.com/TomJAllen?tab=repositories",
    icon: <GamesIcon />,
  },
];

function BuildCard({ b }: { b: Build }) {
  return (
    <li id={b.id} className="build-card">
      {b.icon}
      <h3>{b.title}</h3>
      <p>{b.text}</p>
      <div className="build-foot">
        <span className="build-status">{b.status}</span>
        {(b.site || b.repo) && (
          <span className="pills">
            {b.site && (
              <a className="pill pill-solid" href={b.site} aria-label={`Visit the ${b.title} website`}>
                Visit site
              </a>
            )}
            {b.repo && (
              <a className="pill" href={b.repo} aria-label={`${b.title} on GitHub`}>
                GitHub
              </a>
            )}
          </span>
        )}
      </div>
    </li>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="Tom J Allen, back to top">
          TJA<span className="wordmark-dot" aria-hidden="true" />
        </a>
        <div className="header-right">
          <nav aria-label="Sections">
            <a href="#work">Work</a>
            <a href="#building">Building</a>
            <a href="#contact">Contact</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-text">
            <h1>Tom J Allen</h1>
            <p className="tagline">Order from chaos, done beautifully.</p>
            <p className="intro">
              I&rsquo;m Tom, a Sydney-based AI platform and product leader working across
              ontology, knowledge graphs and semantic data models. I turn domain complexity into
              coherent, buildable models, then help teams build on them.
            </p>
          </div>
          <div className="hero-figure">
            <Orrery />
          </div>
        </section>

        <section id="drives" className="band" aria-labelledby="drives-h">
          <h2 id="drives-h">What drives me</h2>
          <dl className="band-body pairs">
            {drives.map((t) => (
              <div key={t.title}>
                <dt>{t.title}</dt>
                <dd>{t.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="band" aria-labelledby="work-h">
          <h2 id="work-h">Work</h2>
          <div className="band-body">
            <p className="lead section-intro">
              I&rsquo;m happiest in the messy middle, where how a business really works meets the
              systems meant to run it. Finding the model underneath is the hard yards, and I do my
              best work when the problem is hard and the clock is running. Same as a long race: it
              gets interesting when it gets difficult.
            </p>

            <article className="role role-now">
              <h3>
                Decidr <span className="role-meta">Sydney</span>
              </h3>
              <p className="role-title">Ontology &amp; Standards Manager</p>
              <p>
                I own the platform model: how the ontology actually operates inside an AI
                platform, and the standards that keep everything built on it consistent.
              </p>
              <p>
                Before that, as Product Manager, I led discovery and build of Decidr&rsquo;s first
                four products with global development teams. They laid the foundations for the
                platform&rsquo;s end state, and its partnership products were delivered on top of
                them.
              </p>
            </article>

            <h3 className="sub">Earlier</h3>
            <ul className="roles">
              {before.map((r) => (
                <li key={r.org} className="role">
                  <h4>
                    {r.org}
                    {r.place && <span className="role-meta">{r.place}</span>}
                  </h4>
                  <p className="role-title">{r.role}</p>
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="building" className="band" aria-labelledby="build-h">
          <h2 id="build-h">Building</h2>
          <ul className="band-body build-grid">
            {building.map((b) => (
              <BuildCard key={b.title} b={b} />
            ))}
          </ul>
        </section>

        <section id="off" className="band" aria-labelledby="off-h">
          <h2 id="off-h">Off the clock</h2>
          <p className="band-body lead">
            Rowing, triathlons and adventure racing. The bigger the challenge, the better.
          </p>
        </section>

        <section id="contact" className="band contact" aria-labelledby="contact-h">
          <h2 id="contact-h">Contact</h2>
          <div className="band-body">
            <p className="lead">
              Email is the best way to reach me: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <ul className="links">
              <li>
                <a href="https://linkedin.com/in/tom-j-allen">LinkedIn</a>
              </li>
              <li>
                <a href="https://github.com/TomJAllen">GitHub</a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Tom J Allen</p>
        <p>Sydney, Australia</p>
      </footer>
    </>
  );
}
