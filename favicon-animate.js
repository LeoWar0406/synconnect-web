(function () {
  const colors = ['#6d3df4', '#7c4dff', '#2f80ed', '#18a999', '#6d3df4'];
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315];
  let frame = 0;

  function ensureIconLink() {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    return link;
  }

  function svgFrame(i) {
    const color = colors[i % colors.length];
    const rotation = rotations[i % rotations.length];
    const scale = 1 + (i % 2) * 0.06;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#8b5cf6"/>
            <stop offset="1" stop-color="${color}"/>
          </linearGradient>
          <filter id="s" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#6d3df4" flood-opacity=".35"/>
          </filter>
        </defs>
        <rect x="7" y="7" width="50" height="50" rx="16" fill="url(#g)" filter="url(#s)"/>
        <g transform="translate(32 32) rotate(${rotation}) scale(${scale}) translate(-32 -32)">
          <circle cx="32" cy="32" r="13" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-dasharray="42 22"/>
          <circle cx="32" cy="32" r="4" fill="white"/>
        </g>
        <circle cx="47" cy="17" r="5" fill="#5eead4" opacity=".95"/>
      </svg>`;
  }

  function setFrame() {
    const link = ensureIconLink();
    const encoded = encodeURIComponent(svgFrame(frame)).replace(/'/g, '%27').replace(/"/g, '%22');
    link.href = `data:image/svg+xml,${encoded}`;
    frame += 1;
  }

  setFrame();
  window.__synconnectFaviconTimer = window.setInterval(setFrame, 420);
})();
