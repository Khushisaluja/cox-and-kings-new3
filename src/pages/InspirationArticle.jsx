/* ============================================================
   InspirationArticle (/inspiration/:slug) — a single dispatch.

   The reading page behind every card on /inspiration. Same chrome, same
   theme, same tokens — imported from Inspiration.jsx rather than copied,
   so the header and footer here cannot drift from the index's.

   The layout is a printed feature: a dark title plate, a standfirst, a
   single measure of Cormorant-set body copy at reading size, pull-quotes
   that break the measure, and — at the end, once and only once — the one
   commercial ask the piece has earned.

   MOTION
     · A reading-progress hairline under the navbar, scrubbed against the
       article body (not the page: the footer is not part of the read).
     · The title plate de-zooms as you scroll off it.
     · Paragraphs rise as they enter.
   ============================================================ */
import { useRef, useLayoutEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SmartLink as Link } from '../components/ScheduleCall';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { img } from '../data/v3content';
import { POSTS, WRITER_BY_ID, bySlug } from '../data/dispatches';
import { SiteNav, SiteFooter } from '../components/SiteChrome';
import { Meta } from './Inspiration';
import './Home2026.css';
import './Home2026Improved.css';
import './NewTypography.css';
import './New3.css';
import './Inspiration.css';

gsap.registerPlugin(ScrollTrigger);

const U = (id) => `https://images.unsplash.com/photo-${id}`;

export default function InspirationArticle() {
  const { slug } = useParams();
  const post = bySlug(slug);

  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const progRef = useRef(null);

  /* Hooks must run before any early return, so the redirect is decided after
     them — a missing slug is a typed URL, not a rendering state. */
  useLayoutEffect(() => {
    if (!post) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* Reading progress — measured against the BODY, so it reaches 100%
           when the piece ends rather than when the footer does. */
        if (bodyRef.current && progRef.current) {
          ScrollTrigger.create({
            trigger: bodyRef.current,
            start: 'top 70%',
            end: 'bottom bottom',
            onUpdate: (st) => {
              progRef.current.style.transform = `scaleX(${st.progress})`;
            },
          });
        }

        gsap.to('.inspa-plate img', {
          yPercent: 12,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.inspa-plate',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.from('.inspa-title', {
          opacity: 0,
          y: 34,
          duration: 1.1,
          ease: 'power3.out',
        });

        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 26,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [post, slug]);

  /* A slug nobody wrote goes back to the index rather than to a 404 — every
     link that reaches here comes from the index, so a miss is a typo. */
  if (!post) return <Navigate to="/inspiration" replace />;

  const writer = WRITER_BY_ID[post.by];
  const idx = POSTS.findIndex((p) => p.slug === post.slug);
  const next = POSTS[(idx + 1) % POSTS.length];

  /* Everything else on the same desk — the "keep reading" shelf. */
  const related = POSTS.filter((p) => p.cat === post.cat && p.slug !== post.slug).slice(0, 3);

  return (
    <div className="insp inspa h26 new-typo n3" ref={rootRef}>
      <a className="h26-skip" href="#article">Skip to the piece</a>

      <SiteNav />

      {/* Reading progress. Sits directly under the navbar and only fills while
          the body of the piece is on screen. */}
      <div className="inspa-prog" aria-hidden="true">
        <i ref={progRef} />
      </div>

      {/* ---------- THE TITLE PLATE ---------- */}
      <header className="inspa-plate">
        <img src={img(U(post.photo), 2000)} alt={post.credit} />
        <div className="inspa-plate-veil" aria-hidden="true" />

        <div className="inspa-plate-inner">
          <Link to="/inspiration" className="inspa-back">
            <ArrowLeft size={15} /> <span>Dispatches</span>
          </Link>

          <p className="insp-label is-light">{post.cat} · Folio {post.n}</p>
          <h1 className="inspa-title">
            {post.em && post.title.includes(post.em) ? (
              <>
                {post.title.split(post.em)[0]}
                <em>{post.em}</em>
                {post.title.split(post.em)[1]}
              </>
            ) : post.title}
          </h1>
        </div>
        <p className="inspa-credit">{post.credit}</p>
      </header>

      {/* ---------- THE PIECE ---------- */}
      <article className="inspa-article" id="article">
        <div className="inspa-standfirst">
          <p className="inspa-deck">{post.deck}</p>
          <div className="inspa-byline">
            <img src={img(U(writer.photo), 200)} alt="" />
            <div>
              <strong>{writer.name}</strong>
              <span>{writer.desk}</span>
            </div>
          </div>
          <Meta post={post} className="inspa-meta" author={false} />
        </div>

        <hr data-rule className="inspa-rule" />

        <div className="inspa-body" ref={bodyRef}>
          {post.body.map((block, i) => (
            typeof block === 'string' ? (
              <p key={i} data-reveal>{block}</p>
            ) : (
              <blockquote key={i} data-reveal>{block.quote}</blockquote>
            )
          ))}
        </div>

        {/* The one commercial ask, at the end, where the piece has earned it. */}
        <aside className="inspa-cta" data-reveal>
          <div>
            <p className="insp-label">Now that you&apos;ve read it</p>
            <p className="inspa-cta-copy">
              {writer.name} is the specialist who wrote this, and the specialist who would build
              the trip. There is no form in between.
            </p>
          </div>
          <Link to={post.cta.to} className="h26-btn h26-btn-pill">
            {post.cta.label} <ArrowRight size={15} />
          </Link>
        </aside>
      </article>

      {/* ---------- KEEP READING ---------- */}
      {related.length > 0 && (
        <section className="inspa-more" aria-labelledby="more-title">
          <div className="inspa-more-inner">
            <div className="insp-head">
              <div className="insp-head-row">
                <div>
                  <p className="insp-label" data-reveal>Same desk</p>
                  <h2 className="insp-h2 inspa-more-h2" id="more-title" data-reveal>
                    More from <em>{post.cat}</em>
                  </h2>
                </div>
                <Link to="/inspiration" className="insp-textlink" data-reveal>
                  <span>The full index</span> <ArrowRight size={14} />
                </Link>
              </div>
              <hr data-rule />
            </div>

            <div className="insp-grid inspa-more-grid">
              {related.map((p) => (
                <Link className="insp-card" to={`/inspiration/${p.slug}`} key={p.slug} data-reveal>
                  <div className="insp-card-fig">
                    <img src={img(U(p.photo), 800)} alt="" loading="lazy" />
                  </div>
                  <div className="insp-card-body">
                    <div className="insp-card-kicker">
                      <span className="insp-card-cat">{p.cat}</span>
                      <span className="insp-folio">{p.n}</span>
                    </div>
                    <h3 className="insp-card-title">{p.title}</h3>
                    <p className="insp-card-deck">{p.deck}</p>
                    <Meta post={p} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- NEXT IN THE JOURNAL ---------- */}
      <Link className="inspa-next" to={`/inspiration/${next.slug}`}>
        <img src={img(U(next.photo), 1600)} alt="" aria-hidden="true" />
        <span className="inspa-next-veil" aria-hidden="true" />
        <span className="inspa-next-inner">
          <span className="insp-label is-light">Next in the journal · {next.cat}</span>
          <span className="inspa-next-title">{next.title}</span>
          <span className="insp-textlink inspa-next-link">
            <span>Read folio {next.n}</span> <ArrowRight size={15} />
          </span>
        </span>
      </Link>

      <SiteFooter />
    </div>
  );
}
