import{n as e}from"./chunk-BneVvdWh.js";import{c as t,n,s as r}from"./sample-books-DLEvnvOw.js";import{n as i,t as a}from"./genre-section-BX8aOli8.js";var o,s,c,l,u;e((()=>{n(),i(),o={title:`Components/GenreSection`,component:a,parameters:{layout:`padded`},tags:[`autodocs`],argTypes:{genreKey:{control:{type:`select`},options:[`beletrie`,`poezie`,`divadlo`,`deti`,`ostatni`]}}},s={args:{books:t(`beletrie`),genreKey:`beletrie`,bookCount:42}},c={args:{books:r.slice(0,1),genreKey:`beletrie`,bookCount:15}},l={args:{books:[],genreKey:`beletrie`,bookCount:0}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    books: sampleBooksByGenre("beletrie"),
    genreKey: "beletrie",
    bookCount: 42
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    books: sampleBooks.slice(0, 1),
    genreKey: "beletrie",
    bookCount: 15
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    books: [],
    genreKey: "beletrie",
    bookCount: 0
  }
}`,...l.parameters?.docs?.source}}},u=[`Beletrie`,`WithOneBook`,`EmptySection`]}))();export{s as Beletrie,l as EmptySection,c as WithOneBook,u as __namedExportsOrder,o as default};