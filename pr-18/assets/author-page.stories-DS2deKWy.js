import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./iframe-pcgq_ePl.js";import{a as r,i,r as a}from"./book-rating-jzEDKXXO.js";import{a as o,c as s,i as c,n as l,r as u,s as d}from"./sample-books-6Ma8iAz4.js";import{t as f}from"./jsx-runtime-Bn1Ys6_W.js";import{n as p,t as m}from"./book-grid-BH0fHuko.js";import{n as h,r as g}from"./button-C89ATuxh.js";import{n as _,t as v}from"./footer-DvsRYPqD.js";import{n as y,t as b}from"./header-tL_tI2cu.js";import{n as x,r as S,t as C}from"./noscript-pagination-BJ1hf1xm.js";function w({author:e,initialBooks:t,totalCount:n,initialNextCursor:r,lastUpdated:o,currentPage:s=1,totalPages:c=1,onLoadMore:l}){let[u,d]=(0,T.useState)(t),[f,p]=(0,T.useState)(r),[g,_]=(0,T.useState)(!1),[y,S]=(0,T.useState)(s),w=a(e.name),D=(0,T.useCallback)(async()=>{if(!(f===null||g||!l)){_(!0);try{let t=await l(e.slug,f);d(e=>[...e,...t.books]),p(t.nextCursor),S(e=>e+1)}finally{_(!1)}}},[f,g,e.slug,l]),O={"@context":`https://schema.org`,"@type":`Person`,name:w,...e.description&&{description:e.description},...e.imageUrl&&{image:e.imageUrl},url:`https://knihovna.jakub.contact/autor/${e.slug}`};return(0,E.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,E.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(O)}}),(0,E.jsx)(b,{}),(0,E.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,E.jsxs)(`section`,{className:`space-y-4`,children:[(0,E.jsxs)(`div`,{className:`flex items-start gap-4 sm:gap-6`,children:[e.imageUrl&&(0,E.jsx)(`img`,{src:e.imageUrl,alt:w,className:`w-24 sm:w-32 rounded-full object-cover aspect-square`,...e.imageWidth&&e.imageHeight?{width:e.imageWidth,height:e.imageHeight}:{}}),(0,E.jsxs)(`div`,{className:`flex-1`,children:[(0,E.jsx)(`h2`,{className:`text-2xl font-bold`,children:w}),e.born&&(0,E.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:e.born}),e.description&&(0,E.jsx)(`p`,{className:`text-base text-muted-foreground mt-2 leading-relaxed`,children:e.description})]})]}),(0,E.jsxs)(`p`,{className:`text-base text-muted-foreground`,children:[i(n),` `,n===1?`kniha`:n<5?`knihy`:`knih`]}),(0,E.jsx)(C,{currentPage:s,totalPages:c})]}),(0,E.jsxs)(`section`,{className:`space-y-4`,children:[u.length>0?(0,E.jsx)(m,{books:u,keyPrefix:`author-${e.slug}-`}):(0,E.jsx)(`p`,{className:`text-muted-foreground text-center py-8`,children:`Žádné knihy tohoto autora nejsou momentálně k dispozici.`}),(0,E.jsx)(x,{currentPage:s,totalPages:c}),f!==null&&s===1?(0,E.jsx)(`div`,{className:`flex justify-center pt-8`,children:(0,E.jsx)(`a`,{href:`?strana=${String(y+1)}`,className:h(`primary`,g?`opacity-50 pointer-events-none`:void 0),onClick:e=>{e.preventDefault(),D()},children:g?`Načítání…`:`Načíst další (${i(n-f)} zbývá)`})}):u.length>0&&s===1&&(0,E.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-4xl`,children:`❧`})]})]}),(0,E.jsx)(v,{lastUpdated:o})]})}var T,E,D=t((()=>{T=e(n(),1),p(),g(),_(),y(),S(),r(),E=f(),w.__docgenInfo={description:``,methods:[],displayName:`AuthorPage`,props:{author:{required:!0,tsType:{name:`Author`},description:``},initialBooks:{required:!0,tsType:{name:`Array`,elements:[{name:`Book`}],raw:`Book[]`},description:``},totalCount:{required:!0,tsType:{name:`number`},description:``},initialNextCursor:{required:!0,tsType:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``},currentPage:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`1`,computed:!1}},totalPages:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`1`,computed:!1}},onLoadMore:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(authorSlug: string, cursor: number) => Promise<AuthorLoadMoreResult>`,signature:{arguments:[{type:{name:`string`},name:`authorSlug`},{type:{name:`number`},name:`cursor`}],return:{name:`Promise`,elements:[{name:`AuthorLoadMoreResult`}],raw:`Promise<AuthorLoadMoreResult>`}}},description:``}}}}));function O(e,t){return Promise.resolve({books:s(`beletrie`).slice(0,2),nextCursor:null})}var k,A,j,M,N,P,F;t((()=>{D(),l(),k={title:`Pages/AuthorPage`,component:w,parameters:{layout:`fullscreen`},tags:[`autodocs`]},A={args:{author:u,initialBooks:s(`beletrie`),totalCount:4,initialNextCursor:null,onLoadMore:O}},j={args:{author:u,initialBooks:d.slice(0,4),totalCount:30,initialNextCursor:4,totalPages:2,onLoadMore:O}},M={args:{author:o,initialBooks:s(`beletrie`).slice(0,1),totalCount:1,initialNextCursor:null,onLoadMore:O}},N={args:{author:c,initialBooks:s(`beletrie`).slice(0,1),totalCount:1,initialNextCursor:null,onLoadMore:O}},P={args:{author:u,initialBooks:[],totalCount:0,initialNextCursor:null,onLoadMore:O}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    totalPages: 2,
    onLoadMore: mockLoadMore
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthorNoPhoto,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthorMinimal,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...P.parameters?.docs?.source}}},F=[`Default`,`WithLoadMore`,`NoPhoto`,`NoBio`,`Empty`]}))();export{A as Default,P as Empty,N as NoBio,M as NoPhoto,j as WithLoadMore,F as __namedExportsOrder,k as default};