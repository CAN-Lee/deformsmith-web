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
