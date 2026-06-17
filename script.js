const header = document.querySelector('.topbar');
const links = [...document.querySelectorAll('.menu a')];
const menuSections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const pageSections = [...document.querySelectorAll('main > .snap-section, main > .cta-section')];

function headerHeight(){
  return header ? Math.round(header.getBoundingClientRect().height) : 0;
}

function sectionTop(target){
  return Math.max(0, Math.round(target.getBoundingClientRect().top + window.pageYOffset - headerHeight()));
}

let isSnapping = false;
let snapTimer = null;
const SNAP_LOCK_MS = 170; // bloqueo mínimo: evita dobles saltos, pero se siente casi inmediato

function goToSection(target, behavior = 'smooth'){
  if (!target) return;
  isSnapping = true;
  window.scrollTo({ top: sectionTop(target), behavior });
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => { isSnapping = false; }, behavior === 'auto' ? 40 : SNAP_LOCK_MS);
}

function nearestSectionIndex(){
  const y = window.pageYOffset + headerHeight();
  let bestIndex = 0;
  let bestDistance = Infinity;
  pageSections.forEach((section, index) => {
    const top = section.getBoundingClientRect().top + window.pageYOffset;
    const distance = Math.abs(top - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function snapByDirection(direction){
  if (!pageSections.length) return;
  const current = nearestSectionIndex();
  const next = Math.max(0, Math.min(pageSections.length - 1, current + direction));
  if (next !== current) goToSection(pageSections[next]);
}

// Menú: cada clic cae exactamente al inicio visual de la sección, debajo del header.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    goToSection(target);
  });
});

// Scroll por pantalla: un giro de rueda va directamente a la sección superior/inferior.
let wheelAccumulator = 0;
window.addEventListener('wheel', (e) => {
  if (window.innerWidth <= 900) return; // en pantallas pequeñas dejamos scroll natural
  if (e.ctrlKey) return;
  const target = e.target;
  const scrollable = target.closest && target.closest('.chat, textarea, input, select');
  if (scrollable) return;

  e.preventDefault();
  if (isSnapping) return;

  wheelAccumulator += e.deltaY;
  if (Math.abs(wheelAccumulator) < 8) return;
  const direction = wheelAccumulator > 0 ? 1 : -1;
  wheelAccumulator = 0;
  snapByDirection(direction);
}, { passive: false });

// Teclado: flechas, PageUp/PageDown y espacio también avanzan por sección.
window.addEventListener('keydown', (e) => {
  if (window.innerWidth <= 900) return;
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (['input','textarea','select'].includes(tag)) return;
  const downKeys = ['ArrowDown', 'PageDown', ' '];
  const upKeys = ['ArrowUp', 'PageUp'];
  if (![...downKeys, ...upKeys].includes(e.key)) return;
  e.preventDefault();
  if (isSnapping) return;
  snapByDirection(downKeys.includes(e.key) ? 1 : -1);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const activeObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if (!visible) return;
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-35% 0px -45% 0px', threshold: [0, .25, .5, .75] });
menuSections.forEach(section => activeObserver.observe(section));

// Si recargas en medio de una sección, reajusta suavemente para no mostrar separadores.
window.addEventListener('load', () => {
  if (window.innerWidth > 900 && location.hash) {
    const target = document.querySelector(location.hash);
    if (target) setTimeout(() => goToSection(target, 'auto'), 80);
  }
});

// V14: conversación animada en la sección Coach IA
const coachSection = document.querySelector('#coach-ai');
const chatBox = document.querySelector('.chat');
const animatedChat = document.querySelector('.animated-chat');
const animatedInput = document.querySelector('.animated-input');
let chatAnimationRun = 0;
let coachInView = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setBubbleFinal(el) {
  if (!el) return;
  const original = el.dataset.text || '';
  if (original.includes('||')) {
    const [first, second] = original.split('||');
    el.innerHTML = `${first}<br><br><b>"${second}"</b>`;
  }
  el.classList.add('typing-done');
}

async function typeInto(el, text, speed = 18, runId = chatAnimationRun) {
  if (!el) return;
  el.classList.remove('typing-done');
  el.classList.add('is-writing');
  el.textContent = '';
  const cleanText = text.replace('||', '\n\n');
  for (const char of cleanText) {
    if (runId !== chatAnimationRun || !coachInView) return;
    el.textContent += char;
    await sleep(char === ' ' ? speed * .45 : speed);
  }
  el.classList.remove('is-writing');
  el.classList.add('typing-done');
}

function resetCoachChat() {
  if (!animatedChat || !animatedInput) return;
  animatedChat.querySelectorAll('.chat-step').forEach(step => {
    step.classList.remove('is-visible', 'is-done');
  });
  animatedChat.querySelectorAll('.typing-text').forEach(text => {
    text.textContent = '';
    text.innerHTML = '';
    text.classList.remove('typing-done', 'is-writing');
  });
  const inputSpan = animatedInput.querySelector('span');
  if (inputSpan) {
    inputSpan.textContent = inputSpan.dataset.placeholder || 'Escribe tu respuesta...';
    inputSpan.classList.remove('typing-done', 'is-writing');
  }
  animatedInput.classList.remove('is-active', 'is-ready');
  chatBox?.classList.remove('playing');
}

async function playCoachChat() {
  if (!animatedChat || !animatedInput) return;
  const runId = ++chatAnimationRun;
  resetCoachChat();
  await sleep(250);
  if (runId !== chatAnimationRun || !coachInView) return;

  chatBox?.classList.add('playing');
  const botQuestion = animatedChat.querySelector('.bot-question');
  const userMessage = animatedChat.querySelector('.user-message');
  const botTyping = animatedChat.querySelector('.bot-typing');
  const botAnswer = animatedChat.querySelector('.bot-answer');
  const questionText = botQuestion?.querySelector('.typing-text');
  const answerText = botAnswer?.querySelector('.typing-text');
  const inputSpan = animatedInput.querySelector('span');

  botQuestion?.classList.add('is-visible');
  await typeInto(questionText, questionText?.dataset.text || '', 15, runId);
  botQuestion?.classList.add('is-done');
  await sleep(420);
  if (runId !== chatAnimationRun || !coachInView) return;

  animatedInput.classList.add('is-active');
  if (inputSpan) inputSpan.textContent = '';
  await typeInto(inputSpan, 'Sí, tengo un evento de networking mañana...', 22, runId);
  animatedInput.classList.add('is-ready');
  await sleep(430);
  if (runId !== chatAnimationRun || !coachInView) return;

  animatedInput.classList.remove('is-ready');
  if (inputSpan) {
    inputSpan.textContent = inputSpan.dataset.placeholder || 'Escribe tu respuesta...';
    inputSpan.classList.remove('typing-done', 'is-writing');
  }
  userMessage?.classList.add('is-visible');
  await sleep(520);
  if (runId !== chatAnimationRun || !coachInView) return;

  botTyping?.classList.add('is-visible');
  await sleep(1050);
  botTyping?.classList.remove('is-visible');
  await sleep(180);
  if (runId !== chatAnimationRun || !coachInView) return;

  botAnswer?.classList.add('is-visible');
  await typeInto(answerText, answerText?.dataset.text || '', 11, runId);
  setBubbleFinal(answerText);
  botAnswer?.classList.add('is-done');
  animatedInput.classList.remove('is-active');

  await sleep(5500);
  if (runId === chatAnimationRun && coachInView) playCoachChat();
}

if (coachSection && animatedChat) {
  const chatObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      coachInView = true;
      playCoachChat();
    } else {
      coachInView = false;
      chatAnimationRun++;
    }
  }, { threshold: .62 });
  chatObserver.observe(coachSection);
}

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
    if(n.includes('empezar') || n.includes('comenzar') || n.includes('iniciar') || n.includes('hacer test') || n.includes('realizar test')) return qa[7].a;
    if(n.includes('gratis') || n.includes('precio') || n.includes('pagar') || n.includes('costo') || n.includes('cuesta')) return qa[3].a;
    if(n.includes('privad') || n.includes('datos') || n.includes('segur') || n.includes('respuesta') || n.includes('correo')) return qa[4].a;
    if(n.includes('perfil') || n.includes('conector') || n.includes('pensador') || n.includes('sobreanalizador') || n.includes('explorador')) return qa[5].a;
    if(n.includes('coach') || n.includes('ia') || n.includes('practicar') || n.includes('conversacion') || n.includes('simula')) return qa[6].a;
    if(n.includes('dura') || n.includes('tiempo') || n.includes('minuto') || n.includes('rapido')) return qa[2].a;
    if(n.includes('funciona') || n.includes('como es') || n.includes('preguntas') || n.includes('resultado')) return qa[1].a;
    if(n.includes('ansiedad') || n.includes('timidez') || n.includes('nervios') || n.includes('miedo')) return 'SynConnect puede ayudarte a reconocer patrones como sobrepensar, evitar reuniones, revisar conversaciones pasadas o sentir miedo al rechazo. A partir de eso, te sugiere ejercicios y prácticas para avanzar gradualmente.';
    if(n.includes('hola') || n.includes('buenas') || n.includes('ayuda')) return '¡Hola! Puedes preguntarme sobre el test, los perfiles, privacidad, duración o cómo funciona el Coach IA. También puedes elegir una pregunta rápida de abajo.';
    if(n.includes('synconnect') || n.includes('que es') || n.includes('qué es')) return qa[0].a;
    return 'Te puedo orientar sobre SynConnect AI, el test de confianza social, los perfiles, privacidad, duración y el Coach IA. Por ahora respondo con información predefinida, así que prueba con una de las preguntas rápidas o escribe una duda relacionada.';
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
