'use strict';
(async () => {
 const grid=document.querySelector('#comparison-grid'), tabs=document.querySelector('#case-tabs'), view=document.querySelector('#view-select'), mode=document.querySelector('#playback-mode'), play=document.querySelector('#play-all'), status=document.querySelector('#video-status');
 let data, selected=0, playing=false, generation=0;
 const videos=()=>[...grid.querySelectorAll('video')];
 function pause(){generation++;videos().forEach(v=>v.pause());playing=false;play.textContent='Play all';}
 function render(){pause();grid.replaceChildren();const item=data.cases[selected];
  tabs.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
  item.methods.forEach(method=>{const card=document.createElement('article');card.className='video-card'+(method.id==='deformsmith'?' ours':'');const title=document.createElement('h3');title.textContent=method.label;const detail=method.id==='deformsmith'&&mode.value==='detail',media=(detail?method.detail.views:method.views)[Number(view.value)],v=document.createElement('video');v.src=media.src;v.poster=media.poster;v.controls=true;v.muted=true;v.playsInline=true;v.preload='metadata';v.setAttribute('aria-label',item.label+' — '+method.label+' — '+view.selectedOptions[0].text);v.addEventListener('error',()=>{status.textContent='A video could not load. Please reload the page.'});v.addEventListener('ended',()=>{if(videos().every(x=>x.ended||x.paused)){playing=false;play.textContent='Play all'}});const note=document.createElement('p');note.className='playback-note';note.textContent=detail?'1/16× speed · 5 s clip':'Original speed · 5 s simulation';card.append(title,v,note);grid.append(card)});
  status.textContent=item.label+' · '+view.selectedOptions[0].text+' view · '+(mode.value==='detail'?'DeformSmith: slow motion; baselines: original playback.':'All methods: original simulation and playback speed.');
 }
 try{const response=await fetch('assets/data.json');if(!response.ok)throw Error('Media index unavailable');data=await response.json();data.cases.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className='case-tab';b.textContent=item.label;b.addEventListener('click',()=>{selected=i;render()});tabs.append(b)});render();}catch(e){status.textContent='Comparison videos could not load. Please reload the page.';play.disabled=true;}
 view.addEventListener('change',()=>{if(data)render()});
 mode.addEventListener('change',()=>{if(data)render()});
 play.addEventListener('click',async()=>{if(playing){pause();return}const token=++generation,vs=videos();vs.forEach(v=>{v.currentTime=0});playing=true;play.textContent='Pause all';const results=await Promise.allSettled(vs.map(v=>v.play()));if(token!==generation)return;if(results.some(r=>r.status==='rejected')){pause();status.textContent='Use the individual video controls to start playback.'}});
 document.querySelector('#reset-all').addEventListener('click',()=>{pause();videos().forEach(v=>{v.currentTime=0})});
 document.querySelector('#copy-citation').addEventListener('click',async()=>{const text=document.querySelector('#citation').textContent,out=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(text);out.textContent='Citation copied.'}catch(e){const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('#citation'));selection.removeAllRanges();selection.addRange(range);out.textContent='Citation selected. Press Ctrl+C or Command+C to copy.'}});
})();

(async () => {
 const grid=document.querySelector('#robot-grid'),tabs=document.querySelector('#robot-tabs'),status=document.querySelector('#robot-status'),play=document.querySelector('#robot-play'),reset=document.querySelector('#robot-reset'),sequence=document.querySelector('#robot-sequence');
 if(!grid)return;
 let token=0,selected=0,data;
 const videos=()=>[...grid.querySelectorAll('video')];
 function pause(){token++;videos().forEach(v=>v.pause());play.textContent='Play both';}
 function render(){
  pause();const item=data.cases[selected];grid.replaceChildren();
  tabs.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
  const input=document.createElement('article');input.className='robot-input';const heading=document.createElement('h3');heading.textContent=item.input.kind==='image'?'Image prompt':'Text prompt';const content=document.createElement('div');content.className='robot-input-content';
  if(item.input.kind==='image'){
   const img=document.createElement('img');img.src=item.input.src;img.alt='Original input image: '+item.input.prompt;const target=document.createElement('p');target.className='robot-target';const label=document.createElement('span');label.textContent='Target';target.append(label,document.createTextNode(item.input.prompt));content.append(img,target);
  }else{const quote=document.createElement('blockquote');quote.textContent='“'+item.input.prompt+'”';content.append(quote)}
  input.append(heading,content);grid.append(input);
  item.views.forEach((media,i)=>{
   const card=document.createElement('figure'),title=document.createElement('h3'),video=document.createElement('video'),caption=document.createElement('figcaption');title.textContent=i===0?'Scene':'Detail';video.src=media.src;video.poster=media.poster;video.controls=true;video.muted=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',item.label+' — '+title.textContent);caption.textContent=i===0?'Robot and reconstructed scene':'Object deformation and gripper geometry';
   video.addEventListener('error',()=>{status.textContent='A robot video could not load. Please reload the page.'});video.addEventListener('ended',()=>{if(videos().every(v=>v.ended||v.paused))play.textContent='Play both'});card.append(title,video,caption);grid.append(card);
  });
  sequence.hidden=!item.sequence;if(item.sequence)sequence.src=item.sequence;
  status.textContent=item.label+' · Original playback speed';
 }
 play.addEventListener('click',async()=>{
  if(videos().some(v=>!v.paused&&!v.ended)){pause();return}
  const current=++token,vs=videos();vs.forEach(v=>{v.currentTime=0});play.textContent='Pause both';const result=await Promise.allSettled(vs.map(v=>v.play()));if(current!==token)return;
  if(result.some(r=>r.status==='rejected')){pause();status.textContent='Use the individual video controls to start playback.'}
 });
 reset.addEventListener('click',()=>{pause();videos().forEach(v=>{v.currentTime=0})});
 try{
  const response=await fetch('assets/robots.json');if(!response.ok)throw Error('Robot media index unavailable');data=await response.json();
  data.cases.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.className='case-tab';button.textContent=item.label;button.addEventListener('click',()=>{selected=i;render()});tabs.append(button)});render();
 }catch(e){status.textContent='Showing the original Teddy example. Additional robot examples could not load.'}
})();
