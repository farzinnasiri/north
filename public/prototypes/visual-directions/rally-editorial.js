export function renderRallyEditorial(container) {
  container.innerHTML = `
    <style>
      .rally-stage { min-height:100svh; display:grid; place-items:center; background:#302f2b; color:#11110f; font-family:Inter,system-ui,sans-serif; }
      .rally-screen { position:relative; width:min(100%,430px); min-height:100svh; overflow:hidden; background:#f4f0e7; padding-bottom:104px; }
      .rally-top { position:relative; height:240px; overflow:hidden; background:#11110f; color:#f4f0e7; animation:rally-enter 220ms cubic-bezier(.23,1,.32,1) both; }
      .rally-progress { position:absolute; z-index:3; top:18px; left:22px; right:22px; display:grid; grid-template-columns:repeat(9,1fr); gap:5px; }
      .rally-progress span { height:4px; background:#4f4f49; }
      .rally-progress span:nth-child(-n+7) { background:#f4f0e7; }
      .rally-progress span:nth-child(8) { background:#ff3b27; }
      .rally-live { position:absolute; top:41px; left:22px; display:flex; align-items:center; gap:8px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
      .rally-live::before { content:""; width:7px; height:7px; background:#e8ff35; }
      .rally-back { position:absolute; z-index:3; top:78px; left:22px; color:#f4f0e7; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
      .rally-compass { position:absolute; width:330px; height:330px; right:-76px; top:-46px; }
      .rally-compass circle { fill:#f4f0e7; stroke:#11110f; }
      .rally-compass .minor { stroke:#8e8b82; }
      .rally-compass .north { stroke:#165dff; }
      .rally-compass text { fill:#11110f; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; }
      .rally-content { padding:24px 22px 0; }
      .rally-meta { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
      .rally-meta strong { color:#165dff; font-weight:600; }
      .rally-question { max-width:360px; margin:0 0 22px; font-family:'Barlow Condensed',sans-serif; font-size:46px; font-weight:700; line-height:.92; letter-spacing:-.025em; text-transform:uppercase; }
      .rally-options { border-top:2px solid #11110f; }
      .rally-option { position:relative; display:grid; grid-template-columns:42px 1fr 24px; align-items:center; width:100%; min-height:68px; padding:0 14px 0 0; border:0; border-bottom:2px solid #11110f; background:transparent; color:#11110f; text-align:left; cursor:pointer; transition:transform 90ms ease-out,background-color 150ms ease-out,color 150ms ease-out; }
      .rally-option:active { transform:scale(.985); transform-origin:center; }
      .rally-option:focus-visible,.rally-action:focus-visible { outline:3px solid #165dff; outline-offset:3px; }
      .rally-option-index { align-self:stretch; display:grid; place-items:center; border-right:2px solid #11110f; font-family:'IBM Plex Mono',monospace; font-size:12px; }
      .rally-option-copy { padding:14px; font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight:600; line-height:1; }
      .rally-option-mark { width:12px; height:12px; border:2px solid currentColor; border-radius:50%; justify-self:end; }
      .rally-option[data-selected] { background:#11110f; color:#f4f0e7; }
      .rally-option[data-selected] .rally-option-index { background:#ff3b27; color:#11110f; border-color:#ff3b27; }
      .rally-option[data-selected] .rally-option-mark { border-radius:0; background:#e8ff35; border-color:#e8ff35; }
      .rally-action { width:100%; min-height:58px; margin-top:20px; border:0; background:#ff3b27; color:#11110f; font-family:'Barlow Condensed',sans-serif; font-size:21px; font-weight:700; letter-spacing:.035em; text-transform:uppercase; cursor:pointer; transition:transform 90ms ease-out,opacity 150ms ease-out; }
      .rally-action:active:not(:disabled) { transform:scale(.97); }
      .rally-action:disabled { opacity:.32; cursor:default; }
      .rally-status { min-height:18px; margin:11px 0 0; color:#4f4f49; font-family:'IBM Plex Mono',monospace; font-size:11px; }
      @keyframes rally-enter { from { opacity:.72; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
      @media (max-width:359px) { .rally-question { font-size:40px; } .rally-top { height:222px; } .rally-option { min-height:64px; } }
      @media (prefers-reduced-motion:reduce) { .rally-top { animation:none; } .rally-option,.rally-action { transition:none; } }
    </style>
    <section class="rally-stage" aria-label="Rally Editorial prototype">
      <div class="rally-screen">
        <header class="rally-top">
          <div class="rally-progress" aria-label="Direction, part 8 of 9" role="progressbar"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
          <div class="rally-live">Direction live</div>
          <span class="rally-back">North / Direction</span>
          <svg class="rally-compass" viewBox="0 0 260 260" role="img" aria-label="Compass pointing north east">
            <circle cx="130" cy="130" r="108" stroke-width="2" />
            <circle cx="130" cy="130" r="94" stroke-width="1" />
            <g class="minor" stroke-width="2">${ticks()}</g>
            <line class="north" x1="130" y1="130" x2="178" y2="75" stroke-width="5" />
            <line x1="130" y1="130" x2="118" y2="144" stroke="#11110f" stroke-width="4" />
            <circle cx="130" cy="130" r="6" fill="#e8ff35" stroke="none" />
            <text x="130" y="45" text-anchor="middle">N</text><text x="216" y="134" text-anchor="middle">E</text>
          </svg>
        </header>
        <div class="rally-content">
          <div class="rally-meta"><span>North Star trial</span><strong>08 / 09</strong></div>
          <h1 class="rally-question">When people want something from you</h1>
          <div class="rally-options" role="radiogroup" aria-label="Choose the closer answer">
            <button class="rally-option" type="button" role="radio" aria-checked="false"><span class="rally-option-index">A</span><span class="rally-option-copy">I say what I will and will not do</span><span class="rally-option-mark"></span></button>
            <button class="rally-option" type="button" role="radio" aria-checked="false"><span class="rally-option-index">B</span><span class="rally-option-copy">I would rather keep the peace</span><span class="rally-option-mark"></span></button>
          </div>
          <button class="rally-action" type="button" disabled>Mark this direction</button>
          <p class="rally-status" role="status">Choose the closer answer.</p>
        </div>
      </div>
    </section>`;

  return wire(container, '.rally-option', '.rally-action', '.rally-status');
}

function wire(container, optionSelector, actionSelector, statusSelector) {
  const options = [...container.querySelectorAll(optionSelector)];
  const action = container.querySelector(actionSelector);
  const status = container.querySelector(statusSelector);
  options.forEach((option) => option.addEventListener('click', () => {
    options.forEach((item) => { item.removeAttribute('data-selected'); item.setAttribute('aria-checked', 'false'); });
    option.setAttribute('data-selected', '');
    option.setAttribute('aria-checked', 'true');
    action.disabled = false;
    action.textContent = 'Mark this direction';
    status.textContent = `Selected: ${option.textContent.trim().slice(1)}`;
  }));
  action.addEventListener('click', () => {
    if (action.disabled) return;
    action.textContent = 'Direction marked';
    action.disabled = true;
    status.textContent = 'Recorded. Next: choose your North Star.';
  });
}

function ticks() {
  return Array.from({ length: 24 }, (_, index) => `<line x1="130" y1="24" x2="130" y2="${index % 2 === 0 ? 35 : 31}" transform="rotate(${index * 15} 130 130)" />`).join('');
}
