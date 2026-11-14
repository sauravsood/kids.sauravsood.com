import{B as e,C as t,Ct as n,D as r,Dt as i,E as a,Et as o,Ft as s,G as c,Gn as l,Hn as u,In as d,K as f,L as p,Lt as m,N as h,Nn as g,Ot as _,Pn as v,Qt as y,St as b,U as x,Vt as S,W as C,Wn as w,Wt as T,X as E,Xn as D,a as O,ar as k,at as A,c as ee,ct as j,d as M,dt as te,er as N,g as P,hr as ne,ir as re,j as F,kn as ie,kt as ae,l as oe,lt as I,m as se,mr as L,ot as ce,pr as R,s as z,st as le,tr as ue,u as B,v as de,w as fe,xt as V,yt as H,z as pe,zt as U}from"./three-Cw8EMJ2v.js";import{n as me,r as he,t as ge}from"./three-Cc4VSNGD.js";import{r as _e,v as ve}from"./index-CBjIQQGn.js";import{a as ye,i as be,n as xe}from"./three-qSH2ElZP.js";import{t as Se}from"./environment-theme-registry-CCAOOKCe.js";var Ce=`sky-ocean-horizon-production-review-v10`,we={assetId:`scale-encounter-sky-ocean-horizon-production-review-v2`,buildSource:`sky-production-review-2026-08-17-v2`,manifestSha256:`3fd31162a913b565194d8199602c1e2eaf62c056d216253afebf88d481f5dfd7`,leonApproved:!0,naturalnessGate:`owner-approved-2026-08-24`,naturalnessRevision:`responsive-portrait-and-landscape-aerial-island-atlas-subject-fill-v11`,toneMappingExposure:1.1};new L(0,4.8,0),new L(Math.cos(70*Math.PI/180),Math.sin(70*Math.PI/180),0).normalize(),new L(-Math.sin(70*Math.PI/180),Math.cos(70*Math.PI/180),0).normalize();var Te=[{id:`subject-flight`,minimumAltitudeMeters:58,maximumAltitudeMeters:78},{id:`near-air`,minimumAltitudeMeters:78,maximumAltitudeMeters:105},{id:`mid-cloud`,minimumAltitudeMeters:34,maximumAltitudeMeters:57},{id:`far-cloud`,minimumAltitudeMeters:16,maximumAltitudeMeters:33}],Ee={A:{id:`A`,label:`Background only`,layers:[`subject`,`background-atmosphere`],purpose:`Tests the seam-safe clear-sky direction layer and locked two-subject composition.`},B:{id:`B`,label:`Flight volume + sea`,layers:[`subject`,`background-atmosphere`,`flight-volume`],purpose:`Adds the declared flight volume and a restrained world-space sea height reference; the prototype coastline is omitted from the main integration calibration.`},C:{id:`C`,label:`Layered coastal sky`,layers:[`subject`,`background-atmosphere`,`flight-volume`,`near-air`,`mid-cloud`,`far-cloud`],purpose:`Adds low-opacity near, mid and far cloud structure plus restrained horizon atmosphere while preserving the subject corridor.`},D:{id:`D`,label:`Coherent sky radiance`,layers:[`subject`,`background-atmosphere`,`flight-volume`,`near-air`,`mid-cloud`,`far-cloud`],purpose:`Preserves the accepted C composition while one linear HDR radiance source drives the visible sky, distant sea reflection, PMREM and world sun.`}};function De(e){return Ee[e].layers}function Oe(e){return e- -60}var ke=null;function Ae(){return ke??=new be().loadAsync(new URL(``+new URL(`island-landforms-v2-BCh1mJpN.glb`,import.meta.url).href,``+import.meta.url).href).then(e=>e.scene).catch(e=>{throw ke=null,e}),ke}function je(e){let t=new x;t.name=`distant-vegetated-coast`;for(let[n,r,i,a,o]of[[`woodland-island`,-26,4.4,.13,.35],[`cove-island`,-8.5,-17.4,.15,-.62],[`cove-island`,-145,-265,1.65,1.48]]){let s=e?.getObjectByName(n);if(!s)continue;let c=s.clone(!0);c.name=`sky-${n}`,c.traverse(e=>{if(!(e instanceof b))return;let t=e;t.geometry=t.geometry.clone();let n=e=>{let t=e.clone();return t.alphaToCoverage=!0,t.envMapIntensity=.6,t.onBeforeCompile=e=>{e.uniforms.uCoastHaze={value:new P(`#80afbc`)},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vCoastWorld;`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
vCoastWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vCoastWorld;
uniform vec3 uCoastHaze;`).replace(`#include <map_fragment>`,me.map_fragment.replace(`texture2D( map, vMapUv )`,`texture2D( map, vMapUv, 1.8 )`)).replace(`#include <tonemapping_fragment>`,`
float coastDistance = distance(cameraPosition, vCoastWorld);
float aerialPerspective = .24 + smoothstep(60.0, 450.0, coastDistance) * .34;
gl_FragColor.rgb = mix(gl_FragColor.rgb, uCoastHaze, aerialPerspective);
#include <tonemapping_fragment>`)},t.customProgramCacheKey=()=>`coast-aerial-perspective-v3`,t};t.material=Array.isArray(t.material)?t.material.map(n):n(t.material)}),c.position.set(r,-59.88,i),c.rotation.y=o,c.scale.set(a,a*1.3,a),t.add(c)}return t.userData.assetRepresentation=`unique-generated-colour-plates-on-authored-continuous-landforms`,t.userData.localReview=`2026-09-05`,t}var Me={current:1,"1.25x":1.25,"1.5x":1.5};function Ne(e){return Me[e]}function Pe(e,t){return Math.round(e*Ne(t))}function Fe(e,t){let n=e.onBeforeCompile.bind(e);e.onBeforeCompile=(e,r)=>{n(e,r),e.uniforms.uGroundColourPlate={value:t.colourMap},e.uniforms.uGroundPlateWidth={value:t.widthMeters},e.uniforms.uGroundDetailWidth={value:t.detailMeters},e.uniforms.uGroundFarColour={value:new P(t.farColour)},e.uniforms.uGroundGrain={value:t.grainStrength??.85},e.uniforms.uGroundColourMip={value:t.colourMipLevel??6},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vAuthoredGroundWorld;`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
vAuthoredGroundWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vAuthoredGroundWorld;
uniform sampler2D uGroundColourPlate;
uniform float uGroundPlateWidth;
uniform float uGroundDetailWidth;
uniform vec3 uGroundFarColour;
uniform float uGroundGrain;
uniform float uGroundColourMip;

vec2 groundOffset(vec2 cell) {
  return fract(sin(vec2(dot(cell, vec2(127.1, 311.7)), dot(cell, vec2(269.5, 183.3)))) * 43758.5453);
}
// Three offset samples share a triangular blend. Texture derivatives are
// taken before the offsets, keeping mip selection stable at cell boundaries.
vec4 sampleGroundScan(sampler2D source, vec2 uv) {
  vec2 grid = mat2(1.0, 0.0, -.57735027, 1.15470054) * uv * 3.46410162;
  vec2 cell = floor(grid);
  vec2 f = fract(grid);
  vec2 a = cell;
  vec2 b = cell + vec2(1.0, 0.0);
  vec2 c = cell + vec2(0.0, 1.0);
  vec3 weights = vec3(1.0 - f.x - f.y, f.x, f.y);
  if (f.x + f.y > 1.0) {
    a = cell + 1.0;
    weights = vec3(f.x + f.y - 1.0, 1.0 - f.y, 1.0 - f.x);
  }
  vec2 dx = dFdx(uv);
  vec2 dy = dFdy(uv);
  return textureGrad(source, uv + groundOffset(a), dx, dy) * weights.x
       + textureGrad(source, uv + groundOffset(b), dx, dy) * weights.y
       + textureGrad(source, uv + groundOffset(c), dx, dy) * weights.z;
}`).replace(`#include <map_fragment>`,`
vec2 groundDetailUv = vec2(vAuthoredGroundWorld.x, -vAuthoredGroundWorld.z) / uGroundDetailWidth;
vec2 groundPlateUv = vec2(vAuthoredGroundWorld.x, -vAuthoredGroundWorld.z) / uGroundPlateWidth + 0.5;
float groundDistance = distance(cameraPosition, vAuthoredGroundWorld);
float groundDetailFade = 1.0 - smoothstep(18.0, 58.0, groundDistance);
float groundGrainFade = 1.0 - smoothstep(60.0, 200.0, groundDistance);
float groundPlateFade = 1.0 - smoothstep(0.34, 0.50, length(vAuthoredGroundWorld.xz) / uGroundPlateWidth);
vec3 groundColour = mix(uGroundFarColour, textureLod(uGroundColourPlate, groundPlateUv, uGroundColourMip).rgb, groundPlateFade * .45);
#ifdef USE_MAP
float groundGrain = dot(sampleGroundScan(map, groundDetailUv).rgb, vec3(0.2126, 0.7152, 0.0722));
groundColour *= mix(1.0, clamp(groundGrain / .24, .35, 2.0), uGroundGrain * groundGrainFade);
#endif
diffuseColor.rgb *= groundColour;`).replace(`#include <roughnessmap_fragment>`,`
float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
roughnessFactor *= 0.88 + 0.12 * sampleGroundScan(roughnessMap, groundDetailUv).g;
#endif`).replace(`#include <normal_fragment_maps>`,me.normal_fragment_maps.replaceAll(`texture2D( normalMap, vNormalMapUv )`,`sampleGroundScan( normalMap, groundDetailUv )`).replace(`mapN.xy *= normalScale;`,`
mapN = normalize(mapN);
mapN.xy *= normalScale * groundDetailFade;`)).replace(`#include <shadowmap_pars_fragment>`,me.shadowmap_pars_fragment.replace(`interleavedGradientNoise( gl_FragCoord.xy ) * PI2`,`0.0`))},e.customProgramCacheKey=()=>`authored-ground-plate-v3`,e.userData.authoredGround={widthMeters:t.widthMeters,repeats:!1}}function Ie(e,t,n=()=>0,r,i){let a=t?`snow`:e===`land`?`forest`:e,o=new x;o.name=`scale-encounter-living-${a}`;let s=a===`snow`?2800:a===`forest`?700:a===`water`?240:0,c=a===`snow`?700:a===`forest`?180:a===`water`?80:0,u=a===`snow`?1800:a===`forest`?480:a===`water`?160:0,d=u,f=1/60,p=0,h=0,g=a===`snow`?42:32,_=a===`snow`?16:a===`water`?24:7,v={uPopulation:{value:u},uTime:{value:0},uCentre:{value:new L},uViewport:{value:900},uWidth:{value:g},uHeight:{value:_},uSnow:{value:+!!t},uWater:{value:+(a===`water`)},uColour:{value:new P(t?`#edf5ff`:a===`water`?`#99d6d9`:`#e7d8a4`)}};if(a===`forest`){let e=new Set;i?.traverse(t=>{if(!(t instanceof E)||!/(hero-ferns|real-ferns|fern-frond-batch|riparian-whorl-batch)$/.test(t.name))return;let n=t,r=t.name.endsWith(`fern-frond-batch`),i=new V;n.getMatrixAt(0,i),n.updateWorldMatrix(!0,!1),i.premultiply(n.matrixWorld);let a=new L(0,1,0).transformDirection(i.invert()),o=n.geometry.getAttribute(`position`),s=1/0,c=-1/0,l=new L;for(let e=0;e<o.count;e++){l.fromBufferAttribute(o,e);let t=r?l.x:l.dot(a);s=Math.min(s,t),c=Math.max(c,t)}let u=(c-s)*(r?.1:.085),d=`vec3(${a.toArray().map(e=>e.toFixed(6)).join(`,`)})`;for(let t of Array.isArray(n.material)?n.material:[n.material]){if(e.has(t))continue;e.add(t);let n=t.onBeforeCompile.bind(t),i=t.customProgramCacheKey();t.onBeforeCompile=(e,t)=>{n(e,t),e.uniforms.uEncounterBreeze=v.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uEncounterBreeze;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
              float leafTip = smoothstep(${s.toFixed(6)}, ${(c+1e-5).toFixed(6)}, ${r?`position.x`:`dot(position, ${d})`});
              float plantPhase = instanceMatrix[3].x * .31 + instanceMatrix[3].z * .23;
              float wind = sin(uEncounterBreeze * 1.35 + plantPhase) * .78 + sin(uEncounterBreeze * 2.1 + plantPhase * 1.7) * .22;
              transformed += ${r?`vec3(0.,1.,.28)`:`(${d} * .3 + vec3(.8,0.,.45))`} * wind * leafTip * leafTip * ${u.toFixed(6)};
            `)},t.customProgramCacheKey=()=>`${i}-living-leaf-tips-v2-${s}-${c}-${u}-${d}-${r}`,t.needsUpdate=!0}})}let y=new Float32Array(s*3),C=new Float32Array(s),w=19373,T=()=>(w=Math.imul(w,1664525)+1013904223>>>0,w/4294967296);for(let e=0;e<s;e++)y[e*3]=T()*g,y[e*3+1]=T()*_,y[e*3+2]=T()*g,C[e]=t?.018+T()*.025:.008+T()*.014;let D=new M;D.setAttribute(`position`,new B(y,3)),D.setAttribute(`aSize`,new B(C,1)),D.setAttribute(`aRank`,new B(Float32Array.from({length:s},(e,t)=>t),1)),D.setDrawRange(0,u);let O=new l({uniforms:v,transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:`
      uniform float uTime, uWidth, uHeight, uViewport, uSnow, uWater, uPopulation;
      uniform vec3 uCentre;
      attribute float aSize, aRank;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float phase = position.x * 2.9 + position.z;
        p.x += uTime * mix(.10, .24, uSnow) + sin(uTime * .42 + phase) * .27;
        p.z += uTime * .06 + cos(uTime * .31 + phase) * .23;
        p.xz = mod(p.xz - uCentre.xz + uWidth * .5, uWidth) - uWidth * .5 + uCentre.xz;
        p.y = mod(p.y - uTime * mix(-.035, .56 + aSize * 5., uSnow), uHeight) + uCentre.y;
        vec4 mv = viewMatrix * vec4(p, 1.);
        float edge = 1. - smoothstep(uWidth * .32, uWidth * .49, length(p.xz - uCentre.xz));
        float groundFade = smoothstep(0., .6, p.y - uCentre.y);
        float nearFade = smoothstep(.9, 2.8, -mv.z);
        float lightPocket = .75 + .25 * sin(p.x * .31 + p.z * .19);
        float populationFade = 1. - smoothstep(max(0., uPopulation - 70.), uPopulation, aRank);
        vAlpha = edge * groundFade * nearFade * mix(.43 * lightPocket, .8, uSnow) * populationFade;
        gl_PointSize = clamp(aSize * uViewport * projectionMatrix[1][1] / max(1., -mv.z), 1., 9.);
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform vec3 uColour;
      varying float vAlpha;
      void main() {
        float radius = length(gl_PointCoord - .5) * 2.;
        float alpha = (1. - smoothstep(.18, 1., radius)) * vAlpha;
        if (alpha < .008) discard;
        gl_FragColor = vec4(uColour, alpha);
        #include <colorspace_fragment>
      }
    `}),k=new S(D,O);k.name=`scale-encounter-${a}-drift`,k.frustumCulled=!1,s>0&&o.add(k);let A=new b(new U(1,1),new l({transparent:!0,depthWrite:!1,side:2,uniforms:{uLife:{value:0},uColour:v.uColour},vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv; uniform float uLife; uniform vec3 uColour;
      void main(){float r=length((vUv-.5)*2.);float a=exp(-r*r*5.)*(1.-smoothstep(.6,1.,r));
      gl_FragColor=vec4(uColour,a*sin(uLife*3.14159)*.3);
      #include <colorspace_fragment>}`}));A.name=`scale-encounter-soft-foot-settle`,A.visible=!1,o.add(A);let ee=null,j=0,te=-100;return{root:o,kind:a,particleCapacity:s,get particleCount(){return Math.round(u)},get timeSeconds(){return j},update:(e,t,i)=>{let o=ee===null?0:e-ee,l=H.clamp(o,0,.1);if(!t&&o>0&&o<.25&&(f=H.damp(f,o,1.5,o),p+=o,h=f<1/55?h+o:0,p>=2&&j>3&&(f>1/40?d=Math.max(c,d*.72):h>6&&(d=Math.min(s,d+s*.12)),p=0),u=H.damp(u,d,1.6,l)),v.uPopulation.value=u,D.setDrawRange(0,Math.ceil(u)),ee=e,t||(j+=l),v.uTime.value=j,k.visible=!t,i){let e=i instanceof m?i.position:i;v.uCentre.value.set(e.x,a===`water`?e.y-_*.5:n(e.x,e.z),e.z),i instanceof m&&A.quaternion.copy(i.quaternion)}v.uViewport.value=r?.domElement.height??900;let g=(j-te)/1.8;A.visible=!t&&g>=0&&g<1,A.visible&&(A.material.uniforms.uLife.value=g,A.scale.set(.65+g*1.2,.3+g*.5,1))},settleFoot:e=>{te=j,A.position.set(e.x,n(e.x,e.z)+.12,e.z)},dispose:()=>{o.removeFromParent(),D.dispose(),O.dispose(),A.geometry.dispose(),A.material.dispose(),o.clear()}}}var Le=``+new URL(`footstep-water-splash-v1-DKpn6TTv.webp`,import.meta.url).href;function Re(e,t){let r=new x;r.name=`scale-encounter-visitor-water-splashes`,r.rotation.x=Math.PI/2;let i=new ue().load(Le);i.colorSpace=u;let a=new U(1,1).translate(0,.42,0),o=Array.from({length:8},()=>new ne(0,0,-10,0)),s=new ne(0,0,0,0),c=new ne(1,0,0,0),l=o.map(()=>{let e=new n({map:i,color:`#becbd0`,transparent:!0,opacity:0,depthWrite:!1,side:2,alphaTest:.01});e.onBeforeCompile=e=>{e.uniforms.waterLevel={value:t},e.vertexShader=`varying float vSplashHeight;
`+e.vertexShader,e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`
        vSplashHeight = (modelMatrix * vec4(transformed, 1.0)).y;
        #include <project_vertex>
      `),e.fragmentShader=`uniform float waterLevel;
varying float vSplashHeight;
`+e.fragmentShader,e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`
        if (vSplashHeight < waterLevel + 0.004) discard;
        #include <map_fragment>
        // Neutral water catches the scene's light without blue cutout fringes.
        float waterLuma = dot(diffuseColor.rgb, vec3(.2126, .7152, .0722));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(waterLuma), .82);
      `)};let o=new b(a,e);return o.name=`scale-encounter-footstep-spray`,o.renderOrder=1,o.visible=!1,r.add(o),{mesh:o,directionX:0,directionZ:0,speed:0,flip:1}}),d=null,f=0,p=0,m=1,h=!1,g=()=>{o.forEach((e,t)=>{e.w=0,l[t].mesh.visible=!1}),f=0,h=!1,s.z=0,c.z=0};function _(t,n,r,i,a,s){let u=s?0:H.clamp(t.heightMeters*.075,.07,.14)*m,d=s?0:H.clamp(t.heightMeters*.16,.14,.28),f=t.x+i*d-a*u,h=t.z+a*d+i*u;e(f,h)<.015&&(f=t.x,h=t.z);let g=e(f,h);if(g<.015)return;o[p].set(f,h,n,r*H.smoothstep(g,.005,.12));let _=l[p];_.directionX=i,_.directionZ=a,_.speed=s?0:c.z,_.flip=m,p=(p+1)%8,m*=-1}function v(n,r,i){if(!r){g(),d=null;return}let a=e(r.x,r.z),u=a>.015&&r.feetY<=t+.01;if(d){let e=n-d.time,i=r.x-d.x,o=r.z-d.z,l=Math.hypot(i,o);if(e<=0||e>.25||l>Math.max(.8,e*8))g();else{let p=l/e,m=l>.001?i/l:1,g=l>.001?o/l:0,v=Math.max(0,Math.min(a,t-r.feetY)),y=u&&!r.airborne&&p>.08,b=y?H.clamp(p/1.4,0,1.6)*H.smoothstep(v,.01,.22):0;s.set(r.x,r.z,H.lerp(s.z,b,1-Math.exp(-e*(y?18:10))),H.clamp(r.heightMeters*.19,.16,.34)),(!u||r.airborne)&&(s.z=0),y&&c.set(m,g,p,v),r.airborne&&!d.airborne&&(h=!1);let x=d.airborne&&!r.airborne&&!h,S=u&&!d.wet&&r.verticalVelocity<=0;if(u&&(S||x)){let e=Math.max(-r.verticalVelocity,-d.verticalVelocity),t=x||r.airborne;_(r,n,t?H.clamp(.8+e*.18,.8,1.6):H.clamp(.38+p*.22,.38,.9),m,g,t),h=t,f=0}else if(u&&!r.airborne&&p>.08){f+=l;let e=H.lerp(.75,.93,H.smoothstep(p,1.7,2.5));f>=e&&(_(r,n,H.clamp(.34+p*.18,.38,.85),m,g,!1),f%=e)}else u||(f=0)}}d={...r,time:n,wet:u},o.forEach((e,t)=>{let r=l[t],a=n-e.z;a>=3&&(e.w=0);let o=.58+e.w*.14;if(r.mesh.visible=e.w>0&&a>=0&&a<o,!r.mesh.visible)return;let s=a/o,c=4*s*(1-s),u=(.24+e.w*.4)*(.7+s*.65),d=(.12+e.w*.3)*c,f=r.speed*.18*(1-Math.exp(-a/.18)),p=r.flip*a*.24;r.mesh.scale.set(u*r.flip,d,1),r.mesh.position.set(e.x+r.directionX*f-r.directionZ*p,.005,e.y+r.directionZ*f+r.directionX*p),i&&(r.mesh.rotation.y=Math.atan2(i.x-e.x,i.z-e.y)),r.mesh.material.opacity=(.4+e.w*.14)*H.smoothstep(s,0,.07)*(1-H.smoothstep(s,.25,1))})}return{root:r,ripples:o,push:s,flow:c,update:v}}function ze(e,t,n,r=240){let i=[],a=[],o=[],s=Math.ceil(r*10);for(let c=0;c<=s;c+=1){let l=-r+c/s*r*2,u=t(l),d=t=>{if(e(l,u)>=n)return 0;let r=0,i=18;for(let a=0;a<16;a+=1){let a=(r+i)/2;e(l,u+t*a)<n?r=a:i=a}return t*r},f=d(-1),p=d(1);for(let t=0;t<=12;t+=1){let r=u+f+(p-f)*t/12;if(i.push(l,-r,0),a.push(Math.max(0,n-e(l,r))),c<s&&t<12){let e=c*13+t;o.push(e,e+1,e+12+1,e+1,e+12+2,e+12+1)}}}let c=new M;c.setAttribute(`position`,new B(new Float32Array(i),3)),c.setAttribute(`waterDepth`,new B(new Float32Array(a),1)),c.setIndex(o),c.computeVertexNormals();let l=Re((i,a)=>Math.abs(i)<=r&&Math.abs(a-t(i))<18?Math.max(0,n-e(i,a)):0,n),u=new xe(c,{clipBias:.003,textureWidth:1024,textureHeight:1024,multisample:0,color:new P(`#536b60`),shader:{uniforms:re.merge([he.fog,{color:{value:new P},tDiffuse:{value:null},textureMatrix:{value:null},uTime:{value:0},uVisitorRipples:{value:l.ripples},uVisitorPush:{value:l.push},uVisitorFlow:{value:l.flow}}]),vertexShader:`
        uniform mat4 textureMatrix;
        attribute float waterDepth;
        varying vec4 vReflection;
        varying vec3 vRiverWorld;
        varying float vWaterDepth;
        #include <common>
        #include <fog_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        void main() {
          vWaterDepth = waterDepth;
          vReflection = textureMatrix * vec4(position, 1.0);
          vRiverWorld = (modelMatrix * vec4(position, 1.0)).xyz;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
          #include <logdepthbuf_vertex>
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform vec4 uVisitorRipples[8];
        uniform vec4 uVisitorPush;
        uniform vec4 uVisitorFlow;
        varying vec4 vReflection;
        varying vec3 vRiverWorld;
        varying float vWaterDepth;
        #include <common>
        #include <fog_pars_fragment>
        #include <logdepthbuf_pars_fragment>
        void main() {
          #include <logdepthbuf_fragment>
          vec2 p = vRiverWorld.xz;
          vec2 ripple = vec2(
            sin(p.x * 2.17 - p.y * .31 + uTime * .72) + sin(p.x * .63 + p.y * 1.79 - uTime * .43) * .42,
            sin(p.x * .42 + p.y * 2.41 - uTime * .61) + cos(p.x * 1.83 - p.y * .77 + uTime * .39) * .34
          );
          float visitorCrest = 0.0;
          float bowCrest = 0.0;
          if (uVisitorPush.z > .001) {
            vec2 direction = uVisitorFlow.xy;
            vec2 sideDirection = vec2(-direction.y, direction.x);
            vec2 relative = p - uVisitorPush.xy;
            float forward = dot(relative, direction);
            float side = dot(relative, sideDirection);
            float bodyRadius = uVisitorPush.w;
            // Open horseshoe at the leading side, with two diverging flanks.
            // The pressure ridge travels with the legs, unlike the old rings.
            float radius = length(vec2(forward * .82, side));
            float ridge = radius - bodyRadius - .10;
            float width = .026 + uVisitorFlow.w * .035;
            float arc = smoothstep(-bodyRadius * .35, .08, forward);
            float bow = exp(-ridge * ridge / (width * width)) * arc;
            vec2 radial = (direction * forward * .6724 + sideDirection * side) / max(radius, .025);
            float bowSlope = ridge / width * bow;
            ripple += radial * bowSlope * uVisitorPush.z * 13.0;
            bowCrest = bow * bow * uVisitorPush.z;
            float behind = -forward;
            float flankDistance = abs(side) - (bodyRadius + .08 + behind * .48);
            float flank = exp(-flankDistance * flankDistance / .0036)
              * smoothstep(-.06, .16, behind) * exp(-max(behind, 0.0) * 1.8);
            vec2 flankNormal = normalize(sideDirection * sign(side) + direction * .48);
            ripple += flankNormal * flankDistance / .06 * flank * uVisitorPush.z * 7.0;
            bowCrest += flank * uVisitorPush.z * .3;
          }
          for (int i = 0; i < 8; i++) {
            vec4 impact = uVisitorRipples[i];
            float age = uTime - impact.z;
            if (impact.w <= 0.0 || age < 0.0 || age >= 3.0) continue;
            vec2 offset = p - impact.xy;
            float radius = length(offset);
            float front = radius - (.09 + age * .85);
            float width = .08 + age * .025;
            float envelope = exp(-front * front / (width * width))
              * smoothstep(0.0, .1, age) * pow(1.0 - age / 3.0, 1.5);
            float wave = cos(front * 38.0) * envelope * impact.w;
            ripple += offset / max(radius, .02) * wave * 4.5;
            visitorCrest += max(0.0, wave);
          }
          float shore = smoothstep(.01, .12, vWaterDepth);
          vec2 reflectionUv = vReflection.xy / vReflection.w;
          reflectionUv += ripple * .00125 * shore;
          vec3 reflection = texture2D(tDiffuse, reflectionUv).rgb;
          vec3 normal = normalize(vec3(ripple.x * .022 * shore, 1.0, ripple.y * .022 * shore));
          vec3 viewDirection = normalize(cameraPosition - vRiverWorld);
          float fresnel = .02 + .98 * pow(1.0 - max(dot(normal, viewDirection), 0.0), 5.0);
          vec3 bed = mix(vec3(.16, .105, .061), vec3(.052, .083, .068), 1.0 - exp(-vWaterDepth * 1.8));
          vec3 waterColour = mix(bed, reflection, .22 + fresnel * .36);
          waterColour += vec3(.026, .032, .033) * visitorCrest * shore;
          // A narrow grazing highlight makes the water piled against the legs
          // readable while its darker outer slope retains reflected scenery.
          waterColour += vec3(.021, .027, .028) * bowCrest * shore;
          gl_FragColor = vec4(waterColour, shore * .94);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `}});u.name=`scale-encounter-floodplain-seasonal-channel-water`,u.rotation.x=-Math.PI/2,u.position.y=n,u.add(l.root);let d=u.material;return d.uniforms.uVisitorRipples.value=l.ripples,d.uniforms.uVisitorPush.value=l.push,d.uniforms.uVisitorFlow.value=l.flow,d.transparent=!0,d.depthWrite=!1,d.fog=!0,d.addEventListener(`dispose`,()=>u.getRenderTarget().dispose()),u.userData.shoreline=`shared-terrain-height-fixed-elevation`,Object.assign(u,{updateWater(e,t,n,r){d.uniforms.uTime.value=t?0:e,l.update(e,t?null:r??null,n instanceof m?n.position:n)}})}var Be=-.04,Ve=Math.PI*2,He=.04,Ue=[0,1.5,3,4.5,6,8,10,12,14,16,18,20,22,25,29,34,40,47,55],We=24,Ge=144,Ke=.011,qe=.055;function Je(e){return e<=82?288:e<=170?216:Ge}function Ye(e){return Math.max(0,Math.min(1,e))}function Xe(e,t,n){let r=Ye((n-e)/(t-e));return r*r*(3-2*r)}function Ze(e,t,n){let r=Ye((n-e)/(t-e));return r**3*(r*(r*6-15)+10)}function Qe(e,t,n){let r=Math.sin(e*127.1+t*311.7+n*74.7)*43758.5453123;return r-Math.floor(r)}function $e(e,t,n,r){return Math.hypot(e-Math.max(n,Math.min(r,e)),t)}function et(e,t){let n=Ze(1,1.34,Math.sqrt(((e-2.2)/9.2)**2+(t/4.2)**2)),r=Ze(1.45,3.6,$e(e,t,-22.5,-6.5));return Math.min(n,r)}function tt(e,t){return Math.exp(-(((e+18)/12)**2+((t+12)/9)**2))*.05+Math.exp(-(((e-22)/14)**2+((t-16)/7)**2))*.06+Math.exp(-(((e+8)/10)**2+((t-20)/11)**2))*.035}function nt(e,t){let n=Ze(14,52,Math.hypot(e,t)),r=Math.sin(e*.047+t*.019+.72)*.24+Math.sin(e*-.021+t*.039-1.14)*.21+Math.cos(e*.011-t*.026+.31)*.16,i=Math.exp(-(((e+46)/55)**2+((t-96)/34)**2))*3.7+Math.exp(-(((e-68)/71)**2+((t-127)/42)**2))*5.2+Math.exp(-(((e+132)/88)**2+((t+7)/61)**2))*4.1+Math.exp(-(((e-148)/97)**2+((t+58)/73)**2))*4.8+Math.exp(-(((e+22)/122)**2+((t+176)/56)**2))*5.6,a=et(e,t);return He+tt(e,t)*a+n*(r+i)*a}function rt(e,t){return nt(e,-t)+Be}function it(){let e=[...Ue],t=Ue[Ue.length-1],n=360-t;for(let r=1;r<=We;r+=1){let i=r/We;e.push(t+n*(.55*i+.45*i*i))}return e}function at(e,t){let n=new P(`#eeede8`),r=new P(`#f2efe8`),i=new P(`#dfe5dc`),a=Qe(Math.floor((e.localX+420)/38),Math.floor((e.localY+420)/38),19)*.42+Qe(Math.floor((e.localX+460)/73),Math.floor((e.localY+460)/73),41)*.33;return t.copy(n).lerp(r,.08+a*.22).lerp(i,Xe(92,260,e.radius)*.58)}function ot(e){let t=it(),n=e?[...Array.from({length:91},(e,t)=>t*.2),...Array.from({length:74},(e,t)=>18.5+t*.5),...t.filter(e=>e>55)]:t,r=e?(t,n)=>e(t,-n)-Be:nt,i=r(0,0),a=[0,0,i],o=[],s=[.5,.5],c=[],l=[],u=[],d=new P;at({height:i,localX:0,localY:0,radius:0},d).toArray(o,0);for(let t=1;t<n.length;t+=1){let i=n[t],c=Je(i);l.push(a.length/3),u.push(c);let f=e?0:Qe(t,17,5)*(Ve/c),p=Math.min(i-n[t-1],(n[t+1]??i+8)-i);for(let n=0;n<c;n+=1){let l=e?0:(Qe(t,n,11)-.5)*Ke,u=n/c*Ve+f+l,m=i<=25?0:(Qe(t,n,29)-.5)*Math.min(i*qe,4.8,p*.65),h=Math.max(0,Math.min(360,i+m)),g=Math.cos(u)*h,_=Math.sin(u)*h,v=r(g,_),y={height:v,localX:g,localY:_,radius:h};a.push(g,_,v),at(y,d).toArray(o,o.length),s.push(g/(360*2)+.5,_/(360*2)+.5)}}let f=l[0],p=u[0];for(let e=0;e<p;e+=1)c.push(0,f+e,f+(e+1)%p);for(let e=1;e<l.length;e+=1){let t=l[e-1],n=l[e],r=u[e-1],i=u[e],a=0,o=0;for(;a<r||o<i;){let e=(a+1)/r,s=(o+1)/i;a<r&&(o>=i||e<=s)?(c.push(t+a%r,n+o%i,t+(a+1)%r),a+=1):(c.push(t+a%r,n+o%i,n+(o+1)%i),o+=1)}}let m=new M;return m.name=`scale-encounter-production-terrain-geometry`,m.setAttribute(`position`,new B(new Float32Array(a),3)),m.setAttribute(`color`,new B(new Float32Array(o),3)),m.setAttribute(`uv`,new B(new Float32Array(s),2)),m.setIndex(c),m.computeVertexNormals(),m.computeBoundingSphere(),m}var st=-.12,ct={meganeura:{scale:1},lystrosaurus:{scale:1.15},archaeopteryx:{scale:.85},baryonyx:{scale:2},carnotaurus:{scale:2},"tyrannosaurus-rex":{scale:2.3},spinosaurus:{scale:2.4,offsetZ:8}};function lt(e){return 7.2+1.5*Math.sin(e*.08)+1.2*Math.tanh(e/8)}function ut(e,t,n,r){let i=rt(e,t),a=e/n,o=n*(4.5+1.2*Math.exp(-(((a+4)/8)**2))),s=Math.abs(t-r)/o,c=1-H.smoothstep(Math.abs(e),58,82),l=(1-H.smoothstep(s,.25,1))*c;return H.lerp(i,st-.5,l)}function dt(e){let t=ct[e];if(!t)return null;let{scale:n,offsetZ:r=0}=t,i=t=>lt(t/n)*n+r-(e===`meganeura`?8*Math.exp(-(((t+6.5)/2.8)**2)):0);return{centreZ:i,heightAtWorld:(e,t)=>ut(e,t,n,i(e))}}var ft={id:`eastern-alps-mis3-teaching-composite-v1`,reconstructionType:`teaching-composite`,location:{label:`奥地利东阿尔卑斯下因河谷一带`,region:`Lower Inn Valley, Eastern Alps, Austria`,precision:`区域级教学锚点，不对应一处猛犸象化石的原位瞬间`},time:{label:`约 45,000 年前`,interval:`MIS 3 first half, approximately 47–43 cal ka BP`},seasonClimate:{season:`晚春清晨`,state:`寒冷、偏干、开阔；河谷主体地表无冰，风吹薄雪只在背风洼地形成斑块`,defaultSnowCoverFraction:.22,snowDepthStatement:`不声明精确厘米数；视觉上只表现薄而不连续的季节性残雪`},iceRole:{type:`distant-high-elevation-glacier-and-ice-covered-ridge`,label:`远处高海拔小型冰川与覆冰山脊`,role:`只承担方向、尺度和寒冷气候参照；不可接近，不是猛犸象脚下表面，也不参与危险叙事`},facts:[`奥地利阿尔卑斯主要谷地在 MIS 3 前半段存在无冰时窗，猛犸象可进入谷地。`,`长毛猛犸象需要可取食的开阔陆地；冰期不等于站在冰川上。`,`MIS 3 东阿尔卑斯冷阶段可出现以灌木、草本和禾草为主的开阔植被。`],artisticDecisions:[`把晚春清晨作为儿童友好的平静观察时刻。`,`默认残雪约占可见地表五分之一，以便同时读清冷感、土壤和食物。`,`把远处冰体压在地平线小范围内，不形成环形冰墙或第二地平线。`],unknowns:[`没有把某一件猛犸象标本与同一瞬间的冰缘轮廓绑定。`,`精确雪深、植被覆盖率、太阳方位和高海拔冰体尺度没有直接代理数据。`,`场景是教学型综合复原，不能标成单一化石地点的现场照片。`],sources:[{id:`spotl-2018`,title:`Mammoths inside the Alps during the last glacial period`,doi:`https://doi.org/10.1016/j.quascirev.2018.04.020`,supports:`MIS 3 前半段奥地利阿尔卑斯主要谷地无冰及猛犸象进入谷地。`},{id:`ilyashuk-2022`,title:`Summer temperatures and environmental dynamics during the Middle Würmian (MIS 3) in the Eastern Alps`,doi:`https://doi.org/10.1016/j.qsa.2022.100050`,supports:`下因河谷 MIS 3 环境变化、融雪／冰水影响和冷凉夏季背景。`},{id:`starnberger-2013`,title:`Late Pleistocene climate change and landscape dynamics in the Eastern Alps`,doi:`https://doi.org/10.1016/j.quascirev.2013.02.008`,supports:`Unterangerberg 的 MIS 3 冷阶段以灌木、草本和禾草为主。`},{id:`wang-2021`,title:`Late Quaternary dynamics of Arctic biota from ancient environmental genomics`,doi:`https://doi.org/10.1038/s41586-021-04016-x`,supports:`无冰、冷干、季节性强且有低矮可食植被的跨区域生态边界。`}]},pt=180,mt=new L(-12,39,-207),ht=new L(18,67,-195),gt=new z(new L(-14,-.2,-4.2),new L(7.5,4.8,4.2)),_t={"wind-scoured":{coverFraction:.12,patchCount:24},balanced:{coverFraction:.22,patchCount:48},"late-snow":{coverFraction:.34,patchCount:72}};function vt(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function yt(e,t){let n=-11+16*Math.min(1,Math.max(0,(e- -11)/16));return Math.hypot(e-n,t)}function W(e,t){let n=Math.hypot(e,t),r=vt(5.5,19,yt(e,t)),i=vt(13,34,n);return(Math.sin(e*.047)*.46+Math.cos(t*.038)*.34+Math.sin((e+t)*.021)*.28+-vt(70,165,Math.abs(t))*.5)*r*i}function bt(e){let t=e>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}function xt(){let e=new l({side:1,depthWrite:!1,fog:!1,uniforms:{horizonColour:{value:new P(`#c5c7b8`)},lowerColour:{value:new P(`#8b8977`)},sunColour:{value:new P(`#fff0c8`)},sunDirection:{value:new L(-.42,.54,.73).normalize()},zenithColour:{value:new P(`#7890a3`)}},vertexShader:`
      varying vec3 vWorldDirection;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldDirection = normalize(world.xyz - cameraPosition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 horizonColour;
      uniform vec3 lowerColour;
      uniform vec3 sunColour;
      uniform vec3 sunDirection;
      uniform vec3 zenithColour;
      varying vec3 vWorldDirection;
      void main() {
        vec3 direction = normalize(vWorldDirection);
        float height = direction.y * 0.5 + 0.5;
        vec3 sky = mix(lowerColour, horizonColour, smoothstep(0.18, 0.5, height));
        sky = mix(sky, zenithColour, smoothstep(0.46, 0.94, height));
        float sun = pow(max(dot(direction, sunDirection), 0.0), 560.0);
        float glow = pow(max(dot(direction, sunDirection), 0.0), 9.0) * 0.15;
        sky += sunColour * (sun * 1.5 + glow);
        float lowHaze = 1.0 - smoothstep(0.43, 0.55, height);
        sky = mix(sky, horizonColour, lowHaze * 0.2);
        gl_FragColor = vec4(sky, 1.0);
      }
    `}),t=new b(new D(195,48,24),e);return t.name=`glacier-background-atmosphere-sky`,t.renderOrder=-100,t}function St(e,t,n){return 16+Math.max(0,1-Math.abs(e)/250)*n+Math.sin(e*.031+t)*9+Math.sin(e*.073-t*.7)*4.5}function Ct(e,t,n,r,i=-255,a=255){let o=[],s=[];for(let c=0;c<=96;c+=1){let l=c/96,u=i+(a-i)*l,d=St(u,t,n),f=e+Math.sin(u*.017+t)*3;if(o.push(u,r,f,u,d,f),c<96){let e=c*2;s.push(e,e+2,e+1,e+2,e+3,e+1)}}let c=new M;return c.setAttribute(`position`,new B(new Float32Array(o),3)),c.setIndex(s),c.computeVertexNormals(),c}function wt(e,t){let r=new b(Ct(-204,.8,37,-22),new _({color:`#626b6d`,flatShading:!0,roughness:1}));r.name=`glacier-far-rock-ridge`,r.receiveShadow=!0,e.add(r);let i=Ct(-201,.8,37,31,-12,18),a=i.getAttribute(`position`);for(let e=0;e<a.count;e+=2){let t=a.getX(e),n=a.getY(e+1);a.setY(e,Math.min(n-1,Math.max(39,n-7-Math.cos(t*.047)*1.5)))}a.needsUpdate=!0,i.computeVertexNormals();let o=new b(i,new _({color:`#d7e0dd`,emissive:`#26353a`,emissiveIntensity:.08,flatShading:!0,roughness:.82}));o.name=`glacier-far-ice-mass-direction-reference`,o.castShadow=!1,o.receiveShadow=!0,t.add(o);let s=new b(new U(560,38),new n({color:`#b7beb9`,depthWrite:!1,opacity:.16,transparent:!0}));s.name=`glacier-background-horizon-haze`,s.position.set(0,10,-181),s.renderOrder=-4,e.add(s)}function Tt(){let e=new U(pt*2,pt*2,112,112),t=e.getAttribute(`position`),n=[],r=new P;for(let e=0;e<t.count;e+=1){let i=t.getX(e),a=-t.getY(e);t.setZ(e,W(i,a));let o=Math.sin(i*.071)*.5+Math.cos(a*.064)*.35+Math.sin((i-a)*.023)*.15;r.set(o>.2?`#756d47`:o<-.28?`#5b4937`:`#686044`).offsetHSL(0,0,Math.sin(i*.19+a*.11)*.018),n.push(r.r,r.g,r.b)}return t.needsUpdate=!0,e.setAttribute(`color`,new B(new Float32Array(n),3)),e.computeVertexNormals(),e}function Et(){let e=new b(Tt(),new _({color:`#ffffff`,metalness:0,roughness:.96,vertexColors:!0}));return e.name=`glacier-ground-surface-unglaciated-land`,e.rotation.x=-Math.PI/2,e.receiveShadow=!0,e}function Dt(){let e=[0,0,0],t=[];for(let t=0;t<14;t+=1){let n=t/14*Math.PI*2,r=.78+Math.sin(t*4.31)*.12+Math.cos(t*2.17)*.08;e.push(Math.cos(n)*r,Math.sin(n)*r,0)}for(let e=0;e<14;e+=1)t.push(0,1+e,1+(e+1)%14);let n=new M;return n.setAttribute(`position`,new B(new Float32Array(e),3)),n.setIndex(t),n.computeVertexNormals(),n}function Ot(){let e=_t[`late-snow`].patchCount,t=new E(Dt(),new _({color:`#dce5e3`,metalness:0,roughness:.9,side:2}),e);t.name=`glacier-snow-layer-thin-patchy`,t.receiveShadow=!0;let n=bt(5351890),r=new V,i=new T,a=[],o=0;for(;a.length<e&&o<4e3;){o+=1;let e=n()*Math.PI*2,t=7+n()**.72*143,r=Math.cos(e)*t*(.72+n()*.5),i=Math.sin(e)*t;yt(r,i)<2.4||a.push({x:r,z:i,distance:Math.hypot(r,i)})}return a.sort((e,t)=>e.distance-t.distance),a.forEach(({x:e,z:a},o)=>{let s=n()*Math.PI;i.setFromEuler(new h(-Math.PI/2,0,s));let c=1.2+n()*4.6+Math.hypot(e,a)*.018;r.compose(new L(e,W(e,a)+.018,a),i,new L(c*(.8+n()*.9),c,1)),t.setMatrixAt(o,r)}),t.instanceMatrix.needsUpdate=!0,{maximumCount:e,mesh:t}}function kt(e,t,n,r,i,a,s,c,l){let u=new E(t,new o({color:n[0]??`#9c965c`}),r);u.name=e,u.castShadow=a<=34,u.receiveShadow=!0;let d=bt(s),f=new V,p=new T,m=0,h=0;for(;m<r&&h<r*80;){h+=1;let e=d()*Math.PI*2,t=i+d()**.78*(a-i),n=Math.cos(e)*t*(.82+d()*.42),r=Math.sin(e)*t;if(yt(n,r)<l)continue;let o=c[0]+d()*(c[1]-c[0]);p.setFromAxisAngle(new L(0,1,0),d()*Math.PI*2),f.compose(new L(n,W(n,r)+o*.5,r),p,new L(.72+d()*.7,o,.72+d()*.7)),u.setMatrixAt(m,f),m+=1}return u.count=m,u.instanceMatrix.needsUpdate=!0,u}function At(e,t){let n=new de(.045,1,3,1,!1),r=kt(`glacier-near-grass-and-sedge`,n,[`#b19d61`,`#9c965c`,`#c0a36a`,`#87915e`],380,5,34,96802,[.14,.46],2.5),i=kt(`glacier-mid-grass-and-sedge`,n.clone(),[`#918e59`,`#a59a62`,`#7d865b`],640,30,122,96803,[.09,.34],4.4);e.add(r),t.add(i);let a=kt(`glacier-near-low-forbs`,new de(.09,1,5,1,!1),[`#b58c73`,`#b9a077`,`#8d806c`,`#b29579`],92,7,45,166705,[.08,.28],3);e.add(a);let o=kt(`glacier-mid-dwarf-willow`,new f(.5,1),[`#75815b`,`#859167`,`#69765a`],54,17,88,236609,[.18,.52],5);t.add(o);let s=kt(`glacier-near-rock-and-loess-hummock`,new f(.5,1),[`#8d8578`,`#9b8d77`,`#77766f`],34,8,58,306514,[.12,.44],3.8);return e.add(s),{dwarfWillow:o.count,forb:a.count,grassAndSedge:r.count+i.count,rockAndHummock:s.count}}function jt(e){let t=new b(Ct(-142,2.4,10,-7),new _({color:`#706f57`,flatShading:!0,roughness:1}));t.name=`glacier-far-unglaciated-valley-terrace`,t.receiveShadow=!0,e.add(t);let r=new b(new U(500,22),new n({color:`#a8aea4`,depthWrite:!1,opacity:.09,transparent:!0}));r.name=`glacier-far-valley-haze`,r.position.set(0,5,-133),r.renderOrder=-2,e.add(r)}function Mt(e){let t=new n({color:`#c2c4b8`,depthWrite:!1,opacity:.045,transparent:!0});for(let[n,r]of[-88,-178,-276].entries()){let i=new b(new U(470,30+n*9),t.clone());i.name=`glacier-atmosphere-veil-${n+1}`,i.position.set(0,9+n*5,r),i.renderOrder=-3+n,e.add(i)}}function Nt(e){let t=new c(`#dbe5e7`,`#665c49`,1.7);t.name=`glacier-world-hemisphere-light`;let n=new F(`#fff1ce`,3.8);n.name=`glacier-world-sun`,n.position.set(-46,62,34),n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.camera.left=-32,n.shadow.camera.right=32,n.shadow.camera.top=25,n.shadow.camera.bottom=-25,n.shadow.camera.near=1,n.shadow.camera.far=150,n.shadow.bias=-12e-5,n.shadow.normalBias=.022,e.add(t,n,n.target)}function Pt(e){return e.index?Math.floor(e.index.count/3):Math.floor(e.getAttribute(`position`).count/3)}function Ft(e){return e instanceof b}function It(e){let t=new Set,n=new Set,r=0,i=0,a=0;e.traverseVisible(e=>{if(!Ft(e))return;r+=1,t.add(e.geometry);let o=Array.isArray(e.material)?e.material:[e.material];for(let e of o)n.add(e),e.transparent&&(i+=1);let s=e instanceof E?e.count:1;a+=Pt(e.geometry)*s});let o=0;for(let e of t){for(let t of Object.values(e.attributes))o+=t.array.byteLength;e.index&&(o+=e.index.array.byteLength)}return{drawCalls:r,geometryBytes:o,materials:n.size,textures:0,transparentDrawCalls:i,triangles:a}}function Lt(e){let t=new Set,n=new Set;e.traverse(e=>{Ft(e)&&(t.add(e.geometry),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>n.add(e)))}),t.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),e.clear()}function Rt(t=`C`,n=`balanced`){let r=new x;r.name=`scale-encounter-glacier-palaeoenvironment-candidate`;let i=new x;i.name=`background-atmosphere`;let a=new x;a.name=`ground-surface`;let o=new x;o.name=`snow-layer`;let s=new x;s.name=`near-ground`;let c=new x;c.name=`mid-steppe`;let l=new x;l.name=`far-landform`;let u=new x;u.name=`far-ice-mass`;let d=new x;d.name=`palaeoenvironment-atmosphere`,i.add(xt()),wt(i,u),Nt(i),a.add(Et());let f=Ot();o.add(f.mesh);let p=At(s,c);jt(l),Mt(d),r.add(i,u,a,o,s,c,l,d);let m=t,h=n,g=new e(`#aeb4ad`,.00235),_=()=>{let e=m!==`A`,t=m===`C`;a.visible=e,o.visible=e,s.visible=t,c.visible=t,l.visible=t,d.visible=t},v=()=>{f.mesh.count=Math.min(f.maximumCount,_t[h].patchCount),f.mesh.instanceMatrix.needsUpdate=!0};return v(),_(),{root:r,layers:{atmosphere:d,background:i,farIceMass:u,farLandform:l,groundSurface:a,midSteppe:c,nearGround:s,snowLayer:o},scientificAnchor:ft,diagnostics:()=>({anchorId:ft.id,crevasseCount:0,farIceVolume:{maximum:ht.toArray(),minimum:mt.toArray(),minimumCorridorSeparationMeters:Math.max(0,gt.min.z-ht.z),role:ft.iceRole.role},groundSurface:{kind:`unglaciated-loess-and-permafrost-topsoil`,supportsSubjects:!0,worldRadiusMeters:pt},iceTowerCount:0,layerCounts:{...p,snowPatches:f.mesh.count},resourceEstimate:It(r),snowLayer:{approximateCoverFraction:_t[h].coverFraction,supportsSubjects:!1,thicknessStatement:ft.seasonClimate.snowDepthStatement},surfaceState:h,variant:m}),dispose:()=>Lt(r),fog:()=>m===`C`?g:null,setSurfaceState:e=>{h=e,v()},setVariant:e=>{m=e,_()},update:e=>{Number.isFinite(e)&&d.children.forEach((t,n)=>{t instanceof b&&(t.position.x=Math.sin(e*.025+n*2.1)*1.4)})}}}var zt=``+new URL(`alpine-dem-terrarium-z12-2139-1449-BmZJwuZn.png`,import.meta.url).href,Bt=``+new URL(`mammoth-eastern-alps-mis3-panorama-v2-BpZRgkBo.webp`,import.meta.url).href,Vt=``+new URL(`mammoth-tundra-ground-albedo-v2-C2C4SSP0.webp`,import.meta.url).href,Ht=``+new URL(`mammoth-tundra-sedge-clump-v2-BglyfjRr.webp`,import.meta.url).href,Ut=zt,Wt=Bt,Gt=Vt,Kt=Ht,qt=`mammoth-palaeoenvironment-eastern-alps-production-candidate-v3`,Jt=180,Yt=new L(-54,17,-208),Xt=new L(36,36,-188),Zt=new z(new L(-14,-.2,-4.2),new L(7.5,4.8,4.2)),Qt={"wind-scoured":{coverFraction:.22,crustCount:34,frostBlend:.24,patchCount:50},balanced:{coverFraction:.4,crustCount:66,frostBlend:.48,patchCount:100},"late-snow":{coverFraction:.49,crustCount:88,frostBlend:.62,patchCount:132}},$t=new L(-.48,.72,.5).normalize();function G(e,t,n){let r=t-e,i=Math.min(1,Math.max(0,r===0?0:(n-e)/r));return i*i*(3-2*i)}function en(e){let t=e>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}function tn(e,t){let n=-11+16*Math.min(1,Math.max(0,(e- -11)/16));return Math.hypot(e-n,t)}function nn(e,t){return Math.sin(Math.PI*2*(e*3+t*2)+.7)*.24+Math.sin(Math.PI*2*(e*7-t*5)+2.1)*.18+Math.cos(Math.PI*2*(e*13+t*11)-.4)*.12+Math.sin(Math.PI*2*(e*29-t*17)+1.6)*.07}function rn(e){let t=new Uint8Array(256*256*4),n=new P(`#877b61`),r=new P(`#a49370`),i=new P(`#9f986a`),o=new P,s=en(e===`albedo`?5367678:5367679);for(let a=0;a<256;a+=1)for(let c=0;c<256;c+=1){let l=(a*256+c)*4,u=nn(c/256,a/256),d=s()-.5;if(e===`roughness`){let e=Math.round(Math.min(252,Math.max(205,236+u*18+d*13)));t[l]=e,t[l+1]=e,t[l+2]=e}else{let e=G(-.34,.42,u+d*.1),a=G(.18,.48,u-d*.08);o.copy(n).lerp(r,e).lerp(i,a*.38),o.offsetHSL(0,d*.018,d*.045),t[l]=Math.round(o.r*255),t[l+1]=Math.round(o.g*255),t[l+2]=Math.round(o.b*255)}t[l+3]=255}let c=new a(t,256,256,y);return c.name=`mammoth-steppe-${e}-procedural-v1`,c.wrapS=d,c.wrapT=d,c.repeat.set(22,22),c.magFilter=j,c.minFilter=I,c.generateMipmaps=!0,c.anisotropy=4,e===`albedo`&&(c.colorSpace=u),c.needsUpdate=!0,c}function an(){let e={value:0},t={value:0},n={value:new N};n.value.name=`mammoth-analytic-sky-placeholder`;let r=null,i=()=>{r||(r=new ue().load(Wt,()=>{e.value=1}),r.name=`mammoth-eastern-alps-mis3-panorama-v2`,r.colorSpace=u,r.wrapS=d,r.anisotropy=8,r.generateMipmaps=!1,r.magFilter=j,r.minFilter=j,n.value.dispose(),n.value=r)},a=new l({side:1,depthWrite:!1,fog:!1,toneMapped:!1,uniforms:{horizonColour:{value:new P(`#adc3cf`)},lowerColour:{value:new P(`#879c9f`)},sunColour:{value:new P(`#ffe6b5`)},sunDirection:{value:$t.clone()},zenithColour:{value:new P(`#5d86a4`)},panoramaMap:n,panoramaMix:t,panoramaReady:e},vertexShader:`
      varying vec2 vPanoramaUv;
      varying float vViewportAspect;
      varying vec3 vWorldDirection;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vPanoramaUv = uv;
        vViewportAspect = projectionMatrix[1][1] / projectionMatrix[0][0];
        vWorldDirection = normalize(world.xyz - cameraPosition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 horizonColour;
      uniform vec3 lowerColour;
      uniform vec3 sunColour;
      uniform vec3 sunDirection;
      uniform vec3 zenithColour;
      uniform sampler2D panoramaMap;
      uniform float panoramaMix;
      uniform float panoramaReady;
      varying vec2 vPanoramaUv;
      varying float vViewportAspect;
      varying vec3 vWorldDirection;

      float softWave(vec3 direction) {
        float first = sin(direction.x * 21.0 + direction.z * 16.0 + direction.y * 8.0);
        float second = sin(direction.x * 37.0 - direction.z * 23.0 + 1.7);
        float third = cos(direction.x * 63.0 + direction.z * 39.0 - 0.8);
        return first * 0.48 + second * 0.34 + third * 0.18;
      }

      void main() {
        vec3 direction = normalize(vWorldDirection);
        float height = direction.y * 0.5 + 0.5;
        vec3 sky = mix(lowerColour, horizonColour, smoothstep(0.17, 0.49, height));
        sky = mix(sky, zenithColour, smoothstep(0.49, 0.93, height));

        float sunFacing = max(dot(direction, sunDirection), 0.0);
        float sun = pow(sunFacing, 620.0);
        float glow = pow(sunFacing, 10.0) * 0.13;
        sky += sunColour * (sun * 1.35 + glow);

        float cloudAltitude = smoothstep(0.50, 0.62, height) *
          (1.0 - smoothstep(0.73, 0.89, height));
        float streak = softWave(direction);
        float cloud = smoothstep(0.36, 0.79, streak) * cloudAltitude;
        sky = mix(sky, vec3(0.91, 0.91, 0.86), cloud * 0.16);

        float horizonHaze = 1.0 - smoothstep(0.45, 0.56, height);
        sky = mix(sky, horizonColour, horizonHaze * 0.24);
        if (panoramaReady > 0.5 && panoramaMix > 0.001) {
          // The source plate covers the whole 180-degree vertical span. The
          // encounter camera only uses a narrow band around the horizon, so a
          // restrained remap keeps the high Alpine ridge visually remote
          // instead of magnifying it into a nearby wall.
          float portraitAmount = 1.0 - smoothstep(0.72, 1.02, vViewportAspect);
          float panoramaVerticalScale = mix(2.38, 4.25, portraitAmount);
          float remappedV = clamp(
            0.5 + (vPanoramaUv.y - 0.5) * panoramaVerticalScale,
            0.001,
            0.999
          );
          vec2 panoramaUv = vec2(vPanoramaUv.x, remappedV);
          vec3 panoramaBase = texture2D(panoramaMap, panoramaUv).rgb;
          // Keep the plate's authored atmospheric perspective. A small
          // source-space unsharp mask restores only the detail lost during
          // the dome projection; a stronger kernel turns snow seams into dark
          // graphic outlines and makes the distant ridge look pasted on.
          vec2 panoramaTexel = vec2(1.5 / 4096.0, 1.5 / 2048.0);
          vec3 panoramaBlur = 0.25 * (
            texture2D(panoramaMap, panoramaUv + vec2(panoramaTexel.x, 0.0)).rgb +
            texture2D(panoramaMap, panoramaUv - vec2(panoramaTexel.x, 0.0)).rgb +
            texture2D(panoramaMap, panoramaUv + vec2(0.0, panoramaTexel.y)).rgb +
            texture2D(panoramaMap, panoramaUv - vec2(0.0, panoramaTexel.y)).rgb
          );
          float ridgeDetailBand = smoothstep(0.24, 0.38, remappedV) *
            (1.0 - smoothstep(0.72, 0.87, remappedV));
          float localEdge = clamp(length(panoramaBase - panoramaBlur) * 4.6, 0.0, 1.0);
          float sharpeningStrength = mix(0.08, 1.08, ridgeDetailBand) *
            mix(0.54, 0.9, localEdge);
          vec3 panorama = clamp(
            panoramaBase + (panoramaBase - panoramaBlur) * sharpeningStrength,
            0.0,
            1.0
          );
          panorama = clamp((panorama - 0.5) * 1.016 + 0.5, 0.0, 1.0);
          // The generated plate is very nearly wrapped, but a narrow
          // shader-side crossfade prevents its longitude boundary from
          // flashing during orbit without softening the central mountains.
          float seamDistance = min(panoramaUv.x, 1.0 - panoramaUv.x);
          float seamBlend = 1.0 - smoothstep(0.0, 0.018, seamDistance);
          vec3 seamSample = 0.5 * (
            texture2D(panoramaMap, panoramaUv + vec2(-0.012, 0.0)).rgb +
            texture2D(panoramaMap, panoramaUv + vec2(0.012, 0.0)).rgb
          );
          vec3 photographicSky = mix(panorama, seamSample, seamBlend) * 0.96;
          sky = mix(sky, photographicSky, panoramaMix);
        }
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }
    `}),o=new b(new D(195,64,32),a);return o.name=`glacier-background-atmosphere-sky`,o.renderOrder=-100,{mesh:o,setPhotographicBackground:e=>{t.value=+!!e,o.userData.mammothBackgroundMode=e?`photographic-panorama`:`analytic-sky`,e&&i()}}}function on(e,t){let n=Math.exp(-(((t+192)/33)**2)),r=Math.exp(-(((e+92)/27)**2))*20,i=Math.exp(-(((e+54)/17)**2))*16,a=Math.exp(-(((e+12)/23)**2))*31,o=Math.exp(-(((e-27)/18)**2))*19,s=Math.exp(-(((e-72)/25)**2))*25,c=Math.exp(-(((e-111)/18)**2))*18,l=Math.exp(-(((e-172)/48)**2))*11,u=Math.exp(-(((e+142)/13)**2))*10,d=Math.exp(-(((e+72)/10)**2))*9,f=Math.exp(-(((e-2)/9)**2))*12,p=Math.exp(-(((e-93)/11)**2))*10,m=Math.exp(-(((e-145)/13)**2))*8,h=Math.sin(e*.071+t*.037)*3.5+Math.sin(e*.153-t*.082+1.4)*2.25+Math.cos(e*.043+t*.121)*1.7+Math.sin(e*.287-t*.173)*1.05,g=Math.sin(e*.109+t*.224)*2.6+Math.cos(e*.218-t*.137)*1.45+Math.sin(e*.397+t*.091)*.68,_=G(-132,-174,t)*2.8;return Math.max(-2,-1+_+n*(4+r+i+a+o+s+c+l+u+d+f+p+m+h+g))}function sn(){let e=-248,t=-210,n=[],r=[],i=[],a=new P,o=new P(`#344a57`),s=new P(`#657985`),c=new P(`#8fa0a5`),l=new P(`#9fb9c7`),u=new P(`#e3ebe9`),d=new L;for(let i=0;i<=32;i+=1){let f=i/32,p=t+(-122-t)*f;for(let t=0;t<=192;t+=1){let i=t/192,f=e+(248-e)*i,m=on(f,p),h=(on(f+2,p)-on(f-2,p))/4,g=(on(f,p+2)-on(f,p-2))/4;d.set(-h,1,-g).normalize();let _=G(-.35,.72,d.dot($t)),v=Math.sin(f*.037+p*.029)*.5+Math.cos(f*.019-p*.043)*.5,y=G(.24,.78,d.y),b=G(13,31,m),x=G(-.45,.58,Math.sin(f*.085+p*.041)*.62+Math.cos(f*.037-p*.068)*.38),S=Math.min(.78,b*(.3+y*.32+x*.16)),C=Math.sin(m*.72+f*.095+p*.028)*.55+Math.cos(m*.31-f*.047+p*.066)*.45,w=G(.32,.94,Math.abs(Math.sin(f*.116+p*.041)*.72+Math.sin(f*.043-p*.089)*.28));a.copy(o).lerp(s,.1+_*.7).lerp(c,G(30,54,m)*.34).offsetHSL(0,0,C*.055+v*.035-w*.045).lerp(l,S*(.32-_*.08)).lerp(u,S*(.24+_*.34)),n.push(f,m,p),r.push(a.r,a.g,a.b)}}for(let e=0;e<32;e+=1)for(let t=0;t<192;t+=1){let n=e*193+t;i.push(n,n+193,n+1,n+1,n+193,n+193+1)}let f=new M;return f.setAttribute(`position`,new B(new Float32Array(n),3)),f.setAttribute(`color`,new B(new Float32Array(r),3)),f.setIndex(i),f.computeVertexNormals(),f}function cn(e,t,n){let r=-7+(t+198)*.72,i=-43-(t+198)*.38,a=1-G(8,17,Math.abs(e-r)),o=1-G(6,13,Math.abs(e-i)),s=G(17,25,n),c=G(-187,-195,t);return Math.max(a,o*.74)*s*c}function ln(){let e=Yt.x,t=Xt.x,n=Yt.z,r=Xt.z,i=[],a=[],o=[],s=new P(`#8ea7aa`),c=new P(`#d8e2df`),l=new P;for(let o=0;o<=16;o+=1){let u=o/16,d=n+(r-n)*u;for(let n=0;n<=52;n+=1){let r=n/52,o=e+(t-e)*r,u=on(o,d)+.48,f=cn(o,d,u);l.copy(s).lerp(c,Math.min(1,.42+f*.58)),i.push(o,u,d),a.push(l.r,l.g,l.b)}}for(let i=0;i<16;i+=1)for(let a=0;a<52;a+=1){let s=i*53+a,c=e+(t-e)*((a+.5)/52),l=n+(r-n)*((i+.5)/16);cn(c,l,on(c,l))<.42||o.push(s,s+53,s+1,s+1,s+53,s+53+1)}let u=new M;return u.setAttribute(`position`,new B(new Float32Array(i),3)),u.setAttribute(`color`,new B(new Float32Array(a),3)),u.setIndex(o),u.computeVertexNormals(),u}function un(e,t,n,r){let i=new l({depthWrite:!1,fog:!0,transparent:!0,uniforms:re.merge([he.fog,{colour:{value:new P(`#b7bbae`)},opacity:{value:r}}]),vertexShader:`
      varying vec2 vUv;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      uniform vec3 colour;
      uniform float opacity;
      varying vec2 vUv;
      #include <fog_pars_fragment>
      void main() {
        float vertical = smoothstep(0.0, 0.28, vUv.y) *
          (1.0 - smoothstep(0.72, 1.0, vUv.y));
        float horizontal = smoothstep(0.0, 0.1, vUv.x) *
          (1.0 - smoothstep(0.9, 1.0, vUv.x));
        gl_FragColor = vec4(colour, opacity * vertical * horizontal);
        #include <fog_fragment>
      }
    `}),a=new b(new U(t,n),i);return a.name=e,a}var dn={B:{rear:{detailStrength:.48,openRock:`#80939d`,shadowRock:`#506775`,snowAmount:1.08,snowEnd:29,snowLight:`#edf4f4`,snowShadow:`#adbfca`,snowStart:11},centre:{detailStrength:1,openRock:`#647985`,shadowRock:`#273f4e`,snowAmount:.88,snowEnd:36,snowLight:`#e8f0f0`,snowShadow:`#97b3c2`,snowStart:17.5},front:{detailStrength:.82,openRock:`#596a68`,shadowRock:`#2f4548`,snowAmount:.36,snowEnd:34,snowLight:`#dbe5e3`,snowShadow:`#91a9ac`,snowStart:21}},C:{rear:{detailStrength:.3,openRock:`#c0d0d8`,shadowRock:`#86a4b7`,snowAmount:1.72,snowEnd:18,snowLight:`#f8fbfa`,snowShadow:`#c7dce8`,snowStart:1.5},centre:{detailStrength:.72,openRock:`#9fb5c1`,shadowRock:`#55788e`,snowAmount:1.55,snowEnd:24,snowLight:`#f7faf8`,snowShadow:`#b6d1e2`,snowStart:5},front:{detailStrength:.7,openRock:`#81989f`,shadowRock:`#466570`,snowAmount:.98,snowEnd:14,snowLight:`#f0f7f5`,snowShadow:`#abc8d3`,snowStart:2}}};function fn(e,t){e.uniforms.detailStrength.value=t.detailStrength,e.uniforms.openRock.value.set(t.openRock),e.uniforms.shadowRock.value.set(t.shadowRock),e.uniforms.snowAmount.value=t.snowAmount,e.uniforms.snowEnd.value=t.snowEnd,e.uniforms.snowLightColour.value.set(t.snowLight),e.uniforms.snowShadow.value.set(t.snowShadow),e.uniforms.snowStart.value=t.snowStart}function pn(e){return new l({fog:!0,toneMapped:!1,uniforms:re.merge([he.fog,{detailStrength:{value:e.detailStrength},openRock:{value:new P(e.openRock)},shadowRock:{value:new P(e.shadowRock)},snowAmount:{value:e.snowAmount},snowEnd:{value:e.snowEnd},snowLightColour:{value:new P(e.snowLight)},snowShadow:{value:new P(e.snowShadow)},snowStart:{value:e.snowStart},sunDirection:{value:$t.clone()}}]),vertexShader:`
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      #include <fog_pars_vertex>
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec4 mvPosition = viewMatrix * worldPosition;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      uniform float detailStrength;
      uniform vec3 openRock;
      uniform vec3 shadowRock;
      uniform float snowAmount;
      uniform float snowEnd;
      uniform vec3 snowLightColour;
      uniform vec3 snowShadow;
      uniform float snowStart;
      uniform vec3 sunDirection;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      #include <fog_pars_fragment>

      void main() {
        vec3 geometricNormal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
        if (!gl_FrontFacing) geometricNormal = -geometricNormal;
        vec3 normal = normalize(mix(vWorldNormal, geometricNormal, 0.46));
        float sunLight = smoothstep(-0.32, 0.72, dot(normal, sunDirection));

        // All detail is evaluated in world space, so it stays crisp when the
        // camera moves and costs no photographic panorama upload. The broad
        // channels read as eroded gullies; the finer bands prevent the ridge
        // from looking like a softly blurred cardboard silhouette.
        float broadChannel = 0.5 + 0.5 * sin(
          vWorldPosition.x * 0.118 +
          vWorldPosition.z * 0.071 +
          sin(vWorldPosition.x * 0.031) * 2.1
        );
        float ravine = smoothstep(0.66, 0.96, broadChannel);
        float strata = 0.5 + 0.5 * sin(
          vWorldPosition.y * 1.36 +
          vWorldPosition.x * 0.22 -
          vWorldPosition.z * 0.09
        );
        float fineRock = 0.5 + 0.5 * sin(
          vWorldPosition.x * 0.58 +
          vWorldPosition.z * 0.37 +
          sin(vWorldPosition.y * 0.91) * 1.7
        );

        vec3 colour = mix(shadowRock, openRock, 0.16 + sunLight * 0.84);
        colour *= mix(1.0 - detailStrength * 0.12, 1.0 + detailStrength * 0.09, strata);
        colour *= mix(1.0 - detailStrength * 0.16, 1.0 + detailStrength * 0.1, fineRock);
        colour = mix(
          colour,
          colour * vec3(0.38, 0.54, 0.64),
          ravine * detailStrength * 0.72
        );

        float snowPattern = smoothstep(
          -0.16,
          0.58,
          sin(vWorldPosition.x * 0.093 + vWorldPosition.z * 0.061) * 0.64 +
          cos(vWorldPosition.x * 0.041 - vWorldPosition.z * 0.119) * 0.36
        );
        float snowHint = smoothstep(snowStart, snowEnd, vWorldPosition.y) *
          mix(0.28, 0.9, smoothstep(0.28, 0.88, normal.y)) *
          mix(0.46, 1.0, snowPattern) *
          (1.0 - ravine * 0.58) * snowAmount;
        vec3 snowLight = mix(snowShadow, snowLightColour, sunLight);
        colour = mix(colour, snowLight, clamp(snowHint, 0.0, 0.9));

        gl_FragColor = vec4(colour, 1.0);
        #include <fog_fragment>
        #include <colorspace_fragment>
      }
    `})}function mn(e,t){let r=sn(),i=new b(r,pn(dn.B.rear));i.name=`glacier-rear-snow-peak-range`,i.position.set(-65,2,-72),i.scale.set(1.18,.72,1.08),i.castShadow=!1,i.receiveShadow=!1,i.visible=!1,e.add(i);let a=new b(r,pn(dn.B.centre));a.name=`glacier-far-rock-ridge`,a.castShadow=!1,a.receiveShadow=!1,a.visible=!1,e.add(a);let o=new b(r,pn(dn.B.front));o.name=`glacier-front-moraine-ridge`,o.position.set(44,-10,45),o.scale.set(1.08,.42,.9),o.castShadow=!1,o.receiveShadow=!1,o.visible=!1,e.add(o);let s=new b(ln(),new n({color:`#ffffff`,fog:!0,vertexColors:!0}));s.name=`glacier-far-ice-mass-direction-reference`,s.castShadow=!1,s.receiveShadow=!0,s.visible=!1,t.add(s);let c=un(`glacier-background-horizon-haze`,520,24,0);return c.position.set(0,7,-72),c.renderOrder=-4,c.visible=!1,e.add(c),{frontMountainRange:o,horizonHaze:c,ice:s,mountainRange:a,rearMountainRange:i}}function hn(){let e=new U(Jt*2,Jt*2,144,144),t=e.getAttribute(`position`),n=[],r=new P,i=new P(`#f2f0eb`),a=new P(`#e7e7dd`),o=new P(`#faf8f3`);for(let e=0;e<t.count;e+=1){let s=t.getX(e),c=-t.getY(e);t.setZ(e,W(s,c));let l=Math.sin(s*.047)*.36+Math.cos(c*.038)*.28+Math.sin((s-c)*.017)*.2+Math.cos((s+c)*.071)*.1;r.copy(i).lerp(o,G(-.48,.3,l)).lerp(a,G(.12,.56,l)*.56),n.push(r.r,r.g,r.b)}return t.needsUpdate=!0,e.setAttribute(`color`,new B(new Float32Array(n),3)),e.computeVertexNormals(),e}function gn(){let e={value:0},t=new ue().load(Gt,()=>{e.value=1});t.name=`mammoth-tundra-ground-albedo-v2`,t.colorSpace=u,t.wrapS=ae,t.wrapT=ae,t.center.set(.5,.5),t.rotation=.31,t.repeat.set(24,24),t.magFilter=j,t.minFilter=I,t.generateMipmaps=!0,t.anisotropy=8;let n=rn(`roughness`),r={value:Qt.balanced.frostBlend},i=new _({alphaTest:.015,bumpMap:t,bumpScale:.035,color:`#ffffff`,map:t,metalness:0,roughness:.94,roughnessMap:n,transparent:!0});i.name=`mammoth-steppe-ground-frost-distance-blend-v3`,i.userData.mammothGroundAlbedoReady=e,i.userData.mammothFrostBlend=r,i.onBeforeCompile=t=>{t.uniforms.mammothGroundAlbedoReady=e,t.uniforms.mammothFrostBlend=r,t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying float vMammothGroundDistance;
varying vec2 vMammothGroundWorldXZ;`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
        vec3 mammothGroundWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vMammothGroundWorldXZ = mammothGroundWorld.xz;
        vMammothGroundDistance = length(mammothGroundWorld.xz);`),t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float mammothGroundAlbedoReady;
uniform float mammothFrostBlend;
varying float vMammothGroundDistance;
varying vec2 vMammothGroundWorldXZ;`).replace(`#include <map_fragment>`,`#include <map_fragment>
        // A pending (or failed) image is a black GPU sampler. Supply lit soil
        // colour before lighting, so the first overview always has ground.
        if (mammothGroundAlbedoReady < 0.5) diffuseColor.rgb = vec3(0.42, 0.36, 0.26);`).replace(`#include <opaque_fragment>`,`float mammothFrostBroad =
          sin(vMammothGroundWorldXZ.x * 0.085 + vMammothGroundWorldXZ.y * 0.041) * 0.52 +
          cos(vMammothGroundWorldXZ.x * 0.033 - vMammothGroundWorldXZ.y * 0.092) * 0.38 +
          sin((vMammothGroundWorldXZ.x + vMammothGroundWorldXZ.y) * 0.17) * 0.22;
        float mammothFrostFine =
          sin(vMammothGroundWorldXZ.x * 0.57 - vMammothGroundWorldXZ.y * 0.43) * 0.09 +
          cos(vMammothGroundWorldXZ.x * 0.31 + vMammothGroundWorldXZ.y * 0.49) * 0.07;
        float mammothFrostMask = smoothstep(
          0.05,
          0.72,
          mammothFrostBroad + mammothFrostFine
        );
        diffuseColor.rgb = mix(
          diffuseColor.rgb,
          vec3(0.88, 0.92, 0.93),
          mammothFrostMask * mammothFrostBlend
        );
        diffuseColor.a *= 1.0 - smoothstep(132.0, 176.0, vMammothGroundDistance);
        if (diffuseColor.a < 0.015) discard;
        #include <opaque_fragment>`)},i.customProgramCacheKey=()=>`mammoth-steppe-ground-frost-distance-blend-v3`;let a=new b(hn(),i);return i.vertexColors=!0,a.name=`glacier-ground-surface-unglaciated-land`,a.rotation.x=-Math.PI/2,a.receiveShadow=!0,a}function _n(){let e=new Uint8Array(16384*4);for(let t=0;t<128;t+=1)for(let n=0;n<128;n+=1){let r=(t*128+n)*4,i=(n+.5)/128*2-1,a=(t+.5)/128*2-1,o=Math.hypot(i,a),s=Math.sin(i*8.7+a*5.1)*.09+Math.sin(i*19.3-a*13.7+1.2)*.05,c=1-G(.48+s,.96+s,o),l=Math.sin(i*17.1+a*9.3+.4)*.38+Math.cos(i*31.7-a*23.9)*.24+Math.sin(i*53.1+a*47.3+2.1)*.14,u=G(-.34,.24,l+c*.22),d=.86+Math.sin(i*31+a*23)*.035+Math.cos(i*17-a*29)*.025,f=G(-.42,.36,l),p=G(.72,.97,Math.sin(i*71.3+a*43.7)*Math.cos(i*37.1-a*59.9)),m=.91+c*.035+u*.025-p*.12;e[r]=Math.round(228*d*m),e[r+1]=Math.round(236*d*m),e[r+2]=Math.round(239*d*m);let h=G(.025,.78,c)*(.82+f*.18);e[r+3]=Math.round(h*255)}let t=new a(e,128,128,y);return t.name=`mammoth-thin-crusted-snow-patch-v2`,t.colorSpace=u,t.magFilter=j,t.minFilter=I,t.generateMipmaps=!0,t.needsUpdate=!0,t}function vn(){let e=[0,.022,0],t=[.5,.5],n=[];for(let n=0;n<28;n+=1){let r=n/28*Math.PI*2,i=.5*(.86+Math.sin(r*3+.6)*.1+Math.sin(r*7-1.1)*.055+Math.cos(r*11+.2)*.028),a=Math.cos(r)*i,o=Math.sin(r)*i;e.push(a,Math.sin(r*5+.4)*.003,o),t.push(.5+a*1.16,.5+o*1.16)}for(let e=0;e<28;e+=1)n.push(0,e+1,(e+1)%28+1);let r=new M;return r.setAttribute(`position`,new B(new Float32Array(e),3)),r.setAttribute(`uv`,new B(new Float32Array(t),2)),r.setIndex(n),r.computeVertexNormals(),r}function yn(){let e=Qt[`late-snow`].patchCount,t=vn(),n=_n(),r=new E(t,new _({alphaTest:.08,bumpMap:n,bumpScale:.018,color:`#f5f8f6`,depthWrite:!0,emissive:`#304044`,emissiveIntensity:.035,map:n,metalness:0,opacity:.94,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,roughness:.92,side:2,transparent:!0}),e);r.name=`glacier-snow-layer-near-wind-drifts`,r.receiveShadow=!0,r.frustumCulled=!1,r.userData.persistentAcrossCameraStages=!0;let i=en(5351892),a=new V,o=new T,s=new L(0,1,0),c=[[-10,18,5.4,2.1,.12],[6,19,5.8,2.4,-.22],[20,22,6.2,2.2,.4],[-25,25,6.5,2.6,-.36],[0,30,7.4,2.8,.18],[30,34,7,2.6,-.5],[-34,36,7.6,3,.42],[12,42,8.2,3.2,-.12],[-18,47,7.8,3.1,.54],[38,49,8.4,3.4,-.38],[-42,54,8.6,3.6,.27],[4,57,9,3.8,-.6],[-58,20,6.8,2.7,-.18],[54,23,7.2,2.8,.34],[-55,31,7.6,3.1,.48],[57,35,8.1,3.2,-.42],[-49,43,8.4,3.5,-.28],[51,47,8.8,3.6,.52],[-62,56,9.4,3.9,.2],[60,60,9.8,4.1,-.36],[-38,66,10.2,4.3,.42],[35,70,10.6,4.4,-.5],[-12,76,11.2,4.8,.18],[16,82,11.6,5,-.34],[-52,-10,6.8,2.6,.28],[48,-12,7.2,2.8,-.4],[-39,-22,7.6,3,-.32],[43,-26,8,3.2,.46],[-60,-34,8.5,3.4,.18],[58,-38,8.8,3.6,-.52],[-31,-45,9.2,3.8,.36],[34,-49,9.6,4,-.24],[-6.5,5.8,2.2,.92,-.12],[4.8,5.2,2.4,1.02,.38],[-13,-4.8,2.1,.88,.72],[9.5,-5.8,2.6,1.05,-.36],[-4.6,8.1,1.55,.58,.24],[-8.8,6.9,1.35,.5,-.48],[2.6,7.4,1.6,.6,-.18],[7.4,6.4,1.5,.54,.58],[-15.6,-2.8,1.7,.62,-.7],[-10.8,-7.2,1.45,.52,.46],[12.4,-3.8,1.65,.58,.14],[15.2,-7.6,1.55,.54,-.56],[-1.4,12.4,1.8,.64,.84],[7.2,11.2,1.7,.6,-.32],[-20.5,9.4,1.9,.68,.38],[20.8,10.2,1.85,.66,-.76],[-9,8,2.5,1.18,.28],[2,9.5,1.9,.88,-.48],[10,7,2.2,1,.82],[-17,12,2.6,1.18,-.16],[18,-7,2.4,1.08,.46],[-22,-10,2.8,1.24,-.72],[28,13,2.7,1.12,.18],[-32,5.5,2.3,1,.92],[6,-11,2,.9,-.2],[-8,-13,2.1,.92,.62],[35,-18,2.9,1.28,-.38],[-40,20,3,1.32,.34],[15,16,2.4,1.04,-.84],[-26,17,2.7,1.16,.54],[31,-4,2.2,.94,.08],[-35,-3,2.4,1.02,-.58],[-3,15.5,2.5,1.08,.42],[13,14.5,2.2,.96,-.26],[-20,19,2.8,1.18,.76],[24,-14,2.6,1.1,-.62],[-29,-17,2.9,1.2,.24],[39,8,3,1.22,-.88],[-43,10,3.1,1.25,.52],[8,-20,2.4,1.02,-.08],[-12,24,3.5,1.32,.22],[-3,27,3.1,1.12,-.48],[6,25,3.4,1.26,.68],[14,28,3,1.08,-.18],[-15,33,3.3,1.2,-.62],[-6,35,2.9,1.02,.36],[3,32,3.2,1.16,-.78],[12,36,2.8,.98,.54],[-13,41,2.9,1.04,.16],[-4,39,2.6,.92,-.38],[5,42,2.8,1,.72],[14,40,2.5,.88,-.56],[-10,47,2.5,.9,.42],[-1,45,2.3,.82,-.74],[8,48,2.4,.86,.18],[16,46,2.2,.78,-.28]],l=0;for(let[e,t,n,i,u]of c)o.setFromAxisAngle(s,u),a.compose(new L(e,W(e,t)+.058,t),o,new L(n*1.28,1,i*1.28)),r.setMatrixAt(l,a),l+=1;let u=0;for(;l<e&&u<2e3;){u+=1;let e=i()*Math.PI*2,t=13+i()**.78*72,n=Math.cos(e)*t*(.86+i()*.3),c=Math.sin(e)*t;if(tn(n,c)<3.1)continue;let d=.8+i()*1.65;o.setFromAxisAngle(s,i()*Math.PI*2),a.compose(new L(n,W(n,c)+.052,c),o,new L(d*(1.04+i()*.72),1,d*(.38+i()*.3))),r.setMatrixAt(l,a),l+=1}return r.count=e,r.instanceMatrix.needsUpdate=!0,r}function bn(){let e=Qt[`late-snow`].crustCount,t=_n(),n=new E(vn(),new _({alphaTest:.1,bumpMap:t,bumpScale:.012,color:`#d8e6e7`,depthWrite:!1,emissive:`#29434a`,emissiveIntensity:.1,map:t,metalness:.07,opacity:.8,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,roughness:.28,side:2,transparent:!0}),e);n.name=`glacier-snow-layer-wind-polished-frozen-crust`,n.receiveShadow=!0,n.frustumCulled=!1,n.userData.persistentAcrossCameraStages=!0;let r=[[-10,18,3.4,1.05,.12],[6,19,3.7,1.16,-.22],[20,22,3.9,1.08,.4],[-25,25,4.1,1.22,-.36],[0,30,4.6,1.34,.18],[30,34,4.3,1.26,-.5],[-34,36,4.8,1.4,.42],[12,42,5.1,1.48,-.12],[-18,47,4.9,1.44,.54],[38,49,5.2,1.52,-.38],[-58,20,4.2,1.25,-.18],[54,23,4.4,1.32,.34],[-55,31,4.6,1.38,.48],[57,35,4.9,1.46,-.42],[-49,43,5.1,1.52,-.28],[51,47,5.3,1.58,.52],[-62,56,5.6,1.66,.2],[60,60,5.8,1.72,-.36],[-38,66,6.1,1.82,.42],[35,70,6.3,1.88,-.5],[-52,-10,4.1,1.22,.28],[48,-12,4.3,1.28,-.4],[-39,-22,4.6,1.36,-.32],[43,-26,4.8,1.42,.46],[-60,-34,5.1,1.5,.18],[58,-38,5.3,1.56,-.52],[-6.5,5.8,1.2,.38,-.12],[4.8,5.2,1.35,.42,.38],[-13,-4.8,1.15,.35,.72],[9.5,-5.8,1.45,.43,-.36],[-9,8,1.35,.44,.28],[2,9.5,1,.34,-.48],[10,7,1.2,.38,.82],[-17,12,1.4,.44,-.16],[18,-7,1.3,.42,.46],[-22,-10,1.5,.46,-.72],[28,13,1.5,.44,.18],[-32,5.5,1.3,.4,.92],[-4.6,8.1,.82,.24,.24],[-8.8,6.9,.72,.22,-.48],[2.6,7.4,.86,.25,-.18],[7.4,6.4,.8,.23,.58],[-15.6,-2.8,.9,.26,-.7],[-10.8,-7.2,.76,.22,.46],[12.4,-3.8,.88,.24,.14],[15.2,-7.6,.82,.23,-.56],[-1.4,12.4,.94,.27,.84],[7.2,11.2,.9,.25,-.32],[-20.5,9.4,1,.28,.38],[20.8,10.2,.98,.28,-.76],[-12,24,1.9,.52,.22],[-3,27,1.7,.46,-.48],[6,25,1.85,.5,.68],[14,28,1.65,.44,-.18],[-15,33,1.8,.48,-.62],[-6,35,1.6,.42,.36],[3,32,1.75,.46,-.78],[12,36,1.55,.4,.54],[-4,39,1.45,.38,-.38],[5,42,1.5,.4,.72]],i=en(9191858),a=new V,o=new T,s=new L(0,1,0),c=0;for(let[e,t,i,l,u]of r)o.setFromAxisAngle(s,u),a.compose(new L(e,W(e,t)+.066,t),o,new L(i,1,l)),n.setMatrixAt(c,a),c+=1;let l=0;for(;c<e&&l<2e3;){l+=1;let e=i()*Math.PI*2,t=14+i()**.82*68,r=Math.cos(e)*t*(.84+i()*.32),u=Math.sin(e)*t;if(tn(r,u)<3.4)continue;let d=.72+i()*1.25;o.setFromAxisAngle(s,i()*Math.PI*2),a.compose(new L(r,W(r,u)+.064,u),o,new L(d*(.75+i()*.45),1,d*(.22+i()*.2))),n.setMatrixAt(c,a),c+=1}return n.count=e,n.instanceMatrix.needsUpdate=!0,n}function xn(){return{frozenCrusts:bn(),nearDrifts:yn()}}function Sn(){let e=[],t=[],n=[];for(let r=0;r<3;r+=1){let i=r/3*Math.PI,a=Math.cos(i)*.5,o=Math.sin(i)*.5,s=e.length/3;e.push(-a,0,-o,a,0,o,a,1,o,-a,1,-o),t.push(0,0,1,0,1,1,0,1),n.push(s,s+1,s+2,s,s+2,s+3)}let r=new M;return r.setAttribute(`position`,new B(new Float32Array(e),3)),r.setAttribute(`uv`,new B(new Float32Array(t),2)),r.setIndex(n),r.computeVertexNormals(),r}function Cn(){let e=new ue().load(Kt);e.name=`mammoth-tundra-sedge-clump-v2`,e.colorSpace=u,e.anisotropy=8,e.generateMipmaps=!1,e.magFilter=j,e.minFilter=j;let t=new o({alphaTest:.46,color:`#ffffff`,map:e,side:2});return t.name=`mammoth-tundra-sedge-checker-matte-cutout-v2`,t.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`#ifdef USE_MAP
        vec4 sampledDiffuseColor = texture2D(map, vMapUv);
        #ifdef DECODE_VIDEO_TEXTURE
          sampledDiffuseColor = sRGBTransferEOTF(sampledDiffuseColor);
        #endif
        float matteLuma = dot(sampledDiffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        float matteSpread = max(
          max(sampledDiffuseColor.r, sampledDiffuseColor.g),
          sampledDiffuseColor.b
        ) - min(
          min(sampledDiffuseColor.r, sampledDiffuseColor.g),
          sampledDiffuseColor.b
        );
        float sedgeAlpha = clamp(
          (1.0 - smoothstep(0.70, 0.84, matteLuma)) * 1.18 +
          smoothstep(0.065, 0.16, matteSpread) * 0.34,
          0.0,
          1.0
        );
        diffuseColor *= sampledDiffuseColor;
        diffuseColor.a *= sedgeAlpha;
      #endif`)},t.customProgramCacheKey=()=>`mammoth-tundra-sedge-checker-matte-cutout-v2`,t}function wn(){let e=[],t=[];for(let n=0;n<5;n+=1){let r=n/5*Math.PI*2,i=.07,a=e.length/3;e.push(Math.cos(r+Math.PI/2)*i,0,Math.sin(r+Math.PI/2)*i,-Math.cos(r+Math.PI/2)*i,0,-Math.sin(r+Math.PI/2)*i,Math.cos(r)*.18,.72+n%2*.08,Math.sin(r)*.18),t.push(a,a+1,a+2)}let n=new M;return n.setAttribute(`position`,new B(new Float32Array(e),3)),n.setIndex(t),n.computeVertexNormals(),n}function Tn(){let e=new f(.5,1),t=e.getAttribute(`position`);for(let e=0;e<t.count;e+=1)t.setXYZ(e,t.getX(e)*1.15,(t.getY(e)+.5)*.52,t.getZ(e)*.92);return t.needsUpdate=!0,e.computeVertexNormals(),e}function En(){let e=new f(.5,1),t=e.getAttribute(`position`);for(let e=0;e<t.count;e+=1){let n=t.getX(e),r=t.getY(e),i=t.getZ(e),a=.86+Math.sin(n*17+r*11+i*23)*.12;t.setXYZ(e,n*a,(r+.5)*a*.62,i*a*1.08)}return t.needsUpdate=!0,e.computeVertexNormals(),e}function Dn(e){let t=e.material??new o({color:`#ffffff`,side:2}),n=new E(e.geometry,t,e.count);n.name=e.name,n.castShadow=e.castShadow,n.receiveShadow=!0;let r=en(e.seed),i=new V,a=new T,s=new L,c=new L,l=new P,u=new L(0,1,0),d=0,f=0;for(;d<e.count&&f<e.count*120;){f+=1;let t=r()*Math.PI*2,o=e.minimumDistance+r()**.82*(e.maximumDistance-e.minimumDistance),p=Math.cos(t)*o*(.82+r()*.38),m=Math.sin(t)*o;if(tn(p,m)<e.corridorClearance)continue;let h=Math.sin(p*.19+m*.11+e.seed*1e-4)*.34+Math.cos(p*.071-m*.17)*.23+.5,g=Math.min(1,Math.max(.18,1-e.clusterStrength+h*e.clusterStrength));if(r()>g)continue;let _=e.heightRange[0]+r()*(e.heightRange[1]-e.heightRange[0]),v=e.widthRange[0]+r()*(e.widthRange[1]-e.widthRange[0]);a.setFromAxisAngle(u,r()*Math.PI*2),s.set(p,W(p,m)+.008,m),c.set(v*(.86+r()*.28),_,v),i.compose(s,a,c),n.setMatrixAt(d,i),l.set(e.colours[Math.floor(r()*e.colours.length)]??`#82764b`).offsetHSL(0,(r()-.5)*.04,(r()-.5)*.05),n.setColorAt(d,l),d+=1}return n.count=d,n.instanceMatrix.needsUpdate=!0,n.instanceColor&&(n.instanceColor.needsUpdate=!0),n}function On(e,t){let n=Sn(),r=Cn(),i=Dn({castShadow:!1,clusterStrength:.66,colours:[`#a39778`,`#899274`,`#a28d69`,`#7d896c`],corridorClearance:1.9,count:210,geometry:n,heightRange:[.11,.24],material:r,maximumDistance:48,minimumDistance:3.5,name:`glacier-near-grass-and-sedge`,seed:96802,widthRange:[.3,.58]}),a=Dn({castShadow:!1,clusterStrength:.72,colours:[`#918c70`,`#7f886c`,`#958466`,`#778168`],corridorClearance:3.8,count:350,geometry:n.clone(),heightRange:[.08,.17],material:r,maximumDistance:106,minimumDistance:35,name:`glacier-mid-grass-and-sedge`,seed:96803,widthRange:[.22,.42]});e.add(i),t.add(a);let o=Dn({castShadow:!0,clusterStrength:.78,colours:[`#6d6558`,`#756c5d`,`#68675b`,`#5f6258`],corridorClearance:2.2,count:24,geometry:wn(),heightRange:[.08,.18],maximumDistance:54,minimumDistance:6,name:`glacier-near-low-forbs`,seed:166705,widthRange:[.3,.58]});e.add(o);let s=Dn({castShadow:!1,clusterStrength:.83,colours:[`#596342`,`#65704b`,`#717750`,`#4f5d43`],corridorClearance:4.6,count:42,geometry:Tn(),heightRange:[.28,.64],maximumDistance:96,minimumDistance:18,name:`glacier-mid-dwarf-willow`,seed:236609,widthRange:[.56,1.02]});t.add(s);let c=Dn({castShadow:!0,clusterStrength:.42,colours:[`#5f605c`,`#6d675d`,`#575d5c`,`#756b5c`],corridorClearance:3.2,count:46,geometry:En(),heightRange:[.12,.36],maximumDistance:68,minimumDistance:8,name:`glacier-near-rock-and-loess-hummock`,seed:306514,widthRange:[.36,.8]});e.add(c);let l=Dn({castShadow:!1,clusterStrength:.48,colours:[`#666966`,`#77736a`,`#5f6665`,`#81796b`],corridorClearance:5,count:28,geometry:En(),heightRange:[.3,.82],maximumDistance:82,minimumDistance:36,name:`glacier-midground-moraine-stone`,seed:469956,widthRange:[.75,1.65]});return t.add(l),{dwarfWillow:s.count,forb:o.count,grassAndSedge:i.count+a.count,rockAndHummock:c.count+l.count}}function kn(e,t){let n=Math.hypot(e,t),r=G(80,108,n)*(1-G(142,178,n)),i=Math.atan2(t,e),a=G(-.22,.62,Math.sin(i*3.1+.4)*.45+Math.cos(i*5.3-.7)*.34+Math.sin(i*9.7+1.1)*.21),o=Math.sin(e*.037+t*.022)*.18+Math.cos(e*.061-t*.029)*.12;return W(e,t)+.03+r*(.28+a*.72)*(1.12+o)}function An(){let e=[],t=[],n=[],r=new P(`#686c68`),i=new P(`#868b86`),a=new P(`#b7c5c4`),o=new P;for(let n=0;n<=20;n+=1){let s=76+n/20*104;for(let n=0;n<=192;n+=1){let c=n/192*Math.PI*2,l=Math.cos(c)*s,u=Math.sin(c)*s,d=kn(l,u),f=d-W(l,u),p=Math.sin(l*.094+u*.057)*.5+Math.cos(l*.041-u*.083)*.5,m=G(.72,1.22,f)*G(-.12,.58,p),h=G(.08,.62,p)*G(88,116,s)*(1-G(150,178,s));o.copy(r).lerp(i,G(.22,1.18,f)*.48).lerp(a,Math.min(.24,m*.18+h*.14)).offsetHSL(0,0,p*.018),e.push(l,d,u),t.push(o.r,o.g,o.b)}}for(let e=0;e<20;e+=1)for(let t=0;t<192;t+=1){let r=e*193+t;n.push(r,r+193,r+1,r+1,r+193,r+193+1)}let s=new M;return s.setAttribute(`position`,new B(new Float32Array(e),3)),s.setAttribute(`color`,new B(new Float32Array(t),3)),s.setIndex(n),s.computeVertexNormals(),s}function jn(e,t){let n=Math.exp(-(((t+105)/28)**2)),r=Math.exp(-(((e+118)/24)**2))*4.2,i=Math.exp(-(((e+34)/28)**2))*5.2,a=Math.exp(-(((e-54)/22)**2))*3.8,o=Math.exp(-(((e-128)/27)**2))*4.6,s=Math.sin(e*.049+t*.034)*.62+Math.cos(e*.091-t*.057)*.38,c=Math.max(r,i,a,o);return W(e,t)+n*Math.max(0,c-.95+s*.25)}function Mn(){let e=-240,t=-148,n=[],r=[],i=[],a=[],o=[],s=new P(`#82979d`),c=new P(`#afc0c4`),l=new P(`#f3f7f5`),u=new P;for(let o=0;o<=24;o+=1){let d=o/24,f=t+(-66-t)*d;for(let t=0;t<=144;t+=1){let o=t/144,p=e+(240-e)*o,m=jn(p,f),h=W(p,f),g=Math.max(0,m-h),_=G(-.7,.7,Math.sin(p*.052+f*.034)*.7+Math.cos(p*.021-f*.057)*.3),v=G(.32,.88,.5+.5*Math.sin(p*.083-f*.047+g*.8)),y=G(1.25,3.65,g)*(.38+v*.62)*.78;u.copy(s).lerp(c,.18+_*.46).lerp(l,y),n.push(p,m,f),r.push(u.r,u.g,u.b),i.push(g),a.push(o,d)}}for(let e=0;e<24;e+=1)for(let t=0;t<144;t+=1){let n=e*145+t;o.push(n,n+145,n+1,n+1,n+145,n+145+1)}let d=new M;return d.setAttribute(`position`,new B(new Float32Array(n),3)),d.setAttribute(`color`,new B(new Float32Array(r),3)),d.setAttribute(`relief`,new B(new Float32Array(i),1)),d.setAttribute(`uv`,new B(new Float32Array(a),2)),d.setIndex(o),d.computeVertexNormals(),d}function Nn(){return new l({depthWrite:!0,fog:!0,transparent:!0,uniforms:re.merge([he.fog]),vertexColors:!0,vertexShader:`
      attribute float relief;
      varying vec3 vColour;
      varying float vRelief;
      varying vec3 vWorldPosition;
      #include <fog_pars_vertex>
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec4 mvPosition = viewMatrix * worldPosition;
        vColour = color;
        vRelief = relief;
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      varying vec3 vColour;
      varying float vRelief;
      varying vec3 vWorldPosition;
      #include <fog_pars_fragment>
      void main() {
        float textureSignal =
          sin(vWorldPosition.x * 0.31 + vWorldPosition.z * 0.19) * 0.5 +
          cos(vWorldPosition.x * 0.13 - vWorldPosition.z * 0.37) * 0.3 +
          sin(vWorldPosition.x * 0.67 + vWorldPosition.z * 0.43) * 0.2;
        float alpha = smoothstep(0.08, 0.72, vRelief);
        alpha *= 0.9 + textureSignal * 0.1;
        if (alpha < 0.035) discard;
        vec3 colour = vColour * (0.92 + textureSignal * 0.075);
        gl_FragColor = vec4(colour, alpha);
        #include <fog_fragment>
        #include <colorspace_fragment>
      }
    `})}function Pn(){let e=[],t=[],n=[],r=e=>{let t=-16-e*136;return{x:-28-e*25+Math.sin(e*7.4)*8,z:t}};for(let n=0;n<=72;n+=1){let i=n/72,a=r(i),o=r(Math.min(1,i+1/72)),s=r(Math.max(0,i-1/72)),c=o.x-s.x,l=o.z-s.z,u=Math.max(1e-4,Math.hypot(c,l)),d=-l/u,f=c/u,p=G(0,.14,i)*(1-G(.88,1,i)),m=(8+i*6+Math.sin(i*Math.PI*3)*1.1)*Math.max(.08,p);for(let n of[-1,1]){let r=a.x+d*m*n,o=a.z+f*m*n;e.push(r,W(r,o)+.14,o),t.push(n<0?0:1,i*5)}}for(let e=0;e<72;e+=1){let t=e*2;n.push(t,t+1,t+2,t+1,t+3,t+2)}let i=new M;i.setAttribute(`position`,new B(new Float32Array(e),3)),i.setAttribute(`uv`,new B(new Float32Array(t),2)),i.setIndex(n),i.computeVertexNormals();let a=new b(i,new _({color:`#8dbec8`,depthWrite:!1,emissive:`#29474e`,emissiveIntensity:.08,metalness:.04,opacity:.74,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,roughness:.32,side:2,transparent:!0}));return a.name=`glacier-middle-distance-frozen-valley-channel`,a.receiveShadow=!0,a.renderOrder=1,a.visible=!1,a}function Fn(e){let t=new b(An(),new n({color:`#ffffff`,fog:!0,vertexColors:!0}));t.name=`glacier-far-unglaciated-valley-terrace`,t.receiveShadow=!0,t.visible=!0,e.add(t);let r=new b(Mn(),Nn());r.name=`glacier-middle-distance-frozen-foothills`,r.receiveShadow=!1,r.visible=!1,e.add(r);let i=Pn();e.add(i);let a=un(`glacier-far-valley-haze`,480,26,.055);return a.position.set(0,7,-128),a.renderOrder=-2,a.visible=!0,e.add(a),{foothills:t,frozenValleyChannel:i,haze:a,middleRidge:r}}function In(e){let t=un(`glacier-atmosphere-veil-1`,420,24,.026);t.position.set(0,9,-92),t.renderOrder=-1,t.visible=!0;let n=un(`glacier-atmosphere-veil-2`,500,38,.035);n.position.set(0,14,-169),n.renderOrder=-3,n.visible=!0,e.add(t,n)}function Ln(e){let t=new c(`#d5e3eb`,`#b9c7d0`,2.65);t.name=`glacier-world-hemisphere-light`;let n=new F(`#ffe5bd`,3.8);n.name=`glacier-world-sun`,n.position.copy($t).multiplyScalar(86),n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.camera.left=-34,n.shadow.camera.right=34,n.shadow.camera.top=28,n.shadow.camera.bottom=-28,n.shadow.camera.near=1,n.shadow.camera.far=180,n.shadow.bias=-1e-4,n.shadow.normalBias=.025;let r=new F(`#c6e0ed`,2.1);r.name=`glacier-world-sky-fill`,r.position.set(38,28,-26),r.castShadow=!1;let i=new F(`#f2d5ad`,1.28);i.name=`glacier-world-subject-fill`,i.position.set(-26,20,34),i.target.position.set(-2,2,0),i.castShadow=!1,e.add(t,n,n.target,r,r.target,i,i.target)}function Rn(e){return e.index?Math.floor(e.index.count/3):Math.floor(e.getAttribute(`position`).count/3)}function zn(e){return e instanceof b}function Bn(e){let t=Object.values(e).filter(e=>e instanceof N);if(e instanceof l)for(let n of Object.values(e.uniforms)){let e=n.value;e instanceof N&&t.push(e)}return t}function Vn(e){let t=new Set,n=new Set,r=new Set,i=0,a=0,o=0;e.traverseVisible(e=>{if(!zn(e))return;i+=1,t.add(e.geometry);let s=Array.isArray(e.material)?e.material:[e.material];for(let e of s)n.add(e),Bn(e).forEach(e=>r.add(e)),e.transparent&&(a+=1);let c=e instanceof E?e.count:1;o+=Rn(e.geometry)*c});let s=0;for(let e of t){for(let t of Object.values(e.attributes))s+=t.array.byteLength;e.index&&(s+=e.index.array.byteLength)}return{drawCalls:i,geometryBytes:s,materials:n.size,textures:r.size,transparentDrawCalls:a,triangles:o}}function Hn(e){let t=new Set,n=new Set,r=new Set;e.traverse(e=>{zn(e)&&(t.add(e.geometry),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>{n.add(e),Bn(e).forEach(e=>r.add(e))}))}),r.forEach(e=>e.dispose()),t.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),e.clear()}function Un(t=`C`,n=`balanced`){let r=new x;r.name=`scale-encounter-glacier-palaeoenvironment-production-candidate`,r.userData.mammothPalaeoenvironmentProductionCandidate={candidateId:qt,reconstructionType:ft.reconstructionType,visualSystem:`mammoth-background-architecture-prototype-v8`};let i=new x;i.name=`background-atmosphere`;let a=new x;a.name=`ground-surface`;let o=new x;o.name=`snow-layer`;let s=new x;s.name=`near-ground`;let c=new x;c.name=`mid-steppe`;let u=new x;u.name=`far-landform`;let d=new x;d.name=`far-ice-mass`;let f=new x;f.name=`palaeoenvironment-atmosphere`;let p=an();i.add(p.mesh);let m=mn(i,d);Ln(i);let h=gn();a.add(h);let g=xn();o.add(g.nearDrifts,g.frozenCrusts),o.userData.persistentAcrossCameraStages=!0;let _=On(s,c),v=Fn(u);In(f),r.add(i,d,a,o,s,c,u,f);let y=t,S=n,C=new e(`#969a92`,.00265),w=new pe(`#c2d4dc`,105,330),T=()=>{let e=y===`A`,t=y===`B`||y===`C`,n=y===`C`;a.visible=!0,o.visible=!0,s.visible=!0,c.visible=!0,p.setPhotographicBackground(e);let r=n?{horizon:`#c9dfe7`,lower:`#dce8e9`,zenith:`#78a9c8`}:{horizon:`#adc3cf`,lower:`#879c9f`,zenith:`#5d86a4`},i=p.mesh.material.uniforms;i.horizonColour?.value instanceof P&&i.horizonColour.value.set(r.horizon),i.lowerColour?.value instanceof P&&i.lowerColour.value.set(r.lower),i.zenithColour?.value instanceof P&&i.zenithColour.value.set(r.zenith),m.rearMountainRange.visible=t,m.mountainRange.visible=t,m.frontMountainRange.visible=t,m.ice.visible=t,m.horizonHaze.visible=t;let d=n?dn.C:dn.B;fn(m.rearMountainRange.material,d.rear),fn(m.mountainRange.material,d.centre),fn(m.frontMountainRange.material,d.front);let h=m.horizonHaze.material.uniforms.colour;h?.value instanceof P&&h.value.set(n?`#d4e1e5`:`#b7bbae`);let g=m.horizonHaze.material.uniforms.opacity;g&&(g.value=n?.12:.055),u.visible=e||n,v.foothills.visible=e,v.foothills.scale.y=1,v.middleRidge.visible=n,v.frozenValleyChannel.visible=n,v.haze.position.y=n?6:7,v.haze.position.z=n?-58:-128,v.haze.visible=e||n;let _=v.haze.material.uniforms.opacity;_&&(_.value=e?.055:n?.075:0);let x=v.haze.material.uniforms.colour;x?.value instanceof P&&x.value.set(n?`#ccdde2`:`#b7bbae`),f.children.forEach(e=>{if(!(e instanceof b)||!(e.material instanceof l))return;let t=e.material.uniforms.colour;t?.value instanceof P&&t.value.set(`#c9dbe1`)}),f.visible=n},E=()=>{let e=Qt[S],t=h.material.userData.mammothFrostBlend;t&&(t.value=e.frostBlend),g.nearDrifts.count=e.patchCount,g.nearDrifts.instanceMatrix.needsUpdate=!0,g.frozenCrusts.count=e.crustCount,g.frozenCrusts.instanceMatrix.needsUpdate=!0};return E(),T(),{root:r,layers:{atmosphere:f,background:i,farIceMass:d,farLandform:u,groundSurface:a,midSteppe:c,nearGround:s,snowLayer:o},scientificAnchor:ft,diagnostics:()=>({anchorId:ft.id,crevasseCount:0,farIceVolume:{maximum:Xt.toArray(),minimum:Yt.toArray(),minimumCorridorSeparationMeters:Math.max(0,Zt.min.z-Xt.z),role:ft.iceRole.role},groundSurface:{kind:`unglaciated-loess-and-permafrost-topsoil`,supportsSubjects:!0,worldRadiusMeters:Jt},iceTowerCount:0,layerCounts:{..._,snowPatches:Qt[S].patchCount},resourceEstimate:Vn(r),snowLayer:{approximateCoverFraction:Qt[S].coverFraction,supportsSubjects:!1,thicknessStatement:ft.seasonClimate.snowDepthStatement},surfaceState:S,variant:y}),dispose:()=>Hn(r),fog:()=>y===`A`?C:y===`B`?null:w,setSurfaceState:e=>{S=e,E()},setVariant:e=>{y=e,T()},update:e=>{Number.isFinite(e)&&f.children.forEach((t,n)=>{t instanceof b&&(t.position.x=Math.sin(e*.018+n*2.4)*.9)})}}}var Wn=`mammoth-real-dem-snow-valley-accepted-v1`,Gn=1.8,Kn=0;function qn(e){let t=Rt(`C`,`balanced`);Jn(t),nr(t.root);let n=Yn(),r=er(),i=Xn();t.root.add(n.root,r.mesh,i.mesh),t.root.userData.scaleEncounterAcceptedEnvironment={defaultCandidate:!0,id:Wn,elevationSource:`mapzen-terrarium-z12-2139-1449`,modernPhotography:!1,baseOwnerVisualApproval:`2026-08-19`,localRevision:`scanned-snow-and-rocks-2026-09-05`};let a=e?tr(e):null;return{candidate:t,environmentIntensity:.76,environmentMap:a?.texture??null,fog:new pe(`#bdd8e4`,950,3600),groundHeightAtWorld:ir,root:t.root,skyDome:i.mesh,dispose:()=>{t.dispose(),n.textures.forEach(e=>e.dispose()),r.heightMap.dispose(),i.cloudMap.dispose(),a?.dispose()},update:e=>t.update(e)}}function Jn(e){e.layers.groundSurface.visible=!1,e.layers.snowLayer.visible=!1,e.layers.nearGround.visible=!1,e.layers.midSteppe.visible=!1,e.layers.farIceMass.visible=!1,e.layers.farLandform.visible=!1,e.layers.atmosphere.visible=!1;let t=new Set([`glacier-background-atmosphere-sky`,`glacier-rear-snow-peak-range`,`glacier-far-rock-ridge`,`glacier-front-moraine-ridge`,`glacier-background-horizon-haze`]);e.layers.background.traverse(e=>{t.has(e.name)&&(e.visible=!1)})}function Yn(){let e=new x;e.name=`scale-encounter-mammoth-accepted-hero-zone`;let t=new ue,n={value:0},r=0,i=e=>t.load(e,()=>{r+=1,r===6&&(n.value=1)}),a=i(new URL(``+new URL(`surface-snow-albedo-1024-EhKkDN9y.webp`,import.meta.url).href,``+import.meta.url).href),o=i(new URL(``+new URL(`surface-snow-normal-1024-Xty2AtuP.webp`,import.meta.url).href,``+import.meta.url).href),s=i(new URL(``+new URL(`surface-snow-roughness-1024-CjGOTKn3.webp`,import.meta.url).href,``+import.meta.url).href),c=i(new URL(``+new URL(`surface-land-albedo-1024-CNYf7nau.webp`,import.meta.url).href,``+import.meta.url).href),l=i(new URL(``+new URL(`surface-land-normal-1024-CyO7zruh.webp`,import.meta.url).href,``+import.meta.url).href);a.colorSpace=u,c.colorSpace=u;let f=i(new URL(``+new URL(`snow-earth-patches-v3-CcO1vH-D.webp`,import.meta.url).href,``+import.meta.url).href);f.colorSpace=u,f.anisotropy=8;let p=[a,o,s,c,l];for(let e of p)e.wrapS=e.wrapT=d,e.repeat.set(72,72),e.anisotropy=4;let m=new _({color:`#ffffff`,map:a,normalMap:o,normalScale:new R(.24,.24),roughnessMap:s,roughness:.94,metalness:0,transparent:!0,depthWrite:!0});m.name=`scale-encounter-mammoth-scanned-snow-pbr`,Fe(m,{colourMap:f,widthMeters:112,detailMeters:1.3,farColour:`#e5e9e6`,grainStrength:.06,colourMipLevel:1}),m.userData.surfaceReady=n;let h=m.onBeforeCompile.bind(m);m.onBeforeCompile=(e,t)=>{h(e,t),e.uniforms.uMammothSurfaceReady=n,e.uniforms.uExposedSoil={value:c},e.uniforms.uExposedSoilNormal={value:l},e.fragmentShader=e.fragmentShader.replace(`uniform sampler2D uGroundColourPlate;`,`uniform sampler2D uGroundColourPlate;
uniform float uMammothSurfaceReady;
uniform sampler2D uExposedSoil;
uniform sampler2D uExposedSoilNormal;`).replace(`diffuseColor.rgb *= groundColour;`,`
vec3 snowPlate = textureLod(uGroundColourPlate, groundPlateUv, 0.0).rgb;
float snowCover = smoothstep(.34, .62, dot(snowPlate, vec3(.2126, .7152, .0722)));
snowCover = mix(1.0, snowCover, groundPlateFade);
vec3 soilColour = sampleGroundScan(uExposedSoil, groundDetailUv).rgb * .4;
vec3 snowColour = vec3(.73, .79, .81) * mix(.94, 1.06, groundGrain);
// Until every colour AND normal image is ready, render lit snow. An
// empty normal sampler otherwise points downward and blackens the surface.
snowCover = mix(1.0, snowCover, uMammothSurfaceReady);
diffuseColor.rgb *= mix(vec3(.73, .79, .81), mix(soilColour, snowColour, snowCover), uMammothSurfaceReady);`).replaceAll(`sampleGroundScan( normalMap, groundDetailUv )`,`mix(sampleGroundScan(uExposedSoilNormal, groundDetailUv), sampleGroundScan(normalMap, groundDetailUv), snowCover)`).replace(`mapN = normalize(mapN);`,`mapN = uMammothSurfaceReady < .5 ? vec3(0., 0., 1.) : normalize(mapN);`).replace(`#include <opaque_fragment>`,`
diffuseColor.a *= 1.0 - smoothstep(64.0, 78.0, length(vAuthoredGroundWorld.xz));
#include <opaque_fragment>`)},m.customProgramCacheKey=()=>`mammoth-patchy-snow-ground-v3`;let g=new U(164,164,164,164);g.rotateX(-Math.PI/2);let v=g.getAttribute(`position`);for(let e=0;e<v.count;e+=1)v.setY(e,ir(v.getX(e),v.getZ(e)));g.computeVertexNormals();let y=new b(g,m);return y.name=`scale-encounter-mammoth-continuous-snow-drifts`,y.receiveShadow=!0,e.add(y),{root:e,textures:[...p,f]}}function Xn(){let e=Zn(),t=new l({depthWrite:!1,fog:!1,side:1,toneMapped:!1,uniforms:{cloudColour:{value:new P(`#f8fbfc`)},cloudMap:{value:e},horizonColour:{value:new P(`#c2e0ed`)},middleColour:{value:new P(`#79b9dc`)},zenithColour:{value:new P(`#438fc2`)}},vertexShader:`
      varying vec3 vSkyDirection;
      varying vec2 vSkyUv;
      void main() {
        vSkyDirection = normalize(position);
        vSkyUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 cloudColour;
      uniform sampler2D cloudMap;
      uniform vec3 horizonColour;
      uniform vec3 middleColour;
      uniform vec3 zenithColour;
      varying vec3 vSkyDirection;
      varying vec2 vSkyUv;
      void main() {
        vec3 direction = normalize(vSkyDirection);
        float height = direction.y;
        vec3 sky = mix(
          horizonColour,
          middleColour,
          smoothstep(-0.04, 0.42, height)
        );
        sky = mix(sky, zenithColour, smoothstep(0.38, 0.92, height));
        float cloudBand = smoothstep(0.03, 0.13, height) *
          (1.0 - smoothstep(0.62, 0.82, height));
        float cloud = texture2D(cloudMap, vSkyUv).r * cloudBand;
        float cloudLight = 0.82 + max(direction.y, 0.0) * 0.18;
        sky = mix(sky, cloudColour * cloudLight, cloud * 0.52);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }
    `});t.name=`scale-encounter-mammoth-clear-blue-sky`;let n=new b(new D(2300,64,32),t);return n.name=`scale-encounter-mammoth-accepted-sky-dome`,n.frustumCulled=!1,n.renderOrder=-100,{cloudMap:e,mesh:n}}function Zn(){let e=new Uint8Array(512*256);for(let t=0;t<256;t+=1){let n=(t+.5)/256;for(let r=0;r<512;r+=1){let i=(r+.5)/512,a=Qn(i*6,n*3,6,3,10707),o=Qn(i*13,n*7,13,7,20903),s=Qn(i*29,n*15,29,15,32589),c=a*.56+o*.3+s*.14;e[t*512+r]=Math.round(ar(.59,.73,c)*255)}}let t=new a(e,512,256,v,k);return t.name=`scale-encounter-mammoth-seamless-cloud-mask`,t.wrapS=d,t.magFilter=j,t.minFilter=I,t.generateMipmaps=!0,t.needsUpdate=!0,t}function Qn(e,t,n,r,i){let a=Math.floor(e),o=Math.floor(t),s=ar(0,1,e-a),c=ar(0,1,t-o),l=$n(a,o,n,r,i),u=$n(a+1,o,n,r,i),d=$n(a,o+1,n,r,i),f=$n(a+1,o+1,n,r,i);return or(or(l,u,s),or(d,f,s),c)}function $n(e,t,n,r,i){let a=(e%n+n)%n,o=(t%r+r)%r,s=i^Math.imul(a+1,73244475);return s=Math.imul(s^s>>>16,73244475),s^=Math.imul(o+1,668265261),s=Math.imul(s^s>>>15,2246822507),((s^s>>>16)>>>0)/4294967295}function er(){let e=6740,t=new R(176.5/256,1-80.5/256),n=new R((t.x-.5)*e,(t.y-.5)*e),r={value:0},i=new ue().load(Ut,()=>{r.value=1});i.name=`scale-encounter-mapzen-alpine-elevation`,i.generateMipmaps=!1,i.magFilter=j,i.minFilter=j;let a=new U(e,e,255,255),o=new _({color:`#ffffff`,envMapIntensity:.62,metalness:0,roughness:.9});o.name=`scale-encounter-real-dem-snow-mountain-material`,o.onBeforeCompile=e=>{e.uniforms.alpineHeightReady=r,e.uniforms.alpineHeightMap={value:i},e.uniforms.alpineOriginLocal={value:n},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float alpineHeightReady;
uniform sampler2D alpineHeightMap;
uniform vec2 alpineOriginLocal;
varying float vAlpineRelief;
varying vec3 vAlpineWorld;
varying vec3 vAlpineWorldNormal;

float alpineElevationAt(vec2 sampleUv) {
  if (alpineHeightReady < .5) return 2537.59375;
  vec3 encoded = texture2D(alpineHeightMap, sampleUv).rgb;
  return encoded.r * 65280.0 + encoded.g * 255.0 + encoded.b * 0.99609375 - 32768.0;
}

float alpineReliefAt(vec2 sampleUv, vec2 localPosition) {
  float relativeElevation = (alpineElevationAt(sampleUv) - 2537.59375) * 0.44;
  float localRadius = length(localPosition - alpineOriginLocal);
  return relativeElevation * smoothstep(62.0, 420.0, localRadius);
}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
const vec2 alpineTexel = vec2(1.0 / 256.0);
const float alpineCellSize = 26.328125;
vAlpineRelief = alpineReliefAt(uv, position.xy);
transformed.z += vAlpineRelief;
float alpineLeft = alpineReliefAt(
  uv - vec2(alpineTexel.x, 0.0),
  position.xy - vec2(alpineCellSize, 0.0)
);
float alpineRight = alpineReliefAt(
  uv + vec2(alpineTexel.x, 0.0),
  position.xy + vec2(alpineCellSize, 0.0)
);
float alpineDown = alpineReliefAt(
  uv - vec2(0.0, alpineTexel.y),
  position.xy - vec2(0.0, alpineCellSize)
);
float alpineUp = alpineReliefAt(
  uv + vec2(0.0, alpineTexel.y),
  position.xy + vec2(0.0, alpineCellSize)
);
vec3 alpineLocalNormal = normalize(vec3(
  -(alpineRight - alpineLeft) / (alpineCellSize * 2.0),
  -(alpineUp - alpineDown) / (alpineCellSize * 2.0),
  1.0
));
vAlpineWorldNormal = normalize(mat3(modelMatrix) * alpineLocalNormal);
vAlpineWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vAlpineRelief;
varying vec3 vAlpineWorld;
varying vec3 vAlpineWorldNormal;

float alpineHash(vec2 value) {
  return fract(sin(dot(value, vec2(127.1, 311.7))) * 43758.5453123);
}

float alpineValueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 blend = fract(point);
  blend = blend * blend * (3.0 - 2.0 * blend);
  float a = alpineHash(cell);
  float b = alpineHash(cell + vec2(1.0, 0.0));
  float c = alpineHash(cell + vec2(0.0, 1.0));
  float d = alpineHash(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
}`).replace(`#include <map_fragment>`,`#include <map_fragment>
vec3 alpineWorldNormal = normalize(vAlpineWorldNormal);
float alpineUpward = smoothstep(0.90, 0.995, alpineWorldNormal.y);
float alpineAltitude = smoothstep(40.0, 430.0, vAlpineRelief);
float alpineMacro = alpineValueNoise(vAlpineWorld.xz * 0.0045);
float alpineDetail = alpineValueNoise(vAlpineWorld.xz * 0.035);
float alpineSnowCoverage = clamp(
  alpineUpward * 0.72 + alpineAltitude * 0.42 +
  (alpineMacro - 0.5) * 0.22 + (alpineDetail - 0.5) * 0.08,
  0.0,
  1.0
);
vec3 alpineRock = mix(
  vec3(0.115, 0.135, 0.155),
  vec3(0.255, 0.285, 0.31),
  alpineMacro
);
vec3 alpineSnow = mix(
  vec3(0.54, 0.62, 0.68),
  vec3(0.77, 0.84, 0.9),
  alpineDetail * 0.42 + 0.46
);
vec3 alpineSurface = mix(
  alpineRock,
  alpineSnow,
  smoothstep(0.22, 0.82, alpineSnowCoverage)
);
diffuseColor.rgb *= alpineSurface;`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
normal = normalize((viewMatrix * vec4(alpineWorldNormal, 0.0)).xyz);`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = mix(0.82, 0.96, alpineSnowCoverage);`)},o.customProgramCacheKey=()=>`scale-encounter-real-dem-alpine-terrain-v1`;let s=new b(a,o);return s.name=`scale-encounter-real-dem-continuous-alpine-terrain`,s.rotation.x=-Math.PI/2,s.position.set(Gn-n.x,-.08,Kn+n.y),s.receiveShadow=!0,{heightMap:i,mesh:s}}function tr(e){let t=new w,n=new b(new D(24,48,24),new l({side:1,depthWrite:!1,uniforms:{horizon:{value:new P(`#cbdde5`).convertSRGBToLinear()},zenith:{value:new P(`#6591ad`).convertSRGBToLinear()},ground:{value:new P(`#8a938e`).convertSRGBToLinear()}},vertexShader:`
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vDirection;
        uniform vec3 horizon;
        uniform vec3 zenith;
        uniform vec3 ground;
        void main() {
          float up = smoothstep(-0.02, 0.88, vDirection.y);
          vec3 colour = mix(ground, horizon, smoothstep(-0.55, 0.08, vDirection.y));
          colour = mix(colour, zenith, up);
          gl_FragColor = vec4(colour, 1.0);
        }
      `}));t.add(n);let r=new ge(e),i=r.fromScene(t,.04,.1,60);return r.dispose(),n.geometry.dispose(),n.material.dispose(),i}function nr(e){e.traverse(e=>{!(e instanceof F)||e.name!==`glacier-world-sun`||(e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-15,e.shadow.camera.right=15,e.shadow.camera.top=13,e.shadow.camera.bottom=-13,e.shadow.camera.near=28,e.shadow.camera.far=142,e.shadow.bias=-12e-5,e.shadow.normalBias=.012,e.shadow.radius=1.6,e.shadow.camera.updateProjectionMatrix())})}var rr=[[-17,-10,14,5,1.05,-.35],[16,12,18,6,1.32,-.46],[28,-22,23,8,1.8,-.25],[-31,24,20,7,1.5,-.55],[-8,-38,31,10,1.7,-.32],[39,39,24,11,2.05,-.6]];function ir(e=0,t=0){let n=0;for(let[r,i,a,o,s,c]of rr){let l=e-r,u=t-i,d=(l*Math.cos(c)+u*Math.sin(c))/a,f=(-l*Math.sin(c)+u*Math.cos(c))/o;n+=s*Math.exp(-(d*d+f*f)*2)}let r=ar(3.8,7.5,Math.abs(t)),i=1-ar(58,78,Math.hypot(e,t));return-.035+n*r*i}function ar(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function or(e,t,n){return e+(t-e)*n}var sr=12.5,cr=.5,lr=.65,ur=new z(new L(-96,-19,-96),new L(96,sr,96));function dr(e,t){let n=Math.sin(e*.041+t*.017)*.72,r=Math.cos(t*.052-e*.013)*.46,i=Math.sin((e+t)*.019)*.31;return-15.35+n+r+i}function fr(e){return{maximum:e.max.toArray(),minimum:e.min.toArray()}}function pr(e,t){let n=[],r=sr-t.y;r<.5&&n.push({boundary:`surface`,clearanceMeters:r,label:e});let i=t.y-dr(t.x,t.z);i<.65&&n.push({boundary:`seabed`,clearanceMeters:i,label:e});let a=Math.min(96-Math.abs(t.x),96-Math.abs(t.z));return a<0&&n.push({boundary:`volume-xz`,clearanceMeters:a,label:e}),n}function mr(e,t){let n=t.getCenter(new L),r=[],i=sr-t.max.y;i<.5&&r.push({boundary:`surface`,clearanceMeters:i,label:e});let a=t.min.y-dr(n.x,n.z);a<.65&&r.push({boundary:`seabed`,clearanceMeters:a,label:e});let o=Math.min(96-Math.max(Math.abs(t.min.x),Math.abs(t.max.x)),96-Math.max(Math.abs(t.min.z),Math.abs(t.max.z)));return o<0&&r.push({boundary:`volume-xz`,clearanceMeters:o,label:e}),r}function hr(e,t){return e.clone().expandByScalar(t)}function gr(e,t,n){let r=new z,i=e.cameraSamples.map(({label:e,position:t})=>(r.expandByPoint(t),{bounds:new z().setFromCenterAndSize(t,new L(.8,.8,.8)),label:`camera:${e}`}));r.isEmpty()&&r.copy(e.avatarBounds);let a=[{bounds:hr(e.animalBounds,.8),label:`subject:mosasaurus`},{bounds:hr(e.avatarBounds,.45),label:`subject:avatar-presentation`},...i],o=t.flatMap(e=>a.filter(({bounds:t})=>t.intersectsBox(e.worldBounds)).map(({label:t})=>({corridor:t,object:e.name}))),s=[];for(let e=-96;e<=96;e+=8)for(let t=-96;t<=96;t+=8)s.push(dr(e,t));return{cameraSweepBounds:fr(r),cameraViolations:e.cameraSamples.flatMap(({label:e,position:t})=>pr(e,t)),corridorOverlapCount:o.length,corridorOverlaps:o,hiddenSeabedBoundary:{clearanceMeters:lr,maximumY:Math.max(...s),minimumY:Math.min(...s),visibleInCandidate:n},objectGrounding:t.map(e=>({burialDepth:e.burialDepth,groundingError:e.groundingError,layer:e.layer,name:e.name,targetBedY:e.targetBedY,worldBottomY:e.worldBottomY})),subjectViolations:[...mr(`mosasaurus`,e.animalBounds),...mr(`avatar-presentation`,e.avatarBounds)],waterSurface:{exclusionMeters:cr,worldY:sr},waterVolume:fr(ur)}}var _r=[`background-scatter`,`water-surface`,`water-volume`,`seabed`,`near-water`,`mid-water`,`far-volume`,`caustics`,`suspended-particulate`,`ecology-clues`],vr={A:new Set([`background-scatter`]),B:new Set([`background-scatter`,`water-surface`,`water-volume`,`caustics`]),C:new Set([`background-scatter`,`water-surface`,`water-volume`,`near-water`,`mid-water`,`far-volume`,`caustics`,`suspended-particulate`]),D:new Set([`background-scatter`,`water-surface`,`water-volume`,`near-water`,`mid-water`,`far-volume`,`caustics`,`suspended-particulate`])},yr=`ocean-formal-review-gallery-blue-clear-water-v14`,br=`clear-sunlit-surface-scatter-v12`,xr=`coherent-gallery-blue-clear-water-v4`,Sr=.16,Cr={deep:`#075b91`,horizon:`#258bb9`,sun:`#f4e5c6`,surface:`#68b8d1`},wr=new R(.86,-.51).normalize(),Tr=5.6,Er=.045,Dr=.11,Or=`#1d7596`,kr={B:190,C:180,D:82},Ar={B:560,C:540,D:310},jr=new L(-.25,.68,-.69).normalize();function Mr(e){return Math.min(1,Math.max(0,e))}function Nr(e,t,n){let r=Mr((n-e)/(t-e));return r*r*(3-2*r)}function Pr(e,t,n){return e+(t-e)*n}function Fr(){let e=new Uint16Array(256*128*4),t=new P(Cr.deep),n=new P(Cr.horizon),i=new P(Cr.surface),o=new P(Cr.sun),s=new L;for(let a=0;a<128;a+=1){let c=((a+.5)/128-.5)*Math.PI,l=Math.sin(c),u=Math.cos(c),d=Nr(-.72,.08,l),f=Nr(.02,.88,l);for(let c=0;c<256;c+=1){let p=((c+.5)/256-.5)*Math.PI*2;s.set(Math.cos(p)*u,l,Math.sin(p)*u);let m=[Pr(t.r,n.r,d),Pr(t.g,n.g,d),Pr(t.b,n.b,d)];m[0]=Pr(m[0],i.r,f),m[1]=Pr(m[1],i.g,f),m[2]=Pr(m[2],i.b,f);let h=.982+(.5+Math.sin(p*3.1+l*4.7)*.16+Math.sin(p*8.2-l*2.3+1.7)*.08)*.034,g=Math.max(0,s.dot(jr)),_=g**15*.2,v=g**190*.68,y=Nr(-.02,.66,l),b=(_+v)*y,x=(a*256+c)*4;e[x]=r.toHalfFloat(m[0]*h+o.r*b),e[x+1]=r.toHalfFloat(m[1]*h+o.g*b),e[x+2]=r.toHalfFloat(m[2]*h+o.b*b),e[x+3]=r.toHalfFloat(1)}}let c=new a(e,256,128,y,C);return c.name=`ocean-coherent-radiance-linear-hdr-v1`,c.colorSpace=te,c.wrapS=d,c.minFilter=j,c.magFilter=j,c.generateMipmaps=!1,c.needsUpdate=!0,c}var Ir=`
  float oceanHash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float oceanValueNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    local = local * local * (3.0 - 2.0 * local);
    float a = oceanHash21(cell);
    float b = oceanHash21(cell + vec2(1.0, 0.0));
    float c = oceanHash21(cell + vec2(0.0, 1.0));
    float d = oceanHash21(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  float oceanFbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
    for (int octave = 0; octave < 4; octave += 1) {
      total += oceanValueNoise(p) * amplitude;
      p = rotation * p * 2.03 + vec2(7.1, -4.3);
      amplitude *= 0.5;
    }
    return total;
  }
`,Lr=`
  vec2 oceanDirectionToEquirectUv(vec3 direction) {
    direction = normalize(direction);
    return vec2(
      atan(direction.z, direction.x) * 0.15915494309189535 + 0.5,
      asin(clamp(direction.y, -1.0, 1.0)) * 0.3183098861837907 + 0.5
    );
  }

  float oceanForwardPhase(float cosineTheta) {
    const float anisotropy = 0.56;
    float denominator = 1.0 + anisotropy * anisotropy -
      2.0 * anisotropy * cosineTheta;
    return (1.0 - anisotropy * anisotropy) /
      max(0.08, pow(denominator, 1.5));
  }

  float oceanAngularDistance(float a, float b) {
    return abs(fract(a - b + 0.5) - 0.5);
  }

  // One soft volume lobe projected from a moving surface opening. Different
  // offsets and spreads form a divergent fan rather than repeated parallel
  // stripes. The low-frequency FBM moves the transmitted energy, while the
  // centre itself only wanders slightly so the sun never appears to wobble.
  float oceanDynamicSunShaft(
    float azimuth,
    float elevation,
    float depth,
    float openingOffset,
    float divergence,
    float phase,
    float widthScale
  ) {
    float sunAzimuth = atan(uSunDirection.z, uSunDirection.x) *
      0.15915494309189535;
    float centreWander = sin(uTime * 0.23 + phase) * 0.012;
    float centre = sunAzimuth + openingOffset +
      divergence * depth + centreWander;
    float width = mix(0.048, 0.126, depth) * widthScale;
    float distanceToCentre = oceanAngularDistance(azimuth, centre);
    float lobe = exp(
      -0.5 * distanceToCentre * distanceToCentre /
      max(0.00008, width * width)
    );
    float surfaceFlow = oceanFbm(
      vec2(
        azimuth * 12.0 + elevation * 2.4 + phase,
        elevation * 4.2 - uTime * 0.092 + phase * 0.37
      )
    );
    float transmission = mix(
      0.18,
      1.32,
      smoothstep(0.24, 0.72, surfaceFlow)
    );
    float slowPulse = 0.80 + sin(uTime * 0.44 + phase) * 0.20;
    return lobe * transmission * slowPulse;
  }

  float oceanIntegratedSurfaceScatter(vec3 direction) {
    float jitter = oceanHash21(direction.xy * 913.7 + direction.yz * 271.3);
    float accumulated = 0.0;
    float accumulatedWeight = 0.0;
    mat2 surfaceRotation = mat2(0.78, -0.63, 0.63, 0.78);
    for (int sampleIndex = 0; sampleIndex < 6; sampleIndex += 1) {
      float distanceAlongRay = 7.0 +
        (float(sampleIndex) + jitter * 0.72) * 11.5;
      vec3 samplePosition = cameraPosition + direction * distanceAlongRay;
      float belowSurface = 1.0 - step(uWaterSurfaceY, samplePosition.y);
      float distanceToSurface = max(
        0.0,
        (uWaterSurfaceY - samplePosition.y) / max(0.12, uSunDirection.y)
      );
      vec2 surfaceHit = samplePosition.xz +
        uSunDirection.xz * distanceToSurface;
      float waveA = oceanValueNoise(
        surfaceHit * 0.052 + vec2(uTime * 0.024, -uTime * 0.017)
      );
      float waveB = oceanValueNoise(
        surfaceRotation * surfaceHit * 0.113 +
        vec2(-uTime * 0.015, uTime * 0.021)
      );
      float transmission = smoothstep(0.22, 0.82, waveA * 0.58 + waveB * 0.42);
      float opening = 1.0 - smoothstep(
        7.0,
        38.0,
        length(surfaceHit - uSunOpeningCentre)
      );
      transmission = mix(transmission, 0.94, opening * 0.66);
      float distanceWeight = exp(-distanceAlongRay * 0.021) * belowSurface;
      accumulated += transmission * distanceWeight;
      accumulatedWeight += distanceWeight;
    }
    return accumulated / max(0.001, accumulatedWeight);
  }

  vec3 oceanFarRadiance(vec3 direction) {
    direction = normalize(direction);
    if (uUseRadianceLut > 0.5) {
      vec2 radianceUv = oceanDirectionToEquirectUv(direction);
      vec3 cachedRadiance = texture2D(uRadianceLut, radianceUv).rgb;
      // One low-frequency modulation retains a gentle living-water drift while
      // skipping the six-sample integration and multi-octave shaft field.
      float slowWaterBreath = oceanValueNoise(
        radianceUv * vec2(7.0, 3.4) + vec2(uTime * 0.004, -uTime * 0.0025)
      );
      return cachedRadiance * mix(0.985, 1.018, slowWaterBreath);
    }
    float elevation = direction.y;
    float horizonMix = smoothstep(-0.72, 0.08, elevation);
    float surfaceMix = smoothstep(0.02, 0.88, elevation);
    vec3 colour = mix(uDeepColour, uHorizonColour, horizonMix);
    colour = mix(colour, uSurfaceColour, surfaceMix);

    float azimuth = atan(direction.z, direction.x) * 0.15915494309189535;
    vec2 volumeCoordinate = vec2(azimuth * 3.2, elevation * 1.8);
    float broadDensity = oceanFbm(
      volumeCoordinate + vec2(uTime * 0.0021, -uTime * 0.0014)
    );
    colour *= 0.965 + broadDensity * 0.055;

    float upwardMask = smoothstep(-0.02, 0.66, elevation);
    vec2 surfaceCoordinate = direction.xz / max(0.12, elevation + 0.08);
    float surfaceTransmission = oceanFbm(
      surfaceCoordinate * 0.34 + vec2(uTime * 0.024, -uTime * 0.017)
    );
    colour += uSurfaceColour * upwardMask *
      (0.024 + surfaceTransmission * 0.045);

    float sunCosine = max(dot(direction, uSunDirection), 0.0);
    float forwardScatter = oceanForwardPhase(sunCosine);
    float halo = pow(sunCosine, 15.0);
    float sunCore = pow(sunCosine, 190.0);
    float waveShadow = mix(0.88, 1.06, surfaceTransmission);
    float integratedSurfaceScatter = oceanIntegratedSurfaceScatter(direction);
    float shaftVisibility = 1.0 - smoothstep(0.28, 0.82, -elevation);
    // The camera often looks almost horizontally across the animal/child
    // corridor. Real forward-scattered surface light remains visible there;
    // limiting it to the upward hemisphere made the former version read as a
    // flat bright ceiling. Each view ray is sampled at several depths and
    // projected back to the animated surface, so these softly broken patches
    // share one sun direction without becoming parallel screen-space cards.
    float shaftAltitude = smoothstep(-0.54, 0.34, elevation);
    float shaftOpening = smoothstep(0.18, 0.58, integratedSurfaceScatter);
    float shaftWarp = oceanFbm(
      volumeCoordinate * vec2(3.8, 2.6) +
      vec2(-uTime * 0.0022, uTime * 0.0017)
    );
    float shaftApertures = oceanFbm(
      vec2(
        azimuth * 19.0 + elevation * 2.8 + shaftWarp * 1.7,
        elevation * 2.2 - azimuth * 1.3
      ) + vec2(uTime * 0.0018, -uTime * 0.0012)
    );
    float shaftBreakup = mix(
      0.24,
      1.22,
      smoothstep(0.37, 0.69, shaftApertures)
    );
    float broadShaftCone = pow(sunCosine, 2.15);
    float shaftTransmission = mix(0.34, 1.0, shaftOpening);
    float shaftDepth = clamp((0.58 - elevation) / 1.05, 0.0, 1.0);
    float animatedShafts = 0.0;
    animatedShafts += oceanDynamicSunShaft(
      azimuth, elevation, shaftDepth, -0.085, -0.040, 0.3, 1.08
    );
    animatedShafts += oceanDynamicSunShaft(
      azimuth, elevation, shaftDepth, -0.018, -0.012, 1.8, 1.18
    );
    animatedShafts += oceanDynamicSunShaft(
      azimuth, elevation, shaftDepth, 0.054, 0.026, 3.4, 1.12
    );
    animatedShafts = 1.0 - exp(-animatedShafts * 0.54);
    float animatedShaftVisibility = smoothstep(-0.58, 0.28, elevation) *
      (1.0 - smoothstep(0.86, 1.0, shaftDepth));
    colour += uSunColour * forwardScatter * upwardMask * waveShadow * 0.032;
    colour += uSunColour * halo * upwardMask * waveShadow * 0.21;
    colour += uSunColour * sunCore * upwardMask * 0.62;
    colour += uSunColour * integratedSurfaceScatter * forwardScatter *
      shaftVisibility * 0.042;
    colour += uSunColour * shaftTransmission * shaftAltitude * shaftVisibility *
      shaftBreakup * broadShaftCone *
      (0.082 + min(forwardScatter, 2.4) * 0.025);
    colour += uSunColour * animatedShafts * animatedShaftVisibility *
      (0.084 + min(forwardScatter, 2.4) * 0.024);

    vec3 approvedBackdrop = texture2D(
      uBackdrop,
      oceanDirectionToEquirectUv(direction)
    ).rgb;
    return mix(colour, approvedBackdrop, uUseBackdrop * 0.86);
  }
`;function Rr(e,t){return{uBackdrop:{value:e?.texture??null},uDeepColour:{value:new P(Cr.deep)},uHorizonColour:{value:new P(Cr.horizon)},uRadianceLut:{value:t},uSunColour:{value:new P(Cr.sun)},uSunDirection:{value:jr.clone()},uSunOpeningCentre:{value:new R(-17,-24)},uSurfaceColour:{value:new P(Cr.surface)},uTime:{value:0},uUseBackdrop:{value:+!!e},uUseRadianceLut:{value:0},uWaterSurfaceY:{value:sr}}}function zr(e,t){return new l({depthTest:!1,depthWrite:!1,side:1,toneMapped:!0,uniforms:Rr(e,t),vertexShader:`
      varying vec3 vViewDirection;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vViewDirection = normalize(worldPosition.xyz - cameraPosition);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,fragmentShader:`
      precision highp float;
      varying vec3 vViewDirection;
      uniform sampler2D uBackdrop;
      uniform sampler2D uRadianceLut;
      uniform vec3 uDeepColour;
      uniform vec3 uHorizonColour;
      uniform vec3 uSunColour;
      uniform vec3 uSunDirection;
      uniform vec2 uSunOpeningCentre;
      uniform vec3 uSurfaceColour;
      uniform float uTime;
      uniform float uUseBackdrop;
      uniform float uUseRadianceLut;
      uniform float uWaterSurfaceY;
      ${Ir}
      ${Lr}

      void main() {
        gl_FragColor = vec4(oceanFarRadiance(vViewDirection), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `})}function Br(){let e=[4,8,16,32],t=[.48,.27,.16,.09],n=e.map((e,t)=>{let n=new Float32Array(e*e);for(let e=0;e<n.length;e+=1)n[e]=K(e+t*997+211);return{cellCount:e,grid:n}}),r=new Float32Array(16384),i=e=>e*e*(3-2*e);for(let e=0;e<128;e+=1)for(let a=0;a<128;a+=1){let o=0;for(let r=0;r<n.length;r+=1){let{cellCount:s,grid:c}=n[r],l=a/128*s,u=e/128*s,d=Math.floor(l)%s,f=Math.floor(u)%s,p=(d+1)%s,m=(f+1)%s,h=i(l-Math.floor(l)),g=i(u-Math.floor(u)),_=c[f*s+d]*(1-h)+c[f*s+p]*h,v=c[m*s+d]*(1-h)+c[m*s+p]*h;o+=(_*(1-g)+v*g)*t[r]}r[e*128+a]=o}let o=new Uint8Array(16384*4);for(let e=0;e<128;e+=1)for(let t=0;t<128;t+=1){let n=r[e*128+(t+128-1)%128],i=r[e*128+(t+1)%128],a=r[(e+128-1)%128*128+t],s=r[(e+1)%128*128+t],c=(n-i)*8.5,l=(a-s)*8.5,u=1/Math.hypot(c,l,1),d=(e*128+t)*4;o[d]=Math.round((c*u*.5+.5)*255),o[d+1]=Math.round((l*u*.5+.5)*255),o[d+2]=Math.round((u*.5+.5)*255),o[d+3]=255}let s=new a(o,128,128,y,k);return s.name=`ocean-procedural-multiscale-normal-v1`,s.colorSpace=``,s.wrapS=d,s.wrapT=d,s.minFilter=I,s.magFilter=j,s.generateMipmaps=!0,s.needsUpdate=!0,s}function Vr(e,t,n){return new l({depthTest:!0,depthWrite:!0,side:1,toneMapped:!0,uniforms:{...Rr(e,n),uNormalMap:{value:t}},vertexShader:`
      varying vec3 vWorldPosition;
      varying vec2 vBroadWaveSlope;
      uniform float uTime;

      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vec2 p = world.xz;
        vec2 directionA = normalize(vec2(0.86, -0.51));
        vec2 directionB = normalize(vec2(0.67, -0.74));
        vec2 directionC = normalize(vec2(0.96, -0.28));
        float phaseA = dot(p, directionA) * 0.095 + uTime * 0.18;
        float phaseB = dot(p, directionB) * 0.126 + uTime * 0.13;
        float phaseC = dot(p, directionC) * 0.057 + uTime * 0.08;
        float broad = sin(phaseA) * 0.52;
        broad += sin(phaseB) * 0.31;
        broad += sin(phaseC) * 0.17;
        world.y += broad * ${Sr.toFixed(2)};
        vWorldPosition = world.xyz;
        vBroadWaveSlope = (
          directionA * cos(phaseA) * 0.095 * 0.52 +
          directionB * cos(phaseB) * 0.126 * 0.31 +
          directionC * cos(phaseC) * 0.057 * 0.17
        ) * ${Sr.toFixed(2)};
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,fragmentShader:`
      precision highp float;
      varying vec3 vWorldPosition;
      varying vec2 vBroadWaveSlope;
      uniform sampler2D uBackdrop;
      uniform sampler2D uRadianceLut;
      uniform vec3 uDeepColour;
      uniform vec3 uHorizonColour;
      uniform vec3 uSunColour;
      uniform vec3 uSunDirection;
      uniform vec2 uSunOpeningCentre;
      uniform vec3 uSurfaceColour;
      uniform sampler2D uNormalMap;
      uniform float uTime;
      uniform float uUseBackdrop;
      uniform float uUseRadianceLut;
      uniform float uWaterSurfaceY;
      ${Ir}
      ${Lr}

      vec2 oceanRippleSlope(vec2 p) {
        mat2 rotationA = mat2(0.86, -0.51, 0.51, 0.86);
        mat2 rotationB = mat2(0.62, 0.78, -0.78, 0.62);
        vec2 currentDirection = normalize(vec2(0.86, -0.51));
        vec2 sampleA = texture2D(
          uNormalMap,
          p * 0.058 + currentDirection * uTime * 0.014
        ).xy * 2.0 - 1.0;
        vec2 sampleB = texture2D(
          uNormalMap,
          rotationA * p * 0.096 + currentDirection * uTime * 0.016
        ).xy * 2.0 - 1.0;
        vec2 sampleC = texture2D(
          uNormalMap,
          rotationB * p * 0.167 + currentDirection * uTime * 0.019
        ).xy * 2.0 - 1.0;
        vec2 sampleD = texture2D(
          uNormalMap,
          -rotationA * p * 0.271 + currentDirection * uTime * 0.026
        ).xy * 2.0 - 1.0;
        return sampleA * 0.105 + sampleB * 0.080 +
          sampleC * 0.052 + sampleD * 0.033;
      }

      void main() {
        vec2 p = vWorldPosition.xz;
        vec2 rippleSlope = oceanRippleSlope(p);
        vec2 totalSlope = vBroadWaveSlope + rippleSlope;
        vec3 surfaceNormal = normalize(vec3(-totalSlope.x, 1.0, -totalSlope.y));
        vec3 viewToCamera = normalize(cameraPosition - vWorldPosition);
        vec3 rayDirection = -viewToCamera;

        float viewCosine = abs(dot(surfaceNormal, viewToCamera));
        float fresnel = 0.02 + 0.98 * pow(1.0 - viewCosine, 5.0);
        vec3 reflectedDirection = reflect(rayDirection, -surfaceNormal);
        vec3 reflectedWater = oceanFarRadiance(reflectedDirection);

        float sunFacing = max(dot(surfaceNormal, uSunDirection), 0.0);
        float waveFocus = pow(sunFacing, 24.0);
        float broadLight = 0.58 + sunFacing * 0.30;
        vec3 transmittedLight = mix(
          uHorizonColour,
          uSurfaceColour,
          broadLight
        );
        transmittedLight += uSunColour * waveFocus * 0.23;
        float sunOpening = 1.0 - smoothstep(
          6.0,
          34.0,
          length(p - uSunOpeningCentre)
        );
        float openingBreakup = 0.78 + oceanValueNoise(
          p * 0.048 + vec2(uTime * 0.008, -uTime * 0.005)
        ) * 0.22;
        transmittedLight += uSunColour * sunOpening * openingBreakup * 0.24;

        vec3 halfVector = normalize(uSunDirection + viewToCamera);
        float sunGlint = pow(max(dot(surfaceNormal, halfVector), 0.0), 150.0);
        transmittedLight += uSunColour * sunGlint * 0.36;

        vec3 refractedDirection = refract(rayDirection, -surfaceNormal, 1.33);
        float totalInternalReflection =
          1.0 - step(0.001, dot(refractedDirection, refractedDirection));
        float reflectionWeight = clamp(
          fresnel + totalInternalReflection * 0.78,
          0.0,
          1.0
        );
        vec3 surfaceColour = mix(
          transmittedLight,
          reflectedWater,
          reflectionWeight
        );

        float radial = length(p) / 96.0;
        float farBlend = smoothstep(0.62, 0.98, radial);
        float grazingBlend = 1.0 - smoothstep(0.018, 0.16, abs(rayDirection.y));
        vec3 colour = mix(
          surfaceColour,
          oceanFarRadiance(rayDirection),
          max(farBlend, grazingBlend) * 0.98
        );
        gl_FragColor = vec4(colour, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `})}function Hr(){let e=new x;e.name=`ocean-formal-subject-lighting`;let t=new c(`#fff2d8`,`#526d69`,2.35);t.name=`ocean-surface-to-depth-hemisphere`;let n=new F(`#ffe4ae`,4.1);n.name=`ocean-surface-key`,n.position.copy(jr).multiplyScalar(40),n.target.position.set(.8,.8,0),n.castShadow=!1;let r=new F(`#fff0dc`,2.6);return r.name=`ocean-camera-side-fill`,r.position.set(-19,-1.5,18),r.target.position.set(1.2,1.1,0),r.castShadow=!1,e.add(t,n,n.target,r,r.target),{ambient:t,cameraFill:r,group:e,surfaceKey:n}}function K(e){let t=Math.sin(e*12.9898+78.233)*43758.5453;return t-Math.floor(t)}function Ur(e){let t=e===`layered-depth`,n=[],r=[],i=[],a=[],o=[],s=[],c=[],u=[],d=t?320:42;for(let e=0;e<d;e+=1){let l=K(e+71)*Math.PI*2,d=t?2.8*(88/2.8)**K(e+79):13+K(e+79)*70,f=Math.cos(l)*d,p=Math.sin(l)*d,m=sr-2,h=dr(f,p)+2,g=h+K(e+83)*(m-h);n.push(f,g,p),r.push(t?.48+K(e+97)*1.15:1.5+K(e+97)*2.6),i.push(t?.025+K(e+113)*.055:.22+K(e+113)*.34),a.push(0),o.push(0),s.push(0),c.push(K(e+127)),u.push(0)}let f=t?60:48;for(let e=0;e<f;e+=1){let l=e+401,d,f;if(t){let t=e%3,n=K(l)*Math.PI*2,r=Math.sqrt(K(l+17)),i=t===0?-8:t===1?1.5:0,a=t===0?6:t===1?1:38,o=t===0?13:t===1?11:25,s=t===0?11:t===1?9:30;d=i+Math.cos(n)*r*o,f=a+Math.sin(n)*r*s}else{let e=K(l)*Math.PI*2,t=8+K(l+17)**.72*72;d=Math.cos(e)*t,f=Math.sin(e)*t}let p=dr(d,f)+3+K(l+23)*8,m=sr-1.5;n.push(d,p,f),r.push((t?4:3.2)+K(l+31)*(t?4.6:4.8)),i.push((t?.28:.3)+K(l+43)*(t?.22:.28)),a.push(1),o.push(Math.max(1,m-p)),s.push(.38+K(l+59)*.74),c.push(K(l+67)),u.push(.12+K(l+71)*.34)}let p=new M;p.setAttribute(`position`,new B(new Float32Array(n),3)),p.setAttribute(`aSize`,new B(new Float32Array(r),1)),p.setAttribute(`aOpacity`,new B(new Float32Array(i),1)),p.setAttribute(`aKind`,new B(new Float32Array(a),1)),p.setAttribute(`aRiseSpan`,new B(new Float32Array(o),1)),p.setAttribute(`aSpeed`,new B(new Float32Array(s),1)),p.setAttribute(`aPhase`,new B(new Float32Array(c),1)),p.setAttribute(`aDrift`,new B(new Float32Array(u),1)),p.computeBoundingBox(),p.computeBoundingSphere();let m=new S(p,new l({blending:t?1:2,depthWrite:!1,toneMapped:!0,transparent:!0,uniforms:{uColour:{value:new P(t?`#c4e5ed`:`#d8fff0`)},uCurrentDirection:{value:wr.clone()},uTime:{value:0}},vertexShader:`
      attribute float aSize;
      attribute float aOpacity;
      attribute float aKind;
      attribute float aRiseSpan;
      attribute float aSpeed;
      attribute float aPhase;
      attribute float aDrift;
      varying float vOpacity;
      varying float vKind;
      uniform vec2 uCurrentDirection;
      uniform float uTime;
      void main() {
        vec3 animatedPosition = position;
        float currentSpeed = mix(
          ${Er.toFixed(3)},
          ${Dr.toFixed(3)},
          aKind
        );
        float currentTravel = mod(
          aPhase * ${Tr.toFixed(1)} +
            uTime * currentSpeed,
          ${Tr.toFixed(1)}
        ) - ${(Tr/2).toFixed(1)};
        animatedPosition.xz += uCurrentDirection * currentTravel;
        if (aKind > 0.5) {
          animatedPosition.y += mod(
            aPhase * aRiseSpan + uTime * aSpeed,
            max(aRiseSpan, 0.001)
          );
          float driftPhase = aPhase * 6.2831853 + uTime * 0.38;
          animatedPosition.x += sin(driftPhase) * aDrift;
          animatedPosition.z += cos(driftPhase * 0.83) * aDrift * 0.72;
        }
        vec4 viewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
        vOpacity = aOpacity;
        vKind = aKind;
        float sizeScale = mix(120.0, 162.0, aKind);
        float maximumSize = mix(${t?`3.2`:`4.2`}, 12.0, aKind);
        gl_PointSize = clamp(
          aSize * (sizeScale / max(8.0, -viewPosition.z)),
          mix(1.1, 2.8, aKind),
          maximumSize
        );
        gl_Position = projectionMatrix * viewPosition;
      }
    `,fragmentShader:`
      precision highp float;
      uniform vec3 uColour;
      varying float vOpacity;
      varying float vKind;
      void main() {
        float radius = length(gl_PointCoord - vec2(0.5));
        float moteAlpha = 1.0 - smoothstep(0.12, 0.5, radius);
        float bubbleOuter = 1.0 - smoothstep(0.39, 0.5, radius);
        float bubbleInner = 1.0 - smoothstep(0.27, 0.39, radius);
        float bubbleRing = max(0.0, bubbleOuter - bubbleInner);
        float bubbleHighlight = 1.0 - smoothstep(
          0.035,
          0.13,
          length(gl_PointCoord - vec2(0.34, 0.32))
        );
        float bubbleAlpha = bubbleRing * 0.78 + bubbleHighlight * 0.34;
        float alpha = mix(moteAlpha, bubbleAlpha, vKind) * vOpacity;
        if (alpha < 0.01) discard;
        vec3 bubbleColour = mix(uColour, vec3(1.0, 0.97, 0.88), 0.42);
        gl_FragColor = vec4(mix(uColour, bubbleColour, vKind), alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `}));return m.name=t?`ocean-layered-depth-particulate`:`ocean-suspended-particulate-and-rising-bubbles`,m.userData.risingBubbleCount=f,m.userData.suspendedParticulateCount=d,m.userData.currentDirectionXZ=wr.toArray(),m.userData.currentSpeedMetersPerSecond={bubbles:Dr,motes:Er},m.userData.currentWrapMeters=Tr,m.userData.bubbleDistribution=t?`guided-observation-corridors`:`broad-radial`,m.frustumCulled=!1,m.renderOrder=2,m}function Wr(e){return Array.isArray(e.material)?e.material:[e.material]}function Gr(e){return e instanceof b||e instanceof S||e instanceof E}function Kr(e){let t=e;for(;t;){if(!t.visible)return!1;t=t.parent}return!0}function qr(e){return e.index?e.index.count/3:(e.getAttribute(`position`)?.count??0)/3}function Jr(e,t){let n=new Set,r=new Set,i=new Set,o=0,s=0,c=0,u=0,d=0,f=0;e.traverse(e=>{if(!Kr(e)||(d+=1,!Gr(e)))return;o+=1;let t=Wr(e);t.some(e=>e.transparent)?c+=1:s+=1,n.add(e.geometry),t.forEach(e=>{r.add(e);for(let t of Object.values(e))t instanceof N&&i.add(t);if(e instanceof l)for(let t of Object.values(e.uniforms))t.value instanceof N&&i.add(t.value)});let a=e instanceof E?e.count:1;u+=a,f+=qr(e.geometry)*a});let p=[...i].filter(e=>e instanceof a).reduce((e,t)=>{let n=t.image,r=t.type===1016?2:1,i=t.generateMipmaps?4/3:1;return e+(n.width??0)*(n.height??0)*4*r*i},0);return{drawCalls:o,estimatedDecodedTextureBytes:Math.round(t+p),geometries:n.size,instances:u,materials:r.size,objects:d,opaqueDrawCalls:s,textures:i.size,transparentDrawCalls:c,transparentMaterialCount:[...r].filter(e=>e.transparent).length,transparentScreenCoverageEstimate:c===0?0:.009,triangles:Math.round(f)}}function Yr(){let e=[];for(let t=0;t<96;t+=1){let n=t/96*Math.PI*2,r=Math.cos(n)*96,i=Math.sin(n)*96;e.push(r,dr(r,i)+.05,i)}let t=new M;t.setAttribute(`position`,new B(new Float32Array(e),3));let n=new ce(t,new A({color:`#ffb95c`}));return n.name=`ocean-debug-seabed-boundary`,n}function Xr(e,t){let n=new Set,r=new Set,i=new Set;e.traverse(e=>{if(!Gr(e)&&!(e instanceof ce)&&!(e instanceof ee))return;let a=e.geometry;a&&n.add(a);let o=e.material,s=Array.isArray(o)?o:[o];for(let e of s)if(e){r.add(e);for(let n of Object.values(e))n instanceof N&&!t.has(n)&&i.add(n);if(e instanceof l)for(let n of Object.values(e.uniforms))n.value instanceof N&&!t.has(n.value)&&i.add(n.value)}}),i.forEach(e=>{e instanceof N&&e.dispose()}),r.forEach(e=>e.dispose()),n.forEach(e=>e.dispose()),e.removeFromParent(),e.clear()}function Zr(e){let t=new x;t.name=`scale-encounter-ocean-candidate`;let n=Object.fromEntries(_r.map(e=>{let n=new x;return n.name=`ocean-layer-${e}`,t.add(n),[e,n]})),r=e.backdropTexture??null;r&&(r.texture.colorSpace=u,r.texture.generateMipmaps=!0,r.texture.minFilter=I,r.texture.magFilter=j,r.texture.needsUpdate=!0);let i=Fr(),a=zr(r,i),o=new b(new D(180,32,16),a);o.name=`ocean-background-approved-exhibit-reference`,o.frustumCulled=!1,o.renderOrder=-100,n[`background-scatter`].add(o);let s=Vr(r,Br(),i),c=new b(new U(192,192,64,64),s);c.name=`ocean-world-water-surface`,c.position.y=sr,c.rotation.x=-Math.PI/2,c.renderOrder=-5,n[`water-surface`].add(c);let l=new x;l.name=`ocean-world-water-volume-contract`,l.userData.oceanWaterVolumeBounds=ur.clone(),n[`water-volume`].add(l);let d=new Set;r&&d.add(r.texture),n.seabed.userData.oceanInvisibleBoundaryOnly=!0;let f=[],{ambient:p,cameraFill:h,group:g,surfaceKey:_}=Hr(),v=new L;t.add(g),n[`mid-water`].userData.worldSpaceSingleScattering=!0,n.caustics.userData.surfaceNormalFocusedTransmission=!0,n[`near-water`].userData.corridorSafeSparseMotes=!0,n[`far-volume`].userData.openWaterFogAndBackdrop=!0;let y=Ur(`baseline`),S=Ur(`layered-depth`);n[`suspended-particulate`].add(y,S);let C=e.approvedEcologyClues??[];for(let e of C)e.status===`approved-for-ocean-slice`&&(e.object.name||=`ocean-approved-ecology-${e.id}`,n[`ecology-clues`].add(e.object));let w=new x;w.name=`ocean-review-debug-boundaries`;let T=new ee(ur,`#68f3e8`);T.name=`ocean-debug-water-volume`;let E=Yr();w.add(T,E),t.add(w);let O=new x;O.name=`ocean-review-debug-observation-corridor`,w.add(O);let k=new Map,A=e.variant,M=null,te=null,N=e.debug??!1,P=()=>{let e=vr[A];for(let t of _r){let r=k.get(t)??e.has(t);n[t].visible=t===`seabed`?!1:t===`ecology-clues`?r&&n[t].children.length>0:r}let t=A===`D`;a.uniforms.uUseRadianceLut.value=+!!t,s.uniforms.uUseRadianceLut.value=+!!t,y.visible=!t,S.visible=t,p.intensity=t?1.82:2.35,_.intensity=t?3.45:4.1,w.visible=N,M&&(te=gr(M,f.filter(({layer:e})=>n[e].visible),!1))},ne=e=>{Xr(O,d),O=new x,O.name=`ocean-review-debug-observation-corridor`,O.add(new ee(e.animalBounds.clone(),`#ffca68`),new ee(e.avatarBounds.clone(),`#ff7ca8`),...e.cameraSamples.map(({label:e,position:t})=>{let n=new ee(new z().setFromCenterAndSize(t,new L(.5,.5,.5)),`#fff19a`);return n.name=`ocean-debug-camera-${e}`,n})),w.add(O)},re=()=>Object.fromEntries(_r.map(e=>[e,n[e].visible]));return P(),{radianceTexture:i,root:t,toneMapping:4,dispose:()=>Xr(t,d),getDiagnostics:()=>{let e=re(),n=Jr(t,(r?.decodedByteEstimate??0)+0);return{alpha:{cardCount:0,depthWriteDisabledDraws:(()=>{let e=0;return t.traverse(t=>{!Kr(t)||!Gr(t)||Wr(t).some(e=>!e.depthWrite)&&(e+=1)}),e})(),repeatedCardGroups:0},approvedEcologyAssetIds:C.map(({id:e})=>e),browserIndependentDesignChecks:{colourDiscontinuityBands:0,ecologyFallbackReason:C.length===0?`No ocean ecology asset is approved in the supplied manifest; C keeps the ecology layer empty.`:null,repeatedFarCards:0},fogDensity:0,fogFar:A===`A`||A===`D`||!e[`water-volume`]?null:Ar[A],fogModel:A===`A`||A===`D`||!e[`water-volume`]?`none`:`linear-depth`,fogNear:A===`A`||A===`D`||!e[`water-volume`]?null:kr[A],layers:e,naturalnessRevision:A===`D`?xr:br,resources:n,spatial:te,variant:A,world:{metresPerUnit:1,toneMapping:`ACESFilmicToneMapping`,upAxis:`+Y`,waterSurfaceY:sr,waterSurfaceDisplacementMeters:Sr}}},getFog:()=>A===`A`||A===`D`||!n[`water-volume`].visible?null:new pe(Or,kr[A],Ar[A]),setDebugVisible:e=>{N=e,P()},setLayerEnabled:(e,t)=>{k.set(e,t),P()},setObservationContext:e=>{M=e,ne(e),P()},setVariant:e=>{A=e,k.clear(),P()},update:(e,t)=>{if(o.position.copy(t.position),t instanceof m){let e=Math.max(0,Math.min(1,(48-t.fov)/19));h.position.copy(t.position),v.set(0,0,-1).applyQuaternion(t.quaternion).normalize(),h.target.position.copy(t.position).addScaledVector(v,20),h.intensity=A===`D`?3.05-e*1.12:4.25-e*1.65}a.uniforms.uTime.value=e,s.uniforms.uTime.value=e,y.material.uniforms.uTime.value=e,S.material.uniforms.uTime.value=e,_.intensity=(A===`D`?3.38:4.02)+Math.sin(e*.29)*.12+Math.sin(e*.47+1.3)*.065}}}var Qr=`sky-prototype-flight-approximation-v1`,$r=`Rigid whole-Avatar posture approximation for prototype wingspan composition only; it is not a final flight pose or animation and must not be baked into the GLB or Avatar Runtime.`,ei=new L(0,1,0),ti=new T;function ni(e){return[ri(e.x),ri(e.y),ri(e.z)]}function ri(e,t=9){let n=10**t;return Math.round(e*n)/n}function ii(e,t){let n=new L().copy(t);if(!Number.isFinite(n.lengthSq())||n.lengthSq()<1e-8)throw Error(`sky-prototype-flight-direction-invalid`);n.normalize(),e.updateMatrixWorld(!0);let r=new z().setFromObject(e,!0);if(r.isEmpty())throw Error(`sky-prototype-flight-avatar-bounds-empty`);let i=r.getCenter(new L),a=new T().setFromUnitVectors(ei,n),o=new x;o.name=`prototype-flight-approximation-carrier`;let s=new x;s.name=`prototype-flight-approximation-bounds-centre-pivot`,s.position.copy(i),s.quaternion.copy(a),o.add(s),s.add(e),e.position.copy(i).multiplyScalar(-1),o.updateMatrixWorld(!0);let c=!0;return{carrier:o,flightDirection:n,pivotLocal:i,rotationQuaternion:a,sourceBoundsAtPivotCapture:r,getSnapshot:()=>{o.updateMatrixWorld(!0);let e=new h().setFromQuaternion(a,`XYZ`),t=r.clone().translate(o.position),l=s.getWorldPosition(new L),u=new z().setFromObject(o,!0);return{approximatedBodyAxisWorld:ni(ei.clone().applyQuaternion(a).normalize()),enabled:c,flightDirectionWorld:ni(n),limitation:$r,modelTransformBaked:!1,pivotLocal:ni(i),pivotPolicy:`rendered-source-bounds-centre-before-rigid-rotation`,pivotWorld:ni(l),poseSemantics:`prototype-rigid-body-approximation`,revision:Qr,rotationEulerDegrees:{order:`XYZ`,x:ri(H.radToDeg(e.x),6),y:ri(H.radToDeg(e.y),6),z:ri(H.radToDeg(e.z),6)},rotationQuaternion:{w:ri(a.w),x:ri(a.x),y:ri(a.y),z:ri(a.z)},sourceAnimationReclassified:!1,sourceBoundsAtCurrentPlacement:t,sourceBoundsAtPivotCapture:r.clone(),standingBodyAxisWorld:[0,1,0],transformedDynamicBounds:u}},setEnabled:e=>{c=e,s.quaternion.copy(e?a:ti),o.updateMatrixWorld(!0)}}}function ai(e,t,n=!0){let r=ii(e.root,t);r.setEnabled(n);let i=r.getSnapshot();r.carrier.userData.scaleEncounterPrototypeFlightApproximation={enabled:n,flightDirectionWorld:i.flightDirectionWorld,limitation:i.limitation,modelTransformBaked:!1,pivotPolicy:i.pivotPolicy,poseSemantics:i.poseSemantics,revision:i.revision,sourceAnimationReclassified:!1};let a=()=>{let t=e.root.userData,n=r.carrier.userData;for(let e of[`scaleEncounterAvatarActiveClip`,`scaleEncounterAvatarMotion`,`scaleEncounterAvatarTravelSpeed`])t[e]===void 0?delete n[e]:n[e]=t[e]};a();let o=e.dispose?()=>{r.setEnabled(!1),e.dispose?.(),r.carrier.clear()}:void 0;return{...o?{dispose:o}:{},bodyOrientation:`prone`,eyeAnchor:e.eyeAnchor,root:r.carrier,visual:e.visual,...e.leftArm?{leftArm:e.leftArm}:{},...e.rightArm?{rightArm:e.rightArm}:{},...e.torso?{torso:e.torso}:{},...e.baseLeftArmRotationX===void 0?{}:{baseLeftArmRotationX:e.baseLeftArmRotationX},...e.baseRightArmRotationX===void 0?{}:{baseRightArmRotationX:e.baseRightArmRotationX},...e.setMotionState?{setMotionState:t=>{e.setMotionState?.(t),a()}}:{},...e.updateIdle?{updateIdle:(t,n)=>{e.updateIdle?.(t,n),a()}}:{}}}var oi=Array.from({length:8},()=>new L),si=new L,ci=new L,li=new V;function ui(e){let t=0;for(let n of[e.min.x,e.max.x])for(let r of[e.min.y,e.max.y])for(let i of[e.min.z,e.max.z])oi[t]?.set(n,r,i),t+=1;return oi}function q(e,t=6){let n=10**t;return Math.round(e*n)/n}function di(e){return{x:q(e.x),y:q(e.y),z:q(e.z)}}function fi(e){return{minimum:di(e.min),maximum:di(e.max)}}function pi(e){return e.updateMatrixWorld(!0),new z().setFromObject(e,!0)}function mi(e,t,n,r){t.updateMatrixWorld(!0),li.copy(t.matrixWorldInverse);let i=1/0,a=1/0,o=-1/0,s=-1/0,c=0;for(let n of ui(e))si.copy(n).applyMatrix4(li),!(si.z>-t.near)&&(c+=1,ci.copy(n).project(t),i=Math.min(i,ci.x),o=Math.max(o,ci.x),a=Math.min(a,ci.y),s=Math.max(s,ci.y));if(c===0)return{areaFraction:0,heightPixels:0,maximumX:0,maximumY:0,minimumX:0,minimumY:0,visible:!1,widthPixels:0};let l=Math.max(-1,i),u=Math.min(1,o),d=Math.max(-1,a),f=Math.min(1,s),p=Math.max(0,u-l),m=Math.max(0,f-d),h=p/2*n,g=m/2*r;return{areaFraction:p*m/4,heightPixels:q(g,3),maximumX:q(u),maximumY:q(f),minimumX:q(l),minimumY:q(d),visible:p>0&&m>0,widthPixels:q(h,3)}}function hi(e,t){return!e.visible||!t.visible||e.areaFraction<=0?0:q(Math.max(0,Math.min(e.maximumX,t.maximumX)-Math.max(e.minimumX,t.minimumX))*Math.max(0,Math.min(e.maximumY,t.maximumY)-Math.max(e.minimumY,t.minimumY))/(e.areaFraction*4),8)}function gi(e,t,n,r=40){let i=new Uint16Array(r*r),a=0;for(let o of e){if(!o.visible)continue;a+=o.areaFraction*t*n;let e=Math.max(0,Math.floor((o.minimumX+1)/2*r)),s=Math.min(r-1,Math.ceil((o.maximumX+1)/2*r)-1),c=Math.max(0,Math.floor((o.minimumY+1)/2*r)),l=Math.min(r-1,Math.ceil((o.maximumY+1)/2*r)-1);for(let t=c;t<=l;t+=1)for(let n=e;n<=s;n+=1){let e=t*r+n;i[e]=(i[e]??0)+1}}let o=0,s=0,c=0;for(let e of i)e!==0&&(o+=1,s+=e,c=Math.max(c,e));return{coveredPixelContributions:Math.round(a),maximumLayerCount:c,meanLayerCountWhereCovered:o===0?0:q(s/o,4),viewportCoverageFraction:q(o/Math.max(i.length,1),6)}}function _i(e,t,n,r,i,a,o=[]){let s=[n,...o].map(e=>mi(e,r,i,a));return e.map(({id:e,layer:n,object:o})=>{let c=pi(o),l=mi(c,r,i,a);return{altitudeMaximumMeters:q(Oe(c.max.y),3),altitudeMinimumMeters:q(Oe(c.min.y),3),bandId:n,corridorOverlap:c.intersectsBox(t),id:e,projectedAreaPixels:Math.round(l.areaFraction*i*a),projectedHeightPixels:l.heightPixels,projectedWidthPixels:l.widthPixels,subjectOcclusionFraction:Math.max(0,...s.map(e=>hi(e,l))),worldBounds:fi(c)}})}function vi(e){return e.array.byteLength}function yi(e){let t=new Set(e),n=0,r=0;for(let e of t){e.index&&(n+=e.index.array.byteLength);for(let t of Object.values(e.attributes))r+=vi(t);for(let t of Object.values(e.morphAttributes))for(let e of t??[])r+=vi(e)}return{geometryBytes:n+r,geometryCount:t.size,indexBytes:n,vertexAttributeBytes:r}}var bi=64;bi**3*2;function xi(e){let t=e>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}function Si(e=crypto.getRandomValues(new Uint32Array(1))[0]){let t=xi(e);return Array.from({length:32},(e,n)=>{let r=n>=12,i=r?40+t()*70:n<3?12+t()*12:n<9?30+t()*24:64+t()*28,a,o;do a=(t()-.5)*(r?1240:340),o=(t()-.5)*(r?1240:320);while(Math.hypot(a,o)<(r?260:65)||r&&Math.hypot(a,o)>620);return{position:[a,r?-34+t()*10:-37+t()*12,o],size:[i,Math.min(r?20:25,i*(.28+t()*.28)),i*(.52+t()*.46)],distant:r,yaw:t()*Math.PI*2,seed:Math.floor(t()*4294967296),speed:.018+t()*.022}})}function Ci(e,t=bi){let n=xi(e),r=Array.from({length:8},()=>({x:(n()-.5)*.43,y:(n()-.5)*.36,z:(n()-.5)*.42,rx:.13+n()*.17,ry:.15+n()*.19,rz:.13+n()*.18})),i=Float32Array.from({length:17**3},()=>n()),a=e=>e*e*(3-2*e),o=(e,t,n)=>{let r=Math.floor(e),o=Math.floor(t),s=Math.floor(n),c=a(e-r),l=a(t-o),u=a(n-s),d=0;for(let e=0;e<2;e++)for(let t=0;t<2;t++)for(let n=0;n<2;n++)d+=i[r+n+(o+t)*17+(s+e)*289]*(n?c:1-c)*(t?l:1-l)*(e?u:1-u);return d},s=new Uint8Array(t**3);for(let e=0;e<t;e++)for(let n=0;n<t;n++)for(let i=0;i<t;i++){let c=i/(t-1)-.5,l=n/(t-1)-.5,u=e/(t-1)-.5,d=-1;for(let e of r)d=Math.max(d,1-((c-e.x)/e.rx)**2-((l-e.y)/e.ry)**2-((u-e.z)/e.rz)**2);let f=o((c+.5)*7.9,(l+.5)*7.9,(u+.5)*7.9)*.65+o((c+.5)*15.9,(l+.5)*15.9,(u+.5)*15.9)*.35,p=Math.max(0,Math.min(1,(d+(f-.5)*1.5)*1.8)),m=Math.max(0,Math.min(1,(.49-Math.max(Math.abs(c),Math.abs(l),Math.abs(u)))/.08));s[i+n*t+e*t**2]=Math.round(a(p)*a(m)*255)}let c=new Uint8Array(t**3*2);for(let e=0;e<t;e++)for(let n=0;n<t;n++)for(let r=0;r<t;r++){let i=r+n*t+e*t**2,a=0;for(let i=1;i<=6;i++){let o=r-i*2,c=n+i*3,l=e-i;if(o<0||c>=t||l<0)break;a+=s[o+c*t+l*t**2]/255}c[i*2]=s[i],c[i*2+1]=Math.round((.26+Math.exp(-a*.72)*.74)*255)}let l=new fe(c,t,t,t);return l.format=ie,l.minFilter=l.magFilter=j,l.unpackAlignment=1,l.needsUpdate=!0,l}function wi(e,t,n=28){let r=Ci(e.seed,e.distant?32:64),i=new L,a=new l({transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:1,uniforms:{uDensity:{value:r},uEye:{value:i},uSteps:{value:e.distant?Math.min(20,n):n},uOverdrawDiagnostic:{value:0}},vertexShader:`varying vec3 vLocal; void main() {
      vLocal = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }`,fragmentShader:`
      precision highp sampler3D;
      uniform sampler3D uDensity;
      uniform vec3 uEye;
      uniform float uSteps, uOverdrawDiagnostic;
      varying vec3 vLocal;
      void main() {
        vec3 ray = normalize(vLocal - uEye);
        vec3 safeRay = mix(vec3(.00001), ray, step(vec3(.00001), abs(ray)));
        vec3 a = (-.5 - uEye) / safeRay, b = (.5 - uEye) / safeRay;
        vec3 lo = min(a,b), hi = max(a,b);
        float enter = max(0., max(lo.x, max(lo.y,lo.z)));
        float leave = min(hi.x,min(hi.y,hi.z));
        if (leave <= enter) discard;
        float dt = (leave - enter) / uSteps;
        vec3 colour = vec3(0.); float alpha = 0.;
        for (int i=0; i<32; i++) {
          if (float(i) >= uSteps || alpha > .97) break;
          vec3 uv = uEye + ray * (enter + (float(i) + .5) * dt) + .5;
          vec2 volume = texture(uDensity, uv).rg;
          float d = volume.r;
          float opacity = 1. - exp(-d * dt * 12.);
          float light = volume.g;
          vec3 sampleColour = mix(vec3(.34,.48,.60), vec3(1.,.99,.97), light);
          colour += (1.-alpha) * opacity * sampleColour;
          alpha += (1.-alpha) * opacity;
        }
        if (alpha < .008) discard;
        colour = mix(colour / max(alpha,.001), vec3(1.,.18,.02),uOverdrawDiagnostic);
        gl_FragColor = vec4(colour, alpha * .88);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb *= gl_FragColor.a;
      }
    `}),o=new b(new oe(1,1,1),a);o.name=`sky-volume-cloud-${t}`,o.position.set(...e.position),o.scale.set(...e.size),o.rotation.y=e.yaw;let s=new L;return{id:o.name,layer:`far-cloud`,object:o,material:a,density:r,update:(t,n)=>{o.position.set(e.position[0]+t*e.speed,e.position[1],e.position[2]+t*e.speed*.24),o.updateWorldMatrix(!0,!1),n.getWorldPosition(s),i.copy(o.worldToLocal(s))}}}var Ti=new L(-.42,.78,-.46).normalize(),Ei=850;function Di(e){return Math.min(1,Math.max(0,e))}function Oi(e,t,n){let r=Di((n-e)/(t-e));return r*r*(3-2*r)}function ki(e,t,n){return e+(t-e)*n}function Ai(){let e=new Uint16Array(512*256*4),t=new L,n=[.56,.76,.84],i=[.075,.3,.55],o=[1,.77,.48];for(let a=0;a<256;a+=1){let s=((a+.5)/256-.5)*Math.PI,c=Math.sin(s),l=Math.cos(s),u=Oi(.22,.96,Di(c*.5+.5)),d=1-Oi(0,.22,Math.abs(c));for(let s=0;s<512;s+=1){let f=((s+.5)/512-.5)*Math.PI*2;t.set(Math.cos(f)*l,c,Math.sin(f)*l);let p=[ki(n[0],i[0],u)+.055*d,ki(n[1],i[1],u)+.042*d,ki(n[2],i[2],u)+.025*d],m=0+Oi(.99994,.999985,Math.max(0,t.dot(Ti)))*.42,h=(a*512+s)*4;e[h]=r.toHalfFloat(p[0]+o[0]*m),e[h+1]=r.toHalfFloat(p[1]+o[1]*m),e[h+2]=r.toHalfFloat(p[2]+o[2]*m),e[h+3]=r.toHalfFloat(1)}}let s=new a(e,512,256,y,C);return s.name=`sky-coherent-radiance-linear-hdr-v3`,s.colorSpace=te,s.wrapS=d,s.minFilter=j,s.magFilter=j,s.generateMipmaps=!1,s.needsUpdate=!0,s}var ji=`
  varying vec3 vDirection;

  void main() {
    vDirection = normalize(position);
    vec4 clipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = clipPosition.xyww;
  }
`,Mi=`
  uniform sampler2D uSkyRadiance;
  uniform vec3 uSunDirection;
  uniform float uDarkDiagnostic;
  uniform float uUseSkyRadiance;
  varying vec3 vDirection;

  vec2 skyDirectionToEquirectUv(vec3 direction) {
    direction = normalize(direction);
    return vec2(
      atan(direction.z, direction.x) * 0.15915494309189535 + 0.5,
      asin(clamp(direction.y, -1.0, 1.0)) * 0.3183098861837907 + 0.5
    );
  }

  float hash31(vec3 point) {
    point = fract(point * 0.1031);
    point += dot(point, point.yzx + 33.33);
    return fract((point.x + point.y) * point.z);
  }

  float valueNoise(vec3 point) {
    vec3 cell = floor(point);
    vec3 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float n000 = hash31(cell + vec3(0.0, 0.0, 0.0));
    float n100 = hash31(cell + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(cell + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(cell + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(cell + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(cell + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(cell + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(cell + vec3(1.0, 1.0, 1.0));
    float lower = mix(mix(n000, n100, local.x), mix(n010, n110, local.x), local.y);
    float upper = mix(mix(n001, n101, local.x), mix(n011, n111, local.x), local.y);
    return mix(lower, upper, local.z);
  }

  float fBm(vec3 point) {
    float value = 0.0;
    float amplitude = 0.56;
    mat3 rotation = mat3(
      0.00, 0.80, 0.60,
      -0.80, 0.36, -0.48,
      -0.60, -0.48, 0.64
    );
    for (int octave = 0; octave < 4; octave += 1) {
      value += valueNoise(point) * amplitude;
      point = rotation * point * 2.03 + vec3(7.3, 2.1, 4.7);
      amplitude *= 0.49;
    }
    return value;
  }

  void main() {
    vec3 direction = normalize(vDirection);
    if (uUseSkyRadiance > 0.5) {
      vec3 cachedSky = texture2D(
        uSkyRadiance,
        skyDirectionToEquirectUv(direction)
      ).rgb;
      // Keep the accepted C cloud coverage in D, but evaluate it directly
      // from the view direction. Baking this field into the equirectangular
      // radiance LUT created vertically stretched streaks on mobile GPUs.
      vec3 cloudSample = direction * vec3(4.2, 9.5, 4.2) + vec3(1.7, 4.1, -2.8);
      float cloudField = fBm(cloudSample);
      float cloudDetail = fBm(cloudSample * 1.83 + vec3(-3.0, 5.0, 1.0));
      float cloudMask = smoothstep(0.52, 0.69, cloudField * 0.72 + cloudDetail * 0.28);
      float cloudBand = smoothstep(0.02, 0.14, direction.y) *
        (1.0 - smoothstep(0.46, 0.72, direction.y));
      float backgroundCloud = 0.0;
      cachedSky = mix(cachedSky, vec3(0.88, 0.94, 0.965), backgroundCloud);
      // Evaluate the small solar aureole analytically in direction space.
      // This stays round at any resolution instead of stretching a LUT texel.
      float solarDot = max(dot(direction, normalize(uSunDirection)), 0.0);
      cachedSky += vec3(1.0, .83, .58) * pow(solarDot, 220.0) * .11;
      cachedSky = mix(cachedSky, vec3(1.0, .97, .85), smoothstep(.99980, .99996, solarDot) * .78);
      float cachedHeight = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);
      vec3 diagnosticColour = mix(
        vec3(0.018, 0.028, 0.052),
        vec3(0.075, 0.105, 0.14),
        cachedHeight
      );
      gl_FragColor = vec4(
        mix(cachedSky, diagnosticColour, uDarkDiagnostic),
        1.0
      );
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      return;
    }
    float height = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);
    float zenith = smoothstep(0.22, 0.96, height);
    vec3 horizonColour = vec3(0.56, 0.76, 0.84);
    vec3 upperColour = vec3(0.075, 0.30, 0.55);
    vec3 skyColour = mix(horizonColour, upperColour, zenith);
    float horizonGlow = 1.0 - smoothstep(0.0, 0.22, abs(direction.y));
    skyColour += vec3(0.055, 0.042, 0.025) * horizonGlow;

    vec3 cloudSample = direction * vec3(4.2, 9.5, 4.2) + vec3(1.7, 4.1, -2.8);
    float cloudField = fBm(cloudSample);
    float cloudDetail = fBm(cloudSample * 1.83 + vec3(-3.0, 5.0, 1.0));
    float cloudMask = smoothstep(0.52, 0.69, cloudField * 0.72 + cloudDetail * 0.28);
    float cloudBand = smoothstep(0.02, 0.14, direction.y) *
      (1.0 - smoothstep(0.46, 0.72, direction.y));
    float backgroundCloud = 0.0;
    skyColour = mix(skyColour, vec3(0.88, 0.94, 0.965), backgroundCloud);

    float sunDot = max(dot(direction, normalize(uSunDirection)), 0.0);
    float sunHalo = pow(sunDot, 90.0) * 0.15;
    float sunDisc = smoothstep(0.99955, 0.99986, sunDot);
    skyColour += vec3(1.0, 0.77, 0.48) * sunHalo;
    skyColour = mix(skyColour, vec3(1.0, 0.94, 0.76), sunDisc * 0.68);

    vec3 diagnosticColour = mix(
      vec3(0.018, 0.028, 0.052),
      vec3(0.075, 0.105, 0.14),
      height
    );
    gl_FragColor = vec4(mix(skyColour, diagnosticColour, uDarkDiagnostic), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,Ni=`
  varying vec3 vWorldPosition;

  void main() {
    // A fixed sea elevation keeps shorelines and the atmospheric horizon
    // stable. Fine surface movement is confined to fragment normals.
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`,Pi=`
  uniform vec3 uCameraPosition;
  uniform sampler2D uSkyRadiance;
  uniform vec3 uSunDirection;
  uniform float uTime;
  uniform float uUseSkyRadiance;
  varying vec3 vWorldPosition;

  vec2 seaDirectionToEquirectUv(vec3 direction) {
    direction = normalize(direction);
    return vec2(
      atan(direction.z, direction.x) * 0.15915494309189535 + 0.5,
      asin(clamp(direction.y, -1.0, 1.0)) * 0.3183098861837907 + 0.5
    );
  }

  vec3 skyColourBehindSea(vec3 direction) {
    direction = normalize(direction);
    if (uUseSkyRadiance > 0.5) {
      return texture2D(
        uSkyRadiance,
        seaDirectionToEquirectUv(direction)
      ).rgb;
    }
    float height = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);
    float zenith = smoothstep(0.22, 0.96, height);
    vec3 horizonColour = vec3(0.56, 0.76, 0.84);
    vec3 upperColour = vec3(0.075, 0.30, 0.55);
    vec3 colour = mix(horizonColour, upperColour, zenith);
    float horizonGlow = 1.0 - smoothstep(0.0, 0.22, abs(direction.y));
    colour += vec3(0.055, 0.042, 0.025) * horizonGlow;
    float sunDot = max(dot(direction, normalize(uSunDirection)), 0.0);
    float sunHalo = pow(sunDot, 90.0) * 0.15;
    float sunDisc = smoothstep(0.99955, 0.99986, sunDot);
    colour += vec3(1.0, 0.77, 0.48) * sunHalo;
    return mix(colour, vec3(1.0, 0.94, 0.76), sunDisc * 0.68);
  }

  float seaNoise(vec2 point) {
    vec2 cell = floor(point), blend = fract(point);
    blend = blend * blend * (3.0 - 2.0 * blend);
    vec4 corners = vec4(
      dot(cell, vec2(127.1, 311.7)),
      dot(cell + vec2(1., 0.), vec2(127.1, 311.7)),
      dot(cell + vec2(0., 1.), vec2(127.1, 311.7)),
      dot(cell + vec2(1., 1.), vec2(127.1, 311.7))
    );
    vec4 values = fract(sin(corners) * 43758.5453);
    return mix(mix(values.x, values.y, blend.x), mix(values.z, values.w, blend.x), blend.y);
  }

  void main() {
    // At flight altitude, broad periodic white crests read as repeated cloud
    // ribbons. Keep only faint, irregular ripples in the reflected light.
    vec2 point = vWorldPosition.xz * .18 + vec2(uTime * .014, -uTime * .009);
    vec3 normal = normalize(vec3(
      (seaNoise(point) - .5) * .008,
      1.0,
      (seaNoise(point + vec2(37.2, -19.4)) - .5) * .008
    ));
    vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.2);
    vec3 openWater = vec3(0.038, 0.28, 0.41);
    vec3 skyReflection = vec3(0.31, 0.57, 0.69);
    if (uUseSkyRadiance > 0.5) {
      vec3 reflectedDirection = reflect(-viewDirection, normal);
      skyReflection = texture2D(
        uSkyRadiance,
        seaDirectionToEquirectUv(reflectedDirection)
      ).rgb;
    }
    // Keep enough blue-green body colour beneath the reflected sky for the
    // sea to read as a plane rather than a continuation of the atmosphere.
    vec3 colour = mix(openWater, skyReflection, fresnel * 0.58);
    vec3 reflectedSun = reflect(-normalize(uSunDirection), normal);
    float glint = pow(max(dot(reflectedSun, viewDirection), 0.0), 92.0);
    colour += vec3(1.0, 0.84, 0.59) * glint * 0.76;
    float cameraDistance = length(vWorldPosition.xz - uCameraPosition.xz);
    float distanceHaze = smoothstep(240.0, 700.0, cameraDistance);
    colour = mix(colour, vec3(0.37, 0.61, 0.71), distanceHaze * 0.48);
    // A broad, low-contrast teal band preserves an unmistakable sea level in
    // high overview angles. It fades again before the finite surface reaches
    // the far clip, so it cannot turn into a hard polygonal skyline.
    float scaleEncounterSeaLevelDefinition =
      smoothstep(340.0, 560.0, cameraDistance) *
      (1.0 - smoothstep(620.0, 780.0, cameraDistance));
    colour = mix(
      colour,
      vec3(0.16, 0.40, 0.52),
      scaleEncounterSeaLevelDefinition * 0.24
    );
    // Match the exact background colour only in the final few metres before
    // the far clip. Most of the distant water therefore retains its identity.
    float scaleEncounterSeamlessHorizon = smoothstep(
      680.0,
      820.0,
      cameraDistance
    );
    vec3 backgroundDirection = normalize(vWorldPosition - uCameraPosition);
    colour = mix(
      colour,
      skyColourBehindSea(backgroundDirection),
      scaleEncounterSeamlessHorizon
    );
    gl_FragColor = vec4(colour, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,Fi=`
  varying float vScaleEncounterHazeHeight;

  void main() {
    vScaleEncounterHazeHeight = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ii=`
  uniform vec3 uHazeColour;
  varying float vScaleEncounterHazeHeight;

  void main() {
    // Feather both cylinder rims. The previous opaque 64-sided rim was the
    // source of the long straight segments visible across the sea/sky join.
    float lowerFeather = smoothstep(
      0.0,
      0.22,
      vScaleEncounterHazeHeight
    );
    float upperFeather = 1.0 - smoothstep(
      0.52,
      1.0,
      vScaleEncounterHazeHeight
    );
    float alpha = 0.055 * lowerFeather * upperFeather;
    gl_FragColor = vec4(uHazeColour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function Li(e){let t=new x;t.name=`sky-background-atmosphere`;let n=new l({depthTest:!1,depthWrite:!1,fragmentShader:Mi,side:1,toneMapped:!0,uniforms:{uDarkDiagnostic:{value:0},uSkyRadiance:{value:e},uSunDirection:{value:Ti.clone()},uUseSkyRadiance:{value:0}},vertexShader:ji}),r=new b(new D(Ei,64,32),n);r.name=`seam-safe-analytic-sky-background`,r.frustumCulled=!1,r.renderOrder=-1e3,t.add(r);let i=new c(`#d8eff9`,`#718e9d`,1.68);i.name=`sky-candidate-hemisphere`;let a=new F(`#ffe3b5`,2.12);a.name=`sky-candidate-world-sun`,a.position.copy(Ti).multiplyScalar(95),a.target.position.set(0,4.8,0),a.castShadow=!1;let o=new F(`#e3f4ff`,1.85);return o.name=`sky-candidate-rear-upper-flight-fill`,o.position.set(8,38,76),o.target.position.set(0,4.8,0),o.castShadow=!1,t.add(i,a,a.target,o,o.target),{flightFill:o,group:t,hemisphere:i,material:n,sky:r,sun:a}}function Ri(e,t){let n=new x;n.name=`sky-flight-volume-and-sea`;let r=new l({depthTest:!0,depthWrite:!0,fragmentShader:Pi,side:2,toneMapped:!0,uniforms:{uCameraPosition:{value:new L},uSkyRadiance:{value:e},uSunDirection:{value:Ti.clone()},uTime:{value:0},uUseSkyRadiance:{value:0}},vertexShader:Ni}),i=new b(new U(1800,1800,128,128),r);return i.name=`world-space-open-sea`,i.position.y=-60,i.rotation.x=-Math.PI/2,i.receiveShadow=!1,n.add(i,je(t)),{group:n,seaMaterial:r}}function zi(e,n=28){let r=new x,i=new x,a=new x;r.name=`sky-near-air`,i.name=`sky-mid-cloud`,a.name=`sky-far-cloud`;let o={"near-air":r,"mid-cloud":i,"far-cloud":a},s=Si(e).map((e,t)=>wi(e,t,n));s.forEach(e=>o[e.layer].add(e.object));let c=new b(new t(205,205,58,192,1,!0),new l({depthWrite:!1,fragmentShader:Ii,side:1,toneMapped:!0,transparent:!0,uniforms:{uHazeColour:{value:new P(`#bed6df`)}},vertexShader:Fi}));return c.name=`necessary-horizon-atmosphere-depth`,c.position.y=-31,c.renderOrder=80,a.add(c),{entries:s,far:a,mid:i,near:r}}function Bi(e,t,n){let r=new x,i=-60+e,a=-60+t,o=new ee(new z(new L(-118,i,-118),new L(118,a,118)),n),s=o.material;return s.transparent=!0,s.opacity=.5,r.add(o),r}function Vi(){let e=new x;e.name=`sky-review-flight-volume-debug`;let t={"subject-flight":`#ffbf4a`,"near-air":`#ff7a59`,"mid-cloud":`#7dd3fc`,"far-cloud":`#60a5fa`};for(let n of Te){let r=Bi(n.minimumAltitudeMeters,n.maximumAltitudeMeters,t[n.id]);r.name=`height-band-${n.id}`,e.add(r)}return e.visible=!1,e}function Hi(e){return!(e instanceof b)&&!(e instanceof le)?null:e}function Ui(e,t){let n=[];return e.traverseVisible(e=>{if(t&&!e.visible)return;let r=Hi(e);r&&(Array.isArray(r.material)?n.push(...r.material):n.push(r.material))}),[...new Set(n)]}function Wi(e){let t=[];return e.traverseVisible(e=>{let n=Hi(e);n&&t.push(n.geometry)}),t}function Gi(e){return e.transparent===!0&&e.opacity>0}function Ki(e){e.dispose()}function qi(e){let t=new Set,n=new Set;e.traverse(e=>{let r=Hi(e);r&&(t.add(r.geometry),Array.isArray(r.material)?r.material.forEach(e=>n.add(e)):n.add(r.material))}),t.forEach(e=>e.dispose()),n.forEach(Ki),e.clear()}function Ji(e){let t=new x;t.name=`scale-encounter-sky-review-candidate`;let n=Ai(),r=Li(n),i=Ri(n,e.coastTemplate),a=zi(e.cloudSeed,e.rendererCapabilities.maxTextureSize<4096?20:28),o=0,s=null,c=Vi(),l={"background-atmosphere":r.group,"flight-volume":i.group,"near-air":a.near,"mid-cloud":a.mid,"far-cloud":a.far};t.add(r.group,i.group,a.near,a.mid,a.far,c);let u=e.variant,d=e.corridorBounds.clone(),f=e.cameraSweepBounds.clone(),p={},m=()=>{let e=new Set(De(u)),t=p.isolateLayers?new Set(p.isolateLayers):null;for(let[n,r]of Object.entries(l))r.visible=e.has(n)&&(t===null||t.has(n));c.visible=p.showFlightVolumes===!0,r.material.uniforms.uDarkDiagnostic.value=+(p.backgroundTone===`dark`);for(let e of a.entries)e.material.uniforms.uOverdrawDiagnostic.value=+(p.showOverdraw===!0);let n=u===`D`;r.material.uniforms.uUseSkyRadiance.value=+!!n,i.seaMaterial.uniforms.uUseSkyRadiance.value=+!!n,r.hemisphere.intensity=n?1.02:1.68,r.sun.intensity=n?1.96:2.12,r.flightFill.intensity=n?1.08:1.85};return m(),{radianceTexture:n,root:t,dispose:()=>{t.removeFromParent(),qi(t),n.dispose(),a.entries.forEach(e=>e.density.dispose())},getDiagnostics:(n,r,i,o)=>{t.updateMatrixWorld(!0);let s=a.entries.filter(e=>e.object.visible&&e.object.parent?.visible),c=r.stage!==`eye-entry`&&r.stage!==`pov`,p=_i(s,d,i,n,r.viewportWidth,r.viewportHeight,c?[o]:[]),m=s.map(e=>mi(pi(e.object),n,r.viewportWidth,r.viewportHeight)),h=Ui(t,!0),g=h.filter(Gi),_=yi(Wi(t));return{alpha:{alphaMode:s.length>0?`premultiplied-blend`:`opaque`,alphaTextureCount:0,cloudMaterialsPremultiplied:a.entries.every(e=>e.material.premultipliedAlpha),cloudMaterialsUseMipmaps:!1,cloudMaterialsDepthWriteDisabled:a.entries.every(e=>e.material.depthWrite===!1),edgeRgbPolicy:`Independent 3D density volumes use trilinear sampling and premultiplied alpha; no cloud atlas.`},assetLease:e.assetLease,avatarOcclusionEvaluated:c,avatarBounds:fi(o),camera:{aspect:r.aspect,far:r.far,fieldOfViewDegrees:r.fieldOfViewDegrees,near:r.near,position:di(r.position),stage:r.stage,target:di(r.target)},cameraSweepBounds:fi(f),cloudCount:s.length,cloudDiagnostics:p,corridorBounds:fi(d),corridorOverlapCount:p.filter(e=>e.corridorOverlap).length,heightBands:Te,layerStates:[{id:`subject`,visible:!0},...Object.entries(l).map(([e,t])=>({id:e,visible:t.visible}))],referenceY:-60,rendererCapabilities:e.rendererCapabilities,resources:{..._,activeMaterialCount:h.length,proceduralTextureBytes:(u===`D`?512*256*4*2:0)+a.entries.reduce((e,t)=>e+t.density.image.data.byteLength,0),transparentDrawEstimate:g.length},sceneContractRevision:Ce,subjectBounds:fi(i),subjectOcclusionMaximumFraction:Math.max(0,...p.map(e=>e.subjectOcclusionFraction)),transparentOverdraw:gi(m,r.viewportWidth,r.viewportHeight),variant:u}},setCorridorBounds:(e,t)=>{d=e.clone(),f=t.clone()},setDiagnosticMode:e=>{p={...p,...e},m()},setVariant:e=>{u=e,m()},update:(e,t,n)=>{r.sky.position.copy(n.position);let c=s===null?0:Math.min(.1,Math.max(0,e-s));s=e,t||(o+=c),a.entries.forEach(e=>e.update(o,n));let l=o;i.seaMaterial.uniforms.uTime.value=l,i.seaMaterial.uniforms.uCameraPosition.value.copy(n.position)}}}Ti.toArray();var Yi=`tyrannosaurus-layered-forested-mountain-basin-v1`,Xi=2.2,Zi=0;function Qi(e,t){let n=new x;return n.name=`scale-encounter-accepted-forested-mountain-basin`,n.userData.scaleEncounterAcceptedEnvironment={defaultCandidate:!0,id:Yi,ownerVisualApproval:`2026-08-19`,panoramaRole:`sky-and-compressed-distant-treeline`,productionApproved:!0,worldSpaceDepthMeters:[100,326]},n.add(ta(t)),e&&na(n,e),n}function $i(e){if(e.userData.scaleEncounterAcceptedLatitudeCompression)return;let t=e.geometry.getAttribute(`uv`),n=3.5,r=Math.tanh(n*.5);for(let e=0;e<t.count;e+=1){let i=t.getY(e);t.setY(e,.5+.5*Math.tanh(n*(i-.5))/r)}t.needsUpdate=!0,e.userData.scaleEncounterAcceptedLatitudeCompression=n}function ea(e,t){return rt(e,t)+aa(e,t)+.035}function ta(e){let t=[],n=[],r=[],i=[],a=[],o=new P(`#c2c6b5`),s=new P(`#d2d0b8`),c=new P(`#d9c6a9`),l=new P(`#d8d5cc`),u=11.5;for(let e=0;e<224;e+=1){let a=e/224*Math.PI*2,d=Math.cos(a),f=Math.sin(a);for(let e=0;e<=68;e+=1){let a=la(100,326,e/68),p=Xi+d*a,m=Zi+f*a,h=aa(p,m);t.push(p,rt(p,m)+h+.035,m),i.push(p/u,m/u);let g=2.2,_=(aa(p+g,m)-aa(p-g,m))/(g*2),v=(aa(p,m+g)-aa(p,m-g))/(g*2),y=Math.hypot(_,v),b=ca(4,48,h),x=.5+.5*Math.sin(p*.072+Math.sin(m*.037)*1.7)*Math.cos(m*.061-p*.019),S=.5+.5*Math.sin(p*.031-m*.047+Math.sin(p*.014)*2.1)*Math.cos((p+m)*.024),C=.5+.5*Math.sin(p*.097+m*.041+Math.sin(m*.028)*1.8),w=ca(.16,.58,y)*ca(.12,.74,b),T=ca(.58,.94,b)*ca(.6,.9,C),E=Math.max(w*.92,T*.62),D=(1-E)*ca(.5,.84,S)*(.28+b*.58);o.clone().lerp(s,.18+x*.44).lerp(c,D*.72).lerp(l,E*.9).toArray(n,n.length),r.push(sa(D*.82+E*.94,0,1))}}for(let e=0;e<224;e+=1){let t=(e+1)%224;for(let n=0;n<68;n+=1){let r=e*69+n,i=t*69+n,o=r+1,s=i+1;a.push(r,i,o,i,s,o)}}let d=new M;d.name=`scale-encounter-continuous-forested-mountain-heightfield`,d.setAttribute(`position`,new p(t,3)),d.setAttribute(`color`,new p(n,3)),d.setAttribute(`mountainSurfaceBlend`,new p(r,1)),d.setAttribute(`uv`,new p(i,2)),d.setIndex(a),d.computeVertexNormals(),d.computeBoundingBox(),d.computeBoundingSphere();let f=new _({color:`#918d7d`,map:e?.albedo??null,metalness:0,normalMap:e?.normal??null,normalScale:new R(.14,.14),roughness:.98,roughnessMap:e?.roughness??null,vertexColors:!0});if(f.name=`scale-encounter-forested-mountain-slope-material`,f.dithering=!0,e?.dryLitterAlbedo){let t=e.dryLitterAlbedo;f.onBeforeCompile=e=>{e.uniforms.uAcceptedMountainDryAlbedo={value:t},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute float mountainSurfaceBlend;
varying float vAcceptedMountainSurfaceBlend;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vAcceptedMountainSurfaceBlend = mountainSurfaceBlend;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform sampler2D uAcceptedMountainDryAlbedo;
varying float vAcceptedMountainSurfaceBlend;`).replace(`#include <map_fragment>`,`#ifdef USE_MAP
  vec4 acceptedForestAlbedo = texture2D( map, vMapUv );
  vec4 acceptedDryAlbedo = texture2D(
    uAcceptedMountainDryAlbedo,
    vMapUv * 0.73 + vec2(0.173, 0.349)
  );
  vec4 sampledDiffuseColor = mix(
    acceptedForestAlbedo,
    acceptedDryAlbedo,
    smoothstep(0.12, 0.88, vAcceptedMountainSurfaceBlend)
  );
  diffuseColor *= sampledDiffuseColor;
#endif`)},f.customProgramCacheKey=()=>`accepted-mountain-forest-soil-rock-blend-v1`}let m=new b(d,f);return m.name=`scale-encounter-accepted-360-forested-mountain-basin`,m.castShadow=!1,m.receiveShadow=!0,m}function na(e,t){let r=[{x:-112,z:-78,radiusX:39,radiusZ:30,countWeight:1.12},{x:-72,z:-139,radiusX:46,radiusZ:34,countWeight:.96},{x:-14,z:-184,radiusX:48,radiusZ:32,countWeight:.82},{x:61,z:-172,radiusX:45,radiusZ:36,countWeight:1.05},{x:128,z:-119,radiusX:42,radiusZ:39,countWeight:1.14},{x:181,z:-42,radiusX:33,radiusZ:47,countWeight:.84},{x:186,z:48,radiusX:36,radiusZ:48,countWeight:1.02},{x:139,z:116,radiusX:45,radiusZ:38,countWeight:1.15},{x:73,z:168,radiusX:48,radiusZ:34,countWeight:.92},{x:4,z:203,radiusX:51,radiusZ:32,countWeight:.86},{x:-72,z:177,radiusX:46,radiusZ:37,countWeight:1.06},{x:-139,z:119,radiusX:42,radiusZ:43,countWeight:1.08},{x:-190,z:38,radiusX:35,radiusZ:49,countWeight:.8},{x:-178,z:-47,radiusX:36,radiusZ:45,countWeight:.96}],i=[{x:0,z:-139,radiusX:43,radiusZ:31,countWeight:1.08},{x:98,z:-98,radiusX:37,radiusZ:35,countWeight:.94},{x:140,z:0,radiusX:31,radiusZ:44,countWeight:1.02},{x:100,z:99,radiusX:38,radiusZ:34,countWeight:1.12},{x:0,z:142,radiusX:45,radiusZ:31,countWeight:1.16},{x:-99,z:99,radiusX:37,radiusZ:36,countWeight:.98},{x:-141,z:0,radiusX:31,radiusZ:45,countWeight:1.04},{x:-98,z:-98,radiusX:37,radiusZ:35,countWeight:.92}],a=[...ia(r,1100,104,306,801591769,9.4,19.5,.62),...ia(i,760,104,204,2175225135,7.2,15.8,.78)].filter(({x:e,z:t})=>aa(e,t)>1.4),o=new n({alphaTest:.33,alphaToCoverage:!0,color:`#d8dccb`,fog:!0,map:t,side:2,transparent:!1});o.name=`scale-encounter-correct-scale-distant-tree-atlas`;let c=new s,l=new P(`#627157`),u=new P(`#88917c`);for(let t=0;t<8;t+=1){let n=a.filter((e,n)=>n%8===t),r=new E(ra(t),o,n.length);r.name=`scale-encounter-mountain-tree-profile-${t+1}`,n.forEach((e,n)=>{let i=.64+e.aspect*.19;c.position.set(e.x,ea(e.x,e.z)-.04,e.z),c.rotation.set(e.pitch*.28,e.yaw,e.roll*.28),c.scale.set(e.scale*i,e.scale,e.scale*i),c.updateMatrix(),r.setMatrixAt(n,c.matrix),r.setColorAt(n,l.clone().lerp(u,(n*5+t*3)%13/18))}),r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0),r.computeBoundingBox(),r.computeBoundingSphere(),e.add(r)}}function ra(e){let t=e%4,n=Math.floor(e/4),r=.009,i=.008,a=(t+r)/4,o=(t+1-r)/4,s=1-(n+1-i)/2,c=1-(n+i)/2,l=[],u=[],d=[];for(let t=0;t<2;t+=1){let n=t*Math.PI*.5+(e%2==0?.035:-.03),r=Math.cos(n)*.5,i=Math.sin(n)*.5,f=t*4;l.push(-r,0,-i,r,0,i,r,1,i,-r,1,-i),u.push(a,s,o,s,o,c,a,c),d.push(f,f+1,f+2,f,f+2,f+3)}let f=new M;return f.name=`scale-encounter-distant-tree-profile-${e+1}`,f.setAttribute(`position`,new p(l,3)),f.setAttribute(`uv`,new p(u,2)),f.setIndex(d),f.computeVertexNormals(),f.computeBoundingBox(),f.computeBoundingSphere(),f}function ia(e,t,n,r,i,a,o,s){let c=oa(i),l=[],u=e.reduce((e,t)=>e+t.countWeight,0);for(let i=0;i<t*30&&l.length<t;i+=1){let t=c()*u,i=e.at(-1);for(let n of e)if(t-=n.countWeight,t<=0){i=n;break}let d=c()*Math.PI*2,f=c()**s,p=i.x+Math.cos(d)*i.radiusX*f,m=i.z+Math.sin(d)*i.radiusZ*f,h=Math.hypot(p-Xi,m-Zi);h<n||h>r||l.push({aspect:.78+c()*.48,pitch:(c()-.5)*.055,roll:(c()-.5)*.055,scale:a+c()*(o-a),x:p,yaw:c()*Math.PI*2,z:m})}return l}function aa(e,t){let n=e-Xi,r=t-Zi,i=Math.hypot(n,r);if(i<=100||i>=326)return 0;let a=Math.atan2(r,n),o=ca(100,122,i)*(1-ca(302,326,i)),s=154+Math.sin(a*2-.7)*15+Math.sin(a*5+1.2)*7,c=250+Math.sin(a*3+.35)*20+Math.sin(a*7-.9)*8,l=Math.exp(-(((i-s)/45)**2)),u=Math.exp(-(((i-c)/64)**2)),d=sa(.63+Math.sin(a*3+.25)*.23+Math.sin(a*7-1.1)*.13+Math.cos(a*11+.8)*.07,.24,1.08),f=sa(.84+Math.sin(a*2-.6)*.2+Math.sin(a*5+.55)*.15+Math.cos(a*9-.35)*.09,.42,1.24),p=(Math.sin(e*.055+t*.017)*.7+Math.sin(t*.083-e*.026)*.42+Math.cos((e+t)*.031)*.34)*(l*.65+u)*1.35;return Math.max(0,o*(l*14.5*d+u*31*f+p))}function oa(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function sa(e,t,n){return Number.isFinite(e)?Math.max(t,Math.min(n,e)):t}function ca(e,t,n){let r=sa((n-e)/(t-e),0,1);return r*r*(3-2*r)}function la(e,t,n){return e*(1-n)+t*n}var ua=Math.PI*2,da=[{x:-25,z:-25,radiusX:8,radiusZ:6},{x:25,z:-28,radiusX:9,radiusZ:7},{x:-49,z:-43,radiusX:16,radiusZ:12},{x:49,z:-49,radiusX:17,radiusZ:13},{x:-78,z:-27,radiusX:18,radiusZ:14},{x:79,z:-30,radiusX:19,radiusZ:15},{x:-31,z:21,radiusX:8,radiusZ:5},{x:32,z:19,radiusX:8,radiusZ:5}],fa=[{x:-76,z:-68,radiusX:23,radiusZ:18},{x:72,z:-82,radiusX:24,radiusZ:20},{x:-31,z:-103,radiusX:22,radiusZ:23},{x:34,z:-121,radiusX:25,radiusZ:22},{x:-104,z:-49,radiusX:25,radiusZ:20},{x:102,z:-51,radiusX:24,radiusZ:21},{x:-92,z:36,radiusX:23,radiusZ:20},{x:94,z:39,radiusX:23,radiusZ:20},{x:-47,z:91,radiusX:21,radiusZ:22},{x:51,z:99,radiusX:22,radiusZ:24}],pa=[{x:-31,z:22,radiusX:4,radiusZ:3},{x:35,z:-27,radiusX:5,radiusZ:4},{x:-64,z:43,radiusX:7,radiusZ:7}],ma=[{x:-76,z:-84,radiusX:10,radiusZ:8},{x:71,z:-101,radiusX:10,radiusZ:9},{x:96,z:42,radiusX:9,radiusZ:8}];function ha(e){return Math.round(e*1e4)/1e4}function ga(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function _a(e,t,n,r){let i=r*r;return e.every(e=>{let r=t-e.x,a=n-e.z;return r*r+a*a>=i})}function va(e){let t=ga(e.seed),n=[];for(let r=0;r<e.count;r+=1){let i=e.clusters[r%e.clusters.length],a=i.x,o=i.z;for(let r=0;r<24;r+=1){let r=t()*ua,s=t()**1.55,c=i.x+Math.cos(r)*i.radiusX*s,l=i.z+Math.sin(r)*i.radiusZ*s;if(!(Math.hypot(c,l)<e.minimumRadius)&&_a(n,c,l,e.minimumSeparation)){a=c,o=l;break}}n.push({aspect:ha(.84+t()*.34),pitch:ha((t()-.5)*.14),roll:ha((t()-.5)*.12),scale:ha(e.minimumScale+t()*(e.maximumScale-e.minimumScale)),tier:e.tier,x:ha(a),yaw:ha(t()*ua),z:ha(o)})}return n}function ya(){return{ferns:va({clusters:da,count:39,maximumScale:1.72,minimumRadius:23.5,minimumScale:.84,minimumSeparation:1.05,seed:2331188513,tier:`near`}),logs:va({clusters:pa,count:3,maximumScale:1.22,minimumRadius:27,minimumScale:.9,minimumSeparation:13,seed:730259913,tier:`near`}),rocks:va({clusters:da,count:12,maximumScale:1.72,minimumRadius:24.5,minimumScale:.72,minimumSeparation:3.5,seed:1203960123,tier:`near`})}}function ba(){return{ferns:va({clusters:fa,count:39,maximumScale:1.96,minimumRadius:62,minimumScale:.92,minimumSeparation:1.25,seed:1709125799,tier:`middle`}),logs:va({clusters:ma,count:3,maximumScale:1.36,minimumRadius:66,minimumScale:.96,minimumSeparation:18,seed:2637885249,tier:`middle`}),rocks:va({clusters:fa,count:12,maximumScale:1.72,minimumRadius:64,minimumScale:.78,minimumSeparation:5.5,seed:3242625875,tier:`middle`})}}function xa(e){let t=ya();if(e===`ground-slice`)return t;let n=ba();return{ferns:[...t.ferns,...n.ferns],logs:[...t.logs,...n.logs],rocks:[...t.rocks,...n.rocks]}}var Sa=Math.PI*2,Ca=122,wa=[{x:-5,z:-11,radiusX:8,radiusZ:3.2,weight:1.55,tier:`near`},{x:11,z:6,radiusX:3.8,radiusZ:6.4,weight:.62,tier:`near`},{x:-1,z:14,radiusX:8.5,radiusZ:2.8,weight:.88,tier:`near`},{x:-34,z:-29,radiusX:10,radiusZ:7,weight:1.25,tier:`near`},{x:27,z:-33,radiusX:13,radiusZ:8,weight:1.6,tier:`near`},{x:-53,z:-7,radiusX:12,radiusZ:9,weight:.8,tier:`near`},{x:51,z:9,radiusX:11,radiusZ:8,weight:1.05,tier:`near`},{x:-39,z:35,radiusX:10,radiusZ:8,weight:1.35,tier:`near`},{x:39,z:38,radiusX:13,radiusZ:9,weight:.75,tier:`near`},{x:-74,z:-38,radiusX:16,radiusZ:11,weight:1.5,tier:`near`},{x:74,z:-46,radiusX:15,radiusZ:12,weight:.9,tier:`near`},{x:-73,z:37,radiusX:14,radiusZ:10,weight:.7,tier:`near`},{x:75,z:35,radiusX:16,radiusZ:12,weight:1.3,tier:`near`},{x:-38,z:-78,radiusX:17,radiusZ:14,weight:1.5,tier:`middle`},{x:37,z:-86,radiusX:19,radiusZ:15,weight:.8,tier:`middle`},{x:-85,z:-69,radiusX:17,radiusZ:15,weight:1.15,tier:`middle`},{x:88,z:-65,radiusX:18,radiusZ:14,weight:1.4,tier:`middle`},{x:-109,z:-23,radiusX:13,radiusZ:17,weight:.75,tier:`middle`},{x:108,z:21,radiusX:14,radiusZ:18,weight:1.2,tier:`middle`},{x:-69,z:86,radiusX:17,radiusZ:18,weight:1.45,tier:`middle`},{x:72,z:91,radiusX:18,radiusZ:18,weight:.85,tier:`middle`},{x:7,z:111,radiusX:21,radiusZ:11,weight:1.1,tier:`middle`},{x:-8,z:-113,radiusX:22,radiusZ:10,weight:.65,tier:`middle`}],Ta=[{x:-29,z:-37,radiusX:7,radiusZ:5,weight:1.4,tier:`near`},{x:38,z:-28,radiusX:8,radiusZ:6,weight:.8,tier:`near`},{x:-58,z:17,radiusX:10,radiusZ:7,weight:1.1,tier:`near`},{x:63,z:28,radiusX:11,radiusZ:8,weight:1.55,tier:`near`},{x:-82,z:-44,radiusX:12,radiusZ:9,weight:.7,tier:`near`},{x:83,z:-48,radiusX:12,radiusZ:8,weight:1.25,tier:`near`},{x:-48,z:-86,radiusX:14,radiusZ:11,weight:1.35,tier:`middle`},{x:57,z:-94,radiusX:14,radiusZ:12,weight:.75,tier:`middle`},{x:-100,z:12,radiusX:12,radiusZ:14,weight:1.05,tier:`middle`},{x:101,z:5,radiusX:13,radiusZ:14,weight:1.45,tier:`middle`},{x:-65,z:91,radiusX:14,radiusZ:13,weight:.7,tier:`middle`},{x:71,z:87,radiusX:15,radiusZ:13,weight:1.2,tier:`middle`}],Ea=[{x:-35,z:29,radiusX:6,radiusZ:5,weight:1.5,tier:`near`},{x:42,z:-39,radiusX:7,radiusZ:5,weight:.85,tier:`near`},{x:-67,z:-31,radiusX:9,radiusZ:7,weight:1.2,tier:`near`},{x:70,z:32,radiusX:9,radiusZ:7,weight:.7,tier:`near`},{x:-46,z:-85,radiusX:10,radiusZ:8,weight:1.35,tier:`middle`},{x:59,z:-94,radiusX:10,radiusZ:9,weight:.8,tier:`middle`},{x:-88,z:62,radiusX:10,radiusZ:8,weight:1.15,tier:`middle`},{x:91,z:64,radiusX:11,radiusZ:9,weight:1.45,tier:`middle`}],Da={branch:{near:[`dry_branch_a_lod0`,`dry_branch_b_lod0`,`dry_branch_c_lod0`],middle:[`dry_branch_a_lod1`,`dry_branch_b_lod1`,`dry_branch_c_lod1`]},fern:{near:[`fern_02_a_lod0`,`fern_02_b_lod0`,`fern_02_c_lod0`,`fern_02_d_lod0`],middle:[`fern_02_a_lod1`,`fern_02_b_lod1`,`fern_02_c_lod1`,`fern_02_d_lod1`]},litter:{near:[`forest_litter_a_lod0`,`forest_litter_b_lod0`,`forest_litter_c_lod0`,`forest_litter_d_lod0`],middle:[`forest_litter_a_lod0`,`forest_litter_b_lod0`,`forest_litter_c_lod0`,`forest_litter_d_lod0`]},log:{near:[`dead_tree_trunk_lod0`,`dead_tree_trunk_02_lod0`],middle:[`dead_tree_trunk_lod1`,`dead_tree_trunk_02_lod1`]},moss:{near:[`moss_01_a_lod0`,`moss_01_b_lod0`,`moss_01_c_lod0`],middle:[`moss_01_a_lod1`,`moss_01_b_lod1`,`moss_01_c_lod1`]},rock:{near:[`rock_07_lod0`,`rock_09_lod0`,`stone_01_lod0`],middle:[`rock_07_lod1`,`rock_09_lod1`,`stone_01_lod1`]},shrub:{near:[`shrub_04_a_lod0`,`shrub_04_b_lod0`,`shrub_04_c_lod0`,`shrub_04_d_lod0`],middle:[`shrub_04_a_lod1`,`shrub_04_b_lod1`,`shrub_04_c_lod1`,`shrub_04_d_lod1`]}},Oa=[...new Set(Object.values(Da).flatMap(({middle:e,near:t})=>[...t,...e]))];function ka(e){return Math.round(e*1e4)/1e4}function Aa(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function ja(e,t,n,r){let i=r*r;return e.every(e=>{let r=t-e.x,a=n-e.z;return r*r+a*a>=i})}function Ma(e,t,n,r){return Math.hypot(e-Math.max(n,Math.min(r,e)),t)}function Na(e,t,n){let r=((t-2.2)/8.6)**2+(n/3.7)**2>=1,i=Ma(t,n,-22,-7);return r&&i>=(e===`litter`||e===`moss`?1.55:2.2)}function Pa(e,t){let n=e.reduce((e,t)=>e+t.weight,0),r=t()*n;for(let t=0;t<e.length;t+=1){let n=e[t];if(r-=n.weight,r<=0)return{index:t,patch:n}}return{index:e.length-1,patch:e.at(-1)}}function Fa(e){let t=Aa(e.seed),n=[];for(let r=0;r<e.count;r+=1){let i;r===0&&e.forceInnerCover&&(i={patchId:0,tier:`near`,x:-5.7,z:-5.2});for(let r=0;!i&&r<360;r+=1){let{index:a,patch:o}=Pa(e.patches,t),s=t()*Sa,c=e.kind===`log`?.72:e.kind===`rock`?1.35:e.kind===`branch`?1.75:2.28,l=t()**c,u=o.x+Math.cos(s)*o.radiusX*l,d=o.z+Math.sin(s)*o.radiusZ*l,f=Math.hypot(u,d),p=r<260?e.minimumSeparation:e.minimumSeparation*.62;if(!(f<e.minimumRadius||f>Math.min(Ca,e.maximumRadius)||!Na(e.kind,u,d)||!ja(n,u,d,p))){i={patchId:a,tier:o.tier,x:u,z:d};break}}if(!i)throw Error(`Could not place production ecology instance ${r+1}/${e.count}`);n.push({aspect:ka(.72+t()*.62),patchId:i.patchId,pitch:ka((t()-.5)*.075),roll:ka((t()-.5)*.065),scale:ka(e.minimumScale+t()*(e.maximumScale-e.minimumScale)),tier:i.tier,x:ka(i.x),yaw:ka(t()*Sa),z:ka(i.z)})}return n}function Ia(e,t){return e.filter(e=>e.tier===t)}function La(e,t){let n={branch:{middle:{count:6,maximumRadius:102,maximumScale:1.18,minimumRadius:18,minimumScale:.68,minimumSeparation:2.8,patches:Ea,seed:1522850111},near:{count:16,maximumRadius:76,maximumScale:1.28,minimumRadius:16,minimumScale:.72,minimumSeparation:2.1,patches:Ea,seed:448227811}},fern:{middle:{count:24,maximumRadius:92,maximumScale:1.02,minimumRadius:9,minimumScale:.48,minimumSeparation:1.55,patches:wa,seed:2395060052},near:{count:72,forceInnerCover:!0,maximumRadius:58,maximumScale:1.08,minimumRadius:4.2,minimumScale:.5,minimumSeparation:1.02,patches:wa,seed:3519285355}},litter:{middle:{count:55,maximumRadius:122,maximumScale:1.7,minimumRadius:5.8,minimumScale:.85,minimumSeparation:2.45,patches:wa,seed:887100847},near:{count:100,maximumRadius:52,maximumScale:1.85,minimumRadius:3.2,minimumScale:.9,minimumSeparation:1.85,patches:wa,seed:2276633697}},log:{middle:{count:4,maximumRadius:112,maximumScale:1.2,minimumRadius:25,minimumScale:.78,minimumSeparation:17,patches:Ea,seed:2978294905},near:{count:7,maximumRadius:82,maximumScale:1.34,minimumRadius:25,minimumScale:.82,minimumSeparation:10,patches:Ea,seed:700742625}},moss:{middle:{count:42,maximumRadius:122,maximumScale:1.55,minimumRadius:5.8,minimumScale:.72,minimumSeparation:2.2,patches:[...wa,...Ta],seed:3369236767},near:{count:90,maximumRadius:54,maximumScale:1.75,minimumRadius:3.4,minimumScale:.78,minimumSeparation:1.5,patches:[...wa,...Ta],seed:999705121}},rock:{middle:{count:16,maximumRadius:110,maximumScale:1.32,minimumRadius:24,minimumScale:.64,minimumSeparation:5.2,patches:Ta,seed:1135203935},near:{count:36,maximumRadius:84,maximumScale:1.48,minimumRadius:20,minimumScale:.68,minimumSeparation:2.8,patches:Ta,seed:1931147266}},shrub:{middle:{count:14,maximumRadius:92,maximumScale:1.08,minimumRadius:18,minimumScale:.58,minimumSeparation:4.4,patches:wa,seed:2104364981},near:{count:22,maximumRadius:68,maximumScale:1.12,minimumRadius:13,minimumScale:.58,minimumSeparation:3.1,patches:wa,seed:1241044769}}}[e],r=e===`rock`?1:e===`litter`||e===`moss`?Ne(t):t===`1.25x`?1.05:t===`1.5x`?1.18:1,i=e=>Math.round(e*r);return[...Fa({...n.near,count:i(n.near.count),kind:e,minimumSeparation:n.near.minimumSeparation/Math.sqrt(r),patches:Ia(n.near.patches,`near`)}),...Fa({...n.middle,count:i(n.middle.count),kind:e,minimumSeparation:n.middle.minimumSeparation/Math.sqrt(r),patches:Ia(n.middle.patches,`middle`)})]}function Ra(e=`current`){let t=new Map,n={branch:0,fern:0,litter:0,log:0,moss:0,rock:0,shrub:0};for(let r of Object.keys(n)){let i=La(r,e);n[r]=i.length;for(let[e,n]of i.entries()){let i=Da[r][n.tier],a=i[(e*5+n.patchId*3)%i.length],o=`${r}:${a}`,s=t.get(o);s?s.placements.push(n):t.set(o,{kind:r,placements:[n],templateName:a})}}let r=new Map(Oa.map((e,t)=>[e,t]));return{batches:[...t.values()].sort((e,t)=>r.get(e.templateName)-r.get(t.templateName)),counts:n}}var za=`hybrid-ground-antitile-v1`,Ba=`scaleEncounterHybridGroundPrototype`;function Va(e,t){return typeof e==`number`&&Number.isFinite(e)?e:t}function Ha(e){let t=Math.max(24,Va(e.subjectFadeStartMeters,34)),n=Math.max(12,Va(e.cameraFadeStartMeters,64));return{cameraFadeEndMeters:Math.max(n+1,Va(e.cameraFadeEndMeters,172)),cameraFadeStartMeters:n,horizonColour:new P(e.horizonColour??`#43533e`),horizonColourStrength:Math.max(0,Math.min(1,Va(e.horizonColourStrength,.62))),maximumCoverageLoss:Math.max(0,Math.min(.98,Va(e.maximumCoverageLoss,.82))),secondaryUvScale:Math.max(.05,Va(e.secondaryUvScale,.431)),subjectFadeEndMeters:Math.max(t+1,Va(e.subjectFadeEndMeters,126)),subjectFadeStartMeters:t,tertiaryUvScale:Math.max(.025,Va(e.tertiaryUvScale,.137))}}function Ua(e){return e.replace(`varying vec3 vViewPosition;`,`varying vec3 vViewPosition;
varying vec2 vScaleEncounterGroundLocalPosition;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
	vScaleEncounterGroundLocalPosition = position.xy;`)}function Wa(e){return`
#ifdef USE_MAP

	// The original 2 m scan remains the fine-frequency layer. Two rotated,
	// irrationally scaled reads prevent its distinctive marks from lining up
	// into the same rows at overview distance. A slow local-space field changes
	// their weights without allocating another texture or cache entry.
	vec2 scaleEncounterWarp = vec2(
		sin(vScaleEncounterGroundLocalPosition.y * 0.047) +
			sin((vScaleEncounterGroundLocalPosition.x + vScaleEncounterGroundLocalPosition.y) * 0.019),
		cos(vScaleEncounterGroundLocalPosition.x * 0.041) +
			cos((vScaleEncounterGroundLocalPosition.x - vScaleEncounterGroundLocalPosition.y) * 0.023)
	) * 0.085;
	vec2 scaleEncounterPrimaryUv = vMapUv + scaleEncounterWarp;
	mat2 scaleEncounterSecondaryRotation = mat2(0.738, -0.675, 0.675, 0.738);
	mat2 scaleEncounterTertiaryRotation = mat2(0.852, 0.523, -0.523, 0.852);
	vec2 scaleEncounterSecondaryUv =
		scaleEncounterSecondaryRotation * vMapUv * ${e.secondaryUvScale.toFixed(6)} +
		vec2(17.371, 41.239);
	vec2 scaleEncounterTertiaryUv =
		scaleEncounterTertiaryRotation * vMapUv * ${e.tertiaryUvScale.toFixed(6)} +
		vec2(63.113, 9.731);

	vec4 scaleEncounterPrimarySample = texture2D(map, scaleEncounterPrimaryUv);
	vec4 scaleEncounterSecondarySample = texture2D(map, scaleEncounterSecondaryUv);
	vec4 scaleEncounterTertiarySample = texture2D(map, scaleEncounterTertiaryUv);
	float scaleEncounterMacroField =
		0.5 +
		sin(dot(vScaleEncounterGroundLocalPosition, vec2(0.037, 0.061)) + 0.8) * 0.22 +
		cos(dot(vScaleEncounterGroundLocalPosition, vec2(-0.019, 0.043)) - 1.4) * 0.16;
	float scaleEncounterSecondaryWeight =
		mix(0.32, 0.68, smoothstep(0.2, 0.8, scaleEncounterMacroField));
	vec4 sampledDiffuseColor = mix(
		scaleEncounterPrimarySample,
		scaleEncounterSecondarySample,
		scaleEncounterSecondaryWeight
	);
	float scaleEncounterBroadWeight =
		0.1 + 0.12 * smoothstep(0.28, 0.76, 1.0 - scaleEncounterMacroField);
	sampledDiffuseColor = mix(
		sampledDiffuseColor,
		scaleEncounterTertiarySample,
		scaleEncounterBroadWeight
	);

	#ifdef DECODE_VIDEO_TEXTURE

		sampledDiffuseColor = sRGBTransferEOTF(sampledDiffuseColor);

	#endif

	diffuseColor *= sampledDiffuseColor;

#endif
`}var Ga=`
	// Preserve a solid floor around either observer. The two masks only overlap
	// in remote middle distance, where ordered rejection reveals the panorama
	// gradually without putting a transparent second floor beneath the camera.
	float scaleEncounterLocalRadius = length(vScaleEncounterGroundLocalPosition);
	float scaleEncounterIrregularRadius =
		scaleEncounterLocalRadius +
		sin(vScaleEncounterGroundLocalPosition.x * 0.071 +
			vScaleEncounterGroundLocalPosition.y * 0.043) * 7.0 +
		cos(vScaleEncounterGroundLocalPosition.x * 0.029 -
			vScaleEncounterGroundLocalPosition.y * 0.057) * 4.0;
	float scaleEncounterSubjectFade = smoothstep(
		uScaleEncounterSubjectFade.x,
		uScaleEncounterSubjectFade.y,
		scaleEncounterIrregularRadius
	);
	float scaleEncounterCameraFade = smoothstep(
		uScaleEncounterCameraFade.x,
		uScaleEncounterCameraFade.y,
		length(vViewPosition)
	);
	float scaleEncounterAtmosphere =
		saturate(scaleEncounterSubjectFade * scaleEncounterCameraFade * 1.18);
	diffuseColor.rgb = mix(
		diffuseColor.rgb,
		uScaleEncounterHorizonColour,
		scaleEncounterAtmosphere * uScaleEncounterHorizonColourStrength
	);

	float scaleEncounterCoverageLoss = smoothstep(
		0.08,
		0.96,
		scaleEncounterSubjectFade * scaleEncounterCameraFade
	) * uScaleEncounterMaximumCoverageLoss;
	diffuseColor.a *= 1.0 - scaleEncounterCoverageLoss;
`;function Ka(e,t){e.uniforms.uScaleEncounterSubjectFade={value:[t.subjectFadeStartMeters,t.subjectFadeEndMeters]},e.uniforms.uScaleEncounterCameraFade={value:[t.cameraFadeStartMeters,t.cameraFadeEndMeters]},e.uniforms.uScaleEncounterHorizonColour={value:t.horizonColour},e.uniforms.uScaleEncounterHorizonColourStrength={value:t.horizonColourStrength},e.uniforms.uScaleEncounterMaximumCoverageLoss={value:t.maximumCoverageLoss},e.vertexShader=Ua(e.vertexShader),e.fragmentShader=e.fragmentShader.replace(`varying vec3 vViewPosition;`,`varying vec3 vViewPosition;
varying vec2 vScaleEncounterGroundLocalPosition;
uniform vec2 uScaleEncounterSubjectFade;
uniform vec2 uScaleEncounterCameraFade;
uniform vec3 uScaleEncounterHorizonColour;
uniform float uScaleEncounterHorizonColourStrength;
uniform float uScaleEncounterMaximumCoverageLoss;`).replace(`#include <map_fragment>`,Wa(t)).replace(`#include <color_fragment>`,`#include <color_fragment>
${Ga}`)}function qa(e,t={}){if(e.userData[Ba]===za)return e;let n=Ha(t),r=e.onBeforeCompile.bind(e),i=e.customProgramCacheKey.bind(e);return e.transparent=!0,e.depthWrite=!0,e.onBeforeCompile=(e,t)=>{r(e,t),Ka(e,n)},e.customProgramCacheKey=()=>`${i()}|${za}|${n.secondaryUvScale.toFixed(6)}|${n.tertiaryUvScale.toFixed(6)}|${n.maximumCoverageLoss.toFixed(2)}`,e.userData[Ba]=za,e.needsUpdate=!0,e}function Ja(e,t,n,r){if(e.isEmpty())return n-r;let i=e.clone().applyMatrix4(t);return n-Math.max(0,r)-i.min.y}var J=Math.PI*2,Ya=new L(0,1,0);function Xa(e){return e.href}var Za=Xa(new URL(``+new URL(`midground-vegetation-atlas-v2-CTeczLcn.webp`,import.meta.url).href,``+import.meta.url)),Qa=Xa(new URL(``+new URL(`midground-frond-components-v4-final-CkKk0QEp.webp`,import.meta.url).href,``+import.meta.url)),$a=Xa(new URL(``+new URL(`midground-araucaria-components-v4-C9mlaJyU.webp`,import.meta.url).href,``+import.meta.url)),eo={high:Xa(new URL(``+new URL(`midground-mature-tree-atlas-v1-Bc-sXq5r.webp`,import.meta.url).href,``+import.meta.url)),low:Xa(new URL(``+new URL(`midground-mature-tree-atlas-v1-1024-BGAc4973.webp`,import.meta.url).href,``+import.meta.url))};function to(){return typeof window>`u`?eo.low:window.innerWidth*Math.max(window.devicePixelRatio,1)>=1280?eo.high:eo.low}var no=1834620867,ro=[{count:46,heightMaximum:11.2,heightMinimum:3.6,kind:`araucarian-conifer`,maximumRadius:118,minimumRadius:20,minimumSeparation:7.8,patches:[{x:-27,z:-24,radiusX:12,radiusZ:9,weight:.56},{x:31,z:-27,radiusX:13,radiusZ:10,weight:.68},{x:-34,z:19,radiusX:14,radiusZ:10,weight:.52},{x:36,z:26,radiusX:15,radiusZ:11,weight:.44},{x:-34,z:-34,radiusX:19,radiusZ:15,weight:.78},{x:37,z:-39,radiusX:18,radiusZ:17,weight:.62},{x:-45,z:21,radiusX:21,radiusZ:16,weight:.64},{x:43,z:34,radiusX:23,radiusZ:18,weight:.46},{x:2,z:49,radiusX:20,radiusZ:16,weight:.38},{x:-58,z:-63,radiusX:31,radiusZ:35,weight:1.42},{x:64,z:-72,radiusX:30,radiusZ:34,weight:1.02},{x:6,z:-112,radiusX:24,radiusZ:26,weight:.32},{x:-132,z:-31,radiusX:38,radiusZ:28,weight:1.18},{x:139,z:21,radiusX:31,radiusZ:43,weight:.7},{x:-82,z:112,radiusX:34,radiusZ:46,weight:1.02},{x:42,z:151,radiusX:58,radiusZ:26,weight:.66},{x:121,z:94,radiusX:47,radiusZ:31,weight:1.14},{x:-157,z:34,radiusX:25,radiusZ:52,weight:.76}],seed:1834620878},{count:58,heightMaximum:5.2,heightMinimum:1.75,kind:`tree-fern`,maximumRadius:62,minimumRadius:10,minimumSeparation:2.75,patches:[{x:-14,z:-18,radiusX:9,radiusZ:6,weight:1.46},{x:16,z:13,radiusX:9,radiusZ:7,weight:1.08},{x:-25,z:12,radiusX:10,radiusZ:7,weight:.92},{x:24,z:-12,radiusX:10,radiusZ:7,weight:1.18},{x:-42,z:-49,radiusX:22,radiusZ:17,weight:1.25},{x:53,z:-57,radiusX:25,radiusZ:18,weight:.82},{x:-72,z:25,radiusX:29,radiusZ:18,weight:1.08},{x:68,z:52,radiusX:31,radiusZ:20,weight:.62},{x:-17,z:72,radiusX:25,radiusZ:24,weight:.9},{x:27,z:-78,radiusX:22,radiusZ:27,weight:.72}],seed:1834620904},{count:76,heightMaximum:2.25,heightMinimum:.58,kind:`cycad`,maximumRadius:58,minimumRadius:9,minimumSeparation:2.1,patches:[{x:-8,z:-13,radiusX:7,radiusZ:5,weight:1.35},{x:14,z:11,radiusX:7,radiusZ:6,weight:.94},{x:-23,z:15,radiusX:9,radiusZ:6,weight:1.12},{x:22,z:-16,radiusX:9,radiusZ:6,weight:1.28},{x:-31,z:-43,radiusX:20,radiusZ:14,weight:1.08},{x:41,z:-50,radiusX:21,radiusZ:16,weight:.74},{x:-58,z:29,radiusX:26,radiusZ:15,weight:1.18},{x:55,z:43,radiusX:27,radiusZ:16,weight:.54},{x:-8,z:61,radiusX:23,radiusZ:19,weight:.82},{x:13,z:-66,radiusX:27,radiusZ:14,weight:.96}],seed:1834620938}],io=[{height:5.8,kind:`araucarian-conifer`,radius:32.8,tiltX:.012,tiltZ:-.018,widthScale:.93,x:-26,yaw:.44,z:-20},{height:10.4,kind:`araucarian-conifer`,radius:67.5,tiltX:-.015,tiltZ:.01,widthScale:1.06,x:-52,yaw:2.18,z:-43},{height:6.4,kind:`araucarian-conifer`,radius:38.4,tiltX:.018,tiltZ:.014,widthScale:.88,x:30,yaw:4.72,z:-24},{height:10.9,kind:`araucarian-conifer`,radius:76.5,tiltX:-.012,tiltZ:-.017,widthScale:1.08,x:57,yaw:1.28,z:-51},{height:7.2,kind:`araucarian-conifer`,radius:31.6,tiltX:-.009,tiltZ:.014,widthScale:.91,x:-10,yaw:5.12,z:-30},{height:6.6,kind:`araucarian-conifer`,radius:36.1,tiltX:.013,tiltZ:-.011,widthScale:.87,x:12,yaw:2.37,z:-34},{height:6.9,kind:`araucarian-conifer`,radius:45,tiltX:.01,tiltZ:.016,widthScale:.91,x:-36,yaw:5.34,z:27},{height:8.1,kind:`araucarian-conifer`,radius:53.4,tiltX:-.017,tiltZ:.012,widthScale:1.02,x:42,yaw:3.54,z:33},{height:8.1,kind:`araucarian-conifer`,radius:66.5,tiltX:.014,tiltZ:-.01,widthScale:.96,x:-64,yaw:1.82,z:18},{height:6.7,kind:`araucarian-conifer`,radius:70.5,tiltX:-.011,tiltZ:.018,widthScale:.86,x:67,yaw:.76,z:22},{height:9.1,kind:`araucarian-conifer`,radius:66.5,tiltX:.019,tiltZ:.008,widthScale:1.03,x:-24,yaw:4.06,z:-62},{height:7.5,kind:`araucarian-conifer`,radius:76.7,tiltX:-.014,tiltZ:-.012,widthScale:.9,x:20,yaw:2.64,z:-74},{height:10.6,kind:`araucarian-conifer`,radius:108.9,tiltX:.01,tiltZ:-.015,widthScale:1.04,x:-76,yaw:5.82,z:78},{height:8.8,kind:`araucarian-conifer`,radius:108.1,tiltX:-.016,tiltZ:.011,widthScale:.94,x:84,yaw:3.08,z:68}];function ao(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Y(e){return Math.round(e*1e4)/1e4}function oo(e,t,n,r){return Math.hypot(e-Math.max(n,Math.min(r,e)),t)}function so(e,t){let n=((e-2.2)/12)**2+(t/7.2)**2>=1,r=oo(e,t,-24,-6)>=6;return n&&r}function co(e,t,n,r){let i=r*r;return e.every(e=>{let r=e.x-t,a=e.z-n;return r*r+a*a>=i})}function lo(e,t){let n=e.reduce((e,t)=>e+t.weight,0),r=t()*n;for(let t of e)if(r-=t.weight,r<=0)return t;return e.at(-1)}function uo(e,t,n){let r=Math.max(0,Math.min(1,(t-e.minimumRadius)/(e.maximumRadius-e.minimumRadius)));if(e.kind===`tree-fern`){if(!(t>=24&&n()>.52))return .45+n()**.8*.9;let r=Math.max(0,Math.min(1,(t-24)/38));return Math.min(e.heightMaximum,1.85+r*.75+n()**1.35*2.6)}if(e.kind===`cycad`){let r=.86+Math.max(0,Math.min(1,(t-9)/49))*1.39;return e.heightMinimum+n()*(r-e.heightMinimum)}let i=e.kind===`araucarian-conifer`?Math.min(e.heightMaximum,5.8+r*9.2):e.heightMaximum;return e.heightMinimum+n()*(i-e.heightMinimum)}function fo(e,t=[]){let n=ao(e.seed),r=[...t];for(let t=r.length;t<e.count;t+=1){let i;for(let t=0;t<1e3;t+=1){let t=lo(e.patches,n),a=n()*J,o=n()**.72,s=t.x+Math.cos(a)*t.radiusX*o+(n()-.5)*2.4,c=t.z+Math.sin(a)*t.radiusZ*o+(n()-.5)*2.4,l=Math.hypot(s,c),u=Math.floor((Math.atan2(c,s)+J)%J/J*12),d=e.kind===`araucarian-conifer`?r.filter(e=>Math.floor((Math.atan2(e.z,e.x)+J)%J/J*12)===u).length:0,f=Math.ceil(e.count/12)+3;if(!(l<e.minimumRadius||l>e.maximumRadius||e.kind===`araucarian-conifer`&&d>=f||!so(s,c)||!co(r,s,c,e.minimumSeparation))){i={x:s,z:c};break}}if(!i)throw Error(`Unable to place ${e.kind} ${t+1}/${e.count}`);let a=Math.hypot(i.x,i.z),o=e.kind===`araucarian-conifer`?.05:e.kind===`tree-fern`?.065:.08;r.push({height:Y(uo(e,a,n)),kind:e.kind,radius:Y(a),tiltX:Y((n()-.5)*o),tiltZ:Y((n()-.5)*o),widthScale:Y(.84+n()*.3),x:Y(i.x),yaw:Y(n()*J),z:Y(i.z)})}return r}function po(e=`current`){let t=Ne(e);return ro.flatMap(n=>{let r=fo(n,n.kind===`araucarian-conifer`?io:[]);return e===`current`?r:fo({...n,count:Pe(n.count,e),minimumSeparation:n.minimumSeparation/Math.sqrt(t),seed:n.seed^(e===`1.25x`?621959697:1343556215)},r)})}function mo(e,t){if(e.isEmpty())return null;let n=new R(t.x,t.z);if(n.lengthSq()<=1e-8)return null;n.normalize();let r=new R(n.y,-n.x),i=e.getCenter(new L),a=e.getSize(new L);return{centreX:i.x,centreZ:i.z,directionX:n.x,directionZ:n.y,subjectHalfDepth:(Math.abs(n.x)*a.x+Math.abs(n.y)*a.z)*.5,subjectHalfWidth:(Math.abs(r.x)*a.x+Math.abs(r.y)*a.z)*.5}}function ho(e){let t=e.kind===`araucarian-conifer`?e.radius>=68?.34:.28:e.kind===`tree-fern`?.52:.46;return Math.max(.35,e.height*e.widthScale*t)}function go(e,t){let n=e.x-t.centreX,r=e.z-t.centreZ,i=n*t.directionX+r*t.directionZ,a=Math.abs(n*t.directionZ-r*t.directionX),o=ho(e),s=e.height>=1.6||o>=.72,c=i>=-t.subjectHalfDepth-o,l=2.4+Math.max(0,i)*.035,u=a<=t.subjectHalfWidth+o+l;return!(s&&c&&u)}function _o(e){let t=e.map(e=>e.index?e.toNonIndexed():e),n=ye(t,!1);if(t.forEach(e=>e.dispose()),e.forEach(e=>{t.includes(e)||e.dispose()}),!n)throw Error(`Unable to merge production midground geometry`);return n.computeBoundingBox(),n.computeBoundingSphere(),n}function vo(e,t){let n=e.getAttribute(`position`),r=new Float32Array(n.count*3);for(let e=0;e<n.count;e+=1)t.toArray(r,e*3);return e.setAttribute(`color`,new B(r,3)),e}function yo(e,t,n){let r=e.getAttribute(`position`),i=new Float32Array(r.count*2);for(let e=0;e<r.count;e+=1)i[e*2]=t,i[e*2+1]=n;return e.setAttribute(`uv`,new B(i,2)),e}function bo(e,t){if(!t)return;let n=Array.isArray(e)?e:[e];for(let e of n)for(let n of Object.values(e))n instanceof N&&t.add(n)}function xo(e,t,n,r=`height`){let i=e.getObjectByName(t);if(!(i instanceof b))return null;let a=i;e.updateMatrixWorld(!0),i.updateMatrixWorld(!0);let o=new V().copy(e.matrixWorld).invert().multiply(a.matrixWorld),s=a.geometry.clone();s.applyMatrix4(o),s.computeBoundingBox();let c=s.boundingBox?.clone();if(!c)return s.dispose(),null;let l=Math.max(.001,c.max.y-c.min.y),u=Math.max(.001,c.max.x-c.min.x,c.max.z-c.min.z),d=(c.min.x+c.max.x)*.5,f=(c.min.z+c.max.z)*.5;s.translate(-d,-c.min.y,-f);let p=r===`height`?l:u;s.scale(1/p,1/p,1/p),s.computeBoundingBox();let m=s.boundingBox;if(r===`height`&&t.startsWith(`fern_02_`)&&m){let e=Math.max(m.max.x-m.min.x,m.max.z-m.min.z),t=Math.min(1,1.24/e);s.scale(t,1,t)}s.computeBoundingBox(),s.computeBoundingSphere(),s.name=`scale-encounter-normalized-${t}`;let h=Array.isArray(a.material)?a.material.map(e=>e.clone()):a.material.clone(),g=Array.isArray(h)?h:[h];for(let e of g)e.side=2,e.alphaToCoverage=!0,e instanceof _&&(e.metalness=0,e.roughness=Math.max(.78,e.roughness),e.envMapIntensity=Math.min(.82,e.envMapIntensity));return bo(h,n),{geometry:s,height:Math.max(.001,(s.boundingBox?.max.y??1)-(s.boundingBox?.min.y??0)),material:h,sourceName:t}}function So(e,n,r,i,a,o,s,c){let l=n.clone().normalize(),u=new t(a,i,r,5,1,!1);return u.applyQuaternion(new T().setFromUnitVectors(Ya,l)),u.translate(e.x+l.x*r*.5,e.y+l.y*r*.5,e.z+l.z*r*.5),yo(u,s,c),vo(u,o)}function Co(e,t,n,r,i,a,o,s){for(let c=0;c<a;c+=1){let l=i+c/a*J,u=new L(Math.cos(l),-.08-c%2*.025,Math.sin(l)).normalize();e.push(So(new L(0,n*.42,0),u,r*(.84+c%3*.08),n*(.52+c%2*.08),n*.13,t,o,s))}}function wo(e){let t=.004;return{u0:(e+t)/8,u1:(e+1-t)/8,v0:.004,v1:.996}}function To(e,t,n=!1){let r=wo(t),i=e.getAttribute(`uv`);for(let e=0;e<i.count;e+=1)i.setXY(e,r.u0+(r.u1-r.u0)*(n?1-i.getX(e):i.getX(e)),r.v0+(r.v1-r.v0)*i.getY(e));return i.needsUpdate=!0,e}var Eo=8;function Do(e){let t=e%4,n=Math.floor(e/4),r=.006,i=.006;return{u0:(t+r)/4,u1:(t+1-r)/4,v0:1-(n+1-i)/2,v1:1-(n+i)/2}}function Oo(e){let t=[],n=Do(e);for(let e=0;e<3;e+=1){let r=e>0,i=r?.955+e*.012:1,a=new U(r?.87+e*.035:1,i,1,1),o=a.getAttribute(`uv`);for(let e=0;e<o.count;e+=1){let t=r?1-o.getX(e):o.getX(e);o.setXY(e,n.u0+(n.u1-n.u0)*t,n.v0+(n.v1-n.v0)*o.getY(e))}o.needsUpdate=!0,a.rotateY(Math.PI/3*e),a.translate(0,i*.5,0),t.push(a)}let r=ye(t,!1);if(t.forEach(e=>e.dispose()),!r)throw Error(`Unable to merge mature tree profile`);return r.name=`scale-encounter-mature-tree-profile-${e+1}`,r.computeBoundingBox(),r.computeBoundingSphere(),r}function ko(e,t,r){if(e.length===0)return null;let i=new n({alphaTest:.32,alphaToCoverage:!0,color:`#b8beaf`,fog:!0,map:r,side:2,transparent:!1});i.name=`scale-encounter-production-mature-tree-material`;let a=Array.from({length:Eo},(e,t)=>Oo(t)),o=a.reduce((e,t)=>e+t.getAttribute(`position`).count,0),c=a.reduce((e,t)=>e+(t.index?.count??0),0),l=new O(e.length,o,c,i);l.name=`scale-encounter-production-mature-tree-colonies`,l.castShadow=!1,l.receiveShadow=!1,l.perObjectFrustumCulled=!0,l.sortObjects=!1;let u=a.map(e=>l.addGeometry(e)),d=new s,f=[],p=[],h=0;e.forEach((e,n)=>{let r=(Math.floor(e.yaw*1e4)+n*5)%Eo,i=t(e.x,e.z),o=Math.min(.085,e.height*.005);d.position.set(e.x,i-o,e.z),d.rotation.set(0,e.yaw,0),d.scale.set(e.height*e.widthScale,e.height,e.height*e.widthScale),d.updateMatrix();let s=l.addInstance(u[r]);l.setMatrixAt(s,d.matrix);let c=Math.max(0,Math.min(1,(e.radius-34)/112)),m=(n*7+r*3)%9*.011;l.setColorAt(s,new P().setRGB(.82-c*.12+m,.87-c*.11+m*.8,.73-c*.09+m*.45)),f.push({...e,burialDepth:o,groundingError:0,instanceId:s,profile:r,terrainY:i,worldBottomY:Y(i-o)}),p.push({height:e.height,instanceId:s,worldCentre:new L(e.x,i+e.height*.5,e.z)}),h+=Lo(a[r])}),l.computeBoundingBox(),l.computeBoundingSphere(),l.userData.scaleEncounterProductionMidgroundKind=`araucarian-conifer`,l.userData.scaleEncounterProductionMidgroundPlacements=f,l.userData.scaleEncounterProductionMidgroundProjectedPixelGate=7;let g=new R,_=new L,v=l.onBeforeRender.bind(l);return l.onBeforeRender=(e,t,n,r,i,a)=>{if(n instanceof m){e.getSize(g),n.getWorldPosition(_);let t=g.y/(2*Math.tan(n.fov*Math.PI/360)),r=0;p.forEach(e=>{let n=Math.max(.01,_.distanceTo(e.worldCentre)),i=e.height*t/n>=7;l.setVisibleAt(e.instanceId,i),i&&(r+=1)}),l.userData.scaleEncounterProductionMidgroundVisibleMatureTrees=r}v(e,t,n,r,i,a)},{mesh:l,triangles:h}}var Ao=4;function jo(e,t,n,r){let i=.008,a=.008,o=(t+i)/4,s=(t+1-i)/4,c=3-n-1,l=(c+a)/3,u=(c+1-a)/3,d=e.getAttribute(`uv`);for(let e=0;e<d.count;e+=1){let t=r?1-d.getX(e):d.getX(e);d.setXY(e,o+(s-o)*t,l+(u-l)*d.getY(e))}return d.needsUpdate=!0,e}function Mo(e,t,n,r,i,a,o,s,c){let l=[],u=s?2:1;for(let s=0;s<u;s+=1){let u=jo(new U(n*(s===0?1:.86),r*(s===0?1:.92),1,1),i,a,s===1?!o:o);u.rotateY(-t+s*Math.PI*.5),u.rotateZ((a-1)*.045),u.translate(e.x,e.y+r*(.04+s*.015),e.z),l.push(vo(u,c))}return l}function No(e){let n=[],r=[],i=[.044,.056,.048,.04][e],a=i*[.24,.2,.26,.22][e],o=[10,8,9,11][e],s=[.2,.3,.17,.26][e],c=new P([`#5c4938`,`#65503d`,`#584737`,`#6a5440`][e]),l=[new P(`#c8d0b9`),new P(`#b8c5ac`),new P(`#d1d6c4`)],u=new t(a,i,1,8,5,!1);u.translate(0,.5,0),yo(u,.5,.5),n.push(vo(u,c)),Co(n,c,i,i*2.7,.29+e*.41,6,.5,.5);for(let t=0;t<o;t+=1){let a=t/Math.max(1,o-1),u=s+a*(.72-s),d=e*.47+t*.61,f=4+(t+e)%2,p=Math.sin(a*Math.PI)**.7,m=e===0?.235-a*.12:e===1?.105+p*.19:e===2?.24-a*.085:.19-a*.075;for(let o=0;o<f;o+=1){if(e===2&&(t*7+o*5+e)%11==0)continue;let s=d+o/f*J+((t*13+o*7+e*5)%9-4)*.017,p=m*(.84+(t*11+o*5+e)%7*.045),h=-.12+a*.34+((o+t)%3-1)*.025,g=new L(Math.cos(s),h,Math.sin(s)).normalize(),_=new L(0,u,0),v=i*(.34-a*.17)*(o%2?.92:1);n.push(So(_,g,p,Math.max(.006,v),Math.max(.0025,v*.2),c,.5,.5));let y=_.clone().addScaledVector(g,p*.92),b=p*(1.12+t%3*.07),x=b*(.48+o%2*.06);r.push(...Mo(y,s,b,x,(t+o+e)%4,(t+e*2)%3,(t+o)%2==1,o===0||(t+o+e)%5==0,l[(t+o+e)%l.length]))}}let d=new L(0,.7,0);n.push(So(d,Ya,.3,a*1.25,a*.5,c,.5,.5));for(let t=0;t<5;t+=1){let n=e*.37+t/5*J,i=.035+t%2*.018;r.push(...Mo(new L(Math.cos(n)*i,.9+t%3*.025,Math.sin(n)*i),n,.13+t%2*.025,.1+t%3*.012,(e+t)%4,(e*2+t)%3,t%2==1,!0,l[(e+t)%l.length]))}let f=_o(n),p=_o(r);return f.name=`scale-encounter-volumetric-araucaria-wood-${e+1}`,p.name=`scale-encounter-volumetric-araucaria-crown-${e+1}`,{crown:p,wood:f}}function Po(e,t,n,r){let i=new R,a=new L,o=e.onBeforeRender.bind(e);e.onBeforeRender=(s,c,l,u,d,f)=>{if(l instanceof m){s.getSize(i),l.getWorldPosition(a);let o=i.y/(2*Math.tan(l.fov*Math.PI/360)),c=0;t.forEach(t=>{let r=Math.max(.01,a.distanceTo(t.worldCentre)),i=t.height*o/r>=n;e.setVisibleAt(t.instanceId,i),i&&(c+=1)}),e.userData[r]=c}o(s,c,l,u,d,f)}}function Fo(e,t,n){if(e.length===0)return null;let r=Array.from({length:Ao},(e,t)=>No(t)),i=new _({color:`#806b56`,metalness:0,roughness:.97,vertexColors:!0});i.name=`scale-encounter-volumetric-araucaria-wood-material`;let a=new _({alphaTest:.36,alphaToCoverage:!0,color:`#d2dcc8`,emissive:`#31402c`,emissiveIntensity:.32,map:n,metalness:0,roughness:.94,side:2,transparent:!1,vertexColors:!0});a.name=`scale-encounter-volumetric-araucaria-crown-material`;let o=(t,n)=>{let i=r.map(e=>e[t]),a=new O(e.length,i.reduce((e,t)=>e+t.getAttribute(`position`).count,0),i.reduce((e,t)=>e+(t.index?.count??0),0),n);return a.name=`scale-encounter-production-volumetric-araucarias-${t}`,a.castShadow=!1,a.receiveShadow=!1,a.perObjectFrustumCulled=!0,a.sortObjects=!1,{geometryIds:i.map(e=>a.addGeometry(e)),mesh:a}},c=o(`wood`,i),l=o(`crown`,a),u=new s,d=[],f=[],p=0;return e.forEach((e,n)=>{let i=(Math.floor(e.yaw*1e3)+n*7)%Ao,a=r[i],o=t(e.x,e.z);u.position.set(e.x,0,e.z),u.rotation.set(e.tiltX*.22,e.yaw,e.tiltZ*.22),u.scale.set(e.height*e.widthScale,e.height,e.height*e.widthScale),u.updateMatrix();let s=a.wood.boundingBox.clone().union(a.crown.boundingBox.clone()).applyMatrix4(u.matrix),m=Math.min(.1,e.height*.006);u.position.y=o-m-s.min.y,u.updateMatrix();let h=a.wood.boundingBox.clone().union(a.crown.boundingBox.clone()).applyMatrix4(u.matrix),g=c.mesh.addInstance(c.geometryIds[i]),_=l.mesh.addInstance(l.geometryIds[i]);c.mesh.setMatrixAt(g,u.matrix),l.mesh.setMatrixAt(_,u.matrix);let v=Math.max(0,Math.min(1,(e.radius-42)/68)),y=(n*11+i*5)%7*.012;c.mesh.setColorAt(g,new P().setRGB(.75-v*.08+y,.68-v*.07+y*.7,.56-v*.06+y*.4)),l.mesh.setColorAt(_,new P().setRGB(.88-v*.07+y,.94-v*.06+y*.8,.82-v*.05+y*.5)),d.push({...e,burialDepth:m,groundingError:Y(h.min.y-(o-m)),profile:i,terrainY:o,worldBottomY:Y(h.min.y)}),f.push({height:e.height,instanceId:g,worldCentre:h.getCenter(new L)}),p+=Lo(a.wood)+Lo(a.crown)}),c.mesh.computeBoundingBox(),c.mesh.computeBoundingSphere(),l.mesh.computeBoundingBox(),l.mesh.computeBoundingSphere(),c.mesh.userData.scaleEncounterProductionMidgroundKind=`araucarian-conifer`,c.mesh.userData.scaleEncounterProductionMidgroundRole=`volumetric-wood`,c.mesh.userData.scaleEncounterProductionMidgroundPlacements=d,l.mesh.userData.scaleEncounterProductionMidgroundKind=`araucarian-conifer`,l.mesh.userData.scaleEncounterProductionMidgroundRole=`volumetric-crown`,Po(c.mesh,f,9,`scaleEncounterProductionMidgroundVisibleVolumetricTrees`),Po(l.mesh,f,9,`scaleEncounterProductionMidgroundVisibleVolumetricTrees`),r.forEach(({crown:e,wood:t})=>{e.dispose(),t.dispose()}),{meshes:[c.mesh,l.mesh],triangles:p}}function Io(e,n,r){let i=e===`araucarian-conifer`?0:e===`tree-fern`?1:2,a=e===`araucarian-conifer`?.78:e===`tree-fern`?1.06:1.12,o=[],s=r===`far`?2:e===`araucarian-conifer`?3:2,c=new P(n===0?`#f7faf2`:`#f1f5eb`);for(let t=0;t<s;t+=1){let r=i+(t+n)%2*3,l=.91+(t*7+n*5+e.length)%5*.035,u=To(new U(a*(.88+(t*5+n*3)%4*.075),l,1,1),r,(t+n)%3==1);u.rotateY(t/s*Math.PI+(n===0?.035:-.045)),u.translate(((t*11+n*7)%3-1)*.018,l*.5,((t*13+n*5)%3-1)*.015),o.push(vo(u,c))}let l=e===`araucarian-conifer`?.78:e===`tree-fern`?.07:.12,u=e===`araucarian-conifer`?.038:e===`tree-fern`?.05:.08,d=(6+n+.5)/8,f=.5,p=new P(n===0?`#f6f0e5`:`#ede5d8`),m=new t(u*.55,u,l,r===`far`?5:7,2,!1);m.translate(0,l*.5,0),yo(m,d,f),o.push(vo(m,p)),Co(o,p,u,u*2.8,n*.57,r===`far`?4:5,d,f);let h=_o(o);return h.name=`scale-encounter-${e}-atlas-silhouette-prototype`,{geometry:h,height:Math.max(.001,h.boundingBox?.max.y??1)}}function Lo(e){return(e.index?.count??e.getAttribute(`position`).count)/3}function Ro(e,t,n,r,i){let a=r===`araucarian-conifer`?1.25:r===`tree-fern`?.62:.4,o=(e(t+a,n)-e(t-a,n))/(a*2),s=(e(t,n+a)-e(t,n-a))/(a*2);return i.set(-o,1,-s).normalize()}function zo(e,t){return e===`araucarian-conifer`?Math.min(.085,t*.005):e===`tree-fern`?Math.min(.034,t*.007):Math.min(.014,t*.009)}function Bo(e,t,n,r,i,a){let o=Io(e,i,a),c=new _({alphaTest:.4,alphaToCoverage:!0,color:`#ffffff`,emissive:`#182016`,emissiveIntensity:.045,map:r,metalness:0,roughness:.9,side:2,vertexColors:!0});c.name=`scale-encounter-production-${e}-material`;let l=new E(o.geometry,c,t.length);l.name=`scale-encounter-production-${e}s-${a}-variant-${i===0?`a`:`b`}`;let u=new s,d=new s,f=new L,p=new T,m=new T;o.geometry.computeBoundingBox();let h=o.geometry.boundingBox?.clone();if(!h)throw Error(`Production ${e} prototype has no bounds`);let g=[];return t.forEach((t,r)=>{let i=n(t.x,t.z),a=t.height/o.height;u.position.set(t.x,0,t.z),Ro(n,t.x,t.z,e,f),p.setFromUnitVectors(Ya,f),m.setFromAxisAngle(Ya,t.yaw),d.rotation.set(t.tiltX,0,t.tiltZ),u.quaternion.copy(p).multiply(m).multiply(d.quaternion),u.scale.set(a*t.widthScale,a,a*t.widthScale),u.updateMatrix();let s=h.clone().applyMatrix4(u.matrix),c=zo(e,t.height);u.position.y=i-c-s.min.y,u.updateMatrix();let _=h.clone().applyMatrix4(u.matrix);l.setMatrixAt(r,u.matrix);let v=Math.max(0,Math.min(1,(t.radius-48)/136)),y=r*13%7*.009,b=.96-v*.11+y,x=new P().setRGB(b*.95,b,b*.9);l.setColorAt(r,x),g.push({...t,burialDepth:c,groundingError:Y(_.min.y-(i-c)),terrainY:i,worldBottomY:Y(_.min.y)})}),l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0),l.computeBoundingBox(),l.computeBoundingSphere(),l.castShadow=!1,l.receiveShadow=!1,l.userData.scaleEncounterProductionMidgroundKind=e,l.userData.scaleEncounterProductionMidgroundVariant=i,l.userData.scaleEncounterProductionMidgroundLod=a,l.userData.scaleEncounterProductionMidgroundPlacements=g,l.userData.scaleEncounterProductionMidgroundPrototypeTriangles=Lo(o.geometry),{mesh:l,triangles:Lo(o.geometry)*t.length}}function Vo(e,t,n,r,i,a){let o=xo(r,i,a);if(!o)return null;let c=new E(o.geometry,o.material,t.length);c.name=`scale-encounter-production-${e}s-scanned-${i}`;let l=new s,u=new s,d=new L,f=new T,p=new T,m=o.geometry.boundingBox?.clone();if(!m)return o.geometry.dispose(),(Array.isArray(o.material)?o.material:[o.material]).forEach(e=>e.dispose()),null;let h=[];return t.forEach((t,r)=>{let a=n(t.x,t.z),s=t.height/o.height;l.position.set(t.x,0,t.z),Ro(n,t.x,t.z,e,d),f.setFromUnitVectors(Ya,d),p.setFromAxisAngle(Ya,t.yaw),u.rotation.set(t.tiltX,0,t.tiltZ),l.quaternion.copy(f).multiply(p).multiply(u.quaternion),l.scale.set(s*t.widthScale,s,s*t.widthScale),l.updateMatrix();let g=m.clone().applyMatrix4(l.matrix),_=zo(e,t.height);l.position.y=a-_-g.min.y,l.updateMatrix();let v=m.clone().applyMatrix4(l.matrix);c.setMatrixAt(r,l.matrix);let y=Math.max(0,Math.min(1,(t.radius-42)/130)),b=(r*17+i.length)%9*.008,x=(e===`araucarian-conifer`?.82:.76)-y*.09+b;c.setColorAt(r,new P().setRGB(x*.86,x*.96,x*.76)),h.push({...t,burialDepth:_,groundingError:Y(v.min.y-(a-_)),terrainY:a,worldBottomY:Y(v.min.y)})}),c.instanceMatrix.needsUpdate=!0,c.instanceColor&&(c.instanceColor.needsUpdate=!0),c.computeBoundingBox(),c.computeBoundingSphere(),c.castShadow=!1,c.receiveShadow=!1,c.userData.scaleEncounterProductionMidgroundKind=e,c.userData.scaleEncounterProductionMidgroundSource=i,c.userData.scaleEncounterProductionMidgroundPlacements=h,c.userData.scaleEncounterProductionMidgroundPrototypeTriangles=Lo(o.geometry),{mesh:c,triangles:Lo(o.geometry)*t.length}}function Ho(e,n){let r=[],i=e===`tree-fern`?.108:.17,a=e===`tree-fern`?.066:.11,o=e===`tree-fern`?.81:.93,s=.5,c=new P(e===`tree-fern`?`#75634f`:`#6d5f49`),l=new t(a,i,1,n===`near`?9:7,n===`near`?4:3,!1);l.translate(0,.5,0),yo(l,o,s),r.push(vo(l,c)),Co(r,c,i,i*(e===`tree-fern`?2.35:3.1),e===`tree-fern`?.37:.81,n===`near`?6:4,o,s);let u=_o(r);return u.name=`scale-encounter-${e}-${n}-grounded-support`,u}function Uo(e,t,n,r){let i=.008,a=.006,o=e.getAttribute(`uv`),s=(t+i)/4,c=(t+1-i)/4,l=3-n-1,u=(l+a)/3,d=(l+1-a)/3;for(let e=0;e<o.count;e+=1){let t=r?1-o.getX(e):o.getX(e);o.setXY(e,s+(c-s)*t,u+(d-u)*o.getY(e))}return o.needsUpdate=!0,e}function Wo(e,t,n,r){let i=t===`near`?e===`tree-fern`?12:9:8,a=t===`near`&&e===`tree-fern`?6:4,o=[],s=new L,c=new T,l=e===`tree-fern`?.035:.018,u=(t,r)=>{for(let i=0;i<t;i+=1){let a=n*.31+(r?.2:0)+i/t*J,u=(r?.72:1)*(.9+(i*7+n*3)%5*.035),d=Uo(new U(u*(e===`tree-fern`?r?.29:.34:.31),u,1,2),(i+n*2+ +!!r)%4,e===`tree-fern`?(i+n)%2:2,(i+n)%2==1);d.translate(0,u*.5,0);let f=r?.53:.94,p=e===`tree-fern`?r?.82:.2+i%3*.045:r?.76:.43+i%2*.06;s.set(Math.cos(a)*f,p,Math.sin(a)*f).normalize(),c.setFromUnitVectors(Ya,s),d.applyQuaternion(c),d.applyQuaternion(new T().setFromAxisAngle(s,(i%3-1)*.09)),d.translate(0,l+(r?.035:0),0),o.push(vo(d,new P((i+n)%4==0?`#e3ead8`:`#f4f6ee`)))}};u(i,!1),u(a,!0);let d=_o(o);d.name=`scale-encounter-${e}-${t}-component-crown-${n}`;let f=new _({alphaTest:.37,alphaToCoverage:!0,color:`#ffffff`,emissive:`#172014`,emissiveIntensity:.035,map:r,metalness:0,roughness:.92,side:2,vertexColors:!0});f.name=`scale-encounter-${e}-component-crown-material-${n}`;let p=d.boundingBox;return{geometry:d,height:Math.max(.001,(p?.max.y??1)-(p?.min.y??0)),material:f,sourceName:`frond-component-${e}-${n}`}}function Go(e,t,n,r,i){if(t.length===0)return null;let a=[0,1].map(t=>Wo(e,r,t,i)),o=Ho(e,r);o.computeBoundingBox();let c=o.boundingBox?.clone();if(!c)return o.dispose(),null;let l=new _({color:`#6d5b48`,emissive:`#15100c`,emissiveIntensity:.035,metalness:0,roughness:.98,side:2,vertexColors:!0});l.name=`scale-encounter-production-${e}-support-material`;let u=new E(o,l,t.length);u.name=`scale-encounter-production-${e}s-${r}-grounded-supports`;let d=new s,f=new s,p=new s,m=new V,h=new V,g=new L,v=new T,y=new T,b=[];t.forEach((t,r)=>{let i=a[r%a.length];if(!i)return;let o=t.height*t.widthScale*(e===`tree-fern`?.7+r%4*.025:1.2+r%3*.055),s=i.height*o,l=(e===`tree-fern`?Math.max(t.height*.44,t.height-s*.9):t.height*(.05+r%3*.012))+Math.min(.14,t.height*.055),_=n(t.x,t.z),x=zo(e,t.height);d.position.set(t.x,0,t.z),Ro(n,t.x,t.z,e,g),v.setFromUnitVectors(Ya,g),y.setFromAxisAngle(Ya,t.yaw),f.rotation.set(t.tiltX,0,t.tiltZ),d.quaternion.copy(v).multiply(y).multiply(f.quaternion),d.scale.set(1,1,1),d.updateMatrix(),p.position.set(0,0,0),p.rotation.set(0,0,0),p.scale.set(l*t.widthScale,l,l*t.widthScale),p.updateMatrix(),m.multiplyMatrices(d.matrix,p.matrix);let S=c.clone().applyMatrix4(m);d.position.y=_-x-S.min.y,d.updateMatrix(),h.multiplyMatrices(d.matrix,p.matrix);let C=c.clone().applyMatrix4(h);u.setMatrixAt(r,h);let w=.98+r%5*.014;u.setColorAt(r,new P().setRGB(w*.86,w*.82,w*.72)),b.push({...t,burialDepth:x,groundingError:Y(C.min.y-(_-x)),rootY:Y(d.position.y),supportTopY:Y(C.max.y),terrainY:_,worldBottomY:Y(C.min.y)})}),u.instanceMatrix.needsUpdate=!0,u.instanceColor&&(u.instanceColor.needsUpdate=!0),u.computeBoundingBox(),u.computeBoundingSphere(),u.castShadow=!1,u.receiveShadow=!1,u.userData.scaleEncounterProductionMidgroundKind=e,u.userData.scaleEncounterProductionMidgroundLod=r,u.userData.scaleEncounterProductionMidgroundRole=`grounded-support`,u.userData.scaleEncounterProductionMidgroundPlacements=b;let x=[u],S=Lo(o)*t.length;return a.forEach((i,o)=>{let c=i.sourceName,l=t.filter((e,t)=>t%a.length===o),u=new E(i.geometry,i.material,l.length);u.name=`scale-encounter-production-${e}s-${r}-grounded-crowns-${c}`;let p=new s,m=new V,h=i.geometry.boundingBox?.clone(),_=[];h&&(l.forEach((t,r)=>{let s=r*a.length+o,c=t.height*t.widthScale*(e===`tree-fern`?.7+s%4*.025:1.2+s%3*.055),l=i.height*c,x=e===`tree-fern`?Math.max(t.height*.44,t.height-l*.9):t.height*(.05+s%3*.012),S=b[s];d.position.set(t.x,S.rootY,t.z),Ro(n,t.x,t.z,e,g),v.setFromUnitVectors(Ya,g),y.setFromAxisAngle(Ya,t.yaw),f.rotation.set(t.tiltX,0,t.tiltZ),d.quaternion.copy(v).multiply(y).multiply(f.quaternion),d.scale.set(1,1,1),d.updateMatrix(),p.position.set(0,x,0),p.rotation.set((s%3-1)*.025,s%5*.19,(s*3%3-1)*.018),p.scale.set(c,c,c),p.updateMatrix(),m.multiplyMatrices(d.matrix,p.matrix),u.setMatrixAt(r,m);let C=h.clone().applyMatrix4(m).min.y;_.push({...t,crownBottomY:Y(C),crownSupportGap:Y(Math.max(0,C-S.supportTopY)),supportTopY:S.supportTopY,terrainY:S.terrainY});let w=.97-Math.max(0,Math.min(1,(t.radius-34)/90))*.1+s%5*.009;u.setColorAt(r,new P().setRGB(w*.9,w,w*.84))}),u.instanceMatrix.needsUpdate=!0,u.instanceColor&&(u.instanceColor.needsUpdate=!0),u.computeBoundingBox(),u.computeBoundingSphere(),u.castShadow=!1,u.receiveShadow=!1,u.userData.scaleEncounterProductionMidgroundKind=e,u.userData.scaleEncounterProductionMidgroundLod=r,u.userData.scaleEncounterProductionMidgroundRole=`supported-crown`,u.userData.scaleEncounterProductionMidgroundSource=c,u.userData.scaleEncounterProductionMidgroundPlacements=_,x.push(u),S+=Lo(i.geometry)*l.length)}),{meshes:x,scannedInstances:t.length,triangles:S}}function Ko(e,t=`current`,n=null,r,i=null,a=null,o=[`araucarian-conifer`,`tree-fern`,`cycad`],s=null){let c=po(t).filter(e=>o.includes(e.kind)),l=a?c.filter(e=>go(e,a)):c,d=new ue,f=o.includes(`araucarian-conifer`),p=o.includes(`tree-fern`),m=o.includes(`cycad`),h=f?i??d.load(to()):null;h&&(h.name=`scale-encounter-production-mature-tree-atlas-v1`,h.colorSpace=u,h.magFilter=j,h.minFilter=I,h.generateMipmaps=!0);let g=f||m?d.load(Za):null;g&&(g.name=`scale-encounter-production-vegetation-atlas-v2`,g.colorSpace=u,g.magFilter=j,g.minFilter=I,g.generateMipmaps=!0);let _=p?s??d.load(Qa):null;_&&(_.name=`scale-encounter-production-frond-components-v4`,_.colorSpace=u,_.magFilter=j,_.minFilter=I,_.generateMipmaps=!0);let v=f?d.load($a):null;v&&(v.name=`scale-encounter-production-araucaria-components-v4`,v.colorSpace=u,v.magFilter=j,v.minFilter=I,v.generateMipmaps=!0);let y={"araucarian-conifer":0,cycad:0,"tree-fern":0},S=0,C=0,w=0,T=0,E={far:0,near:0},D=new x;D.name=`scale-encounter-production-midground-depth`;for(let t of o){let i=l.filter(e=>e.kind===t),a=ro.find(e=>e.kind===t).count;if(y[t]=i.length,t===`araucarian-conifer`){let a=i.filter(({radius:e})=>e<32).map(e=>({...e,height:Math.min(e.height,3.6)})),o=i.filter(({radius:e})=>e>=32&&e<68).map(e=>({...e,height:Math.max(3.4,Math.min(6.8,e.height*.7)),widthScale:e.widthScale*.9})),s=[],c=i.filter(({radius:e})=>e>=68).map((e,t)=>({...e,height:Math.max(13,Math.min(22,e.height*(1.78+(t*7+Math.round(e.radius))%6*.075))),widthScale:e.widthScale*(.78+(t*5+Math.round(e.yaw*10))%5*.055)}));E.near+=a.length,E.far+=o.length+s.length+c.length;let l=Fo(s,e,v);l&&(S+=l.triangles,C+=l.meshes.length,D.add(...l.meshes));let u=ko(c,e,h);u&&(S+=u.triangles,C+=1,D.add(u.mesh));let d=[{anchors:a,lod:`near`,names:[`real_tree_fir_sapling_a_lod0`,`real_tree_fir_sapling_b_lod0`,`real_tree_fir_sapling_c_lod0`,`real_tree_pine_sapling_small_a_lod0`,`real_tree_pine_sapling_small_b_lod0`,`real_tree_pine_sapling_small_c_lod0`]},{anchors:o,lod:`far`,names:[`real_tree_fir_sapling_a_lod1`,`real_tree_fir_sapling_b_lod1`,`real_tree_fir_sapling_c_lod1`,`real_tree_pine_sapling_small_a_lod1`,`real_tree_pine_sapling_small_b_lod1`,`real_tree_pine_sapling_small_c_lod1`]}];if(n!==null&&d.every(({names:e})=>e.every(e=>n.getObjectByName(e)instanceof b))&&n)d.forEach(({anchors:i,names:a})=>{a.forEach((o,s)=>{let c=i.filter((e,t)=>t%a.length===s);if(c.length===0)return;let l=Vo(t,c,e,n,o,r);l&&(S+=l.triangles,C+=1,w+=c.length,D.add(l.mesh))})});else if(g)for(let{anchors:n,lod:r}of d)for(let i of[0,1]){let a=n.filter((e,t)=>t%2===i);if(a.length===0)continue;let o=Bo(t,a,e,g,i,r);S+=o.triangles,C+=1,D.add(o.mesh)}continue}let o=t===`tree-fern`?64:54,s=t===`tree-fern`?52:44;for(let n of[`near`,`far`]){let r=i.filter(({radius:e},t)=>{let r=e<o&&(t<a||e<s);return n===`near`?r:!r});E[n]+=r.length;let c=t===`tree-fern`?r.filter(({height:e})=>e>=1.75):[],l=t===`tree-fern`?r.filter(({height:e})=>e<1.75):r;if(c.length>0&&_){let t=Go(`tree-fern`,c,e,n,_);t&&(S+=t.triangles,C+=t.meshes.length,T+=t.scannedInstances,D.add(...t.meshes))}for(let r of[0,1]){if(!g)continue;let i=l.filter((e,t)=>t%2===r);if(i.length===0)continue;let a=Bo(t,i,e,g,r,n);S+=a.triangles,C+=1,D.add(a.mesh)}}}let O=l.map(({radius:e})=>e),k={counts:y,density:t,drawCalls:C,estimatedTriangles:S,filteredForOverviewCount:c.length-l.length,layout:`irregular-habitat-patches`,lodCounts:E,maximumRadiusMeters:Math.max(...O),minimumRadiusMeters:Math.min(...O),seed:no,representation:D.getObjectByName(`scale-encounter-production-volumetric-araucarias-crown`)&&T>0?`hybrid-scanned-saplings-volumetric-araucarias-and-supported-tree-ferns`:D.getObjectByName(`scale-encounter-production-mature-tree-colonies`)&&T>0?`hybrid-scanned-saplings-supported-tree-ferns-and-atlas-tree-proxies`:D.getObjectByName(`scale-encounter-production-mature-tree-colonies`)?`instanced-alpha-clipped-multi-profile-world-space-proxies`:w>0?`instanced-scanned-tree-lods-and-grounded-frond-crowns`:`instanced-alpha-clipped-multi-profile-world-space-proxies`,treeAssetMode:D.getObjectByName(`scale-encounter-production-mature-tree-colonies`)?`authored-atlas-profiles`:w>0?`reviewed-cc0-scan-lods`:`authored-atlas-profiles`,totalInstances:l.length,unfilteredInstances:c.length};return D.userData.scaleEncounterProductionMidground=k,D}var qo=Math.PI*2,Jo=82,Yo=218,Xo=8;function Zo(e){return e.href}var Qo=Zo(new URL(``+new URL(`midground-mature-tree-atlas-v1-1024-BGAc4973.webp`,import.meta.url).href,``+import.meta.url)),$o=[{centreAngle:-2.68,halfSpan:.37,height:12.8,radius:221,radialDepth:34,seed:11},{centreAngle:-1.92,halfSpan:.24,height:10.6,radius:214,radialDepth:30,seed:23},{centreAngle:-1.23,halfSpan:.28,height:14.2,radius:226,radialDepth:35,seed:31},{centreAngle:-.16,halfSpan:.33,height:13.4,radius:232,radialDepth:38,seed:37},{centreAngle:1.08,halfSpan:.46,height:11.7,radius:218,radialDepth:32,seed:53},{centreAngle:2.31,halfSpan:.3,height:9.8,radius:235,radialDepth:28,seed:71}],es=[{angle:-2.95,angularSpread:.24,count:3,radius:152,radialSpread:25,seed:101},{angle:-2.05,angularSpread:.21,count:2,radius:174,radialSpread:22,seed:149},{angle:-.92,angularSpread:.28,count:3,radius:146,radialSpread:27,seed:211},{angle:.42,angularSpread:.23,count:2,radius:176,radialSpread:22,seed:277},{angle:1.61,angularSpread:.31,count:3,radius:142,radialSpread:27,seed:347},{angle:2.73,angularSpread:.24,count:2,radius:166,radialSpread:24,seed:419},{angle:-1.56,angularSpread:.5,count:4,radius:112,radialSpread:23,seed:503}];function ts(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function ns(e){return Math.round(e*1e4)/1e4}function rs(e=1){return es.flatMap(t=>{let n=ts(t.seed),r=Math.round(t.count*e),i=Math.max(2,Math.round(Math.sqrt(r))),a=Array.from({length:i},()=>({angle:t.angle+(n()-.5)*t.angularSpread*1.55,radius:t.radius+(n()-.5)*t.radialSpread*1.35}));return Array.from({length:r},(e,r)=>{let i=a[(r*5+t.seed)%a.length],o=i.angle+(n()+n()-1)*t.angularSpread*.22,s=Math.max(Jo,Math.min(Yo,i.radius+(n()+n()-1)*t.radialSpread*.24)),c=(s-Jo)/(Yo-Jo),l=t.seed===503?.78:.9;return{height:ns((8.4+n()*(7.2-c*1.8))*l),radius:ns(s),widthScale:ns(.56+n()*.32),x:ns(Math.cos(o)*s),yaw:ns(n()*qo),z:ns(Math.sin(o)*s)}})})}function is(){return{ridgeSectors:$o.map(e=>({...e})),trees:rs()}}function as(e,t){let n=[],r=[],i=[],a=new P(`#555950`),o=new P(`#62665d`),s=new P;for(let c of e){let e=n.length/3;for(let e=0;e<=36;e+=1){let i=e/36,l=c.centreAngle+(i*2-1)*c.halfSpan,u=Math.sin(i*Math.PI)**.72,d=Math.sin(i*Math.PI*2.15+c.seed*.37)*.12+Math.sin(i*Math.PI*4.4-c.seed*.19)*.045,f=c.height*u*Math.max(.42,.78+d),p=c.radius+Math.sin(i*Math.PI*2.7+c.seed*.21)*5.8+Math.sin(i*Math.PI*3.1+c.seed)*1.35;[p-c.radialDepth*.5,p,p+c.radialDepth*.5].forEach((e,i)=>{let c=Math.cos(l)*e,d=Math.sin(l)*e,p=t(c,d),m=i===1?f:i===0?.08:.03;n.push(c,p+m-.03,d),s.copy(a).lerp(o,i===1?.3+u*.18:.04).toArray(r,r.length)})}for(let t=0;t<36;t+=1){let n=e+t*3,r=n+3;i.push(n,r,n+1,r,r+1,n+1,n+1,r+1,n+2,r+1,r+2,n+2)}}let c=new M;return c.name=`scale-encounter-production-far-ridge-geometry`,c.setAttribute(`position`,new B(new Float32Array(n),3)),c.setAttribute(`color`,new B(new Float32Array(r),3)),c.setIndex(i),c.computeVertexNormals(),c.computeBoundingBox(),c.computeBoundingSphere(),c}function os(e){return(e.index?.count??e.getAttribute(`position`).count)/3}function ss(e){let t=e%4,n=Math.floor(e/4),r=.012,i=.009;return{u0:(t+r)/4,u1:(t+1-r)/4,v0:1-(n+1-i)/2,v1:1-(n+i)/2}}function cs(e){let t=[];for(let n=0;n<2;n+=1){let r=ss(e),i=n===0?1:.96,a=new U(n===0?1:.88,i,1,1),o=a.getAttribute(`uv`);for(let t=0;t<o.count;t+=1){let i=(e+n)%3==1?1-o.getX(t):o.getX(t);o.setXY(t,r.u0+(r.u1-r.u0)*i,r.v0+(r.v1-r.v0)*o.getY(t))}o.needsUpdate=!0,a.rotateY(n*Math.PI*.5+(e%2==0?.04:-.035)),a.translate(0,i*.5,0),t.push(a)}let n=ye(t,!1);if(t.forEach(e=>e.dispose()),!n)throw Error(`Unable to merge far tree cutout profile`);return n.name=`scale-encounter-production-far-tree-profile-${e+1}`,n.computeBoundingBox(),n.computeBoundingSphere(),n}function ls(e,t,r,i=null){if(t.length===0)return{drawCalls:0,profileCount:Xo,representation:`alpha-clipped-multi-profile-world-space-fog-proxies`,triangles:0};let a=i??new ue().load(Qo);a.name=`scale-encounter-production-mature-tree-atlas-v1`,a.colorSpace=u,a.magFilter=j,a.minFilter=I,a.generateMipmaps=!0;let o=new n({alphaTest:.46,alphaToCoverage:!0,color:`#c5ccba`,fog:!0,map:a,side:2,transparent:!1});o.name=`scale-encounter-production-far-tree-material`;let c=Array.from({length:Xo},(e,t)=>cs(t)),l=c.reduce((e,t)=>e+t.getAttribute(`position`).count,0),d=c.reduce((e,t)=>e+(t.index?.count??0),0),f=new O(t.length,l,d,o);f.name=`scale-encounter-production-far-tree-colonies`,f.castShadow=!1,f.receiveShadow=!1,f.perObjectFrustumCulled=!0,f.sortObjects=!1;let p=c.map(e=>f.addGeometry(e)),h=new s,g=[],_=[],v=0;t.forEach((e,t)=>{let n=(Math.floor(e.yaw*1e3)+t*5)%Xo,i=r(e.x,e.z);h.position.set(e.x,i-.025,e.z),h.rotation.set((t%3-1)*.009,e.yaw,(t*5%3-1)*.008),h.scale.set(e.height*e.widthScale,e.height,e.height*e.widthScale),h.updateMatrix();let a=f.addInstance(p[n]);f.setMatrixAt(a,h.matrix),f.setColorAt(a,new P().setRGB(.4-t%4*.012,.48-t%5*.01,.35-t%3*.011)),g.push({...e,burialDepth:.025,profile:n,terrainY:i,worldBottomY:i-.025}),_.push({height:e.height,instanceId:a,worldCentre:new L(e.x,i+e.height*.5,e.z)}),v+=os(c[n])}),f.computeBoundingBox(),f.computeBoundingSphere(),f.userData.scaleEncounterFarTreeCount=t.length,f.userData.scaleEncounterFarTreeProfileCount=Xo,f.userData.scaleEncounterFarTreePlacements=g,f.userData.scaleEncounterFarTreeProjectedPixelGate=5;let y=new R,b=new L,x=f.onBeforeRender.bind(f);return f.onBeforeRender=(e,t,n,r,i,a)=>{if(n instanceof m){e.getSize(y),n.getWorldPosition(b);let t=y.y/(2*Math.tan(n.fov*Math.PI/360)),r=0;_.forEach(e=>{let n=Math.max(.01,b.distanceTo(e.worldCentre)),i=e.height*t/n>=5;f.setVisibleAt(e.instanceId,i),i&&(r+=1)}),f.userData.scaleEncounterFarTreeVisibleCount=r}x(e,t,n,r,i,a)},e.add(f),{drawCalls:1,profileCount:Xo,representation:`alpha-clipped-multi-profile-world-space-fog-proxies`,triangles:v}}function us(e,t=`current`,r=null,i,a=null){let o=is(),s=new b(as(o.ridgeSectors,e),new n({vertexColors:!0}));s.name=`scale-encounter-production-broken-far-ridges`,s.castShadow=!1,s.receiveShadow=!1,s.visible=!1;let c=new x;c.name=`scale-encounter-production-far-depth`,c.add(s);let l=rs(t===`current`?.8:t===`1.25x`?.95:1.1),u=ls(c,l,e,a),d=[...o.ridgeSectors.flatMap(({radius:e,radialDepth:t})=>[e-t*.5,e+t*.5])],f=os(s.geometry)+u.triangles,p={angularCoverageRatio:o.ridgeSectors.reduce((e,{halfSpan:t})=>e+t*2,0)/qo,density:t,drawCalls:u.drawCalls,estimatedTriangles:f,layout:`broken-ridge-sectors-and-offset-tree-colonies`,maximumRadiusMeters:Math.max(...d),minimumRadiusMeters:Math.min(...d),profileCount:u.profileCount,representation:u.representation,ridgeSectorCount:o.ridgeSectors.length,treeColonyCount:l.length>0?es.length:0,treeCount:l.length};return c.userData.scaleEncounterProductionFarDepth=p,c}var ds=`land-biome-stochastic-pbr-v1`,fs=`scaleEncounterLandBiomeGroundMaterial`;function ps(e,t){return typeof e==`number`&&Number.isFinite(e)?e:t}function ms(e){return e.replace(`varying vec3 vViewPosition;`,`varying vec3 vViewPosition;
varying vec2 vScaleEncounterLandBiomePosition;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
	vScaleEncounterLandBiomePosition = position.xz;`)}var hs=`varying vec3 vViewPosition;
varying vec2 vScaleEncounterLandBiomePosition;
uniform vec3 uScaleEncounterLandBiomeGroundMetrics;
uniform vec2 uScaleEncounterLandBiomeNormalFade;
uniform vec3 uScaleEncounterLandBiomeDarkTint;
uniform vec3 uScaleEncounterLandBiomeLightTint;
uniform float uScaleEncounterLandBiomeMacroStrength;

struct ScaleEncounterLandBiomeFrame {
	vec3 weights;
	vec2 uvA;
	vec2 uvB;
	vec2 uvC;
	float rotationA;
	float rotationB;
	float rotationC;
};

float scaleEncounterLandBiomeHash12(vec2 value) {
	vec3 hash = fract(vec3(value.xyx) * 0.1031);
	hash += dot(hash, hash.yzx + 33.33);
	return fract((hash.x + hash.y) * hash.z);
}

vec2 scaleEncounterLandBiomeHash22(vec2 value) {
	vec3 hash = fract(vec3(value.xyx) * vec3(0.1031, 0.1030, 0.0973));
	hash += dot(hash, hash.yzx + 33.33);
	return fract((hash.xx + hash.yz) * hash.zy);
}

float scaleEncounterLandBiomeNoise(vec2 point) {
	vec2 cell = floor(point);
	vec2 blend = fract(point);
	blend = blend * blend * (3.0 - 2.0 * blend);
	float a = scaleEncounterLandBiomeHash12(cell);
	float b = scaleEncounterLandBiomeHash12(cell + vec2(1.0, 0.0));
	float c = scaleEncounterLandBiomeHash12(cell + vec2(0.0, 1.0));
	float d = scaleEncounterLandBiomeHash12(cell + vec2(1.0, 1.0));
	return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
}

vec2 scaleEncounterLandBiomeRotateUv(vec2 uv, float rotation) {
	if (rotation < 0.5) return uv;
	if (rotation < 1.5) return vec2(-uv.y, uv.x);
	if (rotation < 2.5) return -uv;
	return vec2(uv.y, -uv.x);
}

vec2 scaleEncounterLandBiomeRestoreNormal(vec2 normalXy, float rotation) {
	if (rotation < 0.5) return normalXy;
	if (rotation < 1.5) return vec2(normalXy.y, -normalXy.x);
	if (rotation < 2.5) return -normalXy;
	return vec2(-normalXy.y, normalXy.x);
}

void scaleEncounterLandBiomeResolveTile(
	vec2 textureUv,
	vec2 tileId,
	out vec2 transformedUv,
	out float rotation
) {
	rotation = floor(
		scaleEncounterLandBiomeHash12(tileId + vec2(37.2, 91.7)) * 4.0
	);
	vec2 offset =
		scaleEncounterLandBiomeHash22(tileId + vec2(11.3, 53.1)) * 29.0;
	transformedUv =
		scaleEncounterLandBiomeRotateUv(textureUv, rotation) + offset;
}

ScaleEncounterLandBiomeFrame scaleEncounterLandBiomeResolveFrame(
	vec2 localPosition
) {
	vec2 gridPosition = vec2(
		localPosition.x - localPosition.y * 0.5773502692,
		localPosition.y * 1.1547005384
	) / uScaleEncounterLandBiomeGroundMetrics.y;
	vec2 baseCell = floor(gridPosition);
	vec2 withinCell = fract(gridPosition);
	vec2 tileA;
	vec2 tileB;
	vec2 tileC;
	vec3 weights;
	if (withinCell.x + withinCell.y < 1.0) {
		tileA = baseCell;
		tileB = baseCell + vec2(1.0, 0.0);
		tileC = baseCell + vec2(0.0, 1.0);
		weights = vec3(
			1.0 - withinCell.x - withinCell.y,
			withinCell.x,
			withinCell.y
		);
	} else {
		tileA = baseCell + vec2(1.0, 1.0);
		tileB = baseCell + vec2(0.0, 1.0);
		tileC = baseCell + vec2(1.0, 0.0);
		weights = vec3(
			withinCell.x + withinCell.y - 1.0,
			1.0 - withinCell.x,
			1.0 - withinCell.y
		);
	}
	weights = max(weights, vec3(0.0));
	weights *= weights * weights;
	weights /= max(dot(weights, vec3(1.0)), 0.0001);

	vec2 textureUv =
		localPosition / uScaleEncounterLandBiomeGroundMetrics.x;
	ScaleEncounterLandBiomeFrame frame;
	frame.weights = weights;
	scaleEncounterLandBiomeResolveTile(
		textureUv,
		tileA,
		frame.uvA,
		frame.rotationA
	);
	scaleEncounterLandBiomeResolveTile(
		textureUv,
		tileB,
		frame.uvB,
		frame.rotationB
	);
	scaleEncounterLandBiomeResolveTile(
		textureUv,
		tileC,
		frame.uvC,
		frame.rotationC
	);
	return frame;
}`,gs=`
	ScaleEncounterLandBiomeFrame scaleEncounterLandBiomeFrame =
		scaleEncounterLandBiomeResolveFrame(
			vScaleEncounterLandBiomePosition
		);
	float scaleEncounterLandBiomeNormalDetail = 1.0 - smoothstep(
		uScaleEncounterLandBiomeNormalFade.x,
		uScaleEncounterLandBiomeNormalFade.y,
		length(vViewPosition)
	);`,_s=`
#ifdef USE_MAP

	vec4 scaleEncounterLandBiomeMapA = texture2D(
		map,
		scaleEncounterLandBiomeFrame.uvA
	);
	vec4 scaleEncounterLandBiomeMapB = texture2D(
		map,
		scaleEncounterLandBiomeFrame.uvB
	);
	vec4 scaleEncounterLandBiomeMapC = texture2D(
		map,
		scaleEncounterLandBiomeFrame.uvC
	);
	vec4 sampledDiffuseColor =
		scaleEncounterLandBiomeMapA * scaleEncounterLandBiomeFrame.weights.x +
		scaleEncounterLandBiomeMapB * scaleEncounterLandBiomeFrame.weights.y +
		scaleEncounterLandBiomeMapC * scaleEncounterLandBiomeFrame.weights.z;

	#ifdef DECODE_VIDEO_TEXTURE

		sampledDiffuseColor = sRGBTransferEOTF(sampledDiffuseColor);

	#endif

	vec2 scaleEncounterLandBiomeWarp = vec2(
		scaleEncounterLandBiomeNoise(
			vScaleEncounterLandBiomePosition / 41.0 + vec2(8.3, -13.7)
		),
		scaleEncounterLandBiomeNoise(
			vScaleEncounterLandBiomePosition / 37.0 + vec2(-5.1, 17.9)
		)
	) - 0.5;
	float scaleEncounterLandBiomeMacro =
		scaleEncounterLandBiomeNoise(
			(vScaleEncounterLandBiomePosition + scaleEncounterLandBiomeWarp * 17.0) /
			53.0
		) * 0.62 +
		scaleEncounterLandBiomeNoise(
			vScaleEncounterLandBiomePosition / 19.0 + vec2(21.4, -7.6)
		) * 0.38;
	vec3 scaleEncounterLandBiomeMacroTint = mix(
		uScaleEncounterLandBiomeDarkTint,
		uScaleEncounterLandBiomeLightTint,
		scaleEncounterLandBiomeMacro
	);
	sampledDiffuseColor.rgb = mix(
		sampledDiffuseColor.rgb,
		sampledDiffuseColor.rgb * scaleEncounterLandBiomeMacroTint,
		uScaleEncounterLandBiomeMacroStrength
	);
	diffuseColor *= sampledDiffuseColor;

#endif`,vs=`
float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	float scaleEncounterLandBiomeRoughness =
		texture2D(roughnessMap, scaleEncounterLandBiomeFrame.uvA).g *
			scaleEncounterLandBiomeFrame.weights.x +
		texture2D(roughnessMap, scaleEncounterLandBiomeFrame.uvB).g *
			scaleEncounterLandBiomeFrame.weights.y +
		texture2D(roughnessMap, scaleEncounterLandBiomeFrame.uvC).g *
			scaleEncounterLandBiomeFrame.weights.z;
	roughnessFactor *= scaleEncounterLandBiomeRoughness;

#endif`,ys=`
#ifdef USE_NORMALMAP_OBJECTSPACE

	vec3 scaleEncounterLandBiomeNormalA =
		texture2D(normalMap, scaleEncounterLandBiomeFrame.uvA).xyz * 2.0 - 1.0;
	vec3 scaleEncounterLandBiomeNormalB =
		texture2D(normalMap, scaleEncounterLandBiomeFrame.uvB).xyz * 2.0 - 1.0;
	vec3 scaleEncounterLandBiomeNormalC =
		texture2D(normalMap, scaleEncounterLandBiomeFrame.uvC).xyz * 2.0 - 1.0;
	scaleEncounterLandBiomeNormalA.xy = scaleEncounterLandBiomeRestoreNormal(
		scaleEncounterLandBiomeNormalA.xy,
		scaleEncounterLandBiomeFrame.rotationA
	);
	scaleEncounterLandBiomeNormalB.xy = scaleEncounterLandBiomeRestoreNormal(
		scaleEncounterLandBiomeNormalB.xy,
		scaleEncounterLandBiomeFrame.rotationB
	);
	scaleEncounterLandBiomeNormalC.xy = scaleEncounterLandBiomeRestoreNormal(
		scaleEncounterLandBiomeNormalC.xy,
		scaleEncounterLandBiomeFrame.rotationC
	);
	normal = normalize(
		scaleEncounterLandBiomeNormalA * scaleEncounterLandBiomeFrame.weights.x +
		scaleEncounterLandBiomeNormalB * scaleEncounterLandBiomeFrame.weights.y +
		scaleEncounterLandBiomeNormalC * scaleEncounterLandBiomeFrame.weights.z
	);
	normal.xy *= scaleEncounterLandBiomeNormalDetail;
	normal = normalize(normalMatrix * normal);

#elif defined(USE_NORMALMAP_TANGENTSPACE)

	vec3 scaleEncounterLandBiomeNormalA =
		texture2D(normalMap, scaleEncounterLandBiomeFrame.uvA).xyz * 2.0 - 1.0;
	vec3 scaleEncounterLandBiomeNormalB =
		texture2D(normalMap, scaleEncounterLandBiomeFrame.uvB).xyz * 2.0 - 1.0;
	vec3 scaleEncounterLandBiomeNormalC =
		texture2D(normalMap, scaleEncounterLandBiomeFrame.uvC).xyz * 2.0 - 1.0;
	scaleEncounterLandBiomeNormalA.xy = scaleEncounterLandBiomeRestoreNormal(
		scaleEncounterLandBiomeNormalA.xy,
		scaleEncounterLandBiomeFrame.rotationA
	);
	scaleEncounterLandBiomeNormalB.xy = scaleEncounterLandBiomeRestoreNormal(
		scaleEncounterLandBiomeNormalB.xy,
		scaleEncounterLandBiomeFrame.rotationB
	);
	scaleEncounterLandBiomeNormalC.xy = scaleEncounterLandBiomeRestoreNormal(
		scaleEncounterLandBiomeNormalC.xy,
		scaleEncounterLandBiomeFrame.rotationC
	);
	vec3 mapN = normalize(
		scaleEncounterLandBiomeNormalA * scaleEncounterLandBiomeFrame.weights.x +
		scaleEncounterLandBiomeNormalB * scaleEncounterLandBiomeFrame.weights.y +
		scaleEncounterLandBiomeNormalC * scaleEncounterLandBiomeFrame.weights.z
	);
	mapN.xy *= normalScale * scaleEncounterLandBiomeNormalDetail;
	normal = normalize(tbn * mapN);

#elif defined(USE_BUMPMAP)

	normal = perturbNormalArb(
		-vViewPosition,
		normal,
		dHdxy_fwd(),
		faceDirection
	);

#endif`;function bs(e,t){e.uniforms.uScaleEncounterLandBiomeGroundMetrics={value:[t.physicalWidthMeters,t.stochasticCellSizeMeters,0]},e.uniforms.uScaleEncounterLandBiomeNormalFade={value:[t.normalFadeStartMeters,t.normalFadeEndMeters]},e.uniforms.uScaleEncounterLandBiomeDarkTint={value:t.darkTint},e.uniforms.uScaleEncounterLandBiomeLightTint={value:t.lightTint},e.uniforms.uScaleEncounterLandBiomeMacroStrength={value:t.macroVariationStrength},e.vertexShader=ms(e.vertexShader),e.fragmentShader=e.fragmentShader.replace(`varying vec3 vViewPosition;`,hs).replace(`vec4 diffuseColor = vec4( diffuse, opacity );`,`vec4 diffuseColor = vec4( diffuse, opacity );
${gs}`).replace(`#include <map_fragment>`,_s).replace(`#include <roughnessmap_fragment>`,vs).replace(`#include <normal_fragment_maps>`,ys)}function xs(e,t){if(e.userData[fs]===ds)return e;let n=Math.max(.25,ps(t.physicalWidthMeters,2)),r=Math.max(20,ps(t.normalFadeStartMeters,72)),i={darkTint:new P(t.darkTint),lightTint:new P(t.lightTint),macroVariationStrength:Math.max(0,Math.min(.42,ps(t.macroVariationStrength,.16))),normalFadeEndMeters:Math.max(r+1,ps(t.normalFadeEndMeters,190)),normalFadeStartMeters:r,physicalWidthMeters:n,stochasticCellSizeMeters:Math.max(n*1.5,ps(t.stochasticCellSizeMeters,n*4.5))},a=e.onBeforeCompile.bind(e),o=e.customProgramCacheKey.bind(e);return e.onBeforeCompile=(e,t)=>{a(e,t),bs(e,i)},e.customProgramCacheKey=()=>`${o()}|${ds}`,e.userData[fs]=ds,e.needsUpdate=!0,e}var Ss=360,Cs=24,ws=[{depth:3.4,width:5.8,x:3.5,y:-.1,yaw:-.28,z:-8.5},{depth:2.6,width:4.2,x:-5.5,y:-.14,yaw:.2,z:-12},{depth:2.8,width:4.8,x:8.5,y:-.12,yaw:.48,z:-14}];function Ts(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function X(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Es(e,t){return e===`kayenta-seasonal-floodplain`?-38+Math.sin(t*.026+.6)*18+Math.sin(t*.067)*5:34+Math.sin(t*.024-.4)*14+Math.cos(t*.061)*3.8}function Ds(e,t){return e===`kayenta-seasonal-floodplain`?7+Math.exp(-(((t+16)/18)**2))*5.4+Math.sin(t*.067+.6)**2*1.4:e===`gobi-braided-basin`?7.5+3.6*Math.exp(-(((t+18)/24)**2)):5.5+(Math.cos(t*.043)+1)*2.4}function Os(e){return-18+Math.tanh(e/18)*10+Math.sin(e*.06+.4)*3}function ks(e){return-16+32*Math.exp(-(((e+22)/6)**2))+5*Math.exp(-(((e-24)/20)**2))}function As(e,t,n=0){return e===`carboniferous-coal-swamp`?{x:Es(e,t)+n,z:t}:{x:t,z:(e===`gobi-braided-basin`?ks(t):Os(t))+n}}function js(e,t,n){return Math.abs(e===`kayenta-seasonal-floodplain`?n-Os(t):e===`gobi-braided-basin`?n-ks(t):t-Es(e,n))}function Ms(e,t){let n=0;return ws.forEach(r=>{let i=e-r.x,a=t-r.z,o=Math.cos(r.yaw),s=Math.sin(r.yaw),c=i*o+a*s,l=-i*s+a*o,u=Math.exp(-((c/(r.width*.88))**2*1.75+(l/(r.depth*.88))**2*1.75));n=Math.max(n,u)}),n<.015?0:n}function Ns(e){return(t,n)=>{let r=Math.hypot(t,n),i=X(Cs,56,r),a=Math.sin(t*.021+e.seed*1e-5)*.46+Math.cos(n*.018-e.seed*13e-6)*.38+Math.sin((t+n)*.052)*.17;if(e.profile===`gobi-braided-basin`){let o=Math.atan2(n,t),s=X(138,326,r)*Math.max(1.2,5.4+Math.sin(o*3+.4)*2.25+Math.sin(o*7-.9)*1.05+Math.cos(r*.037+o*4)*1.15),c=Math.exp(-(((r-(238+Math.sin(o*4)*21))/54)**2))*(2.2+Math.sin(o*9+.8)*.8),l=Math.sin(t*.012-n*.019)*.38+Math.cos(t*.047+n*.024)*.16,u=(1-X(.25,1,js(e.profile,t,n)/(Ds(e.profile,t)+2)))*X(3,7,r);return i*(.45+a*.22+l*.5+s+c)*(1-u)-.68*u}if(e.profile===`kayenta-seasonal-floodplain`){let o=1-X(.35,1,js(e.profile,t,n)/(Ds(e.profile,t)+2.5)),s=Math.sin(n*.038+t*.009)*.34,c=Math.atan2(n,t),l=X(112,318,r)*(3.2+Math.sin(c*4-.3)*1.25+Math.cos(c*9+r*.025)*.55);return i*(.95+a*.58+s+l)*(1-o)-o*.68*X(3,8,r)}let o=Ms(t,n);return i*(Math.sin(t*.09)*Math.cos(n*.075)*.15+a*.2)-o*.76}}function Ps(e,t,n,r,i){let a=new P(e.palette.groundDark),o=new P(e.palette.groundMid),s=new P(e.palette.groundLight),c=Math.hypot(t,n),l=(Math.sin(t*.31)+Math.cos(n*.27)+2)*.08;if(i.copy(o).lerp(s,Math.min(.72,.2+l+Math.max(r,0)*.035)),e.profile===`gobi-braided-basin`){let e=Math.abs(n-(-36+Math.sin(t*.017)*19));e<17&&i.lerp(a,(1-e/17)*.28)}else if(e.profile===`kayenta-seasonal-floodplain`){let r=js(e.profile,t,n),o=t,s=Ds(e.profile,o)+3.5;r<s&&i.lerp(a,(1-r/s)*.68)}return e.profile===`carboniferous-coal-swamp`&&i.lerp(a,.28+Ms(t,n)*.46+Math.min(c/Ss,1)*.12),i}function Fs(e,t,n,r){let i=new U(Ss*2,Ss*2,224,224);i.rotateX(-Math.PI/2);let a=i.getAttribute(`position`);if(e.profile!==`carboniferous-coal-swamp`)for(let e=0;e<a.count;e+=1){let t=e=>Math.sign(e)*360*(Math.abs(e)/360)**1.65;a.setX(e,t(a.getX(e))),a.setZ(e,t(a.getZ(e)))}let o=new Float32Array(a.count*3),s=new P;for(let n=0;n<a.count;n+=1){let r=a.getX(n),i=a.getZ(n),c=t(r,i);a.setY(n,c),Ps(e,r,i,c,s).toArray(o,n*3)}i.setAttribute(`color`,new B(o,3)),i.computeVertexNormals(),i.computeBoundingSphere();let c=r?.albedo??Is(e),l=Math.min(Math.max(n,1),8);(r?[r.albedo,r.normal,r.roughness]:[c]).forEach(e=>{e.wrapS=d,e.wrapT=d,e.repeat.set(1,1),e.anisotropy=l,e.needsUpdate=!0});let u=new _({color:e.profile===`gobi-braided-basin`?`#b6aaa1`:`#ffffff`,emissive:e.profile===`carboniferous-coal-swamp`?`#405146`:`#000000`,emissiveIntensity:e.profile===`carboniferous-coal-swamp`?.31:0,map:c,metalness:0,normalMap:r?.normal??null,normalScale:r?new R(e.profile===`carboniferous-coal-swamp`?.16:.2,e.profile===`carboniferous-coal-swamp`?.16:.2):new R(1,1),roughness:e.profile===`carboniferous-coal-swamp`?.89:.98,roughnessMap:r?.roughness??null,vertexColors:!r});if(r?.uniqueAlbedo){if(Fe(u,{colourMap:r.uniqueAlbedo,widthMeters:144,detailMeters:1.7,farColour:e.palette.groundMid,grainStrength:.65,colourMipLevel:6}),e.profile!==`carboniferous-coal-swamp`){let t=u.onBeforeCompile.bind(u);u.onBeforeCompile=(e,n)=>{t(e,n),e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
float bankWetness = 1.0 - smoothstep(-.18, .10, vAuthoredGroundWorld.y);
diffuseColor.rgb *= 1.0 - bankWetness * .3;`)},u.customProgramCacheKey=()=>`${e.themeId}-authored-bank-v4`}}else r&&xs(u,{darkTint:e.palette.groundDark,lightTint:e.palette.groundLight,macroVariationStrength:e.profile===`gobi-braided-basin`?.2:e.profile===`carboniferous-coal-swamp`?.11:.16,normalFadeEndMeters:210,normalFadeStartMeters:78,physicalWidthMeters:r.physicalWidthMeters,stochasticCellSizeMeters:r.physicalWidthMeters*4.75});let f=new b(i,u);return f.name=`scale-encounter-${e.themeId}-terrain`,f.receiveShadow=!0,f}function Is(e){let t=new Uint8Array(256*256*4);for(let n=0;n<256;n+=1)for(let r=0;r<256;r+=1){let i=r/256,a=n/256,o=Math.sin(i*Math.PI*2*19+e.seed*.001)*5+Math.cos(a*Math.PI*2*23-e.seed*.0013)*4+Math.sin((i+a)*Math.PI*2*31)*3,s=Math.sin(i*Math.PI*2*4)*6+Math.cos(a*Math.PI*2*5)*5,c=Math.sin((r*127.1+n*311.7+e.seed)*.031)*4,l=e.profile===`carboniferous-coal-swamp`?-7:0,u=Math.round(Math.min(255,Math.max(198,239+o+s+c+l))),d=(n*256+r)*4;t[d]=u,t[d+1]=u,t[d+2]=u,t[d+3]=255}let n=new a(t,256,256,y,k);n.colorSpace=u,n.generateMipmaps=!0,n.magFilter=j,n.minFilter=I,n.wrapS=d,n.wrapT=d;let r=e.profile===`gobi-braided-basin`?12:e.profile===`kayenta-seasonal-floodplain`?10:8;return n.repeat.set(r,r),n.needsUpdate=!0,n}function Ls(e){let t=new D(500,48,24),r=t.getAttribute(`position`),i=new Float32Array(r.count*3),a=new P(e.palette.skyTop),o=new P(e.palette.horizon),s=new P(e.palette.fog),c=new P;for(let e=0;e<r.count;e+=1){let t=r.getY(e)/500;t>=0?c.copy(o).lerp(a,X(-.02,.42,t)):c.copy(o).lerp(s,X(0,.42,-t)),c.toArray(i,e*3)}t.setAttribute(`color`,new B(i,3));let l=new b(t,new n({depthWrite:!1,fog:!1,side:1,vertexColors:!0}));l.name=`scale-encounter-${e.themeId}-procedural-sky`,l.frustumCulled=!1;let u=new b(new D(8.5,20,12),new n({color:e.palette.sun,depthWrite:!1,fog:!1,transparent:!0,opacity:e.profile===`carboniferous-coal-swamp`?.38:.74})),d=new L(...e.atmosphere.sunPosition).normalize().multiplyScalar(390);return u.position.copy(d),u.name=`scale-encounter-${e.themeId}-sun-disc`,l.add(u),l}function Rs(e,t,r){t.anisotropy=Math.min(8,r),t.needsUpdate=!0;let i=new D(500,64,32);i.scale(-1,1,1);let a=new b(i,new n({depthTest:!1,depthWrite:!1,fog:!1,map:t,toneMapped:!0}));if(a.name=`scale-encounter-${e.themeId}-distant-art-dome`,a.frustumCulled=!1,a.renderOrder=-100,a.rotation.y=e.assets.panoramaYawRadians,e.profile===`kayenta-seasonal-floodplain`){let e=i.getAttribute(`uv`);for(let t=0;t<e.count;t+=1)e.setY(t,Math.max(0,(e.getY(t)-.5)*2));e.needsUpdate=!0}else e.profile===`gobi-braided-basin`&&($i(a),a.scale.y=.32);return a}function zs(){let e=new Uint8Array(256);for(let t=0;t<64;t+=1){let n=t/63,r=X(0,.24,n),i=1-X(.48,1,n),a=Math.round(r*i*255),o=t*4;e[o]=a,e[o+1]=a,e[o+2]=a,e[o+3]=255}let t=new a(e,1,64,y,k);return t.magFilter=j,t.minFilter=j,t.needsUpdate=!0,t}function Bs(e){let r=new b(new t(235,215,34,96,1,!0),new n({alphaMap:zs(),color:e.palette.fog,depthWrite:!1,fog:!1,opacity:e.profile===`gobi-braided-basin`?.24:e.profile===`carboniferous-coal-swamp`?.3:.22,side:2,transparent:!0}));return r.name=`scale-encounter-${e.themeId}-horizon-atmosphere`,r.position.y=7,r.renderOrder=3,r}function Vs(e,t,n,r,i,a){let o=new s;o.position.copy(n),o.rotation.y=i,o.scale.copy(r),o.updateMatrix(),e.setMatrixAt(t,o.matrix),a&&e.setColorAt(t,a)}function Z(e){return e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0),e.computeBoundingBox(),e.computeBoundingSphere(),e.castShadow=!0,e.receiveShadow=!0,e}function Hs(e,t,n){let r=e()*Math.PI*2,i=Math.sqrt(t**2+e()*(n**2-t**2));return new L(Math.cos(r)*i,0,Math.sin(r)*i)}function Us(e,t,n,r){let i=e()*Math.PI*2,a=t+e()**r*(n-t);return new L(Math.cos(i)*a,0,Math.sin(i)*a)}function Ws(e){switch(e.assets.scannedPropProfile){case`dry-basin`:return[{count:72,kind:`fern`,maximumRadius:64,maximumScale:2.8,minimumRadius:14,minimumScale:1.2,templateName:`fern_02_a_lod0`},{count:22,kind:`rock`,maximumRadius:140,maximumScale:6.2,minimumRadius:17,minimumScale:3.1,templateName:`rock_07_lod0`},{count:19,kind:`rock`,maximumRadius:150,maximumScale:10.4,minimumRadius:23,minimumScale:5.2,templateName:`stone_01_lod0`},{count:22,kind:`branch`,maximumRadius:125,maximumScale:2.1,minimumRadius:20,minimumScale:1.05,templateName:`dry_branch_a_lod0`},{count:96,kind:`shrub`,maximumRadius:148,maximumScale:3.15,minimumRadius:24,minimumScale:1.4,templateName:`shrub_04_a_lod0`},{count:104,kind:`shrub`,maximumRadius:248,maximumScale:3.35,minimumRadius:88,minimumScale:1.45,templateName:`shrub_04_c_lod1`}];case`river-margin`:return[{count:42,kind:`fern`,maximumRadius:104,maximumScale:2.8,minimumRadius:16,minimumScale:1.25,templateName:`fern_02_a_lod0`},{channelBiased:!0,count:38,kind:`shrub`,maximumRadius:148,maximumScale:2.85,minimumRadius:23,minimumScale:1.35,templateName:`shrub_04_b_lod0`},{count:18,kind:`rock`,maximumRadius:134,maximumScale:7.1,minimumRadius:20,minimumScale:3.3,templateName:`rock_09_lod0`},{count:10,kind:`log`,maximumRadius:124,maximumScale:1.6,minimumRadius:25,minimumScale:.82,templateName:`dead_tree_trunk_lod0`},{count:17,kind:`branch`,maximumRadius:130,maximumScale:1.95,minimumRadius:19,minimumScale:.95,templateName:`dry_branch_b_lod0`},{channelBiased:!0,count:58,kind:`fern`,maximumRadius:228,maximumScale:3.4,minimumRadius:92,minimumScale:1.55,templateName:`fern_02_b_lod1`},{channelBiased:!0,count:46,kind:`shrub`,maximumRadius:230,maximumScale:3.2,minimumRadius:104,minimumScale:1.5,templateName:`shrub_04_d_lod1`}];case`coal-swamp-floor`:return[{count:142,kind:`fern`,maximumRadius:86,maximumScale:2.65,minimumRadius:10,minimumScale:1.05,templateName:`fern_02_c_lod0`},{channelBiased:!0,count:112,kind:`fern`,maximumRadius:158,maximumScale:2.55,minimumRadius:16,minimumScale:1,templateName:`fern_02_d_lod0`},{count:14,kind:`log`,maximumRadius:118,maximumScale:1.65,minimumRadius:18,minimumScale:.78,templateName:`dead_tree_trunk_02_lod0`},{count:20,kind:`branch`,maximumRadius:125,maximumScale:1.9,minimumRadius:12,minimumScale:.9,templateName:`dry_branch_c_lod0`},{count:16,kind:`rock`,maximumRadius:116,maximumScale:6.2,minimumRadius:17,minimumScale:2.8,templateName:`rock_07_lod0`},{count:156,kind:`fern`,maximumRadius:224,maximumScale:3,minimumRadius:64,minimumScale:1.2,templateName:`fern_02_a_lod1`}]}}function Gs(e,t){Object.values(e).forEach(e=>{e&&typeof e==`object`&&`isTexture`in e&&t.add(e)})}function Ks(e,t){let n=e.getObjectByName(t);if(!n)return null;let r=n instanceof b?n:null;return n.traverse(e=>{!r&&e instanceof b&&(r=e)}),r}function qs(e,t,n,r,i,a,o){let c={branch:0,fern:0,log:0,rock:0,shrub:0};n.updateMatrixWorld(!0);let l=n.matrixWorld.clone().invert();return Ws(t).forEach(u=>{let d=Ks(n,u.templateName);if(!d)return;let f=Pe(u.count,o??`current`);if(f===0)return;d.updateMatrixWorld(!0),d.geometry.computeBoundingBox();let p=d.geometry.boundingBox;if(!p)return;let m=l.clone().multiply(d.matrixWorld),h=p.clone().applyMatrix4(m),g=Array.isArray(d.material)?d.material:[d.material];g.forEach(e=>Gs(e,r));let v=g.map(e=>{let t=e.clone();return(u.kind===`fern`||u.kind===`shrub`)&&(t.side=2,t.alphaToCoverage=!0),t instanceof _&&(t.metalness=0,t.roughness=Math.max(u.kind===`rock`?.82:.88,t.roughness)),t}),y=new E(d.geometry.clone(),Array.isArray(d.material)?v:v[0],f);y.name=`scale-encounter-${t.themeId}-scanned-${u.kind}-${u.templateName}`;let b=new s,x=new V;for(let e=0;e<f;e+=1){let n=u.channelBiased?Xs(t,a,u.minimumRadius):t.profile===`carboniferous-coal-swamp`&&u.kind===`fern`?Us(a,u.minimumRadius,u.maximumRadius,1.72):Hs(a,u.minimumRadius,u.maximumRadius);n.length()>u.maximumRadius&&(n=Hs(a,u.minimumRadius,u.maximumRadius));let r=u.minimumScale+a()*(u.maximumScale-u.minimumScale),o=u.kind===`log`?.08*r:u.kind===`rock`?.035*r:.012*r;b.position.set(n.x,i(n.x,n.z)-h.min.y*r-o,n.z),b.rotation.set(0,a()*Math.PI*2,0),b.scale.setScalar(r),b.updateMatrix(),x.multiplyMatrices(b.matrix,m),y.setMatrixAt(e,x)}Z(y),y.castShadow=u.kind!==`fern`,e.add(y),c[u.kind]+=f}),c}function Js(e,t,n,r,i){let a=Pe(t.ecology.gravel,n??`current`);if(a===0)return 0;let o=new E(new D(1,5,3),new _({color:`#ffffff`,flatShading:!0,roughness:1}),a);o.name=`scale-encounter-${t.themeId}-gravel-batch`;let s=new P(t.palette.groundDark),c=new P(t.palette.groundLight);for(let e=0;e<a;e+=1){let n=Hs(i,11,245),a=.025+i()**3*(t.profile===`gobi-braided-basin`?.17:.13);n.y=r(n.x,n.z)+a*.35,Vs(o,e,n,new L(a*(.8+i()),a*(.45+i()*.5),a),i()*Math.PI,s.clone().lerp(c,.25+i()*.65))}return Z(o),o.castShadow=!1,e.add(o),a}function Ys(e,t,n,r,i){let a=Pe(t.ecology.shrubs,n??`current`);if(a===0)return 0;let o=new E(new D(1,8,6),new _({color:`#ffffff`,flatShading:!0,roughness:.96}),a*3);o.name=`scale-encounter-${t.themeId}-drought-shrub-batch`;let s=new P(`#80633e`),c=new P(t.profile===`gobi-braided-basin`?`#657743`:`#426544`),l=0;for(let e=0;e<a;e+=1){let e=i()*Math.PI*2,t=28+i()**2*197,n=new L(Math.cos(e)*t,0,Math.sin(e)*t),a=.42+i()*.82,u=r(n.x,n.z),d=i()*Math.PI*2;for(let e=0;e<3;e+=1){let t=d+e/3*Math.PI*2,r=a*(.55+i()*.4),f=new L(n.x+Math.cos(t)*a*.42,u+r*(.42+e*.08),n.z+Math.sin(t)*a*.38);Vs(o,l,f,new L(r*(.85+i()*.45),r*(.62+i()*.3),r*(.8+i()*.4)),d+i()*.45,s.clone().lerp(c,.42+i()*.52)),l+=1}}return Z(o),o.castShadow=!1,e.add(o),a}function Xs(e,t,n=30){if(e.profile===`carboniferous-coal-swamp`){for(let e=0;e<12;e+=1){let e=ws[Math.floor(t()*ws.length)],r=t()*Math.PI*2,i=1.04+t()*.74,a=Math.cos(r)*e.width*i,o=Math.sin(r)*e.depth*(1.02+t()*.58),s=Math.cos(e.yaw),c=Math.sin(e.yaw),l=new L(e.x+a*s-o*c,0,e.z+a*c+o*s);if(Math.hypot(l.x,l.z)>=n)return l}return Hs(t,n,230)}for(let r=0;r<12;r+=1){let r=(t()*2-1)*245,i=t()<.5?-1:1,a=As(e.profile,r,i*(Ds(e.profile,r)+3+t()*18));if(Math.hypot(a.x,a.z)>=n)return new L(a.x,0,a.z)}return Hs(t,n,230)}function Zs(e,n,r,i,a){let o=Pe(n.ecology.riparianPlants,r??`current`);if(o===0)return 0;let s=new E(new t(.12,.2,1,5),new _({color:`#ffffff`,roughness:.94}),o);s.name=`scale-encounter-${n.themeId}-riparian-stem-batch`;let c=new E(new t(.34,.34,.055,9),new _({color:n.profile===`carboniferous-coal-swamp`?`#62825f`:`#788554`,roughness:.96}),o*3);c.name=`scale-encounter-${n.themeId}-riparian-whorl-batch`;let l=new P(n.profile===`carboniferous-coal-swamp`?`#456b53`:`#586641`),u=new P(n.profile===`carboniferous-coal-swamp`?`#75936a`:`#7e8d57`),d=0;for(let e=0;e<o;e+=1){let t=Xs(n,a,n.profile===`carboniferous-coal-swamp`?22:30),r=n.profile===`carboniferous-coal-swamp`?.65+a()*1.65:.8+a()*1.7;t.y=i(t.x,t.z)+r*.5,Vs(s,e,t,new L(.7+a()*.7,r,.7+a()*.7),a()*Math.PI,l.clone().lerp(u,a()));for(let e=1;e<=3;e+=1)Vs(c,d,new L(t.x,t.y-r*.5+r*e/3.45,t.z),new L(1.35+a()*1.05,.7+a()*.35,1.35+a()*1.05),a()*Math.PI),d+=1}return e.add(Z(s),Z(c)),o}function Qs(){let e=[];for(let t=1;t<=8;t+=1){let n=t/9,r=Math.max(0,n-.09),i=Math.min(1,n+.1),a=Math.sin(n*Math.PI)*.085,o=Math.sin(n*Math.PI)*(.25-n*.055);e.push(r,a*.72,0,i,a,0,n,a,o,r,a*.72,0,n,a,-o,i,a,0)}e.push(0,0,-.018,1,0,-.01,1,0,.01,0,0,-.018,1,0,.01,0,0,.018);let t=new M;return t.setAttribute(`position`,new B(new Float32Array(e),3)),t.computeVertexNormals(),t}function $s(e,t,r,i,a){let o=Pe(t.ecology.ferns,r??`current`);if(o===0)return 0;let c=new E(Qs(),new n({color:`#ffffff`,side:2}),o);c.name=`scale-encounter-${t.themeId}-fern-frond-batch`;let l=new P(`#31553f`),u=new P(t.profile===`carboniferous-coal-swamp`?`#688b5e`:`#677d49`);for(let e=0;e<o;e+=1){let n=Xs(t,a,t.profile===`carboniferous-coal-swamp`?20:34),r=(t.profile===`carboniferous-coal-swamp`?1:1.15)+a()*(t.profile===`carboniferous-coal-swamp`?3.4:2.15);n.y=i(n.x,n.z)+.12+a()*.5;let o=new s;o.position.copy(n),o.rotation.set(0,a()*Math.PI*2,-.12+a()*.48),o.scale.set(r,1.15+a()*.5,r),o.updateMatrix(),c.setMatrixAt(e,o.matrix),c.setColorAt(e,l.clone().lerp(u,.3+a()*.7))}return e.add(Z(c)),o}function ec(e,n,r,i,a,o){let c=Pe(n.ecology.treeFerns,r??`current`);if(c===0)return 0;let l=new E(new t(.22,.32,1,9,3),new _({color:`#ffffff`,emissive:`#1f1711`,emissiveIntensity:.05,roughness:.96}),c);l.name=`scale-encounter-${n.themeId}-tree-fern-trunks`;let u=new E(o?nc():Qs(),new _({alphaTest:o?.32:0,alphaToCoverage:!!o,color:`#dfe8d5`,emissive:`#314936`,emissiveIntensity:.14,map:o,metalness:0,roughness:.9,side:2}),c*26);u.name=`scale-encounter-${n.themeId}-tree-fern-crowns`;let d=new P(`#493b30`),f=new P(`#705d47`),p=new P(`#527458`),m=new P(`#9cb67a`),h=0;for(let e=0;e<c;e+=1){let t=new L;for(let e=0;e<12;e+=1){let e=a()*Math.PI*2,n=48+a()**1.45*102;if(t=new L(Math.cos(e)*n,0,Math.sin(e)*n),!(t.z<18&&Math.abs(t.x)<12))break}let n=3.6+a()*5.2,r=.58+a()*.48,o=i(t.x,t.z);Vs(l,e,new L(t.x,o+n*.5,t.z),new L(r,n,r),a()*Math.PI,d.clone().lerp(f,a()));let c=a()*Math.PI*2;for(let e=0;e<26;e+=1){let r=new s,i=e<14,l=!i&&e<22,d=c+(i?e:l?e-14:e-14-8)/(i?14:l?8:4)*Math.PI*2+(a()-.5)*(i?.26:.42),f=i?2.8+a()*2.2:l?1.9+a()*1.55:1.15+a()*.9,g=i?0:l?.22:.48,_=i?-.88+a()*.32:l?-.28+a()*.42:.58+a()*.42;r.position.set(t.x,o+n+g,t.z),r.rotation.set((a()-.5)*.34,d,_),r.scale.set(f,1.08+a()*.32,f*(i?.66:l?.72:.58)),r.updateMatrix(),u.setMatrixAt(h,r.matrix),u.setColorAt(h,p.clone().lerp(m,(i?.28:l?.44:.58)+a()*.38)),h+=1}}return e.add(Z(l),Z(u)),c}function tc(){let e=new Uint8Array(256*256*4);for(let t=0;t<256;t+=1)for(let n=0;n<256;n+=1){let r=Math.floor(t/20),i=(n+r%2*(16*.5))%16-16*.5,a=t%20-20*.5,o=Math.abs(i)/(16*.45)+Math.abs(a)/(20*.43),s=X(.7,.86,o)*(1-X(.92,1.08,o)),c=Math.exp(-(i*i*.18+a*a*.085)),l=(Math.cos(n/256*Math.PI*2*16)+1)*3.2,u=Math.sin(n*.73+t*.31)*2.8+Math.cos(n*.19-t*.87)*2.1,d=Math.max(50,Math.min(176,126+l+u-s*37-c*24)),f=(t*256+n)*4;e[f]=Math.round(d*.82),e[f+1]=Math.round(d*.88),e[f+2]=Math.round(d*.78),e[f+3]=255}let t=new a(e,256,256,y,k);return t.name=`scale-encounter-carboniferous-lycopsid-bark-scar-texture`,t.colorSpace=u,t.wrapS=d,t.wrapT=d,t.repeat.set(3,12),t.generateMipmaps=!0,t.magFilter=j,t.minFilter=I,t.needsUpdate=!0,t}function nc(){let e=new M;e.setAttribute(`position`,new B(new Float32Array([0,0,-.025,1,.1,-.28,1,.1,.28,0,0,-.025,1,.1,.28,0,0,.025]),3));let t=.008/4,n=.992/4,r=2.006/3,i=2.994/3;return e.setAttribute(`uv`,new B(new Float32Array([t,r,t,i,n,i,t,r,n,i,n,r]),2)),e.computeVertexNormals(),e}function rc(e){let t=e%4,n=Math.floor(e/4),r=.012,i=.009,a=(t+r)/4,o=(t+1-r)/4,s=1-(n+1-i)/2,c=1-(n+i)/2,l=new M;return l.setAttribute(`position`,new B(new Float32Array([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0,0,0,-.45,0,0,.45,0,1,.45,0,1,-.45]),3)),l.setAttribute(`uv`,new B(new Float32Array([a,s,o,s,o,c,a,c,a,s,o,s,o,c,a,c]),2)),l.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]),l.computeVertexNormals(),l.computeBoundingSphere(),l}function ic(e,t,r,i,a){let o=t.profile===`gobi-braided-basin`,c=Pe(o?300:218,r??`current`),l=Ts(t.seed^500509),u=Array.from({length:8},()=>[]),d=0;for(let e=0;e<c*40&&d<c;e+=1){let e=l()*Math.PI*2,t=Math.sin(e*3.2+.45)*.55+Math.cos(e*7.1-.8)*.32;if(l()>.72+t*.2)continue;let n=102+l()**.72*158,r=[[-42,-35],[45,-42],[-25,-62],[14,-78],[65,-85],[-75,-105],[-15,-145],[55,-160],[-130,-130],[120,-100],[-45,82],[32,120],[110,45]],i=r[d%r.length],a=o||d<c*.7,s=a?i[0]+(l()-.5)*38:Math.cos(e)*n+(l()-.5)*14,f=a?i[1]+(l()-.5)*32:Math.sin(e)*n+(l()-.5)*14,p=o?8+l()*10:8.2+l()*9.8;u[d%8].push({height:p,width:p*(.48+l()*.24),x:s,yaw:l()*Math.PI*2,z:f}),d+=1}let f=new P(`#697760`),p=new P(`#99a28b`);return u.forEach((r,o)=>{if(r.length===0)return;let c=new n({alphaTest:.42,alphaToCoverage:!0,color:`#e3e6dc`,fog:!0,map:a,side:2}),u=new E(rc(o),c,r.length);u.name=`scale-encounter-${t.themeId}-world-space-riparian-canopy-${o+1}`;let d=new s;r.forEach((e,t)=>{d.position.set(e.x,i(e.x,e.z)-.025,e.z),d.rotation.set((l()-.5)*.025,e.yaw,(l()-.5)*.025),d.scale.set(e.width,e.height,e.width),d.updateMatrix(),u.setMatrixAt(t,d.matrix),u.setColorAt(t,f.clone().lerp(p,.25+l()*.75))}),Z(u),u.castShadow=!1,u.receiveShadow=!1,e.add(u)}),d}function ac(e,n,r,i,a,o){let c=Pe(n.ecology.lycopsids,r??`current`),l=Math.round(c*.34);if(l===0)return 0;let u=new _({color:`#ffffff`,emissive:`#3d493e`,emissiveIntensity:.16,map:tc(),metalness:0,roughness:.96}),d=new E(new t(.68,1,1,14,6),u,l);d.name=`scale-encounter-${n.themeId}-lycopsid-sigillaria-trunks`;let f=new E(new t(.52,1.34,1,14,3),u,l);f.name=`scale-encounter-${n.themeId}-lycopsid-root-flares`;let p=new E(new t(.2,.42,1,9,2),new _({color:`#ffffff`,roughness:.97}),l*7);p.name=`scale-encounter-${n.themeId}-lycopsid-terminal-forks`;let m=new E(o?nc():Qs(),new _({alphaTest:o?.32:0,alphaToCoverage:!!o,color:`#d9e2cf`,emissive:`#2d422f`,emissiveIntensity:.12,map:o,metalness:0,roughness:.9,side:2}),l*7*8);m.name=`scale-encounter-${n.themeId}-lycopsid-terminal-crowns`;let h=new P(`#5d685a`),g=new P(`#8f927b`),v=new P(`#648365`),y=new P(`#a6b67f`),b=0,x=0;for(let e=0;e<l;e+=1){let t=Hs(a,160,245),n=13.5+a()*8,r=.52+a()*.42,o=i(t.x,t.z),c=a()*Math.PI*2,l=new s;l.position.set(t.x,o+n*.5,t.z),l.rotation.set((a()-.5)*.025,c,(a()-.5)*.025),l.scale.set(r,n,r),l.updateMatrix(),d.setMatrixAt(e,l.matrix),d.setColorAt(e,h.clone().lerp(g,a())),Vs(f,e,new L(t.x,o+.78,t.z),new L(r*1.18,1.65,r*1.18),c,h.clone().lerp(g,.25+a()*.42));let u=new L(t.x,o+n-2.15,t.z);for(let e=0;e<7;e+=1){let t=c+e/7*Math.PI*2+(a()-.5)*.22,n=new L(Math.cos(t)*.62,.76+a()*.1,Math.sin(t)*.62).normalize(),i=3.4+a()*2.1,o=new s;o.position.copy(u).addScaledVector(n,i*.5),o.quaternion.setFromUnitVectors(new L(0,1,0),n),o.scale.set(r*.58,i,r*.58),o.updateMatrix(),p.setMatrixAt(b,o.matrix),p.setColorAt(b,h.clone().lerp(g,.42+a()*.4)),b+=1;let l=u.clone().addScaledVector(n,i);for(let e=0;e<8;e+=1){let n=new s,i=t+e/8*Math.PI*2+(a()-.5)*.28,o=r*(5.4+a()*3.1);n.position.copy(l),n.rotation.set(0,i,-.62+a()*.34),n.scale.set(o,1.25+a()*.45,o*1.12),n.updateMatrix(),m.setMatrixAt(x,n.matrix),m.setColorAt(x,v.clone().lerp(y,.35+a()*.65)),x+=1}}}return e.add(Z(d),Z(f),Z(p),Z(m)),l}function oc(e,r,i,a,o){let c=Pe(r.ecology.calamites,i??`current`);if(c===0)return 0;let l=new E(new t(.13,.2,1,7),new _({color:`#ffffff`,roughness:.93}),c);l.name=`scale-encounter-${r.themeId}-calamites-segmented-stems`;let u=new E(new t(.24,.24,.09,8),new _({color:`#68825f`,roughness:.95}),c*4);u.name=`scale-encounter-${r.themeId}-calamites-joint-rings`;let d=new E(new t(.055,.085,1,5),new _({color:`#ffffff`,roughness:.94}),c*5);d.name=`scale-encounter-${r.themeId}-calamites-whorled-branches`;let f=new E(Qs(),new n({color:`#ffffff`,side:2}),c*5);f.name=`scale-encounter-${r.themeId}-calamites-leaf-sprays`;let p=new P(`#42664d`),m=new P(`#718e66`),h=0,g=0;for(let e=0;e<c;e+=1){let t=Xs(r,o,48),n=1.7+o()*2.7,i=.48+o()*.48,c=a(t.x,t.z);Vs(l,e,new L(t.x,c+n*.5,t.z),new L(i,n,i),o()*Math.PI,p.clone().lerp(m,o()));for(let e=1;e<=4;e+=1){let r=c+n*e/5;Vs(u,h,new L(t.x,r,t.z),new L(i,1,i),0),h+=1}let _=c+n*(.72+o()*.12);for(let e=0;e<5;e+=1){let r=e/5*Math.PI*2+o()*.25,a=.65+o()*Math.min(2.2,n*.22),c=new L(Math.cos(r)*.84,.42+o()*.18,Math.sin(r)*.84).normalize(),l=new s;l.position.set(t.x,_,t.z).addScaledVector(c,a*.5),l.quaternion.setFromUnitVectors(new L(0,1,0),c),l.scale.set(i*.78,a,i*.78),l.updateMatrix(),d.setMatrixAt(g,l.matrix),d.setColorAt(g,p.clone().lerp(m,.45+o()*.55));let u=new s;u.position.set(t.x,_,t.z).addScaledVector(c,a),u.rotation.set(0,-r,-.18+o()*.3);let h=.55+o()*.75;u.scale.set(h,1.1,h*.8),u.updateMatrix(),f.setMatrixAt(g,u.matrix),f.setColorAt(g,p.clone().lerp(m,.55+o()*.45)),g+=1}}return e.add(Z(l),Z(u),Z(d),Z(f)),c}function sc(e,t,n,r,i){let a=t.ecology.distantLandforms;if(a===0)return 0;let o=[0,.12,.36,.58,.76,.91,1],s=[1.24,1.1,.95,.9,.82,.71,.67],c=[],l=[],u=[],d=[],f=new P(t.palette.groundDark),p=new P(t.palette.groundLight),m=new P(`#ffffff`),h=new P,g=[[-110,-265],[-48,-315],[38,-285],[108,-330],[-105,265],[-35,310],[48,278],[112,325]];for(let e=0;e<a;e+=1){let i=t.profile===`gobi-braided-basin`?g[e%g.length]:null,a=i?new L(i[0],0,i[1]):Hs(r,210,286),_=t.profile===`gobi-braided-basin`?13+r()*13:9+r()*12,v=t.profile===`gobi-braided-basin`?8.5+r()*9.5:7+r()*10,y=_*(.62+r()*.36),b=r()*Math.PI*2,x=n(a.x,a.z),S=c.length/3;o.forEach((t,n)=>{let r=s[n];for(let i=0;i<28;i+=1){let o=i/28*Math.PI*2,s=1+Math.sin(o*3+e*1.7+n*.31)*.085+Math.cos(o*7-e*.8-n*.27)*.038+Math.sin(o*11+n*.46)*.018,d=Math.cos(o)*_*r*s,g=Math.sin(o)*y*r*s,S=d*Math.cos(b)-g*Math.sin(b),C=d*Math.sin(b)+g*Math.cos(b);c.push(a.x+S,x+v*t,a.z+C),u.push((a.x+S)/(Ss*2)+.5,(a.z+C)/(Ss*2)+.5);let w=.22+t*.38+Math.sin(t*Math.PI*9+e)*.055;h.copy(f).lerp(p,w).lerp(m,.42).toArray(l,l.length)}});for(let e=0;e<o.length-1;e+=1)for(let t=0;t<28;t+=1){let n=(t+1)%28,r=S+e*28,i=r+28;d.push(r+t,i+t,i+n,r+t,i+n,r+n)}let C=c.length/3;c.push(a.x,x+v,a.z),u.push(a.x/(Ss*2)+.5,a.z/(Ss*2)+.5),h.copy(f).lerp(p,.63).lerp(m,.36).toArray(l,l.length);let w=S+(o.length-1)*28;for(let e=0;e<28;e+=1){let t=(e+1)%28;d.push(w+e,C,w+t)}}let v=new M;v.setAttribute(`position`,new B(new Float32Array(c),3)),v.setAttribute(`color`,new B(new Float32Array(l),3)),v.setAttribute(`uv`,new B(new Float32Array(u),2)),v.setIndex(d),v.computeVertexNormals(),v.computeBoundingSphere();let y=new _({map:i?.albedo??null,metalness:0,normalMap:i?.normal??null,normalScale:new R(.13,.13),roughness:1,roughnessMap:i?.roughness??null,vertexColors:!0});i&&xs(y,{darkTint:t.palette.groundDark,lightTint:t.palette.groundLight,macroVariationStrength:.18,normalFadeEndMeters:330,normalFadeStartMeters:150,physicalWidthMeters:i.physicalWidthMeters,stochasticCellSizeMeters:i.physicalWidthMeters*4.5});let x=new b(v,y);return x.name=`scale-encounter-${t.themeId}-distant-mesa-batch`,x.castShadow=!1,x.receiveShadow=!0,e.add(x),a}function cc(e,t,n,r){if(t.profile!==`gobi-braided-basin`)return;let i=[{angle:-2.82,halfSpan:.09,radius:302,height:8.5,depth:32},{angle:-2.02,halfSpan:.075,radius:318,height:6.8,depth:27},{angle:-1.42,halfSpan:.12,radius:298,height:9.4,depth:35},{angle:-.48,halfSpan:.085,radius:324,height:6.6,depth:26},{angle:.46,halfSpan:.08,radius:310,height:7.1,depth:29},{angle:2.22,halfSpan:.085,radius:320,height:6.4,depth:25}],a=[],o=[],s=[],c=[],l=new P(t.palette.groundDark),u=new P(t.palette.groundLight),d=new P(`#ffffff`),f=new P;i.forEach((e,t)=>{let r=a.length/3;for(let r=0;r<=42;r+=1){let i=r/42,c=e.angle+(i*2-1)*e.halfSpan,p=Math.sin(i*Math.PI)**.58,m=.78+Math.sin(i*Math.PI*3.2+t)*.13+Math.cos(i*Math.PI*6.7-t*.6)*.055,h=e.height*p*m,g=e.radius+Math.sin(i*Math.PI*2.6+t)*5.5;[{radius:g-e.depth*.52,height:0,colour:.17},{radius:g-e.depth*.16,height:h*.83,colour:.34},{radius:g+e.depth*.12,height:h,colour:.48},{radius:g+e.depth*.5,height:0,colour:.27}].forEach(e=>{let t=Math.cos(c)*e.radius,r=Math.sin(c)*e.radius;a.push(t,n(t,r)+e.height-.08,r),s.push(t/(Ss*2)+.5,r/(Ss*2)+.5);let i=e.colour+Math.sin(h*.7+e.radius*.04)*.035;f.copy(l).lerp(u,i).lerp(d,.45).toArray(o,o.length)})}for(let e=0;e<42;e+=1){let t=r+e*4,n=t+4;for(let e=0;e<3;e+=1)c.push(t+e,n+e,n+e+1,t+e,n+e+1,t+e+1)}});let p=new M;p.setAttribute(`position`,new B(new Float32Array(a),3)),p.setAttribute(`color`,new B(new Float32Array(o),3)),p.setAttribute(`uv`,new B(new Float32Array(s),2)),p.setIndex(c),p.computeVertexNormals();let m=new _({map:r?.albedo??null,metalness:0,normalMap:r?.normal??null,normalScale:new R(.08,.08),roughness:1,roughnessMap:r?.roughness??null,vertexColors:!0});r&&xs(m,{darkTint:t.palette.groundDark,lightTint:t.palette.groundLight,macroVariationStrength:.12,normalFadeEndMeters:340,normalFadeStartMeters:180,physicalWidthMeters:r.physicalWidthMeters,stochasticCellSizeMeters:r.physicalWidthMeters*5.5});let h=new b(p,m);h.name=`scale-encounter-${t.themeId}-distant-eroded-ridge`,h.receiveShadow=!0,e.add(h)}function lc(e){return e.profile===`carboniferous-coal-swamp`?-.22:-.18}function uc(){let e=new Uint8Array(256*256*4);for(let t=0;t<256;t+=1)for(let n=0;n<256;n+=1){let r=n/256*Math.PI*2,i=t/256*Math.PI*2,a=Math.cos(r*3+i*2)*.42+Math.cos(r*7-i*3+1.2)*.19+Math.cos(r*11+i*5-.7)*.08,o=Math.cos(i*4-r*2+.4)*.36+Math.cos(i*9+r*3-1.6)*.16+Math.cos(i*13-r*4+.9)*.07,s=new L(-a*.23,-o*.23,1).normalize(),c=(t*256+n)*4;e[c]=Math.round((s.x*.5+.5)*255),e[c+1]=Math.round((s.y*.5+.5)*255),e[c+2]=Math.round((s.z*.5+.5)*255),e[c+3]=255}let t=new a(e,256,256,y,k);return t.name=`scale-encounter-land-biome-water-normal`,t.wrapS=d,t.wrapT=d,t.generateMipmaps=!0,t.magFilter=j,t.minFilter=I,t.needsUpdate=!0,t}function dc(e,t){return new i({clearcoat:e.profile===`carboniferous-coal-swamp`?.74:.82,clearcoatRoughness:.22,color:e.profile===`carboniferous-coal-swamp`?`#9ab4ac`:`#dce8e5`,depthWrite:!0,emissive:e.palette.water??`#526d67`,emissiveIntensity:e.profile===`carboniferous-coal-swamp`?.06:.075,metalness:0,normalMap:t,normalScale:new R(.19,.19),opacity:e.profile===`carboniferous-coal-swamp`?.92:.93,roughness:e.profile===`carboniferous-coal-swamp`?.24:.2,side:2,transparent:!0,vertexColors:!0})}function fc(e,t,n,r,i){if(t.profile===`gobi-braided-basin`)return;let a=dc(t,r);(t.profile===`carboniferous-coal-swamp`?ws:[{depth:7.5,width:23,x:82,y:-.4,yaw:.18,z:-76}]).forEach(({depth:r,width:o,x:s,y:c,yaw:l,z:u},d)=>{let f=[s,c,u],p=[],m=[0,0],h=[],g=[],v=[],y=[],x=new P(t.palette.water??`#55766e`).multiplyScalar(.82),S=new P(t.palette.water??`#55766e`).lerp(new P(t.palette.groundDark),.26);x.toArray(p,0);for(let e=0;e<56;e+=1){let i=e/56*Math.PI*2,a=1+Math.sin(i*3+d*1.8)*.18+Math.cos(i*7-d)*.085+Math.sin(i*13+d*.7)*.035,_=Math.cos(i)*o*a,b=Math.sin(i)*r*a,x=_*Math.cos(l)-b*Math.sin(l),C=_*Math.sin(l)+b*Math.cos(l),w=s+x,T=u+C,E=s+x*1.28,D=u+C*1.28;f.push(w,c+Math.sin(i*5+d)*.008,T),S.toArray(p,p.length),m.push(x/6,C/6),g.push(E,n(E,D)+.02,D,w,c-.09,T),new P(t.profile===`carboniferous-coal-swamp`?t.palette.groundDark:t.palette.groundMid).multiplyScalar(t.profile===`carboniferous-coal-swamp`?.84:1).toArray(v,v.length),new P(t.palette.groundDark).multiplyScalar(.72).toArray(v,v.length);let O=(e+1)%56;h.push(0,e+1,O+1);let k=e*2,A=O*2;y.push(k,k+1,A+1,k,A+1,A)}let C=new M;C.setAttribute(`position`,new B(new Float32Array(f),3)),C.setAttribute(`color`,new B(new Float32Array(p),3)),C.setAttribute(`uv`,new B(new Float32Array(m),2)),C.setIndex(h),C.computeVertexNormals();let w=new b(C,a);w.name=t.profile===`carboniferous-coal-swamp`?`scale-encounter-${t.themeId}-swamp-pool-${d+1}`:`scale-encounter-${t.themeId}-seasonal-oxbow-${d+1}`,w.renderOrder=1,w.receiveShadow=!0,w.userData.scaleEncounterWaterBaseY=0;let T=new M;T.setAttribute(`position`,new B(new Float32Array(g),3)),T.setAttribute(`color`,new B(new Float32Array(v),3)),T.setIndex(y),T.computeVertexNormals();let E=new b(T,new _({metalness:0,roughness:.98,vertexColors:!0}));E.name=`${w.name}-integrated-mud-bank`,E.receiveShadow=!0,e.add(E,w),i.push(w)})}function pc(e,t){let n=new c(t.atmosphere.hemisphereSky,t.atmosphere.hemisphereGround,t.atmosphere.hemisphereIntensity);n.name=`scale-encounter-${t.themeId}-hemisphere-light`;let r=new F(t.palette.sun,t.atmosphere.sunIntensity);if(r.name=`scale-encounter-${t.themeId}-sun-light`,r.position.set(...t.atmosphere.sunPosition),r.castShadow=!0,r.shadow.mapSize.set(2048,2048),r.shadow.camera.left=-42,r.shadow.camera.right=42,r.shadow.camera.top=42,r.shadow.camera.bottom=-42,r.shadow.camera.near=1,r.shadow.camera.far=260,r.shadow.bias=-15e-5,r.shadow.normalBias=.015,r.shadow.radius=1.6,r.target.name=`scale-encounter-${t.themeId}-sun-target`,e.add(n,r,r.target),t.profile!==`carboniferous-coal-swamp`){let n=new F(`#e8edf1`,1.65);n.name=`scale-encounter-${t.themeId}-sky-bounce`,n.position.set(-r.position.x,42,-r.position.z),n.target.position.set(0,2,0),e.add(n,n.target)}if(t.profile===`carboniferous-coal-swamp`){let t=new F(`#e8f1e5`,1.18);t.name=`scale-encounter-carboniferous-foreground-bounce-light`,t.position.set(36,42,96),t.castShadow=!1,t.target.name=`scale-encounter-carboniferous-foreground-bounce-target`,t.target.position.set(0,4,0),e.add(t,t.target)}}function mc(e,t,n){if(t.profile!==`kayenta-seasonal-floodplain`)return;let r=new E(new se(1,28),new _({color:`#c18a5d`,roughness:1,side:2}),18);r.name=`scale-encounter-floodplain-overbank-sediment-bars`;for(let e=0;e<18;e+=1){let i=-240+e/17*480+(n()-.5)*12,a=Ds(t.profile,i),o=e%3==0,c=o?(n()-.5)*a*.92:(n()<.5?-1:1)*(a+2+n()*7),l=As(t.profile,i,c),u=new s;u.position.set(l.x,lc(t)+.055+n()*.07,l.z),u.rotation.set(-Math.PI/2,0,n()*Math.PI),u.scale.set((o?1.8:1.1)+n()*(o?3.8:2.6),(o?.55:.4)+n()*1.15,1),u.updateMatrix(),r.setMatrixAt(e,u.matrix)}Z(r),r.castShadow=!1,e.add(r)}function hc(e,t,n){e.userData.scaleEncounterEnvironmentAssetStatus=`active`,e.userData.scaleEncounterEnvironmentBaselineReady=!0,e.userData.scaleEncounterEnvironmentLoadPolicy=`selected-theme-only`,e.userData.scaleEncounterEnvironmentRevealPolicy=`keep-current-scene-until-baseline-ready`,e.userData.scaleEncounterEnvironmentRuntimeKind=`procedural-biome`,e.userData.scaleEncounterEnvironmentRuntimeTheme=t.themeId,e.userData.scaleEncounterEnvironmentTargetTheme=t.themeId,e.userData.scaleEncounterEnvironmentUsingCompatibilityFallback=!1,e.userData.scaleEncounterGeneratedAssetBoundary=`authored-art-plates-scanned-props-and-continuous-terrain`,e.userData.scaleEncounterFarFieldRepresentation=`depth-writing-world-space-landforms-and-vegetation`,e.userData.scaleEncounterLandBiomeProfile=t.profile,e.userData.scaleEncounterLandBiomeRevision=t.revision,e.userData.scaleEncounterLandBiomePopulation=n,e.userData.scaleEncounterScientificBasis=[...t.scientificBasis]}function gc(e,t,n,r=null){let i=new x;i.name=`scale-encounter-environment-${e.themeId}-${t}`;let a=Ns(e),o=Ts(e.seed),s=n.surfaceTextures??null,c=new Set;r&&c.add(r),s&&(c.add(s.albedo),s.uniqueAlbedo&&c.add(s.uniqueAlbedo),c.add(s.normal),c.add(s.roughness),s.landBiomeFrondAtlas&&c.add(s.landBiomeFrondAtlas)),n.matureTreeAtlas&&c.add(n.matureTreeAtlas);let l=r?Rs(e,r,n.maxAnisotropy??1):Ls(e),u=Fs(e,a,n.maxAnisotropy??1,s);i.add(l,u,Bs(e)),pc(i,e),s?.uniqueAlbedo||cc(i,e,a,s),e.profile===`carboniferous-coal-swamp`&&mc(i,e,o);let d=[],f=null,p=null;e.profile!==`carboniferous-coal-swamp`&&e.palette.water?(f=ze(a,e.profile===`gobi-braided-basin`?ks:Os,lc(e)),f.name=`scale-encounter-${e.themeId}-seasonal-channel-water`,i.add(f)):e.profile===`carboniferous-coal-swamp`&&e.palette.water&&(p=uc(),fc(i,e,a,p,d));let m=n.forestProps?qs(i,e,n.forestProps,c,a,o,n.ecologyDensity):null;if(e.profile===`kayenta-seasonal-floodplain`&&n.forestProps&&n.matureTreeAtlas){let t=n.ecologyDensity??`current`;i.add(Ko(a,t,n.forestProps,c,n.matureTreeAtlas,null,[`araucarian-conifer`]),us(a,t,n.forestProps,c,n.matureTreeAtlas)),ic(i,e,n.ecologyDensity,a,n.matureTreeAtlas)}if(e.profile===`gobi-braided-basin`&&n.matureTreeAtlas&&ic(i,e,n.ecologyDensity,a,n.matureTreeAtlas),e.profile===`carboniferous-coal-swamp`&&n.forestProps&&s?.landBiomeFrondAtlas){let e=`1.5x`,t=Ko(a,e,n.forestProps,c,null,null,[`tree-fern`],s.landBiomeFrondAtlas);t.name=`scale-encounter-carboniferous-world-space-tree-fern-forest`,t.rotation.y=.34,i.add(t);let r=Ko(a,e,n.forestProps,c,null,null,[`tree-fern`],s.landBiomeFrondAtlas);r.name=`scale-encounter-carboniferous-world-space-far-tree-fern-forest`,r.rotation.y=-.51,r.scale.set(2.08,1.42,2.08),i.add(r);let o=Ko(a,e,n.forestProps,c,null,null,[`tree-fern`],s.landBiomeFrondAtlas);o.name=`scale-encounter-carboniferous-world-space-horizon-tree-fern-forest`,o.rotation.y=1.16,o.scale.set(3.05,2.28,3.05),i.add(o)}let h=e.profile===`carboniferous-coal-swamp`;return hc(i,e,{calamites:h||!m?oc(i,e,n.ecologyDensity,a,o):0,distantLandforms:sc(i,e,a,o,s),ferns:m?0:$s(i,e,n.ecologyDensity,a,o),gravel:m?0:Js(i,e,n.ecologyDensity,a,o),lycopsids:h||!m?ac(i,e,n.ecologyDensity,a,o,s?.landBiomeFrondAtlas??null):0,riparianPlants:m?0:Zs(i,e,n.ecologyDensity,a,o),scannedBranches:m?.branch??0,scannedFerns:m?.fern??0,scannedLogs:m?.log??0,scannedRocks:m?.rock??0,scannedShrubs:m?.shrub??0,shrubs:m?0:Ys(i,e,n.ecologyDensity,a,o),treeFerns:h||!m?ec(i,e,n.ecologyDensity,a,o,s?.landBiomeFrondAtlas??null):0}),{animalContactCue:null,borrowedTextures:c,cameraCentredSkyDome:!0,cameraFarMeters:540,childContactCue:null,distanceFogColour:new P(e.palette.fog),fog:new pe(e.palette.fog,e.atmosphere.fogNearMeters,e.atmosphere.fogFarMeters),groundHeightAtWorld:a,ownsLighting:!0,panoramaTexture:r,root:i,sceneCandidateSemantic:`land-biome`,sceneCandidateVariant:`off`,skyDome:l,toneMappingExposure:e.atmosphere.exposure,variant:t,updateCandidate:(t,n,r,i)=>{f?.updateWater(t,n,r,i),!n&&(p&&p.offset.set(t*.011%1,t*-.018%1),d.forEach((n,r)=>{let i=Number(n.userData.scaleEncounterWaterBaseY??n.position.y);n.position.y=i+Math.sin(t*.28+r*1.7)*.004;let a=n.material;typeof a.opacity==`number`&&(a.opacity=(e.profile===`carboniferous-coal-swamp`?.92:.93)+Math.sin(t*.21+r)*.008)}))}}}var _c=[`baseline`,`ground-slice`,`hybrid-slice`,`production-slice`],vc=360,yc=Be,bc=.055,xc=[-.09,-.045,0,.045,.09];function Sc(e){return vc*2/e}function Q(e,t,n){let r=new b(t,n);return r.name=e,r}function Cc(e,t){let n=Array.isArray(e.material)?e.material:[e.material];n.forEach(e=>Xc(e,t));let r=n.map(e=>e.clone());return Array.isArray(e.material)?r:r[0]}function wc(e,t,n){let r=Yc(e,`dead_tree_trunk`);if(!r)return null;e.updateMatrixWorld(!0),r.updateMatrixWorld(!0);let i=e.matrixWorld.clone().invert().multiply(r.matrixWorld),a=r.geometry.clone();a.applyMatrix4(i),a.computeBoundingBox();let o=a.boundingBox?.clone();if(!o||o.isEmpty())return a.dispose(),null;let s=o.getCenter(new L),c=o.getSize(new L),l=a.getAttribute(`position`),u=o.min.y;for(let e=0;e<l.count;e+=1)Math.abs(l.getX(e)-s.x)>c.x*.18||(u=Math.max(u,l.getY(e)));let d=Math.max(u-o.min.y,c.y*.76);a.translate(-s.x,-o.min.y,-s.z);let f=new b(a,Cc(r,t));f.name=`scale-encounter-archaeopteryx-perch-scanned-log`,f.scale.set(1.45/Math.max(c.x,.001),1,.34/Math.max(c.z,.001)),f.rotation.y=-.16,f.updateMatrixWorld(!0);let p=c.y+1,m=[];for(let e of xc)for(let t of xc){let n=new g(new L(e,p,t),new L(0,-1,0),0,p+1).intersectObject(f,!1)[0];n&&m.push(n.point.y)}let h=m.length>0?Math.max(...m):d;return f.scale.y=(n+bc)/Math.max(h,.001),f.position.y=-.055,f.castShadow=!0,f.receiveShadow=!0,f.userData.scaleEncounterPerchSupportZone={fittedSupportY:h*f.scale.y+f.position.y,footprintSampleCount:m.length,groundEmbedDepth:bc,sampledSupportY:h,sourceHeight:c.y,supportZoneHeight:d},f}function Tc(e){let n=(e+bc)/2,r=new t(n*.9,n,1.35,32,7),i=r.getAttribute(`position`);for(let e=0;e<i.count;e+=1){let t=i.getX(e),n=i.getY(e),r=i.getZ(e),a=Math.atan2(r,t),o=n/1.35,s=1+Math.sin(a*7+o*5.1)*.035+Math.sin(a*13-o*3.7)*.018;i.setXYZ(e,t*s,n,r*s)}r.computeVertexNormals();let a=Q(`scale-encounter-archaeopteryx-perch-fallback-log`,r,new _({color:`#4a3828`,metalness:0,roughness:1}));return a.rotation.set(0,-.16,Math.PI/2),a.position.y=(e-bc)/2,a.castShadow=!0,a.receiveShadow=!0,a}function Ec(e,t,n,r,i){let a=_e.archaeopteryx.animalPosition,o=a.y,s=n===`production-slice`?rt(a.x,a.z):yc,c=Math.max(.2,o-s),l=new x;l.name=`scale-encounter-archaeopteryx-perch`,l.position.set(a.x,s,a.z);let u=r?wc(r,i,c):null,d=u??Tc(c);l.add(d),l.userData.scaleEncounterPerch={animalId:`archaeopteryx`,asset:u?`forest-props-real-v1`:`procedural-fallback`,form:`fallen-log`,groundEmbedDepth:bc,supportTopY:o},e.add(l),t&&(t.userData.scaleEncounterContactGroundY=o+.009)}function Dc(e){let t={land:{bottom:new P(`#d7c9a0`),horizon:new P(`#afc7b2`),top:new P(`#789fb0`)},air:{bottom:new P(`#e9f1e8`),horizon:new P(`#a9d4e3`),top:new P(`#568eb9`)},water:{bottom:new P(`#073945`),horizon:new P(`#176978`),top:new P(`#79bfc0`)}},r=new D(118,32,18),i=r.getAttribute(`position`),a=new Float32Array(i.count*3),o=t[e],s=new P;for(let e=0;e<i.count;e+=1){let t=i.getY(e)/118,n=Math.max(0,t);t>=0?s.copy(o.horizon).lerp(o.top,Math.min(n,1)):s.copy(o.horizon).lerp(o.bottom,Math.min(Math.abs(t),1)),s.toArray(a,e*3)}r.setAttribute(`color`,new B(a,3));let c=Q(`scale-encounter-${e}-dome`,r,new n({depthWrite:!1,side:1,vertexColors:!0}));return c.renderOrder=-100,c}function Oc(e,t=!1){let r=new D(118,64,32);if(r.scale(-1,1,1),t){let e=r.getAttribute(`uv`),t=4.8,n=Math.tanh(t*.5);for(let r=0;r<e.count;r+=1){let i=e.getY(r),a=.5+.5*Math.tanh(t*(i-.5))/n;e.setY(r,a)}e.needsUpdate=!0}let i=Q(`scale-encounter-panorama-dome`,r,new n({depthTest:!1,depthWrite:!1,map:e,toneMapped:t}));return i.frustumCulled=!1,i.renderOrder=-100,i}function kc(e,t,n,r){for(let i of[e.albedo,e.normal,e.roughness,e.dryLitterAlbedo])i&&(i.anisotropy=Math.max(1,Math.min(t,8)),i.center.set(.5,.5),i.repeat.set(n,n),i.rotation=r,i.needsUpdate=!0)}function Ac(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)}var jc=[2,4,6,8,10,12,14,16,18,20,22,25,28,32,36,41,47,54,62,72,84,98,114,132,154,180,212,252,302,vc],Mc=22,Nc=52;function Pc(e,t,n){let r=Math.hypot(e,t),i=Math.atan2(t,e),a=Ac(Mc,Nc,r),o=Math.sin(e*.071+.4)*.22+Math.cos(t*.057-.7)*.19+Math.sin((e+t)*.031+1.2)*.3+Math.cos((e-t)*.018)*.25,s=n?Math.exp(-(((e+48)/52)**2+((t-112)/39)**2))*7.2+Math.exp(-(((e-71)/62)**2+((t-136)/48)**2))*8.8+Math.exp(-(((e+126)/74)**2+((t-18)/56)**2))*5.4+Math.exp(-(((e-142)/82)**2+((t+44)/67)**2))*6.2:0,c=(n?Ac(96,292,r):0)*(1.8+Math.sin(i*3.7-.2)*.72);return a*(o+s)+c}function Fc(e,t,n){let r=Ac(35,176,Math.hypot(e,t)),i=.5+Math.sin(e*.033+t*.017)*.22+Math.cos(e*.012-t*.027+.8)*.18+Math.sin((e-t)*.064)*.1,a=new P(`#677356`),o=new P(`#b7aa7e`),s=new P(`#3e5742`);return n.copy(a).lerp(o,Math.max(.08,Math.min(.9,i))).lerp(s,r*.9),n}function Ic(e){let t=[0,0,0],n=[],r=[.5,.5],i=[],a=Fc(0,0,new P);a.toArray(n,0),jc.forEach(i=>{for(let o=0;o<96;o+=1){let s=o/96*Math.PI*2,c=Math.cos(s)*i,l=Math.sin(s)*i;t.push(c,l,Pc(c,l,e)),Fc(c,l,a).toArray(n,n.length),r.push(c/(vc*2)+.5,l/(vc*2)+.5)}});for(let e=0;e<96;e+=1)i.push(0,1+e,1+(e+1)%96);for(let e=1;e<jc.length;e+=1){let t=1+(e-1)*96,n=1+e*96;for(let e=0;e<96;e+=1){let r=(e+1)%96;i.push(t+e,n+e,n+r,t+e,n+r,t+r)}}let o=new M;return o.setAttribute(`position`,new B(new Float32Array(t),3)),o.setAttribute(`color`,new B(new Float32Array(n),3)),o.setAttribute(`uv`,new B(new Float32Array(r),2)),o.setIndex(i),o.computeVertexNormals(),o.computeBoundingSphere(),o}function Lc(e,t,n){if(!e&&t!==`none`)return t===`production-slice`?ot(n):Ic(t===`hybrid-slice`);let r=vc*2,i=new U(r,r,80,80),a=i.getAttribute(`position`),o=new Float32Array(a.count*3),s=new P(e?`#f3f6f8`:`#c2bb95`),c=new P(e?`#c2d1dc`:`#52674c`),l=new P;for(let t=0;t<a.count;t+=1){let n=a.getX(t),r=a.getY(t),i=Math.hypot(n,r),u=Ac(18,78,i),d=Math.atan2(r,n),f=Math.sin(n*.019)*(e?.28:.52)+Math.cos(r*.016)*(e?.22:.44)+Math.sin((n+r)*.043)*(e?.12:.22),p=Math.exp(-(((i-132)/54)**2)),m=.66+Math.sin(d*3+.45)*.2+Math.sin(d*7-.8)*.1+Math.cos(d*11+1.2)*.04,h=p*Math.max(.2,m)*(e?4.8:8.4),g=Ac(90,260,i)*(e?1.5:3.1)*(.82+Math.sin(d*5-.4)*.18),_=u*f+h+g;a.setZ(t,_);let v=Ac(24,136,i);l.copy(s).lerp(c,v),l.toArray(o,t*3)}return i.setAttribute(`color`,new B(o,3)),i.computeVertexNormals(),i}function Rc(){let e=vc*2,t=new U(e,e,72,72),n=t.getAttribute(`position`),r=new Float32Array(n.count*3),i=new P(`#c7d0b5`),a=new P(`#1f6268`),o=new P;for(let e=0;e<n.count;e+=1){let t=n.getX(e),s=n.getY(e),c=Math.hypot(t,s),l=Math.atan2(s,t),u=Math.exp(-(((c-128)/62)**2))*(3.4+Math.sin(l*4+.6)*1.1+Math.sin(l*7-.2)*.48);n.setZ(e,Math.sin(t*.052)*.32+Math.cos(s*.041)*.26+Math.sin((t-s)*.09)*.08+u),o.copy(i).lerp(a,Ac(34,170,c)),o.toArray(r,e*3)}return t.setAttribute(`color`,new B(r,3)),t.computeVertexNormals(),t}function zc(){let e=new Uint8Array(16384*4);for(let t=0;t<128;t+=1)for(let n=0;n<128;n+=1){let r=(n+.5-128/2)/(128/2),i=(t+.5-128/2)/(128/2),a=Math.min(1,Math.hypot(r,i)),o=Math.max(0,1-a*a),s=Math.round(255*o*o),c=(t*128+n)*4;e[c]=s,e[c+1]=s,e[c+2]=s,e[c+3]=255}let t=new a(e,128,128,y,k);return t.needsUpdate=!0,t}function Bc(e=`ground`){let t=new Uint8Array(256*256*4);for(let n=0;n<256;n+=1)for(let r=0;r<256;r+=1){let i=(r+.5-256/2)/(256/2),a=(n+.5-256/2)/(256/2),o=Math.hypot(i,a),s=Math.atan2(a,i),c=(e===`water`?.54:e===`air`?.62:.57)+Math.sin(s*5+.4)*.035+Math.sin(s*9-.8)*.018,l=1-Ac(e===`air`?.3:e===`water`?.16:.18,c,o),u=Math.round(255*l),d=(n*256+r)*4;t[d]=u,t[d+1]=u,t[d+2]=u,t[d+3]=255}let n=new a(t,256,256,y,k);return n.needsUpdate=!0,n}function Vc(){let e=new Uint8Array(8192*4);for(let t=0;t<128;t+=1){let n=t/127,r=Ac(.04,.38,n)*(1-Ac(.62,.98,n));for(let n=0;n<64;n+=1){let i=n/64*Math.PI*2,a=.82+Math.sin(i*3+.6)*.1+Math.sin(i*7-.4)*.045,o=Math.round(255*Math.max(0,Math.min(1,r*a))),s=(t*64+n)*4;e[s]=o,e[s+1]=o,e[s+2]=o,e[s+3]=255}}let t=new a(e,64,128,y,k);return t.needsUpdate=!0,t}function Hc(e,r,i,a,o){let s=Q(r,new t(250,250,18,64,4,!0),new n({alphaMap:Vc(),color:i,depthTest:!1,depthWrite:!1,opacity:a,side:2,transparent:!0}));s.position.y=o,s.renderOrder=-12,e.add(s)}function Uc(){let e=new Uint8Array(36864*4),t=[[-.42,.02,.42,.7],[-.12,-.12,.5,.95],[.24,.03,.44,.82],[.5,-.02,.34,.58],[.04,.2,.38,.66]];for(let n=0;n<192;n+=1)for(let r=0;r<192;r+=1){let i=(r+.5-192/2)/(192/2),a=(n+.5-192/2)/(192/2),o=0;for(let[e,n,r,s]of t){let t=((i-e)**2+(a-n)**2)/(r*r);o+=Math.exp(-t*2.1)*s}let s=Math.max(0,1-Math.hypot(i*.78,a*1.15)),c=Math.round(255*Math.max(0,Math.min(1,(o-.16)*.72*s))),l=(n*192+r)*4;e[l]=c,e[l+1]=c,e[l+2]=c,e[l+3]=255}let n=new a(e,192,192,y,k);return n.needsUpdate=!0,n}function Wc(){let e=new Uint8Array(128*256*4);for(let t=0;t<256;t+=1){let n=t/255,r=.1+(1-n)*.42,i=Math.sin(Math.PI*n)**.42;for(let n=0;n<128;n+=1){let a=Math.abs((n+.5)/128-.5)/r,o=Math.max(0,1-a**2)**2,s=Math.round(255*o*i),c=(t*128+n)*4;e[c]=s,e[c+1]=s,e[c+2]=s,e[c+3]=255}}let t=new a(e,128,256,y,k);return t.needsUpdate=!0,t}function Gc(e){let t=new D(1,12,8),n=[`#dce5eb`,`#cbd7df`,`#eef2f4`];[[-42,-28,8.6,2.3,4.8],[-21,-38,6.2,1.7,3.8],[18,-42,7.4,2.1,4.5],[43,-25,9.1,2.5,5.2],[58,-52,11.5,3.1,6.8]].forEach(([r,i,a,o,s],c)=>{let l=Q(`scale-encounter-snow-drift-${c+1}`,t.clone(),new _({color:n[c%n.length],roughness:.98}));l.position.set(r,o*.34-.42,i),l.rotation.y=c*.87,l.scale.set(a,o,s),l.renderOrder=-9,e.add(l)}),t.dispose();let r=new D(1,10,7),i=new _({color:`#59656b`,roughness:.97});[[-31,-23,1.45,.82,1.1],[34,-32,1.8,1.05,1.3]].forEach(([t,n,a,o,s],c)=>{let l=Q(`scale-encounter-snow-rock-${c+1}`,r.clone(),i.clone());l.position.set(t,o*.42-.16,n),l.rotation.set(.08*c,c*.73,-.06*c),l.scale.set(a,o,s),l.renderOrder=-8,e.add(l)}),r.dispose(),i.dispose()}function Kc(e){let n=new D(1,12,8),r=[`#536348`,`#414f3c`,`#6b7453`];[[-42,-28,8.6,2.3,4.8],[-21,-38,6.2,1.7,3.8],[18,-42,7.4,2.1,4.5],[43,-25,9.1,2.5,5.2],[58,-52,11.5,3.1,6.8]].forEach(([t,i,a,o,s],c)=>{let l=Q(`scale-encounter-moss-bank-${c+1}`,n.clone(),new _({color:r[c%r.length],roughness:.98}));l.position.set(t,o*.34-.42,i),l.rotation.y=c*.87,l.scale.set(a,o,s),l.renderOrder=-9,e.add(l)}),n.dispose();let i=Q(`scale-encounter-fallen-log`,new t(.34,.52,5.8,14,2),new _({color:`#544432`,roughness:.98}));i.position.set(-30,.42,-17),i.rotation.set(.08,.46,Math.PI/2),i.renderOrder=-8,e.add(i)}function qc(){let e=[];for(let t=0;t<9;t+=1){let n=t/9*Math.PI*2,r=n+Math.PI/2,i=.9+t%3*.16,a=.13+t%2*.025,o=Math.cos(r)*a,s=Math.sin(r)*a,c=Math.cos(n)*i,l=Math.sin(n)*i;e.push(-o,.06,-s,o,.06,s,c,.34+t%3*.08,l)}let t=new M;return t.setAttribute(`position`,new B(new Float32Array(e),3)),t.computeVertexNormals(),t}function Jc(e,n){let r=new s,i=new D(1,8,6),a=i.getAttribute(`position`);for(let e=0;e<a.count;e+=1){let t=a.getX(e),n=a.getY(e),r=a.getZ(e),i=.84+Math.sin(t*3.7+r*4.3)*.09+Math.cos(n*5.1-t*2.2)*.06;a.setXYZ(e,t*i,n*i,r*i)}i.computeVertexNormals();let o=[[-12,-18,.75,.42,.62],[17,-23,1.1,.58,.82],[-24,-34,1.45,.72,1.08],[31,-39,.9,.46,.72],[-42,-53,1.72,.86,1.25],[48,-61,1.28,.67,.98],[-64,-79,2.15,1.05,1.52],[72,-91,1.82,.88,1.36]],c=n?o:o.slice(0,4),l=new E(i,new _({color:`#5e6251`,roughness:.99}),c.length);l.name=`scale-encounter-forest-rocks`,c.forEach(([e,t,i,a,o],s)=>{r.position.set(e,Pc(e,t,n)+a*.34,t),r.rotation.set(s*.07,s*.83,-s*.035),r.scale.set(i,a,o),r.updateMatrix(),l.setMatrixAt(s,r.matrix)}),l.castShadow=!0,l.receiveShadow=!0,l.renderOrder=-8;let u=[[-8,-21,.7],[-16,-26,.92],[11,-27,.82],[22,-31,1.06],[-29,-38,1.18],[35,-45,.95],[-46,-52,1.32],[52,-57,1.2],[-62,-69,1.48],[66,-74,1.36],[-78,-86,1.65],[83,-94,1.54]],d=n?u:u.slice(0,6),f=new E(qc(),new _({color:`#566d48`,roughness:.94,side:2}),d.length);f.name=`scale-encounter-forest-ferns`,d.forEach(([e,t,i],a)=>{r.position.set(e,Pc(e,t,n)+.025,t),r.rotation.set(0,a*1.71,0),r.scale.setScalar(i),r.updateMatrix(),f.setMatrixAt(a,r.matrix)}),f.castShadow=!0,f.receiveShadow=!0,f.renderOrder=-7;let p=[[-27,-31,.1,.52,1],[38,-54,-.06,-.34,1.24],[-57,-72,.05,.74,1.42]],m=n?p:p.slice(0,1),h=new E(new t(.34,.52,5.8,14,2),new _({color:`#544432`,roughness:.98}),m.length);h.name=`scale-encounter-forest-fallen-logs`,m.forEach(([e,t,i,a,o],s)=>{r.position.set(e,Pc(e,t,n)+.35*o,t),r.rotation.set(i,a,Math.PI/2),r.scale.setScalar(o),r.updateMatrix(),h.setMatrixAt(s,r.matrix)}),h.castShadow=!0,h.receiveShadow=!0,h.renderOrder=-8,e.add(l,f,h)}function Yc(e,t){let n=e.getObjectByName(t)??e.getObjectByName({fern_02:`fern_02_a_lod0`,rock_07:`rock_07_lod0`,dead_tree_trunk:`dead_tree_trunk_lod0`,shrub_04:`shrub_04_a_lod0`}[t]);if(!n)return null;let r=null;return n.traverse(e=>{!r&&e instanceof b&&(r=e)}),r}function Xc(e,t){Object.values(e).forEach(e=>{e&&typeof e==`object`&&`isTexture`in e&&t.add(e)})}function Zc(e,t,n,r,i,a,o,c){let l=Array.isArray(t.material)?t.material:[t.material];l.forEach(e=>Xc(e,a));let u=l.map(e=>e.clone());(r===`fern`||r===`shrub`)&&u.forEach(e=>{e.side=2,e.alphaToCoverage=!0,e instanceof _&&(e.metalness=0,e.roughness=Math.max(.84,e.roughness),e.envMapIntensity=Math.min(.78,e.envMapIntensity))});let d=new E(t.geometry.clone(),Array.isArray(t.material)?u:u[0],n.length);d.name=e,c&&c.updateMatrixWorld(!0),t.updateMatrixWorld(!0);let f=c?c.matrixWorld.clone().invert().multiply(t.matrixWorld):t.matrixWorld.clone();t.geometry.computeBoundingBox();let p=t.geometry.boundingBox?.clone()??null,m=new s,h=new s,g=new V,v=new L,y=new T,b=new T,x=[];return n.forEach((t,n)=>{let a=o?o(t.x,t.z):Pc(t.x,-t.z,i)+yc,s=r===`rock`?t.scale*2.15:t.scale,l=Math.hypot(t.x,t.z),u=r===`rock`&&l<44&&n%4==0?1.55:1,_=r===`log`?.075*s:r===`rock`?.028*s:0,S=r===`fern`||r===`shrub`?.012*s:r===`rock`?.022*s*u:.036*s;if(m.position.set(t.x,c?0:a-_,t.z),c&&o?(el(o,t.x,t.z,r,v),y.setFromUnitVectors(Qc,v),b.setFromAxisAngle(Qc,t.yaw),h.rotation.set(t.pitch,0,t.roll),m.quaternion.copy(y).multiply(b).multiply(h.quaternion)):m.rotation.set(t.pitch,t.yaw,t.roll),r===`rock`)m.scale.set(s*u*t.aspect,s*u*(.92+n%4*.06),s*u/t.aspect);else if(r===`fern`||r===`shrub`){let e=s*(r===`fern`?.68:.92);m.scale.set(e*t.aspect,e,e/t.aspect)}else{let e=l<44&&n<2?1.72:1;m.scale.set(s,s*e*(.9+n%3*.07),s*e)}if(m.updateMatrix(),g.multiplyMatrices(m.matrix,f),c&&p){m.position.y=Ja(p,g,a,S),m.updateMatrix(),g.multiplyMatrices(m.matrix,f);let e=p.clone().applyMatrix4(g).min.y;x.push({groundingError:e-(a-S),terrainY:a,worldBottomY:e,x:t.x,z:t.z})}if(d.setMatrixAt(n,g),r===`fern`||r===`shrub`){let t=.54+(n*7+e.length)%6*.014;d.setColorAt(n,new P().setRGB(t*.8,t*.91,t*.66))}}),d.instanceMatrix.needsUpdate=!0,d.instanceColor&&(d.instanceColor.needsUpdate=!0),d.computeBoundingBox(),d.computeBoundingSphere(),d.castShadow=!0,d.receiveShadow=!0,d.userData.scaleEncounterGroundingSamples=x,d}var Qc=new L(0,1,0);function $c(e,t){let n=e.getObjectByName(t);if(!n)return null;let r=n instanceof b?n:null;return n.traverse(e=>{!r&&e instanceof b&&(r=e)}),r?{mesh:r,name:t}:null}function el(e,t,n,r,i){let a=r===`log`?2.1:r===`branch`?1.1:r===`litter`||r===`moss`?.9:.42,o=(e(t+a,n)-e(t-a,n))/(a*2),s=(e(t,n+a)-e(t,n-a))/(a*2);return i.set(-o,1,-s).normalize()}function tl(e,t){return e===`branch`?1.05:e===`fern`?.68:e===`litter`?1.7:e===`moss`?1.62:e===`shrub`?1.42:e===`log`?t.startsWith(`dead_tree_trunk_02`)?.78:1.32:t.startsWith(`rock_09`)?9.2:t.startsWith(`stone_01`)?5.2:3.05}function nl(e,t,n,r){let i=tl(t,n)*r.scale;return t===`log`?e.scale.set(i*(.92+r.patchId%4*.08),i*(.9+r.patchId%3*.07),i/r.aspect):t===`branch`?e.scale.set(i*r.aspect,i,i/Math.sqrt(r.aspect)):t===`moss`||t===`litter`?e.scale.set(i*r.aspect,i,i/r.aspect):e.scale.set(i*r.aspect,i*(.9+r.patchId%5*.04),i/r.aspect),i}function rl(e,t){return e===`fern`?.014*t:e===`shrub`?.017*t:e===`rock`?.038*t:e===`log`?.095*t:e===`branch`?.032*t:0}function il(e){return Math.floor((e.geometry.index?.count??e.geometry.getAttribute(`position`).count)/3)}function al(e,t,n,r,i,a,o){if(t.length===0)return null;let c=t.map(e=>n.get(e.templateName)),l=c.every(({mesh:e})=>e.geometry.index!==null),u=c.every(({mesh:e})=>e.geometry.index===null);if(!l&&!u)return null;let d=t.reduce((e,t)=>e+t.placements.length,0),f=c.reduce((e,{mesh:t})=>e+t.geometry.getAttribute(`position`).count,0),p=l?c.reduce((e,{mesh:t})=>e+(t.geometry.index?.count??0),0):f;for(let{mesh:e}of c)(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>Xc(e,i));let h=c[0].mesh.material,g=new O(d,f,p,(Array.isArray(h)?h[0]:h).clone());g.name=e,g.castShadow=o,g.receiveShadow=!0,g.perObjectFrustumCulled=!0,g.sortObjects=!0,r.updateMatrixWorld(!0);let _=r.matrixWorld.clone().invert(),v=new s,y=new s,b=new V,x=new V,S=new L,C=new T,w=new T,E=[],D=[],k=new L,A=0,ee=0,j=0;for(let e of t){let t=n.get(e.templateName).mesh;t.updateMatrixWorld(!0);let r=_.clone().multiply(t.matrixWorld);t.geometry.computeBoundingBox();let i=t.geometry.boundingBox?.clone();if(!i)continue;let o=g.addGeometry(t.geometry);A+=il(t)*e.placements.length;for(let t of e.placements){let n=a(t.x,t.z);v.position.set(t.x,0,t.z),el(a,t.x,t.z,e.kind,S),C.setFromUnitVectors(Qc,S),w.setFromAxisAngle(Qc,t.yaw),y.rotation.set(e.kind===`moss`||e.kind===`litter`?0:t.pitch,0,e.kind===`moss`||e.kind===`litter`?0:t.roll),v.quaternion.copy(C).multiply(w).multiply(y.quaternion);let s=nl(v,e.kind,e.templateName,t);v.updateMatrix(),b.multiplyMatrices(v.matrix,r);let c=e.kind===`moss`||e.kind===`litter`?.009:0,l=rl(e.kind,s);v.position.y=Ja(i,b,n+c,l),v.updateMatrix(),x.multiplyMatrices(v.matrix,r);let u=g.addInstance(o);if(g.setMatrixAt(u,x),e.kind===`fern`||e.kind===`shrub`){let e=.5+(u*11+t.patchId)%7*.014;g.setColorAt(u,new P().setRGB(e*.79,e*.9,e*.65))}let d=i.clone().applyMatrix4(x),f=n+c-l,p=d.min.y-f;j=Math.max(j,Math.abs(p)),d.min.y>n+.002&&(ee+=1),d.getSize(k);let m=d.getCenter(new L);D.push({encounterRadius:Math.hypot(m.x,m.z),instanceId:u,maximumWorldDimension:Math.max(k.x,k.y,k.z),worldCentre:m}),E.filter(({templateName:t})=>t===e.templateName).length<2&&E.push({burialDepth:l,groundingError:p,instanceId:u,kind:e.kind,placement:t,terrainY:n,templateName:e.templateName,worldBottomY:d.min.y})}}g.computeBoundingBox(),g.computeBoundingSphere(),g.userData.scaleEncounterEcologyInstanceCount=d,g.userData.scaleEncounterEcologySamples=E,g.userData.scaleEncounterEcologyUniqueGeometryCount=t.length,g.userData.scaleEncounterEstimatedTriangles=A,g.userData.scaleEncounterEcologyGrounding={airborneInstanceCount:ee,instanceCount:d,maximumAbsoluteGroundingError:j},g.userData.scaleEncounterProjectedPixelCullThreshold={far:3.25,near:1.75};let M=new R,te=new L,N=g.onBeforeRender.bind(g);return g.onBeforeRender=(e,t,n,r,i,a)=>{if(n instanceof m){e.getSize(M),n.getWorldPosition(te);let t=M.y/(2*Math.tan(n.fov*Math.PI/360)),r=0;for(let e of D){let n=Math.max(.01,te.distanceTo(e.worldCentre)),i=e.maximumWorldDimension*t/n,a=e.encounterRadius<=64?1.75:3.25,o=n<34||i>=a;g.setVisibleAt(e.instanceId,o),o&&(r+=1)}g.userData.scaleEncounterEcologyVisibleInstanceCount=r}N(e,t,n,r,i,a)},g}function ol(e,t,n,r,i,a,o){let s=new Map;for(let e of t){let t=n.get(e.templateName);if(!t)continue;let r=Array.isArray(t.mesh.material)?t.mesh.material[0]:t.mesh.material,i=Object.entries(t.mesh.geometry.attributes).sort(([e],[t])=>e.localeCompare(t)).map(([e,t])=>`${e}:${t.itemSize}:${+!!t.normalized}:${t.array.constructor.name}`).join(`|`),a=[e.kind,r?.uuid??`material-unavailable`,t.mesh.geometry.index?`indexed`:`non-indexed`,i].join(`::`),o=s.get(a);o?o.recipes.push(e):s.set(a,{kind:e.kind,recipes:[e]})}return[...s.values()].flatMap(({kind:t,recipes:s},c)=>{let l=al(`${e}-${t}-${c}`,s,n,r,i,a,o);return l?[l]:[]})}function sl(e,t,n,r,i,a=!1){let o=new Map;for(let e of Oa){let n=$c(t,e);if(!n)return!1;o.set(e,n)}let s=Ra(i).batches.filter(({kind:e})=>e!==`litter`&&e!==`moss`&&e!==`fern`&&e!==`shrub`).map(e=>({...e,placements:e.placements.filter(({x:e,z:t})=>Math.hypot(e,t)>=42)})).filter(({placements:e})=>e.length>0),c=ol(`scale-encounter-production-ecology-shadowless-props-batch`,s,o,t,n,r,!1);if(c.length===0)return!1;let l=new x;l.name=`scale-encounter-real-forest-props`,l.userData.scaleEncounterEcologyCounts=Object.fromEntries([`branch`,`log`,`rock`].map(e=>[e,s.filter(t=>t.kind===e).reduce((e,t)=>e+t.placements.length,0)])),l.userData.scaleEncounterEcologyDensity=i,l.userData.scaleEncounterEcologyDrawCalls=c.length,l.userData.scaleEncounterDeferredOpaqueGroundPatches=!0,l.add(...c),e.add(l);let u=Yc(t,`fern_02`),d=Yc(t,`rock_07`),f=Yc(t,`dead_tree_trunk`);if(u&&d&&f){let i=new x;i.name=`scale-encounter-production-hero-ecology`;let o=(e,t,n,r,i=1)=>({x:e,z:t,scale:n,yaw:r,aspect:i,pitch:0,roll:0,tier:`near`}),s=a?[o(-13.2,-1.2,1.15,.5),o(-11.5,-1.1,1.1,2.1),o(-10,-1.8,1.35,4.6),o(-8.5,-3.2,.95,1.4),o(-5.5,-7.2,1.2,3.6),o(-4,-8.8,.9,5.1),o(-10.2,6.8,1.05,2.8),o(-9.2,5.2,1.25,.9),o(-8.3,3.3,.9,3.3),o(1.2,-9.7,1.2,5.1),o(2.5,-9.3,1.1,2.4),o(3.8,-8.7,1.35,4.4),o(5.3,-8.4,.95,1.2),o(7.5,-7.8,1.3,3.9),o(8.7,-7.9,.85,2.5),o(10.1,-7.8,1.15,.7),o(15.2,-8.3,1.4,4.2),o(16.8,-8.7,.95,5.3)]:[o(-8.5,-8.8,1.45,.5),o(-6.8,-9.4,1.2,2.1),o(-5.6,-8.7,1.6,4.6),o(-9.2,-7.1,1.1,1.4),o(-6.1,-7.2,1.35,3.6),o(-10.2,-9.5,.9,5.1),o(-4.6,-10.2,1.05,2.8),o(10.2,8.6,1.7,.9),o(12.3,9.5,1.4,3.3),o(13.8,8.4,1.3,5.1),o(11.8,6.9,1.1,2.4),o(9.6,7.1,1.2,4.4),o(14.9,10.2,.95,1.2),o(12.6,11.3,1.1,3.9),o(16.2,-11.1,1.6,2.5),o(18.4,-12.2,1.35,.7),o(19.9,-10.8,1.55,4.2),o(17.5,-9.3,1.15,5.3),o(20.4,-13.2,.95,1.9),o(15.1,-12.9,1.2,3.4),o(21.3,-10.5,1,4.8)];i.add(Zc(`scale-encounter-production-hero-ferns`,u,s,`fern`,!0,n,r,t),Zc(`scale-encounter-production-hero-rocks`,d,a?[o(-10.6,-1.5,1,.8),o(-11.2,-1.3,.7,2.6),o(4.3,-8.6,1.1,4.1),o(4.9,-8.5,.7,1.2)]:[o(-9.1,-8.2,1,.8),o(-8.5,-8.6,.7,2.6),o(13.1,8.2,1.4,4.1),o(13.8,8.5,.8,1.2),o(17.4,-11.9,1.2,3.5),o(18.1,-11.4,.75,5.2)],`rock`,!0,n,r,t),Zc(`scale-encounter-production-hero-logs`,f,a?[o(-11.5,-1.9,1,.2),o(8.5,-8.2,.85,-.7)]:[o(-7.4,-8.2,1.1,.2),o(11.8,8.4,1.05,1.2),o(18.1,-10.8,1.25,-.4)],`log`,!0,n,r,t)),e.add(i)}return!0}function cl(e,t,n,r,i,a){if(!r)return;let o=new x;o.name=`scale-encounter-real-forest-hero-props`,o.add(Zc(`scale-encounter-real-hero-rocks`,t,[{aspect:1.08,pitch:.04,roll:-.03,scale:2.45,tier:`near`,x:-27,yaw:.4,z:18},{aspect:.9,pitch:-.02,roll:.05,scale:2.75,tier:`near`,x:31,yaw:2.1,z:16},{aspect:1.16,pitch:.02,roll:.02,scale:2.28,tier:`near`,x:-35,yaw:4.5,z:-25}],`rock`,!0,i,a),Zc(`scale-encounter-real-hero-logs`,n,[{aspect:1,pitch:.03,roll:.02,scale:1.35,tier:`near`,x:-31,yaw:.58,z:-24},{aspect:1,pitch:-.04,roll:-.02,scale:1.5,tier:`near`,x:35,yaw:-.42,z:-34}],`log`,!0,i,a)),e.add(o)}function ll(e,t,n,r,i){let a=Yc(t,`fern_02`),o=Yc(t,`rock_07`),s=Yc(t,`dead_tree_trunk`);if(!a||!o||!s)return!1;let c=new x;c.name=`scale-encounter-real-forest-props`;let l=xa(n?`hybrid-slice`:`ground-slice`);return c.add(Zc(`scale-encounter-real-ferns`,a,l.ferns,`fern`,n,r,i),Zc(`scale-encounter-real-rocks`,o,l.rocks,`rock`,n,r,i),Zc(`scale-encounter-real-logs`,s,l.logs,`log`,n,r,i)),e.add(c),cl(e,o,s,n,r,i),!0}function ul(e){e.userData.scaleEncounterNeedsReviewedMiddleDistanceAssets=!0}function dl(e,t,n,r,i,a,o,s,c,l,u){let d=!r&&o===`production-slice`;t&&kc(t,i,d?1:Sc(t.physicalWidthMeters),d?0:r?-.31:.27);let f=!r&&o===`hybrid-slice`,p=f||d,m=new _({alphaMap:p?null:Bc(`ground`),color:t&&!r&&o===`baseline`?`#ffffff`:t?d?`#918d7d`:`#d7d2bd`:r?`#edf3f8`:`#9a8a65`,map:t?.albedo??null,normalMap:t?.normal??null,normalScale:new R(r?.42:o===`baseline`?.58:o===`hybrid-slice`?.18:.34,r?.42:o===`baseline`?.58:o===`hybrid-slice`?.18:.34),roughness:r?.88:o===`baseline`?.96:o===`production-slice`?1:.88,roughnessMap:t?.roughness??null,transparent:!p,vertexColors:!0});if(f)qa(m,{cameraFadeEndMeters:155,cameraFadeStartMeters:58,horizonColourStrength:.72,maximumCoverageLoss:.86,subjectFadeEndMeters:175,subjectFadeStartMeters:68});else if(d&&t?.uniqueAlbedo&&(m.color.set(`#d3cfc4`),Fe(m,{colourMap:t.uniqueAlbedo,widthMeters:96,detailMeters:1.6,farColour:`#50432f`,grainStrength:.4,colourMipLevel:6}),u)){let e=m.onBeforeCompile.bind(m);m.onBeforeCompile=(t,n)=>{e(t,n),t.fragmentShader=t.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
float bankWetness = 1.0 - smoothstep(-.12, .16, vAuthoredGroundWorld.y);
diffuseColor.rgb *= 1.0 - bankWetness * .24;`)},m.customProgramCacheKey=()=>`forest-stream-bank-v4`}let h=Q(`scale-encounter-land-ground`,Lc(r,r||o===`baseline`?`none`:o,u),m);return h.rotation.x=-Math.PI/2,h.position.y=yc,h.receiveShadow=o!==`baseline`,h.renderOrder=p?0:-20,e.add(h),a&&(r?(Hc(e,`scale-encounter-snow-horizon-haze`,`#d8e3eb`,.34,2.8),Gc(e)):o===`baseline`?(Hc(e,`scale-encounter-forest-horizon-haze`,`#50654c`,.4,3.4),Kc(e)):o===`ground-slice`?(Hc(e,`scale-encounter-forest-horizon-haze`,`#50654c`,.4,3.4),(!c||!ll(e,c,!1,l))&&Jc(e,!1)):!(c&&d?sl(e,c,l,u??rt,s,!!u):c&&ll(e,c,!0,l))&&!d&&Jc(e,!0)),{animalContactCue:null,childContactCue:null}}function fl(e){let n=new t(.34,.58,7.5,7),r=new de(2.5,7.2,8),i=new _({color:`#5c4a38`,roughness:.98}),a=[new _({color:`#3e684f`,roughness:.96}),new _({color:`#52745a`,roughness:.96}),new _({color:`#355c49`,roughness:.96})];[[-30,-16],[-23,-22],[-13,-25],[2,-27],[16,-24],[28,-17],[34,-8],[-34,-7],[-31,18],[-17,25],[5,28],[24,23],[34,13]].forEach(([t,o],s)=>{let c=new x;c.name=`scale-encounter-tree-${s+1}`;let l=.82+s%4*.09,u=Q(`trunk`,n.clone(),i.clone());for(let e of Array.isArray(u.material)?u.material:[u.material])e.depthWrite=!1;u.renderOrder=-10,u.position.y=3.75*l,u.scale.y=l;let d=Q(`crown`,r.clone(),a[s%a.length].clone());for(let e of Array.isArray(d.material)?d.material:[d.material])e.depthWrite=!1;d.renderOrder=-10,d.position.y=8*l,d.scale.setScalar(l),c.position.set(t,0,o),c.rotation.y=s*.73,c.add(u,d),e.add(c)}),n.dispose(),r.dispose(),i.dispose(),a.forEach(e=>e.dispose())}function pl(e,t){let r=Q(`scale-encounter-air-far-below`,new se(vc,64),new n({alphaMap:Bc(`air`),color:`#78aac0`,depthWrite:!1,opacity:.46,side:2,transparent:!0}));if(r.rotation.x=-Math.PI/2,r.position.y=-24,r.renderOrder=-30,e.add(r),!t)return;let i=new n({alphaMap:Uc(),color:`#f5f4e9`,opacity:.64,side:2,transparent:!0,depthWrite:!1}),a=new U(1,1,1,1);[[2,-16.2,2,28,14],[-24,-18.8,-14,34,17],[27,-20.1,21,39,19],[-7,-21.2,34,31,15],[4,-21.4,49,42,20],[-76,-18.6,-64,38,19],[67,-20.2,-58,46,23],[-91,-21.5,23,31,16],[84,-18.1,34,42,20],[19,-22.3,92,52,25],[-28,-19.5,-105,37,18],[118,-23,-12,29,14],[-123,-20.7,-17,35,17]].forEach(([t,n,r,o,s],c)=>{let l=Q(`scale-encounter-cloud-${c+1}`,a.clone(),i.clone());l.name=`scale-encounter-cloud-${c+1}`,l.position.set(t,n,r),l.rotation.set(-Math.PI/2,0,c*.61),l.scale.set(o,s,1),l.material.opacity=.48+c%4*.055,l.renderOrder=-8,l.userData.scaleEncounterBaseX=t,e.add(l)}),a.dispose(),i.dispose()}function ml(e,t,r=null,i=1){r&&kc(r,i,Sc(r.physicalWidthMeters),.19);let a=Q(`scale-encounter-water-surface`,new se(vc,64),new n({alphaMap:Bc(`water`),color:`#b9e8df`,opacity:.1,side:2,transparent:!0,depthWrite:!1}));a.rotation.x=-Math.PI/2,a.position.y=12.5,a.renderOrder=-10;let o=Q(`scale-encounter-seabed`,Rc(),new _({alphaMap:Bc(`water`),color:r?`#b9c8ae`:`#6f9d94`,map:r?.albedo??null,normalMap:r?.normal??null,normalScale:new R(.48,.48),roughness:.94,roughnessMap:r?.roughness??null,transparent:!0,vertexColors:!0}));if(o.rotation.x=-Math.PI/2,o.position.y=-11,o.renderOrder=-20,e.add(a,o),Hc(e,`scale-encounter-water-horizon-haze`,`#175b68`,.4,-.8),!t)return;let s=Q(`scale-encounter-water-sun-halo`,new se(8.5,32),new n({alphaMap:zc(),color:`#e8fff2`,opacity:.12,side:2,transparent:!0,depthWrite:!1}));s.rotation.x=Math.PI/2,s.position.set(24,10.82,-13),s.renderOrder=-8;let c=Q(`scale-encounter-water-sun-core`,new se(3.4,28),new n({alphaMap:zc(),color:`#fffde6`,opacity:.28,side:2,transparent:!0,depthWrite:!1}));c.rotation.x=Math.PI/2,c.position.set(24,10.76,-13),c.renderOrder=-7,e.add(s,c);let l=new n({alphaMap:Wc(),color:`#d8fff2`,opacity:.095,side:2,transparent:!0,depthWrite:!1}),u=new U(1,1,1,1);for(let t=0;t<6;t+=1){let n=new x;n.name=`scale-encounter-light-shaft-${t+1}`;let r=3.4+t%3*1.2,i=17+t%2*3;for(let e of[0,Math.PI/2]){let t=Q(`soft-light-shaft-plane`,u.clone(),l.clone());t.scale.set(r,i,1),t.position.y=-i/2,t.rotation.y=e,t.renderOrder=-5,n.add(t)}n.position.set(-22+t*9.1,10.2,-16+t%2*11),n.rotation.z=(t-2.5)*.021,n.userData.scaleEncounterBaseRotationZ=n.rotation.z,e.add(n)}u.dispose(),l.dispose()}function hl(e,t){let n=e?.userData?.[t];return n&&typeof n==`object`?n:{}}function $(e,t){let n=e[t];return typeof n==`number`&&Number.isFinite(n)?n:0}function gl(e,t){let n=hl(e.getObjectByName(`scale-encounter-production-ground-detail`),`scaleEncounterProductionGroundDetail`),r=hl(e.getObjectByName(`scale-encounter-production-midground-depth`),`scaleEncounterProductionMidground`),i=hl(e.getObjectByName(`scale-encounter-production-far-depth`),`scaleEncounterProductionFarDepth`),a=hl(e.getObjectByName(`scale-encounter-production-grounded-understory`),`scaleEncounterProductionUnderstory`),o=e.getObjectByName(`scale-encounter-real-forest-props`),s=0,c=0;o?.children.forEach(e=>{e instanceof O&&(s+=$(e.userData,`scaleEncounterEcologyInstanceCount`),c+=1)});let l=e.getObjectByName(`scale-encounter-production-hero-ecology`),u=0,d=0;l?.traverse(e=>{e instanceof E&&(u+=e.count,d+=1)});let f=$(n,`instanceCount`),p=$(n,`humusPatchCount`),m=$(n,`litterPatchCount`),h=$(r,`totalInstances`),g=$(i,`treeCount`),_=$(a,`totalInstances`),v=$(a,`fernCount`),y=$(a,`shrubCount`),b=s+_+f+p+m+u+h+g;e.userData.scaleEncounterEcologyPopulation={density:t,drawCalls:$(n,`drawCalls`)+$(r,`drawCalls`)+$(i,`drawCalls`)+$(a,`drawCalls`)+c+d,farTreeInstances:g,foregroundInstances:s,groundDetailInstances:f,groundHumusPatches:p,groundLitterPatches:m,heroInstances:u,midgroundInstances:h,totalInstances:b,understoryFernInstances:v,understoryInstances:_,understoryShrubInstances:y}}function _l(e){let t=e.layers.background.getObjectByName(`glacier-background-atmosphere-sky`);if(!(t instanceof b))throw e.dispose(),Error(`mammoth-palaeoenvironment-sky-dome-missing`);return t}function vl(e,t,n){if(e===`E`){let e=qn(n.renderer),r=new Set,i=n.forestProps&&Yc(n.forestProps,`rock_07`);if(i&&n.forestProps){let t=[[-17,-6.5,1.25,.6],[-17.8,-6.1,.7,2.4],[10.4,7.2,1.7,1.9],[11.2,7.6,.9,4.2],[-6.4,-13.5,1.5,3.1],[-5.6,-13.8,.8,5.5],[-22.6,19.5,1.8,1.1],[24.1,-22.2,2.1,4.8]].map(([e,t,n,r])=>({x:e,z:t,scale:n,yaw:r,aspect:1,pitch:0,roll:0,tier:`near`}));e.root.add(Zc(`scale-encounter-mammoth-scanned-rocks`,i,t,`rock`,!0,r,(t,n)=>e.groundHeightAtWorld(t,n)-.16,n.forestProps))}return{animalContactCue:null,borrowedTextures:r,cameraCentredSkyDome:!0,cameraFarMeters:3600,childContactCue:null,distanceFogColour:null,environmentIntensity:e.environmentIntensity,environmentMap:e.environmentMap,fog:e.fog,groundHeightAtWorld:e.groundHeightAtWorld,ownsLighting:!0,panoramaTexture:null,root:e.root,sceneCandidateSemantic:`mammoth-palaeoenvironment`,sceneCandidateVariant:`E`,skyDome:e.skyDome,toneMappingExposure:1.04,variant:t,disposeCandidate:()=>e.dispose(),updateCandidate:t=>e.update(t)}}let r=e===`D`?`C`:e,i=Un(r,`balanced`),a=_l(i);return i.root.userData.scaleEncounterSceneCandidate={buildSource:qt,defaultCandidate:!1,diagnostics:i.diagnostics(),legacyTechnicalKey:`glacier`,productionApproved:!1,semanticName:`mammoth-palaeoenvironment`,variant:r},{animalContactCue:null,borrowedTextures:new Set,cameraCentredSkyDome:!0,childContactCue:null,distanceFogColour:null,fog:i.fog(),ownsLighting:!0,panoramaTexture:null,root:i.root,sceneCandidateSemantic:`mammoth-palaeoenvironment`,sceneCandidateVariant:r,skyDome:a,toneMappingExposure:1.62,variant:t,disposeCandidate:()=>i.dispose(),updateCandidate:e=>i.update(e)}}function yl(e){let t=e.root.getObjectByName(`ocean-background-approved-exhibit-reference`);if(!(t instanceof b))throw e.dispose(),Error(`ocean-environment-backdrop-missing`);return t}function bl(e,t=null){if(t){let n=new ge(e);n.compileEquirectangularShader();let r=n.fromEquirectangular(t);return r.texture.name=`ocean-coherent-radiance-ibl-pmrem`,n.dispose(),r}let n=new Uint8Array(2048*4),r=[64,86,83],i=[104,132,119],o=[207,205,174],s=[245,221,175];for(let e=0;e<32;e+=1){let t=1-e/31,a=t<.5?t*2:(t-.5)*2,c=t<.5?r:i,l=t<.5?i:o;for(let r=0;r<64;r+=1){let i=r/64,o=Math.min(Math.abs(i-.31),1-Math.abs(i-.31)),u=t-.88,d=Math.exp(-(o*o/.0032+u*u/.018)),f=(e*64+r)*4;for(let e=0;e<3;e+=1){let t=c[e]+(l[e]-c[e])*a;n[f+e]=Math.round(t+(s[e]-t)*d*.72)}n[f+3]=255}}let c=new a(n,64,32,y,k);c.name=`ocean-underwater-ibl-equirectangular-source`,c.colorSpace=u,c.needsUpdate=!0;let l=new ge(e);l.compileEquirectangularShader();let d=l.fromEquirectangular(c);return d.texture.name=`ocean-underwater-ibl-pmrem`,c.dispose(),l.dispose(),d}function xl(e,t,n){let r=Zr({backdropTexture:null,seabedTextures:null,variant:e}),i=yl(r),a=n?bl(n,e===`D`?r.radianceTexture:null):null;return r.root.userData.scaleEncounterSceneCandidate={buildSources:[yr,`ocean-vs2-4fb623630b22`,`ocean-vs2-616d77d9c288-brightness-reference`],defaultCandidate:e===`D`,leonApproved:!0,naturalnessRevision:e===`D`?xr:br,productionApproved:e===`D`,semanticName:`ocean`,shipsVisible:!1,variant:e,visibleSeabed:!1},{animalContactCue:null,borrowedTextures:new Set,cameraCentredSkyDome:!0,childContactCue:null,distanceFogColour:null,environmentIntensity:e===`D`?.72:.64,environmentMap:a?.texture??null,fog:r.getFog(),ownsLighting:!0,panoramaTexture:null,root:r.root,sceneCandidateSemantic:`ocean`,sceneCandidateVariant:e,skyDome:i,toneMappingExposure:1.18,variant:t,disposeCandidate:()=>{r.dispose(),a?.dispose()},updateCandidate:(e,t,n)=>{n instanceof m&&r.update(t?0:e,n)}}}function Sl(e){let t=e.root.getObjectByName(`seam-safe-analytic-sky-background`);if(!(t instanceof b))throw e.dispose(),Error(`sky-environment-dome-missing`);return t}function Cl(e,t){let n=new ge(e);n.compileEquirectangularShader();let r=n.fromEquirectangular(t);return r.texture.name=`sky-coherent-radiance-ibl-pmrem`,n.dispose(),r}function wl(e,t,n){let r=n.camera??new m(29,1,.03,240),i=n.animalBounds?.clone()??new z(new L(-3.5,3.8,-.7),new L(3.5,5.8,.7)),a=n.avatarBounds?.clone()??new z(new L(-.5,4.1,14.4),new L(.5,5.5,15.6)),o=i.clone().union(a),s=o.clone().expandByPoint(r.position).expandByScalar(22),c=o.clone().union(s).expandByScalar(1),l=Ji({coastTemplate:n.forestProps??null,assetLease:{assetId:we.assetId,manifestSha256:we.manifestSha256,productionApproved:!0,status:`production-approved`},avatarBounds:a,cameraState:{aspect:r.aspect,far:r.far,fieldOfViewDegrees:r.fov,near:r.near,position:r.position.clone(),stage:`overview`,target:o.getCenter(new L),viewportHeight:Math.max(1,Math.round(900/Math.max(r.aspect,.01))),viewportWidth:900},cameraSweepBounds:s,corridorBounds:c,rendererCapabilities:{isWebGl2:!1,maxAnisotropy:n.maxAnisotropy??1,maxTextureSize:0,pixelRatio:0,renderer:`captured-separately-by-main-runtime-evidence`,vendor:`captured-separately-by-main-runtime-evidence`},subjectBounds:i,variant:e}),u=Sl(l),d=e===`D`&&n.renderer?Cl(n.renderer,l.radianceTexture):null;return l.root.userData.scaleEncounterSceneCandidate={buildSource:we.buildSource,defaultCandidate:e===`D`,baseLeonApproved:we.leonApproved,naturalnessGate:`local-review-2026-09-05`,naturalnessRevision:`vegetated-landforms-and-fixed-shore-v2`,productionApproved:!1,semanticName:`sky`,variant:e},{animalContactCue:null,borrowedTextures:new Set,cameraCentredSkyDome:!1,cameraFarMeters:1e3,childContactCue:null,distanceFogColour:null,environmentIntensity:e===`D`?.68:null,environmentMap:d?.texture??null,fog:null,ownsLighting:!0,panoramaTexture:null,root:l.root,sceneCandidateSemantic:`sky`,sceneCandidateVariant:e,skyDome:u,toneMappingExposure:we.toneMappingExposure,variant:t,disposeCandidate:()=>{l.dispose(),d?.dispose()},updateCandidate:(e,t,n)=>{n instanceof m&&l.update(e,t,n)}}}function Tl(e,t,n=null,r={}){let i=El(e,t,n,r);if(!i)return null;let a=Ie(e,r.animalId===`mammoth`,i.groundHeightAtWorld,r.renderer,i.root);return i.root.add(a.root),{...i,atmosphere:a}}function El(e,t,n=null,r={}){let i=r.sceneCandidateVariant??`off`,a=r.animalId?_e[r.animalId].environmentTheme:null,o=r.animalId&&a?Se(r.animalId,a):null;if(a===`glacier`&&i!==`off`)return vl(i,t,r);if(a===`ocean`&&i!==`off`&&i!==`E`)return xl(i,t,r.renderer);if(a===`sky`&&i!==`off`&&i!==`E`)return wl(i,t,r);if(o?.runtime.runtimeKind===`procedural-biome`){let e=r.preparedLandBiome??null;if(!e)return null;if(e.themeId!==o.runtime.id)throw Error(`scale-encounter-prepared-biome-mismatch:${o.runtime.id}:${e.themeId}`);return gc(e,t,r,n)}let s=new x;s.name=`scale-encounter-environment-${e}-${t}`,o&&(s.userData.scaleEncounterEnvironmentTargetTheme=o.target.id,s.userData.scaleEncounterEnvironmentRuntimeTheme=o.runtime.id,s.userData.scaleEncounterEnvironmentAssetStatus=o.target.assetStatus,s.userData.scaleEncounterEnvironmentUsingCompatibilityFallback=o.usingCompatibilityFallback,s.userData.scaleEncounterEnvironmentLoadPolicy=o.target.loadPolicy,s.userData.scaleEncounterEnvironmentRevealPolicy=o.target.revealPolicy);let c=a===`forest`?t:`baseline`,l=r.ecologyDensity??`current`,u=r.animalId&&c===`production-slice`?dt(r.animalId):null,d=u?.heightAtWorld,f=d??rt,p=u?ze(u.heightAtWorld,u.centreZ,st,84):null;p&&(p.name=`scale-encounter-${r.animalId}-forest-stream-water`,s.add(p)),s.userData.scaleEncounterEcologyDensity=l;let m=n?Oc(n,c===`production-slice`):Dc(e);a===`forest`&&c===`production-slice`&&n&&$i(m),s.add(m);let h=r.surfaceTextures??null,g=new Set;n&&g.add(n),h&&(g.add(h.albedo),h.uniqueAlbedo&&g.add(h.uniqueAlbedo),g.add(h.normal),g.add(h.roughness),h.dryLitterAlbedo&&g.add(h.dryLitterAlbedo),h.landBiomeFrondAtlas&&g.add(h.landBiomeFrondAtlas)),r.matureTreeAtlas&&g.add(r.matureTreeAtlas);let _=a===`forest`&&r.animalId&&r.animalBounds&&r.avatarBounds?mo(r.animalBounds.clone().union(r.avatarBounds),_e[r.animalId].overviewDirection):null,v=null,y=null;if(e===`land`){let e=dl(s,h,n,a===`glacier`,r.maxAnisotropy??1,n!==null,c,l,r.forestProps??null,g,d);v=e.animalContactCue,y=e.childContactCue,r.animalId===`archaeopteryx`&&Ec(s,v,c,r.forestProps??null,g),!n&&(c===`baseline`||c===`hybrid-slice`||c===`production-slice`)&&fl(s),a===`forest`&&c===`hybrid-slice`&&ul(s),a===`forest`&&c===`production-slice`&&(s.add(Ko(f,l,r.forestProps??null,g,r.matureTreeAtlas??null,_,[`araucarian-conifer`]),us(f,l,r.forestProps??null,g,r.matureTreeAtlas??null),Qi(r.matureTreeAtlas??null,h)),gl(s,l))}else e===`air`?pl(s,!0):ml(s,!0,h,r.maxAnisotropy??1);return{animalContactCue:v,borrowedTextures:g,cameraCentredSkyDome:!0,cameraFarMeters:a===`forest`&&c===`production-slice`?480:240,childContactCue:y,distanceFogColour:e===`land`&&c===`production-slice`?new P(`#5b5d54`):null,fog:a===`forest`&&c===`production-slice`?new pe(`#696c61`,100,360):null,...e===`land`&&c===`production-slice`?{groundHeightAtWorld:f}:{},ownsLighting:!1,panoramaTexture:n,root:s,sceneCandidateSemantic:null,sceneCandidateVariant:`off`,...p?{updateCandidate:p.updateWater}:{},skyDome:m,toneMappingExposure:null,variant:t}}function Dl(e,t,n){if(!e)return;let r=new z().setFromObject(t,!0);if(r.isEmpty()){e.visible=!1;return}let i=r.getCenter(new L),a=r.getSize(new L),o=Number(e.userData.scaleEncounterContactGroundY??-.018);e.position.set(i.x,o,i.z),e.scale.set(Math.max(.32,a.x*n),Math.max(.32,a.z*n),1),e.visible=!0}function Ol(e,t,n){e&&(Dl(e.animalContactCue,t,.38),Dl(e.childContactCue,n,.5))}function kl(e,t,n,r,i){if(!e)return;e.updateCandidate?.(t,n,r,i),e.atmosphere?.update(t,n,r);let a=r instanceof m?r.position:r;if(a&&e.cameraCentredSkyDome&&e.skyDome.position.copy(a),!(n||e.variant!==`hybrid-slice`)){for(let n of e.root.children)if(n.name.startsWith(`scale-encounter-cloud-`)){let e=n.userData.scaleEncounterBaseX;typeof e==`number`&&(n.position.x=e+Math.sin(t*.08+n.id)*.18)}else if(n.name.startsWith(`scale-encounter-light-shaft-`)){let e=n.userData.scaleEncounterBaseRotationZ;typeof e==`number`&&(n.rotation.z=e+Math.sin(t*.16+n.id)*.015)}}}function Al(e){if(!e)return;if(e.atmosphere?.dispose(),e.disposeCandidate){e.disposeCandidate();return}let t=new Set;e.root.traverse(n=>{if(!(n instanceof b)&&!(n instanceof E))return;n instanceof O&&t.add(n);let r=Array.isArray(n.material)?n.material:[n.material];for(let t of r){let n=t;for(let[t,r]of Object.entries(n))r&&typeof r==`object`&&`isTexture`in r&&e.borrowedTextures.has(r)&&(n[t]=null)}}),t.forEach(e=>{e.dispose(),e.geometry=new M}),ve(e.root)}export{kl as a,Ae as c,Ol as i,Tl as n,$r as o,Al as r,ai as s,_c as t};