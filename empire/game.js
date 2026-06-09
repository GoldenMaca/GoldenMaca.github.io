const $=id=>document.getElementById(id);
const fmt=n=>n<0?'-$'+Math.abs(n).toLocaleString():'$'+n.toLocaleString();
const rnd=(a,b)=>Math.random()*(b-a)+a;
const rInt=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const LOCATIONS={suburban:{rent:1,traffic:0.6,label:'Suburban'},urban:{rent:1.8,traffic:1.0,label:'Urban'},prime:{rent:3.2,traffic:1.5,label:'Prime Downtown'}};

const BIZ_TYPES={
  coffee:{name:'Coffee Shop',startup:15000,baseRent:1200,staff:[{role:'Barista',salary:2800},{role:'Manager',salary:4500}],products:[
    {id:'espresso',name:'Espresso',cost:0.8,basePrice:3.5,demand:1.2},
    {id:'latte',name:'Latte',cost:1.4,basePrice:5.0,demand:1.0},
    {id:'pastry',name:'Pastry',cost:1.0,basePrice:3.0,demand:0.8}
  ],supplies:[{id:'beans',name:'Coffee Beans (lb)',cost:8},{id:'milk',name:'Milk (gal)',cost:4},{id:'flour',name:'Flour (lb)',cost:1.5}]},
  restaurant:{name:'Restaurant',startup:40000,baseRent:3500,staff:[{role:'Chef',salary:5000},{role:'Server',salary:2400},{role:'Host',salary:2200}],products:[
    {id:'entree',name:'Entree',cost:6,basePrice:18,demand:1.0},
    {id:'appetizer',name:'Appetizer',cost:2.5,basePrice:9,demand:0.7},
    {id:'dessert',name:'Dessert',cost:1.5,basePrice:7,demand:0.5}
  ],supplies:[{id:'meat',name:'Meat (lb)',cost:12},{id:'produce',name:'Fresh Produce (lb)',cost:3},{id:'wine',name:'Wine (bottle)',cost:18}]},
  warehouse:{name:'Warehouse & Logistics',startup:80000,baseRent:6000,staff:[{role:'Forklift Op',salary:3200},{role:'Dispatcher',salary:4000},{role:'Warehouse Mgr',salary:5500}],products:[
    {id:'storage',name:'Storage Unit (mo)',cost:15,basePrice:45,demand:1.0},
    {id:'shipping',name:'Shipping Service',cost:8,basePrice:25,demand:0.9}
  ],supplies:[{id:'fuel',name:'Diesel Fuel (gal)',cost:4},{id:'packing',name:'Packing Materials',cost:200},{id:'maint',name:'Vehicle Maintenance',cost:500}]},
  ecommerce:{name:'E-Commerce Store',startup:50000,baseRent:2500,staff:[{role:'Web Dev',salary:6000},{role:'CS Rep',salary:2800},{role:'Marketing',salary:4500}],products:[
    {id:'gadget',name:'Gadget',cost:12,basePrice:35,demand:1.1},
    {id:'accessory',name:'Accessory',cost:5,basePrice:18,demand:0.9},
    {id:'premium',name:'Premium Item',cost:40,basePrice:120,demand:0.6}
  ],supplies:[{id:'inventory',name:'Inventory Restock',cost:500},{id:'hosting',name:'Server Hosting',cost:300},{id:'ads',name:'Ad Campaign',cost:800}]},
  tech:{name:'Tech Startup',startup:200000,baseRent:8000,staff:[{role:'Engineer',salary:8500},{role:'Designer',salary:6500},{role:'Sales',salary:5500}],products:[
    {id:'saas',name:'SaaS License (mo)',cost:2,basePrice:49,demand:1.0},
    {id:'consulting',name:'Consulting (hr)',cost:50,basePrice:200,demand:0.7},
    {id:'api',name:'API Calls (1k)',cost:0.5,basePrice:5,demand:1.2}
  ],supplies:[{id:'cloud',name:'Cloud Services',cost:1200},{id:'tools',name:'Dev Tools',cost:400},{id:'office',name:'Office Supplies',cost:200}]},
  airline:{name:'Airline',startup:5000000,baseRent:45000,staff:[{role:'Pilot',salary:12000},{role:'Flight Attendant',salary:3500},{role:'Ground Crew',salary:2800},{role:'Operations Mgr',salary:7500}],products:[
    {id:'economy',name:'Economy Ticket',cost:80,basePrice:220,demand:1.0},
    {id:'business',name:'Business Class',cost:200,basePrice:650,demand:0.6},
    {id:'cargo',name:'Cargo Space',cost:50,basePrice:150,demand:0.8}
  ],supplies:[{id:'jetfuel',name:'Jet Fuel (gal)',cost:5.5},{id:'catering',name:'In-Flight Catering',cost:15},{id:'insurance',name:'Insurance Premium',cost:8000},{id:'maint',name:'Aircraft Maintenance',cost:12000}]},
  manufacturing:{name:'Manufacturing',startup:300000,baseRent:15000,staff:[{role:'Factory Worker',salary:3200},{role:'Foreman',salary:5000},{role:'Quality Eng',salary:6000}],products:[
    {id:'widget',name:'Widget',cost:3,basePrice:12,demand:1.0},
    {id:'component',name:'Component',cost:8,basePrice:28,demand:0.9},
    {id:'assembly',name:'Assembly',cost:25,basePrice:75,demand:0.7}
  ],supplies:[{id:'rawmat',name:'Raw Materials',cost:2000},{id:'energy',name:'Energy Bill',cost:3000},{id:'machinery',name:'Machinery Lease',cost:5000}]},
  realestate:{name:'Real Estate Firm',startup:250000,baseRent:5000,staff:[{role:'Agent',salary:4000},{role:'Broker',salary:7000},{role:'Marketing',salary:4500}],products:[
    {id:'listing',name:'Listing Fee',cost:50,basePrice:300,demand:0.8},
    {id:'mgmt',name:'Property Mgmt (mo)',cost:100,basePrice:400,demand:1.0},
    {id:'consult',name:'Consultation',cost:30,basePrice:150,demand:0.6}
  ],supplies:[{id:'signage',name:'Signage & Ads',cost:600},{id:'crm',name:'CRM Software',cost:200},{id:'staging',name:'Home Staging',cost:800}]}
};

const FIRST_NAMES=['Alex','Jordan','Taylor','Morgan','Casey','Riley','Quinn','Avery','Skyler','Dakota','Reese','Cameron','Drew','Parker','Hayden'];
const LAST_NAMES=['Chen','Smith','Williams','Johnson','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Anderson','Taylor','Thomas','Jackson'];
const REVIEW_TEMPLATES=[
  {text:'Great value for money!',minPrice:0.7,maxPrice:1.3,stars:5},
  {text:'Prices are a bit steep.',minPrice:1.4,maxPrice:99,stars:3},
  {text:'Amazing quality, would recommend!',minPrice:0.5,maxPrice:1.5,stars:5},
  {text:'Too expensive for what you get.',minPrice:1.5,maxPrice:99,stars:2},
  {text:'Fair pricing and good service.',minPrice:0.8,maxPrice:1.4,stars:4},
  {text:'Cheap but quality could be better.',minPrice:0,maxPrice:0.7,stars:3},
  {text:'Best in town!',minPrice:0.6,maxPrice:1.2,stars:5},
  {text:'Overpriced. Going elsewhere.',minPrice:1.6,maxPrice:99,stars:1},
  {text:'Solid experience.',minPrice:0.8,maxPrice:1.5,stars:4},
  {text:'Worth every penny!',minPrice:0.5,maxPrice:1.3,stars:5}
];

const NEWS_TOPICS=[
  'Inflation rises 0.3% this quarter. Expect higher supply costs.',
  'Consumer spending up in urban areas. Good for retail and food.',
  'Fuel prices spike. Transportation businesses feeling the pinch.',
  'Tech boom continues. SaaS valuations reach new highs.',
  'Housing market cooling. Real estate commissions under pressure.',
  'Supply chain disruptions affect manufacturing sector.',
  'Labor shortage drives wages up across service industries.',
  'New trade deal opens export opportunities for manufacturers.',
  'Interest rates increased by Fed. Loan payments will rise.',
  'Social media trend boosts e-commerce traffic nationwide.'
];

const ASSETS={
  homes:[
    {id:'studio',name:'Studio Apartment',price:180000,rent:1200,prestige:1},
    {id:'condo',name:'Downtown Condo',price:420000,rent:0,prestige:3},
    {id:'house',name:'Suburban House',price:650000,rent:0,prestige:4},
    {id:'mansion',name:'Luxury Mansion',price:2500000,rent:0,prestige:10},
    {id:'penthouse',name:'Penthouse Suite',price:1800000,rent:0,prestige:8}
  ],
  cars:[
    {id:'sedan',name:'Used Sedan',price:12000,prestige:1},
    {id:'sports',name:'Sports Car',price:85000,prestige:4},
    {id:'suv',name:'Luxury SUV',price:70000,prestige:3},
    {id:'supercar',name:'Supercar',price:320000,prestige:8},
    {id:'yacht',name:'Private Yacht',price:1500000,prestige:12}
  ]
};

class Game{
constructor(){
this.cash=25000;this.netWorth=25000;this.credit=680;this.day=1;this.month=0;this.year=2024;
this.speed=0;this.elapsed=0;this.lastTick=performance.now();
this.businesses=[];this.nextBizId=1;
this.loans=[];this.investors=[];this.nextInvId=1;
this.assets=[];this.staff=[];
this.reviews=[];this.socialPosts=[];
this.news=[];
this.selectedBiz=null;this.currentBizTab='products';
this.marketTrends={inflation:1.0,fuelCost:1.0,laborCost:1.0,consumerDemand:1.0,techDemand:1.0};
this.trending=[];
this.load();
this.initUI();
this.loop(performance.now());
}

get dateStr(){return `${MONTHS[this.month]} ${this.year}`}

initUI(){
document.querySelectorAll('.tab-btn').forEach(b=>{
b.addEventListener('click',()=>{
document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
b.classList.add('active');$(`tab-${b.dataset.tab}`).classList.add('active');
});
});
document.querySelectorAll('.time-btn').forEach(b=>{
b.addEventListener('click',()=>{
document.querySelectorAll('.time-btn').forEach(x=>x.classList.remove('active'));
b.classList.add('active');this.speed=parseInt(b.dataset.speed);
});
});
this.renderAssets();
}

loop(now){
const dt=(now-this.lastTick)/1000;this.lastTick=now;
if(this.speed>0){
this.elapsed+=dt*this.speed;
while(this.elapsed>=1){this.elapsed-=1;this.tickDay();}
}
this.updateUI();
requestAnimationFrame(t=>this.loop(t));
}

tickDay(){
this.day++;
if(this.day>30){this.day=1;this.month++;this.monthly();}
if(this.month>11){this.month=0;this.year++;this.yearly();}
this.daily();
}

daily(){
for(const b of this.businesses){
if(!b.open)continue;
let dailyRev=0;
for(const p of b.products){
const ratio=p.price/(p.basePrice||1);
const priceFactor=ratio>1.5?0.3:ratio>1.2?0.6:ratio>0.9?1.0:ratio>0.6?1.3:1.6;
const trend=this.marketTrends[b.type==='tech'?'techDemand':'consumerDemand'];
const traffic=LOCATIONS[b.location].traffic;
const staffBonus=Math.min(1.5,1+(b.staff.length/(BIZ_TYPES[b.type].staff.length+1)));
const demand=clamp(p.demand*priceFactor*trend*traffic*staffBonus*rnd(0.7,1.3),0.1,5);
const units=Math.floor(demand*10*(b.marketing||1));
const supplyKey=this.findSupplyForProduct(b,p);
if(supplyKey&&b.inventory[supplyKey]!==undefined){
const consumed=Math.min(units,b.inventory[supplyKey]);
b.inventory[supplyKey]-=consumed;
dailyRev+=consumed*p.price;
}else{
dailyRev+=units*p.price;
}
p.soldToday=units;
}
b.revenue=dailyRev;
const loc=LOCATIONS[b.location];
const rent=(BIZ_TYPES[b.type].baseRent*loc.rent)/30;
const payroll=b.staff.reduce((a,s)=>a+s.salary/30,0);
const utilities=rent*0.15;
const insurance=(b.insurance||500)/30;
const marketing=(b.marketingBudget||0)/30;
const totalExp=rent+payroll+utilities+insurance+marketing;
b.expenses=totalExp;
b.profit=b.revenue-totalExp;
this.cash+=b.profit;
if(Math.random()<0.08){this.generateReview(b)}
}

for(const inv of this.investors){
inv.daysUntil--;
if(inv.daysUntil<=0){
const payment=inv.quarterlyPayment;
if(this.cash>=payment){
this.cash-=payment;inv.daysUntil=90;this.note(`Paid ${inv.name} ${fmt(payment)}`,'ok');
}else{
inv.missed++;inv.daysUntil=90;
if(inv.missed>=2){this.cash-=inv.seizeAmount;this.cash=Math.max(0,this.cash);this.note(`${inv.name} seized ${fmt(inv.seizeAmount)}!`,'err');}
else{this.note(`Missed payment to ${inv.name}!`,'warn');}
if(inv.missed>=3){this.note(`${inv.name} forced buyout!`,'err');}
}
}
}

if(Math.random()<0.05){this.addNews()}
this.marketTrends.inflation=clamp(this.marketTrends.inflation+rnd(-0.001,0.003),0.8,1.5);
this.marketTrends.fuelCost=clamp(this.marketTrends.fuelCost+rnd(-0.005,0.01),0.6,2.0);
this.marketTrends.consumerDemand=clamp(this.marketTrends.consumerDemand+rnd(-0.01,0.01),0.5,1.5);
this.marketTrends.techDemand=clamp(this.marketTrends.techDemand+rnd(-0.01,0.015),0.5,2.0);
if(this.cash>0&&this.loans.every(l=>l.balance>0))this.credit=Math.min(850,this.credit+0.01);
else if(this.cash<0)this.credit=Math.max(300,this.credit-0.05);
if(this.day%5===0)this.updateTrending();
this.save();
}

monthly(){
for(const b of this.businesses){
if(!b.open)continue;
const loc=LOCATIONS[b.location];
const rent=BIZ_TYPES[b.type].baseRent*loc.rent;
this.cash-=rent;
}
for(const l of this.loans){
if(l.balance<=0)continue;
const interest=l.balance*(l.apr/12);
const principal=l.monthly-interest;
l.balance-=principal;
if(l.balance<=0){l.balance=0;this.note(`Loan paid off!`,'ok');}
this.cash-=l.monthly;
}
for(const a of this.assets){
if(a.rent){this.cash+=a.rent;this.note(`Collected ${fmt(a.rent)} rent from ${a.name}`,'ok');}
}
for(const b of this.businesses){
if(b.staff.length>0&&b.profit<0){
const quitChance=0.05*b.staff.length;
if(Math.random()<quitChance){
const who=pick(b.staff);
b.staff=b.staff.filter(s=>s!==who);
this.note(`${who.name} quit from ${b.name}`,'warn');
}
}
}
}

yearly(){
for(const b of this.businesses){
const base=BIZ_TYPES[b.type].startup;
b.insurance=base*0.02*this.marketTrends.inflation;
this.cash-=b.insurance;
this.note(`${b.name} insurance renewed: ${fmt(Math.floor(b.insurance))}`,'info');
}
const totalDebt=this.loans.reduce((a,l)=>a+l.balance,0);
if(totalDebt>this.netWorth*2)this.credit=Math.max(300,this.credit-20);
else if(totalDebt<this.netWorth*0.3)this.credit=Math.min(850,this.credit+15);
}

findSupplyForProduct(biz,product){
const type=BIZ_TYPES[biz.type];
for(const s of type.supplies){
if(product.name.toLowerCase().includes(s.name.split(' ')[0].toLowerCase()))return s.id;
}
const idx=type.products.indexOf(product);
if(idx<type.supplies.length)return type.supplies[idx].id;
return null;
}

generateReview(b){
const p=pick(b.products);
if(!p)return;
const ratio=p.price/(p.basePrice||1);
let tmpl=REVIEW_TEMPLATES.find(t=>ratio>=t.minPrice&&ratio<=t.maxPrice);
if(!tmpl)tmpl=pick(REVIEW_TEMPLATES);
const stars=Math.max(1,Math.min(5,tmpl.stars+rInt(-1,1)));
const rev={bizId:b.id,bizName:b.name,author:`${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,text:tmpl.text,stars,day:this.day,month:this.month,year:this.year};
this.reviews.unshift(rev);if(this.reviews.length>200)this.reviews.pop();
}

addNews(){
const n=pick(NEWS_TOPICS);
this.news.unshift({text:n,date:this.dateStr});
if(this.news.length>20)this.news.pop();
this.note(`News: ${n}`,'info');
}

updateTrending(){
const tags=['#inflation','#techboom','#fuelsurge','#realestate','#crypto','#labor','#supplychain','#consumer','#startup','#retail'];
this.trending=tags.map(t=>({tag:t,heat:Math.floor(rnd(20,100))})).sort((a,b)=>b.heat-a.heat).slice(0,5);
}

createBusiness(){
const type=$('nb-type').value;
const name=$('nb-name').value||'My Business';
const location=$('nb-location').value;
const bt=BIZ_TYPES[type];
if(this.cash<bt.startup){this.note('Not enough cash to start!','err');return}
this.cash-=bt.startup;
const biz={
id:this.nextBizId++,type,name,location,
open:true,foundDate:`${this.dateStr}`,
revenue:0,expenses:0,profit:0,
products:bt.products.map(p=>({...p,price:p.basePrice,soldToday:0})),
inventory:{},staff:[],marketingBudget:0,marketing:1.0,
insurance:bt.startup*0.02
};
for(const s of bt.supplies){biz.inventory[s.id]=50;}
for(const s of bt.staff){biz.staff.push({...s,name:`${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,morale:100});}
this.businesses.push(biz);
this.selectedBiz=biz;
this.note(`${name} is now open!`,'ok');
this.closeModal();
this.renderBizList();this.renderBizMain();this.renderDash();
}

takeLoan(){
const amt=parseInt($('loan-amt').value)||50000;
const term=parseInt($('loan-term').value)||12;
const apr={12:0.08,24:0.10,36:0.12,60:0.15}[term]||0.10;
const monthly=amt*(apr/12)/(1-Math.pow(1+apr/12,-term));
if(this.credit<600&&amt>50000){this.note('Credit too low for this amount','err');return}
if(this.credit<500){this.note('Credit too low for any loan','err');return}
this.cash+=amt;
this.loans.push({balance:amt,original:amt,apr,term,monthly,remaining:term});
this.credit-=5;
this.note(`Loan approved: ${fmt(amt)}`,'ok');
this.closeModal();this.renderFinance();
}

findInvestor(){
const offers=[];
const names=['Horizon Capital','Apex Ventures','Summit Partners','Meridian Fund','Nova Investments'];
for(let i=0;i<3;i++){
const amt=rInt(50000,500000);
const share=rnd(0.10,0.40);
const ret=rnd(0.08,0.20);
offers.push({id:this.nextInvId++,name:names[i]||pick(names),amount:amt,equity:(share*100).toFixed(1),quarterlyReturn:ret,quarterlyPayment:Math.floor(amt*ret/4),daysUntil:90,missed:0,seizeAmount:Math.floor(amt*0.3)});
}
return offers;
}

acceptInvestor(inv){
if(!inv)return;
this.cash+=inv.amount;
this.investors.push(inv);
this.note(`${inv.name} invested ${fmt(inv.amount)}`,'ok');
this.closeModal();
}

openModal(type){
if(type==='investor'){
const offers=this.findInvestor();
const c=$('investor-offers');c.innerHTML='';
for(const o of offers){
const e=document.createElement('div');e.className='loan-card';
e.innerHTML='<div class="header"><span class="title">'+o.name+'</span><span class="amount">'+fmt(o.amount)+'</span></div><div class="detail">Equity: '+o.equity+'% | Quarterly return: '+(o.quarterlyReturn*100).toFixed(1)+'%</div><div class="detail">Payment: '+fmt(o.quarterlyPayment)+'/quarter</div><button class="btn mt-2" onclick="game.acceptInvestor(game._invOffers['+o.id+'])">Accept</button>';
c.appendChild(e);
}
this._invOffers={};for(const o of offers)this._invOffers[o.id]=o;
}
$(`mod-${type}`).classList.add('on');
}

closeModal(){
document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('on'));
}

hireStaff(bizId,role,salary){
const b=this.businesses.find(x=>x.id===bizId);
if(!b)return;
if(this.cash<salary*2){this.note('Need cash for first month','err');return}
this.cash-=salary*2;
b.staff.push({role,salary,name:`${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,morale:100});
this.note(`Hired ${role} for ${b.name}`,'ok');this.renderBizMain();
}

fireStaff(bizId,idx){
const b=this.businesses.find(x=>x.id===bizId);
if(!b||!b.staff[idx])return;
const s=b.staff[idx];
b.staff.splice(idx,1);
this.cash-=s.salary*0.5;
this.note(`Fired ${s.name} (-${fmt(Math.floor(s.salary*0.5))} severance)`,'warn');
this.renderBizMain();
}

buySupply(bizId,supplyId,qty){
const b=this.businesses.find(x=>x.id===bizId);
if(!b)return;
const bt=BIZ_TYPES[b.type];
const s=bt.supplies.find(x=>x.id===supplyId);
if(!s)return;
const cost=s.cost*qty*this.marketTrends.inflation;
if(this.cash<cost){this.note('Not enough cash','err');return}
this.cash-=cost;
if(!b.inventory[supplyId])b.inventory[supplyId]=0;
b.inventory[supplyId]+=qty;
this.note(`Bought ${qty} ${s.name} for ${fmt(Math.floor(cost))}`,'ok');this.renderBizMain();
}

updatePrice(bizId,prodId,newPrice){
const b=this.businesses.find(x=>x.id===bizId);
if(!b)return;
const p=b.products.find(x=>x.id===prodId);
if(p){p.price=parseFloat(newPrice)||p.basePrice;}
}

updateMarketing(bizId,amt){
const b=this.businesses.find(x=>x.id===bizId);
if(!b)return;
b.marketingBudget=parseInt(amt)||0;
b.marketing=1+Math.min(1,b.marketingBudget/5000);
}

toggleBiz(bizId){
const b=this.businesses.find(x=>x.id===bizId);
if(b){b.open=!b.open;this.renderBizMain();}
}

selectBiz(bizId){
this.selectedBiz=this.businesses.find(x=>x.id===bizId)||null;
this.renderBizList();this.renderBizMain();
}

setBizTab(tab){
this.currentBizTab=tab;this.renderBizMain();
}

buyAsset(category,id){
const list=ASSETS[category];
const a=list.find(x=>x.id===id);
if(!a)return;
if(this.assets.some(x=>x.id===id)){this.note('Already owned!','warn');return}
if(this.cash<a.price){this.note('Not enough cash','err');return}
this.cash-=a.price;
this.assets.push({...a,category,bought:this.dateStr});
this.netWorth+=Math.floor(a.price*0.7);
this.note(`Purchased ${a.name}!`,'ok');this.renderAssets();this.renderDash();
}

sellAsset(idx){
const a=this.assets[idx];
if(!a)return;
const val=Math.floor(a.price*0.6);
this.cash+=val;
this.assets.splice(idx,1);
this.note(`Sold ${a.name} for ${fmt(val)}`,'ok');this.renderAssets();this.renderDash();
}

makePost(){
const content=$('post-content').value.trim();
if(!content){this.note('Write something first','warn');return}
const bizId=parseInt($('post-biz').value)||0;
const biz=bizId?this.businesses.find(x=>x.id===bizId):null;
const post={author:'You',content,bizId,bizName:biz?biz.name:null,likes:rInt(10,500),shares:rInt(0,100),time:'Just now',trending:this.trending.slice(0,2).map(t=>t.tag)};
this.socialPosts.unshift(post);
$('post-content').value='';
this.note('Post published!','ok');this.renderSocial();
if(biz){biz.marketing=Math.min(2,biz.marketing+0.1);setTimeout(()=>{biz.marketing=Math.max(1,biz.marketing-0.1);},30000);}
}

updateUI(){
$('p-cash').textContent=fmt(this.cash);
$('p-worth').textContent=fmt(this.netWorth);
$('p-credit').textContent=Math.floor(this.credit);
$('p-date').textContent=this.dateStr;
this.renderDash();this.renderFinance();this.renderSocial();
if(this.selectedBiz)this.renderBizMain();
}

renderDash(){
const totalRev=this.businesses.reduce((a,b)=>a+(b.open?b.revenue:0),0);
const totalExp=this.businesses.reduce((a,b)=>a+(b.open?b.expenses:0),0);
const totalStaff=this.businesses.reduce((a,b)=>a+b.staff.length,0);
$('d-rev').textContent=fmt(totalRev);
$('d-exp').textContent=fmt(totalExp);
$('d-biz').textContent=this.businesses.length;
$('d-staff').textContent=totalStaff;
const news=$('dash-news');
if(this.news.length===0){news.innerHTML='<p>No recent news.</p>';}
else{news.innerHTML=this.news.slice(0,5).map(n=>`<p style="margin-bottom:4px"><span style="color:var(--accent)">&#9679;</span> ${n.text}</p>`).join('');}
const overview=$('dash-biz-overview');
if(this.businesses.length===0){overview.innerHTML='<div class="empty-state"><div class="icon">&#127970;</div><p>No businesses yet. Start your first venture!</p></div>';return}
overview.innerHTML=this.businesses.map(b=>{
const status=b.open?`<span style="color:var(--success)">OPEN</span>`:`<span style="color:var(--red)">CLOSED</span>`;
return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--panel);border-radius:6px;margin-bottom:8px"><div><strong>${b.name}</strong> <span style="font-size:0.7rem;color:var(--text-dim)">${BIZ_TYPES[b.type].name}</span></div><div style="text-align:right;font-size:0.8rem"><div>${status}</div><div style="color:${b.profit>=0?'var(--success)':'var(--red)'}">${fmt(b.profit)}/day</div></div>`;
}).join('');
}

renderBizList(){
const c=$('biz-list');c.innerHTML='';
for(const b of this.businesses){
const e=document.createElement('div');e.className='biz-card'+(b===this.selectedBiz?' active':'');
e.innerHTML='<div class="title">'+b.name+'<span style="font-size:0.7rem;color:var(--text-dim)">'+(b.open?'&#9679;':'&#9675;')+'</span></div><div class="type">'+BIZ_TYPES[b.type].name+'</div><div class="rev">'+fmt(b.revenue)+'/d</div><div class="exp">'+fmt(b.expenses)+'/d</div>';
e.addEventListener('click',()=>this.selectBiz(b.id));
c.appendChild(e);
}
}

renderBizMain(){
const c=$('biz-main');
if(!this.selectedBiz){c.innerHTML='<div class="empty-state"><div class="icon">&#127970;</div><p>Select a business or start a new one</p></div>';return}
const b=this.selectedBiz;const bt=BIZ_TYPES[b.type];
const status=b.open?'<span class="status open">OPEN</span>':'<span class="status">CLOSED</span>';
let html='<div class="biz-header"><div><h2>'+b.name+'</h2><div style="font-size:0.8rem;color:var(--text-dim)">'+bt.name+' &middot; '+LOCATIONS[b.location].label+' &middot; Founded '+b.foundDate+'</div><div>'+status+'<button class="btn '+(b.open?'red':'gr')+' sm" style="margin-left:8px" onclick="game.toggleBiz('+b.id+')">'+(b.open?'Close':'Reopen')+'</button></div>';

html+='<div class="biz-tabs"><button class="biz-tab '+(this.currentBizTab==='products'?'active':'')+'" onclick="game.setBizTab(\'products\')">Products</button><button class="biz-tab '+(this.currentBizTab==='inventory'?'active':'')+'" onclick="game.setBizTab(\'inventory\')">Inventory & Supplies</button><button class="biz-tab '+(this.currentBizTab==='staff'?'active':'')+'" onclick="game.setBizTab(\'staff\')">Staff</button><button class="biz-tab '+(this.currentBizTab==='analytics'?'active':'')+'" onclick="game.setBizTab(\'analytics\')">Analytics</button><button class="biz-tab '+(this.currentBizTab==='reviews'?'active':'')+'" onclick="game.setBizTab(\'reviews\')">Reviews</button></div>';

if(this.currentBizTab==='products'){
html+='<div class="panel"><h2>Products & Pricing</h2>';
for(const p of b.products){
const margin=((p.price-p.cost)/p.price*100).toFixed(0);
html+='<div class="product-row"><div class="product-info"><div class="product-name">'+p.name+'</div><div class="product-meta">Cost: $'+p.cost.toFixed(2)+' | Margin: '+margin+'% | Sold today: '+(p.soldToday||0)+'</div><div class="product-price"><span style="font-family:monospace">$</span><input type="number" step="0.01" value="'+p.price.toFixed(2)+'" onchange="game.updatePrice('+b.id+',\''+p.id+'\',this.value)"></div>';
}
html+='</div><div class="panel"><h2>Marketing Budget</h2><div class="flex items-center gap-2"><span style="font-size:0.8rem;color:var(--text-dim)">Monthly:</span><input type="range" min="0" max="20000" step="100" value="'+(b.marketingBudget||0)+'" oninput="document.getElementById(\'mkt-val\').textContent=\'$\'+parseInt(this.value).toLocaleString();game.updateMarketing('+b.id+',this.value)" style="flex:1"><span id="mkt-val" style="font-family:monospace;font-size:0.9rem;min-width:70px">$'+(b.marketingBudget||0).toLocaleString()+'</span></div><p style="font-size:0.75rem;color:var(--text-dim);margin-top:6px">Higher marketing increases customer traffic and sales.</p></div>';
}
else if(this.currentBizTab==='inventory'){
html+='<div class="panel"><h2>Current Inventory</h2>';
const invKeys=Object.keys(b.inventory);
if(invKeys.length===0){html+='<p class="empty-state">No inventory yet.</p>';}
else{
for(const k of invKeys){
const s=bt.supplies.find(x=>x.id===k);
html+='<div class="inv-row"><span class="inv-name">'+(s?s.name:k)+'</span><span class="inv-amt">'+(Math.floor(b.inventory[k])).toLocaleString()+'</span></div>';
}
}
html+='</div><div class="panel"><h2>Order Supplies</h2>';
for(const s of bt.supplies){
html+='<div class="product-row"><div class="product-info"><div class="product-name">'+s.name+'</div><div class="product-meta">$'+s.cost.toFixed(2)+' each (inflated: $'+(s.cost*this.marketTrends.inflation).toFixed(2)+')</div></div></div>';
