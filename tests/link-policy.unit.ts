import test from 'node:test'
import assert from 'node:assert/strict'
import {linkPolicy} from '../src/linkPolicy.ts'

test('native same-site navigation, images, download URLs and non-web schemes stay in the current tab',()=>{
 for(const href of ['/', '/en/', '#xray-wood','/images/interactive/atlas-pores.jpg','/wallpapers/example.jpg?size=5k','https://pie.pe/en/','http://pie.pe/en/','//pie.pe/','mailto:hello@example.org','tel:+37100000000'])assert.equal(linkPolicy(href).target,undefined,href)
})
test('external websites are isolated by parsed origin, including deceptive hostname/userinfo/port forms',()=>{
 for(const href of ['https://www.anbg.gov.au/fungi/','https://www.woodlandtrust.org.uk/','https://pie.pe.evil.example/','https://pie.pe@evil.example/','https://pie.pe:444/'])assert.deepEqual(linkPolicy(href),{target:'_blank',rel:'noopener noreferrer'},href)
})

test('modified or already-handled link activations remain browser-owned',async()=>{
 const {plainLinkActivation}=await import('../src/linkPolicy.ts'),plain={button:0,defaultPrevented:false,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false}
 assert.equal(plainLinkActivation(plain),true)
 for(const key of ['defaultPrevented','metaKey','ctrlKey','shiftKey','altKey'])assert.equal(plainLinkActivation({...plain,[key]:true}),false,key)
 assert.equal(plainLinkActivation({...plain,button:1}),false)
})
