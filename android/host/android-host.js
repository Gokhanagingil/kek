// Android-only clipboard adapter. The native endpoint is restricted to our asset origin.
if (window.KekClipboard) {
  let pending = null;
  window.KekClipboard.onmessage = event => {
    if (!pending) return;
    const {resolve,reject,timer}=pending;pending=null;clearTimeout(timer);
    if(event.data==='copied')resolve();else reject(new Error('Kopyalanamadı'));
  };
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
    writeText(text){
      return new Promise((resolve,reject)=>{
        if(pending){reject(new Error('Kopyalama sürüyor'));return;}
        const timer=setTimeout(()=>{pending=null;reject(new Error('Kopyalanamadı'));},3000);
        pending={resolve,reject,timer};window.KekClipboard.postMessage(String(text));
      });
    }
  }});
}
