import Orrery from "@/components/Orrery";
import ThemeToggle from "@/components/ThemeToggle";

const EMAIL = "hello@tomjallen.me";

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

const thinking = [
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

const building = [
  {
    title: "Surf Signals",
    href: "https://github.com/TomJAllen/Surf-Signals",
    text: "A web app for learning surf lifesaving signals, including practice with your camera.",
  },
  {
    title: "Home lab",
    text: "Proxmox, Docker and local AI models running on my own hardware.",
  },
  {
    title: "Games",
    href: "https://github.com/TomJAllen?tab=repositories",
    text: "Small Unity projects, and hunting for hidden gems in the lowest-rated corners of Steam.",
  },
];

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
              I&rsquo;m Tom J Allen (Thomas James Allen), a Sydney-based AI platform and product
              leader specialising in ontology, knowledge graphs and semantic data models. I turn
              domain complexity into coherent, buildable models, then help teams build on them.
            </p>
          </div>
          <div className="hero-figure">
            <Orrery />
          </div>
        </section>

        <section id="work" className="band" aria-labelledby="work-h">
          <h2 id="work-h">Work</h2>
          <div className="band-body">
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

        <section className="band" aria-labelledby="think-h">
          <h2 id="think-h">What I think about</h2>
          <dl className="band-body pairs">
            {thinking.map((t) => (
              <div key={t.title}>
                <dt>{t.title}</dt>
                <dd>{t.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="building" className="band" aria-labelledby="build-h">
          <h2 id="build-h">Building</h2>
          <ul className="band-body builds">
            {building.map((b) => (
              <li key={b.title}>
                <h3>{b.href ? <a href={b.href}>{b.title}</a> : b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="band" aria-labelledby="off-h">
          <h2 id="off-h">Off the clock</h2>
          <p className="band-body lead">
            Rowing, triathlons and adventure racing. The bigger the challenge, the better.
          </p>
        </section>

        <section id="contact" className="band contact" aria-labelledby="contact-h">
          <h2 id="contact-h">Contact</h2>
          <div className="band-body">
            <a className="email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
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
