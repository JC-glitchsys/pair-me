// Photo inspiration. Direct images.unsplash.com URLs (source.unsplash.com is dead and not used).
// Optional: set VITE_UNSPLASH_KEY (Unsplash Access Key) to search by palette name + category via the official API.
import { scene } from "./palette.js";
const KEY=import.meta.env?.VITE_UNSPLASH_KEY;
const U=id=>`https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;
const SEA=["1507525428034-b723cf961d3e","1518837695005-2083093ee35b","1475924156734-496f6cac6ec1"];
const LAND=["1441974231531-c6227db76b6e","1470071459604-3b5ec3a7fe05","1506744038136-46273834b3fb"];
const POOL={Coastal:SEA,Earthy:LAND,Vintage:LAND,Neutral:LAND,all:["1469474968028-56623f02e42e","1519681393784-d120267933ba","1500530855697-b586d89ba3ee","1501785888041-af3ef285b470"]};
const cache=new Map(); // palette id -> [{u, fb}]
export async function getPhotos(p){
 if(cache.has(p.id))return cache.get(p.id);
 let urls=[];
 if(KEY){try{const r=await fetch("https://api.unsplash.com/search/photos?per_page=4&orientation=portrait&query="+encodeURIComponent(p.name+" "+p.category),{headers:{Authorization:"Client-ID "+KEY}});urls=((await r.json()).results||[]).map(x=>x.urls.regular)}catch(e){}}
 const ids=[...new Set([...(POOL[p.category]||[]),...POOL.all])],o=[...p.id].reduce((a,ch)=>a+ch.charCodeAt(0),0);
 for(let k=urls.length;k<4;k++)urls.push(U(ids[(o+k)%ids.length]));
 const out=urls.slice(0,4).map((u,k)=>({u,fb:scene(p.c,k)}));cache.set(p.id,out);return out}
