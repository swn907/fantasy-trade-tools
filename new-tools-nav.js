(function(){
  const menu=document.getElementById('toolSwitch')||document.getElementById('toolSwitcher');
  if(!menu)return;
  const existing=new Set([...menu.options].map(option=>option.value));
  [['league.html','📊 League Analyzer'],['startsit.html','🧠 Start / Sit']].forEach(([value,label])=>{
    if(!existing.has(value))menu.add(new Option(label,value));
  });
})();

// Week 4 Thursday + Sunday: usage, efficiency, and injury-context audit.
// Monday is intentionally excluded until that game is complete.
(function(){
  const updates=window.WEEK4_VALUE_UPDATES={
    "Lamar Jackson":78.0,
    "Bryce Young":70.5,
    "Drake Maye":70.0,
    "Bo Nix":66.0,
    "Saquon Barkley":82.0,
    "Jonathan Taylor":93.0,
    "James Cook III":93.5,
    "Ashton Jeanty":95.0,
    "Kyren Williams":89.0,
    "Jeremiyah Love":82.0,
    "D'Andre Swift":83.0,
    "Bucky Irving":78.5,
    "Cam Skattebo":77.0,
    "Chase Brown":88.5,
    "Bhayshul Tuten":79.5,
    "Chuba Hubbard":78.0,
    "Quinshon Judkins":76.0,
    "Jaylen Warren":79.0,
    "Kyle Monangai":71.5,
    "David Montgomery":78.0,
    "Omarion Hampton":82.0,
    "RJ Harvey":71.0,
    "Aaron Jones Sr.":67.0,
    "Puka Nacua":98.5,
    "Ja'Marr Chase":94.0,
    "CeeDee Lamb":96.0,
    "Nico Collins":89.5,
    "Rashee Rice":77.0,
    "Ladd McConkey":75.0,
    "Christian Watson":80.0,
    "DJ Moore":78.0,
    "Emeka Egbuka":78.0,
    "Tetairoa McMillan":86.0,
    "Tee Higgins":84.0,
    "Jameson Williams":74.0,
    "Parker Washington":79.0,
    "Matthew Golden":75.0,
    "DK Metcalf":75.5,
    "Marvin Harrison Jr.":61.5,
    "Courtland Sutton":64.0,
    "Michael Pittman Jr.":62.0,
    "Michael Wilson":75.0,
    "Denzel Boston":69.0,
    "KC Concepcion":68.5,
    "Carnell Tate":75.0,
    "Malik Washington":67.0,
    "Tre Harris":65.5,
    "Isaiah Likely":73.5,
    "Sam LaPorta":78.5,
    "Dalton Kincaid":79.0,
    "Tucker Kraft":75.5,
    "T.J. Hockenson":68.0,
    "Harold Fannin Jr.":77.0,
    "Darren Waller":65.0,
    "Darnell Washington":54.0
  };
  for(const [name,value] of Object.entries(updates)){
    if(typeof DB!=='undefined'&&DB[name])DB[name].v=value;
    if(typeof byName!=='undefined'&&byName[name.toLowerCase()])byName[name.toLowerCase()].v=value;
  }
  if(typeof calc==='function')calc();
})();

// Week 3 Sunday: finalized usage/injury audit. Values stay internal to the tools.
(function(){
  const updates={"De'Von Achane":50.0,"Breece Hall":78.0,"Travis Etienne Jr.":72.0,"Aaron Jones Sr.":65.0,"Tyjae Spears":57.0,"James Cook III":95.0,"Kyren Williams":86.0,"Jeremiyah Love":87.0,"Jaylen Warren":76.0,"TreVeyon Henderson":66.0,"Rhamondre Stevenson":73.0,"Bhayshul Tuten":77.0,"Baker Mayfield":62.0,"Drake London":89.0,"Rashee Rice":86.0,"Xavier Worthy":64.0,"Brian Thomas Jr.":66.0,"Marvin Harrison Jr.":65.0,"Michael Wilson":72.0,"Carnell Tate":72.0,"Wan'Dale Robinson":67.0,"Davante Adams":82.0,"Jordan Addison":72.0,"Jalen Coker":71.0,"Jalen McMillan":55.0,"Jack Bech":50.0,"Dalton Kincaid":81.5,"Tyler Warren":83.0,"Harold Fannin Jr.":75.0,"Kenyon Sadiq":65.0,"Brock Bowers":89.0,"Darren Waller":63.0,"Evan Engram":57.0,"T.J. Hockenson":64.0,"Mark Andrews":63.0,"Terry McLaurin":79.0,"Josh Downs":74.0,"Keenan Allen":65.0,"Jaxon Smith-Njigba":98.0};
  for(const [name,value] of Object.entries(updates)){
    if(typeof DB!=='undefined'&&DB[name])DB[name].v=value;
    if(typeof byName!=='undefined'&&byName[name.toLowerCase()])byName[name.toLowerCase()].v=value;
  }
  if(typeof calc==='function')calc();
})();

// Re-apply the newest audit after the historical Week 3 layer.
(function(){
  const updates=window.WEEK4_VALUE_UPDATES||{};
  for(const [name,value] of Object.entries(updates)){
    if(typeof DB!=='undefined'&&DB[name])DB[name].v=value;
    if(typeof byName!=='undefined'&&byName[name.toLowerCase()])byName[name.toLowerCase()].v=value;
  }
  if(typeof calc==='function')calc();
})();

// Week 5 complete-slate rest-of-season audit.
// Changes emphasize repeatable opportunity (snaps, routes, carries and targets),
// then efficiency, injury/trade context and remaining playable weeks. Carolina
// and Kansas City players receive a deliberately small +0.8 completed-bye bump.
(function(){
  const updates=window.WEEK5_ROS_VALUE_UPDATES={
    "Josh Allen":93.0,
    "Drake Maye":74.0,
    "Jordan Love":76.5,
    "Jared Goff":71.5,
    "Matthew Stafford":72.5,
    "Patrick Mahomes":80.8,
    "Bryce Young":72.1,
    "Jonathan Taylor":91.5,
    "Chase Brown":85.0,
    "Jaylen Warren":83.0,
    "Tyjae Spears":64.0,
    "Woody Marks":72.0,
    "David Montgomery":69.0,
    "Quinshon Judkins":72.0,
    "Omarion Hampton":76.0,
    "RJ Harvey":67.5,
    "Alvin Kamara":55.0,
    "James Cook III":92.5,
    "Jeremiyah Love":84.0,
    "Isiah Pacheco":59.3,
    "Chuba Hubbard":79.6,
    "Jonathon Brooks":66.8,
    "Puka Nacua":100.0,
    "Malik Nabers":92.0,
    "Mike Evans":83.0,
    "Drake London":92.0,
    "Zay Flowers":86.0,
    "Emeka Egbuka":82.0,
    "Jaylen Waddle":76.0,
    "Jameson Williams":72.0,
    "Michael Wilson":71.5,
    "Marvin Harrison Jr.":67.5,
    "Deebo Samuel":60.0,
    "Jauan Jennings":50.0,
    "Nico Collins":88.0,
    "Rashee Rice":78.6,
    "Xavier Worthy":69.8,
    "Tetairoa McMillan":86.8,
    "Jalen Coker":71.8,
    "Xavier Legette":53.3,
    "Brock Bowers":91.0,
    "Isaiah Likely":77.5,
    "Dalton Kincaid":80.0,
    "Harold Fannin Jr.":74.0,
    "Kenyon Sadiq":60.0,
    "Travis Kelce":64.8
  };
  for(const [name,value] of Object.entries(updates)){
    if(typeof DB!=='undefined'&&DB[name])DB[name].v=value;
    if(typeof byName!=='undefined'&&byName[name.toLowerCase()])byName[name.toLowerCase()].v=value;
  }
  if(typeof calc==='function')calc();
})();
