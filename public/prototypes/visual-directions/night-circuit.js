export function renderNightCircuit(container) {
  container.innerHTML = `
    <style>
      .circuit-stage { min-height:100svh; display:grid; place-items:center; background:#050408; color:#f4f0e7; font-family:'Space Grotesk',Inter,sans-serif; }
      .circuit-screen { position:relative; width:min(100%,430px); min-height:100svh; overflow:hidden; background:#130c1d; padding:20px 20px 104px; }
      .circuit-head { position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; }
      .circuit-step { color:#caff72; }
      .circuit-rail { display:flex; gap:4px; width:116px; }
      .circuit-rail span { flex:1; height:3px; background:#3c2f4e; }
      .circuit-rail span:nth-child(-n+7) { background:#5e8dff; }
      .circuit-rail span:nth-child(8) { background:#caff72; }
      .circuit-orbit { position:relative; height:300px; margin:4px -20px -24px; animation:circuit-enter 240ms cubic-bezier(.23,1,.32,1) both; }
      .circuit-compass { position:absolute; width:365px; height:365px; left:50%; top:-50px; transform:translateX(-50%); }
      .circuit-compass .disc { fill:#130c1d; stroke:#5e8dff; }
      .circuit-compass .ring { fill:none; stroke:#403353; }
      .circuit-compass .tick { stroke:#7b6a94; }
      .circuit-compass .needle { fill:#ff6546; }
      .circuit-compass .counter { fill:#5e8dff; }
      .circuit-compass text { fill:#caff72; font-family:'IBM Plex Mono',monospace; font-size:9px; }
      .circuit-direction { position:absolute; left:20px; bottom:38px; z-index:2; }
      .circuit-direction span { display:block; color:#8f7fa7; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; }
      .circuit-direction strong { display:block; margin-top:3px; font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:500; color:#5e8dff; }
      .circuit-copy { position:relative; z-index:2; }
      .circuit-kicker { margin:0 0 10px; color:#caff72; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; }
      .circuit-question { max-width:375px; margin:0 0 22px; font-size:39px; font-weight:650; line-height:.98; letter-spacing:-.035em; }
      .circuit-options { display:grid; gap:10px; }
      .circuit-option { position:relative; isolation:isolate; display:grid; grid-template-columns:34px 1fr 20px; align-items:center; width:100%; min-height:70px; overflow:hidden; border:1px solid #5e8dff; background:#171021; color:#f4f0e7; text-align:left; cursor:pointer; transition:transform 90ms ease-out,border-color 150ms ease-out,background-color 150ms ease-out; }
      .circuit-option::after { content:""; position:absolute; z-index:-1; inset:0; background:#5e8dff; transform:scaleX(0); transform-origin:left; }
      .circuit-option[data-selected]::after { animation:circuit-wipe 180ms cubic-bezier(.23,1,.32,1) forwards; }
      .circuit-option:active { transform:scale(.975); }
      .circuit-option:focus-visible,.circuit-action:focus-visible { outline:2px solid #caff72; outline-offset:3px; }
      .circuit-index { color:#caff72; text-align:center; font-family:'IBM Plex Mono',monospace; font-size:11px; }
      .circuit-label { padding:14px 8px; font-size:17px; font-weight:600; line-height:1.18; }
      .circuit-route { width:9px; height:9px; border:1px solid #8f7fa7; transform:rotate(45deg); }
      .circuit-option[data-selected] { color:#09070d; border-color:#5e8dff; }
      .circuit-option[data-selected] .circuit-index { color:#09070d; }
      .circuit-option[data-selected] .circuit-route { background:#caff72; border-color:#caff72; }
      .circuit-action { width:100%; min-height:56px; margin-top:18px; border:0; background:#ff6546; color:#09070d; font-size:16px; font-weight:700; cursor:pointer; transition:transform 90ms ease-out,opacity 150ms ease-out; }
      .circuit-action:active:not(:disabled) { transform:scale(.97); }
      .circuit-action:disabled { opacity:.3; cursor:default; }
      .circuit-status { min-height:17px; margin:9px 0 0; color:#8f7fa7; font-family:'IBM Plex Mono',monospace; font-size:10px; }
      @keyframes circuit-enter { from { opacity:.5; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes circuit-wipe { to { transform:scaleX(1); } }
      @media (max-width:359px) { .circuit-orbit { height:262px; } .circuit-compass { width:325px; height:325px; } .circuit-question { font-size:34px; } .circuit-option { min-height:64px; } }
      @media (prefers-reduced-motion:reduce) { .circuit-orbit,.circuit-option[data-selected]::after { animation:none; } .circuit-option[data-selected]::after { transform:scaleX(1); } .circuit-option,.circuit-action { transition:none; } }
    </style>
    <section class="circuit-stage" aria-label="Night Circuit prototype">
      <div class="circuit-screen">
        <header class="circuit-head"><span>Direction</span><div class="circuit-rail" aria-label="Direction, part 8 of 9" role="progressbar"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><span class="circuit-step">08 / 09</span></header>
        <div class="circuit-orbit">
          <svg class="circuit-compass" viewBox="0 0 260 260" role="img" aria-label="Compass pointing north east">
            <circle class="disc" cx="130" cy="130" r="108" stroke-width="1" /><circle class="ring" cx="130" cy="130" r="92" stroke-width="1" />
            <g class="tick" stroke-width="1.5">${ticks()}</g>
            <path class="needle" d="M130 130 L137 122 L181 74 L145 132 Z" /><path class="counter" d="M130 130 L122 137 L112 148 L127 139 Z" />
            <circle cx="130" cy="130" r="5" fill="#caff72" /><text x="130" y="43" text-anchor="middle">N</text><text x="217" y="133" text-anchor="middle">E</text><text x="130" y="222" text-anchor="middle">S</text><text x="42" y="133" text-anchor="middle">W</text>
          </svg>
          <div class="circuit-direction"><span>Current direction</span><strong>N 85°</strong></div>
        </div>
        <div class="circuit-copy">
          <p class="circuit-kicker">Route decision</p>
          <h1 class="circuit-question">When people want something from you</h1>
          <div class="circuit-options" role="radiogroup" aria-label="Choose the closer answer">
            <button class="circuit-option" type="button" role="radio" aria-checked="false"><span class="circuit-index">01</span><span class="circuit-label">I say what I will and will not do</span><span class="circuit-route"></span></button>
            <button class="circuit-option" type="button" role="radio" aria-checked="false"><span class="circuit-index">02</span><span class="circuit-label">I would rather keep the peace</span><span class="circuit-route"></span></button>
          </div>
          <button class="circuit-action" type="button" disabled>Lock direction</button>
          <p class="circuit-status" role="status">Choose the route that is closer to the truth.</p>
        </div>
      </div>
    </section>`;

  const options = [...container.querySelectorAll('.circuit-option')];
  const action = container.querySelector('.circuit-action');
  const status = container.querySelector('.circuit-status');
  options.forEach((option) => option.addEventListener('click', () => {
    options.forEach((item) => { item.removeAttribute('data-selected'); item.setAttribute('aria-checked', 'false'); });
    option.setAttribute('data-selected', ''); option.setAttribute('aria-checked', 'true'); action.disabled = false; action.textContent = 'Lock direction';
    status.textContent = `Route selected: ${option.querySelector('.circuit-label').textContent}`;
  }));
  action.addEventListener('click', () => { if (!action.disabled) { action.textContent = 'Direction locked'; action.disabled = true; status.textContent = 'Recorded. Next: choose your North Star.'; } });
}

function ticks() {
  return Array.from({ length: 24 }, (_, index) => `<line x1="130" y1="23" x2="130" y2="${index % 2 === 0 ? 34 : 29}" transform="rotate(${index * 15} 130 130)" />`).join('');
}
