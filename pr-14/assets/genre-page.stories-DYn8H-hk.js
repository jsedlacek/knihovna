import{a as e,n as t}from"./chunk-BneVvdWh.js";import{t as n}from"./iframe-UEFLEHCm.js";import{a as r,i}from"./book-rating-kIdz8Mgy.js";import{c as a,n as o,s}from"./sample-books-DpC5IHIE.js";import{t as c}from"./jsx-runtime-Bn1Ys6_W.js";import{n as l,t as u}from"./book-grid-BGyDRYcQ.js";import{n as d,t as f}from"./button-CRgA5SKU.js";import{n as p,t as m}from"./footer-DvsRYPqD.js";import{n as h,t as g}from"./header-tXQH5yut.js";import{i as _,t as v}from"./genre-utils-ekptsq4T.js";function y({initialBooks:e,totalCount:t,initialNextCursor:n,genreKey:r,lastUpdated:a,onLoadMore:o}){let s=v[r],[c,l]=(0,b.useState)(e),[d,p]=(0,b.useState)(n),[h,_]=(0,b.useState)(!1),y=(0,b.useCallback)(async()=>{if(!(d===null||h||!o)){_(!0);try{let e=await o(r,d);l(t=>[...t,...e.books]),p(e.nextCursor)}finally{_(!1)}}},[d,h,r,o]),S={"@context":`https://schema.org`,"@type":`CollectionPage`,name:s.name,description:s.metaDescription,url:`https://knihovna.jakub.contact/${r}`,inLanguage:`cs`,numberOfItems:t};return(0,x.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-background text-foreground`,children:[(0,x.jsx)(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:JSON.stringify(S)}}),(0,x.jsx)(g,{}),(0,x.jsxs)(`main`,{className:`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6`,children:[(0,x.jsx)(`section`,{className:`space-y-4`,children:(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h2`,{className:`text-2xl font-bold`,children:s.name}),(0,x.jsxs)(`p`,{className:`text-base text-muted-foreground mt-1`,children:[s.description,` (`,i(t),` `,t===1?`kniha`:t<5?`knihy`:`knih`,`)`]})]})}),(0,x.jsxs)(`section`,{className:`space-y-4`,children:[c.length>0?(0,x.jsx)(u,{books:c,keyPrefix:`${r}-`}):(0,x.jsx)(`p`,{className:`text-muted-foreground text-center py-8`,children:`V této kategorii nejsou momentálně k dispozici žádné knihy.`}),d===null?c.length>0&&(0,x.jsx)(`p`,{className:`text-center text-muted-foreground pt-8 text-2xl`,children:`❧`}):(0,x.jsx)(`div`,{className:`flex justify-center pt-8`,children:(0,x.jsx)(f,{onClick:y,disabled:h,children:h?`Načítání…`:`Načíst další (${i(t-c.length)} zbývá)`})})]})]}),(0,x.jsx)(m,{lastUpdated:a})]})}var b,x,S=t((()=>{b=e(n(),1),l(),d(),p(),h(),_(),r(),x=c(),y.__docgenInfo={description:``,methods:[],displayName:`GenrePage`,props:{initialBooks:{required:!0,tsType:{name:`Array`,elements:[{name:`Book`}],raw:`Book[]`},description:``},totalCount:{required:!0,tsType:{name:`number`},description:``},initialNextCursor:{required:!0,tsType:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},description:``},genreKey:{required:!0,tsType:{name:`unknown`},description:``},lastUpdated:{required:!1,tsType:{name:`string`},description:``},onLoadMore:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(genre: string, cursor: number) => Promise<LoadMoreResult>`,signature:{arguments:[{type:{name:`string`},name:`genre`},{type:{name:`number`},name:`cursor`}],return:{name:`Promise`,elements:[{name:`LoadMoreResult`}],raw:`Promise<LoadMoreResult>`}}},description:``}}}}));function C(e,t){return Promise.resolve({books:a(`beletrie`).slice(0,2),nextCursor:null})}var w,T,E,D,O;t((()=>{S(),o(),w={title:`Pages/GenrePage`,component:y,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{genreKey:{control:{type:`select`},options:[`beletrie`,`poezie`,`divadlo`,`deti`,`ostatni`]}}},T={args:{initialBooks:a(`beletrie`),totalCount:4,initialNextCursor:null,genreKey:`beletrie`,onLoadMore:C}},E={args:{initialBooks:s.slice(0,4),totalCount:30,initialNextCursor:4,genreKey:`beletrie`,onLoadMore:C}},D={args:{initialBooks:[],totalCount:0,initialNextCursor:null,genreKey:`ostatni`,onLoadMore:C}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    genreKey: "beletrie",
    onLoadMore: mockLoadMore
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    genreKey: "beletrie",
    onLoadMore: mockLoadMore
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    genreKey: "ostatni",
    onLoadMore: mockLoadMore
  }
}`,...D.parameters?.docs?.source}}},O=[`Default`,`WithLoadMore`,`Empty`]}))();export{T as Default,D as Empty,E as WithLoadMore,O as __namedExportsOrder,w as default};