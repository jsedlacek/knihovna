import{n as e}from"./chunk-BneVvdWh.js";import{n as t,r as n}from"./sample-books-CVF7YPG6.js";import{a as r,i,o as a,t as o}from"./lucide-react-Bl0My9fc.js";import{a as s,n as c,r as l,t as u}from"./book-rating-DzMEnBTv.js";import{t as d}from"./jsx-runtime-BhvhbwwV.js";import{n as f,t as p}from"./link-CtID5PDm.js";import{n as m,t as h}from"./cover-image-B_-a0b3-.js";import{n as g,t as _}from"./button-BZP2U1ek.js";import{i as v,n as y,r as b,t as x}from"./genre-utils-DjyBK-1z.js";import{n as S,t as C}from"./footer-DpEF7PQA.js";import{n as w,t as T}from"./header-9TAP3i5J.js";function E({book:e,lastUpdated:t}){let n=l(e.author),o=e.partTitle||e.subtitle?`${e.title} (${e.partTitle||e.subtitle})`:e.title,s={"@context":`https://schema.org`,"@type":`Book`,name:e.title,author:{"@type":`Person`,name:e.author},...e.description&&{description:e.description},...e.imageUrl&&{image:e.imageUrl},...e.publisher&&{publisher:e.publisher},...e.year&&{datePublished:String(e.year)},...e.rating&&{aggregateRating:{"@type":`AggregateRating`,ratingValue:e.rating,ratingCount:e.ratingsCount,bestRating:5}},inLanguage:`cs`};return(0,D.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,D.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(s)}}),(0,D.jsx)(T,{breadcrumbs:[{label:x[y(e.genreId)].name,href:`/${y(e.genreId)}`},{label:e.title}]}),(0,D.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,D.jsxs)(`article`,{className:`space-y-4 sm:space-y-0`,children:[(0,D.jsxs)(`div`,{className:`flex flex-col sm:flex-row items-start gap-4 sm:gap-6`,children:[(0,D.jsx)(h,{src:e.imageUrl,alt:`${e.title} book cover`,className:`w-32 sm:w-40`,width:160,...e.imageWidth&&e.imageHeight?{aspectRatio:e.imageWidth/e.imageHeight}:{}}),(0,D.jsxs)(`div`,{className:`flex-1 space-y-3`,children:[(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h2`,{className:`text-2xl font-bold mb-1`,children:o}),(0,D.jsx)(`p`,{className:`text-lg text-muted-foreground`,children:n}),e.genre&&(0,D.jsx)(`div`,{className:`text-sm text-muted-foreground mt-1`,children:b(e.genreId)}),(e.publisher||e.year)&&(0,D.jsx)(`div`,{className:`text-sm text-muted-foreground mt-1`,children:[e.publisher,e.year].filter(Boolean).join(`, `)})]}),e.rating&&(0,D.jsx)(u,{rating:e.rating,ratingsCount:e.ratingsCount,url:e.url,size:`base`}),(0,D.jsxs)(`div`,{className:`hidden sm:block space-y-3`,children:[e.description&&(0,D.jsx)(`p`,{className:`text-base text-card-foreground leading-relaxed`,children:e.description}),(0,D.jsxs)(p,{href:e.detailUrl,className:`inline-flex items-center text-base`,children:[`Zobrazit v Městské knihovně`,(0,D.jsx)(r,{className:`ml-1 size-3`})]}),(0,D.jsxs)(`div`,{className:`flex gap-2 flex-wrap pt-2`,children:[e.epubUrl&&(0,D.jsxs)(_,{href:e.epubUrl,variant:`primary`,rel:`noopener noreferrer`,children:[(0,D.jsx)(a,{className:`mr-1.5 size-3.5`}),`Stáhnout EPUB`]}),e.pdfUrl&&(0,D.jsxs)(_,{href:e.pdfUrl,variant:`secondary`,target:`_blank`,rel:`noopener noreferrer`,children:[(0,D.jsx)(i,{className:`mr-1.5 size-3.5`}),`Zobrazit PDF`]})]})]})]})]}),(0,D.jsxs)(`div`,{className:`sm:hidden space-y-3`,children:[e.description&&(0,D.jsx)(`p`,{className:`text-base text-card-foreground leading-relaxed`,children:e.description}),(0,D.jsxs)(p,{href:e.detailUrl,className:`inline-flex items-center text-base`,children:[`Zobrazit v Městské knihovně`,(0,D.jsx)(r,{className:`ml-1 size-3`})]}),(0,D.jsxs)(`div`,{className:`flex gap-2 flex-wrap pt-2`,children:[e.epubUrl&&(0,D.jsxs)(_,{href:e.epubUrl,variant:`primary`,rel:`noopener noreferrer`,children:[(0,D.jsx)(a,{className:`mr-1.5 size-3.5`}),`Stáhnout EPUB`]}),e.pdfUrl&&(0,D.jsxs)(_,{href:e.pdfUrl,variant:`secondary`,target:`_blank`,rel:`noopener noreferrer`,children:[(0,D.jsx)(i,{className:`mr-1.5 size-3.5`}),`Zobrazit PDF`]})]})]})]}),(0,D.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-2xl`,children:`❧`})]}),(0,D.jsx)(C,{lastUpdated:t})]})}var D,O=e((()=>{o(),s(),v(),c(),m(),g(),S(),w(),f(),D=d(),E.__docgenInfo={description:``,methods:[],displayName:`BookDetailPage`,props:{book:{required:!0,tsType:{name:`Book`},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``}}}})),k,A,j,M,N;e((()=>{t(),O(),k={title:`Pages/BookDetailPage`,component:E,parameters:{layout:`fullscreen`},tags:[`autodocs`]},A={args:{book:n}},j={args:{book:{...n,title:`Kronika o Narni`,partTitle:`Lev, čarodějnice a skříň`,author:`C. S. Lewis`}}},M={args:{book:{...n,subtitle:null,partTitle:null,imageUrl:null,description:null,publisher:null,year:null,rating:null,ratingsCount:null,url:null,epubUrl:null,pdfUrl:null}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    book: sampleBook
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    book: {
      ...sampleBook,
      title: "Kronika o Narni",
      partTitle: "Lev, čarodějnice a skříň",
      author: "C. S. Lewis"
    }
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    book: {
      ...sampleBook,
      subtitle: null,
      partTitle: null,
      imageUrl: null,
      description: null,
      publisher: null,
      year: null,
      rating: null,
      ratingsCount: null,
      url: null,
      epubUrl: null,
      pdfUrl: null
    }
  }
}`,...M.parameters?.docs?.source}}},N=[`Default`,`WithPartTitle`,`MinimalBook`]}))();export{A as Default,M as MinimalBook,j as WithPartTitle,N as __namedExportsOrder,k as default};