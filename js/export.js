// Download palette + font pairing as PNG
import { $ } from "./util.js";
export async function dl(p){const[hf,bf]=p.fonts;try{await document.fonts.load(`600 48px "${hf}"`);await document.fonts.load(`400 26px "${bf}"`)}catch(e){}
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
