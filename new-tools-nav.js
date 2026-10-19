(function(){
  const menu=document.getElementById('toolSwitch')||document.getElementById('toolSwitcher');
  if(!menu)return;
  const existing=new Set([...menu.options].map(option=>option.value));
  [['league.html','📊 League Analyzer'],['startsit.html','🧠 Start / Sit'],['streams.html','🌊 Streams of the Week']].forEach(([value,label])=>{
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

// Week 6 top-of-board health/market audit. This corrects stale elite values
// that survived earlier overlays, including season-ending and active injuries.
(function(){
  const updates=window.WEEK6_TOP_BOARD_AUDIT={
    "De'Von Achane":0.0,
    "Caleb Williams":68.2,
    "Jalen Hurts":72.8,
    "Saquon Barkley":77.6,
    "Ashton Jeanty":88.7,
    "Kenneth Walker III":95.6,
    "Jahmyr Gibbs":100.0,
    "Bijan Robinson":96.4,
    "Derrick Henry":93.1,
    "Christian McCaffrey":93.6,
    "Jonathan Taylor":91.6,
    "James Cook III":92.4,
    "Kyren Williams":91.1,
    "Puka Nacua":94.0,
    "Jaxon Smith-Njigba":95.2,
    "Amon-Ra St. Brown":94.8,
    "Ja'Marr Chase":95.1,
    "Justin Jefferson":94.2,
    "CeeDee Lamb":94.4,
    "Chris Olave":91.4,
    "Drake London":92.1,
    "Nico Collins":88.1,
    "Zay Flowers":85.8,
    "Tetairoa McMillan":86.9,
    "Christian Watson":85.2,
    "Matthew Golden":78.4,
    "Brian Thomas Jr.":64.9,
    "Ladd McConkey":76.2,
    "Carnell Tate":73.8,
    "Jalen Coker":72.4,
    "Josh Downs":72.9,
    "Denzel Boston":71.8,
    "Jayden Reed":70.6,
    "Marvin Harrison Jr.":72.1,
    "Stefon Diggs":71.2,
    "Jordan Addison":65.3,
    "Travis Etienne Jr.":68.0,
    "Saquon Barkley":78.5,
    "Jacory Croskey-Merritt":71.5,
    "MarShawn Lloyd":68.5,
    "Blake Corum":64.5,
    "Keaton Mitchell":60.5,
    "Samaje Perine":59.8,
    "Michael Pittman Jr.":55.0,
    "Devaughn Vele":62.2,
    "Germie Bernard":66.2
  };
  for(const [name,value] of Object.entries(updates)){
    if(typeof DB!=='undefined'&&DB[name])DB[name].v=value;
    if(typeof byName!=='undefined'&&byName[name.toLowerCase()])byName[name.toLowerCase()].v=value;
  }

  // One-QB redraft scarcity: usable running backs receive a modest premium
  // because replacement-level weekly volume is harder to find than WR volume.
  // Injured/unusable players do not receive the premium.
  if(typeof DB!=='undefined')for(const player of Object.values(DB)){
    if(player.pos!=='RB'||player.v<=1)continue;
    const premium=player.v>=60?2.0:player.v>=55?1.2:0.5;
    player.v=Math.min(100,player.v+premium);
    if(typeof byName!=='undefined'&&byName[player.name.toLowerCase()])byName[player.name.toLowerCase()].v=player.v;
  }

  // Preserve the researched ordering while separating exact ties. For singleton
  // round-number grades, add only one tenth of precision; this never manufactures
  // a large value move merely to make the list look different.
  if(typeof DB!=='undefined'){
    const pool=Object.values(DB).sort((a,b)=>b.v-a.v||a.name.localeCompare(b.name));
    let previous=Infinity;
    for(let i=0;i<pool.length;i++){
      let desired=pool[i].v;
      if(desired>1&&Math.abs((desired*10)%5)<0.0001)desired+=(i%2===0?0.1:-0.1);
      let precise=+desired.toFixed(1);
      if(precise>=previous)precise=+(previous-0.1).toFixed(1);
      pool[i].v=Math.min(100,Math.max(0,precise));
      previous=pool[i].v;
    }
    if(typeof byName!=='undefined')for(const p of Object.values(DB))if(byName[p.name.toLowerCase()])byName[p.name.toLowerCase()].v=p.v;
  }
  if(typeof calc==='function')calc();
})();

// Full Week 6 player-by-player audit. Current multi-source ROS consensus is the
// baseline; official health, stable opportunity and remaining games are applied.
// No earlier player grade is protected. This final layer replaces all older
// partial overlays so every tool uses one coherent 242-player order.
(function(){
  const updates=window.WEEK6_FULL_BOARD_AUDIT={
  "Jahmyr Gibbs": 100.0,
  "Kenneth Walker III": 96.7,
  "Bijan Robinson": 97.4,
  "Christian McCaffrey": 96.0,
  "Puka Nacua": 95.3,
  "Ja'Marr Chase": 94.8,
  "Jonathan Taylor": 94.3,
  "Jaxon Smith-Njigba": 93.7,
  "Derrick Henry": 93.2,
  "Kyren Williams": 92.7,
  "James Cook III": 92.2,
  "Amon-Ra St. Brown": 91.8,
  "CeeDee Lamb": 91.4,
  "Drake London": 90.9,
  "Chase Brown": 90.5,
  "Javonte Williams": 90.0,
  "Tetairoa McMillan": 89.5,
  "Nico Collins": 89.1,
  "Zay Flowers": 88.7,
  "Parker Washington": 88.2,
  "Chris Olave": 87.8,
  "Ashton Jeanty": 87.4,
  "George Pickens": 86.9,
  "Brock Bowers": 86.5,
  "Josh Allen": 86.1,
  "Trey McBride": 85.7,
  "Justin Jefferson": 85.3,
  "Bhayshul Tuten": 82.5,
  "Chuba Hubbard": 84.8,
  "Davante Adams": 84.0,
  "Malik Nabers": 83.7,
  "D'Andre Swift": 84.4,
  "Tee Higgins": 83.1,
  "Christian Watson": 82.8,
  "Jaylen Warren": 83.4,
  "Mike Evans": 82.2,
  "Bucky Irving": 81.9,
  "George Kittle": 81.6,
  "Saquon Barkley": 81.3,
  "Michael Wilson": 81.0,
  "Garrett Wilson": 80.7,
  "DeVonta Smith": 80.4,
  "A.J. Brown": 80.1,
  "Jalen Coker": 79.8,
  "Rhamondre Stevenson": 76.8,
  "Luther Burden III": 79.2,
  "Jeremiyah Love": 79.5,
  "Matthew Golden": 78.6,
  "Breece Hall": 78.9,
  "DJ Moore": 78.0,
  "Jaylen Waddle": 77.8,
  "Matthew Stafford": 73.4,
  "Brock Purdy": 77.4,
  "Quinshon Judkins": 78.3,
  "Rashee Rice": 77.0,
  "Cam Skattebo": 77.2,
  "Jameson Williams": 76.6,
  "Isaiah Likely": 76.4,
  "Terry McLaurin": 76.2,
  "Sam LaPorta": 76.0,
  "Denzel Boston": 75.8,
  "Joe Burrow": 75.6,
  "KC Concepcion": 75.4,
  "DK Metcalf": 75.2,
  "Rome Odunze": 75.0,
  "Emeka Egbuka": 74.8,
  "RJ Harvey": 69.2,
  "Travis Kelce": 74.4,
  "Xavier Worthy": 74.2,
  "Patrick Mahomes": 74.0,
  "Malik Washington": 73.8,
  "Khalil Shakir": 73.6,
  "Lamar Jackson": 77.6,
  "Caleb Williams": 73.2,
  "Tyler Warren": 73.0,
  "Courtland Sutton": 72.8,
  "Carnell Tate": 72.6,
  "Kalif Raymond": 72.5,
  "Dak Prescott": 72.3,
  "Tucker Kraft": 72.1,
  "Drake Maye": 71.9,
  "Josh Downs": 71.7,
  "Brenton Strange": 71.6,
  "Trevor Lawrence": 71.4,
  "Ryan Flournoy": 71.2,
  "Harold Fannin Jr.": 71.0,
  "Jordan Addison": 70.8,
  "Aaron Jones Sr.": 70.7,
  "Tony Pollard": 70.5,
  "Keenan Allen": 70.3,
  "Jared Goff": 68.7,
  "Alvin Kamara": 69.9,
  "Colston Loveland": 69.8,
  "Stefon Diggs": 69.6,
  "Marvin Harrison Jr.": 69.4,
  "Woody Marks": 68.2,
  "Ladd McConkey": 69.0,
  "Tre Tucker": 68.9,
  "Jayden Daniels": 67.7,
  "Romeo Doubs": 68.5,
  "Devaughn Vele": 68.3,
  "Kyle Monangai": 67.4,
  "Jordyn Tyson": 68.0,
  "David Montgomery": 65.5,
  "Bryce Young": 65.7,
  "Brian Thomas Jr.": 67.5,
  "Jacory Croskey-Merritt": 64.1,
  "Keon Coleman": 67.2,
  "Juwan Johnson": 67.0,
  "Deebo Samuel": 66.9,
  "Omarion Hampton": 74.6,
  "Rashid Shaheed": 66.5,
  "Chris Godwin Jr.": 66.4,
  "Quentin Johnston": 66.2,
  "Jakobi Meyers": 66.0,
  "Travis Etienne Jr.": 67.8,
  "Jalen Hurts": 70.1,
  "J.K. Dobbins": 63.4,
  "Dontayvion Wicks": 65.4,
  "Tyler Shough": 65.2,
  "Jordan Love": 65.1,
  "Wan'Dale Robinson": 64.9,
  "Germie Bernard": 64.7,
  "Tre Harris": 64.6,
  "Kyle Pitts Sr.": 64.4,
  "Alec Pierce": 64.3,
  "TreVeyon Henderson": 66.7,
  "T.J. Hockenson": 64.0,
  "Adonai Mitchell": 63.9,
  "Makai Lemon": 63.7,
  "Caleb Douglas": 63.6,
  "Tyjae Spears": 62.6,
  "Jaxson Dart": 63.3,
  "Bo Nix": 63.2,
  "Dallas Goedert": 63.0,
  "Dalton Kincaid": 62.9,
  "DeMario Douglas": 62.8,
  "Jadarian Price": 65.9,
  "Cade Otton": 62.5,
  "Roman Wilson": 62.4,
  "Ja'Kobi Lane": 62.2,
  "C.J. Stroud": 62.1,
  "Jalen Nailor": 62.0,
  "Jordan Mason": 61.8,
  "Jahan Dotson": 61.7,
  "Isaac TeSlaa": 61.5,
  "Brian Robinson Jr.": 61.0,
  "Jayden Reed": 61.3,
  "AJ Barner": 61.1,
  "Rico Dowdle": 60.9,
  "Zach Charbonnet": 60.6,
  "Terrance Ferguson": 60.8,
  "Rachaad White": 60.3,
  "Kyler Murray": 60.5,
  "Dalton Schultz": 60.4,
  "Josh Jacobs": 61.4,
  "Kenyon Sadiq": 60.2,
  "Rashod Bateman": 60.0,
  "Antonio Williams": 59.9,
  "Cooper Kupp": 59.8,
  "Keaton Mitchell": 59.7,
  "Blake Corum": 59.6,
  "Mark Andrews": 59.4,
  "Pat Freiermuth": 59.3,
  "Jerry Jeudy": 59.2,
  "Baker Mayfield": 59.1,
  "Pat Bryant": 59.0,
  "Malachi Fields": 58.8,
  "Xavier Legette": 58.7,
  "Tyler Allgeier": 58.6,
  "Omar Cooper Jr.": 58.5,
  "Kenneth Gainwell": 58.4,
  "Elic Ayomanor": 58.2,
  "Samaje Perine": 58.1,
  "Kaelon Black": 58.0,
  "Darnell Mooney": 57.9,
  "MarShawn Lloyd": 57.8,
  "Joshua Palmer": 57.6,
  "Justice Hill": 57.5,
  "Mike Washington Jr.": 57.4,
  "Sam Darnold": 57.3,
  "Michael Pittman Jr.": 57.2,
  "De'Zhaun Stribling": 57.0,
  "Jauan Jennings": 56.9,
  "Xavier Hutchinson": 56.8,
  "Jonathon Brooks": 56.7,
  "Jack Bech": 56.6,
  "Justin Herbert": 56.4,
  "Chris Bell": 56.3,
  "Deshaun Watson": 56.2,
  "Bryce Lance": 56.1,
  "Josh Cameron": 56.0,
  "Jaylin Noel": 55.8,
  "Daniel Jones": 55.7,
  "Hunter Henry": 55.6,
  "Jalen McMillan": 55.5,
  "Chig Okonkwo": 55.4,
  "Tez Johnson": 55.2,
  "Jake Ferguson": 55.1,
  "Sione Vaki": 55.0,
  "Geno Smith": 54.9,
  "Aaron Rodgers": 54.8,
  "Chris Rodriguez Jr.": 54.6,
  "Jonah Coleman": 54.5,
  "Jacoby Brissett": 54.4,
  "Jaylen Wright": 54.3,
  "Darren Waller": 54.2,
  "Malik Willis": 54.0,
  "Kayshon Boutte": 53.9,
  "Kirk Cousins": 53.8,
  "Raheim Sanders": 53.7,
  "Tank Dell": 53.6,
  "Michael Mayer": 53.4,
  "Kendre Miller": 53.3,
  "Greg Dulcich": 53.2,
  "Oronde Gadsden II": 53.1,
  "Cam Ward": 53.0,
  "Chris Brooks": 52.8,
  "Calvin Ridley": 52.7,
  "Evan Engram": 52.6,
  "Ray Davis": 52.5,
  "Mike Gesicki": 52.4,
  "Gunnar Helm": 52.2,
  "Darnell Washington": 52.1,
  "Chimere Dike": 52.0,
  "Isiah Pacheco": 51.8,
  "Cole Kmet": 51.6,
  "Noah Fant": 51.5,
  "Tank Bigsby": 51.3,
  "Dawson Knox": 51.1,
  "Travis Hunter": 50.9,
  "Will Shipley": 50.8,
  "Mack Hollins": 50.6,
  "Tyrone Tracy Jr.": 50.4,
  "Devin Singletary": 50.2,
  "Ameer Abdullah": 50.1,
  "Jonnu Smith": 49.9,
  "Theo Johnson": 49.7,
  "David Njoku": 49.5,
  "Brevyn Spann-Ford": 49.4,
  "Elijah Arroyo": 49.2,
  "De'Von Achane": 0.0
};
  for(const [name,value] of Object.entries(updates)){
    if(typeof DB!=="undefined"&&DB[name])DB[name].v=value;
    if(typeof byName!=="undefined"&&byName[name.toLowerCase()])byName[name.toLowerCase()].v=value;
  }
  if(typeof calc==="function")calc();
})();
