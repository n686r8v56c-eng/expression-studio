import React,{useState} from 'react';
import './sourcing-flow.css';
const steps=[
['트렌드 발견','검색 관심과 실제 구매 수요 구분','Trend Flow·Market Flow의 원본 날짜·지표 확인','계절성과 유행 종료 시점 확인'],
['한국 시장 검증','경쟁 상품의 동일 사양·판매가 비교','리뷰·반품 사유 조사','상표권·디자인권 침해 위험 확인'],
['중국 공급처 발굴','1688·Alibaba에서 5곳 이상 견적 비교','제조사 여부와 사업자 정보 확인','MOQ·납기·결제·불량 보상 조건 문서화'],
['샘플 주문','원단·봉제·지퍼·사이즈·세탁 후 변형 확인','샘플과 양산품의 사양 일치 조건 확보','필요시 제3자 검품'],
['수입 요건·원가 검증','HS코드·관세·FTA 원산지 조건 확인','품목별 KC 등 안전기준과 표시 의무 확인','운임·통관·세금·환율·반품비 반영'],
['소량 테스트 판매','대량 발주 전에 소량으로 반응 검증','광고비·전환율·반품률 기록','상세페이지와 실제 상품의 일치 확인'],
['판매 데이터 분석','실제 이익·판매 속도·재고 회전 확인','고객 불만과 반품 사유 분석','재주문 전 비용과 수요 재점검'],
['재주문 및 확장','검증된 상품만 발주 확대','계절 종료와 리드타임 고려','브랜드·라벨·품질 계약 검토']
];
export default function SourcingFlow(){
 const [values,setValues]=useState({price:'39900',cost:'12000',freight:'4500',fee:'12',extra:'3500'});
 const number=k=>Math.max(0,Number(values[k])||0);
 const profit=number('price')-number('cost')-number('freight')-number('extra')-number('price')*number('fee')/100;
 const fmt=n=>Math.round(n).toLocaleString('ko-KR');
 return <section className="source-flow"><div className="source-intro"><small>SOURCING FLOW · HOME</small><h2>중국 소싱 실전 로드맵</h2><p>트렌드 발견부터 중국 공급처, 샘플, 통관, 테스트 판매까지 단계별로 확인해.</p></div><div className="source-steps">{steps.map(([title,...checks],i)=><details key={title}><summary><b>{String(i+1).padStart(2,'0')}</b><strong>{title}</strong><span>⌄</span></summary><div><h3>주의사항</h3><ul>{checks.map(t=><li key={t}>{t}</li>)}</ul></div></details>)}</div><section className="source-calc"><h2>마진 계산기</h2><p>예시 금액이야. 실제 견적을 입력하면 즉시 계산돼.</p><div className="source-fields">{[['price','한국 판매가 (원)'],['cost','중국 매입가 (원)'],['freight','국제운송·통관비 / 개 (원)'],['fee','판매 수수료 (%)'],['extra','기타 비용 / 개 (원)']].map(([key,label])=><label key={key}>{label}<input type="number" min="0" inputMode="decimal" value={values[key]} onChange={e=>setValues(old=>({...old,[key]:e.target.value}))}/></label>)}</div><div className="source-result"><div><small>예상 개당 이익</small><strong>{fmt(profit)}원</strong></div><div><small>예상 이익률</small><strong>{number('price')?(profit/number('price')*100).toFixed(1):'0.0'}%</strong></div></div><p className="source-note">간이 계산이야. 관세·수입 부가세의 실질 부담, 국내 배송·반품·광고비 등 입력하지 않은 비용은 별도로 반영해야 해. 부가세 공제 여부에 따라 원가가 달라져.</p></section></section>
}