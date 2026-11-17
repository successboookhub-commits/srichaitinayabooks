import{j as t,t as F}from"./index-OKZtHhKQ.js";import{r as S,k as _}from"./vendor-react-Bj8D5P2d.js";import{af as H,X as W}from"./vendor-icons-CxokpX_I.js";function K(s){const r=[],b=(s.door_no||"").trim(),h=(s.address||"").trim(),l=(s.mandal||"").trim(),p=(s.city||"").trim(),i=(s.district||"").trim();let a=[b?`D.No: ${b}`:"",h].filter(Boolean).join(", ");a&&r.push(a);let g=[l,p&&p!==l?p:"",i].filter(Boolean).join(", ");return g&&r.push(g),r}const j={a4:{id:"a4",name:"A4 Sheet",dims:"210 × 297 mm",desc:"Standard Full Sheet Dispatch Slip",pageSizeCss:"A4 portrait",marginCss:"6mm",widthMm:"194mm",previewMaxWidth:"194mm",isLarge:!0},legal:{id:"legal",name:"Legal Sheet",dims:"216 × 356 mm",desc:'Official Legal Size (8.5" × 14")',pageSizeCss:"legal portrait",marginCss:"6mm",widthMm:"202mm",previewMaxWidth:"202mm",isLarge:!0},a5:{id:"a5",name:"A5 Sheet",dims:"148 × 210 mm",desc:"Half A4 Sheet Dispatch Slip",pageSizeCss:"A5 portrait",marginCss:"5mm",widthMm:"138mm",previewMaxWidth:"138mm",isLarge:!1},"4x6":{id:"4x6",name:'4" × 6" Thermal',dims:"100 × 150 mm",desc:"Standard Courier Thermal Roll",pageSizeCss:"100mm 150mm portrait",marginCss:"2mm",widthMm:"96mm",previewMaxWidth:"96mm",isLarge:!1},"9x14":{id:"9x14",name:"9 × 14 cm Sticker",dims:"90 × 140 mm",desc:"Courier & India Post Sticker",pageSizeCss:"90mm 140mm portrait",marginCss:"2mm",widthMm:"86mm",previewMaxWidth:"86mm",isLarge:!1},compact:{id:"compact",name:'Compact 4.1"',dims:"105 × 148 mm",desc:"Quarter Sheet / 4-per-A4 Label",pageSizeCss:"A4 portrait",marginCss:"5mm",widthMm:"105mm",previewMaxWidth:"105mm",isLarge:!1},a3:{id:"a3",name:"A3 Sheet",dims:"297 × 420 mm",desc:"Large Poster Sheet",pageSizeCss:"A3 portrait",marginCss:"10mm",widthMm:"275mm",previewMaxWidth:"275mm",isLarge:!0}};function U({orders:s,onClose:r}){const[b,h]=S.useState(!1),[l,p]=S.useState("a4");if(S.useEffect(()=>{h(!0);const e=N=>{N.key==="Escape"&&r?.()};return window.addEventListener("keydown",e),()=>{h(!1),window.removeEventListener("keydown",e)}},[r]),!s||s.length===0||!b)return null;const i=j[l]||j.a4,a=i.isLarge,g=()=>{window.print()},L=t.jsxs("div",{id:"shipping-labels-portal-root",children:[t.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @media print {
          @page {
            size: ${i.pageSizeCss};
            margin: ${i.marginCss};
          }

          /* Hide entire main application (#root) and any sibling dialogs */
          #root,
          body > *:not(#shipping-labels-portal-root) {
            display: none !important;
            visibility: hidden !important;
          }

          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #shipping-labels-portal-root {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: transparent !important;
          }

          .print-control-bar {
            display: none !important;
          }

          .print-modal-backdrop {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: transparent !important;
            backdrop-filter: none !important;
          }

          .print-modal-card {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            border-radius: 0 !important;
          }

          #shipping-labels-printable-root {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          .shipping-label-sticker {
            display: block !important;
            position: relative !important;
            width: ${i.widthMm} !important;
            max-width: ${i.widthMm} !important;
            box-sizing: border-box !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            border: 2.5px solid #000000 !important;
            page-break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .shipping-label-sticker:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}}),t.jsx("div",{className:"print-modal-backdrop fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto",onClick:e=>{e.target===e.currentTarget&&r?.()},children:t.jsxs("div",{className:"print-modal-card bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl my-auto",children:[t.jsxs("div",{className:"print-control-bar pb-3.5 mb-4 border-b border-slate-200 space-y-3",children:[t.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[t.jsxs("div",{className:"space-y-0.5",children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("span",{className:"font-black text-slate-900 text-sm sm:text-base",children:"Shipping Label & Dispatch Print"}),t.jsxs("span",{className:"text-[11px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-md border border-red-200",children:[i.name," (",i.dims,")"]})]}),t.jsxs("p",{className:"text-[11px] text-slate-500 font-medium",children:[s.length," ",s.length===1?"Order":"Orders"," • Page 1: Shipping Label (TO/FROM) • Page 2+: Order Items Manifest (Only Books)"]})]}),t.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[t.jsxs("div",{className:"flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200",children:[t.jsx("label",{htmlFor:"paper-size-select",className:"text-[10px] font-bold text-slate-600 px-1 uppercase",children:"Paper:"}),t.jsx("select",{id:"paper-size-select",value:l,onChange:e=>p(e.target.value),className:"bg-white text-xs font-bold text-slate-800 py-1.5 px-3 rounded-lg border border-slate-300 shadow-2xs cursor-pointer focus:ring-2 focus:ring-red-500 focus:outline-none",children:Object.values(j).map(e=>t.jsxs("option",{value:e.id,children:[e.name," (",e.dims,") - ",e.desc]},e.id))})]}),t.jsxs("button",{type:"button",onClick:g,className:"inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer",children:[t.jsx(H,{className:"w-4 h-4 text-white"}),t.jsx("span",{children:"Print Label"})]}),t.jsx("button",{type:"button",onClick:r,className:"p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors",title:"Close Preview (Esc)",children:t.jsx(W,{className:"w-5 h-5"})})]})]}),t.jsxs("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin",children:[t.jsx("span",{className:"text-slate-500 text-[10px] uppercase font-bold shrink-0 mr-1",children:"Quick Select:"}),Object.values(j).map(e=>t.jsx("button",{type:"button",onClick:()=>p(e.id),className:`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shrink-0 ${l===e.id?"bg-red-600 text-white border-red-600 shadow-sm scale-102":"bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-black"}`,children:e.name},e.id))]})]}),t.jsx("div",{id:"shipping-labels-printable-root",className:"space-y-6 block w-full",children:s.map((e,N)=>{const d=e.items&&e.items.length>0?e.items:[],I=K(e),w=d.length,m=[];if(d.length<=5)m.push({isFirstPage:!0,items:d,startBookNo:1});else{m.push({isFirstPage:!0,items:d.slice(0,5),startBookNo:1});const c=d.slice(5),f=10;for(let n=0;n<c.length;n+=f)m.push({isFirstPage:!1,items:c.slice(n,n+f),startBookNo:6+n})}const v=m.length,$=e.order_code||`ORD${e.id}`;let x=e.status||"Paid";(x.toLowerCase()==="delivered"||x.toLowerCase()==="processing")&&(x="Paid");const P=e.customer_name||e.customer?.name||"Customer",T=e.customer_phone||e.customer?.phone||"-",A=e.state||e.customer?.state||"Telangana / Andhra Pradesh",M=e.pincode||e.customer?.pincode||"";return m.map((c,f)=>{const n=f+1,u=c.isFirstPage,y=c.items,C=c.startBookNo,E=C+y.length-1;return t.jsxs("div",{className:"shipping-label-sticker bg-white text-black border-[2.5px] border-black flex flex-col justify-start shadow-md print:shadow-none box-border select-none my-3 mx-auto",style:{width:"100%",maxWidth:i.previewMaxWidth,boxSizing:"border-box",fontFamily:"Arial, Helvetica, sans-serif"},children:[t.jsxs("div",{className:`border-b-[2px] border-black bg-white text-center ${a?"py-3 px-4":"py-2 px-3"}`,children:[t.jsx("h1",{className:`${a?"text-[20px] sm:text-[22px]":"text-[16px]"} font-black uppercase tracking-wide text-black m-0 leading-tight`,children:"SRI CHAITANYA BOOK CENTRE"}),t.jsxs("div",{className:`${a?"text-[16px] sm:text-[17px]":"text-[14.5px]"} font-extrabold uppercase tracking-widest text-black mt-0.5`,children:[u?"SHIPPING LABEL":"ORDER ITEMS MANIFEST (CONTINUED)",v>1&&t.jsxs("span",{className:"text-[12px] font-bold text-slate-800 ml-1.5 tracking-normal",children:["(Page ",n," of ",v,")"]})]})]}),u?t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:`border-b-[1.5px] border-black bg-white ${a?"p-4":"p-3"}`,children:[t.jsx("div",{className:`${a?"text-[13px]":"text-[11.5px]"} font-black uppercase text-slate-700 tracking-wider mb-1`,children:"TO:"}),t.jsx("div",{className:`${a?"text-[20px] sm:text-[22px]":"text-[16.5px]"} font-black uppercase text-black leading-snug mb-1`,children:P}),t.jsxs("div",{className:`${a?"text-[17px]":"text-[15px]"} font-black text-black mb-1.5 flex items-center gap-1.5`,children:[t.jsx("span",{children:"📞"}),t.jsx("span",{className:"font-mono tracking-wide",children:T})]}),t.jsxs("div",{className:`${a?"text-[15px] space-y-0.5":"text-[13px] space-y-0.5"} font-semibold text-black leading-snug capitalize`,children:[I.map((o,k)=>t.jsx("p",{className:"m-0",children:o},k)),t.jsxs("p",{className:"m-0 font-bold",children:[A,M?` - ${M}`:""]})]})]}),t.jsxs("div",{className:`border-b-[1.5px] border-black bg-white leading-snug ${a?"p-4 text-[14px]":"p-3 text-[12.5px]"}`,children:[t.jsx("div",{className:`${a?"text-[13px]":"text-[11.5px]"} font-black uppercase text-slate-700 tracking-wider mb-1`,children:"FROM:"}),t.jsx("div",{className:`font-black ${a?"text-[16.5px]":"text-[14.5px]"} uppercase text-black mb-0.5`,children:"SRI CHAITANYA BOOK CENTRE"}),t.jsxs("div",{className:`text-black ${a?"text-[14px] leading-normal":"text-[12.5px] leading-snug"} font-medium`,children:["Konark Theatre Ln, opposite ICICI ATM,",t.jsx("br",{}),"Gaddiannaram, Madhura Puri Colony,",t.jsx("br",{}),"Dilsukhnagar, Hyderabad,",t.jsx("br",{}),"Telangana - 500060"]}),t.jsxs("div",{className:`text-black ${a?"text-[15.5px]":"text-[13.5px]"} font-black mt-1.5 flex items-center gap-1.5`,children:[t.jsx("span",{children:"📞"}),t.jsx("span",{className:"font-mono font-black",children:"09177110134"})]})]}),t.jsxs("div",{className:`border-b-[1.5px] border-black bg-white flex items-center justify-between ${a?"p-3 text-[15px]":"p-2.5 text-[13px]"}`,children:[t.jsxs("div",{children:[t.jsx("span",{className:"font-bold text-slate-700",children:"Order ID: "}),t.jsx("span",{className:`font-mono font-black ${a?"text-[17px]":"text-[15px]"} text-black tracking-wide`,children:$})]}),t.jsxs("div",{children:[t.jsx("span",{className:"font-bold text-slate-700",children:"Payment: "}),t.jsx("span",{className:`font-black ${a?"text-[16px]":"text-[14px]"} uppercase text-black`,children:x})]})]})]}):t.jsxs("div",{className:`border-b-[1.5px] border-black bg-slate-50 flex flex-wrap items-center justify-between gap-2 ${a?"p-3.5 text-[15px]":"p-3 text-[13px]"}`,children:[t.jsxs("div",{children:[t.jsx("span",{className:"font-bold text-slate-600",children:"Order ID: "}),t.jsx("span",{className:"font-mono font-black text-black",children:$})]}),t.jsxs("div",{children:[t.jsx("span",{className:"font-bold text-slate-600",children:"Customer: "}),t.jsx("span",{className:"font-black text-black uppercase",children:P})]}),t.jsxs("div",{children:[t.jsx("span",{className:"font-bold text-slate-600",children:"Payment: "}),t.jsx("span",{className:"font-black text-black uppercase",children:x})]})]}),t.jsxs("div",{className:`bg-white border-b-[1.5px] border-black flex-1 ${a?"p-4":"p-3"}`,children:[t.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[t.jsx("span",{className:`${a?"text-[13px]":"text-[11.5px]"} font-black uppercase text-slate-800 tracking-wider`,children:u?"ITEM DETAILS:":"REMAINING ITEMS LIST:"}),w>0&&t.jsxs("span",{className:`${a?"text-[12px]":"text-[10.5px]"} font-bold text-slate-600`,children:["(Books ",C," to ",E," of ",w,")"]})]}),t.jsxs("table",{className:"w-full border-collapse",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{className:`text-left border-b-[1.5px] border-black py-1 px-1 ${a?"text-[13px]":"text-[11.5px]"} font-black uppercase text-black`,children:"PRODUCT"}),t.jsx("th",{className:`text-center border-b-[1.5px] border-black py-1 px-1 ${a?"text-[13px]":"text-[11.5px]"} font-black uppercase text-black w-[16%]`,children:"QTY"})]})}),t.jsx("tbody",{children:y.length>0?y.map((o,k)=>{const O=C+k,z=o.product_name||o.book_title||o.name||"Competitive Book",B=String(z).replace(/\.{2,}$/,"").trim(),R=F(B),D=parseInt(o.qty||o.quantity||1,10);return t.jsxs("tr",{className:"border-b border-dashed border-slate-300 last:border-b-0",children:[t.jsxs("td",{className:`py-1.5 px-1 ${a?"text-[13.5px]":"text-[12px]"} font-semibold text-black leading-snug`,children:[t.jsxs("span",{className:"font-bold mr-1",children:[O,"."]}),R]}),t.jsx("td",{className:`py-1.5 px-1 text-center font-mono font-black ${a?"text-[15px]":"text-[13px]"} text-black`,children:D})]},k)}):t.jsxs("tr",{children:[t.jsxs("td",{className:`py-1.5 px-1 ${a?"text-[14px]":"text-[12.5px]"} font-semibold text-black leading-snug`,children:[t.jsx("span",{className:"font-bold mr-1",children:"1."}),"Sri Chaitanya Examination Study Material"]}),t.jsx("td",{className:`py-1.5 px-1 text-center font-mono font-black ${a?"text-[16px]":"text-[13.5px]"} text-black`,children:"1"})]})})]}),u&&v>1&&t.jsx("div",{className:"mt-2 text-right",children:t.jsxs("span",{className:"text-[11px] font-extrabold text-slate-700 italic",children:["☞ (Remaining ",w-5," Books Continued on Page 2)"]})})]}),t.jsx("div",{className:`py-2 px-3 text-center ${a?"text-[14px]":"text-[12.5px]"} font-bold text-black bg-white`,children:"Thank you for your order 📦"})]},`${e.id||N}-page-${n}`)})})})]})})]});return _.createPortal(L,document.body)}export{U as A};
