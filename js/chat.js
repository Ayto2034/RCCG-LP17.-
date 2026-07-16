/* ===== Ask LP17 assistant (fully offline, no external calls) ===== */
(function(){
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const chipsWrap = document.getElementById('chatChips');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  if (!launcher || !panel) return;

  const FB_URL = 'https://www.facebook.com/rccglp17hq';

  const intents = [
    { tag:'greeting', keywords:['hi','hello','hey','good morning','good afternoon','good evening'],
      answer:"Hello! I'm the Ask LP17 assistant. I can help with service times, location, our pastor, ministries, and more — what would you like to know?" },
    { tag:'services', keywords:['service','sunday','time','schedule','when','worship'],
      answer:"Weekly services: Sunrise Service 7:30 AM & Sunshine Service 10:00 AM (Sunday), Bible Study 6:30 PM (Tuesday), Hour of Grace 6:30 AM (Wednesday), Faith Clinic 6:30 PM (Thursday), Prayer Meeting 12:00 PM (Friday). See the Services page for monthly specials too." },
    { tag:'solution', keywords:['solution hour','solution'],
      answer:"Solution Hour is a special service held every 3rd Wednesday of the month, in place of the regular Hour of Grace — a focused time of prayer for breakthrough." },
    { tag:'faithclinic', keywords:['faith clinic','clinic'],
      answer:"Faith Clinic holds every Thursday at 6:30 PM — a time of teaching and ministration for healing and wholeness." },
    { tag:'holyghost', keywords:['holy ghost service','holy ghost'],
      answer:"Holy Ghost Service is held every 1st Friday of the month, alongside our regular Friday Prayer Meeting at 12:00 PM." },
    { tag:'vigil', keywords:['vigil','all night','night of prayer','power'],
      answer:"The Monthly Provincial Vigil is held every 3rd Friday of the month at 10:00 PM at the provincial headquarters — \"A Night of Prayer. A Lifetime of Power.\" Ministering: Pastor Thompson Olulade and other anointed ministers of God." },
    { tag:'location', keywords:['where','address','location','directions','venue','park'],
      answer:"We're at 118 Nureni Yusuf Drive, Adekunjo Bus Stop, Kollinton, Alagbado, Lagos. Check the Contact page for a \"Get directions\" link straight to Maps." },
    { tag:'pastor', keywords:['pastor','picp','olulade','who leads','leader'],
      answer:"Pastor Thompson Olulade is the Provincial Pastor (PICP) of Lagos Province 17, alongside Pastor (Mrs) Folake Olulade. He previously served as pioneer PICP of RCCG Lagos Province 123 before being sent forth to lead LP17." },
    { tag:'ministries', keywords:['ministry','ministries','group','fellowship','join a','ushering','choir'],
      answer:"Our ministries: Young Adults (Royal Excel Tribe), Teen Church, Men's Fellowship, Women's Fellowship, Children's Church, and Choir & Media. Ask me about one, or visit the Ministries page." },
    { tag:'women', keywords:['women','sisters','convention','transformed woman','akosile'],
      answer:"The Women's Fellowship is led by Pst (Mrs) Olufunke Akosile, PICP CSR LP17. It's home to the annual Sisters Convention — the 2026 edition was themed \"The Transformed Woman.\"" },
    { tag:'youth', keywords:['youth','young adult','old school','teen','royal excel','tribe'],
      answer:"Young Adults are the Royal Excel Tribe, known for creative fellowship days like Old School Sunday — \"Roots & Relevance,\" a vintage-themed celebration with an elders' Q&A, wisdom circle, and old-school photo booth. Teen Church runs separately for teenagers." },
    { tag:'elders', keywords:['elders','elderly','thanksgiving service','senior'],
      answer:"Our Elders Thanksgiving Service is a beautiful annual celebration honouring the seniors of the province — see the slideshow on our Gallery page." },
    { tag:'salvation', keywords:['give my life','salvation','born again','accept christ','follow christ'],
      answer:"You can give your life to Christ right now, right where you are — believe in your heart and confess with your mouth that Jesus is Lord (Romans 10:9). Tell us so we can celebrate with you: message us on Facebook or speak to anyone on the welcome team after a service." },
    { tag:'prayer', keywords:['prayer request','pray for','counsel','need prayer'],
      answer:"We'd love to stand in prayer with you. This chat can't privately send requests yet, so the best way right now is to message our Facebook page directly, or share it in person at the Friday prayer meeting or vigil." },
    { tag:'membership', keywords:['member','join','new here','first time','visit'],
      answer:"Welcome — we'd love to have you! Just visit us for any service and let the welcome team know it's your first time; they'll walk you through joining a house fellowship and becoming a member." },
    { tag:'contact', keywords:['phone','email','contact','call','number','talk to a person','human','facebook'],
      answer:"Phone and email are being finalized for the province. Right now, the fastest way to reach someone is our official Facebook page, @rccglp17hq." },
    { tag:'thanks', keywords:['thank','thanks','appreciate','bye','goodbye'],
      answer:"You're always welcome! God bless you — feel free to come back with any other questions." }
  ];

  const chips = [
    'Service times', 'Where are you located?', 'Who is the Pastor?', 'Join a ministry', 'Prayer request'
  ];

  function renderChips(){
    chipsWrap.innerHTML = '';
    chips.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', () => handleUserMessage(label));
      chipsWrap.appendChild(btn);
    });
  }

  function addMessage(text, sender){
    const div = document.createElement('div');
    div.className = 'msg ' + (sender === 'user' ? 'msg-user' : 'msg-bot');
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function addFacebookLink(){
    const div = document.createElement('div');
    div.className = 'msg msg-bot';
    const a = document.createElement('a');
    a.href = FB_URL;
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.color = 'var(--maroon)';
    a.style.fontWeight = '600';
    a.textContent = 'Open @rccglp17hq on Facebook →';
    div.appendChild(a);
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function matchIntent(message){
    const msg = message.toLowerCase();
    let best = null, bestScore = 0;
    intents.forEach(intent => {
      let score = 0;
      intent.keywords.forEach(k => { if (msg.includes(k)) score++; });
      if (score > bestScore){ bestScore = score; best = intent; }
    });
    return best;
  }

  function handleUserMessage(text){
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    const typing = document.createElement('div');
    typing.className = 'msg-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      typing.remove();
      const intent = matchIntent(text);
      if (intent){
        addMessage(intent.answer, 'bot');
        if (['contact','prayer','salvation'].includes(intent.tag)) addFacebookLink();
      } else {
        addMessage("I don't have that answer just yet. Try asking about service times, location, our pastor, or ministries — or reach out directly on Facebook.", 'bot');
        addFacebookLink();
      }
    }, delay);
  }

  let started = false;
  function openChat(){
    panel.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!started){
      started = true;
      renderChips();
      addMessage("Hello! I'm the Ask LP17 assistant \u2014 a quick offline guide to River of Life Parish, Lagos Province 17. Tap a question below or type your own.", 'bot');
    }
    input.focus();
  }
  function closeChat(){
    panel.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', () => {
    panel.classList.contains('open') ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', () => handleUserMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage(input.value);
  });
})();
