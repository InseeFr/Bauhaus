const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/mermaid.core.BBoJlnW1.js","_astro/preload-helper.Ct5iq8DL.js"])))=>i.map(i=>d[i]);
import{_ as L}from"./preload-helper.Ct5iq8DL.js";const v=new Set,l=new WeakSet;let g=!0,y,p=!1;function A(e){p||(p=!0,g??=!1,y??="hover",S(),T(),M(),O())}function S(){for(const e of["touchstart","mousedown"])document.body.addEventListener(e,t=>{u(t.target,"tap")&&f(t.target.href,{ignoreSlowConnection:!0})},{passive:!0})}function T(){let e;document.body.addEventListener("focusin",a=>{u(a.target,"hover")&&t(a)},{passive:!0}),document.body.addEventListener("focusout",r,{passive:!0}),h(()=>{for(const a of document.getElementsByTagName("a"))l.has(a)||u(a,"hover")&&(l.add(a),a.addEventListener("mouseenter",t,{passive:!0}),a.addEventListener("mouseleave",r,{passive:!0}))});function t(a){const i=a.target.href;e&&clearTimeout(e),e=setTimeout(()=>{f(i)},80)}function r(){e&&(clearTimeout(e),e=0)}}function M(){let e;h(()=>{for(const t of document.getElementsByTagName("a"))l.has(t)||u(t,"viewport")&&(l.add(t),e??=C(),e.observe(t))})}function C(){const e=new WeakMap;return new IntersectionObserver((t,r)=>{for(const a of t){const i=a.target,n=e.get(i);a.isIntersecting?(n&&clearTimeout(n),e.set(i,setTimeout(()=>{r.unobserve(i),e.delete(i),f(i.href)},300))):n&&(clearTimeout(n),e.delete(i))}})}function O(){h(()=>{for(const e of document.getElementsByTagName("a"))u(e,"load")&&f(e.href)})}function f(e,t){e=e.replace(/#.*/,"");const r=t?.ignoreSlowConnection??!1;if(P(e,r))if(v.add(e),document.createElement("link").relList?.supports?.("prefetch")&&t?.with!=="fetch"){const a=document.createElement("link");a.rel="prefetch",a.setAttribute("href",e),document.head.append(a)}else fetch(e,{priority:"low"})}function P(e,t){if(!navigator.onLine||!t&&k())return!1;try{const r=new URL(e,location.href);return location.origin===r.origin&&(location.pathname!==r.pathname||location.search!==r.search)&&!v.has(e)}catch{}return!1}function u(e,t){if(e?.tagName!=="A")return!1;const r=e.dataset.astroPrefetch;return r==="false"?!1:t==="tap"&&(r!=null||g)&&k()?!0:r==null&&g||r===""?t===y:r===t}function k(){if("connection"in navigator){const e=navigator.connection;return e.saveData||/2g/.test(e.effectiveType)}return!1}function h(e){e();let t=!1;document.addEventListener("astro:page-load",()=>{if(!t){t=!0;return}e()})}const b=()=>document.querySelectorAll("pre.mermaid").length>0;b()?(console.log("[astro-mermaid] Mermaid diagrams detected, loading mermaid.js..."),L(()=>import("./mermaid.core.BBoJlnW1.js").then(e=>e.bD),__vite__mapDeps([0,1])).then(async({default:e})=>{const t=[];if(t&&t.length>0){console.log("[astro-mermaid] Registering",t.length,"icon packs");const n=t.map(s=>({name:s.name,loader:new Function("return "+s.loader)()}));await e.registerIconPacks(n)}const r={startOnLoad:!1,theme:"default"},a={light:"default",dark:"dark"};async function i(){console.log("[astro-mermaid] Initializing mermaid diagrams...");const n=document.querySelectorAll("pre.mermaid");if(console.log("[astro-mermaid] Found",n.length,"mermaid diagrams"),n.length===0)return;let s=r.theme;{const o=document.documentElement.getAttribute("data-theme"),c=document.body.getAttribute("data-theme");s=a[o||c]||r.theme,console.log("[astro-mermaid] Using theme:",s,"from",o?"html":"body")}e.initialize({...r,theme:s,gitGraph:{mainBranchName:"main",showCommitLabel:!0,showBranches:!0,rotateCommitLabel:!0}});for(const o of n){if(o.hasAttribute("data-processed"))continue;o.hasAttribute("data-diagram")||o.setAttribute("data-diagram",o.textContent||"");const c=o.getAttribute("data-diagram")||"",d="mermaid-"+Math.random().toString(36).slice(2,11);console.log("[astro-mermaid] Rendering diagram:",d);try{const m=document.getElementById(d);m&&m.remove();const{svg:E}=await e.render(d,c);o.innerHTML=E,o.setAttribute("data-processed","true"),console.log("[astro-mermaid] Successfully rendered diagram:",d)}catch(m){console.error("[astro-mermaid] Mermaid rendering error for diagram:",d,m),o.innerHTML=`<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 0.5rem;">
            <strong>Error rendering diagram:</strong><br/>
            ${m.message||"Unknown error"}
          </div>`,o.setAttribute("data-processed","true")}}}i();{const n=new MutationObserver(s=>{for(const o of s)o.type==="attributes"&&o.attributeName==="data-theme"&&(document.querySelectorAll("pre.mermaid[data-processed]").forEach(c=>{c.removeAttribute("data-processed")}),i())});n.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),n.observe(document.body,{attributes:!0,attributeFilter:["data-theme"]})}document.addEventListener("astro:after-swap",()=>{b()&&i()})}).catch(e=>{console.error("[astro-mermaid] Failed to load mermaid:",e)})):console.log("[astro-mermaid] No mermaid diagrams found on this page, skipping mermaid.js load");const w=document.createElement("style");w.textContent=`
            /* Prevent layout shifts by setting minimum height */
            pre.mermaid {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 2rem 0;
              padding: 1rem;
              background-color: transparent;
              border: none;
              overflow: auto;
              min-height: 200px; /* Prevent layout shift */
              position: relative;
            }
            
            /* Loading state with skeleton loader */
            pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
            }
            
            /* Dark mode skeleton loader */
            [data-theme="dark"] pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
              background-size: 200% 100%;
            }
            
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            
            /* Show processed diagrams with smooth transition */
            pre.mermaid[data-processed] {
              animation: none;
              background: transparent;
              min-height: auto; /* Allow natural height after render */
            }
            
            /* Ensure responsive sizing for mermaid SVGs */
            pre.mermaid svg {
              max-width: 100%;
              height: auto;
            }
            
            /* Optional: Add subtle background for better visibility */
            @media (prefers-color-scheme: dark) {
              pre.mermaid[data-processed] {
                background-color: rgba(255, 255, 255, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            @media (prefers-color-scheme: light) {
              pre.mermaid[data-processed] {
                background-color: rgba(0, 0, 0, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            /* Respect user's color scheme preference */
            [data-theme="dark"] pre.mermaid[data-processed] {
              background-color: rgba(255, 255, 255, 0.02);
              border-radius: 0.5rem;
            }
            
            [data-theme="light"] pre.mermaid[data-processed] {
              background-color: rgba(0, 0, 0, 0.02);
              border-radius: 0.5rem;
            }
          `;document.head.appendChild(w);A();
