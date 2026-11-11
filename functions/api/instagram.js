const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const allowedPost=url=>{try{const u=new URL(url);return u.protocol==='https:'&&['instagram.com','www.instagram.com'].includes(u.hostname)&&/^\/(p|reel)\/[A-Za-z0-9_-]+\/?$/.test(u.pathname)}catch{return false}};
const mediaHost=h=>h==='cdninstagram.com'||h.endsWith('.cdninstagram.com')||h==='fbcdn.net'||h.endsWith('.fbcdn.net')||h==='instagram.com'||h.endsWith('.instagram.com');
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
export async function onRequestGet({request}){
 const u=new URL(request.url),src=u.searchParams.get('url')||'',mode=u.searchParams.get('mode')||'post';
 if(mode==='image'){
  try{const imageUrl=new URL(src);if(imageUrl.protocol!=='https:'||!mediaHost(imageUrl.hostname))return json({error:'허용되지 않는 이미지 주소야.'},400);
   const r=await fetch(imageUrl.toString(),{headers:{'User-Agent':'Mozilla/5.0','Accept':'image/avif,image/webp,image/*'}});const type=r.headers.get('content-type')||'';
   if(!r.ok||!type.startsWith('image/'))return json({error:'이미지에 접근할 수 없어.'},502);
   const length=Number(r.headers.get('content-length')||0);if(length>20*1024*1024)return json({error:'이미지가 너무 커.'},413);
   const bytes=await r.arrayBuffer();if(bytes.byteLength>20*1024*1024)return json({error:'이미지가 너무 커.'},413);
   return new Response(bytes,{headers:{'content-type':type,'content-disposition':'attachment; filename="instagram-photo.jpg"','cache-control':'private, max-age=60','x-content-type-options':'nosniff'}});
  }catch{return json({error:'이미지를 가져오지 못했어.'},502)}
 }
 if(!allowedPost(src))return json({error:'올바른 공개 인스타그램 게시물 주소를 입력해 줘.'},400);
 try{
  const post=new URL(src);post.search='';
  const r=await fetch(post.toString(),{headers:{'User-Agent':'facebookexternalhit/1.1','Accept':'text/html'}});
  if(!r.ok)return json({error:'인스타그램에서 게시물 접근을 제한했어.'},502);
  const html=await r.text();
  const tags=[...html.matchAll(/<meta\s+[^>]*>/gi)].map(x=>x[0]);
  const find=key=>{for(const tag of tags){if(!new RegExp('(?:property|name)\\s*=\\s*["\\\']'+key+'["\\\']','i').test(tag))continue;const m=tag.match(/content\s*=\s*(["'])(.*?)\1/i);if(m)return decode(m[2])}return ''};
  const preview=find('og:image')||find('twitter:image'),title=find('og:title')||'Instagram';
  // Prefer the post's embedded display image variants over cropped social-preview thumbnails.
  // This is best-effort: Instagram does not consistently expose these fields publicly.
  const candidates=[];
  const push=(value,width=0,height=0)=>{try{const cleaned=decode(String(value).replace(/\\\\u0026/g,'&').replace(/\\u0026/g,'&').replace(/\\\//g,'/'));const parsed=new URL(cleaned);if(parsed.protocol==='https:'&&mediaHost(parsed.hostname)&&!candidates.some(x=>x.url===cleaned))candidates.push({url:cleaned,width:Number(width)||0,height:Number(height)||0})}catch{}};
  for(const m of html.matchAll(/"(?:display_url|display_src|image_url)"\s*:\s*"((?:\\.|[^"\\])*)"/g)){try{push(JSON.parse('"'+m[1]+'"'))}catch{}}
  for(const m of html.matchAll(/"display_resources"\s*:\s*(\[[\s\S]{0,4000}?\])/g)){try{const variants=JSON.parse(m[1]);for(const v of variants)push(v.src,v.config_width,v.config_height)}catch{}}
  if(preview)push(preview);
  if(!candidates.length)return json({error:'사진을 찾지 못했어. 비공개 게시물이나 인스타그램 접근 제한일 수 있어.'},422);
  const embedded=candidates.filter(x=>x.url!==preview);
  const best=(embedded.length?embedded:candidates).sort((a,b)=>(b.width*b.height)-(a.width*a.height))[0];
  const originalAvailable=embedded.length>0;
  return json({title,images:[best.url],originalAvailable,note:originalAvailable?'게시물 이미지 주소를 찾았어. 원본 비율을 확인해 줘.':'인스타그램에서 원본 이미지 주소를 공개하지 않아 공유용 미리보기만 가져왔어. 이 사진은 정사각형으로 잘렸을 수 있어.'});
 }catch{return json({error:'게시물 사진을 불러오지 못했어.'},502)}
}
