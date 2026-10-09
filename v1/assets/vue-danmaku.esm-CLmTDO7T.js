import{I as le,i as x,c as B,B as oe,s as J,j as se,C as K,X as ue,Y as re,Q as ie,a as de,o as ce,b as me,z as ve,g as fe}from"./index-FnnbuGAd.js";const L=new Map,H=new Map;function ne(e,s,m,w,i,l,r){const k=-1*(r||-1);e.style.transform="translateX(0px)",e.style[k<0?"right":"left"]=`${m}px`;const E=performance.now(),p=m/w*1e3,h=m*k,M=-s*k;H.set(e,h);const z=requestAnimationFrame((function v(N){if(i())return;const d=N-E;if(d>=p)return void l(e);const y=h+(M-h)*(d/p);e.style.transform=`translateX(${y-h}px)`,H.set(e,y);const u=requestAnimationFrame(v);L.set(e,u)}));L.set(e,z)}function P(e,s,m,w,i,l,r){const k=H.get(e);if(k===void 0)return void ne(e,s,m,w,i,l);const E=-1*(r||-1),p=m*E,h=-s*E,M=m/w*1e3,z=M*((p-k)/(p-h)),v=performance.now()-z,N=requestAnimationFrame((function d(y){if(i())return;const u=y-v;if(u>=M)return void l(e);const A=p+(h-p)*(u/M);e.style.transform=`translateX(${A-p}px)`,H.set(e,A);const R=requestAnimationFrame(d);L.set(e,R)}));L.set(e,N)}function U(e){const s=L.get(e);s&&(cancelAnimationFrame(s),L.delete(e))}function ee(){L.forEach((e=>{cancelAnimationFrame(e)})),L.clear(),H.clear()}var te=le({name:"vue-danmaku",components:{},props:{danmus:{type:Array,required:!0,default:()=>[]},channels:{type:Number,default:0},autoplay:{type:Boolean,default:!0},loop:{type:Boolean,default:!1},loopOnly:{type:Boolean,default:!1},randomChannel:{type:Boolean,default:!1},isSuspend:{type:Boolean,default:!1},performanceMode:{type:Boolean,default:!0},debounce:{type:Number,default:100},speeds:{type:Number,default:200},top:{type:Number,default:4},right:{type:Number,default:0},zIndex:{type:Number,default:1},autoResize:{type:Boolean,default:!0},mirror:{type:Boolean,default:!1}},emits:["list-end","play-end","dm-over","dm-out","dm-click","dm-remove","error"],setup(e,{emit:s,slots:m,expose:w}){let i=x(document.createElement("div")),l=x(document.createElement("div"));const r=x(0),k=x(0),E=B((()=>e.mirror?1:-1)),p=B((()=>e.mirror?"right":"left"));let h=0;const M=x(0),z=x(0),v=x(0),N=x(!1),d=x(!0),y=x({}),u=x([...e.danmus]);oe((()=>e.danmus),(t=>{u.value=[...t]}));const A=x(new Set);let R=null;(function(t,n,o="modelValue",a){B({get:()=>t[o],set:f=>{n(`update:${o}`,f)}})})(e,s,"danmus");const S=J({channels:B((()=>e.channels||M.value)),debounce:B((()=>e.debounce)),randomChannel:B((()=>e.randomChannel))}),c=J({height:B((()=>z.value)),speeds:B((()=>e.speeds)),top:B((()=>e.top)),right:B((()=>e.right))});function q(){if(r.value=i.value.offsetWidth,k.value=i.value.offsetHeight,r.value===0||k.value===0){const t="获取不到容器宽高";s("error",{message:t,code:"CONTAINER_SIZE_ERROR"}),console.error(`[vue-danmaku] ${t}`)}}function V(){d.value&&(d.value=!1,h||(h=window.setInterval((()=>(function(){if(!d.value&&u.value.length)if(v.value>u.value.length-1){const t=l.value.children.length;e.loop&&(t<v.value&&(s("list-end"),v.value=0,e.loopOnly&&A.value.clear()),F())}else F()})()),S.debounce)),e.performanceMode&&(function(){l.value&&Array.from(l.value.querySelectorAll(".dm")).forEach((t=>{P(t,t.offsetWidth,r.value,c.speeds,(()=>d.value),$,E.value)}))})())}function F(t){const n=e.loop?v.value%u.value.length:v.value;if(e.loopOnly&&A.value.has(n))return;const o=(function(a,f){const C=ue({render:()=>re("div",{},[m.danmu&&m.danmu({danmu:a,index:f})])}),g=C.mount(document.createElement("div"));return g.$el.__vueApp=C,g})(t||u.value[n],n).$el;o.classList.add("dm"),l.value.appendChild(o),o.style.opacity="0",o._vueInstance={instance:o.__vueParentComponent||{ctx:{}},el:o},ie((()=>{c.height||(z.value=o.offsetHeight),S.channels||(M.value=Math.floor(k.value/(c.height+c.top))),(function(a,f){let C=(function(g){let O=[...Array(S.channels).keys()];S.randomChannel&&(O=O.sort((()=>.5-Math.random())));for(let I of O){const _=y.value[I];if(!_||!_.length)return y.value[I]=[g],I%S.channels;for(let b=0;b<_.length;b++){const G=ae(_[b])-10;if(G<=.88*(g.offsetWidth-_[b].offsetWidth)||G<=0)break;if(b===_.length-1)return y.value[I].push(g),I%S.channels}}return-1})(a);if(C>=0){const g=a.offsetWidth,O=c.height;a.dataset.index=`${f}`,a.dataset.channel=C.toString(),a.style.opacity="1",a.style.top=C*(O+c.top)+"px",a.style.width=g+c.right+"px",a.style.zIndex=e.zIndex.toString();const I=_=>{s("dm-click",{el:a,index:f,danmu:u.value[f],event:_})};if(a.addEventListener("click",I),a._clickHandler=I,e.loop&&e.loopOnly&&A.value.add(f),e.performanceMode)ne(a,g,r.value,c.speeds,(()=>d.value),$,E.value);else{a.classList.add("move"),a.style.setProperty("--dm-scroll-width",(r.value+g)*E.value+"px"),a.style[p.value]=`${r.value}px`,a.style.animationDuration=r.value/c.speeds+"s";const _=()=>{Number(a.dataset.index)!==u.value.length-1||e.loop||s("play-end",a.dataset.index);const b=Number(a.dataset.index);e.loop&&e.loopOnly&&b>=0&&A.value.delete(b),s("dm-remove",{el:a,index:b,danmu:b>=0?u.value[b]:null}),W(a),l.value&&a.parentNode===l.value&&l.value.removeChild(a)};a._animationEndHandler=_,a.addEventListener("animationend",_)}v.value++}else W(a),l.value&&a.parentNode===l.value&&l.value.removeChild(a)})(o,n)}))}function ae(t){return e.mirror?(function(n){const o=n.offsetWidth||parseInt(n.style.width),a=n.getBoundingClientRect().left||l.value.getBoundingClientRect().left+o;return l.value.getBoundingClientRect().left+a})(t):(function(n){const o=n.offsetWidth||parseInt(n.style.width),a=n.getBoundingClientRect().right||l.value.getBoundingClientRect().right+o;return l.value.getBoundingClientRect().right-a})(t)}function j(){clearInterval(h),h=0,v.value=0,A.value.clear()}function T(){j(),l.value&&(Array.from(l.value.querySelectorAll(".dm")).forEach((t=>{W(t)})),l.value.innerHTML=""),e.performanceMode&&ee(),y.value={},d.value=!0}function $(t){Number(t.dataset.index)!==u.value.length-1||e.loop||s("play-end",t.dataset.index);const n=Number(t.dataset.index);e.loop&&e.loopOnly&&n>=0&&A.value.delete(n),s("dm-remove",{el:t,index:v,danmu:n>=0?u.value[n]:null}),W(t),l.value&&t.parentNode===l.value&&l.value.removeChild(t)}function D(){const t=r.value;q();const n=l.value.getElementsByClassName("dm");for(let o=0;o<n.length;o++){const a=n[o],f=a.offsetWidth;if(e.performanceMode){let C=(t-(a.getBoundingClientRect().left-i.value.getBoundingClientRect().left))/(t+f);if(C=Math.max(0,Math.min(1,C)),U(a),C>=1)$(a);else{const g=r.value-(r.value+f)*C;a.style[p.value]=`${r.value}px`,a.style.transform=`translateX(${g-r.value}px)`,P(a,f,r.value,c.speeds,(()=>d.value),$,E.value)}}else a.style.setProperty("--dm-scroll-width",(r.value+f)*E.value+"px"),a.style[p.value]=`${r.value}px`,a.style.animationDuration=r.value/c.speeds+"s"}}se((()=>{(function(){q(),e.isSuspend&&(l.value.addEventListener("mouseover",Z),l.value.addEventListener("mouseout",Q)),m.danmu||(s("error",{message:'没有提供弹幕插槽内容(slot="danmu")，无法展示弹幕',code:"NO_DANMU_SLOT"}),console.error('[vue-danmaku] 警告：没有提供弹幕插槽内容(slot="danmu")，无法展示弹幕')),e.autoplay&&V()})(),e.autoResize&&(function(){if(typeof ResizeObserver<"u")R=new ResizeObserver((()=>{D()})),R.observe(i.value);else{const t=()=>D();window.addEventListener("resize",t),K((()=>{window.removeEventListener("resize",t)}))}})()})),K((()=>{T(),l.value&&(l.value.removeEventListener("mouseover",Z),l.value.removeEventListener("mouseout",Q)),R&&(R.disconnect(),R=null),e.performanceMode&&ee()}));let X=[];function Z(t){let n=t.target;n.classList.contains("dm")||(n=n.closest(".dm")||n),n.classList.contains("dm")&&(X.includes(n)||(s("dm-over",{el:n}),n.style.zIndex=(e.zIndex+1).toString(),e.performanceMode?U(n):n.classList.add("pause"),X.push(n)))}function Q(t){let n=t.target;n.classList.contains("dm")||(n=n.closest(".dm")||n),n.classList.contains("dm")&&(s("dm-out",{el:n}),Y(n),X.forEach(Y),X=[])}function Y(t){t.style.zIndex=e.zIndex.toString(),e.performanceMode?P(t,t.offsetWidth,r.value,c.speeds,(()=>d.value),$,E.value):t.classList.remove("pause")}function W(t){e.performanceMode?U(t):t._animationEndHandler&&(t.removeEventListener("animationend",t._animationEndHandler),delete t._animationEndHandler),t._clickHandler&&(t.removeEventListener("click",t._clickHandler),delete t._clickHandler);const n=t.dataset.channel?parseInt(t.dataset.channel):-1;if(n>=0&&y.value[n]){const o=y.value[n].indexOf(t);o>-1&&y.value[n].splice(o,1)}if(t.__vueApp){try{t.__vueApp.unmount()}catch(o){console.warn("卸载组件实例失败",o)}delete t.__vueApp}t._vueInstance&&delete t._vueInstance}return{container:i,dmContainer:l,hidden:N,paused:d,danmuList:u,getPlayState:function(){return!d.value},getMaxChannels:function(){return c.height?Math.floor(k.value/(c.height+c.top)):0},resize:D,play:V,pause:function(){d.value=!0,e.performanceMode&&(L.forEach((t=>{cancelAnimationFrame(t)})),L.clear())},stop:T,show:function(){N.value=!1},hide:function(){N.value=!0},clear:j,reset:function(){T(),z.value=0,N.value=!1,q()},addDanmu:function(t,n="current"){if(n==="current"){if(v.value===u.value.length)return u.value.push(t),u.value.length-1;{const o=v.value%u.value.length;return u.value.splice(o,0,t),o+1}}return u.value.push(t),u.value.length-1},insert:F}}});const pe={ref:"container",class:"vue-danmaku"};(function(e,s){s===void 0&&(s={});var m=s.insertAt;if(typeof document<"u"){var w=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",m==="top"&&w.firstChild?w.insertBefore(i,w.firstChild):w.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}})(`.vue-danmaku {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.vue-danmaku .danmus {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.vue-danmaku .danmus.show {
  opacity: 1;
}
.vue-danmaku .danmus.paused .dm.move {
  animation-play-state: paused;
}
.vue-danmaku .danmus .dm {
  position: absolute;
  font-size: 20px;
  color: #666;
  white-space: pre;
  cursor: default;
  transform: translateX(0);
  transform-style: preserve-3d;
}
.vue-danmaku .danmus .dm.move {
  will-change: transform;
  animation-name: moveLeft;
  animation-timing-function: linear;
  animation-play-state: running;
}
.vue-danmaku .danmus .dm.pause {
  animation-play-state: paused;
}
@keyframes moveLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--dm-scroll-width));
  }
}
@-webkit-keyframes moveLeft {
  from {
    -webkit-transform: translateX(0);
  }
  to {
    -webkit-transform: translateX(var(--dm-scroll-width));
  }
}`),te.render=function(e,s,m,w,i,l){return ce(),de("div",pe,[me("div",{ref:"dmContainer",class:fe(["danmus",{show:!e.hidden},{paused:e.paused}])},null,2),ve(e.$slots,"default")],512)},te.__file="src/lib/Danmaku.vue";export{te as k};
