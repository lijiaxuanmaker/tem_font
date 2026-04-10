import{g as $,E as P,f as X,s as Y,r as b,h as D,i as d,a as k,j as s,V as g,C as J,H as K,T as Q,k as C,l as N,m as O,n as _,o as Z,p as nn,q as tn,v as en,w as an,x as rn,R,y as H,z as h,A as j}from"./vendors.84714853.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();var on=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* H5 导航栏页面自动添加顶部间距 */
body.h5-navbar-visible .taro_page {
  padding-top: 44px;
}

body.h5-navbar-visible .toaster[data-position^="top"] {
  top: 44px !important;
}

/* Sheet 组件在 H5 导航栏下的位置修正 */
body.h5-navbar-visible .sheet-content:not([data-side="bottom"]) {
    top: 44px !important;
}

/*
 * H5 端 rem 适配：与小程序 rpx 缩放一致
 * 375px 屏幕：1rem = 16px，小程序 32rpx = 16px
 */
html {
    font-size: 4vw !important;
}

/* H5 端组件默认样式修复 */
taro-view-core {
    display: block;
}

taro-text-core {
    display: inline;
}

taro-input-core {
    display: block;
    width: 100%;
}

taro-input-core input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
}

taro-input-core.taro-otp-hidden-input input {
    color: transparent;
    caret-color: transparent;
    -webkit-text-fill-color: transparent;
}

/* 全局按钮样式重置 */
taro-button-core,
button {
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

taro-button-core::after,
button::after {
    border: none;
}

taro-textarea-core > textarea,
.taro-textarea,
textarea.taro-textarea {
    resize: none !important;
}
`,un=`
/* PC 宽屏适配 - 基础布局 */
@media (min-width: 769px) {
  html {
    font-size: 15px !important;
  }

  body {
    background-color: #f3f4f6 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
  }
}
`,sn=`
/* PC 宽屏适配 - 手机框样式（有 TabBar 页面） */
@media (min-width: 769px) {
  .taro-tabbar__container {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    transform: translateX(0) !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .taro-tabbar__panel {
    height: 100% !important;
    overflow: auto !important;
  }
}

/* PC 宽屏适配 - Toast 定位到手机框范围内 */
@media (min-width: 769px) {
  body .toaster {
    left: 50% !important;
    right: auto !important;
    width: 375px !important;
    max-width: 375px !important;
    transform: translateX(-50%) !important;
    box-sizing: border-box !important;
  }
}

/* PC 宽屏适配 - 手机框样式（无 TabBar 页面，通过 JS 添加 no-tabbar 类） */
@media (min-width: 769px) {
  body.no-tabbar #app {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
    transform: translateX(0) !important;
  }

  body.no-tabbar #app .taro_router {
    height: 100% !important;
    overflow: auto !important;
  }
}
`;function ln(){var o=document.createElement("style");o.innerHTML=on+un+sn,document.head.appendChild(o)}function cn(){var o=function(){var e=!!document.querySelector(".taro-tabbar__container");document.body.classList.toggle("no-tabbar",!e)};o();var n=new MutationObserver(o);n.observe(document.body,{childList:!0,subtree:!0})}function dn(){ln(),cn()}function pn(){var o=$();if(o===P.WEAPP||o===P.TT)try{var n=X(),t=n.miniProgram.envVersion;console.log("[Debug] envVersion:",t),t!=="release"&&Y({enableDebug:!0})}catch(e){console.error("[Debug] 开启调试模式失败:",e)}}var fn={visible:!1,title:"",bgColor:"#ffffff",textStyle:"black",navStyle:"default",transparent:"none",leftIcon:"none"},bn=function(){var n,t=C();return(t==null||(n=t.config)===null||n===void 0?void 0:n.window)||{}},vn=function(){var n,t,e=(n=C())===null||n===void 0||(n=n.config)===null||n===void 0?void 0:n.tabBar;return new Set((e==null||(t=e.list)===null||t===void 0?void 0:t.map(function(a){return a.pagePath}))||[])},L=function(){var n,t=C();return(t==null||(n=t.config)===null||n===void 0||(n=n.pages)===null||n===void 0?void 0:n[0])||"pages/index/index"},x=function(n){return n.replace(/^\//,"")},mn=function(n,t,e,a){if(!n)return"none";var r=x(n),i=x(a),F=r===i,w=t.has(r)||t.has("/".concat(r)),c=e>1;return w||F?"none":c?"back":"home"},gn=function(){var n=b.useState(fn),t=D(n,2),e=t[0],a=t[1],r=b.useState(0),i=D(r,2),F=i[0],w=i[1],c=b.useCallback(function(){var u=d.getCurrentPages();if(u.length===0){a(function(U){return k(k({},U),{},{visible:!1})});return}var l=u[u.length-1],T=(l==null?void 0:l.route)||"";if(T){var p=(l==null?void 0:l.config)||{},f=bn(),v=vn(),W=L(),m=x(T),S=x(W),q=m===S,G=v.has(m)||v.has("/".concat(m)),A=v.size<=1&&u.length<=1&&(q||G);a({visible:!A,title:document.title||p.navigationBarTitleText||f.navigationBarTitleText||"",bgColor:p.navigationBarBackgroundColor||f.navigationBarBackgroundColor||"#ffffff",textStyle:p.navigationBarTextStyle||f.navigationBarTextStyle||"black",navStyle:p.navigationStyle||f.navigationStyle||"default",transparent:p.transparentTitle||f.transparentTitle||"none",leftIcon:A?"none":mn(m,v,u.length,S)})}},[]);d.useDidShow(function(){c()}),d.usePageScroll(function(u){var l=u.scrollTop;e.transparent==="auto"&&w(Math.min(l/100,1))}),b.useEffect(function(){var u=null,l=new MutationObserver(function(){u&&clearTimeout(u),u=setTimeout(function(){c()},50)});return l.observe(document.head,{subtree:!0,childList:!0,characterData:!0}),c(),function(){l.disconnect(),u&&clearTimeout(u)}},[c]);var E=e.visible&&e.navStyle!=="custom";if(b.useEffect(function(){E?document.body.classList.add("h5-navbar-visible"):document.body.classList.remove("h5-navbar-visible")},[E]),!E)return s.jsx(s.Fragment,{});var B=e.textStyle==="white"?"#fff":"#333",I=e.textStyle==="white"?"text-white":"text-gray-800",M=function(){return e.transparent==="always"?{backgroundColor:"transparent"}:e.transparent==="auto"?{backgroundColor:e.bgColor,opacity:F}:{backgroundColor:e.bgColor}},z=function(){return d.navigateBack()},V=function(){var l=L();d.reLaunch({url:"/".concat(l)})};return s.jsxs(s.Fragment,{children:[s.jsxs(g,{className:"fixed top-0 left-0 right-0 h-11 flex items-center justify-center z-1000",style:M(),children:[e.leftIcon==="back"&&s.jsx(g,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:z,children:s.jsx(J,{size:24,color:B})}),e.leftIcon==="home"&&s.jsx(g,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:V,children:s.jsx(K,{size:22,color:B})}),s.jsx(Q,{className:"text-base font-medium max-w-3/5 truncate ".concat(I),children:e.title})]}),s.jsx(g,{className:"h-11 shrink-0"})]})},hn=function(n){var t=n.children;return s.jsxs(s.Fragment,{children:[s.jsx(gn,{}),t]})},xn=function(n){var t=n.children;return d.useLaunch(function(){pn(),dn()}),s.jsx(hn,{children:t})},yn=function(n){var t=n.children;return s.jsx(xn,{children:t})},y=N.__taroAppConfig={router:{mode:"hash"},pages:["pages/index/index","pages/question/index"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#2563eb",navigationBarTitleText:"临床TDM训练",navigationBarTextStyle:"white"}};y.routes=[Object.assign({path:"pages/index/index",load:function(){var o=H(h().m(function t(e,a){var r;return h().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,j(()=>import("./index.88d09070.js"),["./index.88d09070.js","./vendors.84714853.js","../css/vendors.8886af03.css","./common.39f1e691.js","../css/index.e3b0c442.css"],import.meta.url);case 1:return r=i.v,i.a(2,[r,e,a])}},t)}));function n(t,e){return o.apply(this,arguments)}return n}()},{navigationBarTitleText:"临床TDM训练工具",navigationBarBackgroundColor:"#2563eb",navigationBarTextStyle:"white"}),Object.assign({path:"pages/question/index",load:function(){var o=H(h().m(function t(e,a){var r;return h().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,j(()=>import("./index.6d32d5a7.js"),["./index.6d32d5a7.js","./vendors.84714853.js","../css/vendors.8886af03.css","./common.39f1e691.js"],import.meta.url);case 1:return r=i.v,i.a(2,[r,e,a])}},t)}));function n(t,e){return o.apply(this,arguments)}return n}()},{navigationBarTitleText:"",navigationBarBackgroundColor:"#f9fafb",navigationBarTextStyle:"black"})];Object.assign(O,{findDOMNode:_.findDOMNode,render:_.render,unstable_batchedUpdates:_.unstable_batchedUpdates});Z();var Fn=nn(yn,R,O,y),wn=tn({window:N});en(y);an(wn,Fn,y,R);rn({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
