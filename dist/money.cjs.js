var o=Object.defineProperty;var x=e=>o(e,"__esModule",{value:!0});var g=(e,t)=>{x(e);for(var r in t)o(e,r,{get:t[r],enumerable:!0})};g(exports,{default:()=>S});function c(e){e.directive("money",(t,{expression:r,modifiers:l},{evaluateLater:a,effect:i})=>{let{lang:y,currency:f}=t.dataset,n=l.includes("shopify"),m=n?Shopify.locale:y,u=n?Shopify.currency.active:f,d=a(r);i(()=>{d(p=>{let s=p/100,h=new Intl.NumberFormat(m,{style:"currency",currency:u}).format(s);t.innerText=h})})})}var S=c;0&&(module.exports={});