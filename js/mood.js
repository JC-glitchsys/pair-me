// Mood tags derived from the colors themselves, so they work for curated, generated and future palettes.
export const MOODS=["Calm","Cozy","Energetic","Dreamy","Playful","Elegant","Fresh","Bold","Moody","Warm","Cool"];
function hcl(x){const r=parseInt(x.slice(1,3),16)/255,g=parseInt(x.slice(3,5),16)/255,b=parseInt(x.slice(5,7),16)/255,m=Math.max(r,g,b),n=Math.min(r,g,b),d=m-n;let h=0;if(d){h=m==r?((g-b)/d)%6:m==g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360}return[h,d,(m+n)/2]}
export function moodsOf(c){const v=c.map(hcl),avg=i=>v.reduce((a,x)=>a+x[i],0)/v.length,C=avg(1),L=avg(2),sat=v.filter(x=>x[1]>.12),k=sat.length||1,
 warm=sat.filter(x=>x[0]<70||x[0]>=330).length/k,cool=sat.filter(x=>x[0]>=150&&x[0]<270).length/k,fam=new Set(sat.map(x=>Math.floor(x[0]/60))).size,o=[];
 if(L>.78&&C<.35)o.push("Calm");
 if(L<.4)o.push("Moody");
 if(C>.6&&L>.35&&L<.8)o.push("Energetic");
 if(C>.7)o.push("Bold");
 if(sat.some(x=>x[0]>=260&&x[0]<340&&x[2]>.7))o.push("Dreamy");
 if(fam>=4&&C>.4)o.push("Playful");
 if((L<.45&&v.some(x=>x[0]>=35&&x[0]<60&&x[1]>.4))||(L<.5&&C<.35))o.push("Elegant");
 if(sat.some(x=>x[0]>=80&&x[0]<170&&x[2]>.45))o.push("Fresh");
 if(warm>=.6&&C<.5&&L>.3&&L<.85)o.push("Cozy");
 if(warm>=.6)o.push("Warm");
 if(cool>=.6)o.push("Cool");
 return o.length?o:["Calm"]}
