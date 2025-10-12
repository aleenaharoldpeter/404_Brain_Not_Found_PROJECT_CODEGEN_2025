// ------------------------- STORY & CHAOS -------------------------
const story = document.getElementById('story');
const startBtn = document.getElementById('startBtn');

let chaosScore = 0;

const messages = [
  "404: Brain Not Found 💀",
  "You typed `console.log('help')`… I’m judging you.",
  "Reminder: semicolons exist for a reason 😭",
  "Are you sure you want to debug… or just panic?",
  "IDE Mood: Confused 🤯",
  "Did you just… hit run again? Bold move."
];

function showMessage(msg) {
  const p = document.createElement('p');
  p.innerHTML = msg;
  p.classList.add('glitch');
  story.appendChild(p);
}

function playerChoice() {
  story.innerHTML = `<p>How do you respond?</p>
  <button id="calmBtn">Debug calmly</button>
  <button id="screamBtn">Scream at IDE</button>`;

  document.getElementById('calmBtn').addEventListener('click', () => {
    chaosScore -= 1;
    showEnding();
  });
  document.getElementById('screamBtn').addEventListener('click', () => {
    chaosScore += 2;
    showEnding();
  });

  setTimeout(addStartMiniChallengeBtn, 500);
}

function showEnding() {
  story.innerHTML = '';
  if (chaosScore <= 0) {
    showMessage("IDE calms down… All is well. 🛌✨");
  } else {
    showMessage("IDE is completely broken! 😱💥🌀");
    showMessage("Emojis everywhere! 🤯🤯🤯");
  }
}

startBtn.addEventListener('click', () => {
  story.innerHTML = '';
  messages.forEach((msg, i) => {
    setTimeout(() => showMessage(msg), i * 800);
  });
  setTimeout(playerChoice, messages.length * 800 + 500);
});

// ------------------------- PROFILE HANDLING -------------------------
const PROFILE_KEY = 'bf_profile_v1';

function saveProfile(p){ localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }
function loadProfile(){ try{ const v = localStorage.getItem(PROFILE_KEY); return v? JSON.parse(v): null }catch(e){return null} }
function clearProfile(){ localStorage.removeItem(PROFILE_KEY) }

document.addEventListener('DOMContentLoaded', ()=>{
  const prof = loadProfile();
  if(!prof){
    document.getElementById('profileOverlay').classList.remove('hidden');
  }else{
    showMessage('Welcome back, ' + prof.name + '. Carry on at your peril.');
  }
});

// Profile form
const p_form = document.getElementById('profileForm');
const p_prof_select = document.getElementById('p_profession');
const p_other_wrap = document.getElementById('otherProfessionWrap');
p_prof_select.addEventListener('change', ()=>{
  if(p_prof_select.value === 'Other') p_other_wrap.classList.remove('hidden');
  else p_other_wrap.classList.add('hidden');
});
p_form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('p_name').value.trim() || 'Anon';
  let prof = p_prof_select.value || 'Other';
  if(prof === 'Other'){
    const s = document.getElementById('p_prof_other').value.trim();
    if(s) prof = s;
  }
  const age = parseInt(document.getElementById('p_age').value) || 'Unknown';
  const profile = {name, profession: prof, age};
  saveProfile(profile);
  document.getElementById('profileOverlay').classList.add('hidden');
  showMessage('Profile saved. Prepare for friendly roasting, ' + profile.name + '.');
});

// ------------------------- ROAST -------------------------
const roastPool = [
  "Even AI refused to debug that, {name}.",
  "Not bad for someone who thinks semicolons are optional, {name}.",
  "A {profession} aged {age} doing this? Revolutionary.",
  "{name}, are you sure you didn't just reverse your brain too?",
  "At {age}, this is peak productivity. It's all downhill from here.",
  "I haven't seen this level of commitment to chaos since the last merge commit, {name}.",
  "Wow, {name}! You could reverse strings, but can you reverse your life choices?",
  "This code is like a mystery novel with no ending — and you're the author, {name}.",
  "If bugs were trophies, you'd be Olympic champion, {name}.",
  "{name}, this input didn't stand a chance. Respect its bravery."
];

const roastPool_Math = [
  "{name}, you couldn’t find ‘x’ if it was tattooed on your forehead.",
  "Your math skills are like pi — endless and irrational, {name}.",
  "If brains were angles, you’d be a straight line — no curves, {name}.",
  "You bring new meaning to ‘subtracting from the team,’ {name}.",
  "Your logic makes less sense than a divided by zero, {name}.",
  "{name}, your problem-solving skills are like imaginary numbers — they don’t exist.",
  "You calculate mistakes faster than you solve equations, {name}.",
  "At {age}, {name}, your math is so off, even calculators are offended.",
  "Your math is like a black hole — everything disappears into confusion.",
  "{name}, if you were a function, you’d be discontinuous everywhere.",
  "Your answers are like complex numbers — nobody knows what they mean.",
  "You have the precision of a weather forecast in the desert, {name}.",
  "I’d say your math is exponential, {name} — exponential in errors.",
  "You’re proof that sometimes the answer is ‘try again,’ {name}.",
  "Your mental math has more holes than Swiss cheese, {name}.",
  "Math called — it wants its logic back, {name}.",
  "You solve problems like a broken calculator: slow and inaccurate.",
  "Even a math textbook would skip your page, {name}.",
  "You’re the reason math teachers need more patience, {name}.",
  "At {age}, your math is still stuck in first grade, {name}.",
  "Your brain’s calculating speed? More like a sloth in a marathon.",
  "You treat formulas like ancient spells — mostly misunderstood and scary.",
  "If mistakes were integers, you'd be infinity, {name}.",
  "You could confuse a mathematician with your ‘solutions,’ {name}.",
  "You’re like a parabola opening downward — always going down, {name}."
];

function buildRoast(profile, isMath=false){
  const pool = isMath ? roastPool_Math : roastPool;
  let t = pool[Math.floor(Math.random()*pool.length)];
  t = t.replace('{name}', profile.name || 'Friend')
       .replace('{profession}', profile.profession || 'Human')
       .replace('{age}', profile.age || 'Unknown');
  return t;
}

function showRoastOverlay(profile, reason, isMath=false){
  const title = buildRoast(profile, isMath).toUpperCase();
  const msg = reason || 'You failed epically.';
  document.getElementById('roastTitle').innerText = title;
  document.getElementById('roastMsg').innerText = msg;
  document.getElementById('roastOverlay').classList.remove('hidden');
  startEmoji(6000);
  setTimeout(()=>{ document.getElementById('roastOverlay').classList.add('hidden'); },6200);
}

// ------------------------- EMOJI CANVAS -------------------------
const canvas = document.getElementById('emojiCanvas');
const ctx = canvas.getContext ? canvas.getContext('2d') : null;
let canvasW=0, canvasH=0, particles=[], raining=false, animId=null;
function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; canvasW=canvas.width; canvasH=canvas.height; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const EMOJIS=['🎉','🔥','💻','🤯','😂','💀','🧠','✨','🚀'];
class P{constructor(x,y,e){this.x=x;this.y=y;this.vx=Math.random()*1-0.5;this.vy=Math.random()*2+1;this.e=e;this.size=20+Math.random()*18;this.rot=Math.random()*6;this.alpha=1;}
step(){this.x+=this.vx; this.y+=this.vy; this.vy+=0.02; if(this.y>canvasH+50) this.alpha=0;}
draw(){ctx.save();ctx.globalAlpha=this.alpha;ctx.translate(this.x,this.y);ctx.rotate(this.rot);ctx.font=this.size+'px serif';ctx.fillText(this.e,0,0);ctx.restore();}}
function startEmoji(duration=5000){
  if(!ctx) return;
  canvas.classList.remove('hidden'); raining=true;
  const end=Date.now()+duration;
  const spr=setInterval(()=>{for(let i=0;i<8;i++){particles.push(new P(Math.random()*canvasW,-30,EMOJIS[Math.floor(Math.random()*EMOJIS.length)]));}if(Date.now()>end) clearInterval(spr);},120);
  function frame(){ctx.clearRect(0,0,canvasW,canvasH);particles.forEach(p=>{p.step();p.draw();});particles=particles.filter(p=>p.alpha>0);animId=requestAnimationFrame(frame);}
  frame();
  setTimeout(()=>{raining=false;setTimeout(()=>{cancelAnimationFrame(animId);particles=[];ctx.clearRect(0,0,canvasW,canvasH);canvas.classList.add('hidden');},900);},duration+700);
}

// ------------------------- MINI CHALLENGE MODAL & MOCK IDE -------------------------
const challengeModal = document.getElementById("challengeModal");
const codingBtn = document.getElementById("codingChallengeBtn");
const mathBtn = document.getElementById("mathChallengeBtn");
const mockIDE = document.getElementById("mockIDE");
const mockQ = document.getElementById("mockQuestion");
const mockCode = document.getElementById("mockCode");
const mockAns = document.getElementById("mockAnswer");
const runBtn = document.getElementById("runMockCode");

let currentQ = 0;
let isMathChallenge = false;
let mathQCount = 0;
const totalMathQs = 10;
let currentMathQ = null;

const codingQs = [
  {q:"Reverse a String", starter:"def reverse_string(string):\n    return ____", expected:["string[::-1]","str.split('').reverse().join('')","new StringBuilder(s).reverse().toString()"]},
  {q:"Two Sum", starter:"for i in range(len(nums)):\n    for j in range(i+1,len(nums)):\n        if nums[i]+nums[j]==target:\n            return ____", expected:["[i,j]","(i,j)"]},
  {q:"Find Maximum in Array", starter:"def find_max(arr):\n    return ____", expected:["max(arr)","Math.max(...arr)","Arrays.stream(arr).max().getAsInt()"]}
];

// ------------------------- MATH CHALLENGE -------------------------
function generateMathQuestion() {
  const ops = ['+', '-', '*', '/'];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  const op = ops[Math.floor(Math.random() * ops.length)];

  // Ensure integer division
  if(op === '/') a = a * b;

  const qText = `${a} ${op} ${b} = ____`;
  let ans;
  switch(op){
    case '+': ans = (a+b).toString(); break;
    case '-': ans = (a-b).toString(); break;
    case '*': ans = (a*b).toString(); break;
    case '/': ans = (a/b).toString(); break;
  }

  return {qText, ans};
}

function loadMathQuestion() {
  if(mathQCount >= totalMathQs){
    mockIDE.innerHTML = `
      <p>🎉 Math session complete!</p>
      <button id="playAgainMath">Play Again</button>
      <button id="returnMainMath">Return to Main Menu</button>
    `;
    document.getElementById('playAgainMath').addEventListener('click', ()=>{
      mathQCount=0;
      loadMathQuestion();
    });
    document.getElementById('returnMainMath').addEventListener('click', ()=>{
      mockIDE.classList.add('hidden');
      addStartMiniChallengeBtn();
    });
    return;
  }
  currentMathQ = generateMathQuestion();
  mockQ.innerText = currentMathQ.qText;
  mockCode.textContent = "";
  mockAns.value = "";
}

// ------------------------- MINI CHALLENGE BUTTON -------------------------
function addStartMiniChallengeBtn(){
  const holder = document.getElementById('story');
  if(document.getElementById('startMiniChalBtn')) return;
  const btn = document.createElement('button');
  btn.id='startMiniChalBtn';
  btn.innerText='Start Mini-Challenges';
  btn.style.marginLeft='10px';
  holder.appendChild(btn);

  btn.addEventListener('click', ()=>{
    challengeModal.classList.remove('hidden');
  });
}

// ------------------------- CHALLENGE BUTTONS -------------------------
codingBtn.addEventListener('click', ()=>{
  challengeModal.classList.add('hidden');
  currentQ=0;
  isMathChallenge=false;
  loadMockIDE();
  mockIDE.classList.remove('hidden');
});

mathBtn.addEventListener('click', ()=>{
  challengeModal.classList.add('hidden');
  isMathChallenge=true;
  mathQCount=0;
  loadMathQuestion();
  mockIDE.classList.remove('hidden');
});

// ------------------------- LOAD MOCK IDE -------------------------
function loadMockIDE(){
  const profile = loadProfile() || {name:'Anon', profession:'Human', age:'Unknown'};
  if(isMathChallenge){
    loadMathQuestion();
    return;
  }
  const pool = codingQs;
  if(currentQ>=pool.length){
    mockIDE.classList.add('hidden');
    showMessage("All mini coding challenges completed 🧠🎉");
    return;
  }
  const q = pool[currentQ];
  mockQ.innerText = q.q;
  mockCode.textContent = q.starter;
  mockAns.value='';
}

// ------------------------- RUN BUTTON -------------------------
runBtn.addEventListener('click', ()=>{
  const profile = loadProfile() || {name:'Anon', profession:'Human', age:'Unknown'};
  if(isMathChallenge){
    const userAns = mockAns.value.trim();
    if(userAns === currentMathQ.ans){
      mathQCount++;
      mockQ.textContent = "✅ Correct! 🧮";
      setTimeout(loadMathQuestion, 800);
    }else{
      mockIDE.classList.add('hidden');
      showRoastOverlay(profile,"Wrong answer 😵 Try again!", true);
    }
    return;
  }

  const pool = codingQs;
  const ans = mockAns.value.trim();
  const q = pool[currentQ];
  const correct = q.expected.some(e=>e.toLowerCase()===ans.toLowerCase());

  if(correct){
    mockQ.textContent="✅ Nice one, you actually have a brain 🧠";
    setTimeout(()=>{ currentQ++; loadMockIDE(); },1500);
  }else{
    mockIDE.classList.add('hidden');
    showRoastOverlay(profile,"Wrong answer 😵 Try again!", false);
  }
});

// ------------------------- ESC CLOSE -------------------------
document.addEventListener('keydown',(e)=>{
  if(e.key==="Escape"){
    challengeModal.classList.add('hidden');
    mockIDE.classList.add('hidden');
  }
});

// ------------------------- RESET PROFILE -------------------------
window.resetProfile=function(){clearProfile(); location.reload();}
