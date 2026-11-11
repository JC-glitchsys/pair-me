// Design previews: the palette applied to a mobile UI, a website hero, a comic panel and a dashboard.
// Inline SVG (not <img>) so the palette's own Google Fonts render. Text colors always come from ink() so they stay readable.
import { ink } from "./util.js";
const lum=x=>[1,3,5].reduce((s,i,k)=>s+parseInt(x.slice(i,i+2),16)*[.299,.587,.114][k],0)/255;
export function roles(c){const s=[...c].sort((a,b)=>lum(a)-lum(b)),m=s.slice(1,-1);return{lo:s[0],hi:s[s.length-1],a:m[0]||s[0],b:m[1]||m[0]||s[0]}}
const T=(x,y,t,z,f,fill,w=400,e="")=>`<text x="${x}" y="${y}" font-family="'${f}',sans-serif" font-size="${z}" font-weight="${w}" fill="${fill}" ${e}>${t}</text>`;
const B=(x,y,w,h,r,f,e="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${e}/>`;
const star=(cx,cy,r1,r2,n)=>Array.from({length:n*2},(_,i)=>{const a=Math.PI*i/n,r=i%2?r1:r2;return(cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1)}).join(" ");
const svg=(w,h,l,body)=>`<svg viewBox="0 0 ${w} ${h}" class="w-full block" role="img" aria-label="${l}">${body}</svg>`;
function ui({lo,hi,a,b},hf,bf){const k=ink(hi);return svg(300,500,"Mobile app UI preview",B(0,0,300,500,0,hi)+T(24,60,"Good morning",13,bf,k)+T(24,92,"Plan your day",26,hf,k,600)
 +B(24,116,252,128,26,a)+T(46,152,"Today",12,bf,ink(a))+T(46,190,"3 new ideas",28,hf,ink(a),600)+B(46,208,96,10,5,ink(a),'opacity=".22"')
 +B(24,262,252,64,22,b)+T(46,300,"Daily notes",15,bf,ink(b),600)+B(24,338,252,52,26,lo)+T(150,370,"Continue",14,bf,ink(lo),600,'text-anchor="middle"')
 +B(24,414,252,56,28,hi,`stroke="${k}" stroke-opacity=".15"`)+`<circle cx="78" cy="442" r="9" fill="${a}"/><circle cx="150" cy="442" r="9" fill="${b}"/><circle cx="222" cy="442" r="9" fill="${lo}"/>`)}
function hero({lo,hi,a,b},hf,bf){const k=ink(hi);return svg(520,340,"Website hero preview",B(0,0,520,340,0,hi)+`<circle cx="40" cy="36" r="10" fill="${lo}"/>`+[64,112,160].map(x=>B(x,32,36,8,4,k,'opacity=".25"')).join("")
 +B(404,22,92,28,14,lo)+T(450,41,"Sign up",11,bf,ink(lo),600,'text-anchor="middle"')+T(40,128,"Make it feel",40,hf,k,600)+T(40,174,"like you.",40,hf,k,600)+T(40,208,"Beautiful pairings for every idea.",13,bf,k)
 +B(40,230,132,44,22,lo)+T(106,257,"Get started",13,bf,ink(lo),600,'text-anchor="middle"')+B(184,230,112,44,22,hi,`stroke="${k}" stroke-opacity=".3"`)+T(240,257,"Explore",13,bf,k,600,'text-anchor="middle"')
 +`<circle cx="410" cy="190" r="86" fill="${a}"/>`+B(360,200,120,100,28,b)+`<circle cx="440" cy="130" r="28" fill="${lo}"/>`)}
function comic({lo,hi,a,b},hf,bf){return svg(400,400,"Comic panel preview",`<defs><pattern id="hd" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3" fill="${b}"/></pattern></defs>`+B(0,0,400,400,0,a)+B(0,0,400,400,0,"url(#hd)",'opacity=".55"')
 +`<polygon points="${star(200,200,86,140,14)}" fill="${hi}" stroke="${lo}" stroke-width="6" stroke-linejoin="round"/>`+T(200,220,"POP!",64,hf,ink(hi),700,'text-anchor="middle"')
 +B(14,14,170,34,0,lo)+T(26,37,"MEANWHILE...",13,bf,ink(lo),700,'letter-spacing="1"')
 +`<polygon points="90,350 78,382 118,350" fill="${hi}" stroke="${lo}" stroke-width="4" stroke-linejoin="round"/>`+B(44,296,192,60,18,hi,`stroke="${lo}" stroke-width="4"`)+T(140,332,"Pair me up!",17,bf,ink(hi),600,'text-anchor="middle"')
 +`<rect x="3" y="3" width="394" height="394" fill="none" stroke="${lo}" stroke-width="6"/>`)}
function dash({lo,hi,a,b},hf,bf){const k=ink(hi),s=ink(lo);return svg(520,340,"Dashboard preview",B(0,0,520,340,0,hi)+B(0,0,96,340,0,lo)+`<circle cx="48" cy="40" r="12" fill="${s}"/>`+[86,112,138].map(y=>B(30,y,36,8,4,s,'opacity=".5"')).join("")
 +T(120,44,"Overview",20,hf,k,600)+T(120,62,"This week",11,bf,k,400,'opacity=".6"')
 +[[120,a,"Visitors","12.4k",120],[256,b,"Sales","3.2k",120],[392,lo,"Rating","4.9",104]].map(([x,c,t,v,w])=>B(x,80,w,70,18,c)+T(x+16,108,t,11,bf,ink(c))+T(x+16,136,v,22,hf,ink(c),600)).join("")
 +B(120,166,376,150,22,hi,`stroke="${k}" stroke-opacity=".15"`)+[60,90,50,110,80,100,70].map((h,i)=>B(144+i*48,296-h,28,h,8,[a,b,lo][i%3])).join(""))}
export function previews(p,hf,bf){const r=roles(p.c),q=encodeURIComponent,
 tiles=[["Mobile UI",ui],["Website hero",hero],["Comic panel",comic],["Dashboard",dash]].map(([t,f])=>`<figure class="mb-4 break-inside-avoid"><div class="rounded-2xl overflow-hidden border border-[#EFEFEF]">${f(r,hf,bf)}</div><figcaption class="mt-2 text-xs text-neutral-500">${t}</figcaption></figure>`).join(""),
 L=[["Dribbble","https://dribbble.com/colors/"+r.a.slice(1)],["Behance","https://www.behance.net/search/projects?search="+q(p.name+" ui design")],["Pinterest","https://www.pinterest.com/search/pins/?q="+q(p.name+" color palette website ui comic design")]];
 return`<div id="prev" class="mt-6"><div class="text-xs font-semibold tracking-wide text-neutral-500">DESIGN PREVIEWS</div><div class="columns-1 sm:columns-2 mt-3" style="column-gap:16px">${tiles}</div><div class="text-xs font-semibold tracking-wide text-neutral-500">FIND REAL REFERENCES</div><div class="mt-2 flex flex-wrap gap-2">${L.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener noreferrer" class="min-h-[44px] px-4 inline-flex items-center rounded-full bg-[#EFEFEF] hover:bg-[#e2e2e2] text-sm font-semibold">${t}</a>`).join("")}</div></div>`}
