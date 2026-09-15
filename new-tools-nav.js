(function(){
  const menu=document.getElementById('toolSwitch')||document.getElementById('toolSwitcher');
  if(!menu)return;
  const existing=new Set([...menu.options].map(option=>option.value));
  [['league.html','📊 League Analyzer'],['startsit.html','🧠 Start / Sit']].forEach(([value,label])=>{
    if(!existing.has(value))menu.add(new Option(label,value));
  });
})();
