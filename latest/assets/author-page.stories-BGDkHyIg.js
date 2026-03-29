import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./iframe-Sc4w4Wdk.js";import{a as r,i,r as a}from"./book-rating-qBsZADGc.js";import{a as o,c as s,i as c,n as l,r as u,s as d}from"./sample-books-DXdrDAzR.js";import{t as f}from"./jsx-runtime-Bn1Ys6_W.js";import{n as p,t as m}from"./book-grid-BbsFPrT9.js";import{n as h,t as g}from"./button-CRgA5SKU.js";import{n as _,t as v}from"./footer-DvsRYPqD.js";import{n as y,t as b}from"./header-CG3MA4jb.js";function x({author:e,initialBooks:t,totalCount:n,initialNextCursor:r,lastUpdated:o,onLoadMore:s}){let[c,l]=(0,S.useState)(t),[u,d]=(0,S.useState)(r),[f,p]=(0,S.useState)(!1),h=a(e.name),_=(0,S.useCallback)(async()=>{if(!(u===null||f||!s)){p(!0);try{let t=await s(e.slug,u);l(e=>[...e,...t.books]),d(t.nextCursor)}finally{p(!1)}}},[u,f,e.slug,s]),y={"@context":`https://schema.org`,"@type":`Person`,name:h,...e.description&&{description:e.description},...e.imageUrl&&{image:e.imageUrl},url:`https://knihovna.jakub.contact/autor/${e.slug}`};return(0,C.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,C.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(y)}}),(0,C.jsx)(b,{}),(0,C.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,C.jsxs)(`section`,{className:`space-y-4`,children:[(0,C.jsxs)(`div`,{className:`flex items-start gap-4 sm:gap-6`,children:[e.imageUrl&&(0,C.jsx)(`img`,{src:e.imageUrl,alt:h,className:`w-24 sm:w-32 rounded-full object-cover aspect-square`,...e.imageWidth&&e.imageHeight?{width:e.imageWidth,height:e.imageHeight}:{}}),(0,C.jsxs)(`div`,{className:`flex-1`,children:[(0,C.jsx)(`h2`,{className:`text-2xl font-bold`,children:h}),e.born&&(0,C.jsx)(`p`,{className:`text-sm text-muted-foreground mt-1`,children:e.born}),e.description&&(0,C.jsx)(`p`,{className:`text-base text-muted-foreground mt-2 leading-relaxed`,children:e.description})]})]}),(0,C.jsxs)(`p`,{className:`text-base text-muted-foreground`,children:[i(n),` `,n===1?`kniha`:n<5?`knihy`:`knih`]})]}),(0,C.jsxs)(`section`,{className:`space-y-4`,children:[c.length>0?(0,C.jsx)(m,{books:c,keyPrefix:`author-${e.slug}-`}):(0,C.jsx)(`p`,{className:`text-muted-foreground text-center py-8`,children:`Žádné knihy tohoto autora nejsou momentálně k dispozici.`}),u===null?c.length>0&&(0,C.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-2xl`,children:`❧`}):(0,C.jsx)(`div`,{className:`flex justify-center pt-8`,children:(0,C.jsx)(g,{onClick:_,disabled:f,children:f?`Načítání…`:`Načíst další (${i(n-c.length)} zbývá)`})})]})]}),(0,C.jsx)(v,{lastUpdated:o})]})}var S,C,w=t((()=>{S=e(n(),1),p(),h(),_(),y(),r(),C=f(),x.__docgenInfo={description:``,methods:[],displayName:`AuthorPage`,props:{author:{required:!0,tsType:{name:`Author`},description:``},initialBooks:{required:!0,tsType:{name:`Array`,elements:[{name:`Book`}],raw:`Book[]`},description:``},totalCount:{required:!0,tsType:{name:`number`},description:``},initialNextCursor:{required:!0,tsType:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``},onLoadMore:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(authorSlug: string, cursor: number) => Promise<AuthorLoadMoreResult>`,signature:{arguments:[{type:{name:`string`},name:`authorSlug`},{type:{name:`number`},name:`cursor`}],return:{name:`Promise`,elements:[{name:`AuthorLoadMoreResult`}],raw:`Promise<AuthorLoadMoreResult>`}}},description:``}}}}));function T(e,t){return Promise.resolve({books:s(`beletrie`).slice(0,2),nextCursor:null})}var E,D,O,k,A,j,M;t((()=>{w(),l(),E={title:`Pages/AuthorPage`,component:x,parameters:{layout:`fullscreen`},tags:[`autodocs`]},D={args:{author:u,initialBooks:s(`beletrie`),totalCount:4,initialNextCursor:null,onLoadMore:T}},O={args:{author:u,initialBooks:d.slice(0,4),totalCount:30,initialNextCursor:4,onLoadMore:T}},k={args:{author:o,initialBooks:s(`beletrie`).slice(0,1),totalCount:1,initialNextCursor:null,onLoadMore:T}},A={args:{author:c,initialBooks:s(`beletrie`).slice(0,1),totalCount:1,initialNextCursor:null,onLoadMore:T}},j={args:{author:u,initialBooks:[],totalCount:0,initialNextCursor:null,onLoadMore:T}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    onLoadMore: mockLoadMore
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthorNoPhoto,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthorMinimal,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    author: sampleAuthor,
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    onLoadMore: mockLoadMore
  }
}`,...j.parameters?.docs?.source}}},M=[`Default`,`WithLoadMore`,`NoPhoto`,`NoBio`,`Empty`]}))();export{D as Default,j as Empty,A as NoBio,k as NoPhoto,O as WithLoadMore,M as __namedExportsOrder,E as default};