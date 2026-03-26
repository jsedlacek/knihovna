import{n as e}from"./chunk-BneVvdWh.js";import{n as t,r as n}from"./sample-books-CVF7YPG6.js";import{a as r,i,o as a,t as o}from"./lucide-react-DznYavxK.js";import{a as s,n as c,r as l,t as u}from"./book-rating-AcD7syV5.js";import{t as d}from"./jsx-runtime-D16BNjX-.js";import{n as f,t as p}from"./link-BT8-97QV.js";import{n as m,t as h}from"./cover-image-Bw_CYDtZ.js";import{n as g,t as _}from"./button-DEopb3Iv.js";import{i as v,n as y,r as b}from"./genre-utils-QkiS5n_6.js";import{n as x,t as S}from"./footer-BfoAcJx1.js";import{n as C,t as w}from"./header-DQLe--zG.js";function T({book:e,lastUpdated:t}){let n=l(e.author),o=e.partTitle||e.subtitle?`${e.title} (${e.partTitle||e.subtitle})`:e.title,s={"@context":`https://schema.org`,"@type":`Book`,name:e.title,author:{"@type":`Person`,name:e.author},...e.description&&{description:e.description},...e.imageUrl&&{image:e.imageUrl},...e.publisher&&{publisher:e.publisher},...e.year&&{datePublished:String(e.year)},...e.rating&&{aggregateRating:{"@type":`AggregateRating`,ratingValue:e.rating,ratingCount:e.ratingsCount,bestRating:5}},inLanguage:`cs`};return(0,E.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,E.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(s)}}),(0,E.jsx)(w,{}),(0,E.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,E.jsx)(`article`,{className:`space-y-4 sm:space-y-0`,children:(0,E.jsxs)(`div`,{className:`flex flex-col sm:flex-row items-start gap-4 sm:gap-6`,children:[(0,E.jsx)(h,{src:e.imageUrl,alt:`${e.title} book cover`,className:`w-32 sm:w-40`,width:160,...e.imageWidth&&e.imageHeight?{aspectRatio:e.imageWidth/e.imageHeight}:{}}),(0,E.jsxs)(`div`,{className:`flex-1 space-y-3`,children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`h2`,{className:`text-2xl font-bold mb-1`,children:o}),(0,E.jsx)(`p`,{className:`text-lg text-muted-foreground`,children:n}),e.genre&&(0,E.jsx)(`div`,{className:`text-sm text-muted-foreground mt-1`,children:(0,E.jsx)(`a`,{href:`/${y(e.genreId)}`,className:`text-link hover:underline`,children:b(e.genreId)})}),(e.publisher||e.year)&&(0,E.jsx)(`div`,{className:`text-sm text-muted-foreground mt-1`,children:[e.publisher,e.year].filter(Boolean).join(`, `)})]}),e.rating&&(0,E.jsx)(u,{rating:e.rating,ratingsCount:e.ratingsCount,url:e.url,size:`base`}),(0,E.jsxs)(`div`,{className:`flex gap-2 flex-wrap`,children:[e.epubUrl&&(0,E.jsxs)(_,{href:e.epubUrl,variant:`primary`,rel:`noopener noreferrer`,children:[(0,E.jsx)(a,{className:`mr-1.5 size-3.5`}),`Stáhnout EPUB`]}),e.pdfUrl&&(0,E.jsxs)(_,{href:e.pdfUrl,variant:`secondary`,target:`_blank`,rel:`noopener noreferrer`,children:[(0,E.jsx)(i,{className:`mr-1.5 size-3.5`}),`Zobrazit PDF`]})]}),e.description&&(0,E.jsx)(`p`,{className:`text-base text-card-foreground leading-relaxed`,children:e.description}),(0,E.jsxs)(p,{href:e.detailUrl,className:`inline-flex items-center text-base`,children:[`Zobrazit v Městské knihovně`,(0,E.jsx)(r,{className:`ml-1 size-3`})]})]})]})}),(0,E.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-2xl`,children:`❧`})]}),(0,E.jsx)(S,{lastUpdated:t})]})}var E,D=e((()=>{o(),s(),v(),c(),m(),g(),x(),C(),f(),E=d(),T.__docgenInfo={description:``,methods:[],displayName:`BookDetailPage`,props:{book:{required:!0,tsType:{name:`Book`},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``}}}})),O,k,A,j,M;e((()=>{t(),D(),O={title:`Pages/BookDetailPage`,component:T,parameters:{layout:`fullscreen`},tags:[`autodocs`]},k={args:{book:n}},A={args:{book:{...n,title:`Kronika o Narni`,partTitle:`Lev, čarodějnice a skříň`,author:`C. S. Lewis`}}},j={args:{book:{...n,subtitle:null,partTitle:null,imageUrl:null,description:null,publisher:null,year:null,rating:null,ratingsCount:null,url:null,epubUrl:null,pdfUrl:null}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    book: sampleBook
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    book: {
      ...sampleBook,
      title: "Kronika o Narni",
      partTitle: "Lev, čarodějnice a skříň",
      author: "C. S. Lewis"
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M=[`Default`,`WithPartTitle`,`MinimalBook`]}))();export{k as Default,j as MinimalBook,A as WithPartTitle,M as __namedExportsOrder,O as default};