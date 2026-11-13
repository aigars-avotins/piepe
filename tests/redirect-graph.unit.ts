import test from 'node:test'
import assert from 'node:assert/strict'
import {redirectTarget} from '../scripts/redirect-graph.mjs'
const origin='https://pie.pe',allowed=new Set([origin,'http://pie.pe'])
test('relative, absolute and HTTP entry redirects preserve the intended site origin',()=>{
 assert.equal(redirectTarget(origin+'/en','/en/',new Set(),allowed),origin+'/en/')
 assert.equal(redirectTarget('http://pie.pe/',origin+'/',new Set(),allowed),origin+'/')
 assert.equal(redirectTarget(origin+'/en?source=x','/en/?source=x',new Set(),allowed),origin+'/en/?source=x')
})
test('loops, missing locations, protocol downgrades and deceptive origins fail the redirect gate',()=>{
 for(const location of ['', 'javascript:alert(1)','https://pie.pe.evil.example/','https://pie.pe@evil.example/','http://pie.pe/','/en/'])assert.throws(()=>redirectTarget(origin+'/en/',location,new Set([origin+'/en/']),allowed))
})
