// Curated palettes. To add one, append a row to ROWS: [name, category, "HEX,HEX,HEX", heading font, body font]
// IDs are generated from the row position (pm-001, pm-002, ...). Never reorder or delete rows if people have saved palettes.
// Fonts must exist in the Google Fonts link in index.html. Scales to 100+ rows with no other change.
export const CATEGORIES=["Pastel","Minimalist","Earthy","Vintage","Romantic","Modern","Retro","Luxury","Coastal","Neutral"];
const ROWS=[
["Cotton Candy","Pastel","FFC8DD,FFAFCC,BDE0FE,A2D2FF","Playfair Display","Inter"],
["Mint Cream","Pastel","D8F3DC,B7E4C7,FFF1E6","DM Serif Display","DM Sans"],
["Lilac Haze","Pastel","E4D4F4,CDB4DB,FFC8DD","Fraunces","Work Sans"],
["Paper White","Minimalist","FAFAFA,E8E8E8,2B2B2B","Space Grotesk","Inter"],
["Quiet Grey","Minimalist","F2F2F2,CFCFCF,8A8A8A,1F1F1F","Montserrat","Lora"],
["Soft Linen","Minimalist","F7F3EE,E3DCD2,3A3A3A","Cormorant Garamond","Nunito"],
["Terracotta Clay","Earthy","CB997E,DDBEA9,FFE8D6,B7B7A4,A5A58D","Fraunces","DM Sans"],
["Forest Floor","Earthy","606C38,283618,FEFAE0,DDA15E,BC6C25","Lora","Poppins"],
["Dune","Earthy","E9D8A6,D4A373,A98467,6C584C","Playfair Display","Nunito"],
["Antique Rose","Vintage","D4A5A5,B5838D,6D597A","Cormorant Garamond","Lora"],
["Old Postcard","Vintage","F4E9CD,D9B382,A44A3F,4A5759","DM Serif Display","Work Sans"],
["Sepia Letters","Vintage","EDE0D4,E6CCB2,B08968,7F5539","Playfair Display","Lora"],
["Rose Petal","Romantic","FFE5EC,FFC2D1,FF8FAB,FB6F92","Playfair Display","Raleway"],
["Blush Evening","Romantic","FADADD,F4B6C2,C08497","Cormorant Garamond","Poppins"],
["Love Letter","Romantic","FFF0F3,FFB3C6,FF758F,A4133C","DM Serif Display","Inter"],
["Studio Blue","Modern","EDF2FB,B6CCFE,4361EE,1B1F3B","Space Grotesk","Inter"],
["Mono Teal","Modern","F0F7F7,A8DADC,457B9D,1D3557","Montserrat","Work Sans"],
["Graphite","Modern","F1F3F5,ADB5BD,495057","Poppins","DM Sans"],
["Sunset Diner","Retro","FFBE0B,FB5607,FF006E,8338EC,3A86FF","Fraunces","Poppins"],
["Seventies Warm","Retro","264653,2A9D8F,E9C46A,F4A261,E76F51","DM Serif Display","Nunito"],
["Arcade Pop","Retro","F72585,7209B7,3A0CA3,4CC9F0","Space Grotesk","Raleway"],
["Midnight Gold","Luxury","0B0B0F,1F1F2E,C9A227,F5E6B3","Playfair Display","Montserrat"],
["Emerald Velvet","Luxury","0B3D2E,14532D,B8A15A,F5F1E3","Cormorant Garamond","Raleway"],
["Royal Plum","Luxury","2D1E2F,5B3A63,C9A227,F3E9DC","DM Serif Display","Lora"],
["Sea Glass","Coastal","CAF0F8,ADE8F4,90E0EF,48CAE4","Raleway","Lora"],
["Sandy Shore","Coastal","FDF6EC,F4E3CF,89C2D9,2A6F97","Lora","Work Sans"],
["Harbor Mist","Coastal","E0FBFC,C2DFE3,9DB4C0,5C6B73","Montserrat","Nunito"],
["Oat Milk","Neutral","F5EFE6,E5D9C6,CBB89D","Fraunces","Inter"],
["Warm Stone","Neutral","EAE0D5,C6AC8F,5E503F","Lora","DM Sans"],
["Cloud Grey","Neutral","F4F4F2,D9D9D4,A6A59F,6B6A66","Work Sans","Poppins"]
];
export const CURATED=ROWS.map(([name,category,hx,hf,bf],i)=>{const c=hx.split(",").map(x=>"#"+x.toUpperCase());return{id:"pm-"+String(i+1).padStart(3,"0"),name,c,category,fonts:[hf,bf],source:"curated",l:c.map(()=>false),h:150+(i*53)%130,n:i}});
// Sanity check: valid HEX, 3-5 colors, known category, no duplicate id or color combination
{const ids=new Set(),combos=new Set();for(const p of CURATED){const k=[...p.c].sort().join();if(p.c.length<3||p.c.length>5||p.c.some(x=>!/^#[0-9A-F]{6}$/.test(x))||!CATEGORIES.includes(p.category)||ids.has(p.id)||combos.has(k))console.warn("Check palette:",p.id,p.name);ids.add(p.id);combos.add(k)}}
