import{n as e}from"./chunk-BneVvdWh.js";import{i as t,n}from"./sample-books-CVF7YPG6.js";import{a as r,i}from"./book-rating-Bic3usNy.js";import{t as a}from"./jsx-runtime-BhvhbwwV.js";import{n as o,t as s}from"./book-card-D5akbuIn.js";import{n as c,t as l}from"./footer-DpEF7PQA.js";import{n as u,t as d}from"./header--r90RJeO.js";var f=e((()=>{}));function p({query:e,books:t,lastUpdated:n}){let r=e.length>0&&e.length<2;return(0,m.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,m.jsx)(d,{searchQuery:e,breadcrumbs:[{label:`Hledání`}]}),(0,m.jsx)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:(0,m.jsxs)(`section`,{className:`space-y-4`,children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h2`,{className:`text-2xl font-bold`,children:`Výsledky hledání`}),(0,m.jsx)(`p`,{className:`text-base text-muted-foreground mt-1`,children:r?`Zadejte alespoň 2 znaky pro vyhledávání.`:e.length===0?`Zadejte hledaný výraz do pole výše.`:t.length===0?`Pro „${e}" nebyly nalezeny žádné knihy.`:`Nalezeno ${i(t.length)} ${t.length===1?`kniha`:t.length<5?`knihy`:`knih`} pro „${e}"`})]}),(0,m.jsx)(`div`,{className:`space-y-12`,children:t.map((e,t)=>(0,m.jsx)(`div`,{children:(0,m.jsx)(s,{book:e,index:t})},e.titulKey))}),t.length>0&&(0,m.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-2xl`,children:`❧`})]})}),(0,m.jsx)(l,{lastUpdated:n})]})}var m,h=e((()=>{o(),c(),u(),f(),r(),m=a(),p.__docgenInfo={description:``,methods:[],displayName:`SearchPage`,props:{query:{required:!0,tsType:{name:`string`},description:``},books:{required:!0,tsType:{name:`Array`,elements:[{name:`Book`}],raw:`Book[]`},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``}}}})),g,_,v,y,b,x;e((()=>{h(),n(),g={title:`Pages/SearchPage`,component:p,parameters:{layout:`fullscreen`},tags:[`autodocs`]},_={args:{query:`Čapek`,books:t.slice(0,3)}},v={args:{query:`neexistující kniha`,books:[]}},y={args:{query:`a`,books:[]}},b={args:{query:``,books:[]}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    query: "Čapek",
    books: sampleBooks.slice(0, 3)
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    query: "neexistující kniha",
    books: []
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    query: "a",
    books: []
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    query: "",
    books: []
  }
}`,...b.parameters?.docs?.source}}},x=[`WithResults`,`NoResults`,`ShortQuery`,`EmptyQuery`]}))();export{b as EmptyQuery,v as NoResults,y as ShortQuery,_ as WithResults,x as __namedExportsOrder,g as default};