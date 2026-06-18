const screen = document.getElementById('screen');
let step = 0;
let answers = [];

const questions = [
  { title:'Cuando quieres hablar con alguien nuevo...', options:[['Hablo sin pensarlo mucho',0,'user'],['Pienso un poco qué decir',1,'shield'],['Ensayo varias respuestas en mi cabeza',2,'brain'],['Prefiero no hablar',3,'cloud']] },
  { title:'Antes de enviar un mensaje importante...', options:[['Lo envío rápidamente',0,'phone'],['Lo reviso una vez',1,'link'],['Lo edito varias veces',2,'edit'],['Lo dejo en borrador',3,'drop']] },
  { title:'En una reunión o clase...', options:[['Participo normalmente',0,'square'],['Espero el momento adecuado',1,'pin'],['Pienso demasiado antes de intervenir',2,'brain'],['Evito participar',3,'circle']] },
  { title:'Después de una conversación...', options:[['Sigo con mi día',0,'doc'],['Pienso en algunos detalles',1,'smile'],['Analizo todo lo que dije',2,'alert'],['Me preocupo por horas',3,'circle']] },
  { title:'Cuando conoces nuevas personas...', options:[['Me siento cómodo',0,'user'],['Un poco nervioso',1,'heart'],['Bastante nervioso',2,'group'],['Muy nervioso',3,'heart']] }
];

function logo(size='normal'){
  return `<div class="logo ${size==='small'?'quiz-logo':''}">
    <svg class="logo-mark" viewBox="0 0 160 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="16" r="8" fill="#7657f6"/><circle cx="44" cy="32" r="7" fill="#4fa4f4"/><circle cx="117" cy="34" r="7" fill="#68ceb6"/>
      <path d="M36 72c8-24 28-35 44-22 17-14 38-2 46 22" stroke="#764ff6" stroke-width="8" stroke-linecap="round"/>
      <path d="M20 80c9-28 31-42 53-25v32H20z" fill="#4696ee" opacity=".95"/><path d="M87 55c22-17 44-3 53 25H87z" fill="#6ecdb3" opacity=".95"/>
      <path d="M44 22 80 16 117 26" stroke="#9f8cff" stroke-width="4" stroke-linecap="round"/><path d="M80 16v32" stroke="#9f8cff" stroke-width="4"/>
    </svg>
    <div class="logo-text">SynConnect <span>AI</span></div><div class="tagline">Conectamos mentes, impulsamos bienestar</div>
  </div>`;
}
function icon(name){
  const common='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
  const p={user:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',brain:'<path d="M9 6a3 3 0 0 1 6 0 3 3 0 0 1 3 3c0 1-.5 2-1.3 2.5A3.5 3.5 0 0 1 13 18H7a3 3 0 0 1-1-5.8A3.5 3.5 0 0 1 9 6z"/>',cloud:'<path d="M18 18H8a4 4 0 1 1 .7-7.9A5 5 0 0 1 18 12a3 3 0 0 1 0 6z"/>',phone:'<rect x="7" y="2" width="10" height="20" rx="2"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',drop:'<path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/>',square:'<rect x="5" y="5" width="14" height="14" rx="2"/>',pin:'<path d="M12 22s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12z"/><circle cx="12" cy="10" r="2"/>',circle:'<circle cx="12" cy="12" r="9"/>',doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',alert:'<path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',group:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'};
  return `<svg ${common}>${p[name]||p.circle}</svg>`
}
function home(){
  step=0;answers=[];
  screen.innerHTML=`<div class="screen-inner">${logo()}
    <h1 class="hero-title">¿Piensas<br>demasiado antes<br>de <span>hablar?</span></h1>
    <p class="hero-copy">Descubre en menos de 1 minuto cómo el sobrepensamiento puede estar afectando tu confianza social.</p>
    <div class="benefits"><div class="benefit"><span class="benefit-icon">✓</span>Resultado inmediato</div><div class="benefit"><span class="benefit-icon">✓</span>100% privado</div><div class="benefit"><span class="benefit-icon blue">◎</span>Basado en situaciones cotidianas</div></div>
    <button class="btn" onclick="renderQuestion(0)">Comenzar Test <span class="arrow">→</span></button><div class="time"><span class="clock"></span>Toma 1 minuto</div>
  </div>`;
}
function renderQuestion(i){
  step=i; const q=questions[i];
  screen.innerHTML=`<div class="quiz-inner"><div class="topbar"><button class="back" onclick="${i===0?'home()':'renderQuestion('+(i-1)+')'}">‹</button>${logo('small')}</div><div class="step">${i+1} / 5</div><div class="progress"><div class="progress-fill" style="width:${((i+1)/5)*100}%"></div></div><div class="question-card"><h2 class="question-title">${q.title}</h2>${q.options.map((o,idx)=>`<button class="option ${answers[i]===idx?'selected':''}" onclick="selectOption(${i},${idx},${o[1]})">${icon(o[2])}<span>${o[0]}</span><span class="radio"></span></button>`).join('')}<button class="btn small" onclick="nextQuestion()">${i===4?'Ver resultados':'Siguiente'} <span class="arrow">→</span></button></div></div>`;
}
function selectOption(qidx,idx,score){
  answers[qidx]=idx;
  answers['score'+qidx]=score;
  document.querySelectorAll('.option').forEach((el, optionIndex)=>{
    el.classList.toggle('selected', optionIndex === idx);
  });
}
function nextQuestion(){ if(answers[step]===undefined){return} if(step<4) renderQuestion(step+1); else loading(); }
function loading(){
  screen.innerHTML=`<div class="loading-inner">${logo('small')}<div class="big-logo-circle">${logoMarkOnly()}</div><h2 class="loading-title">Analizando tus<br>respuestas...</h2><div class="loading-sub">Esto tomará algunos segundos</div><div class="loadbar"><span></span></div><div class="percent">75%</div></div>`;
  setTimeout(result,1200);
}
function logoMarkOnly(){return `<svg class="logo-mark" viewBox="0 0 160 105" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="16" r="8" fill="#7657f6"/><circle cx="44" cy="32" r="7" fill="#4fa4f4"/><circle cx="117" cy="34" r="7" fill="#68ceb6"/><path d="M36 72c8-24 28-35 44-22 17-14 38-2 46 22" stroke="#764ff6" stroke-width="8" stroke-linecap="round"/><path d="M20 80c9-28 31-42 53-25v32H20z" fill="#4696ee"/><path d="M87 55c22-17 44-3 53 25H87z" fill="#6ecdb3"/><path d="M44 22 80 16 117 26" stroke="#9f8cff" stroke-width="4" stroke-linecap="round"/><path d="M80 16v32" stroke="#9f8cff" stroke-width="4"/></svg>`}
function getProfile(){
  const total=[0,1,2,3,4].reduce((s,i)=>s+(answers['score'+i]??0),0);
  if(total<=3) return {cls:'green',emoji:'🙂',title:'Conector Natural',copy1:'Tiendes a actuar más de lo que sobrepiensas.',copy2:'Aun así, practicar habilidades sociales puede ayudarte a conectar con mayor confianza.',btn:'Recibir mis resultados por correo',next:'thanks'};
  if(total<=6) return {cls:'yellow',emoji:'🥺',title:'Pensador Social',copy1:'Tiendes a analizar tus interacciones antes de actuar.',copy2:'Es algo común y puede ser una fortaleza, aunque a veces puede frenarte.',btn:'Descubre estrategias para hablar con más confianza',next:'home'};
  if(total<=10) return {cls:'orange',emoji:'😟',title:'Sobreanalizador',copy1:'Piensas mucho antes de hablar y esto podría estar limitando algunas oportunidades sociales.',copy2:'La buena noticia es que estas habilidades pueden entrenarse.',btn:'Ver mi guía gratuita',next:'thanks'};
  return {cls:'red',emoji:'☹️',title:'Explorador de Confianza',copy1:'Parece que el miedo al error o al rechazo puede estar afectando tu forma de interactuar.',copy2:'No estás solo. Muchas personas experimentan algo similar.',btn:'Obtén tu plan gratuito de primeros pasos',next:'thanks'};
}
function result(){
  const p=getProfile();
  screen.innerHTML=`<div class="result-inner">${logo('small')}<div class="result-box ${p.cls}-box"><div class="mood"><span class="sparkles"></span>${p.emoji}</div><h2 class="result-title ${p.cls}-title">${p.title}</h2><p class="result-copy">${p.copy1}</p><p class="result-copy second">${p.copy2}</p><button class="btn small" onclick="${p.next==='thanks'?'thanks()':'home()'}">${p.btn} <span class="arrow">→</span></button></div>${p.cls==='yellow'?infoBlock():''}</div>`;
}
function infoBlock(){return `<div class="info-section"><h3 class="info-title">¿Por qué este test es para ti?</h3><div class="info-grid"><div class="info-card"><div class="info-circle">◷</div><div><b>Rápido y sencillo</b><p>Solo 1 minuto para conocerte mejor.</p></div></div><div class="info-card"><div class="info-circle">🔒</div><div><b>100% privado</b><p>Tus respuestas son confidenciales.</p></div></div></div></div><div class="wave"></div>`}
function thanks(){
  screen.innerHTML=`<div class="thanks-inner">${logo('small')}<div class="mail-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></div><h2 class="thanks-title">¡Gracias por<br>completar el test!</h2><p class="thanks-copy">Hemos enviado tus resultados y recursos recomendados a tu correo.<br><br>Empieza hoy tu camino hacia conexiones más auténticas.</p><div class="heart-doodle">♡</div><button class="btn small" onclick="window.location.href='../index.html'">⌂ Volver al inicio</button></div>`;
}
home();

/* Floating SynConnect chatbot with improved default questions */
(function(){
  const bot = document.querySelector('.scbot');
  if(!bot) return;
  const toggle = bot.querySelector('.scbot-toggle');
  const panel = bot.querySelector('.scbot-panel');
  const close = bot.querySelector('.scbot-close');
  const messages = bot.querySelector('.scbot-messages');
  const suggestions = bot.querySelector('.scbot-suggestions');
  const form = bot.querySelector('.scbot-form');
  const input = bot.querySelector('input');

  const qa = [
    { q:'¿Qué es SynConnect AI?', a:'SynConnect AI es un coach social con IA pensado para ayudarte a conocerte mejor, practicar conversaciones y ganar confianza en situaciones sociales reales. No reemplaza terapia profesional, pero sí puede orientarte con ejercicios y recomendaciones iniciales.' },
    { q:'¿Cómo funciona el test?', a:'El test te hace preguntas cortas sobre cómo reaccionas en situaciones sociales. Con tus respuestas, SynConnect identifica un perfil inicial y te muestra recomendaciones personalizadas para empezar a mejorar paso a paso.' },
    { q:'¿Cuánto dura?', a:'El test está diseñado para completarse rápido: normalmente toma entre 1 y 2 minutos. La idea es que puedas recibir una primera orientación sin hacerlo pesado.' },
    { q:'¿Es gratis?', a:'Sí. En esta versión, el test es 100% gratuito. Puedes iniciarlo desde cualquier botón de “Realizar Test” en la página.' },
    { q:'¿Mis respuestas son privadas?', a:'La experiencia está planteada como privada y segura. Tus respuestas se usan para generar una orientación dentro del test. Evita ingresar datos sensibles como contraseñas, documentos o información bancaria.' },
    { q:'¿Qué perfiles existen?', a:'Los perfiles principales son Conector Natural, Pensador Social, Sobreanalizador y Explorador. Cada uno representa una forma distinta de vivir las interacciones sociales y recibe recomendaciones diferentes.' },
    { q:'¿Qué hace el Coach IA?', a:'El Coach IA simula conversaciones, te propone frases para iniciar o responder, y te ayuda a practicar escenarios como networking, presentaciones, reuniones o conocer nuevas personas.' },
    { q:'Quiero empezar el test', a:'Perfecto. Presiona “Realizar Test” para entrar al cuestionario. Si estás en la página principal, también puedes usar el botón morado de la parte superior.' }
  ];

  const normalize = (txt) => txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  function addMessage(text, who='bot'){
    const div = document.createElement('div');
    div.className = 'scbot-msg ' + who;
    div.textContent = text;
    messages.appendChild(div);
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
  }

  function typing(){
    const t = document.createElement('div');
    t.className = 'scbot-typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    messages.appendChild(t);
    requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
    return t;
  }

  function answerFor(text){
    const n = normalize(text);

    // Respuestas pensadas para preguntas naturales usadas en la demo.
    if(n.includes('para que sirve') || n.includes('sirve esta pagina') || n.includes('esta pagina') || n.includes('pagina') || n.includes('plataforma')) {
      return 'Esta página sirve para presentar SynConnect AI: una herramienta que te ayuda a conocer tu nivel de confianza social, identificar tu perfil y recibir recomendaciones para mejorar la forma en que interactúas con otras personas.';
    }
    if((n.includes('explicar') || n.includes('explicame') || n.includes('como funciona') || n.includes('como es')) && n.includes('test')) {
      return 'Claro. El test te muestra situaciones sociales comunes y tú eliges la opción que más se parece a cómo reaccionas. Al final, SynConnect analiza tus respuestas y te muestra un perfil social con recomendaciones iniciales.';
    }
    if(n.includes('informacion') || n.includes('info') || n.includes('guarda') || n.includes('guardan') || n.includes('privad') || n.includes('datos') || n.includes('segur') || n.includes('correo')) {
      return 'Tus respuestas se usan para calcular tu resultado dentro del test y darte una orientación personalizada. La idea de la plataforma es mantener la experiencia privada; además, no debes ingresar datos sensibles como contraseñas, documentos o información bancaria.';
    }
    if(n.includes('despues') || n.includes('luego') || n.includes('terminar') || n.includes('termino') || n.includes('completar') || n.includes('complete')) {
      return 'Después del test puedes revisar tu perfil social, entender tus fortalezas y áreas de mejora, y usar las recomendaciones o el Coach IA para practicar situaciones sociales de forma gradual.';
    }

    if(n.includes('empezar') || n.includes('comenzar') || n.includes('iniciar') || n.includes('hacer test') || n.includes('realizar test')) return qa[7].a;
    if(n.includes('gratis') || n.includes('precio') || n.includes('pagar') || n.includes('costo') || n.includes('cuesta')) return qa[3].a;
    if(n.includes('perfil') || n.includes('conector') || n.includes('pensador') || n.includes('sobreanalizador') || n.includes('explorador')) return qa[5].a;
    if(n.includes('coach') || n.includes('ia') || n.includes('practicar') || n.includes('conversacion') || n.includes('simula')) return qa[6].a;
    if(n.includes('dura') || n.includes('tiempo') || n.includes('minuto') || n.includes('rapido')) return qa[2].a;
    if(n.includes('funciona') || n.includes('preguntas') || n.includes('resultado') || n.includes('test')) return qa[1].a;
    if(n.includes('ansiedad') || n.includes('timidez') || n.includes('nervios') || n.includes('miedo')) return 'SynConnect puede ayudarte a reconocer patrones como sobrepensar, evitar reuniones, revisar conversaciones pasadas o sentir miedo al rechazo. A partir de eso, te sugiere ejercicios y prácticas para avanzar gradualmente.';
    if(n.includes('hola') || n.includes('buenas') || n.includes('ayuda')) return '¡Hola! Soy el asistente de SynConnect AI. Puedes preguntarme sobre el test, privacidad, perfiles o qué hacer después de completar la evaluación.';
    if(n.includes('synconnect') || n.includes('que es') || n.includes('qué es')) return qa[0].a;
    return 'Puedo ayudarte con dudas sobre SynConnect AI, el test de confianza social, privacidad, perfiles y recomendaciones. Prueba preguntarme, por ejemplo: “¿Para qué sirve esta página?” o “¿Qué puedo hacer después del test?”.';
  }

  function botReply(text){
    const t = typing();
    const reply = answerFor(text);
    const delay = Math.min(950, Math.max(420, reply.length * 7));
    setTimeout(() => { t.remove(); addMessage(reply, 'bot'); }, delay);
  }

  function renderChips(){
    suggestions.innerHTML = '';
    qa.forEach(item => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'scbot-chip';
      b.textContent = item.q;
      b.addEventListener('click', () => { addMessage(item.q, 'user'); botReply(item.q); });
      suggestions.appendChild(b);
    });
  }

  let greeted = false;
  function openBot(){
    bot.classList.add('open');
    toggle.setAttribute('aria-label','Cerrar chatbot SynConnect');
    if(!greeted){
      greeted = true;
      addMessage('¡Hola! Soy el asistente de SynConnect AI. Puedo resolver dudas sobre el test, perfiles, privacidad y cómo funciona el Coach IA.', 'bot');
      addMessage('Elige una pregunta rápida o escríbeme tu duda 👇', 'bot');
      renderChips();
    }
    setTimeout(() => input?.focus(), 180);
  }
  function closeBot(){ bot.classList.remove('open'); toggle.setAttribute('aria-label','Abrir chatbot SynConnect'); }

  ['wheel','touchmove'].forEach(evt => {
    panel?.addEventListener(evt, (e) => e.stopPropagation(), {passive:true});
    messages?.addEventListener(evt, (e) => e.stopPropagation(), {passive:true});
    suggestions?.addEventListener(evt, (e) => e.stopPropagation(), {passive:true});
  });

  let suppressToggleClick = false;

  function getDefaultBottom(){ return window.matchMedia('(max-width:720px)').matches ? 16 : 28; }
  function clampBubbleLeft(left){
    const rect = toggle.getBoundingClientRect();
    const width = rect.width || 68;
    const margin = 12;
    return Math.max(margin, Math.min(window.innerWidth - width - margin, left));
  }
  function placeBubble(left, top){
    bot.style.left = `${clampBubbleLeft(left)}px`;
    bot.style.right = 'auto';
    bot.style.top = `${Math.max(12, Math.min(window.innerHeight - toggle.offsetHeight - 12, top))}px`;
    bot.style.bottom = 'auto';
  }
  function snapBubbleToBottom(){
    const rect = toggle.getBoundingClientRect();
    const left = clampBubbleLeft(rect.left);
    const bottom = getDefaultBottom();
    const targetTop = window.innerHeight - (toggle.offsetHeight || rect.height || 68) - bottom;

    bot.classList.add('settling');
    bot.style.left = `${left}px`;
    bot.style.right = 'auto';
    bot.style.bottom = 'auto';
    bot.style.top = `${Math.max(12, targetTop)}px`;
    bot.dataset.side = left < (window.innerWidth / 2) ? 'left' : 'right';

    window.setTimeout(() => {
      if (dragState) return;
      bot.classList.remove('settling');
      bot.style.left = `${left}px`;
      bot.style.right = 'auto';
      bot.style.top = 'auto';
      bot.style.bottom = `${bottom}px`;
    }, 360);
  }

  let dragState = null;
  toggle.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const rect = toggle.getBoundingClientRect();
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      moved: false
    };
    toggle.setPointerCapture?.(e.pointerId);
    bot.classList.add('dragging');
  });

  toggle.addEventListener('pointermove', (e) => {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.moved = true;
    if (!dragState.moved) return;
    e.preventDefault();
    placeBubble(e.clientX - dragState.offsetX, e.clientY - dragState.offsetY);
  });

  function endDrag(e){
    if (!dragState) return;
    const wasMoved = dragState.moved;
    dragState = null;
    bot.classList.remove('dragging');
    if (wasMoved) {
      suppressToggleClick = true;
      snapBubbleToBottom();
      setTimeout(() => { suppressToggleClick = false; }, 180);
    }
  }
  toggle.addEventListener('pointerup', endDrag);
  toggle.addEventListener('pointercancel', endDrag);
  window.addEventListener('resize', () => {
    if (bot.style.left) snapBubbleToBottom();
  });


  /* Drag the open chatbot panel by holding the purple header */
  let panelDragState = null;
  const panelHeader = bot.querySelector('.scbot-head');

  function clampPanelPosition(left, top){
    const rect = panel.getBoundingClientRect();
    const width = rect.width || 380;
    const height = rect.height || 560;
    const margin = 10;
    return {
      left: Math.max(margin, Math.min(window.innerWidth - width - margin, left)),
      top: Math.max(margin, Math.min(window.innerHeight - height - margin, top))
    };
  }

  function placePanel(left, top){
    const pos = clampPanelPosition(left, top);
    bot.classList.add('panel-detached');
    panel.style.position = 'fixed';
    panel.style.left = `${pos.left}px`;
    panel.style.top = `${pos.top}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.transform = 'none';
  }

  panelHeader?.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.scbot-close')) return;
    if (e.button !== undefined && e.button !== 0) return;
    const rect = panel.getBoundingClientRect();
    panelDragState = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
    placePanel(rect.left, rect.top);
    panelHeader.setPointerCapture?.(e.pointerId);
    bot.classList.add('panel-dragging');
    e.preventDefault();
  });

  panelHeader?.addEventListener('pointermove', (e) => {
    if (!panelDragState) return;
    e.preventDefault();
    placePanel(e.clientX - panelDragState.offsetX, e.clientY - panelDragState.offsetY);
  });

  function getDefaultPanelBottom(){
    // Same visual row as the panel's original position above the floating bubble.
    return window.matchMedia('(max-width:720px)').matches ? 92 : 112;
  }

  function snapPanelToDefaultRow(){
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const width = rect.width || 380;
    const height = rect.height || 560;
    const margin = 10;
    const targetLeft = Math.max(margin, Math.min(window.innerWidth - width - margin, rect.left));
    const targetTop = Math.max(margin, Math.min(window.innerHeight - height - margin, window.innerHeight - height - getDefaultPanelBottom()));

    bot.classList.add('panel-detached','panel-settling');
    panel.style.position = 'fixed';
    panel.style.left = `${targetLeft}px`;
    panel.style.top = `${targetTop}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.transform = 'none';

    window.setTimeout(() => {
      bot.classList.remove('panel-settling');
    }, 420);
  }

  function endPanelDrag(){
    if (!panelDragState) return;
    panelDragState = null;
    bot.classList.remove('panel-dragging');
    snapPanelToDefaultRow();
  }

  panelHeader?.addEventListener('pointerup', endPanelDrag);
  panelHeader?.addEventListener('pointercancel', endPanelDrag);
  window.addEventListener('resize', () => {
    if (bot.classList.contains('panel-detached')) {
      const rect = panel.getBoundingClientRect();
      placePanel(rect.left, rect.top);
    }
  });

  toggle.addEventListener('click', () => {
    if (suppressToggleClick) return;
    bot.classList.contains('open') ? closeBot() : openBot();
  });
  close.addEventListener('click', closeBot);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeBot(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    input.value = '';
    botReply(text);
  });
  setTimeout(() => { if(!bot.classList.contains('open')) bot.querySelector('.scbot-toggle')?.classList.add('attention'); }, 1600);
})();

/* v21: safe stagger for test options without changing layout */
(function(){
  const screenNode = document.getElementById('screen');
  if(!screenNode) return;
  function stagger(){
    screenNode.querySelectorAll('.option,.info-card').forEach((el, i) => el.style.setProperty('--stagger', i));
  }
  const observer = new MutationObserver(() => requestAnimationFrame(stagger));
  observer.observe(screenNode, {childList:true, subtree:false});
  stagger();
})();
