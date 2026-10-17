const $=x=>document.querySelector(x);
function show(tab){document.querySelectorAll('.pane').forEach(n=>n.classList.toggle('active',n.id===tab));document.querySelectorAll('nav button').forEach(n=>n.classList.toggle('active',n.dataset.tab===tab));}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.tab));
$('#createShortcut').onclick=()=>show('setup');
document.querySelectorAll('#invoices input,#verify textarea,#invoiceForm button,#verifyButton,#issueReceipt').forEach(n=>{n.disabled=true});
const note=document.createElement('p');
note.textContent='This hosted preview has no operator backend and cannot create or verify invoices. Clone the GitHub repo to run those features locally.';
note.style.color='#8ce5ca';$('#invoices').prepend(note);
const check=document.createElement('p');
check.textContent='Receipt signature verification is available only through the local backend. No blockchain verification is live.';
$('#verify').prepend(check);
const setup=$('#setup');
const card=document.createElement('article');card.className='hero';card.style.minHeight='auto';
const h=document.createElement('h3');h.textContent='Beldex Wallet — read-only connection';
const msg=document.createElement('p');msg.textContent='Optional: connect using the official extension to display your wallet address and BDX balance. No transactions are sent.';
const btn=document.createElement('button');btn.textContent='Connect wallet (approve in extension)';
card.append(h,msg,btn);setup.prepend(card);
btn.onclick=async()=>{
try{
 const sdk=window.BdxWeb3;if(!sdk?.detectProvider)throw Error('SDK not loaded');
 const provider=await sdk.detectProvider({timeoutMs:3000});
 if(!provider)throw Error('Beldex extension not detected. Install it from the official Chrome Web Store link below.');
 const wallet=new sdk.BeldexWeb3(provider);
 const {address,network}=await wallet.connect();
 const balance=await wallet.getBalance();
 msg.textContent='Connected to '+String(network)+' • '+address.slice(0,10)+'…'+address.slice(-6)+' • spendable '+sdk.fromAtomic(balance.unlocked)+' BDX'+(balance.approximate?' (approximate)':'');
}catch(e){msg.textContent=String(e.message||e)}
};
