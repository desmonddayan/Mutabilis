import { useEffect, useRef } from "react";
import "./DemoAnimation.css";

/*
  Mutabilis landing-page demo.
  Usage:  <DemoAnimation />            (autoplays, loops, no buttons)
          <DemoAnimation controls />   (adds Pause / Replay / progress bar)

  The markup is plain JSX. The timeline runs inside one useEffect and changes classes and
  text on these elements directly (the component never re-renders, so React and the
  timeline don't fight). All data in it is example data.
*/

const SLOTS = [["Left", -1], ["Middle", 0], ["Right", 1]];
const SEEDED = { 1: 1, 3: 1, 5: 1 };

function Face({ dir }) {
    const dx = dir * 9;
    const ex = dir * 8;
    const c = "#4d7dff";
    return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
            <ellipse cx="50" cy="52" rx={30 - Math.abs(dir) * 4} ry="36" fill="none" stroke={c} strokeWidth="2.6" />
            <circle cx={38 + ex + dx * 0.3} cy="46" r="2.4" fill={c} />
            <circle cx={62 + ex + dx * 0.3} cy="46" r="2.4" fill={c} />
            <path d={`M${50 + dx} 48 L${47 + dx} 62 L${53 + dx} 62`} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M${41 + dx * 0.8} 72 Q${50 + dx * 0.8} 78 ${59 + dx * 0.8} 72`} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    );
}

const DIARY =
    "Woke up at 7 and washed my face with the salicylic cleanser. Oats and berries for breakfast, then a coffee on the way to work. Long day at the desk under bright office lights, and I touched my chin a few times in meetings. Lunch was a chicken salad, no dairy. Went for a 40 minute run after work and showered straight after. Dinner was salmon with rice. Switched to a clean pillowcase tonight and used the niacinamide serum before bed. Chin felt a little dry but the redness on my cheeks looked calmer than yesterday.";
const DIARY_PLACEHOLDER =
    "Note flare-ups, diet, events, mood, pillow changes, supplements, hair products, cooking products, and etc...";
const QUESTION = "Why do my cheeks look calmer on these days?";
const ANSWER =
    "Your cheek redness dropped from 4.2 on Oct 3 to 3.1 on Oct 6. Your Oct 6 diary points to a few likely reasons: you used the niacinamide serum before bed, switched to a clean pillowcase, and had no dairy. You also slept 8 hours that night, up from 6 on Oct 3. The 40 minute run helped too, since you showered straight after instead of leaving sweat on your skin. Your chin is the one area still dry, and you touched it several times in meetings. Suggestion: keep the serum and clean pillowcase going for another week, and note in your diary whether the chin dryness settles.";
const CHAT_PLACEHOLDER = "Ask about your skin...";
const CHAT_TOP = 1860;

export default function DemoAnimation({ controls = false, className = "" }) {
    const root = useRef(null);

    useEffect(() => {
        const rootEl = root.current;
        if (!rootEl) return;
        const $ = (id) => rootEl.querySelector("#" + id);
        const all = (sel) => rootEl.querySelectorAll(sel);
        const frame = $("frame");
        const stage = $("stage");
        const world = $("world");
        const cursor = $("cursor");

        // scale the 1600x900 stage to whatever width the component is given
        const fit = () => { stage.style.transform = "scale(" + frame.clientWidth / 1600 + ")"; };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(frame);

        let paused = false;
        let visible = true;
        let runId = 0;
        let elapsed = 0;
        let scrollY = 0;
        const TOTAL = 40000;

        // only animate while on screen
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
        io.observe(rootEl);

        // wait; speed factor 0.7 makes everything 30% quicker. A wait from an old run never resolves.
        const W = (ms) => {
            const my = runId;
            return new Promise((res) => {
                let left = ms * 0.7;
                let last = performance.now();
                (function tick() {
                    if (my !== runId) return;
                    const now = performance.now();
                    if (!paused && visible) left -= now - last;
                    last = now;
                    if (left <= 0) res(); else setTimeout(tick, 30);
                })();
            });
        };
        const progress = setInterval(() => {
            if (!paused && visible) {
                elapsed += 100;
                const bar = $("prog");
                if (bar) bar.style.width = Math.min(100, (elapsed / TOTAL) * 100) + "%";
            }
        }, 100);

        // positions in world pixels (offset chain ignores transforms)
        const center = (el) => {
            let x = el.offsetWidth / 2;
            let y = el.offsetHeight / 2;
            if ($("mscroll").contains(el)) y -= scrollY;
            let e = el;
            while (e && e !== world) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
            return [x, y];
        };
        const setScroll = (y) => { scrollY = y; $("mscroll").style.transform = "translateY(" + -y + "px)"; };
        const cam = (cx, cy, s) => {
            world.style.transform = "translate(" + (800 - cx * s) + "px," + (450 - cy * s) + "px) scale(" + s + ")";
        };
        const curSet = (x, y, instant) => {
            if (instant) cursor.style.transition = "none";
            cursor.style.left = x + "px";
            cursor.style.top = y + "px";
            if (instant) { void cursor.offsetWidth; cursor.style.transition = ""; }
        };
        const moveTo = async (el, dx = 0, dy = 0) => {
            const c = center(el);
            curSet(c[0] + dx, c[1] + dy);
            await W(1000);
        };
        const click = async () => {
            cursor.classList.remove("click");
            void cursor.offsetWidth;
            cursor.classList.add("click");
            await W(250);
        };
        const tap = async (el) => { el.classList.add("press"); await W(180); el.classList.remove("press"); };
        const cap = (t) => {
            const c = $("capt");
            c.classList.remove("on");
            if (t) setTimeout(() => { c.textContent = t; c.classList.add("on"); }, 250);
        };
        const type = async (el, text, speed, id, step = 1) => {
            for (let i = 0; i < text.length; i += step) {
                if (id !== runId) return false;
                el.textContent = text.slice(0, i + step);
                await W(speed);
            }
            return true;
        };

        const reset = () => {
            all(".cell").forEach((e) => e.classList.remove("sel", "press"));
            $("c6").classList.remove("has");
            all(".pn").forEach((e) => e.classList.remove("on"));
            $("overlay").classList.remove("open");
            setScroll(0);
            $("diary").textContent = DIARY_PLACEHOLDER;
            $("diary").classList.remove("has");
            $("rsel").classList.remove("on");
            $("rsel").textContent = "Select";
            $("sv").textContent = "7 Hours";
            $("wv").textContent = "1.5 Litres";
            $("stv").textContent = "None";
            $("dsm").classList.remove("on");
            $("seltxt").textContent = "Nothing Selected";
            $("uq").classList.remove("on");
            $("uq").textContent = "";
            $("aiq").classList.remove("on");
            $("aiq").textContent = "";
            $("typed").textContent = CHAT_PLACEHOLDER;
            $("typed").classList.remove("has");
            cursor.style.opacity = "1";
            cap("");
            elapsed = 0;
        };

        async function play() {
            const id = ++runId;
            reset();
            cam(800, 450, 1);
            curSet(1380, 130, true);
            cap("Your skin, tracked day by day");
            await W(2200); if (id !== runId) return;

            // open a day
            const c6 = $("c6");
            await moveTo(c6); if (id !== runId) return;
            await click();
            c6.classList.add("press");
            await W(350);
            $("overlay").classList.add("open");
            c6.classList.remove("press");
            cap("Upload three photos: left, middle, right");
            cam(800, 470, 1.15);
            curSet(1100, 780, true);
            await W(1900); if (id !== runId) return;
            const pn = all(".pn");
            for (let i = 0; i < 3; i++) {
                await moveTo(pn[i], 0, 60); if (id !== runId) return;
                await click();
                pn[i].classList.add("on");
                await W(550); if (id !== runId) return;
            }
            await W(900); if (id !== runId) return;

            // diary
            cap("Write a diary note");
            setScroll(545);
            await W(1700); if (id !== runId) return;
            await moveTo($("diary"));
            await click();
            $("diary").textContent = "";
            $("diary").classList.add("has");
            if (!(await type($("diary"), DIARY, 22, id, 3))) return;
            await W(600);

            // lifestyle
            cap("Log your routine, sleep, water and stress");
            cam(900, 690, 1.4);
            await W(1500); if (id !== runId) return;
            await moveTo($("rsel")); await click();
            $("rsel").classList.add("on"); $("rsel").textContent = "Selected";
            await W(500);
            await moveTo($("sp")); await click();
            $("sp").classList.add("press"); $("sv").textContent = "8 Hours"; await W(300); $("sp").classList.remove("press");
            await moveTo($("wp")); await click();
            $("wp").classList.add("press"); $("wv").textContent = "2 Litres"; await W(300); $("wp").classList.remove("press");
            await moveTo($("stp")); await click();
            $("stp").classList.add("press"); $("stv").textContent = "Low"; await W(300); $("stp").classList.remove("press");
            await W(900); if (id !== runId) return;

            // save
            cap("Save the entry");
            cam(800, 700, 1.2);
            await moveTo($("save")); await click(); await tap($("save")); await W(300);
            $("overlay").classList.remove("open");
            cam(800, 450, 1);
            curSet(1100, 500);
            await W(1200);
            $("c6").classList.add("has");
            cap("Every day joins your timeline");
            await W(2600); if (id !== runId) return;

            // select dates
            cap("Turn on select mode to compare days");
            cam(420, CHAT_TOP + 30, 1.9);
            await moveTo($("dsm")); await W(900); if (id !== runId) return;
            await click();
            $("dsm").classList.add("on");
            await W(900);
            cap("Pick up to three days");
            cam(800, 470, 1.05);
            await W(1900); if (id !== runId) return;
            const picks = [3, 5, 6];
            const txt = [];
            for (let k = 0; k < 3; k++) {
                const c = $("c" + picks[k]);
                await moveTo(c); if (id !== runId) return;
                await click();
                c.classList.add("sel");
                txt.push("2026-10-0" + picks[k]);
                $("seltxt").textContent = txt.join(", ");
                await W(500);
            }
            await W(700);

            // chat
            cap("Ask about your skin");
            cam(800, CHAT_TOP + 400, 1.0);
            await W(1900); if (id !== runId) return;
            await moveTo($("typed"), -300, 0);
            await click();
            $("typed").classList.add("has");
            if (!(await type($("typed"), QUESTION, 45, id, 1))) return;
            await W(500);
            await moveTo($("send")); await click(); await tap($("send"));
            $("typed").textContent = CHAT_PLACEHOLDER;
            $("typed").classList.remove("has");
            $("uq").textContent = QUESTION;
            $("uq").classList.add("on");
            cam(800, CHAT_TOP + 280, 1.1);
            await W(700);
            const a = $("aiq");
            a.classList.add("on");
            a.innerHTML = '<span class="dots"><span></span><span></span><span></span></span>';
            await W(1600); if (id !== runId) return;
            a.textContent = "";
            if (!(await type(a, ANSWER, 16, id, 2))) return;
            await W(2800); if (id !== runId) return;

            cursor.style.opacity = "0";
            cam(800, 450, 1);
            cap("Mutabilis. Know what your skin responds to.");
            await W(4200); if (id !== runId) return;
            cap("");
            await W(900);
            if (id === runId) play();
        }

        function still() { // reduced motion: show the finished state, no animation
            cam(800, 450, 1);
            curSet(-100, -100, true);
            [1, 3, 5, 6].forEach((d) => $("c" + d).classList.add("has"));
            [3, 5, 6].forEach((d) => $("c" + d).classList.add("sel"));
            cap("Mutabilis. Know what your skin responds to.");
            $("capt").classList.add("on");
        }

        const pp = $("pp");
        const rp = $("rp");
        const onPause = () => { paused = !paused; pp.textContent = paused ? "Play" : "Pause"; };
        const onReplay = () => { paused = false; if (pp) pp.textContent = "Pause"; play(); };
        if (pp) pp.addEventListener("click", onPause);
        if (rp) rp.addEventListener("click", onReplay);

        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) still();
        else play();

        return () => {
            runId++; // cancels any running timeline
            clearInterval(progress);
            ro.disconnect();
            io.disconnect();
            if (pp) pp.removeEventListener("click", onPause);
            if (rp) rp.removeEventListener("click", onReplay);
        };
    }, []);

    return (
        <div className={"md-root " + className} ref={root}>
            <div className="frame" id="frame">
                <div id="stage">
                    <div id="world">
                        <div id="nav">
                            <span className="l1">Home</span>
                            <span className="l2">Track</span>
                            <span className="brand">Mutabilis</span>
                            <span className="r">Sign Out</span>
                        </div>
                        <div id="head">October 2026</div>
                        <div id="arrows"><i>&lt;</i><i>&gt;</i></div>
                        <div id="div1" />
                        <div id="dow">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                                <span key={d}>{d}</span>
                            ))}
                        </div>
                        <div id="grid">
                            {Array.from({ length: 35 }, (_, i) => {
                                const d = i - 2; // October 2026 starts on a Thursday, grid starts Mon 28 Sep
                                const out = d < 1 || d > 31;
                                const n = d < 1 ? 30 + d : d > 31 ? d - 31 : d;
                                return (
                                    <div key={i} id={out ? undefined : "c" + d} className={"cell" + (!out && SEEDED[d] ? " has" : "")}>
                                        <span className="n">{n}</span>
                                        <div className="thumb"><Face dir={0} /></div>
                                    </div>
                                );
                            })}
                        </div>

                        <section id="chat">
                            <div id="tb">
                                <button id="dsm" type="button">Date Select Mode</button>
                                <div id="seld">Selected Dates: <span id="seltxt">Nothing Selected</span></div>
                                <div id="clr">Clear Selections</div>
                            </div>
                            <div id="msgs">
                                <div className="u" id="uq" />
                                <div className="ai" id="aiq" />
                            </div>
                            <div id="inp">
                                <div id="typed">{CHAT_PLACEHOLDER}</div>
                                <button id="send" type="button">Send</button>
                            </div>
                        </section>

                        <div id="overlay">
                            <div id="modal">
                                <div id="mh">
                                    <small>Selfies and Diary</small>
                                    <b>6 October 2026</b>
                                    <div id="mx">X</div>
                                </div>
                                <div id="mbody">
                                    <div id="mscroll">
                                        <div className="lab">Selfies (Same Lighting and Framing)</div>
                                        <div className="panels">
                                            {SLOTS.map(([name, dir]) => (
                                                <div className="pn" key={name}>
                                                    <div className="t"><b>{name}</b><em>Tap &amp; Drag to Upload</em></div>
                                                    <Face dir={dir} />
                                                    <span className="tag">{name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="lab" style={{ paddingTop: 34 }}>Diary (Journal Every Event)</div>
                                        <div id="diaryrow">
                                            <div id="diary">{DIARY_PLACEHOLDER}</div>
                                            <div id="start">Start</div>
                                        </div>
                                        <div className="cols">
                                            <div className="col">
                                                <div className="lab"><span>Routine</span><span className="plus">+</span></div>
                                                <div className="rowx">
                                                    <span>1. Morning Routine AMPM</span>
                                                    <span className="r"><span className="sbtn" id="rsel">Select</span><span className="chev">&#8964;</span></span>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="lab"><span>Lifestyle</span></div>
                                                <div className="rowx"><span>Sleep</span><span className="ctl"><i id="sm">-</i><b id="sv">7 Hours</b><i id="sp">+</i></span></div>
                                                <div className="rowx">
                                                    <span>Water <span className="unit"><span>Litres</span><span>Cups</span></span></span>
                                                    <span className="ctl"><i id="wm">-</i><b id="wv">1.5 Litres</b><i id="wp">+</i></span>
                                                </div>
                                                <div className="rowx"><span>Stress</span><span className="ctl"><i id="stm">&lt;</i><b id="stv">None</b><i id="stp">&gt;</i></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="mf"><div id="save">Save Entry</div></div>
                            </div>
                        </div>

                        <div id="cursor">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.7 L11 13.5 L18 13.5 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div id="cap"><div id="capt" /></div>
                </div>
            </div>
            {controls && (
                <div className="controls">
                    <button id="pp" type="button">Pause</button>
                    <button id="rp" type="button">Replay</button>
                    <div className="bar" aria-hidden="true"><i id="prog" /></div>
                </div>
            )}
        </div>
    );
}
