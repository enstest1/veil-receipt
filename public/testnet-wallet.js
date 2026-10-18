// Testnet-only BDX transfer experiment; never an invoice settlement verifier.
// Browser wallet retains keys and requires explicit approval for every send.
export function isProtoTestnet(network) {
  return typeof network === 'string' && network.toLowerCase() === 'testnet';
}
export function parseTestBdxAmount(raw) {
  const text = String(raw ?? '').trim();
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,9})?$/.test(text)) throw new Error('Enter a positive BDX decimal (up to 9 decimals).');
  const [whole, fractional = ''] = text.split('.');
  const amount = BigInt(whole) * 1000000000n + BigInt(fractional.padEnd(9, '0'));
  if (amount <= 0n) throw new Error('Amount must be greater than zero.');
  if (amount > 10000000000n) throw new Error('Test transfers are capped at 10 BDX.');
  return amount;
}
export function validateTestSend({network, recipient, amount, checkAddress}) {
  if (!isProtoTestnet(network)) throw new Error('Only Beldex testnet is allowed. Switch the wallet to Testnet.');
  const to = String(recipient ?? '').trim();
  if (!checkAddress(to)?.valid) throw new Error('Recipient must be a valid Beldex address (not an EVM 0x address).');
  return {to, amount: parseTestBdxAmount(amount)};
}
function element(name, text, parent, attrs={}) {
  const node = document.createElement(name);
  if (text !== null) node.textContent = text;
  for (const [k,v] of Object.entries(attrs)) node.setAttribute(k,v);
  parent.appendChild(node);
  return node;
}
export function mountTestnetWallet(container) {
  const card=element('article',null,container,{class:'hero',style:'min-height:auto'});
  element('h3','Beldex testnet wallet + real BDX transfer',card);
  element('p','For testing only. Privacy Token transfers are NOT supported by this SDK. A wallet-reported broadcast does not prove invoice settlement.',card);
  const status=element('p','Wallet not connected. Install the official Beldex extension, create a wallet privately, and select Testnet.',card);
  const connect=element('button','Connect wallet (approval required)',card);
  const form=element('form',null,card);
  const labelTo=element('label','Recipient Beldex testnet address',form);
  const to=element('input',null,labelTo,{type:'text',required:'',placeholder:'Beldex address, not 0x',maxlength:'200'});
  const labelAmount=element('label','Test BDX amount (maximum 10)',form);
  const amount=element('input',null,labelAmount,{type:'text',required:'',value:'0.01',inputmode:'decimal'});
  const send=element('button','Send test BDX (wallet approval)',form,{type:'submit',disabled:''});
  const outcome=element('pre','No on-chain transaction requested.',card);
  const faucet=element('a','Official testnet faucet',card,{href:'https://faucet.beldex.dev',target:'_blank',rel:'noopener noreferrer'});
  const localOnly = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  let wallet=null, network=null, address=null, inFlight=false;
  async function updateNetwork() {
    if (!wallet) return;
    network = await wallet.getNetwork();
    if (network && typeof network==='object') network = network.network;
    send.disabled = !localOnly || !isProtoTestnet(network) || inFlight;
    status.textContent = 'Connected: '+address+' / network: '+String(network)+' / test BDX send '+(send.disabled?'disabled':'enabled');
  }
  connect.onclick=async()=>{
    try {
      const sdk=window.BdxWeb3;
      if(!sdk?.detectProvider) throw new Error('Official SDK not available.');
      const provider=await sdk.detectProvider({timeoutMs:3000});
      if(!provider) throw new Error('Beldex Wallet extension not detected.');
      wallet=new sdk.BeldexWeb3(provider);
      const account=await wallet.connect();
      address=account.address;
      await updateNetwork();
      const b=await wallet.getBalance();
      status.textContent+=' / unlocked '+sdk.fromAtomic(b.unlocked)+' BDX'+(b.approximate?' (wallet approximation)':'');
      wallet.on('networkChanged',()=>{ updateNetwork().catch(e=>{send.disabled=true;status.textContent=e.message})});
      wallet.on('disconnect',()=>{wallet=null;network=null;send.disabled=true;status.textContent='Disconnected'});
    } catch(e) {send.disabled=true;status.textContent=String(e?.message || e);}
  };
  form.onsubmit=async e=>{
    e.preventDefault();
    if(inFlight || !wallet || !localOnly) return;
    const sdk=window.BdxWeb3;
    try {
      await updateNetwork();
      const p=validateTestSend({network,recipient:to.value,amount:amount.value,checkAddress:sdk.checkAddress});
      if (!window.confirm('Send '+amount.value+' TEST BDX to '+p.to+'? This will request a real TESTNET transaction in your wallet.')) return;
      await updateNetwork();
      if (!isProtoTestnet(network)) throw new Error('Network changed. Testnet send aborted.');
      inFlight=true;send.disabled=true;
      outcome.textContent='Wallet approval requested; no transaction confirmed yet.';
      const idempotencyKey='veil-test-'+crypto.randomUUID();
      // No unsafe automatic retries. An unresolved broadcast could still settle.
      const r=await wallet.sendTransactionSafe({...p,idempotencyKey,priority:1});
      if(r.status === 'confirmed') {
        outcome.textContent='Wallet reports a submitted transaction: '+String(r.txHash || 'hash unavailable')+'\nThis is NOT independent confirmation of finality or invoice payment.';
      } else {
        outcome.textContent='Transaction outcome unresolved. Do not retry blindly; inspect wallet transaction history. Operation: '+String(r.operationId||idempotencyKey);
      }
    } catch(error) {
      outcome.textContent='No confirmed transaction result: '+String(error?.message||error)+'\nIf wallet outcome is unknown, check wallet history before attempting again.';
    } finally {inFlight=false;await updateNetwork().catch(()=>{send.disabled=true})}
  };
}
