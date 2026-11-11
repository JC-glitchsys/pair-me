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
function pills(){const r1=[["curated","Curated"],["generated","Generated"]].map(([v,t])=>pill("src",v,t,S.src==v)).join("")+'<span class="w-px bg-[#EFEFEF] mx-1 shrink-0"></span>'+[["newest","Newest"],["az","A-Z"],["shuffle","Shuffle"]].map(([v,t])=>pill("sort",v,t,S.sort==v&&v!="shuffle")).join("");
 const r2=S.src=="curated"?["All",...CATEGORIES].map(c=>pill("cat",c,c,S.cat==c)).join(""):[2,3,4,5].map(n=>pill("count",n,n+" Colors",S.count==n)).join("")+pill("pastel",1,"Pastel",S.pastel)+pill("fonts",1,"Shuffle Fonts",false);
 const r3=["All",...MOODS].map(m=>pill("mood",m,m=="All"?"Any mood":m,S.mood==m)).join("");
 $("filters").innerHTML=`${[r1,r2,r3].map(r=>`<div class="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">${r}</div>`).join("")}`}
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
 else if(d.cat){S.cat=d.cat;pills();applyFilter()}
 else if(d.mood){S.mood=d.mood;pills();applyFilter()}
 else if(d.sort){S.sort=d.sort;render(true)}
 else if(d.count){S.count=+d.count;gen()}
 else if(d.pastel){S.pastel=!S.pastel;gen()}
 else if(d.fonts){S.pals.forEach(p=>p.fonts=P(FP));render(true)}};
$("gen").onclick=()=>{S.tab="home";S.src="generated";gen(true);toGrid()};
$("heroGen").onclick=()=>$("gen").click();
$("heroExplore").onclick=toGrid;
$("tabSaved").onclick=()=>{S.tab=S.tab=="saved"?"home":"saved";render(true)};
$("logo").onclick=()=>{S.tab="home";render(true)};
$("emptyB").onclick=()=>{if($("emptyB").dataset.a=="browse"){S.tab="home";render(true)}else{S.q="";S.cat="All";S.mood="All";$("q").value="";pills();applyFilter()}};
let tm;$("q").oninput=e=>{clearTimeout(tm);tm=setTimeout(()=>{S.q=e.target.value;applyFilter()},250)};
window.addEventListener("hashchange",()=>{const sp=fromHash();if(sp)openM(sp)});
$("sTog").onclick=()=>{const o=$("sWrap").classList.toggle("hidden");$("sTog").setAttribute("aria-expanded",String(!o));if(!o)$("q").focus()};
$("hero").hidden=false;$("hero").classList.add("fade");$("heroSk").remove();
render(true);
{const sp=fromHash();if(sp)openM(sp)}
