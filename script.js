
const mapSearch = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const mapRoute = (a,b,mode='transit') => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a)}&destination=${encodeURIComponent(b)}&travelmode=${mode}`;

let places={}, days=[], activeDay=0, mode='all';
const state = JSON.parse(localStorage.getItem('osaka2026-state') || '{"done":{},"fav":{}}');
const save=()=>localStorage.setItem('osaka2026-state',JSON.stringify(state));

Promise.all([fetch('data/places.json').then(r=>r.json()),fetch('data/itinerary.json').then(r=>r.json())])
.then(([p,d])=>{places=p;days=d;renderAll(); countdown();});

function countdown(){
  const target=new Date('2026-07-31T12:10:00+09:00'), now=new Date();
  const n=Math.ceil((target-now)/86400000);
  document.getElementById('countdown').textContent=n>0?`距離出發 ${n} 天`:n===0?'今天出發':'旅程已開始／結束';
}
function renderAll(){renderSummary();renderTabs();renderDay();}
function renderSummary(){
  const total=days.reduce((n,d)=>n+d.items.length,0);
  const done=Object.values(state.done).filter(Boolean).length;
  document.getElementById('summary').innerHTML=`
    <article class="stat"><span>旅程</span><strong>5 天 4 夜</strong></article>
    <article class="stat"><span>主要餐廳</span><strong>3 間</strong></article>
    <article class="stat"><span>完成進度</span><strong>${done} / ${total}</strong></article>`;
}
function renderTabs(){
  document.getElementById('dayTabs').innerHTML=days.map((d,i)=>`<button class="${i===activeDay?'active':''}" data-day="${i}">${d.day}<br><small>${d.date.slice(5).replace('-','/')}</small></button>`).join('');
  document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{activeDay=+b.dataset.day;renderTabs();renderDay()}));
}
function visible(item){return mode==='all'||item.category===mode||(mode==='food'&&item.category==='food');}
function renderDay(){
  const d=days[activeDay], filtered=d.items.filter(visible);
  const complete=d.items.filter((_,i)=>state.done[`${activeDay}-${i}`]).length;
  const pct=Math.round(complete/d.items.length*100);
  let html=`<header class="day-header"><div><p>${d.date}</p><h2>${d.title}</h2><p>住宿：${places[d.hotel].name}</p></div>
  <div class="progress-wrap"><div class="progress-label">今日完成 ${complete}/${d.items.length}</div><div class="progress"><span style="width:${pct}%"></span></div></div></header><div class="timeline">`;
  filtered.forEach(item=>{
    const originalIndex=d.items.indexOf(item), key=`${activeDay}-${originalIndex}`, p=places[item.place];
    html+=`<article class="stop"><span class="dot"></span><div class="card"><div class="card-top"><div class="time">${item.time}</div><div style="flex:1"><h3>${p.name}</h3><p class="label">${item.label}</p><span class="badge">${labelType(item.category)}</span>${p.note?`<p class="label" style="margin-top:10px">${p.note}</p>`:''}</div></div>
    <div class="actions"><a class="primary" target="_blank" rel="noopener" href="${mapSearch(p.query)}">Google Maps</a>
    ${p.official?`<a target="_blank" rel="noopener" href="${p.official}">官方網站</a>`:''}
    <button class="check-btn ${state.done[key]?'done':''}" data-check="${key}">${state.done[key]?'✓ 已完成':'標記完成'}</button>
    <button class="fav-btn ${state.fav[item.place]?'saved':''}" data-fav="${item.place}">${state.fav[item.place]?'★ 已收藏':'☆ 收藏'}</button></div></div></article>`;
    const next=d.items[originalIndex+1];
    if(next && (mode==='all')) {
      const np=places[next.place];
      const travelMode=(item.category==='spot'&&next.category==='food')?'walking':'transit';
      html+=`<div class="route">前往下一站 · <a target="_blank" rel="noopener" href="${mapRoute(p.query,np.query,travelMode)}">開啟 Google Maps 路線</a></div>`;
    }
  });
  html+=`</div><section class="notes"><h3>今日提醒</h3><ul>${d.notes.map(n=>`<li>${n}</li>`).join('')}</ul></section>`;
  document.getElementById('dayView').innerHTML=html;
  bindActions();
}
function labelType(x){return({transport:'交通',hotel:'住宿',shopping:'購物',spot:'景點',food:'餐飲'})[x]||x}
function bindActions(){
  document.querySelectorAll('[data-check]').forEach(b=>b.addEventListener('click',()=>{state.done[b.dataset.check]=!state.done[b.dataset.check];save();renderSummary();renderDay()}));
  document.querySelectorAll('[data-fav]').forEach(b=>b.addEventListener('click',()=>{state.fav[b.dataset.fav]=!state.fav[b.dataset.fav];save();renderDay()}));
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
  mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));renderDay();
}));
