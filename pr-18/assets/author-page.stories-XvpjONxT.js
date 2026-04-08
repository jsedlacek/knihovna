import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./iframe-rWia2wbc.js";import{a as r,i,r as a}from"./book-rating-C6xY6lOa.js";import{a as o,c as s,i as c,n as l,r as u,s as d}from"./sample-books-CAMhy-UF.js";import{t as f}from"./jsx-runtime-Bn1Ys6_W.js";import{n as p,t as m}from"./book-grid-CBT1KC9x.js";import{n as h,r as g}from"./button-C89ATuxh.js";import{n as _,t as v}from"./footer-DvsRYPqD.js";import{n as y,t as b}from"./header-3cOAPx0q.js";import{n as x,t as S}from"./noscript-pagination-DiGB8gyo.js";function C({author:e,initialBooks:t,totalCount:n,initialNextCursor:r,lastUpdated:o,currentPage:s=1,totalPages:c=1,onLoadMore:l}){let[u,d]=(0,w.useState)(t),[f,p]=(0,w.useState)(r),[g,_]=(0,w.useState)(!1),[y,x]=(0,w.useState)(s),C=a(e.name),E=(0,w.useCallback)(async()=>{if(!(f===null||g||!l)){_(!0);try{let t=await l(e.slug,f);d(e=>[...e,...t.books]),p(t.nextCursor),x(e=>e+1)}finally{_(!1)}}},[f,g,e.slug,l]),D={"@context":`https://schema.org`,"@type":`Person`,name:C,...e.description&&{description:e.description},...e.imageUrl&&{image:e.imageUrl},url:`https://knihovna.jakub.contact/autor/${e.slug}`};return(0,T.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,T.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(D)}}),(0,T.jsx)(b,{}),(0,T.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,T.jsxs)(`section`,{className:`space-y-4`,children:[(0,T.jsxs)(`div`,{className:`flex items-start gap-4 sm:gap-6`,children:[e.imageUrl&&(0,T.jsx)(`img`,{src:e.imageUrl,alt:C,className:`w-24 sm:w-32 rounded-full object-cover aspect-square`,...e.imageWidth&&e.imageHeight?{width:e.imageWidth,height:e.imageHeight}:{}}),(0,T.jsxs)(`div`,{className:`flex-1`,children:[(0,T.jsx)(`h2`,{className:`text-2xl font-bold`,children:C}),e.born&&(0,T.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:e.born}),e.description&&(0,T.jsx)(`p`,{className:`text-base text-muted-foreground mt-2 leading-relaxed`,children:e.description})]})]}),(0,T.jsxs)(`p`,{className:`text-base text-muted-foreground`,children:[i(n),` `,n===1?`kniha`:n<5?`knihy`:`knih`]})]}),(0,T.jsxs)(`section`,{className:`space-y-4`,children:[u.length>0?(0,T.jsx)(m,{books:u,keyPrefix:`author-${e.slug}-`}):(0,T.jsx)(`p`,{className:`text-muted-foreground text-center py-8`,children:`Žádné knihy tohoto autora nejsou momentálně k dispozici.`}),(0,T.jsx)(S,{currentPage:s,totalPages:c}),f===null?u.length>0&&(0,T.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-4xl`,children:`❧`}):(0,T.jsx)(`div`,{className:`flex justify-center pt-8`,children:(0,T.jsx)(`a`,{href:`?strana=${String(y+1)}`,className:h(`primary`,g?`opacity-50 pointer-events-none`:void 0),onClick:e=>{e.preventDefault(),E()},children:g?`Načítání…`:`Načíst další (${i(n-f)} zbývá)`})})]})]}),(0,T.jsx)(v,{lastUpdated:o})]})}var w,T,E=t((()=>{w=e(n(),1),p(),g(),_(),y(),x(),r(),T=f(),C.__docgenInfo={description:``,methods:[],displayName:`AuthorPage`,props:{author:{required:!0,tsType:{name:`Author`},description:``},initialBooks:{required:!0,tsType:{name:`Array`,elements:[{name:`Book`}],raw:`Book[]`},description:``},totalCount:{required:!0,tsType:{name:`number`},description:``},initialNextCursor:{required:!0,tsType:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``},currentPage:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`1`,computed:!1}},totalPages:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`1`,computed:!1}},onLoadMore:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(authorSlug: string, cursor: number) => Promise<AuthorLoadMoreResult>`,signature:{arguments:[{type:{name:`string`},name:`authorSlug`},{type:{name:`number`},name:`cursor`}],return:{name:`Promise`,elements:[{name:`AuthorLoadMoreResult`}],raw:`Promise<AuthorLoadMoreResult>`}}},description:``}}}}));function D(e,t){return Promise.resolve({books:s(`beletrie`).slice(0,2),nextCursor:null})}var O,k,A,j,M,N,P;t((()=>{E(),l(),O={title:`Pages/AuthorPage`,component:C,parameters:{layout:`fullscreen`},tags:[`autodocs`]},k={args:{author:u,initialBooks:s(`beletrie`),totalCount:4,initialNextCursor:null,onLoadMore:D}},A={args:{author:u,initialBooks:d.slice(0,4),totalCount:30,initialNextCursor:4,totalPages:2,onLoadMore:D}},j={args:{author:o,initialBooks:s(`beletrie`).slice(0,1),totalCount:1,initialNextCursor:null,onLoadMore:D}},M={args:{author:c,initialBooks:s(`beletrie`).slice(0,1),totalCount:1,initialNextCursor:null,onLoadMore:D}},N={args:{author:u,initialBooks:[],totalCount:0,initialNextCursor:null,onLoadMore:D}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    totalPages: 2,
    onLoadMore: mockLoadMore
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthorNoPhoto,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthorMinimal,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...N.parameters?.docs?.source}}},P=[`Default`,`WithLoadMore`,`NoPhoto`,`NoBio`,`Empty`]}))();export{k as Default,N as Empty,M as NoBio,j as NoPhoto,A as WithLoadMore,P as __namedExportsOrder,O as default};