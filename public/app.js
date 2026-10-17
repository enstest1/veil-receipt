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

// Read-only wallet connection uses official @bdxi/web3js 1.0.1.
// It never asks for seeds or signs transactions.
const setup=$('#setup'),walletCard=document.createElement('article');
walletCard.className='hero';walletCard.style.minHeight='auto';
const walletHeading=document.createElement('h3');walletHeading.textContent='Connect Beldex Wallet';
const walletStatus=document.createElement('p');walletStatus.textContent='Wallet not connected. Chrome extension v1.0.3 or compatible required.';
const walletButton=document.createElement('button');walletButton.textContent='Connect wallet (user approval)';
walletCard.append(walletHeading,walletStatus,walletButton);setup.prepend(walletCard);
walletButton.onclick=async()=>{try{
const sdk=window.BdxWeb3;if(!sdk?.detectProvider)throw Error('Beldex SDK unavailable');
const provider=await sdk.detectProvider({timeoutMs:3000});
if(!provider)throw Error('Official Beldex extension not detected. Install it from the verified Chrome Web Store link below.');
const wallet=new sdk.BeldexWeb3(provider);
const account=await wallet.connect();
walletStatus.textContent='Connected address: '+account.address+' / network: '+String(account.network)+' (check Testnet badge in wallet)';
const b=await wallet.getBalance();
walletStatus.textContent+=' / unlocked: '+sdk.fromAtomic(b.unlocked)+' BDX'+(b.approximate?' (approximate)':'');
}catch(err){walletStatus.textContent='Connection not completed: '+String(err.message||err)}};
