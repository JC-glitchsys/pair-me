// Small helpers: DOM shortcut, random, toast, clipboard

export const $=id=>document.getElementById(id), R=(a,b)=>a+Math.random()*(b-a), P=a=>a[Math.floor(Math.random()*a.length)];
export function toast(t){const e=$("toast");e.textContent=t;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1600)}
export function copy(t){const done=()=>toast(/^#[0-9A-Fa-f]{6}$/.test(t)?"Copied "+t.toUpperCase():"Copied");try{navigator.clipboard.writeText(t).then(done,fb)}catch(e){fb()}function fb(){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();done()}}
