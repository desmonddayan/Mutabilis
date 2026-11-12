import { useEffect, useRef } from "react";
import "./DemoAnimation.css";

/*
  Mutabilis landing-page demo, built from the app's real CSS at a 1440px-wide laptop viewport
  (calendar, day popup with routine search, floating chat bar with date select, waiting dots and typed reply).
  Usage:  <DemoAnimation />            (autoplays, loops, no buttons)
          <DemoAnimation controls />   (adds Pause / Replay / progress bar)

  The markup is plain JSX. The timeline runs inside one useEffect and changes classes and
  text on these elements directly (the component never re-renders, so React and the
  timeline don't fight). The calendar cells and the three photo slots are filled by that same
  script. All data in it is example data, and the products are made up.
*/

export default function DemoAnimation({ controls = false, className = "" }) {
    const root = useRef(null);

    useEffect(() => {
        const rootEl = root.current;
        if (!rootEl) return;

        var $=function(id){return rootEl.querySelector("#"+id)};
        var frame=$("frame"),stage=$("stage"),world=$("world"),cursor=$("cursor"),ms=$("mscroll"),mbody=$("mbody");
        // scale the 1440x810 stage to whatever width the component is given
        function fit(){stage.style.transform="scale("+(frame.clientWidth/1440)+")"}
        fit();
        var ro=new ResizeObserver(fit);ro.observe(frame);
        // only animate while on screen
        var visible=true;
        var io=new IntersectionObserver(function(e){visible=e[0].isIntersecting},{threshold:0.1});io.observe(rootEl);

        function face(dir,cls){
            var dx=dir*9,ex=dir*8;
            return '<svg '+(cls?'class="'+cls+'" ':'')+'viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="52" rx="'+(30-Math.abs(dir)*4)+'" ry="36" fill="none" stroke="#4d7dff" stroke-width="2.6"/>'+
                '<circle cx="'+(38+ex+dx*.3)+'" cy="46" r="2.4" fill="#4d7dff"/><circle cx="'+(62+ex+dx*.3)+'" cy="46" r="2.4" fill="#4d7dff"/>'+
                '<path d="M'+(50+dx)+' 48 L'+(47+dx)+' 62 L'+(53+dx)+' 62" fill="none" stroke="#4d7dff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+
                '<path d="M'+(41+dx*.8)+' 72 Q'+(50+dx*.8)+' 78 '+(59+dx*.8)+' 72" fill="none" stroke="#4d7dff" stroke-width="2.4" stroke-linecap="round"/></svg>';
        }
        var slots=[["Left",-1],["Middle",0],["Right",1]];
        $("panels").innerHTML=slots.map(function(s){
            return '<div class="pn"><div class="fcu"><div class="t"><b>'+s[0]+'</b><em>Tap &amp; Drag to Upload</em></div>'+face(s[1],"face")+'</div><span class="rmv">Remove</span></div>';
        }).join("");

        // November 2026 starts on a Sunday: the grid starts Mon 26 Oct and has 6 rows
        var seeded={2:1,4:1,5:1};
        var cells=[];
        for(var i=0;i<42;i++){
            var d=i-5,out=d<1||d>30,n=d<1?31+d:(d>30?d-30:d);
            cells.push('<div class="cell'+(!out&&seeded[d]?' has':'')+'"'+(out?'':' id="c'+d+'"')+'><span class="n">'+n+'</span><div class="thumb">'+face(0)+'</div></div>');
        }
        $("grid").innerHTML=cells.join("");
        var CHAT_TOP=1971;

        // camera state is kept in JS so the cursor (which lives in stage space) can be aimed at world elements
        var camT={x:0,y:0,s:1};
        function cam(cx,cy,s){camT={x:720-cx*s,y:405-cy*s,s:s};world.style.transform="translate("+camT.x+"px,"+camT.y+"px) scale("+s+")"}
        var scrollY=0;
        function maxScroll(){return Math.max(0,ms.offsetHeight-mbody.offsetHeight)}
        function setScroll(y){scrollY=Math.max(0,Math.min(y,maxScroll()));ms.style.transform="translateY("+(-scrollY)+"px)"}
        function offY(el){var y=0,e=el;while(e&&e!==ms){y+=e.offsetTop;e=e.offsetParent}return y}
        function center(el){
            var x=el.offsetWidth/2,y=el.offsetHeight/2,e=el,inWorld=world.contains(el);
            if(ms.contains(el))y-=scrollY;
            var root=inWorld?world:stage;
            while(e&&e!==root){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}
            return inWorld?[camT.x+camT.s*x,camT.y+camT.s*y]:[x,y];
        }
        function curSet(x,y,instant){
            if(instant){cursor.style.transition="none"}
            cursor.style.left=x+"px";cursor.style.top=y+"px";
            if(instant){void cursor.offsetWidth;cursor.style.transition=""}
        }
        async function moveTo(el,dx,dy){var c=center(el);curSet(c[0]+(dx||0),c[1]+(dy||0));await W(900)}
        async function click(){cursor.classList.remove("click");void cursor.offsetWidth;cursor.classList.add("click");await W(250)}
        function cap(t){
            var c=$("capt");c.classList.remove("on");
            if(t)setTimeout(function(){c.textContent=t;c.classList.add("on")},250);
        }

        var paused=false,runId=0,elapsed=0,TOTAL=66900;
        // a wait from an old run never resolves; speed factor 0.7 makes everything 30% quicker
        function W(ms){var my=runId;return new Promise(function(res){
            var left=ms*0.7,last=performance.now();
            (function tick(){if(my!==runId)return;var now=performance.now();if(!paused&&visible)left-=now-last;last=now;if(left<=0)res();else setTimeout(tick,30)})();
        })}
        var progress=setInterval(function(){if(!paused&&visible){elapsed+=100;var bar=$("prog");if(bar)bar.style.width=Math.min(100,elapsed/TOTAL*100)+"%"}},100);

        async function type(el,text,speed,id,step){
            step=step||1;
            for(var i=0;i<text.length;i+=step){
                if(id!==runId)return false;
                el.textContent=text.slice(0,i+step);await W(speed);
            }
            return true;
        }
        async function tap(el){el.classList.add("press");await W(180);el.classList.remove("press")}

        var DIARY="Woke up at 7 and washed my face with the foam cleanser. Oats and berries for breakfast, then a coffee on the way to work. Long day at the desk under bright office lights, and I touched my chin a few times in meetings. Lunch was a chicken salad, no dairy. Went for a 40 minute run after work and showered straight after. Dinner was salmon with rice. Switched to a clean pillowcase tonight and used the niacinamide serum before bed. Chin felt a little dry but the redness on my cheeks looked calmer than yesterday.";
        var DIARY_PH="Note flare-ups, diet, events, mood, pillow changes, supplements, hair products, cooking products, and etc...";
        var QUESTION="Why do my cheeks look calmer on these days?";
        var ANSWER="Your cheek redness dropped from 4.2 on Nov 2 to 3.1 on Nov 6. Your Nov 6 diary points to a few likely reasons: you used the niacinamide serum before bed, switched to a clean pillowcase, and had no dairy. You also slept 9 hours that night, up from 6 on Nov 2. The 40 minute run helped too, since you showered straight after instead of leaving sweat on your skin. Your chin is the one area still dry, and you touched it several times in meetings. Suggestion: keep the serum and clean pillowcase going for another week, and note in your diary whether the chin dryness settles.";
        var PH="Ask about your skin...";
        var R_PH="e.g. Morning, Deep Cleanse...",P_PH="e.g. Brand, Name on Label...";
        var Q1="Pellora Gentle Foam Cleanser",Q2="Nolva Niacinamide Serum";
        var SUG={};
        SUG[Q1]=[["Gentle Foam Cleanser","Pellora","Cleanser"],["Daily Hydra Cleanser","Nolva","Cleanser"]];
        SUG[Q2]=[["Niacinamide Serum","Nolva","Serum"],["Barrier Repair Serum","Pellora","Serum"]];
        var EXTRA=["Ceramide Barrier Cream","Daily Mineral Sunscreen SPF 50","Hydra Eye Gel"];
        var list=[];
        var up='<button class="mb mu" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';
        var dn='<button class="mb" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';
        function showSugg(q){
            $("sugg").innerHTML='<p class="sh">Search Suggestions:</p>'+SUG[q].map(function(it,i){
                return '<button class="sg" id="sg'+i+'" type="button"><div class="isp"><div class="pab"><span>'+it[0]+'</span><span class="pnt">'+it[1]+'</span></div><span class="pnt">'+it[2]+'</span></div></button>';
            }).join('')+'<button class="sg" id="sgn" type="button">None of the Above</button>';
            $("sugg").classList.add("show");$("d13").classList.add("show");
        }
        function hideSugg(){$("sugg").classList.remove("show");$("d13").classList.remove("show")}
        function renderList(){
            $("plist").innerHTML='<p class="pt">Product List</p><div class="pls">'+list.map(function(n,i){
                return '<div class="ipc"><div class="lmi"><div class="lmb">'+up+dn+'</div><span class="apn">'+(i+1)+'. '+n+'</span></div><button class="dpb" type="button">X</button></div>';
            }).join('')+'</div>';
            $("plist").classList.toggle("show",list.length>0);
        }
        function focusRoutine(){setScroll(offY($("rlab"))-6)}
        function setField(id,txt,ph){var f=$(id);f.textContent=txt||ph;f.parentNode.classList.toggle("v",!!txt)}

        function reset(){
            rootEl.querySelectorAll(".cell").forEach(function(e){e.classList.remove("sel","press")});
            $("c6").classList.remove("has");
            rootEl.querySelectorAll(".pn").forEach(function(e){e.classList.remove("on")});
            $("overlay").classList.remove("open");$("bar").classList.remove("hide");
            ms.style.transition="none";setScroll(0);void ms.offsetWidth;ms.style.transition="";
            $("dtext").textContent=DIARY_PH;$("diary").classList.remove("has");
            $("saved").classList.remove("on");$("chk").classList.remove("on");$("rform").classList.remove("on");
            $("addr").style.display="";$("rlab").textContent="Routine";
            setField("rnameT","",R_PH);setField("pnameT","",P_PH);
            ["oam","opm","oboth"].forEach(function(k){$(k).classList.remove("on")});
            hideSugg();$("sugg").innerHTML="";list=[];renderList();
            $("sv").textContent="8 Hours";$("wv").textContent="2 Litres";$("stv").textContent="None";$("cupsb").textContent="Cups";
            $("selbtn").classList.remove("on");$("selrow").classList.remove("on");$("chips").innerHTML="";
            $("uq").classList.remove("on");$("uq").textContent="";$("wait").classList.remove("on");$("aiw").classList.remove("on");$("aiq").textContent="";
            $("typed").textContent=PH;$("typed").classList.remove("has");
            cap("");elapsed=0;
        }

        async function searchProduct(q,pickIdx,id){
            await moveTo($("pname"),-60,0);if(id!==runId)return false;
            await click();$("pname").classList.add("v");$("pnameT").textContent="";
            if(!await type($("pnameT"),q,42,id,1))return false;
            await W(300);
            await moveTo($("psearch"));await click();await tap($("psearch"));
            showSugg(q);focusRoutine();await W(1100);if(id!==runId)return false;
            var s=$("sg"+pickIdx);
            await moveTo(s);if(id!==runId)return false;
            await click();await tap(s);
            list.push(SUG[q][pickIdx][0]);renderList();
            hideSugg();setField("pnameT","",P_PH);focusRoutine();
            await W(900);
            return true;
        }

        async function play(){
            var id=++runId;reset();
            cam(720,405,1);curSet(1300,140,true);cursor.style.opacity="1";
            cap("Your skin, tracked day by day");
            await W(2200);if(id!==runId)return;

            // open a day
            var c6=$("c6");
            await moveTo(c6);if(id!==runId)return;
            await click();c6.classList.add("press");await W(350);
            $("bar").classList.add("hide");$("overlay").classList.add("open");c6.classList.remove("press");
            cap("Upload three photos: left, middle, right");
            cam(480,353,1.5);curSet(700,600,true);
            await W(1900);if(id!==runId)return;
            var pn=rootEl.querySelectorAll(".pn");
            for(var i=0;i<3;i++){
                await moveTo(pn[i],0,60);if(id!==runId)return;
                await click();pn[i].classList.add("on");await W(550);if(id!==runId)return;
            }
            await W(700);if(id!==runId)return;

            // diary
            cap("Write a diary note");
            cam(960,353,1.5);
            await W(900);
            await moveTo($("diary"),0,-100);await click();
            $("dtext").textContent="";$("diary").classList.add("has");
            if(!await type($("dtext"),DIARY,22,id,4))return;
            await W(600);

            // routine: build it and search for products
            cap("Build a routine and search for your products");
            cam(520,405,1.4);focusRoutine();
            await W(1700);if(id!==runId)return;
            await moveTo($("addr"));await click();await tap($("addr"));
            $("addr").style.display="none";$("rform").classList.add("on");$("rlab").textContent="New Routine";focusRoutine();
            await W(700);if(id!==runId)return;
            await moveTo($("rname"),-60,0);await click();
            $("rname").classList.add("v");$("rnameT").textContent="";
            if(!await type($("rnameT"),"Morning",80,id,1))return;
            await moveTo($("oboth"));await click();$("oboth").classList.add("on");await W(500);if(id!==runId)return;
            cap("Search a product, then pick it from the suggestions");
            if(!await searchProduct(Q1,0,id))return;
            if(!await searchProduct(Q2,0,id))return;
            cap("Keep adding until the routine is complete");
            cam(520,445,1.4);
            await W(600);if(id!==runId)return;
            for(var e=0;e<EXTRA.length;e++){
                list.push(EXTRA[e]);renderList();focusRoutine();
                await W(650);if(id!==runId)return;
            }
            await W(1800);if(id!==runId)return;
            await moveTo($("rsubmit"));await click();await tap($("rsubmit"));
            $("rform").classList.remove("on");$("addr").style.display="";$("rlab").textContent="Routine";
            $("saved").classList.add("on");focusRoutine();
            await W(700);if(id!==runId)return;
            await moveTo($("chk"));await click();$("chk").classList.add("on");await W(700);if(id!==runId)return;

            // lifestyle
            cap("Log sleep, water and stress");
            setScroll(offY($("life"))-40);cam(960,470,1.5);
            await W(1500);if(id!==runId)return;
            await moveTo($("sp"));await click();$("sp").classList.add("press");$("sv").textContent="9 Hours";await W(300);$("sp").classList.remove("press");
            await moveTo($("cupsb"));await click();$("cupsb").classList.add("press");$("cupsb").textContent="Litres";$("wv").textContent="2 Cups";await W(300);$("cupsb").classList.remove("press");
            await moveTo($("stp"));await click();$("stp").classList.add("press");$("stv").textContent="Mild";await W(300);$("stp").classList.remove("press");
            await W(800);if(id!==runId)return;

            // save
            cap("Submit the entry");
            cam(720,560,1.3);
            await moveTo($("save"));await click();await tap($("save"));await W(300);
            $("overlay").classList.remove("open");$("bar").classList.remove("hide");
            cam(720,405,1);curSet(1100,420);
            await W(1200);$("c6").classList.add("has");
            cap("Every day joins your timeline");
            await W(2400);if(id!==runId)return;

            // select dates
            cap("Turn on select mode to compare days");
            cam(720,622,1);
            await moveTo($("selbtn"));await W(300);if(id!==runId)return;
            await click();await tap($("selbtn"));$("selbtn").classList.add("on");await W(900);
            cap("Pick up to three days");
            var picks=[2,5,6],txt=[];
            for(var k=0;k<3;k++){
                var c=$("c"+picks[k]);
                await moveTo(c);if(id!==runId)return;
                await click();c.classList.add("sel");txt.push("2026-11-0"+picks[k]);
                $("selrow").classList.add("on");
                $("chips").innerHTML=txt.map(function(t){return '<div class="chip">'+t+'</div>'}).join("");
                await W(500);
            }
            await W(800);if(id!==runId)return;

            // chat
            cap("Ask about your skin");
            await moveTo($("typed"),-250,0);await click();
            $("typed").classList.add("has");
            if(!await type($("typed"),QUESTION,38,id,1))return;
            await W(500);
            await moveTo($("send"));await click();await tap($("send"));
            $("typed").textContent=PH;$("typed").classList.remove("has");
            $("selrow").classList.remove("on");$("chips").innerHTML="";$("selbtn").classList.remove("on");
            rootEl.querySelectorAll(".cell.sel").forEach(function(e){e.classList.remove("sel")});
            $("uq").textContent=QUESTION;$("uq").classList.add("on");$("wait").classList.add("on");
            cap("");
            cam(720,CHAT_TOP+390,1);
            await W(3000);if(id!==runId)return;
            var a=$("aiq");$("wait").classList.remove("on");$("aiw").classList.add("on");a.textContent="";
            if(!await type(a,ANSWER,16,id,3))return;
            await W(2600);if(id!==runId)return;

            cursor.style.opacity="0";
            cam(720,405,1);cap("Mutabilis. Know what your skin responds to.");
            await W(4200);if(id!==runId)return;
            cap("");await W(900);
            if(id===runId)play();
        }

        function still(){
            cam(720,405,1);curSet(-100,-100,true);
            [2,4,5,6].forEach(function(d){$("c"+d).classList.add("has")});
            [2,5,6].forEach(function(d){$("c"+d).classList.add("sel")});
            $("selrow").classList.add("on");$("selbtn").classList.add("on");
            $("chips").innerHTML=["2026-11-02","2026-11-05","2026-11-06"].map(function(t){return '<div class="chip">'+t+'</div>'}).join("");
            cap("Mutabilis. Know what your skin responds to.");$("capt").classList.add("on");
        }

        var pp=$("pp"),rp=$("rp");
        var onPause=function(){paused=!paused;pp.textContent=paused?"Play":"Pause"};
        var onReplay=function(){paused=false;if(pp)pp.textContent="Pause";cursor.style.opacity="1";play()};
        if(pp)pp.addEventListener("click",onPause);
        if(rp)rp.addEventListener("click",onReplay);

        if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)still();else play();

        return function(){
            runId++; // cancels any running timeline
            clearInterval(progress);ro.disconnect();io.disconnect();
            if(pp)pp.removeEventListener("click",onPause);
            if(rp)rp.removeEventListener("click",onReplay);
        };
    }, []);

    return (
        <div className={"md-root " + className} ref={root}>
            <div className="frame" id="frame">
                <div id="stage">
                    <div id="world">
                        <div id="nav"><span className="brand">Mutabilis</span><span className="r">Sign Out</span></div>
                        <div id="head">November 2026</div>
                        <div id="arrows"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:"rotate(90deg)"}}><path d="M6 9l6 6 6-6"/></svg></i><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:"rotate(-90deg)"}}><path d="M6 9l6 6 6-6"/></svg></i></div>
                        <div id="div1" />
                        <div id="dow"><span>Monday</span><span>Tuesday</span><span>Wednesday</span><span>Thursday</span><span>Friday</span><span>Saturday</span><span>Sunday</span></div>
                        <div id="grid" />

                        <section id="chat"><div id="msgs">
                            <div className="uw"><div className="u" id="uq"></div></div>
                            <div id="wait"><div className="dots"><span></span><span></span><span></span></div></div>
                            <div className="aiw" id="aiw"><div className="ai" id="aiq"></div></div>
                        </div></section>

                        <div id="overlay">
                            <div id="modal">
                                <div className="mh"><h2 id="mtitle">6 November 2026</h2><div id="mx">X</div></div>
                                <hr className="hr1"/>
                                <div id="mbody"><div id="mscroll">
                                    <div className="pd">
                                        <div className="ppc"><p className="hl">Photos</p><div className="tp" id="panels" /></div>
                                        <div className="pdc"><p className="hl">Diary (Journal Every Event)</p>
                                            <div id="diary"><span id="dtext">Note flare-ups, diet, events, mood, pillow changes, supplements, hair products, cooking products, and etc...</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></div></div>
                                    </div>
                                    <div className="rl">
                                        <div className="rpc">
                                            <p id="rlab">Routine</p>
                                            <div id="saved"><div className="sre">
                                                <span className="chk" id="chk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L18 5"/></svg></span>
                                                <div className="srn"><p className="srt">1. Morning AMPM</p><span className="chv"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></div></div></div>
                                            <div className="addr" id="addr">+ Add Routine</div>
                                            <div id="rform">
                                                <div>
                                                    <div className="rnc"><div className="rntc"><p className="lbl">Routine Name</p><span className="inp" id="rname"><span id="rnameT">e.g. Morning, Deep Cleanse...</span></span></div>
                                                        <div className="timeSetButtonContainer"><button className="tb" id="oam" type="button">AM</button><button className="tb" id="opm" type="button">PM</button><button className="tb" id="oboth" type="button">AM{"\u00b7"}PM</button></div></div>
                                                    <hr className="d11"/>
                                                    <div className="psr"><div className="psi"><div className="rntc"><p className="lbl">Product Name</p><span className="inp" id="pname"><span id="pnameT">e.g. Brand, Name on Label...</span></span></div>
                                                        <button className="sbt" id="psearch" type="button">Search</button></div><hr className="d13" id="d13"/></div>
                                                    <div id="sugg" />
                                                    <div id="plist" />
                                                    <hr className="d11"/>
                                                </div>
                                                <div className="smc"><div className="sp3"></div><div className="sp1"><button id="rsubmit" type="button">Submit</button></div><div className="sp3"><button className="cnl" type="button">Cancel</button></div></div>
                                            </div>
                                        </div>
                                        <div className="lfc"><div className="lfh"><p className="hl">Lifestyle</p></div>
                                            <div className="lcc" id="life">
                                                <div className="sl"><p className="fac">Sleep</p><div className="cc"><span className="cb" id="sm"><b>-</b></span><p className="cnt" id="sv">8 Hours</p><span className="cb" id="sp"><b>+</b></span></div></div>
                                                <div className="sl"><div className="wi"><p className="fac">Water</p><span className="wub" id="cupsb">Cups</span></div><div className="cc"><span className="cb" id="wm"><b>-</b></span><p className="cnt" id="wv">2 Litres</p><span className="cb" id="wp"><b>+</b></span></div></div>
                                                <div className="sl last"><p className="fac">Stress</p><div className="cc"><span className="cb l" id="stm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></span><p className="cnt" id="stv">None</p><span className="cb r" id="stp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></div></div>
                                            </div></div>
                                    </div>
                                </div></div>
                                <hr className="hr1"/>
                                <div className="sbc"><div id="save">Submit</div></div>
                            </div>
                        </div>
                    </div>

                    <div id="bar">
                        <div id="selrow"><div id="chips" /><span id="clr">Clear</span></div>
                        <div id="inrow"><div id="typed">Ask about your skin...</div>
                            <div id="btns"><button className="ib" id="selbtn" type="button" aria-label="Select dates"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11V2H2v18h9" strokeDasharray="3 3"/><path d="M13.2 10.3L23 17.2l-3.3 1.2 2.1 4-2.5.9-2.2-3.5-2.9 2.6z" fill="currentColor" strokeWidth="1"/></svg></button>
                                <button className="ib" id="send" type="button" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg></button></div></div>
                    </div>

                    <div id="cursor"><svg viewBox="0 0 24 24"><path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.7 L11 13.5 L18 13.5 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round"/></svg></div>
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
