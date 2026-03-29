import{n as e}from"./chunk-BneVvdWh.js";import{a as t,n,r,t as i}from"./book-rating-kIdz8Mgy.js";import{f as a,l as o,n as s,o as c,u as l}from"./sample-books-DpC5IHIE.js";import{a as u,i as d,o as f,t as p}from"./lucide-react-CD4Jtijn.js";import{t as m}from"./jsx-runtime-Bn1Ys6_W.js";import{n as h,t as g}from"./link-zUWfRJ9s.js";import{n as _,t as v}from"./cover-image-BCngBi-N.js";import{n as y,t as b}from"./button-CRgA5SKU.js";import{n as x,t as S}from"./footer-DvsRYPqD.js";import{n as C,t as w}from"./header-tXQH5yut.js";import{i as T,n as E,r as D}from"./genre-utils-ekptsq4T.js";function O({book:e,lastUpdated:t}){let n=r(e.author),a=e.partTitle||e.subtitle?`${e.title} (${e.partTitle||e.subtitle})`:e.title,s={"@context":`https://schema.org`,"@type":`Book`,name:e.title,author:{"@type":`Person`,name:e.author},...e.description&&{description:e.description},...e.imageUrl&&{image:e.imageUrl},...e.publisher&&{publisher:e.publisher},...e.year&&{datePublished:String(e.year)},...e.rating&&{aggregateRating:{"@type":`AggregateRating`,ratingValue:e.rating,ratingCount:e.ratingsCount,bestRating:5}},inLanguage:`cs`};return(0,k.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,k.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(s)}}),(0,k.jsx)(w,{}),(0,k.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,k.jsx)(`article`,{className:`space-y-4 sm:space-y-0`,children:(0,k.jsxs)(`div`,{className:`flex flex-col sm:flex-row items-start gap-4 sm:gap-6`,children:[(0,k.jsx)(v,{src:e.imageUrl,alt:`${e.title} book cover`,className:`w-32 sm:w-40`,width:160,...e.imageWidth&&e.imageHeight?{aspectRatio:e.imageWidth/e.imageHeight}:{}}),(0,k.jsxs)(`div`,{className:`flex-1 space-y-3`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`h2`,{className:`text-2xl font-bold mb-1`,children:a}),(0,k.jsx)(`p`,{className:`text-lg text-muted-foreground`,children:(0,k.jsx)(g,{href:o(l(e.author)),external:!1,children:n})}),e.genre&&(0,k.jsx)(`div`,{className:`text-sm text-muted-foreground mt-1`,children:(0,k.jsx)(`a`,{href:`/${E(e.genreId)}`,className:`text-link hover:underline`,children:D(e.genreId)})}),(e.publisher||e.year)&&(0,k.jsx)(`div`,{className:`text-sm text-muted-foreground mt-1`,children:[e.publisher,e.year].filter(Boolean).join(`, `)})]}),e.rating&&(0,k.jsx)(i,{rating:e.rating,ratingsCount:e.ratingsCount,url:e.url,size:`base`}),(0,k.jsxs)(`div`,{className:`flex gap-2 flex-wrap`,children:[e.epubUrl&&(0,k.jsxs)(b,{href:e.epubUrl,variant:`primary`,rel:`noopener noreferrer`,children:[(0,k.jsx)(f,{className:`mr-1.5 size-3.5`}),`Stáhnout EPUB`]}),e.pdfUrl&&(0,k.jsxs)(b,{href:e.pdfUrl,variant:`secondary`,target:`_blank`,rel:`noopener noreferrer`,children:[(0,k.jsx)(d,{className:`mr-1.5 size-3.5`}),`Zobrazit PDF`]})]}),e.description&&(0,k.jsx)(`p`,{className:`text-base text-card-foreground leading-relaxed`,children:e.description}),(0,k.jsxs)(g,{href:e.detailUrl,className:`inline-flex items-center text-base`,children:[`Zobrazit v Městské knihovně`,(0,k.jsx)(u,{className:`ml-1 size-3`})]})]})]})}),(0,k.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-2xl`,children:`❧`})]}),(0,k.jsx)(S,{lastUpdated:t})]})}var k,A=e((()=>{p(),t(),a(),T(),n(),_(),y(),x(),C(),h(),k=m(),O.__docgenInfo={description:``,methods:[],displayName:`BookDetailPage`,props:{book:{required:!0,tsType:{name:`Book`},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``}}}})),j,M,N,P,F;e((()=>{s(),A(),j={title:`Pages/BookDetailPage`,component:O,parameters:{layout:`fullscreen`},tags:[`autodocs`]},M={args:{book:c}},N={args:{book:{...c,title:`Kronika o Narni`,partTitle:`Lev, čarodějnice a skříň`,author:`C. S. Lewis`}}},P={args:{book:{...c,subtitle:null,partTitle:null,imageUrl:null,description:null,publisher:null,year:null,rating:null,ratingsCount:null,url:null,epubUrl:null,pdfUrl:null}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    book: sampleBook
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    book: {
      ...sampleBook,
      title: "Kronika o Narni",
      partTitle: "Lev, čarodějnice a skříň",
      author: "C. S. Lewis"
    }
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F=[`Default`,`WithPartTitle`,`MinimalBook`]}))();export{M as Default,P as MinimalBook,N as WithPartTitle,F as __namedExportsOrder,j as default};