// Entry: hero, filters, grid rendering, search, startup
import { $, P, copy, ink } from "./util.js";
import { S, isSaved, find, toggleSave, fromHash } from "./storage.js";
import { FP } from "./data.js";
import { CURATED, CATEGORIES } from "./palettes.js";
import { MOODS } from "./mood.js";
import { mk } from "./palette.js";
import { openM } from "./modal.js";
export function gen(carry){const L=carry?[...new Set([...S.pals,...S.saved,S.work].filter(Boolean).flatMap(p=>p.c.filter((_,i)=>p.l[i])))].slice(0,S.count):[];S.pals=Array.from({length:12},()=>mk(L));render(true)}
const pill=(a,v,t,on)=>`<button data-${a}="${v}" aria-pressed="${on}" class="shrink-0 h-11 px-4 rounded-full text-sm font-semibold transition ${on?"bg-black text-white":"bg-[#EFEFEF] text-black hover:bg-[#e2e2e2]"}">${t}</button>`;
const sel=(id,label,opts,val,def)=>`<select id="${id}" aria-label="${label}" class="sel h-11 rounded-full px-4 text-sm font-semibold ${val!=def?"sel-on":""}">${opts.map(([v,t])=>`<option value="${v}"${v==val?" selected":""}>${t}</option>`).join("")}</select>`;
function pills(){const g=S.src=="generated";
 $("filters").innerHTML=`<div class="flex flex-wrap items-center gap-2">${[["curated","Curated"],["generated","Generated"]].map(([v,t])=>pill("src",v,t,S.src==v)).join("")}<span class="w-px h-6 bg-[#E0E0E0] mx-1"></span>${g?"":sel("fCat","Category",[["All","All categories"],...CATEGORIES.map(c=>[c,c])],S.cat,"All")}${sel("fMood","Mood",[["All","Any mood"],...MOODS.map(m=>[m,m])],S.mood,"All")}${sel("fSort","Sort",[["newest","Newest"],["az","A-Z"],...(S.sort=="shuffle"?[["shuffle","Shuffled"]]:[])],S.sort,"newest")}${pill("shuf",1,"Shuffle",false)}${g?pill("fonts",1,"Shuffle Fonts",false):""}</div>`}
const card=(p,i,anim)=>{const on=isSaved(p);return`<div class="card group relative mb-4 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-white ${anim?"fade":""}" style="animation-delay:${Math.min(i,12)*40}ms" data-id="${p.id}" data-cat="${p.category}" data-m=",${p.moods.join(",").toLowerCase()}," data-s="${[p.name,p.category,p.moods.join(" "),p.fonts.join(" "),p.c.join(" "),p.c.map(x=>x.slice(1)).join(" ")].join(" ").toLowerCase()}" role="button" tabindex="0" aria-label="Open palette ${p.name}">
 <div class="relative flex flex-col" style="height:${p.h}px">${p.c.map(c=>`<div class="flex-1 flex items-end px-3 pb-2" style="background:${c}"><span data-hex="${c}" style="color:${ink(c)}" class="py-2 text-[11px] font-medium opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition">${c}</span></div>`).join("")}
 <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
 <button data-save="${p.id}" aria-label="${on?"Unsave":"Save"} ${p.name}" class="absolute top-3 right-3 h-11 px-4 rounded-full text-sm font-semibold text-white ${on?"bg-black":"bg-[#E60023] hover:bg-[#ad081b]"} opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 [@media(hover:none)]:opacity-100 transition">${on?"Saved":"Save"}</button></div>
 <div class="px-1 pt-2 pb-1"><div class="flex justify-between gap-2"><div class="font-bold text-sm">${p.name}</div><div class="text-[11px] text-neutral-400 whitespace-nowrap">${p.category}</div></div><div class="text-xs text-neutral-500">${p.fonts.join(" + ")}</div></div></div>`};
// Full render: only when the list itself changes (source, sort, count, tab). Search and category only toggle visibility.
export function render(anim){pills();const home=S.tab=="home";$("filters").style.display=home?"flex":"none";$("hero").style.display=home?"":"none";$("tabSaved").style.background=home?"":"#EFEFEF";
 const list=[...(home?(S.src=="curated"?CURATED:S.pals):S.saved)];
 if(S.sort=="az")list.sort((a,b)=>a.name.localeCompare(b.name));else if(S.sort=="shuffle")list.sort(()=>Math.random()-.5);else if(home)list.sort((a,b)=>b.n-a.n);
 const t=document.createElement("template");t.innerHTML=list.map((p,i)=>card(p,i,anim)).join("");$("grid").replaceChildren(t.content);applyFilter()}
function applyFilter(){const q=S.q.trim().toLowerCase().replace(/^#/,""),cur=S.tab=="home"&&S.src=="curated";let n=0;
 for(const c of $("grid").children){const ok=(!q||c.dataset.s.includes(q))&&(!cur||S.cat=="All"||c.dataset.cat==S.cat)&&(S.tab!="home"||S.mood=="All"||c.dataset.m.includes(","+S.mood.toLowerCase()+","));c.hidden=!ok;if(ok)n++}
 const none=S.tab=="saved"&&!S.saved.length;$("empty").classList.toggle("hidden",n>0);
 $("emptyT").textContent=none?"No saved palettes yet":"No palettes found";$("emptyP").textContent=none?"Save a palette and it will show up here.":"Try a different search or clear your filters.";
 $("emptyB").textContent=none?"Browse palettes":"Clear filters";$("emptyB").dataset.a=none?"browse":"clear"}
const toGrid=()=>$("filters").scrollIntoView({behavior:"smooth"});
function paint(b,p){const on=isSaved(p);b.textContent=on?"Saved":"Save";b.setAttribute("aria-label",(on?"Unsave ":"Save ")+p.name);b.classList.toggle("bg-black",on);b.classList.toggle("bg-[#E60023]",!on);b.classList.toggle("hover:bg-[#ad081b]",!on)}
$("grid").onclick=e=>{const hx=e.target.closest("[data-hex]");if(hx){copy(hx.dataset.hex);return}const sb=e.target.closest("[data-save]");if(sb){const p=find(sb.dataset.save);toggleSave(p);S.tab=="saved"?render():paint(sb,p);return}const c=e.target.closest(".card");if(c)openM(find(c.dataset.id))};
$("grid").onkeydown=e=>{if((e.key=="Enter"||e.key==" ")&&e.target.classList.contains("card")){e.preventDefault();openM(find(e.target.dataset.id))}};
$("filters").onclick=e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset;
 if(d.src){S.src=d.src;S.src=="generated"&&!S.pals.length?gen():render(true)}
 else if(d.shuf){S.sort="shuffle";render(true)}
 else if(d.fonts){S.pals.forEach(p=>p.fonts=P(FP));render(true)}};
$("filters").onchange=e=>{const t=e.target,id=t.id;if(id=="fCat"){S.cat=t.value;pills();applyFilter()}else if(id=="fMood"){S.mood=t.value;pills();applyFilter()}else if(id=="fSort"){S.sort=t.value;render(true)}else return;$(id)&&$(id).focus()};
$("gen").onclick=()=>{S.tab="home";S.src="generated";gen(true);toGrid()};
$("heroGen").onclick=()=>$("gen").click();
$("heroExplore").onclick=toGrid;
$("tabSaved").onclick=()=>{S.tab=S.tab=="saved"?"home":"saved";render(true)};
$("logo").onclick=()=>{S.tab="home";render(true)};
$("emptyB").onclick=()=>{if($("emptyB").dataset.a=="browse"){S.tab="home";render(true)}else{S.q="";S.cat="All";S.mood="All";$("q").value="";pills();applyFilter()}};
let tm;$("q").oninput=e=>{clearTimeout(tm);tm=setTimeout(()=>{S.q=e.target.value;applyFilter()},250)};
window.addEventListener("hashchange",()=>{const sp=fromHash();if(sp)openM(sp)});
$("sTog").onclick=()=>{const o=$("sWrap").classList.toggle("hidden");$("sTog").setAttribute("aria-expanded",String(!o));if(!o)$("q").focus()};
$("hero").hidden=false;$("heroSk").remove();
const HZ=[["any","Any"],["analogous","Analogous"],["complementary","Complementary"],["triadic","Triadic"],["split","Split"],["tetradic","Tetradic"],["mono","Monochrome"]];
const gMark=()=>$("gdot").classList.toggle("hidden",!(S.g.base||S.g.harmony!="any"));
function drawG(){const g=S.g,ae=document.activeElement,k=ae&&ae.closest&&ae.closest("#gpanel")?[ae.dataset.gh&&`[data-gh="${ae.dataset.gh}"]`,ae.dataset.gc&&`[data-gc="${ae.dataset.gc}"]`,"gp" in ae.dataset&&"[data-gp]"].find(Boolean):null;
 $("gpanel").innerHTML=`<div class="flex items-center justify-between"><h2 class="font-bold text-lg">Customize Generate</h2><button data-gx aria-label="Close" class="w-11 h-11 -mr-2 rounded-full hover:bg-[#EFEFEF] text-xl">&times;</button></div>
 <div class="mt-3 text-xs font-semibold tracking-wide text-neutral-500">BASE COLOR</div>
 <div class="mt-2 flex items-center gap-3"><input id="gBase" type="color" aria-label="Base color" value="${(g.base||"#FFC8DD").toLowerCase()}" class="w-11 h-11 rounded-full border-0 p-0 bg-transparent cursor-pointer"><span id="gLab" class="text-sm font-semibold">${g.base||"Random"}</span>${g.base?`<button data-gr class="ml-auto h-11 px-4 rounded-full bg-[#EFEFEF] text-sm font-semibold">Random</button>`:""}</div>
 <div class="mt-4 text-xs font-semibold tracking-wide text-neutral-500">HARMONY</div>
 <div class="mt-2 flex flex-wrap gap-2">${HZ.map(([v,t])=>pill("gh",v,t,g.harmony==v)).join("")}</div>
 <div class="mt-4 text-xs font-semibold tracking-wide text-neutral-500">COLORS</div>
 <div class="mt-2 flex flex-wrap gap-2">${[2,3,4,5].map(n=>pill("gc",n,n,S.count==n)).join("")}${pill("gp",1,"Pastel only",S.pastel)}</div>
 <button data-gg class="mt-5 w-full h-12 rounded-full bg-black text-white text-sm font-semibold">Generate</button>`;
 gMark();if(k){const el=$("gpanel").querySelector(k);el&&el.focus()}}
function gOpen(o){$("gpanel").classList.toggle("hidden",!o);$("gback").classList.toggle("hidden",!o);$("gset").setAttribute("aria-expanded",String(o));if(o){drawG();$("gpanel").querySelector("button").focus()}else $("gset").focus()}
$("gset").onclick=()=>gOpen($("gpanel").classList.contains("hidden"));
$("gback").onclick=()=>gOpen(false);
$("gpanel").onclick=e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset;
 if("gx" in d)gOpen(false);else if("gr" in d){S.g.base="";drawG()}else if(d.gh){S.g.harmony=d.gh;drawG()}else if(d.gc){S.count=+d.gc;drawG()}else if("gp" in d){S.pastel=!S.pastel;drawG()}else if("gg" in d){gOpen(false);$("gen").click()}};
$("gpanel").oninput=e=>{if(e.target.id=="gBase"){S.g.base=e.target.value.toUpperCase();$("gLab").textContent=S.g.base;gMark()}};
$("gpanel").onchange=e=>{if(e.target.id=="gBase")drawG()};
document.addEventListener("keydown",e=>{if(e.key=="Escape"&&!$("gpanel").classList.contains("hidden"))gOpen(false)});
// Hero: live palette strip that cycles through curated palettes
const pool=CURATED.filter(p=>p.c.length>=4),lum=x=>[1,3,5].reduce((s,i,k)=>s+parseInt(x.slice(i,i+2),16)*[.299,.587,.114][k],0)/255;
let hi=Math.floor(Math.random()*pool.length),hp;
function heroLive(){hp=pool[hi%pool.length];const bl=$("hStrip").children;for(let k=0;k<5;k++){const b=bl[k],c=hp.c[k];if(c){b.style.flexGrow=1;b.style.backgroundColor=c;b.style.color=ink(c);b.textContent=c}else{b.style.flexGrow=0;b.textContent=""}}
 const hl=hp.c.filter(x=>lum(x)>.62&&lum(x)<.93).sort((x,y)=>lum(x)-lum(y))[0]||"#FFC8DD";$("hero").style.setProperty("--hl",hl);$("hCap").textContent=hp.name+"  ·  "+hp.fonts.join(" + ")}
$("hStrip").onclick=()=>openM(hp);
heroLive();if(!matchMedia("(prefers-reduced-motion: reduce)").matches)setInterval(()=>{if(!document.hidden&&S.tab=="home"){hi++;heroLive()}},3800);
render(true);
{const sp=fromHash();if(sp)openM(sp)}
