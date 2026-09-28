export function renderStreetFieldGuide(container) {
  container.innerHTML = `
    <style>
      .field-stage { min-height:100svh; display:grid; place-items:center; background:#d7d1c2; color:#11110f; font-family:Inter,system-ui,sans-serif; }
      .field-screen { position:relative; width:min(100%,430px); min-height:100svh; overflow:hidden; background:#f1ecdf; padding-bottom:104px; }
      .field-strip { height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; background:#11110f; color:#f1ecdf; font-family:'IBM Plex Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:.08em; }
      .field-ticket { display:inline-flex; align-items:center; height:32px; padding:0 10px; background:#ffe53b; color:#11110f; font-weight:600; }
      .field-hero { position:relative; height:330px; animation:field-enter 220ms cubic-bezier(.23,1,.32,1) both; }
      .field-compass { position:absolute; width:370px; height:370px; left:-126px; top:-52px; }
      .field-compass .outer { fill:none; stroke:#175bd8; stroke-width:7; }
      .field-compass .inner { fill:none; stroke:#11110f; stroke-width:2; }
      .field-compass .tick { stroke:#175bd8; stroke-width:3; }
      .field-compass .needle { fill:#175bd8; }
      .field-compass text { fill:#11110f; font-family:'Archivo Black',sans-serif; font-size:11px; }
      .field-note { position:absolute; top:34px; right:22px; width:158px; border-top:4px solid #11110f; padding-top:9px; font-family:'IBM Plex Mono',monospace; font-size:10px; line-height:1.45; text-transform:uppercase; }
      .field-live { position:absolute; right:22px; bottom:28px; display:flex; align-items:center; gap:9px; font-family:'IBM Plex Mono',monospace; font-size:11px; }
      .field-live::before { content:""; width:34px; height:9px; background:#ffe53b; }
      .field-copy { padding:0 22px; }
      .field-question { max-width:370px; margin:0 0 18px; font-family:'Archivo Black',sans-serif; font-size:39px; font-weight:400; line-height:.95; letter-spacing:-.035em; }
      .field-instruction { margin:0 0 18px; font-family:'IBM Plex Mono',monospace; font-size:10px; text-transform:uppercase; letter-spacing:.06em; }
      .field-options { display:grid; gap:10px; }
      .field-option { position:relative; display:grid; grid-template-columns:1fr 32px; align-items:center; width:calc(100% - 10px); min-height:72px; border:3px solid #11110f; background:#f1ecdf; color:#11110f; text-align:left; cursor:pointer; box-shadow:5px 5px 0 #11110f; transition:transform 90ms ease-out,background-color 150ms ease-out,color 150ms ease-out; }
      .field-option:nth-child(2) { justify-self:end; }
      .field-option:active { transform:translate(3px,3px); box-shadow:2px 2px 0 #11110f; }
      .field-option:focus-visible,.field-action:focus-visible { outline:4px solid #175bd8; outline-offset:3px; }
      .field-label { padding:13px 14px; font-family:'Barlow Condensed',sans-serif; font-size:23px; font-weight:700; line-height:1.02; }
      .field-box { width:15px; height:15px; border:3px solid currentColor; }
      .field-option[data-selected] { background:#175bd8; color:#f1ecdf; }
      .field-option[data-selected]::after { content:""; position:absolute; width:26px; height:8px; right:-5px; top:-6px; background:#ffe53b; animation:field-mark 140ms cubic-bezier(.23,1,.32,1) both; }
      .field-option[data-selected] .field-box { background:#ffe53b; border-color:#ffe53b; transform:rotate(-7deg); }
      .field-action { display:grid; grid-template-columns:1fr 52px; align-items:center; width:100%; min-height:58px; margin-top:22px; padding:0 0 0 18px; border:3px solid #11110f; background:#11110f; color:#f1ecdf; font-family:'Barlow Condensed',sans-serif; font-size:21px; font-weight:700; text-align:left; cursor:pointer; transition:transform 90ms ease-out,opacity 150ms ease-out; }
      .field-action::after { content:"→"; align-self:stretch; display:grid; place-items:center; background:#ffe53b; color:#11110f; font-family:'Archivo Black',sans-serif; }
      .field-action:active:not(:disabled) { transform:scale(.97); }
      .field-action:disabled { opacity:.32; cursor:default; }
      .field-status { min-height:17px; margin:10px 0 0; font-family:'IBM Plex Mono',monospace; font-size:10px; }
      @keyframes field-enter { from { opacity:.68; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
      @keyframes field-mark { from { opacity:0; transform:scaleX(.2); transform-origin:right; } to { opacity:1; transform:scaleX(1); transform-origin:right; } }
      @media (max-width:359px) { .field-hero { height:290px; } .field-compass { width:330px; height:330px; left:-116px; } .field-question { font-size:34px; } .field-option { min-height:66px; } }
      @media (prefers-reduced-motion:reduce) { .field-hero,.field-option[data-selected]::after { animation:none; } .field-option,.field-action { transition:none; } }
    </style>
    <section class="field-stage" aria-label="Street Field Guide prototype">
      <div class="field-screen">
        <header class="field-strip"><span>North</span><span>Direction</span><span class="field-ticket">08—09</span></header>
        <div class="field-hero">
          <svg class="field-compass" viewBox="0 0 260 260" role="img" aria-label="Compass pointing north east">
            <circle class="outer" cx="130" cy="130" r="105" /><circle class="inner" cx="130" cy="130" r="88" /><g class="tick">${ticks()}</g>
            <path class="needle" d="M130 130 L143 120 L190 68 L151 139 Z" /><path d="M130 130 L119 140 L104 160 L126 143 Z" fill="#11110f" /><circle cx="130" cy="130" r="6" fill="#ffe53b" stroke="#11110f" stroke-width="2" />
            <text x="130" y="45" text-anchor="middle">N</text><text x="214" y="134" text-anchor="middle">E</text>
          </svg>
          <div class="field-note">Field note 08<br />Boundaries under pressure</div>
          <div class="field-live">N 85° / live</div>
        </div>
        <div class="field-copy">
          <h1 class="field-question">When people want something from you</h1>
          <p class="field-instruction">Mark the line closest to the truth</p>
          <div class="field-options" role="radiogroup" aria-label="Choose the closer answer">
            <button class="field-option" type="button" role="radio" aria-checked="false"><span class="field-label">I say what I will and will not do</span><span class="field-box"></span></button>
            <button class="field-option" type="button" role="radio" aria-checked="false"><span class="field-label">I would rather keep the peace</span><span class="field-box"></span></button>
          </div>
          <button class="field-action" type="button" disabled>Mark the line</button>
          <p class="field-status" role="status">No answer marked.</p>
        </div>
      </div>
    </section>`;

  const options = [...container.querySelectorAll('.field-option')];
  const action = container.querySelector('.field-action');
  const status = container.querySelector('.field-status');
  options.forEach((option) => option.addEventListener('click', () => {
    options.forEach((item) => { item.removeAttribute('data-selected'); item.setAttribute('aria-checked', 'false'); });
    option.setAttribute('data-selected', ''); option.setAttribute('aria-checked', 'true'); action.disabled = false; action.textContent = 'Mark the line';
    status.textContent = `Marked: ${option.querySelector('.field-label').textContent}`;
  }));
  action.addEventListener('click', () => { if (!action.disabled) { action.textContent = 'Line recorded'; action.disabled = true; status.textContent = 'Recorded. Next: choose your North Star.'; } });
}

function ticks() {
  return Array.from({ length: 16 }, (_, index) => `<line x1="130" y1="22" x2="130" y2="${index % 2 === 0 ? 37 : 31}" transform="rotate(${index * 22.5} 130 130)" />`).join('');
}
