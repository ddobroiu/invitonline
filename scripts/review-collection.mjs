import { chromium } from '@playwright/test'
import fs from 'node:fs'
const src=fs.readFileSync('src/config/templates.ts','utf8')
const models=[...src.matchAll(/\{ id: '([^']+)', name: '([^']+)'[^\n]*suits: \[([^\]]*)\]/g)].map(m=>({id:m[1],name:m[2],type:m[3].split(',')[0].replaceAll("'",'').trim()}))
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}})
fs.mkdirSync('shots/review',{recursive:true})
for(const t of models){
 if(fs.existsSync('shots/review/'+t.id+'.png'))continue
 await page.goto('http://localhost:3015/templates/'+t.id+'?cta=0&tip='+t.type,{waitUntil:'networkidle',timeout:120000})
 const decline=page.getByRole('button',{name:'Refuză',exact:true}); if(await decline.isVisible())await decline.click()
 await page.screenshot({path:'shots/review/'+t.id+'.png'})
 console.log(t.id)
}
const tiles=models.map(t=>'<div><h3>'+t.id+'</h3><img src="data:image/png;base64,'+fs.readFileSync('shots/review/'+t.id+'.png').toString('base64')+'" /></div>').join('')
await page.setViewportSize({width:1400,height:2200});await page.setContent('<style>body{margin:0;padding:20px;background:#ddd;font:14px Arial;display:grid;grid-template-columns:repeat(7,1fr);gap:12px}h3{margin:5px}img{width:100%}</style>'+tiles);await page.screenshot({path:'shots/review/overview.png',fullPage:true});await browser.close()
