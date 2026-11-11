// Palette generation (min hue distance, dominant-color naming) and picture helpers
import { R, P } from "./util.js";
import { S } from "./storage.js";
import { FAM, FP } from "./data.js";
export function hex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,"0")};return("#"+f(0)+f(8)+f(4)).toUpperCase()}
export const dh=(a,b)=>{const d=Math.abs(a-b)%360;return Math.min(d,360-d)};
const light=x=>{const v=[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));return(Math.max(...v)+Math.min(...v))/510};
function pick(hs,h0){let h,t=0;do{h=(h0??P(FAM).h)+R(-8,8);t++}while(t<25&&hs.some(x=>dh(x,h)<25));return hex(h,R(55,85),S.pastel?R(88,94):R(80,90))}
export function nameOf(c){const d=c.reduce((a,b)=>light(b)<light(a)?b:a),h=hue(d);return P(FAM.reduce((a,b)=>dh(b.h,h)<dh(a.h,h)?b:a).n)}
function fill(c,l,h0){const hs=c.filter((_,i)=>l[i]).map(hue);return c.map((x,i)=>{if(l[i])return x;const n=pick(hs,i==0?h0:undefined);hs.push(hue(n));return n})}
export function mk(L=[]){const l=Array.from({length:S.count},(_,i)=>!!L[i]),c=fill(l.map((x,i)=>x?L[i]:""),l,P(FAM).h);return{id:Math.random().toString(36).slice(2),name:nameOf(c),c,l,fonts:P(FP),category:"Pastel",source:"generated",n:performance.now(),h:Math.round(R(170,290))}}
export function regen(p){p.c=fill(p.c,p.l);p.name=nameOf(p.c);if(p.source=="curated"){p.source="generated";p.id="g"+Math.random().toString(36).slice(2)}} // editing a curated palette makes it a generated one
export function scene(c,k){const H=[560,440,500,620][k],W=400,r=()=>Math.round(R(0,1)*100)/100,o=i=>c[i%c.length];let b="";
 if(k==0)b=`<circle cx="${R(100,300)}" cy="${R(120,220)}" r="${R(70,110)}" fill="${o(1)}"/><circle cx="${R(100,300)}" cy="${R(320,460)}" r="${R(50,90)}" fill="${o(2)}" opacity=".85"/>`;
 else if(k==1)b=[0,1,2].map(i=>`<path d="M${40+i*110} ${H} V${H-R(160,260)} a50 50 0 0 1 100 0 V${H}z" fill="${o(i+1)}"/>`).join("");
 else if(k==2)b=[0,1,2,3].map(i=>`<path d="M0 ${130+i*100} Q100 ${90+i*100} 200 ${130+i*100} T400 ${130+i*100} V${H} H0z" fill="${o(i)}" opacity=".9"/>`).join("");
 else b=[0,1,2,3,4].map(i=>`<rect x="${R(-20,260)}" y="${i*120+10}" width="${R(120,240)}" height="80" rx="40" fill="${o(i)}"/>`).join("");
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o(0)}"/><stop offset="1" stop-color="${o(2)}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="${k==3?o(1):"url(#g)"}"/>${b}</svg>`;
 return"data:image/svg+xml;utf8,"+encodeURIComponent(svg)}
export function hue(x){const r=parseInt(x.slice(1,3),16)/255,g=parseInt(x.slice(3,5),16)/255,b=parseInt(x.slice(5,7),16)/255,m=Math.max(r,g,b),n=Math.min(r,g,b),d=m-n;if(!d)return 0;const v=m==r?((g-b)/d)%6:m==g?(b-r)/d+2:(r-g)/d+4;return(v*60+360)%360}
