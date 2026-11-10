const S={count:3,pastel:false,tab:"home",q:"",pals:[],saved:[]};
try{S.saved=JSON.parse(localStorage.getItem("pm_saved")||"[]")}catch(e){}
const $=id=>document.getElementById(id), R=(a,b)=>a+Math.random()*(b-a), P=a=>a[Math.floor(Math.random()*a.length)];
function hex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,"0")};return("#"+f(0)+f(8)+f(4)).toUpperCase()}
const rc=f=>hex(f.h+R(-8,8),R(55,85),S.pastel?R(88,94):R(80,90));
function mk(L){const f1=P(FAM),f2=P(FAM),c=[],l=[];for(let i=0;i<S.count;i++){if(L&&L[i]){c.push(L[i]);l.push(true)}else{c.push(rc(i==0?f1:P([f1,f2])));l.push(false)}}return{id:Math.random().toString(36).slice(2),name:P(f1.n),c,l,f:Math.floor(Math.random()*FP.length),h:Math.round(R(170,290))}}
function gen(carry){const L=carry?[...new Set([...S.pals,...S.saved].flatMap(p=>p.c.filter((_,i)=>p.l[i])))].slice(0,S.count):[];S.pals=Array.from({length:12},()=>mk(L));render(true)}
function persist(){try{localStorage.setItem("pm_saved",JSON.stringify(S.saved))}catch(e){}}
const isSaved=p=>S.saved.some(s=>s.id===p.id);
function toast(t){const e=$("toast");e.textContent=t;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1600)}
function copy(t){const done=()=>toast("Copied");try{navigator.clipboard.writeText(t).then(done,fb)}catch(e){fb()}function fb(){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();done()}}
function match(p){const q=S.q.trim().toLowerCase().replace("#","");if(!q)return true;return[p.name,...p.c,...FP[p.f]].join(" ").toLowerCase().replace(/#/g,"").includes(q)}
function pills(){const items=["2 Colors","3 Colors","4 Colors","5 Colors","Pastel","Shuffle Fonts"];$("filters").innerHTML=items.map((t,i)=>{const on=i<4?S.count==i+2:(i==4&&S.pastel);return`<button data-p="${i}" class="shrink-0 h-10 px-4 rounded-full text-sm font-semibold transition ${on?"bg-black text-white":"bg-[#EFEFEF] text-black hover:bg-[#e2e2e2]"}">${t}</button>`}).join("")}
function render(anim){pills();$("filters").style.display=S.tab=="home"?"flex":"none";$("tabSaved").style.background=S.tab=="saved"?"#EFEFEF":"";
 const list=(S.tab=="home"?S.pals:S.saved).filter(match);
 $("grid").innerHTML=list.map((p,i)=>`<div class="card group relative mb-4 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-white ${anim?"fade":""}" style="animation-delay:${i*40}ms" data-id="${p.id}">
 <div class="relative flex flex-col" style="height:${p.h}px">${p.c.map(c=>`<div class="flex-1 flex items-end px-3 pb-2" style="background:${c}"><span class="text-[11px] font-medium text-black/70 opacity-0 group-hover:opacity-100 transition">${c}</span></div>`).join("")}
 <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
 <button data-save="${p.id}" class="absolute top-3 right-3 h-9 px-4 rounded-full text-sm font-semibold text-white ${isSaved(p)?"bg-black":"bg-[#E60023] hover:bg-[#ad081b]"} opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition">${isSaved(p)?"Saved":"Save"}</button></div>
 <div class="px-1 pt-2 pb-1"><div class="font-bold text-sm">${p.name}</div><div class="text-xs text-neutral-500">${FP[p.f].join(" + ")}</div></div></div>`).join("");
 $("empty").classList.toggle("hidden",list.length>0);$("empty").textContent=S.tab=="saved"?"No saved palettes match.":"No palettes match your search."}
const find=id=>S.pals.find(p=>p.id==id)||S.saved.find(p=>p.id==id);
function toggleSave(p){if(isSaved(p))S.saved=S.saved.filter(s=>s.id!=p.id);else S.saved.unshift(JSON.parse(JSON.stringify(p)));persist()}
$("grid").onclick=e=>{const sb=e.target.closest("[data-save]");if(sb){toggleSave(find(sb.dataset.save));render();return}const c=e.target.closest(".card");if(c)openM(find(c.dataset.id))};
$("filters").onclick=e=>{const b=e.target.closest("[data-p]");if(!b)return;const i=+b.dataset.p;if(i<4){S.count=i+2;gen()}else if(i==4){S.pastel=!S.pastel;gen()}else{S.pals.forEach(p=>p.f=Math.floor(Math.random()*FP.length));render(true)}};
$("gen").onclick=()=>{S.tab="home";gen(true);window.scrollTo({top:0,behavior:"smooth"})};
$("tabSaved").onclick=()=>{S.tab=S.tab=="saved"?"home":"saved";render(true)};
$("logo").onclick=()=>{S.tab="home";render(true)};
$("q").oninput=e=>{S.q=e.target.value;render()};
let M=null;
const lockI=l=>l?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2zm-8-2a3 3 0 0 1 6 0v2H9V7z"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 7.5-2"/></svg>';
function openM(p){M=p;$("modal").classList.remove("hidden");document.body.style.overflow="hidden";drawM()}
function closeM(){$("modal").classList.add("hidden");document.body.style.overflow="";M=null}
function drawM(pics){const p=M,[hf,bf]=FP[p.f];
 $("modal").innerHTML=`<div class="mo bg-white rounded-3xl max-w-2xl mx-auto my-4 p-4 sm:p-6 relative">
 <button id="x" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] flex items-center justify-center text-lg z-10" aria-label="Close">&times;</button>
 <div class="font-bold text-xl mb-4 pr-10">${p.name}</div>
 <div class="flex rounded-2xl overflow-hidden h-44 sm:h-52">${p.c.map((c,i)=>`<div class="flex-1 flex flex-col justify-between items-center py-3" style="background:${c}"><button data-lock="${i}" class="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center" aria-label="Lock color">${lockI(p.l[i])}</button><button data-hex="${c}" class="text-xs font-semibold bg-white/70 hover:bg-white rounded-full px-2.5 py-1">${c}</button></div>`).join("")}</div>
 <div class="mt-6"><div style="font-family:'${hf}';font-weight:600" class="text-2xl sm:text-3xl leading-tight">Hello, This is Your Heading</div>
 <div style="font-family:'${bf}'" class="mt-2 text-base text-neutral-700">This is your body text with this palette.</div>
 <div class="mt-3 text-xs text-neutral-500">Heading: ${hf} &nbsp;/&nbsp; Body: ${bf}</div></div>
 <div class="flex flex-wrap gap-2 mt-6">
 <button id="mRe" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Regenerate</button>
 <button id="mCp" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Copy Hex</button>
 <button id="mDl" class="h-11 px-5 rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">Download Image</button>
 <button id="mFp" class="h-11 px-5 rounded-full bg-black text-white text-sm font-semibold">Find Pictures</button>
 <button id="mSv" class="h-11 px-5 rounded-full text-white text-sm font-semibold ${isSaved(p)?"bg-black":"bg-[#E60023]"}">${isSaved(p)?"Saved":"Save"}</button></div>
 ${pics?`<div class="columns-2 mt-6" style="column-gap:16px">${pics.map(s=>`<img src="${s}" alt="" class="w-full rounded-2xl mb-4 break-inside-avoid fade">`).join("")}</div>`:""}</div>`;
 const m=$("modal");m.onclick=e=>{if(e.target===m||e.target.id=="x")closeM()};
 m.querySelectorAll("[data-lock]").forEach(b=>b.onclick=()=>{p.l[+b.dataset.lock]=!p.l[+b.dataset.lock];if(isSaved(p)){S.saved.find(s=>s.id==p.id).l=[...p.l];persist()}drawM(pics)});
 m.querySelectorAll("[data-hex]").forEach(b=>b.onclick=()=>copy(b.dataset.hex));
 $("mRe").onclick=()=>{p.c=p.c.map((c,i)=>p.l[i]?c:rc(P(FAM)));if(isSaved(p)){Object.assign(S.saved.find(s=>s.id==p.id),{c:[...p.c]});persist()}drawM(pics);render()};
 $("mCp").onclick=()=>copy(p.c.join(", "));
 $("mDl").onclick=()=>dl(p);
 $("mFp").onclick=()=>{drawM([0,1,2,3].map(k=>scene(p.c,k)));$("modal").scrollTo({top:9999,behavior:"smooth"})};
 $("mSv").onclick=()=>{toggleSave(p);drawM(pics);render()}}
function scene(c,k){const H=[560,440,500,620][k],W=400,r=()=>Math.round(R(0,1)*100)/100,o=i=>c[i%c.length];let b="";
 if(k==0)b=`<circle cx="${R(100,300)}" cy="${R(120,220)}" r="${R(70,110)}" fill="${o(1)}"/><circle cx="${R(100,300)}" cy="${R(320,460)}" r="${R(50,90)}" fill="${o(2)}" opacity=".85"/>`;
 else if(k==1)b=[0,1,2].map(i=>`<path d="M${40+i*110} ${H} V${H-R(160,260)} a50 50 0 0 1 100 0 V${H}z" fill="${o(i+1)}"/>`).join("");
 else if(k==2)b=[0,1,2,3].map(i=>`<path d="M0 ${130+i*100} Q100 ${90+i*100} 200 ${130+i*100} T400 ${130+i*100} V${H} H0z" fill="${o(i)}" opacity=".9"/>`).join("");
 else b=[0,1,2,3,4].map(i=>`<rect x="${R(-20,260)}" y="${i*120+10}" width="${R(120,240)}" height="80" rx="40" fill="${o(i)}"/>`).join("");
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o(0)}"/><stop offset="1" stop-color="${o(2)}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="${k==3?o(1):"url(#g)"}"/>${b}</svg>`;
 return"data:image/svg+xml;utf8,"+encodeURIComponent(svg)}
async function dl(p){const[hf,bf]=FP[p.f];try{await document.fonts.load(`600 48px "${hf}"`);await document.fonts.load(`400 26px "${bf}"`)}catch(e){}
 const W=1200,H=800,cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");
 const rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)};
 x.fillStyle="#fff";rr(0,0,W,H,48);x.fill();
 x.save();rr(48,48,1104,400,32);x.clip();const bw=1104/p.c.length;
 p.c.forEach((c,i)=>{x.fillStyle=c;x.fillRect(48+i*bw,48,bw+1,400);x.fillStyle="rgba(0,0,0,.7)";x.font="600 24px Inter,sans-serif";x.fillText(c,48+i*bw+20,420)});x.restore();
 x.fillStyle="#111";x.font="700 34px Inter,sans-serif";x.fillText(p.name,56,520);
 x.font=`600 56px "${hf}",serif`;x.fillText("Hello, This is Your Heading",56,610);
 x.fillStyle="#444";x.font=`400 28px "${bf}",sans-serif`;x.fillText("This is your body text with this palette.",56,665);
 x.fillStyle="#767676";x.font="400 22px Inter,sans-serif";x.fillText(hf+" + "+bf,56,730);
 const url=cv.toDataURL("image/png"),n="pair-me-"+p.name.toLowerCase().replace(/\s+/g,"-")+".png";
 const a=document.createElement("a");a.href=url;a.download=n;document.body.appendChild(a);a.click();a.remove();
 const v=$("pv");v.classList.remove("hidden");v.innerHTML=`<div class="mo bg-white rounded-3xl p-4 max-w-xl w-full"><img src="${url}" class="w-full rounded-2xl" alt=""><div class="flex items-center justify-between mt-3 gap-2"><span class="text-xs text-neutral-500">Right-click or long-press the image to save it.</span><div class="flex gap-2"><a href="${url}" download="${n}" class="h-10 px-4 rounded-full bg-black text-white text-sm font-semibold flex items-center">Download</a><button id="pvx" class="h-10 px-4 rounded-full bg-[#EFEFEF] text-sm font-semibold">Close</button></div></div></div>`;
 v.onclick=e=>{if(e.target===v||e.target.id=="pvx")v.classList.add("hidden")}}
document.addEventListener("keydown",e=>{if(e.key=="Escape"){$("pv").classList.add("hidden");if(M)closeM()}});
gen();
