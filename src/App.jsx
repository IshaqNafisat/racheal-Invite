import { useEffect, useRef, useState } from "react";

/* ============ EDIT YOUR DETAILS HERE ============ */
const CONFIG = {
  tag: "RJ27",
  bride: "Racheal Alikeju Noah",
  groom: "Joseph Ojoajogwu Itodo",
  // WhatsApp numbers: country code, no "+" or spaces. REPLACE THESE.
  groomWhatsApp: "2347033216454",
  brideWhatsApp: "2347037474590",
  // Gift accounts. REPLACE THESE (delete the array items to hide the section).
  accounts: [
    { number: "8147932357", bank: "Opay", name: "Noah Alikeju Racheal" },
  ],
  // music: "/assets/music.mp3",
  // photo: "/assets/rj27.jpg",

  photo: import.meta.env.BASE_URL + "assets/rj27.jpg",
  music: import.meta.env.BASE_URL + "assets/music.mp3",
};

const EVENTS = [
  {
    key: "trad", title: "Traditional Wedding",
    start: "2027-04-23T14:00", end: "2027-04-23T18:00",
    date: "Friday, 23rd April 2027", time: "2:00 PM",
    venue: "Late Sani Noah Oguh (Rtd) compound, close to Aso C Jumat Mosque, Nyanya, Abuja",
  },
  {
    key: "church", title: "Church Wedding",
    start: "2027-04-24T10:00", end: "2027-04-24T14:00",
    date: "Saturday, 24th April 2027", time: "10:00 AM",
    venue: "United Evangelical Church, Nyanya, Abuja",
  },
];
const TARGET = new Date("2027-04-23T14:00:00+01:00").getTime();
const COLORS = [
  { name: "Wine", hex: "#6d0f26" }, { name: "Rose Gold", hex: "#c98b7e" },
  { name: "Navy Blue", hex: "#15204d" }, { name: "White", hex: "#ffffff" },
];
/* ================================================ */

const WA_MSG = `Hello! I received your wedding invitation and would like to ask a question about the wedding of ${CONFIG.tag} on 23rd April 2027.`;
const waLink = (n) => `https://wa.me/${n}?text=${encodeURIComponent(WA_MSG)}`;
const localPhone = (n) => "0" + n.slice(3);

function calc() {
  const d = Math.max(0, TARGET - Date.now());
  return { Days: Math.floor(d / 864e5), Hours: Math.floor(d / 36e5) % 24, Minutes: Math.floor(d / 6e4) % 60, Seconds: Math.floor(d / 1e3) % 60 };
}
function Countdown() {
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return (
    <div className="countdown" role="timer" aria-label="Countdown to the wedding">
      {Object.entries(t).map(([k, v]) => (
        <div key={k}><b>{String(v).padStart(2, "0")}</b><span>{k}</span></div>
      ))}
    </div>
  );
}

const Rose = ({ size = 110, cream = false, className = "" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`rose ${className}`} aria-hidden="true">
    <defs>
      <radialGradient id="rw" cx="40%" cy="35%"><stop offset="0" stopColor="#c8263f" /><stop offset="1" stopColor="#5a0919" /></radialGradient>
      <radialGradient id="rc" cx="40%" cy="35%"><stop offset="0" stopColor="#fff3e4" /><stop offset="1" stopColor="#e9c9a6" /></radialGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill={cream ? "url(#rc)" : "url(#rw)"} stroke="#d4af37" strokeWidth="1.6" />
    <path d="M50 50m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-14 0a12 12 0 1 1 24 0a18 18 0 1 1-36 0a25 25 0 1 1 50 0" fill="none" stroke={cream ? "#c79a63" : "#e6bf68"} strokeWidth="1.5" opacity=".85" />
  </svg>
);

const Pill = ({ children }) => (
  <div className="pill-row"><i /><h3 className="pill">{children}</h3><i /></div>
);

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${on ? "in" : ""} ${className}`}>{children}</div>;
}

function downloadICS() {
  const f = (s) => s.replace(/[-:]/g, "") + "00";
  const body = EVENTS.map((e) => ["BEGIN:VEVENT", `UID:${e.key}@${CONFIG.tag.toLowerCase()}`, "DTSTAMP:20261116T000000Z",
    `DTSTART;TZID=Africa/Lagos:${f(e.start)}`, `DTEND;TZID=Africa/Lagos:${f(e.end)}`,
    `SUMMARY:${e.title} - Racheal & Joseph`, `LOCATION:${e.venue}`, "END:VEVENT"].join("\r\n")).join("\r\n");
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//${CONFIG.tag}//EN\r\n${body}\r\nEND:VCALENDAR`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = `${CONFIG.tag}-wedding.ics`;
  a.click();
}

function CopyRow({ acc }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(acc.number); } catch {
      const t = document.createElement("textarea"); t.value = acc.number; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 2000);
  };
  return (
    <div className="acct">
      <button onClick={copy} className="copy">{done ? "Copied" : "Copy"}</button>
      <div><strong>{acc.number}</strong><span>{acc.bank} · {acc.name}</span></div>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rsvp, setRsvp] = useState(null);
  const [photoOk, setPhotoOk] = useState(true);
  const audio = useRef(null);

  useEffect(() => { document.body.style.overflow = open ? "" : "hidden"; }, [open]);

  const openInvite = () => {
    setOpen(true);
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
  };
  const toggleMusic = () => {
    const a = audio.current; if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {}); else { a.pause(); setPlaying(false); }
  };
  const directions = (v) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;

  return (
    <>
      <audio ref={audio} src={CONFIG.music} loop preload="none" />

      {/* Splash */}
      <div className={`splash marble ${open ? "gone" : ""}`} aria-hidden={open}>
        <Rose size={150} className="s-rose tl" /><Rose size={110} cream className="s-rose br" />
        <p className="small">Welcome to the celebration of</p>
        <h1 className="mono">R<span>&amp;</span>J</h1>
        <p className="small">{CONFIG.tag} · Nyanya, Abuja</p>
        <button className="btn gold" onClick={openInvite}>Open Invitation</button>
        <p className="tiny">With love, the families of Noah &amp; Itodo</p>
      </div>

      <div className="strip marble" aria-hidden="true" />

      <nav className="nav">
        <a href="#top" className="logo">R &amp; J</a>
        <div>
          <a href="#invitation">Invitation</a><a href="#couple">Couple</a><a href="#events">Details</a><a href="#rsvp">RSVP</a>
        </div>
        <button className="music" onClick={toggleMusic} aria-label={playing ? "Pause music" : "Play music"}>{playing ? "♪" : "♪̸"}</button>
      </nav>

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <Rose size={130} className="corner tl" /><Rose size={84} cream className="corner tl2" />
          <p className="script-sm">Together with their families</p>
          <h1 className="mono big">R<span>&amp;</span>J<sup>27</sup></h1>
          <p className="navy">23rd &amp; 24th April 2027 · Nyanya, Abuja</p>
          <p className="wine it">You’re Invited</p>
          <Countdown />
          <div className="actions">
            <a className="btn wine-btn" href="#rsvp">RSVP</a>
            <a className="btn ghost" href="#invitation">View Details</a>
          </div>
        </section>

        {/* Invitation */}
        <section id="invitation" className="sec">
          <Reveal>
            <p className="it wine">The family of</p>
            <p className="fam"><b>Late Sani Noah Oguh (Rtd) &amp; Mrs Ruth M. Noah</b><br />Of Ogo in Olamaboro Local Government</p>
            <div className="pill-row"><i /><span className="pill sm">And</span><i /></div>
            <p className="fam"><b>Elder Itodo S. Isaac &amp; Late Deaconess Ruth A. Itodo</b><br />Of Ofabo in Ofu Local Government.<br />Both in Kogi State</p>
            <p className="it wine">Invite you to the wedding ceremony of their children</p>
            <h2 className="names">{CONFIG.bride}</h2>
            <div className="amp">&amp;</div>
            <h2 className="names">{CONFIG.groom}</h2>
          </Reveal>
        </section>

        {/* Couple */}
        <section id="couple" className="sec">
          <Reveal>
            <Pill>The Couple</Pill>
            <p className="lead">Two families, one faith, one forever. By God’s grace we found each other, and now we want you beside us as we celebrate.</p>
            <figure className="frame">
              {photoOk
                ? <img src={CONFIG.photo} alt="Racheal and Joseph" onError={() => setPhotoOk(false)} />
                : <div className="ph"><Rose size={60} cream /><span>Couple’s photo goes here</span></div>}
              <figcaption>{CONFIG.tag} · Together, always</figcaption>
            </figure>
          </Reveal>
        </section>

        {/* Events */}
        <section id="events" className="sec">
          <Reveal>
            {EVENTS.map((e) => (
              <div key={e.key} className="event">
                <Pill>{e.title}</Pill>
                <p><span className="ico">▦</span> Date: <b>{e.date}</b></p>
                <p><span className="ico">◷</span> Time: <b>{e.time} prompt</b></p>
                <p><span className="ico">⌖</span> {e.venue}</p>
                <a className="link" href={directions(e.venue)} target="_blank" rel="noreferrer">Get Directions</a>
              </div>
            ))}
            <div className="event">
              <Pill>Reception</Pill>
              <p className="it">(The venue will be added later)</p>
            </div>
            <button className="btn wine-btn" onClick={downloadICS}>Add to Calendar</button>

            <div className="toast">
              <h4 className="script-sm wine">Toast:</h4>
              <p>“To love, laughter and a lifetime of happiness. Join us as we celebrate the beginning of our forever.”</p>
            </div>

            <Pill>Colour of the Day</Pill>
            <div className="swatches">
              {COLORS.map((c) => (<div key={c.name}><i style={{ background: c.hex }} /><span>{c.name}</span></div>))}
            </div>
            <p className="it">Kindly grace the occasion in any of these shades.</p>
          </Reveal>
        </section>

        {/* Countdown */}
        <section className="sec">
          <Reveal>
            <p className="it wine">Counting down to forever</p>
            <h2 className="names sm">23rd April 2027</h2>
            <Countdown />
          </Reveal>
        </section>

        {/* RSVP */}
        <section id="rsvp" className="sec">
          <Reveal>
            <p className="it wine">Répondez s’il vous plaît</p>
            <h2 className="names sm">Will you celebrate with us?</h2>
            <p>Kindly tap one option below.</p>
            <div className="actions">
              <button className={`btn ${rsvp === "yes" ? "wine-btn" : "ghost"}`} onClick={() => setRsvp("yes")}>Joyfully Accepts</button>
              <button className={`btn ${rsvp === "no" ? "wine-btn" : "ghost"}`} onClick={() => setRsvp("no")}>Regretfully Declines</button>
            </div>
            {rsvp && <p className="it wine" role="status">{rsvp === "yes" ? "We can’t wait to celebrate with you!" : "You will be missed. Thank you for letting us know."}</p>}

            {CONFIG.accounts.length > 0 && (<>
              {CONFIG.accounts.map((a) => <CopyRow key={a.number + a.bank} acc={a} />)}
              <p className="tiny">Tap Copy to save an account number.</p>
            </>)}

            <h4 className="wa-h">Questions? Chat with us on WhatsApp</h4>
            <p className="tiny">Tapping below opens WhatsApp. It does not submit your RSVP.</p>
            <div className="actions">
              <a className="btn wine-btn" href={waLink(CONFIG.groomWhatsApp)} target="_blank" rel="noreferrer">Contact the Groom</a>
              <a className="btn wine-btn" href={waLink(CONFIG.brideWhatsApp)} target="_blank" rel="noreferrer">Contact the Bride</a>
            </div>
            <p>Prefer to call? <a className="link" href={`tel:${localPhone(CONFIG.groomWhatsApp)}`}>{localPhone(CONFIG.groomWhatsApp)}</a> · <a className="link" href={`tel:${localPhone(CONFIG.brideWhatsApp)}`}>{localPhone(CONFIG.brideWhatsApp)}</a></p>
          </Reveal>
        </section>
      </main>

      <footer className="foot">
        <h2 className="mono">R<span>&amp;</span>J</h2>
        <p>23rd &amp; 24th April 2027</p>
        <p className="it">With love</p>
        <p>#{CONFIG.tag}</p>
      </footer>
    </>
  );
}
