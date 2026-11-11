import React,{useState} from 'react';
import {Instagram,Youtube,ExternalLink,Link2,Download} from 'lucide-react';
import './saver-flow.css';
const valid=(raw,kind)=>{try{const u=new URL(raw.trim());const h=u.hostname.toLowerCase();return u.protocol==='https:'&&(kind==='instagram'?(h==='instagram.com'||h==='www.instagram.com')&&/^\/(p|reel)\//.test(u.pathname):(['youtube.com','www.youtube.com','m.youtube.com','youtu.be'].includes(h)))}catch{return false}};
function SaverSection({kind}){
 const instagram=kind==='instagram', [url,setUrl]=useState(''),[format,setFormat]=useState('video'),[quality,setQuality]=useState('1080p'),[audio,setAudio]=useState('mp3'),[notice,setNotice]=useState('');
 const ok=valid(url,kind);
 return <section className="saver-panel"><div className="saver-title">{instagram?<Instagram size={21}/>:<Youtube size={22}/>}<h3>{instagram?'Instagram Saver':'YouTube Saver'}</h3></div>
 <label className="saver-label" htmlFor={'saver-'+kind}>게시물 링크</label><div className="saver-input"><Link2 size={17}/><input id={'saver-'+kind} type="url" inputMode="url" value={url} onChange={e=>{setUrl(e.target.value);setNotice('')}} placeholder={instagram?'https://www.instagram.com/p/...':'https://youtu.be/...'} /></div>
 {!instagram&&<><div className="saver-toggle"><button type="button" className={format==='video'?'selected':''} onClick={()=>setFormat('video')}>영상 MP4</button><button type="button" className={format==='audio'?'selected':''} onClick={()=>setFormat('audio')}>오디오만</button></div><label className="saver-label" htmlFor="saver-quality">{format==='video'?'원하는 화질':'오디오 형식'}</label><select id="saver-quality" value={format==='video'?quality:audio} onChange={e=>format==='video'?setQuality(e.target.value):setAudio(e.target.value)}>{(format==='video'?['2160p (4K)','1080p','720p','480p','360p']:['mp3','m4a','wav']).map(v=><option value={v} key={v}>{v.toUpperCase()}</option>)}</select></>}
 <button className="saver-action" type="button" disabled={!ok} onClick={()=>{setNotice(instagram?'인스타그램 게시물을 열었어. 사진 직접 다운로드는 아직 연결되지 않았어.':'유튜브 영상을 열었어. '+(format==='video'?quality+' 영상':'오디오 '+audio.toUpperCase())+' 추출 서버는 아직 연결되지 않았어.');window.open(url.trim(),'_blank','noopener,noreferrer')}}><ExternalLink size={16}/> 원본 열기</button>
 {url&&!ok&&<p className="saver-warning">올바른 {instagram?'인스타그램 게시물':'유튜브 영상'} 링크를 입력해 줘.</p>}
 {notice&&<p role="status" className="saver-status">{notice}</p>}
 <p className="saver-note">{instagram?'공개 게시물 링크를 확인할 수 있어. 여러 사진 미리보기·선택·다운로드는 미디어 접근 연동 후 지원할 예정이야.':'화질·오디오 형식 선택 화면이야. 실제 다운로드·오디오 변환은 권한이 있는 콘텐츠에 대한 서버 연동이 필요해.'}</p>
 </section>
}
export default function SaverFlow(){return <div className="saver-page"><h2>Saver</h2><p className="muted">사진과 영상 소스를 한곳에서 관리해.</p><SaverSection kind="instagram"/><SaverSection kind="youtube"/><p className="saver-footer">본인 콘텐츠 또는 저장·사용 허락을 받은 미디어만 다운로드해 줘.</p></div>}
