// Modal: colors, locks, font preview, regenerate, share, pictures
import { $, copy } from "./util.js";
import { S, persist, isSaved, toggleSave, shareURL } from "./storage.js";
import { regen } from "./palette.js";
import { getPhotos } from "./images.js";
import { dl } from "./export.js";
import { render } from "./app.js"; // circular on purpose: only called at runtime
let M=null;
const lockI=l=>l?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2zm-8-2a3 3 0 0 1 6 0v2H9V7z"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 7.5-2"/></svg>';
let LF=null;
export function openM(p){LF=document.activeElement;M=p.source=="curated"?{...p,c:[...p.c],l:[...p.l]}:p;S.work=M;$("modal").classList.remove("hidden");document.body.style.overflow="hidden";drawM()}
function closeM(){$("modal").classList.add("hidden");document.body.style.overflow="";M=null;if(LF&&LF.isConnected)LF.focus()}
function drawM(pics){const p=M,[hf,bf]=p.fonts,ready=document.fonts.check(`600 24px "${hf}"`)&&document.fonts.check(`400 16px "${bf}"`);
 $("modal").innerHTML=`<div class="mo bg-white w-full min-h-full sm:min-h-0 sm:max-w-2xl mx-auto sm:my-auto rounded-none sm:rounded-3xl p-4 sm:p-6 pt-[max(1rem,env(safe-area-inset-top,0px))] relative" role="dialog" aria-modal="true" aria-label="${p.name}">
 <button id="x" class="absolute top-[max(0.75rem,env(safe-area-inset-top,0px))] right-3 w-11 h-11 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] flex items-center justify-center text-lg z-10" aria-label="Close">&times;</button>
 <div class="font-bold text-xl mb-4 pr-10">${p.name}</div>
 <div class="flex rounded-2xl overflow-hidden h-44 sm:h-52">${p.c.map((c,i)=>`<div class="flex-1 flex flex-col justify-between items-center py-3" style="background:${c}"><button data-lock="${i}" class="w-11 h-11 rounded-full bg-white/70 hover:bg-white flex items-center justify-center" aria-label="${p.l[i]?"Unlock":"Lock"} color ${c}" aria-pressed="${p.l[i]}">${lockI(p.l[i])}</button><button data-hex="${c}" class="text-[11px] sm:text-xs font-semibold bg-white/70 hover:bg-white rounded-full px-2 min-h-[44px]">${c}</button></div>`).join("")}</div>
 <div id="fp" class="mt-6 ${ready?"":"sk sk-t rounded-xl"}"><div style="font-family:'${hf}';font-weight:600" class="text-2xl sm:text-3xl leading-tight">Hello, This is Your Heading</div>
 <div style="font-family:'${bf}'" class="mt-2 text-base text-neutral-700">This is your body text with this palette.</div>
 <div class="mt-3 text-xs text-neutral-500">Heading: ${hf} &nbsp;/&nbsp; Body: ${bf}</div></div>
 <div class="flex flex-wrap gap-2 mt-6">
 <button id="mRe" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Regenerate</button>
 <button id="mCp" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Copy Hex</button>
 <button id="mDl" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Download Image</button>
 <button id="mSh" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Share Link</button>
 <button id="mFp" class="h-11 px-5 rounded-full bg-black text-white text-sm font-semibold">Find Pictures</button>
 <button id="mSv" class="h-11 px-5 rounded-full text-white text-sm font-semibold ${isSaved(p)?"bg-black":"bg-[#E60023]"}">${isSaved(p)?"Saved":"Save"}</button></div>
 ${pics?`<div class="columns-2 mt-6" style="column-gap:16px">${(pics==="loading"?[220,160,200,240].map(h=>`<div class="sk rounded-2xl mb-4 break-inside-avoid" style="height:${h}px"></div>`):pics.map(s=>`<div class="sk rounded-2xl mb-4 break-inside-avoid overflow-hidden" style="min-height:180px"><img src="${s.u}" data-fb="${s.fb}" onerror="this.onerror=null;this.src=this.dataset.fb" onload="this.classList.remove('opacity-0');this.parentNode.classList.remove('sk')" loading="lazy" alt="Inspiration photo for ${p.name}" class="opacity-0 transition-opacity duration-500 w-full block"></div>`)).join("")}</div>`:""}</div>`;
 const ae=document.activeElement,sel=ae&&(ae.id?"#"+ae.id:ae.dataset&&ae.dataset.lock!=null?`[data-lock="${ae.dataset.lock}"]`:null);
 const m=$("modal");m.onclick=e=>{if(e.target===m||e.target.id=="x")closeM()};
 m.querySelectorAll("[data-lock]").forEach(b=>b.onclick=()=>{p.l[+b.dataset.lock]=!p.l[+b.dataset.lock];if(isSaved(p)){S.saved.find(s=>s.id==p.id).l=[...p.l];persist()}drawM(pics)});
 m.querySelectorAll("[data-hex]").forEach(b=>b.onclick=()=>copy(b.dataset.hex));
 $("mRe").onclick=()=>{regen(p);if(isSaved(p)){Object.assign(S.saved.find(s=>s.id==p.id),{c:[...p.c],name:p.name});persist()}drawM(pics);render()};
 $("mCp").onclick=()=>copy(p.c.join(", "));
 $("mDl").onclick=()=>dl(p);
 $("mSh").onclick=()=>copy(shareURL(p));
 $("mFp").onclick=async()=>{drawM("loading");$("modal").scrollTo({top:9999,behavior:"smooth"});const ph=await getPhotos(p);if(M===p){drawM(ph);$("modal").scrollTo({top:9999,behavior:"smooth"})}};
 $("mSv").onclick=()=>{toggleSave(p);drawM(pics);render()};
 if(!ready)Promise.all([document.fonts.load(`600 24px "${hf}"`),document.fonts.load(`400 16px "${bf}"`)]).catch(()=>{}).then(()=>{const f=$("fp");if(f&&M===p)f.classList.remove("sk","sk-t","rounded-xl")});
 (sel&&m.querySelector(sel)||$("x")).focus({preventScroll:true})}
document.addEventListener("keydown",e=>{if(e.key=="Escape"){$("pv").classList.add("hidden");if(M)closeM()}
 if(e.key=="Tab"&&M&&$("pv").classList.contains("hidden")){const f=[...$("modal").querySelectorAll("button,a[href]")];if(!f.length)return;const a=f[0],z=f[f.length-1];if(!$("modal").contains(document.activeElement)){e.preventDefault();a.focus()}else if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
