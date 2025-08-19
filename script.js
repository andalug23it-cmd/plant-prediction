let model = null;
let useDemo = true;
let labels = ["Healthy","Leaf Spot","Rust","Blight","Mildew"];
let stream = null;

// DOM refs
const el = id => document.getElementById(id);
const modelUrl = el('modelUrl');
const preview = el('preview');
const video = el('video');
const predictionsEl = el('predictions');
const statusEl = el('status');
const historyEl = el('history');
const labelsArea = el('labels');
const modeName = el('modeName');
const canvas = el('canvas');

// ===== Utils =====
function setStatus(msg){ statusEl.textContent = msg; }
function setModePill(){ modeName.textContent = useDemo ? 'Demo' : (model?'TF.js':'None'); }

function imageToCanvas(imageEl, target=224){
  const s = Math.min(imageEl.naturalWidth, imageEl.naturalHeight);
  const sx=(imageEl.naturalWidth-s)/2, sy=(imageEl.naturalHeight-s)/2;
  canvas.width = target; canvas.height = target;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageEl,sx,sy,s,s,0,0,target,target);
  return canvas;
}

function renderPredictions(items){
  predictionsEl.innerHTML='';
  items.forEach(({label,prob})=>{
    const row=document.createElement('div');
    row.className='pred';
    row.innerHTML=`
      <div>
        <div>${label}</div>
        <div class="bar"><span style="width:${(prob*100).toFixed(1)}%"></span></div>
      </div>
      <div style="text-align:right">${(prob*100).toFixed(1)}%</div>`;
    predictionsEl.appendChild(row);
  });
}

function pushHistory(src,label){
  const item=document.createElement('div');
  item.className='hist-item small';
  item.innerHTML=<img src="${src}" style="width:100%;border-radius:8px"/><div>${label}</div>;
  historyEl.prepend(item);
}

// ===== Demo Heuristic =====
function demoPredict(img){
  const ctx=imageToCanvas(img,128).getContext('2d');
  const {data}=ctx.getImageData(0,0,128,128);
  let g=0,r=0,b=0,n=0;
  for(let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; n++; }
  const greenIndex=(g/n - (r/n+b/n)/2);
  const score=Math.max(0,Math.min(1,(greenIndex+40)/120));
  return [
    {label:'Healthy',prob:Math.max(0.55,score)},
    {label:'Stressed',prob:(1-score)*0.6},
    {label:'Leaf Spot',prob:(1-score)*0.2}
  ];
}

// ===== TF.js prediction =====
async function tfPredict(img){
  const size=model.inputs?.[0]?.shape?.[1]||224;
  const can=imageToCanvas(img,size);
  const t=tf.tidy(()=>tf.browser.fromPixels(can).toFloat().div(255).expandDims(0));
  const out=model.predict(t);
  const probs=await out.softmax().data();
  tf.dispose([t,out]);
  const lab=labelsArea.value.trim().split('\n').filter(x=>x) || labels;
  return Array.from(probs).map((p,i)=>({label:lab[i]||Class${i},prob:p}))
             .sort((a,b)=>b.prob-a.prob).slice(0,5);
}

// ===== Events =====
el('btnLoad').onclick=async ()=>{
  try{
    if(!modelUrl.value) return alert('Enter a model URL');
    setStatus('Loading...');
    model=await tf.loadGraphModel(modelUrl.value);
    useDemo=false; setModePill(); setStatus('Model loaded ✔');
  }catch(e){console.error(e);setStatus('Load failed');}
};
el('btnUnload').onclick=()=>{ model=null; useDemo=true; setModePill(); setStatus('Unloaded'); };
el('btnUseDemoLabels').onclick=()=>{ labelsArea.value=labels.join('\n'); };

el('fileInput').onchange=async e=>{
  const f=e.target.files[0]; if(!f) return;
  preview.src=URL.createObjectURL(f); setStatus('Image ready. Click Predict.');
};

el('btnWebcam').onclick=async ()=>{
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
  video.srcObject=stream; setStatus('Webcam on');
};
el('btnSnap').onclick=()=>{
  if(!video.srcObject) return;
  canvas.width=video.videoWidth; canvas.height=video.videoHeight;
  canvas.getContext('2d').drawImage(video,0,0);
  preview.src=canvas.toDataURL('image/jpeg'); setStatus('Captured');
};
el('btnStop').onclick=()=>{stream?.getTracks().forEach(t=>t.stop());video.srcObject=null;setStatus('Webcam off');};
el('btnClear').onclick=()=>{preview.removeAttribute('src');predictionsEl.innerHTML='';setStatus('Cleared');};

el('btnPredict').onclick=async ()=>{
  if(!preview.src) return alert('Upload or capture an image');
  setStatus(useDemo?'Demo predicting...':'Predicting...');
  const res=useDemo?demoPredict(preview):await tfPredict(preview);
  renderPredictions(res); setStatus('Done');
  pushHistory(preview.src,res[0].label);
};

document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='d'){useDemo=!useDemo||!model;setModePill();setStatus(useDemo?'Demo mode':'TF.js mode');}
});

setModePill();