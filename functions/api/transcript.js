const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export async function onRequestPost({request,env}){
 if(!env.SUPADATA_API_KEY)return json({error:'API_KEY_NOT_CONFIGURED',message:'Cloudflare Pages에 SUPADATA_API_KEY를 설정해 줘.'},503);
 let body;try{body=await request.json()}catch{return json({error:'INVALID_JSON'},400)}
 const id=String(body?.videoId||'');
 if(!/^[a-zA-Z0-9_-]{11}$/.test(id))return json({error:'INVALID_VIDEO_ID'},400);
 try{
  const url='https://api.supadata.ai/v1/transcript?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id);
  const upstream=await fetch(url,{headers:{'x-api-key':env.SUPADATA_API_KEY,'accept':'application/json'},signal:AbortSignal.timeout(25000)});
  const result=await upstream.json().catch(()=>({}));
  if(!upstream.ok)return json({error:'PROVIDER_ERROR',message:result.message||result.error||'자막을 가져올 수 없어.',status:upstream.status},upstream.status===429?429:502);
  if(result.jobId||result.job_id)return json({status:'processing',jobId:result.jobId||result.job_id});
  const parts=Array.isArray(result.content)?result.content:Array.isArray(result.transcript)?result.transcript:Array.isArray(result.segments)?result.segments:[];
  const stamp=n=>{const s=Math.floor(Number(n)||0);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s%3600/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
  const transcript=parts.length?parts.map(p=>'['+stamp(p.offset??p.start??0)+'] '+String(p.text||'').trim()).join('\n'):String(result.content||result.text||result.transcript||'');
  if(!transcript.trim())return json({error:'NO_TRANSCRIPT',message:'이 영상에서 추출할 수 있는 자막이 없어.'},404);
  return json({status:'completed',transcript,lang:result.lang||result.language||null});
 }catch(e){return json({error:'FETCH_FAILED',message:'추출 서버에 연결하지 못했어. 잠시 후 다시 시도해 줘.'},502)}
}
