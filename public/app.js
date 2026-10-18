import { mountTestnetWallet } from './testnet-wallet.js';
const $=x=>document.querySelector(x);let selected=null;
async function api(path,method='GET',obj){const r=await fetch(path,{method,headers:{'Content-Type':'application/json','x-operator-secret':$('#secret').value},body:obj?JSON.stringify(obj):undefined});const data=await r.json();if(!r.ok)throw Error(data.error||'Request failed');return data}
function show(tab){document.querySelectorAll('.pane').forEach(n=>n.classList.toggle('active',n.id===tab));document.querySelectorAll('nav button').forEach(n=>n.classList.toggle('active',n.dataset.tab===tab));if(tab==='invoices')load()}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.tab));$('#createShortcut').onclick=()=>show('invoices');
const element=(type,value)=>{const x=document.createElement(type);x.textContent=value;return x};
async function load(){const parent=$('#invoiceList');parent.replaceChildren();try{const data=await api('/api/invoices');for(const i of data.invoices){const card=element('article','');card.append(element('small',i.token+' / '+i.status),element('b',i.title),element('div',i.amount+' '+i.token+' • '+i.destinationMask));const btn=element('button','Review and sign');btn.className='secondary';btn.onclick=()=>{selected=i.id;$('#review').classList.remove('hidden')};card.append(btn);parent.append(card)}}catch(e){parent.append(element('p',e.message+' — enter operator key first'))}}
$('#secret').addEventListener('change',load);
$('#invoiceForm').onsubmit=async ev=>{ev.preventDefault();try{const data=Object.fromEntries(new FormData(ev.target));const result=await api('/api/invoices','POST',data);alert('Created unverified invoice '+result.invoice.id);await load()}catch(e){alert(e.message)}};
$('#reviewForm').onsubmit=async ev=>{ev.preventDefault();if(!selected)return;try{await api('/api/invoices/'+selected+'/review','POST',Object.fromEntries(new FormData(ev.target)));alert('Operator reviewed: NOT chain-verified');await load()}catch(e){alert(e.message)}};
$('#issueReceipt').onclick=async()=>{if(!selected)return;try{const data=await api('/api/invoices/'+selected+'/receipt','POST',{});$('#receiptInput').value=JSON.stringify(data.receipt,null,2);show('verify');alert('Signed operator statement; not chain proof')}catch(e){alert(e.message)}};
$('#verifyButton').onclick=async()=>{try{const data=await api('/api/verify','POST',JSON.parse($('#receiptInput').value));$('#verifyResult').textContent=JSON.stringify(data,null,2)}catch(e){$('#verifyResult').textContent=e.message}};


mountTestnetWallet(document.querySelector('#setup'));
