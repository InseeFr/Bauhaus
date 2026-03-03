const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/mermaid.core.BI-IS_z6.js","_astro/preload-helper.Ct5iq8DL.js"])))=>i.map(i=>d[i]);
import{_ as E}from"./preload-helper.Ct5iq8DL.js";const L={},p=new Set,c=new WeakSet;let u=!0,b,h=!1;function A(e){h||(h=!0,u??=!1,b??="hover",S(),T(),M(),O())}function S(){for(const e of["touchstart","mousedown"])document.addEventListener(e,r=>{d(r.target,"tap")&&m(r.target.href,{ignoreSlowConnection:!0})},{passive:!0})}function T(){let e;document.body.addEventListener("focusin",t=>{d(t.target,"hover")&&r(t)},{passive:!0}),document.body.addEventListener("focusout",a,{passive:!0}),f(()=>{for(const t of document.getElementsByTagName("a"))c.has(t)||d(t,"hover")&&(c.add(t),t.addEventListener("mouseenter",r,{passive:!0}),t.addEventListener("mouseleave",a,{passive:!0}))});function r(t){const o=t.target.href;e&&clearTimeout(e),e=setTimeout(()=>{m(o)},80)}function a(){e&&(clearTimeout(e),e=0)}}function M(){let e;f(()=>{for(const r of document.getElementsByTagName("a"))c.has(r)||d(r,"viewport")&&(c.add(r),e??=C(),e.observe(r))})}function C(){const e=new WeakMap;return new IntersectionObserver((r,a)=>{for(const t of r){const o=t.target,n=e.get(o);t.isIntersecting?(n&&clearTimeout(n),e.set(o,setTimeout(()=>{a.unobserve(o),e.delete(o),m(o.href)},300))):n&&(clearTimeout(n),e.delete(o))}})}function O(){f(()=>{for(const e of document.getElementsByTagName("a"))d(e,"load")&&m(e.href)})}function m(e,r){e=e.replace(/#.*/,"");const a=r?.ignoreSlowConnection??!1;if(P(e,a))if(p.add(e),document.createElement("link").relList?.supports?.("prefetch")&&r?.with!=="fetch"){const t=document.createElement("link");t.rel="prefetch",t.setAttribute("href",e),document.head.append(t)}else{const t=new Headers;for(const[o,n]of Object.entries(L))t.set(o,n);fetch(e,{priority:"low",headers:t})}}function P(e,r){if(!navigator.onLine||!r&&v())return!1;try{const a=new URL(e,location.href);return location.origin===a.origin&&(location.pathname!==a.pathname||location.search!==a.search)&&!p.has(e)}catch{}return!1}function d(e,r){if(e?.tagName!=="A")return!1;const a=e.dataset.astroPrefetch;return a==="false"?!1:r==="tap"&&(a!=null||u)&&v()?!0:a==null&&u||a===""?r===b:a===r}function v(){if("connection"in navigator){const e=navigator.connection;return e.saveData||/2g/.test(e.effectiveType)}return!1}function f(e){e();let r=!1;document.addEventListener("astro:page-load",()=>{if(!r){r=!0;return}e()})}const y=()=>document.querySelectorAll("pre.mermaid").length>0;let s=null;async function I(){return s||(console.log("[astro-mermaid] Loading mermaid.js..."),s=E(()=>import("./mermaid.core.BI-IS_z6.js").then(e=>e.bE),__vite__mapDeps([0,1])).then(async({default:e})=>{const r=[];if(r&&r.length>0){console.log("[astro-mermaid] Registering",r.length,"icon packs");const a=r.map(t=>({name:t.name,loader:new Function("return "+t.loader)()}));await e.registerIconPacks(a)}return e}).catch(e=>{throw console.error("[astro-mermaid] Failed to load mermaid:",e),s=null,e}),s)}const l={startOnLoad:!1,theme:"default"},_={light:"default",dark:"dark"};async function g(){console.log("[astro-mermaid] Initializing mermaid diagrams...");const e=document.querySelectorAll("pre.mermaid");if(console.log("[astro-mermaid] Found",e.length,"mermaid diagrams"),e.length===0)return;const r=await I();let a=l.theme;{const t=document.documentElement.getAttribute("data-theme"),o=document.body.getAttribute("data-theme");a=_[t||o]||l.theme,console.log("[astro-mermaid] Using theme:",a,"from",t?"html":"body")}r.initialize({...l,theme:a,gitGraph:{mainBranchName:"main",showCommitLabel:!0,showBranches:!0,rotateCommitLabel:!0}});for(const t of e){if(t.hasAttribute("data-processed"))continue;t.hasAttribute("data-diagram")||t.setAttribute("data-diagram",t.textContent||"");const o=t.getAttribute("data-diagram")||"",n="mermaid-"+Math.random().toString(36).slice(2,11);console.log("[astro-mermaid] Rendering diagram:",n);try{const i=document.getElementById(n);i&&i.remove();const{svg:k}=await r.render(n,o);t.innerHTML=k,t.setAttribute("data-processed","true"),console.log("[astro-mermaid] Successfully rendered diagram:",n)}catch(i){console.error("[astro-mermaid] Mermaid rendering error for diagram:",n,i),t.innerHTML=`<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 0.5rem;">
        <strong>Error rendering diagram:</strong><br/>
        ${i.message||"Unknown error"}
      </div>`,t.setAttribute("data-processed","true")}}}y()?(console.log("[astro-mermaid] Mermaid diagrams detected on initial load"),g()):console.log("[astro-mermaid] No mermaid diagrams found on initial load");{const e=new MutationObserver(r=>{for(const a of r)a.type==="attributes"&&a.attributeName==="data-theme"&&(document.querySelectorAll("pre.mermaid[data-processed]").forEach(t=>{t.removeAttribute("data-processed")}),g())});e.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),e.observe(document.body,{attributes:!0,attributeFilter:["data-theme"]})}document.addEventListener("astro:after-swap",()=>{console.log("[astro-mermaid] View transition detected"),y()&&g()});const w=document.createElement("style");w.textContent=`
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
