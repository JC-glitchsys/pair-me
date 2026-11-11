// Small helpers: DOM shortcut, random, toast, clipboard

export const $=id=>document.getElementById(id), R=(a,b)=>a+Math.random()*(b-a), P=a=>a[Math.floor(Math.random()*a.length)];
export function toast(t){const e=$("toast");e.textContent=t;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1600)}
export function copy(t,m){const done=()=>toast(m||(/^#[0-9A-Fa-f]{6}$/.test(t)?"Copied "+t.toUpperCase():"Copied"));try{navigator.clipboard.writeText(t).then(done,fb)}catch(e){fb()}function fb(){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();done()}}
export const ink=h=>{const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return(.299*v[0]+.587*v[1]+.114*v[2])/255>.62?"#111":"#fff"}; // readable text color on a swatch
