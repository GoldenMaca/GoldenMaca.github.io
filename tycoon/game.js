const $=id=>document.getElementById(id);
const fmt=n=>{if(n>=1e12)return(n/1e12).toFixed(2)+'T';if(n>=1e9)return(n/1e9).toFixed(2)+'B';if(n>=1e6)return(n/1e6).toFixed(2)+'M';if(n>=1e3)return(n/1e3).toFixed(2)+'K';return Math.floor(n).toString()};
const rnd=(a,b)=>Math.random()*(b-a)+a;
const rInt=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];

const MATS={
iron:{name:'Iron Ore',refined:'Steel',base:10,tier:1},
gold:{name:'Gold Ore',refined:'Gold Bar',base:40,tier:1},
plat:{name:'Platinum',refined:'Plat Ingot',base:100,tier:2},
uran:{name:'Uranium',refined:'Enriched U',base:250,tier:2},
crys:{name:'Crystal',refined:'Quantum Xtal',base:600,tier:3}
};

const SHIP_TYPES=[
{id:'scout',name:'Scout Vessel',cost:800,spd:4,cargo:15,mine:0,scan:true,hp:30,desc:'Fast, discovers hidden systems'},
{id:'miner',name:'Mining Barge',cost:2500,spd:2,cargo:60,mine:3,scan:false,hp:80,desc:'Slow but efficient miner'},
{id:'hauler',name:'Heavy Hauler',cost:6000,spd:1.5,cargo:250,mine:1,scan:false,hp:120,desc:'Massive cargo capacity'},
{id:'cruiser',name:'Light Cruiser',cost:12000,spd:3.5,cargo:40,mine:1,scan:true,hp:100,desc:'Armed, can escort fleets'}
];

const PROC_TYPES=[
{id:'refinery',name:'Refinery',cost:2000,input:'iron',output:'steel',rate:1,eff:0.9,desc:'Iron Ore → Steel'},
{id:'smelter',name:'Gold Smelter',cost:4000,input:'gold',output:'goldbar',rate:0.5,eff:0.85,desc:'Gold Ore → Gold Bars'},
{id:'enricher',name:'Enrichment Plant',cost:10000,input:'uran',output:'eu',rate:0.3,eff:0.8,desc:'Uranium → Enriched Uranium'},
{id:'synth',name:'Crystal Synthesizer',cost:25000,input:'crys',output:'qcrys',rate:0.2,eff:0.75,desc:'Crystal → Quantum Crystals'}
];

function genSystems(){
const sys=[{name:'Sol Prime',x:0,y:0,dist:0,res:{iron:0.6,gold:0.3},danger:0.05,found:true,home:true}];
const names=['Kepler-442b','Proxima','Trappist-1','Gliese','HD 40307','Wolf 1061','LHS 1140','TOI-700','K2-18','Ross 128','Barnard','Luyten','Teegarden','Tau Ceti','Epsilon','Kapteyn','Wolf 359','Sirius','Vega','Altair'];
const mats=Object.keys(MATS);
for(let i=0;i<18;i++){
const angle=rnd(0,Math.PI*2);
const dist=rnd(3,25);
const x=Math.cos(angle)*dist;
const y=Math.sin(angle)*dist;
const res={};
for(const m of mats) if(Math.random()<0.5) res[m]=rnd(0.2,0.9);
sys.push({name:names[i],x,y,dist,res,danger:rnd(0.05,0.5),found:false,home:false});
}
return sys;
}

const EVT=[
{title:'Ransomware',desc:'{n} hit by encryption. Pay or lose efficiency.',cost:300,crit:false},
{title:'Insider Leak',desc:'Data breach. Spend on PR or lose rep.',cost:500,crit:false},
{title:'Pirate Raid',desc:'Pirates detected near {n}. Fight or pay tribute.',cost:600,crit:true},
{title:'Blackout',desc:'Power grid failure in {n}. Repair or suffer losses.',cost:400,crit:false},
{title:'Sabotage',desc:'Rival agents in {n}. Investigate or ignore.',cost:700,crit:true}
];

const CREW_NAMES=['Vex','Cipher','Ghost','Phantom','Wraith','Spectre','Raven','Zero','Echo','Nova','Onyx','Cobra','Blaze','Frost','Dash'];

class Game{
constructor(){
this.c=300;this.inf=0;this.rep=10;this.ls=Date.now();
this.ds=[{name:'Data Farm',inc:4,lv:1,ef:0.6,sec:50,ok:true,uc:0},{name:'Manufacturing',inc:7,lv:1,ef:0.6,sec:50,ok:true,uc:0},{name:'Finance Hub',inc:11,lv:1,ef:0.6,sec:50,ok:true,uc:0},{name:'Black Market',inc:14,lv:1,ef:0.6,sec:50,ok:true,uc:0},{name:'Neural Lab',inc:22,lv:1,ef:0.6,sec:50,ok:false,uc:40000},{name:'Orbital Yard',inc:40,lv:1,ef:0.6,sec:50,ok:false,uc:200000}];
this.cr=[];this.avail=[...CREW_NAMES];
this.riv=['OmniCorp','BlackSun','NeuroDyne','VoidSys'].map((n,i)=>({n,pw:100+i*60,gr:0.6+i*0.3,dc:1}));
this.ev=[];this.lg=[];this.et=0;this.rt=0;this.st=10;this.ct=0;

this.systems=genSystems();
this.ships=[];
this.inv={iron:0,gold:0,plat:0,uran:0,crys:0,steel:0,goldbar:0,eu:0,qcrys:0};
this.proc=[];
this.prices={};
for(const k in MATS) this.prices[k]={cur:MATS[k].base,hist:[MATS[k].base]};
this.stocks=this.riv.map(r=>({name:r.n,price:100+Math.random()*50,hist:[100]}));

this.mapSel=null;
this.mapCan=$('map-can');
this.mktCan=$('mkt-chart');

this.load();
this.initTabs();
this.initMap();
this.initUI();
this.loop(performance.now());
}

getInc(){let s=0;for(const d of this.ds)if(d.ok)s+=d.inc*d.lv*d.ef*(d.sec/100);return s}

update(dt){
this.c+=this.getInc()*dt;
this.et+=dt;this.rt+=dt;this.st+=dt;this.ct+=dt;

if(this.et>40){this.et=0;if(this.ev.length<5)this.spawnEv()}
if(this.rt>55){this.rt=0;for(const r of this.riv){r.pw+=r.gr*55;if(Math.random()<0.15)r.dc++}}
if(this.ct>2){
this.ct=0;
for(const k in this.prices){
const p=this.prices[k];const b=MATS[k].base;
p.cur=Math.max(b*0.3,Math.min(b*3,p.cur+rnd(-b*0.08,b*0.08)));
p.hist.push(p.cur);if(p.hist.length>50)p.hist.shift();
}
for(const s of this.stocks){s.price=Math.max(20,s.price+rnd(-4,7));s.hist.push(s.price);if(s.hist.length>50)s.hist.shift();}
}
for(const c of this.cr)if(c.con){c.con.t-=dt;if(c.con.t<=0)this.finCon(c)}
for(const s of this.ships)if(s.mission){s.mission.t-=dt;if(s.mission.t<=0)this.finMission(s)}
for(const p of this.proc)if(p.on&&this.inv[p.input]>=p.rate*dt){this.inv[p.input]-=p.rate*dt;this.inv[p.output]+=p.rate*dt*p.eff}

if(this.st>10){this.st=0;this.save()}
this.render();
}

spawnEv(){
const t=pick(EVT),d=pick(this.ds.filter(x=>x.ok));
const e={id:Date.now()+Math.random(),title:t.title,desc:t.desc.replace('{n}',d?.name||'HQ'),cost:Math.floor(t.cost*(1+this.ds.reduce((a,x)=>a+x.lv,0)*0.08)),crit:t.crit,d:d};
this.ev.push(e);this.note(`Event: ${e.title}`,e.crit?'err':'warn');this.log(`Event: ${e.title}`,'info');
}

resEv(id,act){
const i=this.ev.findIndex(x=>x.id===id);if(i===-1)return;const e=this.ev[i];
if(act==='pay'){if(this.c>=e.cost){this.c-=e.cost;this.log(`Paid ${fmt(e.cost)} for ${e.title}`,'loss');this.note('Crisis averted','ok');this.rep++}else{this.note('Insufficient credits','err');return}}
else if(act==='fight'){if(Math.random()<(0.35+this.cr.length*0.07+this.ships.length*0.03)){this.c+=e.cost*0.4;this.rep+=2;this.log(`Handled ${e.title} (+${fmt(e.cost*0.4)} Cr)`,'gain');this.note('Victory','ok')}else{if(e.d)e.sec=Math.max(10,e.sec-20);this.rep=Math.max(0,this.rep-2);this.log(`Failed ${e.title}`,'loss');this.note('Defeat','err')}}
else{if(e.crit){if(e.d)e.ef=Math.max(0.1,e.ef-0.15);this.rep=Math.max(0,this.rep-3);this.log(`Ignored critical: ${e.title}`,'loss')}else{this.rep=Math.max(0,this.rep-1);this.log(`Ignored: ${e.title}`,'info')}}
this.ev.splice(i,1);this.render();
}

hire(){
const cost=500+this.cr.length*250;if(this.c<cost){this.note('Not enough credits','err');return}
this.c-=cost;const n=pick(this.avail);this.avail.splice(this.avail.indexOf(n),1);
this.cr.push({n,cm:rInt(3,8),hk:rInt(3,8),st:rInt(3,8),con:null});
this.log(`Hired ${n}`,'gain');this.note(`${n} joined`,'ok');this.render();
}

assign(i){
const c=this.cr[i];if(c.con)return;
const contracts=[{n:'Data Heist',t:50,r:200,rs:0.1},{n:'Corp Sabotage',t:110,r:450,rs:0.2},{n:'VIP Extraction',t:170,r:800,rs:0.15},{n:'Server Breach',t:280,r:1400,rs:0.25}];
const x=pick(contracts);c.con={...x,tl:x.t};
this.log(`${c.n} started ${x.n}`,'info');this.render();
}

finCon(c){
const x=c.con;if(Math.random()>x.rs){this.c+=x.r;this.inf++;this.log(`${c.n} completed ${x.n} (+${fmt(x.r)} Cr)`,'gain');this.note(`${c.n}: Success`,'ok')}else{this.log(`${c.n} failed ${x.n}`,'loss');this.note(`${c.n}: Failed`,'err')}
c.con=null;this.render();
}

upg(i){
const d=this.ds[i];const cost=Math.floor(80*Math.pow(2,d.lv));if(this.c<cost){this.note('Insufficient credits','err');return}
this.c-=cost;d.lv++;d.ef=Math.min(1,d.ef+0.05);this.log(`Upgraded ${d.name} to Lv.${d.lv}`,'gain');this.note(`${d.name} Lv.${d.lv}`,'ok');this.render();
}

boost(i){
const d=this.ds[i];const cost=40*d.lv;if(this.c<cost){this.note('Insufficient credits','err');return}
this.c-=cost;d.ef=Math.min(1,d.ef+0.1);d.sec=Math.min(100,d.sec+5);this.log(`Boosted ${d.name}`,'info');this.note(`${d.name} boosted`,'ok');this.render();
}

fort(i){
const d=this.ds[i];const cost=60*d.lv;if(this.c<cost){this.note('Insufficient credits','err');return}
this.c-=cost;d.sec=Math.min(100,d.sec+15);this.log(`Fortified ${d.name}`,'info');this.note(`${d.name} fortified`,'ok');this.render();
}

unlock(i){
const d=this.ds[i];if(d.ok)return;if(this.c<d.uc){this.note('Insufficient credits','err');return}
this.c-=d.uc;d.ok=true;this.log(`Unlocked ${d.name}`,'gain');this.note(`Unlocked: ${d.name}`,'ok');this.render();
}

buyShip(typeId){
const t=SHIP_TYPES.find(x=>x.id===typeId);if(!t)return;
if(this.c<t.cost){this.note('Not enough credits','err');return}
this.c-=t.cost;
const ship={...t,cargoLoad:{},hp:t.hp,maxHp:t.hp,mission:null,uid:Date.now()+Math.random()};
this.ships.push(ship);
this.log(`Bought ${t.name}`,'gain');this.note(`${t.name} purchased`,'ok');this.render();
}

sendMine(shipIdx,sysName){
const s=this.ships[shipIdx];
if(s.mission){this.note('Ship already on mission','warn');return}
const sys=this.systems.find(x=>x.name===sysName);
if(!sys||!sys.found){this.note('System not discovered','err');return}
const resKeys=Object.keys(sys.res||{});
if(resKeys.length===0){this.note('No resources in this system','warn');return}
const res=pick(resKeys);
const yieldAmt=Math.floor(s.mine*sys.res[res]*(1+rnd(-0.2,0.3))*10);
const travel=s.spd>0?sys.dist/s.spd:5;
const duration=travel*2+2;
s.mission={t:duration,sys:sysName,res:res,amt:yieldAmt,action:'mine'};
this.log(`${s.name} departing for ${sysName}`,'info');this.note(`${s.name} launched`,'ok');this.render();
}

sendScout(shipIdx){
const s=this.ships[shipIdx];
if(s.mission){this.note('Ship busy','warn');return}
if(!s.scan){this.note('Ship lacks scanners','err');return}
const hidden=this.systems.filter(x=>!x.found);
if(hidden.length===0){this.note('All systems discovered!','ok');return}
const target=hidden.reduce((a,b)=>a.dist<b.dist?a:b);
const duration=target.dist/s.spd*2+1;
s.mission={t:duration,sys:target.name,action:'scout'};
this.log(`${s.name} scouting to ${target.name}`,'info');this.note(`${s.name} scouting...`,'ok');this.render();
}

sendSell(shipIdx,resKey){
const s=this.ships[shipIdx];
if(s.mission){this.note('Ship busy','warn');return}
if(!this.inv[resKey]||this.inv[resKey]<1){this.note('No cargo to sell','err');return}
const amt=Math.min(s.cargo,this.inv[resKey]);
this.inv[resKey]-=amt;
const price=this.prices[resKey]?.cur||MATS[resKey]?.base||10;
s.mission={t:3+sys.dist/s.spd,action:'sell',amt:amt,price:price,res:resKey};
this.log(`${s.name} selling ${fmt(amt)} ${MATS[resKey]?.name||resKey}`,'info');this.render();
}

finMission(s){
const m=s.mission;
if(m.action==='mine'){
const have=Object.values(s.cargoLoad).reduce((a,b)=>a+b,0);
const space=s.cargo-have;
const take=Math.min(space,m.amt);
if(!s.cargoLoad[m.res])s.cargoLoad[m.res]=0;
s.cargoLoad[m.res]+=take;
this.log(`${s.name} mined ${fmt(take)} ${MATS[m.res]?.name||m.res}`,'gain');
this.note(`${s.name}: Mined ${fmt(take)} units`,'ok');
}
else if(m.action==='scout'){
const sys=this.systems.find(x=>x.name===m.sys);
if(sys){sys.found=true;this.log(`Discovered ${sys.name}!`,'gain');this.note(`Discovered: ${sys.name}`,'ok');}
}
else if(m.action==='sell'){
const total=m.amt*m.price;
this.c+=total;this.log(`${s.name} sold cargo for ${fmt(total)} Cr`,'gain');this.note(`Sold for ${fmt(total)} Cr`,'ok');
}
s.mission=null;this.render();
}

unloadCargo(shipIdx){
const s=this.ships[shipIdx];
for(const k in s.cargoLoad){
if(!this.inv[k])this.inv[k]=0;
this.inv[k]+=s.cargoLoad[k];
}
const total=Object.values(s.cargoLoad).reduce((a,b)=>a+b,0);
if(total>0){this.log(`${s.name} unloaded ${fmt(total)} units`,'info');this.note(`Unloaded ${fmt(total)} units`,'ok');}
s.cargoLoad={};this.render();
}

buildProc(id){
const p=PROC_TYPES.find(x=>x.id===id);if(!p)return;
if(this.c<p.cost){this.note('Not enough credits','err');return}
this.c-=p.cost;
this.proc.push({...p,on:true});
this.log(`Built ${p.name}`,'gain');this.note(`${p.name} built`,'ok');this.render();
}

toggleProc(i){
const p=this.proc[i];p.on=!p.on;this.render();
}

sellMat(key,amt){
if(!this.inv[key]||this.inv[key]<amt){this.note('Not enough material','err');return}
this.inv[key]-=amt;
const price=this.prices[key]?.cur||MATS[key]?.base||10;
const total=amt*price;
this.c+=total;this.log(`Sold ${fmt(amt)} ${MATS[key]?.name||key} for ${fmt(total)} Cr`,'gain');this.note(`Sold for ${fmt(total)} Cr`,'ok');this.render();
}

buyStock(i,shares){
const st=this.stocks[i];const cost=shares*st.price;
if(this.c<cost){this.note('Not enough credits','err');return}
this.c-=cost;
st.owned=(st.owned||0)+shares;
this.log(`Bought ${shares} shares of ${st.name}`,'info');this.note(`Bought ${st.name} shares`,'ok');this.render();
}

sellStock(i,shares){
const st=this.stocks[i];if(!st.owned||st.owned<shares){this.note('Not enough shares','err');return}
st.owned-=shares;this.c+=shares*st.price;
this.log(`Sold ${shares} shares of ${st.name} for ${fmt(shares*st.price)} Cr`,'gain');this.note(`Sold ${st.name} shares`,'ok');this.render();
}

// UI
initTabs(){
document.querySelectorAll('.tab-btn').forEach(b=>{
b.addEventListener('click',()=>{
document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
b.classList.add('active');$(`tab-${b.dataset.tab}`).classList.add('active');
if(b.dataset.tab==='map')this.drawMap();
if(b.dataset.tab==='mkt')this.drawMktChart();
});
});
}

initUI(){
$('btn-hire').addEventListener('click',()=>this.hire());
}

initMap(){
const c=this.mapCan;
c.addEventListener('click',e=>{
const rect=c.getBoundingClientRect();
const mx=(e.clientX-rect.left)/rect.width;
const my=(e.clientY-rect.top)/rect.height;
const w=c.width,h=c.height;
for(const s of this.systems){
const sx=(s.x+30)/60*w;
const sy=(s.y+30)/60*h;
if(Math.hypot(mx*rect.width-sx,my*rect.height-sy)<12){
this.mapSel=s;this.drawMap();this.renderSysDetail();return;
}
}
this.mapSel=null;this.drawMap();this.renderSysDetail();
});
window.addEventListener('resize',()=>this.drawMap());
}

render(){
$('r-c').textContent=fmt(this.c);
$('r-i').textContent='+'+fmt(this.getInc())+'/s';
$('r-f').textContent=fmt(this.inf);
$('r-p').textContent=fmt(this.rep);
$('r-s').textContent=this.ships.length;
$('b-d').textContent=this.ds.filter(d=>d.ok).length;
$('b-e').textContent=this.ev.length;
$('b-f').textContent=this.ships.length;

this.rd();this.re();this.rc();this.rv();this.rl();
this.rinv();this.rshipShop();this.rfleet();this.rsys();this.rmkt();this.rproc();this.rtrade();
}

rd(){
const c=$('d-list');c.innerHTML='';
for(let i=0;i<this.ds.length;i++){
const d=this.ds[i];const e=document.createElement('div');e.className='district'+(d.ok?'':' locked');
const inc=d.ok?(d.inc*d.lv*d.ef*(d.sec/100)).toFixed(1):'0';
e.innerHTML=`<h3>${d.name}<span class="level" style="color:var(--cyan);font-family:monospace">Lv.${d.lv}</span></h3><div class="inc">+${inc} Cr/s</div>`+(d.ok?`
<div class="bar b-ok"><div class="bar-fill" style="width:${d.ef*100}%"></div><div class="sts"><span>Efficiency</span><span>${(d.ef*100).toFixed(0)}%</span></div>
<div class="bar b-bad"><div class="bar-fill" style="width:${d.sec}%"></div><div class="sts"><span>Security</span><span>${d.sec}%</span></div>
<div class="acts"><button class="btn" data-act="upg" data-i="${i}" ${this.c<80*Math.pow(2,d.lv)?'disabled':''}>Upg</button><button class="btn yl" data-act="boost" data-i="${i}">Boost</button><button class="btn mg" data-act="fort" data-i="${i}">Fort</button></div>`:`<p style="font-size:0.7rem;color:var(--dim);margin-bottom:6px">${d.desc}</p><button class="btn" data-act="unlock" data-i="${i}" ${this.c<(d.uc||0)?'disabled':''}>Unlock (${fmt(d.uc||0)} Cr)</button>`);
c.appendChild(e);
}
c.querySelectorAll('button[data-act]').forEach(b=>{
b.addEventListener('click',()=>{
const act=b.dataset.act;const i=parseInt(b.dataset.i);
if(act==='upg')this.upg(i);else if(act==='boost')this.boost(i);else if(act==='fort')this.fort(i);else if(act==='unlock')this.unlock(i);
});
});
}

re(){
const c=$('e-list');
if(this.ev.length===0){c.innerHTML='<p style="color:var(--dim);font-size:0.75rem">No active events.</p>';return}
c.innerHTML='';
for(const e of this.ev){
const x=document.createElement('div');x.className='event'+(e.crit?' crit':'');
x.innerHTML=`<strong>${e.title}</strong><br><span style="color:var(--dim)">${e.desc}</span><div class="acts"><button class="btn yl" data-ev="${e.id}" data-a="pay">Pay ${fmt(e.cost)}</button><button class="btn" data-ev="${e.id}" data-a="fight">Fight</button><button class="btn mg" data-ev="${e.id}" data-a="ignore">Ignore</button></div>`;
c.appendChild(x);
}
c.querySelectorAll('button[data-ev]').forEach(b=>{
b.addEventListener('click',()=>this.resEv(parseFloat(b.dataset.ev),b.dataset.a));
});
}

rc(){
const c=$('c-list');c.innerHTML='';
for(let i=0;i<this.cr.length;i++){
const x=this.cr[i];const e=document.createElement('div');e.className='crew-item';
const s=x.con?`Busy (${Math.ceil(x.con.t)}s)`:'Idle';
e.innerHTML=`<div><div class="nm">${x.n}</div><div style="font-size:0.65rem;color:var(--dim)">C:${x.cm} H:${x.hk} S:${x.st}</div><div class="st ${x.con?'busy':'free'}">${s}</div>`+(x.con?``:`<button class="btn sm" data-crew="${i}">Assign</button>`);
c.appendChild(e);
}
c.querySelectorAll('button[data-crew]').forEach(b=>{
b.addEventListener('click',()=>this.assign(parseInt(b.dataset.crew)));
});
}

rv(){
const c=$('rv-list');c.innerHTML='';
for(const r of this.riv){
const e=document.createElement('div');e.className='rival';
e.innerHTML=`<span class="name" style="color:var(--red)">${r.n}</span><span style="font-family:monospace;color:var(--magenta)">${fmt(r.pw)} pw | ${r.dc} dist</span>`;
c.appendChild(e);
}
}

rl(){
const c=$('log-list');c.innerHTML='';
for(const x of this.lg){
const e=document.createElement('div');e.className='log-e '+x.type;
e.textContent=`[${x.t}] ${x.m}`;c.appendChild(e);
}
}

rinv(){
const c=$('inv-list');c.innerHTML='';
const keys=Object.keys(this.inv).filter(k=>this.inv[k]>0.1);
if(keys.length===0){c.innerHTML='<p style="color:var(--dim);font-size:0.75rem">Empty hold</p>';return}
for(const k of keys){
const e=document.createElement('div');e.className='inv-item';
e.innerHTML=`<div class="inv-name">${MATS[k]?.name||k}</div><div class="inv-amt">${fmt(this.inv[k])}</div>`;
c.appendChild(e);
}
}

rshipShop(){
const c=$('ship-shop');c.innerHTML='';
for(const t of SHIP_TYPES){
const e=document.createElement('div');e.className='ship-card';
e.innerHTML=`<h4>${t.name} <span style="color:var(--yellow);float:right">${fmt(t.cost)} Cr</span></h4><div class="ship-stats"><span>⚡ ${t.spd}</span><span>📦 ${t.cargo}</span><span>⛏ ${t.mine}</span><span>❤ ${t.hp}</span></div><p style="color:var(--dim);font-size:0.7rem;margin-bottom:6px">${t.desc}</p><button class="btn" data-ship="${t.id}" ${this.c<t.cost?'disabled':''}>Purchase</button>`;
c.appendChild(e);
}
c.querySelectorAll('button[data-ship]').forEach(b=>{
b.addEventListener('click',()=>this.buyShip(b.dataset.ship));
});
}

rfleet(){
const c=$('ship-fleet');c.innerHTML='';
if(this.ships.length===0){c.innerHTML='<p style="color:var(--dim);font-size:0.75rem">No ships in fleet</p>';return}
for(let i=0;i<this.ships.length;i++){
const s=this.ships[i];const e=document.createElement('div');e.className='ship-card';
const load=Object.values(s.cargoLoad||{}).reduce((a,b)=>a+b,0);
const status=s.mission?`En route to ${s.mission.sys} (${Math.ceil(s.mission.t)}s)`:'Docked';
const cargoTxt=Object.entries(s.cargoLoad||{}).map(([k,v])=>`${fmt(v)} ${MATS[k]?.name||k}`).join(', ')||'Empty';
e.innerHTML=`<h4>${s.name} <span style="color:var(--dim);font-size:0.7rem">(${status})</span></h4><div class="ship-stats"><span>📦 ${fmt(load)}/${s.cargo}</span><span>❤ ${s.hp}/${s.maxHp}</span></div><div style="color:var(--dim);font-size:0.7rem;margin-bottom:4px">Cargo: ${cargoTxt}</div>${s.mission?``:`<div style="display:flex;gap:4px;flex-wrap:wrap"><button class="btn sm" data-scout="${i}">Scout</button><button class="btn sm mg" data-unload="${i}">Unload</button></div>`}`;
c.appendChild(e);
}
c.querySelectorAll('button[data-scout]').forEach(b=>{
b.addEventListener('click',()=>this.sendScout(parseInt(b.dataset.scout)));
});
c.querySelectorAll('button[data-unload]').forEach(b=>{
b.addEventListener('click',()=>this.unloadCargo(parseInt(b.dataset.unload)));
});
}

rsys(){
const c=$('sys-detail');if(!this.mapSel){c.style.display='none';return}
c.style.display='block';
const s=this.mapSel;
const resTxt=Object.entries(s.res||{}).map(([k,v])=>`${MATS[k]?.name||k}: ${(v*100).toFixed(0)}%`).join(', ')||'None';
const canSend=this.ships.filter(x=>!x.mission);
$('sys-name').textContent=s.name+(s.home?' [HOME]':s.found?' [DISCOVERED]':' [UNKNOWN]');
$('sys-desc').textContent=`Distance: ${s.dist.toFixed(1)} ly | Danger: ${(s.danger*100).toFixed(0)}% | Resources: ${resTxt}`;
const r=$('sys-res');r.innerHTML='';
if(s.found&&canSend.length>0&&Object.keys(s.res||{}).length>0){
const sel=document.createElement('select');sel.style='background:var(--panel);color:var(--text);border:1px solid var(--border);padding:4px;margin-right:6px';
for(const k in s.res){const o=document.createElement('option');o.value=k;o.textContent=MATS[k]?.name||k;sel.appendChild(o)}
const shipSel=document.createElement('select');shipSel.style=sel.style;
for(let i=0;i<this.ships.length;i++)if(!this.ships[i].mission&&this.ships[i].mine>0){const o=document.createElement('option');o.value=i;o.textContent=this.ships[i].name;shipSel.appendChild(o)}
const btn=document.createElement('button');btn.className='btn';btn.textContent='Mine';btn.addEventListener('click',()=>{
if(shipSel.value!=='')this.sendMine(parseInt(shipSel.value),s.name);
});
r.appendChild(document.createTextNode('Ship: '));r.appendChild(shipSel);
r.appendChild(document.createTextNode(' Resource: '));r.appendChild(sel);r.appendChild(btn);
}else if(!s.found){
const p=document.createElement('p');p.style.color='var(--dim)';p.style.fontSize='0.7rem';p.textContent='Send a Scout vessel to discover this system.';r.appendChild(p);
}
}

renderSysDetail(){this.rsys();}

rmkt(){
const c=$('mkt-prices');c.innerHTML='';
for(const k in this.prices){
const p=this.prices[k];const ch=p.hist.length>1?p.cur-p.hist[p.hist.length-2]:0;
const e=document.createElement('div');e.className='price-row';
e.innerHTML=`<span class="price-name">${MATS[k]?.name||k}</span><span><span class="price-val">${p.cur.toFixed(1)} Cr</span><span class="price-change ${ch>=0?'price-up':'price-down'}">${ch>=0?'▲':'▼'} ${Math.abs(ch).toFixed(1)}</span>`;
c.appendChild(e);
}
const s=$('mkt-stocks');s.innerHTML='';
for(let i=0;i<this.stocks.length;i++){
const st=this.stocks[i];const ch=st.hist.length>1?st.price-st.hist[st.hist.length-2]:0;
const e=document.createElement('div');e.className='price-row';
e.innerHTML=`<span class="price-name">${st.name}</span><span><span class="price-val">${st.price.toFixed(1)} Cr</span><span class="price-change ${ch>=0?'price-up':'price-down'}">${ch>=0?'▲':'▼'} ${Math.abs(ch).toFixed(1)}</span>`;
s.appendChild(e);
}
}

rproc(){
const c=$('proc-list');c.innerHTML='';
if(this.proc.length===0){c.innerHTML='<p style="color:var(--dim);font-size:0.75rem">No facilities built</p>';return}
for(let i=0;i<this.proc.length;i++){
const p=this.proc[i];const e=document.createElement('div');e.className='proc-row';
e.innerHTML=`<div><strong>${p.name}</strong> <span style="color:var(--dim);font-size:0.65rem">${p.on?'RUNNING':'STOPPED'}</span></div><div class="input">${MATS[p.input]?.name||p.input} → ${MATS[p.output]?.name||p.output}</div><div class="rate">${p.rate*60}/min</div><button class="btn sm" data-proc="${i}">${p.on?'Stop':'Start'}</button>`;
c.appendChild(e);
}
c.querySelectorAll('button[data-proc]').forEach(b=>{
b.addEventListener('click',()=>this.toggleProc(parseInt(b.dataset.proc)));
});
const b=$('proc-build');b.innerHTML='';
for(const p of PROC_TYPES){
const e=document.createElement('div');e.className='proc-row';
e.innerHTML=`<div><strong>${p.name}</strong> <span style="color:var(--dim);font-size:0.65rem">${p.desc}</span></div><div class="rate">${fmt(p.cost)} Cr</div><button class="btn" data-build="${p.id}" ${this.c<p.cost?'disabled':''}>Build</button>`;
b.appendChild(e);
}
b.querySelectorAll('button[data-build]').forEach(x=>{
x.addEventListener('click',()=>this.buildProc(x.dataset.build));
});
}

rtrade(){
const c=$('trade-term');c.innerHTML='';
for(const k in this.inv){
if(this.inv[k]<1)continue;
const amt=Math.floor(this.inv[k]);
const price=this.prices[k]?.cur||MATS[k]?.base||10;
const e=document.createElement('div');e.className='price-row';
e.innerHTML=`<span>${MATS[k]?.name||k}: <span style="color:var(--yellow)">${fmt(amt)}</span> @ ${price.toFixed(1)} Cr</span><span><button class="btn sm" data-sell="${k}" data-a="1">Sell 1
