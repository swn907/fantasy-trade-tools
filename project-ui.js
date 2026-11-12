(function(){
  'use strict';
  const RATINGS_FALLBACK={ratingsUpdated:'2026-11-11',playerCount:354};
  const FEED_MAX_AGE_HOURS=72;

  function ready(fn){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }
  function uniqueId(prefix){
    let id=prefix,index=1;
    while(document.getElementById(id))id=`${prefix}-${index++}`;
    return id;
  }
  function visibleText(node){return String(node?.textContent||'').replace(/\s+/g,' ').trim()}
  function readableDate(value){
    const plain=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const date=plain?new Date(Number(plain[1]),Number(plain[2])-1,Number(plain[3])):new Date(value);
    return Number.isFinite(date.getTime())?date.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):value;
  }
  function ageHours(value){
    const time=new Date(value).getTime();
    return Number.isFinite(time)?Math.max(0,(Date.now()-time)/36e5):Infinity;
  }

  function addSkipLink(){
    const main=document.querySelector('main,.wrap');
    if(!main)return;
    if(!main.id)main.id=uniqueId('project-main');
    const link=document.createElement('a');
    link.className='project-skip-link';
    link.href=`#${main.id}`;
    link.textContent='Skip to main content';
    document.body.prepend(link);
  }

  function improveFormLabels(){
    document.querySelectorAll('label').forEach(label=>{
      if(label.htmlFor||label.querySelector('input,select,textarea'))return;
      const scope=label.closest('.field,.control,.row,.group,section,form')||label.parentElement;
      const control=scope?.querySelector('input:not([type="hidden"]),select,textarea');
      if(!control)return;
      if(!control.id)control.id=uniqueId('field');
      label.htmlFor=control.id;
    });
    document.querySelectorAll('input:not([type="hidden"]),select,textarea').forEach(control=>{
      const hasLabel=control.getAttribute('aria-label')||control.getAttribute('aria-labelledby')||
        (control.id&&document.querySelector(`label[for="${CSS.escape(control.id)}"]`));
      if(hasLabel)return;
      const scope=control.closest('.field,.control,.row,.group')||control.parentElement;
      const nearby=scope?.querySelector('label,.label,h2,h3');
      const name=visibleText(nearby)||control.getAttribute('placeholder')||control.name||control.id||'Form field';
      control.setAttribute('aria-label',name);
    });
    document.querySelectorAll('#status,#feedStatus,#results,#upgrade,[data-status]').forEach(node=>{
      node.setAttribute('aria-live','polite');
      node.setAttribute('aria-atomic','true');
    });
  }

  function sleeperIdInputs(){
    return [...document.querySelectorAll('input')].filter(input=>{
      const context=`${input.id} ${input.name} ${input.placeholder} ${visibleText(input.closest('.field,.control,.row'))}`.toLowerCase();
      return context.includes('sleeper')&&context.includes('league');
    });
  }
  function rememberSleeperLeague(){
    let stored='';
    try{stored=localStorage.getItem('fantasy-tools:sleeper-league-id')||''}catch{}
    sleeperIdInputs().forEach(input=>{
      if(!input.value&&stored)input.value=stored;
      const save=()=>{try{if(input.value.trim())localStorage.setItem('fantasy-tools:sleeper-league-id',input.value.trim())}catch{}};
      input.addEventListener('change',save);
      input.addEventListener('blur',save);
    });
  }

  function normalizeToolNavigation(){
    const menu=document.getElementById('toolSwitch')||document.getElementById('toolSwitcher')||document.getElementById('nav');
    if(!menu||menu.tagName!=='SELECT')return;
    const tools=[
      ['index.html','🏠 All tools'],
      ['analyzer.html','⚖️ Trade Analyzer'],
      ['generator.html','🔁 Trade Generator'],
      ['target.html','🎯 Target Finder'],
      ['tradefinder.html','🔄 Trade Block Finder'],
      ['waiver.html','➕ Waiver Assistant'],
      ['league.html','📊 League Analyzer'],
      ['startsit.html','🧠 Start / Sit'],
      ['streams.html','🌊 Streamer Research Archive']
    ];
    const current=location.pathname.split('/').pop()||'index.html';
    menu.replaceChildren(...tools.map(([value,label])=>{
      const option=new Option(label,value,value===current,value===current);
      return option;
    }));
    menu.setAttribute('aria-label','Switch fantasy tool');
    if(!menu.onchange)menu.onchange=event=>{if(event.target.value)location.href=event.target.value};
  }

  async function dataFreshness(){
    const badge=document.createElement('aside');
    badge.className='project-data-badge';
    badge.dataset.state='loading';
    badge.setAttribute('role','status');
    badge.setAttribute('aria-live','polite');
    badge.innerHTML='<span class="project-data-dot"></span><span><strong>Checking data freshness…</strong></span>';
    if(document.querySelector('[data-project-feed]'))badge.hidden=true;
    (document.querySelector('main,.wrap')||document.body).append(badge);

    let version=RATINGS_FALLBACK,feed=null;
    try{
      const result=await fetch('site-version.json',{cache:'no-store'});
      if(result.ok)version={...version,...await result.json()};
    }catch{}
    try{
      const result=await fetch('weekly-projections.json',{cache:'no-store'});
      if(result.ok)feed=await result.json();
    }catch{}

    document.querySelectorAll('[data-project-ratings]').forEach(node=>{
      node.textContent=`${version.playerCount||354} players • ratings ${readableDate(version.ratingsUpdated)}`;
    });
    const ratings=`Ratings ${readableDate(version.ratingsUpdated)}`;
    if(feed?.generatedAt){
      const hours=ageHours(feed.generatedAt);
      if(hours<=FEED_MAX_AGE_HOURS){
        badge.dataset.state='current';
        badge.innerHTML=`<span class="project-data-dot"></span><span><strong>${ratings}</strong> • sportsbook feed ${hours<1?'updated within the hour':`updated ${Math.round(hours)}h ago`} (${feed.playerCount||feed.players?.length||0} players).</span>`;
        document.querySelectorAll('[data-project-feed]').forEach(node=>node.textContent='Sportsbook feed current');
      }else{
        const days=Math.max(1,Math.floor(hours/24));
        badge.dataset.state='stale';
        badge.innerHTML=`<span class="project-data-dot"></span><span><strong>${ratings}</strong> • sportsbook cache is ${days} days old. Start/Sit will ignore it until refreshed.</span>`;
        document.querySelectorAll('[data-project-feed]').forEach(node=>node.textContent=`Sportsbook feed needs refresh (${days}d old)`);
      }
    }else{
      badge.dataset.state='error';
      badge.innerHTML=`<span class="project-data-dot"></span><span><strong>${ratings}</strong> • sportsbook cache unavailable; model fallbacks remain available.</span>`;
      document.querySelectorAll('[data-project-feed]').forEach(node=>node.textContent='Sportsbook feed unavailable');
    }
  }

  ready(()=>{
    addSkipLink();
    normalizeToolNavigation();
    improveFormLabels();
    rememberSleeperLeague();
    dataFreshness();
  });
})();
