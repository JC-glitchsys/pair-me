// App state, saved palettes (localStorage), share links
import { toast } from "./util.js";
import { FP } from "./data.js";
import { CURATED } from "./palettes.js";
import { moodsOf } from "./mood.js";
export const S={count:3,pastel:false,tab:"home",src:"curated",cat:"All",mood:"All",g:{base:"",harmony:"any"},sort:"newest",q:"",pals:[],saved:[]};
try{const raw=localStorage.getItem("pairme_saved_v2")??localStorage.getItem("pm_saved")??"[]",seen=new Set();S.saved=JSON.parse(raw).map(norm).filter(p=>p&&p.id&&!seen.has(p.id)&&seen.add(p.id));if(!localStorage.getItem("pairme_saved_v2")){localStorage.setItem("pairme_saved_v2",JSON.stringify(S.saved));localStorage.removeItem("pm_saved")}}catch(e){} // v2 key; migrates and de-duplicates the old pm_saved key
export function persist(){try{localStorage.setItem("pairme_saved_v2",JSON.stringify(S.saved))}catch(e){}}
export const isSaved=p=>S.saved.some(s=>s.id===p.id);
export const find=id=>S.pals.find(p=>p.id==id)||S.saved.find(p=>p.id==id)||CURATED.find(p=>p.id==id);
export function toggleSave(p){if(isSaved(p)){S.saved=S.saved.filter(s=>s.id!=p.id);toast("Removed from Saved")}else{S.saved.unshift(JSON.parse(JSON.stringify(p)));toast("Saved")}persist()}
export const shareURL=p=>location.href.split("#")[0]+(p.source=="curated"?"#id="+p.id:"#p="+p.c.map(x=>x.slice(1)).join("-")+"&f="+Math.max(0,FP.findIndex(x=>x[0]==p.fonts[0]&&x[1]==p.fonts[1]))+"&n="+encodeURIComponent(p.name));
export function fromHash(){const mi=location.hash.match(/^#id=(pm-\d{3})$/);if(mi)return CURATED.find(x=>x.id==mi[1])||null;const m=location.hash.match(/^#p=([0-9a-fA-F-]+)&f=(\d+)&n=(.*)$/);if(!m)return null;const c=m[1].split("-");if(c.length<2||c.length>5||c.some(x=>!/^[0-9a-fA-F]{6}$/.test(x))||+m[2]>=FP.length)return null;let n="Shared Palette";try{n=decodeURIComponent(m[3]).replace(/[^A-Za-z ]/g,"").slice(0,30)||n}catch(e){}return{id:"s"+Math.random().toString(36).slice(2),name:n,c:c.map(x=>"#"+x.toUpperCase()),l:c.map(()=>false),moods:moodsOf(c.map(x=>"#"+x.toUpperCase())),fonts:FP[+m[2]],category:"Pastel",source:"generated",n:0,h:220}}
export function norm(p){return{...p,moods:p.moods||moodsOf(p.c),fonts:p.fonts||FP[p.f]||FP[0],category:p.category||"Pastel",source:p.source||"generated",n:p.n||0}}
