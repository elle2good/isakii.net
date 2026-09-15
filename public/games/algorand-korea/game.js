const screens = {
 '1':{node:'360:148',next:'2'},
 '2':{node:'373:227',next:'3',title:'INTRODUCTION',y:350,text:'This playable case study is based on a real community marketing campaign executed from March 9th, 2025 to March 24th, 2025.'},
 '3':{node:'374:285',next:'4',title:'INTRODUCTION',y:374,text:'Before we begin...'},
 '4':{node:'374:296'},
 '5':{node:'374:376',next:'7',text:'Great! I’ll see you back in time - January 31st, 2025.'},
 '5.1':{node:'374:455',next:'5.3',text:'Marketing focuses on Brand ↔ Customer relationships.'},
 '5.3':{node:'374:477',next:'5.4',text:'Community marketing focuses on developing a funnel of  Brand ↔ Customer ↔ Customers'},
 '5.4':{node:'374:488',next:'5.5',text:'But the two look very similar on the surface - you’ll see.'},
 '5.5':{node:'374:499',next:'7',text:'I’ll see you back in time - January 31st, 2025.'},
 '7':{node:'374:510',next:'end'},end:{}
};
const scene=document.querySelector('#scene'),prev=document.querySelector('#previous'),next=document.querySelector('#next'),pause=document.querySelector('#pause'),status=document.querySelector('#status'),playback=document.querySelector('#playback'),bar=document.querySelector('#progress i');
let current='1',history=[],paused=false,elapsed=0,last=0,duration=0,transitionDelay=0,ready=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const readingTime=text=>Math.max(3000,(text.trim().split(/\s+/u).length/200)*60000+1200);
function world(s,opening=false){return `<div class="world ${opening?'opening':''}"><img class="background" src="assets/seoul.png" alt="Pixel-art Seoul at night"><div class="shade"></div><img class="actor" src="assets/manager.png" alt="Community and campaign manager"><p class="location">SEOUL, SOUTH KOREA</p><p class="role">01 /<br>Community &amp; Campaign manager</p>${opening?'<img class="actor member" src="assets/member.png" alt="Community member"><p class="role member-role">02 /<br>Community member &amp; user</p><h1>One Campaign,<br>Two Perspectives.</h1>':s.text?`<div class="speech ${s.title?'intro':''}" ${s.y?`style="top:${s.y}px"`:''}>${s.title?`<h2>${s.title}</h2>`:''}<p>${s.text}</p></div>`:''}</div>`;}
function render(animate=true,walkIn=false){const s=screens[current]; elapsed=0;last=performance.now();ready=false;duration=0;transitionDelay=0;scene.dataset.screen=current;scene.dataset.nodeId=s.node||'';document.querySelector('nav').hidden=current==='1';document.querySelector('aside').hidden=current==='1';
 if(current==='1'){scene.innerHTML=world(s,true)+'<button class="start" id="start"><img src="assets/play.svg" alt="">PRESS START</button>';document.querySelector('#start').onclick=advance;}
 else if(current==='4'){scene.innerHTML=world(s)+'<div class="darken"></div><section class="move" aria-labelledby="move-title"><h2 id="move-title">Your Move #1</h2><p>Do you know the difference between marketing and community marketing?</p><button class="answer" id="yes" disabled>YES</button><button class="answer no" id="no" disabled>NO</button></section>';document.querySelector('#yes').onclick=()=>choose('yes');document.querySelector('#no').onclick=()=>choose('no');transitionDelay=reduced?0:1250;}
 else if(current==='7'){scene.innerHTML=world({})+'<p class="countdown" aria-live="polite">Continuing in 3...</p>';scene.querySelector('.world').classList.add('spotlight');if(animate&&!reduced){scene.querySelector('.world').classList.add('arrive');scene.querySelector('.countdown').classList.add('enter');transitionDelay=1150;}duration=3000;}
 else if(current==='end'){scene.innerHTML=`<section class="end"><h1>Stay updated on the release of the full game!</h1><form id="newsletter"><label for="email">Your email address</label><div class="signup-row"><input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="254"><button type="submit">Keep me Updated</button></div><p id="signup-message" role="status" aria-live="polite"></p></form><div class="end-actions"><button class="replay" id="replay">Replay</button><a class="home-link" href="/?preview=Algorand-staking-korea-campaign#projects" target="_top">Go back to isakii.net</a></div></section>`;document.querySelector('#replay').onclick=restart;document.querySelector('#newsletter').onsubmit=subscribe;}
 else {scene.innerHTML=world(s);duration=readingTime((s.title?s.title+' ':'')+s.text);}
 if(walkIn&&!reduced){scene.classList.add('walk-in');transitionDelay=1500;}else scene.classList.remove('walk-in');
 prev.disabled=history.length===0;next.className=['4','7'].includes(current)?'skip':'';next.innerHTML=next.className?'SKIP<img src="assets/skip.svg" alt=""><img src="assets/skip.svg" alt="">':'<img src="assets/next.svg" alt=""><span class="sr-only">Next</span>';next.setAttribute('aria-label',next.className?'Skip':'Next screen');next.disabled=current==='end'||current==='4';playback.hidden=['1','4','end'].includes(current);pause.textContent=paused?'Resume':'Pause';pause.setAttribute('aria-label',paused?'Resume automatic playback':'Pause automatic playback');bar.style.transform='scaleX(0)';updateStatus();}
function go(id){if(!screens[id])return;const walkIn=current==='1'&&id==='2';history.push(current);current=id;render(true,walkIn);}
function choose(choice){if(current!=='4'||!ready)return;go(choice==='no'?'5.1':'5');}
function advance(){if(current==='4'){choose('yes');return;}if(screens[current].next)go(screens[current].next);}
function back(){if(!history.length)return;current=history.pop();render(false);}
function restart(){current='1';history=[];paused=false;render(false);}
async function subscribe(event){
 event.preventDefault();const form=event.currentTarget,button=form.querySelector('button'),message=form.querySelector('#signup-message');
 if(button.disabled)return;button.disabled=true;button.textContent='SUBSCRIBING…';message.textContent='';
 try{const response=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:String(new FormData(form).get('email')||'').trim()})});const data=await response.json();if(!response.ok||!data.registered)throw new Error(data.error||'We could not complete the subscription.');message.textContent='You’re subscribed.';button.textContent='SUBSCRIBED';form.reset();}
 catch(error){message.textContent=error.message||'We could not complete the subscription.';button.disabled=false;button.textContent='TRY AGAIN';}
}
function updateStatus(){if(!duration)return;const left=Math.max(0,Math.ceil((duration-Math.max(0,elapsed-transitionDelay))/1000));status.textContent=paused?'Playback paused':`Next in ${left}s`;bar.style.transform=`scaleX(${Math.min(1,Math.max(0,(elapsed-transitionDelay)/duration))})`;if(current==='7')scene.querySelector('.countdown').textContent=`Continuing in ${Math.max(1,left)}...`;}
function tick(now){const delta=Math.min(now-last,100);last=now;if(!document.hidden){if(current==='4'){elapsed+=delta;if(!ready&&elapsed>=transitionDelay){ready=true;scene.querySelector('.move').classList.add('ready');scene.querySelectorAll('.answer').forEach(b=>b.disabled=false);next.disabled=false;}}else if(!paused&&duration){elapsed+=delta;updateStatus();if(elapsed>=duration+transitionDelay)advance();}}requestAnimationFrame(tick);}
prev.onclick=back;next.onclick=advance;pause.onclick=()=>{paused=!paused;pause.textContent=paused?'Resume':'Pause';pause.setAttribute('aria-label',paused?'Resume automatic playback':'Pause automatic playback');updateStatus();};document.querySelector('#restart').onclick=restart;
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();advance();}if(e.key==='ArrowLeft'){e.preventDefault();back();}if(e.code==='Space'&&e.target===document.body&&!playback.hidden){e.preventDefault();pause.click();}});
function resize(){const scale=innerWidth/1440;document.documentElement.style.setProperty('--scale',scale);document.documentElement.style.setProperty('--canvas-height',`${innerHeight/scale}px`);}addEventListener('resize',resize);resize();
await document.fonts.ready;await Promise.all([...document.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));render(false);requestAnimationFrame(tick);
