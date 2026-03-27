import{n as e}from"./chunk-BneVvdWh.js";import{n as t,o as n}from"./sample-books-DLEvnvOw.js";import{n as r,t as i}from"./book-card-D2w-eGAP.js";var a,o,s,c,l,u,d,f,p,m,h;e((()=>{t(),r(),a={title:`Components/BookCard`,component:i,parameters:{layout:`padded`},tags:[`autodocs`],argTypes:{index:{control:{type:`number`},description:`Index of the book card (used for unique keys)`}}},o={...n,title:`Neznámá kniha`,author:`Neznámý autor`,rating:null,ratingsCount:null,url:null},s={...n,title:`Velmi dlouhý název knihy, který se může rozložit na více řádků`,subtitle:`s ještě delším podtitulem, který také zabírá hodně místa`,description:`Velmi dlouhý popis knihy, který obsahuje mnoho detailů o ději, postavách a autorovi. Tento popis slouží k testování, jak se komponenta chová s delšími texty a zda správně ořezává text na třech řádcích pomocí line-clamp třídy.`},c={...n,imageUrl:null},l={...n,title:`Kronika o Narni`,partTitle:`Lev, čarodějnice a skříň`,author:`C. S. Lewis`},u={args:{book:n,index:0}},d={args:{book:o,index:0}},f={args:{book:s,index:0}},p={args:{book:c,index:0}},m={args:{book:l,index:0}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    book: sampleBook,
    index: 0
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    book: bookWithoutRating,
    index: 0
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    book: bookWithLongTitle,
    index: 0
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    book: bookWithoutImage,
    index: 0
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    book: bookWithPartTitle,
    index: 0
  }
}`,...m.parameters?.docs?.source}}},h=[`Default`,`WithoutRating`,`WithLongContent`,`WithoutImage`,`WithPartTitle`]}))();export{u as Default,f as WithLongContent,m as WithPartTitle,p as WithoutImage,d as WithoutRating,h as __namedExportsOrder,a as default};