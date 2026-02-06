(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();class J{constructor(){this.routes=new Map,this.currentPage=null,this.currentParams={},this.history=[],window.addEventListener("popstate",t=>{this.handleRoute(window.location.pathname,!1)})}register(t,e){return this.routes.set(t,e),this}navigate(t,e={}){this.history.push({path:window.location.pathname,state:this.currentParams}),window.history.pushState(e,"",t),this.handleRoute(t,!0)}back(){this.history.length>0?window.history.back():this.navigate("/")}handleRoute(t,e=!0){const[s,a]=t.split("?"),{handler:n,params:o}=this.matchRoute(s);if(!n){console.warn(`路由未找到: ${s}`),s!=="/"&&this.navigate("/");return}if(a){const d=new URLSearchParams(a);for(const[u,p]of d)o[u]=p}this.currentParams=o;const r=document.getElementById("app");if(!r){console.error("找不到 #app 容器");return}const l=r.querySelector(".page");l&&l.classList.add(e?"page-exit":"page-exit-back"),setTimeout(()=>{let d;if(typeof n=="function")try{d=new n(o)}catch{d=n(o)}if(d&&typeof d.render=="function"){r.innerHTML=d.render();const u=r.querySelector(".page");u&&u.classList.add(e?"page-enter":"page-enter-back"),typeof d.attachEvents=="function"&&d.attachEvents(),typeof d.init=="function"&&d.init(),this.currentPage=d}else typeof d=="string"&&(r.innerHTML=d);window.scrollTo(0,0)},l?250:0)}matchRoute(t){if(this.routes.has(t))return{handler:this.routes.get(t),params:{}};for(const[e,s]of this.routes){const a=this.extractParams(e,t);if(a!==null)return{handler:s,params:a}}return{handler:null,params:{}}}extractParams(t,e){const s=t.split("/").filter(Boolean),a=e.split("/").filter(Boolean);if(s.length!==a.length)return null;const n={};for(let o=0;o<s.length;o++)if(s[o].startsWith(":")){const r=s[o].slice(1);n[r]=decodeURIComponent(a[o])}else if(s[o]!==a[o])return null;return n}getParams(){return this.currentParams}start(){this.handleRoute(window.location.pathname,!1)}}const B=new J;window.router=B;class K{constructor(){this.state={},this.listeners=new Map,this.storageKey="matching_game_state",this.loadFromStorage()}get(t,e=null){return t in this.state?this.state[t]:e}set(t,e,s=!1){const a=this.state[t];this.state[t]=e,this.listeners.has(t)&&this.listeners.get(t).forEach(n=>{n(e,a)}),s&&this.saveToStorage()}update(t,e,s=!1){const a=this.get(t,{});this.set(t,{...a,...e},s)}delete(t){delete this.state[t],this.saveToStorage()}subscribe(t,e){return this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(e),()=>{this.listeners.get(t).delete(e)}}saveToStorage(){try{const t={user:this.state.user,testHistory:this.state.testHistory,settings:this.state.settings};localStorage.setItem(this.storageKey,JSON.stringify(t))}catch(t){console.warn("保存状态失败:",t)}}loadFromStorage(){try{const t=localStorage.getItem(this.storageKey);if(t){const e=JSON.parse(t);this.state={...this.state,...e}}}catch(t){console.warn("加载状态失败:",t)}}clear(){this.state={},localStorage.removeItem(this.storageKey)}}const D=new K;D.set("currentTest",null);D.set("testProgress",{step:0,total:0});window.appState=D;const Y=[{id:"love",icon:"💑",title:"感情匹配",description:"测试你们的契合指数",longDescription:"通过生日特质或直觉卡牌分析，深入了解你与TA之间的性格契合度，探索两人性格的互补与摩擦点。",price:29.9,category:"relationship",popular:!0,features:["性格特质分析","性格互补性评估","相处建议"]},{id:"career",icon:"💼",title:"职场关系",description:"解析职场人际关系",longDescription:"分析你与同事、领导之间的相处之道，了解职场中的潜在助力与阻力。",price:29.9,category:"career",popular:!0,features:["领导关系分析","同事相处建议","职场风险提示"]},{id:"cooperation",icon:"🤝",title:"合作关系",description:"看清合作对象，早做决定",longDescription:"评估你与潜在合作伙伴的契合度，分析合作中可能遇到的挑战与机遇。",price:29.9,category:"career",popular:!1,features:["合作契合度评分","风险预警","合作策略建议"]},{id:"thoughts",icon:"💭",title:"TA的想法和态度",description:"揭开TA的真实想法",longDescription:"通过直觉卡牌测试，探索对方内心的真实想法和对你的态度。",price:29.9,category:"relationship",popular:!0,features:["对方心理分析","真实态度解读","沟通建议"]},{id:"job",icon:"📈",title:"职业发展",description:"找到最适合你的职业方向",longDescription:"基于你的性格特征分析，为你推荐最适合的职业发展方向。",price:29.9,category:"career",popular:!1,features:["性格职业匹配","行业推荐","发展路径规划"]},{id:"city",icon:"🗺️",title:"城市方向",description:"哪座城市最适合你发展",longDescription:"根据你的出生地和性格特征，分析最适合你发展的城市方向。",price:29.9,category:"direction",popular:!1,features:["方位适配分析","城市推荐","发展建议"]},{id:"peach",icon:"🌸",title:"社交魅力",description:"测试你的社交魅力值",longDescription:"分析你近期的社交状态，了解提升人际吸引力的方式。",price:29.9,category:"relationship",popular:!0,features:["社交魅力分析","提升建议","人际关系指导"]},{id:"benefactor",icon:"⭐",title:"人脉分析",description:"发现你身边的助力者",longDescription:"分析适合你的人脉特征，帮助你识别和拓展有价值的人际关系。",price:29.9,category:"direction",popular:!1,features:["人脉特征分析","识别方法","社交建议"]},{id:"yesno",icon:"❓",title:"Yes or No",description:"犹豫时，快速帮你判断",longDescription:"面对选择犹豫不决？让直觉卡牌给你一个参考答案。",price:19.9,category:"decision",popular:!0,features:["快速测试","明确答案","行动建议"]},{id:"choice",icon:"⚖️",title:"二选一",description:"左右为难？帮你稳妥选对",longDescription:"两个选择左右为难？直觉卡牌帮你分析每个选择的利弊。",price:19.9,category:"decision",popular:!1,features:["双选对比分析","利弊权衡","最优建议"]}];function v(i){return Y.find(t=>t.id===i)}function g(i={}){const{title:t="匹配游戏",showBack:e=!1,showHistory:s=!1,showProfile:a=!0,onBack:n=null}=i;return`
    <nav class="navbar">
      <div class="navbar__left">
        ${e?'<button class="navbar__back-btn" data-action="back">←</button>':""}
        <div class="navbar__logo">${t}</div>
      </div>
      <div class="navbar__actions">
        ${s?'<button class="navbar__icon-btn" data-action="history" title="历史记录">🕐</button>':""}
        ${a?'<button class="navbar__icon-btn navbar__profile-btn" data-action="profile" title="个人中心">👤</button>':""}
      </div>
    </nav>
  `}function Z(i={}){const{icon:t="✨",title:e="发现你的性格契合度",subtitle:s="探索人际关系的奥秘",buttonText:a="开始测试",onButtonClick:n=null}=i;return`
    <section class="hero-banner">
      <div class="glass-card text-center animate-fade-in-up">
        <div class="hero-banner__icon animate-float">${t}</div>
        <h1 class="heading-1 mb-2">${e}</h1>
        <p class="body-text-secondary mb-4">${s}</p>
        <button class="btn btn--primary btn--lg" data-action="hero-start">
          <span>✨</span>
          <span>${a}</span>
        </button>
      </div>
    </section>
  `}function x(i,t,e={}){const{showText:s=!0,showSteps:a=!1,stepLabel:n=""}=e,o=Math.min(i/t*100,100),r=n?`<span class="progress-bar__label">${n}</span>`:"",l=s?`<div class="progress-bar__text">${i} / ${t}</div>`:"";return`
    <div class="progress-bar">
      <div class="progress-bar__track-wrapper">
        <div class="progress-bar__track">
          <div class="progress-bar__fill" style="width: ${o}%"></div>
        </div>
        ${r}
        <div class="progress-bar__track">
          <div class="progress-bar__fill" style="width: ${o}%"></div>
        </div>
      </div>
      ${l}
    </div>
  `}function tt(i,t={}){window.router&&typeof window.router.navigate=="function"?window.router.navigate(i,t):(console.warn("路由器不可用，使用 location 导航"),window.location.href=i)}function et(i,t={}){const{showPrice:e=!1,showBadge:s=!0,onClick:a=null}=t,n=s&&i.popular?'<span class="feature-card__badge">热门</span>':"",o=e?`<span class="feature-card__price">¥${i.price}</span>`:"";return`
    <div class="glass-card glass-card--interactive feature-card" data-type="${i.id}">
      ${n}
      <div class="feature-card__icon">${i.icon}</div>
      <div class="feature-card__content">
        <h3 class="feature-card__title">${i.title}</h3>
        <p class="feature-card__description">${i.description}</p>
      </div>
      ${o}
      <span class="feature-card__arrow">→</span>
    </div>
  `}function st(i){return`
    <div class="glass-card feature-card-detail">
      <div class="feature-card-detail__header">
        <span class="feature-card-detail__icon">${i.icon}</span>
        <div>
          <h2 class="heading-2">${i.title}</h2>
          <p class="small-text">${i.description}</p>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <p class="body-text-secondary mb-4">${i.longDescription}</p>
      
      <div class="feature-card-detail__features">
        <h4 class="small-text mb-2" style="color: var(--color-primary);">包含内容：</h4>
        <ul class="feature-list">
          ${i.features.map(t=>`
            <li class="feature-list__item">
              <span class="feature-list__icon">✓</span>
              <span>${t}</span>
            </li>
          `).join("")}
        </ul>
      </div>
      
    </div>
  `}class at{constructor(){this.matchTypes=Y}render(){return`
      <div class="page home-page">
        ${g({title:"匹配游戏",showBack:!1,showHistory:!1,showProfile:!0})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 欢迎横幅 -->
            ${Z({icon:"✨",title:"发现你的性格契合度",subtitle:"探索人际关系的奥秘",buttonText:"开始匹配..."})}

            <!-- 场景测试标题 -->
            <section class="section-header mt-6 mb-4">
              <h2 class="heading-2 text-center" style="color: var(--color-text-secondary);">
                趣味测试
              </h2>
            </section>

            <!-- 功能卡片列表 -->
            <section class="feature-list">
              ${this.matchTypes.map((t,e)=>`
                <div class="animate-fade-in-up animate-delay-${Math.min((e+1)*100,500)} animate-hidden">
                  ${et(t,{showBadge:!0})}
                </div>
              `).join("")}
            </section>

            <!-- 底部间距 -->
            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `}attachEvents(){this.initAnimations(),document.querySelectorAll(".feature-card").forEach(e=>{e.addEventListener("click",s=>{const a=e.dataset.type;this.handleFeatureClick(a)})});const t=document.querySelector('[data-action="hero-start"]');t&&t.addEventListener("click",()=>{document.querySelector(".feature-list")?.scrollIntoView({behavior:"smooth"})}),document.querySelectorAll(".navbar__icon-btn").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.action;this.handleNavAction(s)})})}initAnimations(){const t=document.querySelectorAll(".animate-hidden"),e=new IntersectionObserver(s=>{s.forEach(a=>{a.isIntersecting&&(a.target.classList.remove("animate-hidden"),e.unobserve(a.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});t.forEach(s=>e.observe(s))}handleFeatureClick(t){const e=new Date,s=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")} ${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}`;console.log(`[${s}] 选择了匹配类型: ${t}`),window.router.navigate(`/test/${t}`)}handleNavAction(t){switch(t){case"history":window.showToast("历史记录功能开发中...");break;case"profile":window.router.navigate("/profile");break}}}class nt{constructor(t){if(this.matchType=v(t.type),!this.matchType){window.router.navigate("/");return}}render(){return this.matchType?`
      <div class="page test-select-page">
        ${g({title:this.matchType.title,showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 匹配类型详情 -->
            <section class="mt-4 mb-6 animate-fade-in-up">
              ${st(this.matchType)}
            </section>

            <!-- 测试方式选择 -->
            <section class="test-method-section animate-fade-in-up animate-delay-200">
              <h3 class="heading-3 mb-4 text-center">选择测试方式</h3>
              
              <div class="method-cards">
                <!-- 生日匹配 -->
                <div class="glass-card glass-card--interactive method-card" data-method="birthday">
                  <div class="method-card__icon">🎂</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title">生日匹配</h4>
                    <p class="method-card__description">输入双方生日，通过生日特质分析性格关系</p>
                    <div class="method-card__tag">
                      <span class="badge badge--primary">需要双方生日</span>
                    </div>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>

                <!-- 直觉卡牌测试 -->
                <div class="glass-card glass-card--interactive method-card" data-method="tarot">
                  <div class="method-card__icon">🃏</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title">直觉卡牌</h4>
                    <p class="method-card__description">凭直觉翻牌，通过卡牌符号解析关系</p>
                    <div class="method-card__tag">
                      <span class="badge badge--secondary">无需生日</span>
                    </div>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>
              </div>
            </section>

            <!-- 说明提示 -->
            <section class="tips-section mt-6 animate-fade-in-up animate-delay-300">
              <div class="glass-card glass-card--light">
                <div class="tips-header">
                  <span>💡</span>
                  <span class="small-text">选择提示</span>
                </div>
                <ul class="tips-list">
                  <li>如果知道双方准确的出生日期，推荐使用<strong>生日匹配</strong>，结果更精准</li>
                  <li>如果不清楚对方生日，可以使用<strong>直觉卡牌</strong>，凭直觉感应</li>
                  <li>两种方式都是趣味性格测试，仅供娱乐参考</li>
                </ul>
              </div>
            </section>

            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `:""}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()}),document.querySelectorAll(".method-card").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.method;this.handleMethodSelect(s)})})}handleMethodSelect(t){const e=this.matchType.id;t==="birthday"?window.router.navigate(`/test/${e}/birthday`):t==="tarot"&&window.router.navigate(`/test/${e}/tarot`)}}const A=[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,41696,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560],R=["正","二","三","四","五","六","七","八","九","十","冬","腊"],H=["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"],it=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],ot=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],rt=["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];function ct(i){let t=348;for(let e=32768;e>8;e>>=1)t+=A[i-1900]&e?1:0;return t+V(i)}function V(i){return W(i)?A[i-1900]&65536?30:29:0}function W(i){return A[i-1900]&15}function lt(i,t){return A[i-1900]&65536>>t?30:29}function dt(i,t,e){if(i<1900||i>2100)return null;const s=new Date(1900,0,31),a=new Date(i,t-1,e);let n=Math.floor((a-s)/864e5),o=1900,r=0;for(o=1900;o<2101&&n>0;o++)r=ct(o),n-=r;n<0&&(n+=r,o--);const l=W(o);let d=!1,u=1;for(u=1;u<13&&n>0;u++)l>0&&u===l+1&&!d?(--u,d=!0,r=V(o)):r=lt(o,u),d&&u===l+1&&(d=!1),n-=r;n===0&&l>0&&u===l+1&&(d?d=!1:(d=!0,--u)),n<0&&(n+=r,--u);const p=n+1,h=it[(o-4)%10]+ot[(o-4)%12],m=rt[(o-4)%12];return{lunarYear:o,lunarMonth:u,lunarDay:p,isLeap:d,ganzhiYear:h,animal:m,yearStr:`${o}年`,monthStr:`${d?"闰":""}${R[u-1]}月`,dayStr:H[p-1],fullStr:`农历${o}年 ${h}年（${m}年） ${d?"闰":""}${R[u-1]}月${H[p-1]}`}}function T(i){if(!i)return"";const[t,e,s]=i.split("-").map(Number),a=dt(t,e,s);return a?a.fullStr:"日期超出范围"}class ut{constructor(t){if(this.matchType=v(t.type),!this.matchType){window.router.navigate("/");return}this.formData={personA:{name:"",gender:"",birthDate:"",lunarDate:""},personB:{name:"",gender:"",birthDate:"",lunarDate:""}},this.currentStep=1}render(){return this.matchType?`
      <div class="page birthday-input-page">
        ${g({title:"生日匹配",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示 -->
            <section class="progress-section mt-4 mb-6">
              ${x(this.currentStep,2,{showText:!1,showSteps:!1,stepLabel:`步骤 ${this.currentStep}/2：输入${this.currentStep===1?"你的":"对方的"}信息`})}
            </section>

            <!-- 表单区域 -->
            <section class="form-section animate-fade-in-up">
              <div class="glass-card">
                <h3 class="heading-3 mb-4">
                  ${this.currentStep===1?"👤 你的信息":"👥 对方的信息"}
                </h3>
                
                <form id="birthday-form" class="form">
                  <!-- 性别 -->
                  <div class="input-group mb-4">
                    <div class="gender-selector">
                      <button type="button" class="gender-btn" data-gender="male">
                        <span class="gender-icon">👨</span>
                        <span>男</span>
                      </button>
                      <button type="button" class="gender-btn" data-gender="female">
                        <span class="gender-icon">👩</span>
                        <span>女</span>
                      </button>
                    </div>
                  </div>

                  <!-- 称呼 -->
                  <div class="input-group mb-4">
                    <input 
                      type="text" 
                      id="name" 
                      class="input" 
                      placeholder="称呼"
                      maxlength="10"
                    >
                  </div>

                  <!-- 出生日期 -->
                  <div class="input-group mb-4">
                    <div class="date-input-wrapper" id="date-input-wrapper">
                      <input 
                        type="text" 
                        id="birthDate" 
                        class="input date-input-placeholder"
                        placeholder="请选择阳历（公历）生日"
                        readonly
                        max="${new Date().toISOString().split("T")[0]}"
                        min="1920-01-01"
                      >
                    </div>
                    <div id="lunar-date" class="lunar-date-display" style="display: none;">
                      <span class="lunar-icon">🌙</span>
                      <span class="lunar-text"></span>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            <!-- 已输入的A信息展示（步骤2时显示）-->
            ${this.renderPersonAInfo()}

          </div>
        </main>

        <!-- 底部操作栏 -->
        <div class="bottom-action-bar safe-area-bottom">
          <div class="action-bar__buttons">
            ${this.currentStep===2?`
              <button class="btn btn--secondary" data-action="back-step">上一步</button>
            `:""}
            <button class="btn btn--primary btn--full" data-action="next" disabled>
              ${this.currentStep===1?"下一步":"开始分析"}
            </button>
          </div>
        </div>
      </div>
    `:""}renderPersonAInfo(){const t=this.formData.personA,e=this.formData.personB,s=t.gender==="male"?"👨":t.gender==="female"?"👩":"👤",a=e.gender==="male"?"👨":e.gender==="female"?"👩":"👤";return`
      <section class="persons-info mt-4 animate-fade-in">
        <div class="persons-info__cards">
          <!-- 甲方信息卡片 -->
          <div class="person-card ${this.currentStep===1?"person-card--active":""}" data-person="A">
            <div class="person-card__top">
              <span class="person-avatar">${s}</span>
              <div class="person-card__info">
                <p class="person-card__name">${t.name||"甲方"}</p>
                <div class="person-card__date-row">
                  <span class="person-card__date">${t.birthDate||"未填写"}</span>
                  <span class="badge ${t.name?"badge--success":"badge--secondary"}">
                    ${t.name?"已填写":"待填写"}
                  </span>
                </div>
              </div>
            </div>
            ${t.lunarDate?`<p class="person-card__lunar">${t.lunarDate}</p>`:""}
          </div>
          
          <!-- 乙方信息卡片 -->
          <div class="person-card ${this.currentStep===2?"person-card--active":""}" data-person="B">
            <div class="person-card__top">
              <span class="person-avatar">${a}</span>
              <div class="person-card__info">
                <p class="person-card__name">${e.name||"乙方"}</p>
                <div class="person-card__date-row">
                  <span class="person-card__date">${e.birthDate||"未填写"}</span>
                  <span class="badge ${e.name?"badge--success":"badge--secondary"}">
                    ${e.name?"已填写":"待填写"}
                  </span>
                </div>
              </div>
            </div>
            ${e.lunarDate?`<p class="person-card__lunar">${e.lunarDate}</p>`:""}
          </div>
        </div>
      </section>
    `}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{this.currentStep===2?this.goBackStep():window.router.back()}),document.querySelectorAll(".person-card").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.person;this.switchToPerson(l)})}),document.querySelectorAll(".gender-btn").forEach(r=>{r.addEventListener("click",()=>{this.selectGender(r.dataset.gender)})});const e=document.getElementById("name"),s=document.getElementById("birthDate"),a=document.getElementById("date-input-wrapper");e&&e.addEventListener("input",()=>this.validateForm()),s&&s.addEventListener("change",()=>{this.updateLunarDate(s.value),this.validateForm()}),a&&s&&a.addEventListener("click",()=>{s.type==="text"&&(s.type="date",s.removeAttribute("readonly")),setTimeout(()=>{s.showPicker?.(),s.focus()},0)});const n=document.querySelector('[data-action="next"]');n&&(n.onclick=r=>{console.log("点击了下一步/开始分析按钮"),console.log("当前步骤:",this.currentStep),console.log("表单数据:",JSON.stringify(this.formData)),this.handleNext()});const o=document.querySelector('[data-action="back-step"]');o&&(o.onclick=()=>{console.log("点击了上一步按钮"),this.goBackStep()})}selectGender(t){document.querySelectorAll(".gender-btn").forEach(e=>{e.classList.toggle("active",e.dataset.gender===t)}),this.currentStep===1?this.formData.personA.gender=t:this.formData.personB.gender=t,this.updatePersonCards(),this.validateForm()}updatePersonCards(){if(document.querySelectorAll(".person-card").length===0)return;const e=document.querySelector('[data-person="A"] .person-avatar');if(e){const a=this.formData.personA.gender;e.textContent=a==="male"?"👨":a==="female"?"👩":"👤"}const s=document.querySelector('[data-person="B"] .person-avatar');if(s){const a=this.formData.personB.gender;s.textContent=a==="male"?"👨":a==="female"?"👩":"👤"}}validateForm(){const t=document.getElementById("name")?.value.trim(),e=document.getElementById("birthDate")?.value,s=this.currentStep===1?this.formData.personA.gender:this.formData.personB.gender,a=t&&e&&s;console.log("validateForm:",{name:t,birthDate:e,gender:s,isValid:a,step:this.currentStep});const n=document.querySelector('[data-action="next"]');return n&&(n.disabled=!a),this.updateCurrentPersonCard(t,e,s),a&&this.autoNavigateNext(),a}autoNavigateNext(){this.autoNavTimer&&clearTimeout(this.autoNavTimer),this.autoNavTimer=setTimeout(()=>{const t=document.getElementById("name")?.value.trim(),e=document.getElementById("birthDate")?.value,s=this.currentStep===1?this.formData.personA.gender:this.formData.personB.gender;if(t&&e&&s){const a=e?T(e):"",n=this.currentStep===1?"personA":"personB";this.formData[n].name=t,this.formData[n].birthDate=e,this.formData[n].lunarDate=a;const o=this.currentStep===1?"personB":"personA",r=this.formData[o],l=r.name&&r.birthDate&&r.gender;this.currentStep===1&&!l&&(this.currentStep=2,this.rerender())}},500)}updateCurrentPersonCard(t,e,s){const a=this.currentStep===1?"A":"B",n=document.querySelector(`[data-person="${a}"]`);if(!n)return;const o=n.querySelector(".person-avatar");o&&(o.textContent=s==="male"?"👨":s==="female"?"👩":"👤");const r=n.querySelector(".person-card__name");r&&(r.textContent=t||(a==="A"?"甲方":"乙方"));const l=n.querySelector(".person-card__date");l&&(l.textContent=e||"未填写");const d=n.querySelector(".person-card__lunar");if(e){const p=T(e);if(d)d.textContent=p;else{const h=document.createElement("p");h.className="person-card__lunar",h.textContent=p,n.appendChild(h)}}else d&&d.remove();const u=n.querySelector(".badge");if(u){const p=t&&e&&s;u.className=`badge ${p?"badge--success":"badge--secondary"}`,u.textContent=p?"已填写":"待填写"}}updateLunarDate(t){const e=document.getElementById("lunar-date"),s=e?.querySelector(".lunar-text");if(!(!e||!s))if(t){const a=T(t);s.textContent=`农历：${a}`,e.style.display="flex"}else e.style.display="none"}handleNext(){if(console.log("handleNext 被调用"),!this.validateForm()){console.log("表单验证未通过，返回");return}const t=document.getElementById("name").value.trim(),e=document.getElementById("birthDate").value,s=e?T(e):"";console.log("表单数据:",{name:t,birthDate:e,lunarDate:s}),this.currentStep===1?(this.formData.personA.name=t,this.formData.personA.birthDate=e,this.formData.personA.lunarDate=s,this.currentStep=2,this.rerender()):(this.formData.personB.name=t,this.formData.personB.birthDate=e,this.formData.personB.lunarDate=s,console.log("准备提交测试，跳转到结果页"),this.submitTest())}goBackStep(){this.currentStep===2&&(this.saveCurrentFormData(),this.currentStep=1,this.rerender())}saveCurrentFormData(){const t=document.getElementById("name")?.value.trim()||"",e=document.getElementById("birthDate")?.value||"",s=e?T(e):"",a=this.currentStep===1?"personA":"personB";this.formData[a].name=t,this.formData[a].birthDate=e,this.formData[a].lunarDate=s}switchToPerson(t){const e=t==="A"?1:2;e!==this.currentStep&&(this.saveCurrentFormData(),this.currentStep=e,this.rerender())}rerender(){const t=document.getElementById("app"),e=document.querySelector(".form-section");e&&e.classList.add("fade-out"),setTimeout(()=>{t.innerHTML=this.render(),this.attachEvents();const s=this.currentStep===1?this.formData.personA:this.formData.personB;if(s.name&&(document.getElementById("name").value=s.name),s.birthDate&&(document.getElementById("birthDate").value=s.birthDate,this.updateLunarDate(s.birthDate)),s.gender)this.selectGender(s.gender);else if(this.currentStep===2&&!this.formData.personB.gender){const n=this.formData.personA.gender==="male"?"female":"male";this.selectGender(n)}this.validateForm();const a=document.querySelector(".form-section");a&&a.classList.add("fade-in")},150)}submitTest(){console.log("submitTest 被调用");const t={type:this.matchType.id,method:"birthday",personA:{name:this.formData.personA.name,gender:this.formData.personA.gender==="male"?"男":"女",birthDate:this.formData.personA.birthDate},personB:{name:this.formData.personB.name,gender:this.formData.personB.gender==="male"?"男":"女",birthDate:this.formData.personB.birthDate},timestamp:Date.now()};console.log("测试数据:",JSON.stringify(t)),window.appState.set("currentTest",t),console.log("准备跳转到 /result/birthday"),window.router.navigate("/result/birthday")}}const pt=["综合","健康类","事业类","财运类","感情类","投资类","学业类","其他类"],ht={健康类:["疾病什么时候能痊愈","明年身体健康状况","什么时候能怀孕","亲人病了，这个病能好吗","这个病适合保守治疗还是做手术","这个病最长还能活多久"],事业类:["升职机遇","现在适合创业吗","现在适合换工作吗","怎么选择工作方向","跟人合作是否有利","投资新生意是否有利","入职新公司是否有利","我能顺利通过面试吗","单位有人故意为难怎么办","目前推进的项目会顺利吗","未来三个月，我会遇到新的工作机会吗","现在面试的公司怎么选择"],财运类:["最近三个月财运怎么样","未来一年财运怎样","什么时候有财运"],感情类:["明年桃花运怎么样","算和TA是否合适在一起","最近会不会遇到烂桃花","我和TA会走到一起吗","我和TA感情不好，是不是不适合","我和TA2026年是不是感情会更好","下一次遇到正缘是什么时候","A和B哪个更适合在一起","要谈几个男/女朋友才会遇到适合结婚的人","未来三个月，我是否会遇到新的桃花","我和TA异地恋，会有结果吗","现在遇到的人会是我的正缘吗","我和TA能复合吗","家人反对该怎么办"],投资类:["近一个月A股走势","近期适不适合投资","什么时候投资有财运","某只股票近一个月走势","某行业能投资吗"],学业类:["本次考试能否顺利","适合学什么专业","适合考哪里的大学","能否考上重点学校","适合往哪个方向发展","小孩学习不好，怎么办","应该选文科还是理科","适合什么类型课外兴趣班","学校A和学校B去哪个更好"],综合:["明天会怎么样","明年事业、财运","明年整体情况","2026年会不会发财","2026年会不会遇到合适的人","最近特别不顺该怎么办","下周会怎么样"],其他类:["明天适合出远门吗（确定位置的地方）","近期哪天适合出远门（确定位置的地方）","近期哪天去办事比较顺利（确定某一件事）","明天穿什么颜色衣服会有好运","近期我如何处理和家人的关系","怎么避小人","适合住哪个位置的房子/A和B小区，哪个更适合"]},mt={综合:"nianyun",健康类:"jiankang",事业类:"shiye",财运类:"caiyun",感情类:"ganqing",投资类:"gushi",学业类:"shengxue",其他类:"qita"},M="以上问题均不符合，自由问题输入";class gt{constructor(t){if(this.matchType=v(t.type),this.selectedCategoryIndex=0,this.categories=pt,this.categoryQuestions=ht,this.categoryRuleMap=mt,this.currentQuestions=[],this.selectedQuestionIndex=-1,this.selectedQuestion="",this.showFreeInput=!1,this.freeInputQuestion="",this.questionCategory="",this.questionType="",this.showGenderModal=!1,this.selectedGender=null,!this.matchType){window.router.navigate("/");return}this.updateQuestionList(this.selectedCategoryIndex)}updateQuestionList(t){const e=this.categories[t],s=this.categoryQuestions[e]||[];this.currentQuestions=[...s,M],this.selectedQuestionIndex=-1,this.selectedQuestion="",this.showFreeInput=!1,this.freeInputQuestion=""}saveQuestionToGlobal(t){const e=this.selectedCategoryIndex,s=this.categories[e],a=this.categoryRuleMap[s]||"nianyun";this.selectedQuestion=t,this.questionCategory=s,this.questionType=a,window.appState&&(window.appState.set("selectedQuestion",t),window.appState.set("questionCategory",s),window.appState.set("questionType",a)),console.log("[问事] 选择问题:",t),console.log("[问事] 问题分类:",s),console.log("[问事] 规则类型:",a)}render(){return this.matchType?`
      <div class="page tarot-question-page">
        ${g({title:"",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${x(1,5,{showText:!1,showSteps:!0,stepLabel:""})}
            </div>

            <!-- 页面标题 -->
            <section class="question-header animate-fade-in-up">
              <h1 class="question-title">你想问什么呢？</h1>
              <p class="question-subtitle">无论大小，任何问题都可以</p>
            </section>

            <!-- 分类标签 -->
            <section class="category-tags animate-fade-in-up animate-delay-100">
              ${this.categories.map((t,e)=>`
                <button class="category-tag ${e===this.selectedCategoryIndex?"active":""}" 
                        data-category-index="${e}">
                  ${t}
                </button>
              `).join("")}
            </section>

            <!-- 问题列表 -->
            <section class="question-list animate-fade-in-up animate-delay-200">
              ${this.renderQuestionList()}
            </section>

            <!-- 提示区域 -->
            <section class="question-tip animate-fade-in-up animate-delay-300">
              <div class="tip-card">
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                  <p class="tip-highlight">每次问一个准确的问题会测算更准</p>
                  ${this.showFreeInput?`
                  <div class="custom-input-wrapper">
                    <input type="text" 
                           class="custom-question-input" 
                           placeholder="请输入你想问的问题..."
                           value="${this.freeInputQuestion}"
                           maxlength="100">
                  </div>
                  `:""}
                </div>
              </div>
            </section>

            <!-- 性别选择弹框 -->
            <div class="gender-modal ${this.showGenderModal?"show":""}" id="genderModal">
              <div class="gender-modal__overlay"></div>
              <div class="gender-modal__content">
                <h3 class="gender-modal__title">请确认您的性别</h3>
                <p class="gender-modal__subtitle">性别信息将帮助更准确解读结果</p>
                <div class="gender-modal__options">
                  <div class="gender-option ${this.selectedGender==="male"?"selected":""}" data-gender="male">
                    <div class="gender-option__avatar gender-option__avatar--male">
                      <span class="gender-avatar-icon">👨</span>
                    </div>
                    <span class="gender-option__label">男</span>
                  </div>
                  <div class="gender-option ${this.selectedGender==="female"?"selected":""}" data-gender="female">
                    <div class="gender-option__avatar gender-option__avatar--female">
                      <span class="gender-avatar-icon">👩</span>
                    </div>
                    <span class="gender-option__label">女</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部按钮区域 -->
            <section class="question-footer animate-fade-in-up animate-delay-400">
              <button class="btn btn--primary btn--full btn--lg submit-btn ${!this.selectedQuestion&&!this.freeInputQuestion?"disabled":""}" 
                      ${!this.selectedQuestion&&!this.freeInputQuestion?"disabled":""}
                      id="submitBtn">
                ${this.getSubmitButtonText()}
              </button>
              <p class="disclaimer">本应用基于传统文化体验，仅供娱乐参考，不作为任何决策依据</p>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `:""}renderQuestionList(){return this.currentQuestions.map((t,e)=>{const s=t===M,a=this.selectedQuestionIndex===e;return`
              <div class="question-item ${a?"selected":""} ${s?"free-input-option":""}" 
                   data-question-index="${e}">
                <span class="question-text">${t}</span>
                ${a?'<span class="question-check">✓</span>':""}
              </div>
            `}).join("")}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()}),document.querySelectorAll(".category-tag").forEach(s=>{s.addEventListener("click",()=>{const a=parseInt(s.dataset.categoryIndex);this.onCategoryChange(a)})}),this.attachQuestionEvents(),this.attachFreeInputEvents();const e=document.querySelector(".submit-btn");e&&e.addEventListener("click",()=>{this.handleSubmit()}),this.attachGenderModalEvents()}attachGenderModalEvents(){document.querySelectorAll(".gender-option").forEach(e=>{e.addEventListener("click",()=>{const s=e.dataset.gender;this.handleGenderSelect(s)})});const t=document.querySelector(".gender-modal__overlay");t&&t.addEventListener("click",()=>{this.hideGenderModal()})}attachQuestionEvents(){document.querySelectorAll(".question-item").forEach(t=>{t.addEventListener("click",()=>{const e=parseInt(t.dataset.questionIndex);this.onQuestionChange(e)})})}attachFreeInputEvents(){const t=document.querySelector(".custom-question-input");t&&t.addEventListener("input",e=>{this.onFreeInputChange(e.target.value)})}onCategoryChange(t){this.selectedCategoryIndex=t,this.updateQuestionList(t),document.querySelectorAll(".category-tag").forEach((e,s)=>{e.classList.toggle("active",s===t)}),this.updateQuestionListUI(),this.updateSubmitButton()}onQuestionChange(t){const e=this.currentQuestions[t],s=e===M;this.selectedQuestionIndex=t,this.showFreeInput=s,s?this.selectedQuestion="":(this.selectedQuestion=e,this.freeInputQuestion="",this.saveQuestionToGlobal(e)),document.querySelectorAll(".question-item").forEach((a,n)=>{const o=n===t;a.classList.toggle("selected",o);let r=a.querySelector(".question-check");o&&!r?(r=document.createElement("span"),r.className="question-check",r.textContent="✓",a.appendChild(r)):!o&&r&&r.remove()}),this.updateFreeInputUI(),this.updateSubmitButton()}onFreeInputChange(t){this.freeInputQuestion=t,this.selectedQuestion=t,t&&this.saveQuestionToGlobal(t),this.updateSubmitButton()}updateFreeInputUI(){const t=document.querySelector(".tip-content");if(t){let e=t.querySelector(".custom-input-wrapper");if(this.showFreeInput&&!e){e=document.createElement("div"),e.className="custom-input-wrapper",e.innerHTML=`
                    <input type="text" 
                           class="custom-question-input" 
                           placeholder="请输入你想问的问题..."
                           value="${this.freeInputQuestion}"
                           maxlength="100">
                `,t.appendChild(e),this.attachFreeInputEvents();const s=e.querySelector(".custom-question-input");s&&s.focus()}else!this.showFreeInput&&e&&e.remove()}}updateQuestionListUI(){const t=document.querySelector(".question-list");t&&(t.innerHTML=this.renderQuestionList(),this.attachQuestionEvents()),this.updateFreeInputUI()}handleSubmit(){const t=this.freeInputQuestion||this.selectedQuestion;if(!t||!t.trim()){window.showToast("请先选择或输入问题","error");return}if(this.showGenderModal&&this.selectedGender){this.submitWithGender();return}this.showGenderModalFn()}showGenderModalFn(){this.showGenderModal=!0;const t=document.getElementById("genderModal");t&&t.classList.add("show"),this.updateSubmitButton()}hideGenderModal(){this.showGenderModal=!1,this.selectedGender=null;const t=document.getElementById("genderModal");t&&t.classList.remove("show"),document.querySelectorAll(".gender-option").forEach(e=>{e.classList.remove("selected")}),this.updateSubmitButton()}handleGenderSelect(t){this.selectedGender=t,document.querySelectorAll(".gender-option").forEach(e=>{e.classList.toggle("selected",e.dataset.gender===t)}),setTimeout(()=>{this.submitWithGender()},500)}getSubmitButtonText(){return this.selectedQuestion||this.freeInputQuestion?"下一步":"请选择问题"}updateSubmitButton(){const t=document.querySelector(".submit-btn");if(t){const e=this.selectedQuestion||this.freeInputQuestion,s=this.showGenderModal?e&&this.selectedGender:e;t.disabled=!s,t.classList.toggle("disabled",!s),t.textContent=this.getSubmitButtonText()}}submitWithGender(){const t=this.freeInputQuestion||this.selectedQuestion;this.saveQuestionToGlobal(t.trim()),window.appState&&(window.appState.set("tarotQuestion",t),window.appState.set("tarotCategory",this.categories[this.selectedCategoryIndex]),window.appState.set("tarotGender",this.selectedGender),window.appState.set("selectedQuestion",t),window.appState.set("questionCategory",this.questionCategory),window.appState.set("questionType",this.questionType));const e=new Date,s=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")} ${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}`;console.log(`[${s}] 提交: 问题=${t}, 分类=${this.questionCategory}, 规则类型=${this.questionType}, 性别=${this.selectedGender}`),window.router.navigate(`/test/${this.matchType.id}/tarot/taboo`)}}const vt=[{icon:"🚫",title:"只能算自己的事",description:"结果只反映提问者本人的气场",examples:[{text:"帮朋友算",allowed:!1},{text:"算自己的事",allowed:!0}]},{icon:"👨‍👩‍👧",title:"至亲除外",description:"可帮父母/子女算，需真心关切",examples:[{text:"帮家人算",allowed:!0},{text:"帮同事算",allowed:!1}]},{icon:"⚖️",title:"不算不正之事",description:"违背道德的事不会灵验",examples:[{text:"婚外情",allowed:!1},{text:"坑害他人",allowed:!1}]},{icon:"🚨",title:"不算违法之事",description:"违法犯罪天理不容",examples:[{text:"赌博",allowed:!1},{text:"非法牟利",allowed:!1}]}];class ft{constructor(t){if(this.matchType=v(t.type),!this.matchType){window.router.navigate("/");return}}render(){return this.matchType?`
      <div class="page tarot-taboo-page">
        ${g({title:"",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${x(2,5,{showText:!1,showSteps:!0,stepLabel:""})}
            </div>

            <!-- 页面标题 -->
            <section class="taboo-header animate-fade-in-up">
              <div class="taboo-title-icon">⚠️</div>
              <h1 class="taboo-title">问事禁忌</h1>
              <p class="taboo-subtitle">请仔细阅读，违反禁忌会影响准确性</p>
            </section>

            <!-- 禁忌规则列表 -->
            <section class="taboo-rules animate-fade-in-up animate-delay-100">
              ${vt.map((t,e)=>`
                <div class="taboo-card animate-fade-in-up animate-delay-${(e+1)*100}">
                  <div class="taboo-card__header">
                    <span class="taboo-card__icon">${t.icon}</span>
                    <h3 class="taboo-card__title">${t.title}</h3>
                  </div>
                  <p class="taboo-card__description">${t.description}</p>
                  <div class="taboo-card__examples">
                    ${t.examples.map(s=>`
                      <span class="taboo-example ${s.allowed?"taboo-example--allowed":"taboo-example--forbidden"}">
                        <span class="taboo-example__icon">${s.allowed?"✅":"❌"}</span>
                        <span class="taboo-example__text">${s.text}</span>
                      </span>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </section>

            <!-- 底部按钮区域 -->
            <section class="taboo-footer animate-fade-in-up animate-delay-500">
              <div class="taboo-footer__buttons">
                <button class="btn btn--secondary btn--lg prev-btn" id="prevBtn">
                  上一步
                </button>
                <button class="btn btn--primary btn--lg next-btn" id="nextBtn">
                  我已了解，下一步
                </button>
              </div>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `:""}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()});const e=document.getElementById("prevBtn");e&&e.addEventListener("click",()=>{window.router.back()});const s=document.getElementById("nextBtn");s&&s.addEventListener("click",()=>{this.handleNext()})}handleNext(){const t=new Date,e=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;console.log(`[${e}] 用户已阅读问事禁忌，进入下一步`),window.router.navigate(`/test/${this.matchType.id}/tarot/principle`)}}const bt=[{icon:"🙏",title:"心诚则灵",description:"抱着敬畏之心提问，结果才准确",tips:["静心默念所问之事"]},{icon:"🎯",title:"专注才准",description:"三心二意会干扰结果准确性",tips:["找安静环境，排除杂念"]},{icon:"🤝",title:"动机纯正",description:"为趋吉避凶，非满足私欲",tips:["明确真实目的"]}];class yt{constructor(t){if(this.matchType=v(t.type),!this.matchType){window.router.navigate("/");return}}render(){return this.matchType?`
      <div class="page tarot-principle-page">
        ${g({title:"",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${x(3,5,{showText:!1,showSteps:!0,stepLabel:""})}
            </div>

            <!-- 页面标题 -->
            <section class="principle-header animate-fade-in-up">
              <div class="principle-title-icon">💬</div>
              <h1 class="principle-title">问事原则</h1>
              <p class="principle-subtitle">遵循原则，方能得到准确指引</p>
            </section>

            <!-- 原则列表 -->
            <section class="principle-rules animate-fade-in-up animate-delay-100">
              ${bt.map((t,e)=>`
                <div class="principle-card animate-fade-in-up animate-delay-${(e+1)*100}">
                  <div class="principle-card__header">
                    <span class="principle-card__icon">${t.icon}</span>
                    <h3 class="principle-card__title">${t.title}</h3>
                  </div>
                  <p class="principle-card__description">${t.description}</p>
                  <div class="principle-card__tips">
                    ${t.tips.map(s=>`
                      <div class="principle-tip">
                        <span class="principle-tip__dot">·</span>
                        <span class="principle-tip__text">${s}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </section>

            <!-- 底部按钮区域 -->
            <section class="principle-footer animate-fade-in-up animate-delay-400">
              <div class="principle-footer__buttons">
                <button class="btn btn--secondary btn--lg prev-btn" id="prevBtn">
                  上一步
                </button>
                <button class="btn btn--primary btn--lg next-btn" id="nextBtn">
                  开始问事 🔮
                </button>
              </div>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `:""}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()});const e=document.getElementById("prevBtn");e&&e.addEventListener("click",()=>{window.router.back()});const s=document.getElementById("nextBtn");s&&s.addEventListener("click",()=>{this.handleNext()})}handleNext(){const t=new Date,e=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;console.log(`[${e}] 用户已阅读问事原则，开始问事`),window.router.navigate(`/test/${this.matchType.id}/tarot/shuffle`)}}const C=80,wt=6,f=3,E=2,xt=["初爻","二爻","三爻","四爻","五爻","上爻"];function $t(i){const t=Math.random()>.5?"背":"字",e=Math.random()>.5?"背":"字",s=Math.random()>.5?"背":"字",a=[t,e,s],n=a.filter(p=>p==="背").length;let o,r,l,d;switch(n){case 3:o=1,r=!0,l="老阳（三背）",d="○";break;case 2:o=1,r=!1,l="少阳（二背一字）",d="⚊";break;case 1:o=0,r=!1,l="少阴（一背二字）",d="⚋";break;default:o=0,r=!0,l="老阴（三字）",d="×";break}const u=xt[i-1];return{value:o,isMoving:r,name:l,symbol:d,position:u,step:i,backCount:n,coins:a}}class St{constructor(t){if(this.matchType=v(t.type),this.isShuffling=!1,this.shuffleCount=0,this.hasShuffled=!1,this.cards=[],this.drawRound=0,this.selectedSlots=[],this.showDrawModal=!1,this.modalCards=[],this.modalSelectedCards=[],this.availableCardIds=[],this.yaos=[],this.yaoHistory=[],this.currentStep=0,!this.matchType){window.router.navigate("/");return}this.initCards(),this.initAvailableCards()}initCards(){this.cards=Array.from({length:C},(t,e)=>{const n=(Math.random()-.5)*180,o=(Math.random()-.5)*200,r=(Math.random()-.5)*90;return{id:e,x:n,y:o,rotation:r,zIndex:Math.floor(Math.random()*C)}})}initAvailableCards(){this.availableCardIds=Array.from({length:C},(t,e)=>e)}render(){if(!this.matchType)return"";const t=this.getButtonText(),e=this.isShuffling;return`
      <div class="page tarot-shuffle-page">
        ${g({title:"",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${x(4,5,{showText:!1,showSteps:!0,stepLabel:""})}
            </div>

            <!-- 页面标题 -->
            <section class="shuffle-header animate-fade-in-up">
              <h1 class="shuffle-title">洗牌</h1>
              <p class="shuffle-subtitle">点击牌堆，洗牌一次，可重复操作</p>
            </section>

            <!-- 卡牌堆叠区域（上移缩小） -->
            <section class="shuffle-cards-container shuffle-cards-container--compact">
              <div class="shuffle-cards shuffle-cards--small" id="shuffleCards">
                ${this.renderCards()}
              </div>
            </section>

            <!-- 放牌槽框区域（两行3列） -->
            <section class="card-slots-container animate-fade-in-up animate-delay-200">
              <div class="card-slots-grid">
                ${this.renderCardSlots()}
              </div>
            </section>

            <!-- 洗牌/抽牌按钮 -->
            <section class="shuffle-actions animate-fade-in-up animate-delay-300">
              <button class="btn btn--primary btn--full btn--lg shuffle-btn ${e?"disabled":""}" 
                      id="shuffleBtn" ${e?"disabled":""}>
                ${t}
              </button>
            </section>

            <!-- 下一步提示 -->
            <section class="shuffle-next-hint">
              <button class="shuffle-next-text" id="nextBtn">下一步</button>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>

        <!-- 抽牌弹框 -->
        ${this.renderDrawModal()}
      </div>
    `}getButtonText(){return this.isShuffling?"洗牌中...":this.hasShuffled?this.selectedSlots.length>=f*E?"已完成抽牌":"请抽牌":"洗牌"}renderCards(){return this.cards.map(t=>`
            <div class="shuffle-card" 
                 data-card-id="${t.id}"
                 style="
                   transform: translate(${t.x}px, ${t.y}px) rotate(${t.rotation}deg);
                   z-index: ${t.zIndex};
                 ">
              <div class="shuffle-card__inner">
                <div class="shuffle-card__pattern">
                  <div class="card-circle"></div>
                  <div class="card-lines"></div>
                </div>
              </div>
            </div>
        `).join("")}renderCardSlots(){const t=[];for(let e=0;e<f*E;e++){const s=this.selectedSlots[e]!==void 0;t.push(`
                <div class="card-slot ${s?"card-slot--filled":""}" data-slot-index="${e}">
                    ${s?`
                        <div class="card-slot__card">
                            <div class="shuffle-card__inner">
                                <div class="shuffle-card__pattern">
                                    <div class="card-circle"></div>
                                    <div class="card-lines"></div>
                                </div>
                            </div>
                        </div>
                    `:`
                        <div class="card-slot__empty">
                            <span class="card-slot__number">${e+1}</span>
                        </div>
                    `}
                </div>
            `)}return t.join("")}renderDrawModal(){if(!this.showDrawModal)return'<div class="draw-modal" id="drawModal"></div>';const t=this.modalSelectedCards.length,e=t===f;return`
            <div class="draw-modal show" id="drawModal">
                <div class="draw-modal__overlay"></div>
                <div class="draw-modal__content">
                    <h3 class="draw-modal__title">抽牌</h3>
                    <div class="draw-modal__cards">
                        ${this.modalCards.map((s,a)=>{const n=this.modalSelectedCards.includes(s);return`
                                <div class="draw-modal__card ${n?"selected":""}" 
                                     data-modal-card-id="${s}" data-modal-index="${a}">
                                    <div class="shuffle-card__inner">
                                        <div class="shuffle-card__pattern">
                                            <div class="card-circle"></div>
                                            <div class="card-lines"></div>
                                        </div>
                                    </div>
                                    ${n?'<div class="draw-modal__card-check">✓</div>':""}
                                </div>
                            `}).join("")}
                    </div>
                    <p class="draw-modal__hint">请随机选取三张 (${t}/${f})</p>
                    <button class="btn btn--primary draw-modal__confirm ${e?"":"disabled"}" 
                            id="confirmDrawBtn" ${e?"":"disabled"}>
                        确定
                    </button>
                </div>
            </div>
        `}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()});const e=document.getElementById("shuffleBtn");e&&e.addEventListener("click",()=>{this.handleButtonClick()});const s=document.getElementById("shuffleCards");s&&(s.addEventListener("click",()=>{this.handleButtonClick()}),s.style.cursor="pointer");const a=document.getElementById("nextBtn");a&&a.addEventListener("click",()=>{this.handleNext()}),this.attachModalEvents()}attachModalEvents(){document.querySelectorAll(".draw-modal__card").forEach(e=>{e.addEventListener("click",()=>{const s=parseInt(e.dataset.modalCardId);this.handleModalCardSelect(s)})});const t=document.getElementById("confirmDrawBtn");t&&t.addEventListener("click",()=>{this.handleConfirmDraw()})}handleButtonClick(){this.isShuffling||(this.hasShuffled?this.selectedSlots.length<f*E&&this.openDrawModal():this.handleShuffle())}handleShuffle(){if(this.isShuffling)return;this.isShuffling=!0,this.shuffleCount++;const t=document.getElementById("shuffleBtn");t&&(t.disabled=!0,t.classList.add("disabled"),t.textContent="洗牌中..."),this.performShuffleAnimation()}performShuffleAnimation(){const e=[{duration:600,speed:2},{duration:400,speed:1}];let s=0,a=0;const n=document.querySelectorAll(".shuffle-card"),o=()=>{if(s>=1e3){this.applyBounceEffect(n);return}let r=0;for(let u=0;u<=a;u++)r+=e[u].duration;s>=r&&a<e.length-1&&a++;const d=80/e[a].speed;this.randomizeCards(n),s+=d,setTimeout(()=>requestAnimationFrame(o),d)};o()}randomizeCards(t){t.forEach((e,s)=>{const o=(Math.random()-.5)*170,r=(Math.random()-.5)*190,l=(Math.random()-.5)*90,d=Math.floor(Math.random()*C);e.style.transform=`translate(${o}px, ${r}px) rotate(${l}deg)`,e.style.zIndex=d,this.cards[s].x=o,this.cards[s].y=r,this.cards[s].rotation=l,this.cards[s].zIndex=d})}applyBounceEffect(t){t.forEach((e,s)=>{const a=this.cards[s].x,n=this.cards[s].y,o=this.cards[s].rotation;e.style.transition="transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",e.style.transform=`translate(${a*1.15}px, ${n*1.15}px) rotate(${o*1.1}deg)`,setTimeout(()=>{const d=(Math.random()-.5)*180,u=(Math.random()-.5)*200,p=(Math.random()-.5)*90,h=Math.floor(Math.random()*C);e.style.transition="transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",e.style.transform=`translate(${d}px, ${u}px) rotate(${p}deg)`,e.style.zIndex=h,this.cards[s].x=d,this.cards[s].y=u,this.cards[s].rotation=p,this.cards[s].zIndex=h},200),setTimeout(()=>{e.style.transition=""},700)}),setTimeout(()=>{this.isShuffling=!1,this.hasShuffled=!0,this.updateButtonState()},700)}updateButtonState(){const t=document.getElementById("shuffleBtn");if(t){const e=this.selectedSlots.length>=f*E;t.disabled=e,t.classList.toggle("disabled",e),t.textContent=this.getButtonText()}}openDrawModal(){this.modalCards=this.getRandomCards(wt),this.modalSelectedCards=[],this.showDrawModal=!0,this.drawRound++,this.updateModalDOM()}getRandomCards(t){return[...this.availableCardIds].sort(()=>Math.random()-.5).slice(0,t)}updateModalDOM(){const t=document.getElementById("drawModal");t&&(t.outerHTML=this.renderDrawModal(),this.attachModalEvents())}handleModalCardSelect(t){const e=this.modalSelectedCards.indexOf(t);e>-1?this.modalSelectedCards.splice(e,1):this.modalSelectedCards.length<f&&this.modalSelectedCards.push(t),this.updateModalUI()}updateModalUI(){document.querySelectorAll(".draw-modal__card").forEach(s=>{const a=parseInt(s.dataset.modalCardId),n=this.modalSelectedCards.includes(a);s.classList.toggle("selected",n);let o=s.querySelector(".draw-modal__card-check");n&&!o?(o=document.createElement("div"),o.className="draw-modal__card-check",o.textContent="✓",s.appendChild(o)):!n&&o&&o.remove()});const t=document.querySelector(".draw-modal__hint");t&&(t.textContent=`请随机选取三张 (${this.modalSelectedCards.length}/${f})`);const e=document.getElementById("confirmDrawBtn");if(e){const s=this.modalSelectedCards.length===f;e.disabled=!s,e.classList.toggle("disabled",!s)}}handleConfirmDraw(){this.modalSelectedCards.length===f&&(this.modalSelectedCards.forEach(t=>{this.selectedSlots.push(t),this.currentStep++;const e=$t(this.currentStep),s={value:e.value,isMoving:e.isMoving,name:e.name,symbol:e.symbol,position:e.position};this.yaos.push(s);const a={step:e.step,position:e.position,name:e.name,symbol:e.symbol,isMoving:e.isMoving,backCount:e.backCount,cardId:t};this.yaoHistory.push(a);const n=this.availableCardIds.indexOf(t);n>-1&&this.availableCardIds.splice(n,1),console.log(`[抽牌] ${e.position}：${e.name} (${e.symbol})`)}),this.showDrawModal=!1,this.modalCards=[],this.modalSelectedCards=[],this.updateSlotsUI(),this.updateModalDOM(),this.updateButtonState(),console.log(`[抽牌] 第${this.drawRound}轮完成，已选${this.selectedSlots.length}张牌，当前爻数据:`,this.yaos))}updateSlotsUI(){const t=document.querySelector(".card-slots-grid");t&&(t.innerHTML=this.renderCardSlots())}handleNext(){if(this.selectedSlots.length<f*E){this.hasShuffled?window.showToast&&window.showToast("请抽完牌再继续","warning"):window.showToast&&window.showToast("请先洗牌","warning");return}window.appState&&(window.appState.set("selectedCards",this.selectedSlots),window.appState.set("yaos",this.yaos),window.appState.set("yaoHistory",this.yaoHistory));const t=new Date,e=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;console.log(`[${e}] 洗牌${this.shuffleCount}次，抽牌完成`),console.log("[抽牌完成] 六爻数据 yaos:",this.yaos),console.log("[抽牌完成] 爻历史 yaoHistory:",this.yaoHistory),window.router.navigate(`/test/${this.matchType.id}/tarot/pick`)}}const L=[{id:1,label:"目标",row:1},{id:2,label:"动力",row:1},{id:3,label:"障碍",row:1},{id:4,label:"资源",row:2},{id:5,label:"支持",row:2},{id:6,label:"结果",row:2}];class _t{constructor(t){if(this.matchType=v(t.type),!this.matchType){window.router.navigate("/");return}const e=window.appState.selectedTarotCards||[];this.selectedCards=[null,null,null,null,null,null],e.forEach((s,a)=>{s&&a<6&&(this.selectedCards[a]=s)}),this.currentPickIndex=this.selectedCards.findIndex(s=>s===null),this.currentPickIndex===-1&&(this.currentPickIndex=6)}render(){if(!this.matchType)return"";const t=this.currentPickIndex>=6;return L[this.currentPickIndex],`
      <div class="page tarot-pick-page">
        ${g({title:"",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${x(6,6,{showText:!1,showSteps:!0,stepLabel:""})}
            </div>

            <!-- 页面标题 -->
            <section class="pick-header animate-fade-in-up">
              <p class="pick-step">${t?"选牌完成":`抽第 ${this.currentPickIndex+1} 张牌`}</p>
              <h1 class="pick-title">未来一月运势的核心方向</h1>
            </section>

            <!-- 卡槽区域 -->
            <section class="pick-slots animate-fade-in-up animate-delay-100">
              <!-- 第一行：3个槽位 -->
              <div class="pick-slots-row">
                ${L.filter(e=>e.row===1).map((e,s)=>this.renderSlot(e,s)).join("")}
              </div>
              <!-- 第二行：3个槽位 -->
              <div class="pick-slots-row">
                ${L.filter(e=>e.row===2).map((e,s)=>this.renderSlot(e,s+3)).join("")}
              </div>
            </section>

            <!-- 底部按钮 -->
            <section class="pick-footer animate-fade-in-up animate-delay-200">
              <button class="btn btn--primary btn--full btn--lg pick-btn" id="pickBtn">
                ${t?"查看结果":"点击选牌"}
              </button>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `}renderSlot(t,e){const s=e===this.currentPickIndex,a=this.selectedCards[e]!==null,n=e>this.currentPickIndex;return`
            <div class="pick-slot ${s?"pick-slot--active":""} ${a?"pick-slot--filled":""} ${n?"pick-slot--pending":""}"
                 data-slot-index="${e}">
                <div class="pick-slot__card">
                    ${a?'<div class="pick-slot__card-back"></div>':""}
                </div>
                <span class="pick-slot__label">${t.label}</span>
            </div>
        `}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()});const e=document.getElementById("pickBtn");e&&e.addEventListener("click",()=>{this.currentPickIndex>=6?this.handleComplete():this.handlePick()})}handlePick(){this.currentPickIndex>=6||window.router.navigate(`/test/${this.matchType.id}/tarot/select/${this.currentPickIndex}`)}handleComplete(){const t=new Date,e=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;console.log(`[${e}] 抽牌完成，选中的牌:`,this.selectedCards),window.router.navigate(`/test/${this.matchType.id}/tarot/result-loading?question=未来一月运势的核心方向`)}}class Tt{constructor(t){if(this.matchType=v(t.type),this.currentSlotIndex=parseInt(t.slot)||0,this.rotation=0,this.isDragging=!1,this.startX=0,this.startY=0,this.lastRotation=0,this.velocity=0,this.animationId=null,this.slotLabels=["目标","动力","障碍","资源","支持","结果"],this.totalCards=78,!this.matchType){window.router.navigate("/");return}}render(){return this.matchType?(this.slotLabels[this.currentSlotIndex],`
      <div class="page tarot-card-selection-page">
        ${g({title:"",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${x(6,6,{showText:!1,showSteps:!0,stepLabel:""})}
            </div>

            <!-- 页面标题 -->
            <section class="card-selection-header animate-fade-in-up">
              <p class="card-selection-step">抽第 ${this.currentSlotIndex+1} 张牌</p>
              <h1 class="card-selection-title">未来一月运势的核心方向</h1>
              <p class="card-selection-subtitle">手指可放大牌轮，滑动牌轮，点击选牌</p>
            </section>

            <!-- 卡牌轮容器 -->
            <section class="card-wheel-container animate-fade-in-up animate-delay-100">
              <div class="card-wheel-wrapper" id="cardWheelWrapper">
                <div class="card-wheel" id="cardWheel">
                  ${this.renderCards()}
                </div>
              </div>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `):""}renderCards(){const t=[],e=360/this.totalCards;for(let s=0;s<this.totalCards;s++){const a=s*e-90;t.push(`
                <div class="wheel-card" 
                     style="--angle: ${a}deg; --index: ${s};"
                     data-card-id="${s}"
                     data-index="${s}">
                    <div class="wheel-card-inner">
                        <div class="wheel-card-back">
                            <div class="card-pattern"></div>
                            <div class="card-symbol"></div>
                        </div>
                    </div>
                </div>
            `)}return t.join("")}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{this.cleanup(),window.router.back()}),this.initCardWheelEvents()}initCardWheelEvents(){const t=document.getElementById("cardWheelWrapper"),e=document.getElementById("cardWheel");!t||!e||(t.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),t.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),t.addEventListener("touchend",this.handleTouchEnd.bind(this),{passive:!1}),t.addEventListener("mousedown",this.handleMouseDown.bind(this)),document.addEventListener("mousemove",this.handleMouseMove.bind(this)),document.addEventListener("mouseup",this.handleMouseUp.bind(this)),e.addEventListener("click",this.handleCardClick.bind(this)),this.updateWheelTransform())}getAngleFromCenter(t,e){const s=document.getElementById("cardWheelWrapper");if(!s)return 0;const a=s.getBoundingClientRect(),n=a.left+a.width/2,o=a.top+a.height/2;return Math.atan2(e-o,t-n)*(180/Math.PI)}handleTouchStart(t){if(t.touches.length===1){t.preventDefault(),this.isDragging=!0,this.velocity=0,this.cancelAnimation();const e=t.touches[0];this.startX=e.clientX,this.startY=e.clientY,this.lastRotation=this.rotation,this.lastTime=Date.now(),this.lastAngle=this.getAngleFromCenter(e.clientX,e.clientY)}}handleTouchMove(t){if(!this.isDragging||t.touches.length!==1)return;t.preventDefault();const e=t.touches[0],s=this.getAngleFromCenter(e.clientX,e.clientY);let a=s-this.lastAngle;a>180&&(a-=360),a<-180&&(a+=360);const n=Date.now(),o=n-this.lastTime;o>0&&(this.velocity=a/o*16),this.rotation+=a,this.lastAngle=s,this.lastTime=n,this.updateWheelTransform()}handleTouchEnd(){this.isDragging=!1,this.startInertiaAnimation()}handleMouseDown(t){t.preventDefault(),this.isDragging=!0,this.velocity=0,this.cancelAnimation(),this.startX=t.clientX,this.startY=t.clientY,this.lastRotation=this.rotation,this.lastTime=Date.now(),this.lastAngle=this.getAngleFromCenter(t.clientX,t.clientY)}handleMouseMove(t){if(!this.isDragging)return;const e=this.getAngleFromCenter(t.clientX,t.clientY);let s=e-this.lastAngle;s>180&&(s-=360),s<-180&&(s+=360);const a=Date.now(),n=a-this.lastTime;n>0&&(this.velocity=s/n*16),this.rotation+=s,this.lastAngle=e,this.lastTime=a,this.updateWheelTransform()}handleMouseUp(){this.isDragging&&(this.isDragging=!1,this.startInertiaAnimation())}startInertiaAnimation(){const s=()=>{if(Math.abs(this.velocity)<.1){this.velocity=0;return}this.rotation+=this.velocity,this.velocity*=.95,this.updateWheelTransform(),this.animationId=requestAnimationFrame(s)};s()}cancelAnimation(){this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}updateWheelTransform(){const t=document.getElementById("cardWheel");t&&(t.style.transform=`rotate(${this.rotation}deg)`)}handleCardClick(t){if(this.isDragging||Math.abs(this.velocity)>1)return;const e=t.target.closest(".wheel-card");if(!e)return;const s=e.dataset.cardId;console.log(`选择了卡牌 ${s}`),e.classList.add("card-selected"),setTimeout(()=>{this.onCardSelected(parseInt(s))},600)}onCardSelected(t){window.appState.selectedTarotCards||(window.appState.selectedTarotCards=[]),window.appState.selectedTarotCards[this.currentSlotIndex]={id:t,slot:this.currentSlotIndex,label:this.slotLabels[this.currentSlotIndex]},console.log("已选择卡牌:",window.appState.selectedTarotCards),this.cleanup(),window.router.navigate(`/test/${this.matchType.id}/tarot/pick`)}cleanup(){this.cancelAnimation(),document.removeEventListener("mousemove",this.handleMouseMove.bind(this)),document.removeEventListener("mouseup",this.handleMouseUp.bind(this))}}class Ct{constructor(t){if(this.matchType=v(t.type),this.question=decodeURIComponent(t.question||"未来一月运势的核心方向"),this.detail=decodeURIComponent(t.detail||""),this.estimateSeconds=61,this.progress=0,this.timer=null,this.isInterpreting=!1,!this.matchType){window.router.navigate("/");return}}render(){return`
      <div class="page tarot-result-loading-page">
        ${g({title:"解读结果",showBack:!0,showHistory:!1,showProfile:!1})}
        <main class="page-content">
          <div class="app-container">
            <section class="result-question-card animate-fade-in-up">
              <div class="result-question-title">所问事项</div>
              <div class="result-question-main">${this.question}</div>
              <div class="result-question-detail">${this.detail}</div>
            </section>
            <section class="result-loading-card animate-fade-in-up animate-delay-100">
              <div class="result-loading-spinner">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="#E0E0F6" stroke-width="6" fill="none" />
                  <circle cx="24" cy="24" r="20" stroke="#8B7FD8" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="100 100" stroke-dashoffset="${100-this.progress*100}"/>
                </svg>
              </div>
              <div class="result-loading-text">
                <div class="result-loading-main">后台正在解读...</div>
                <div class="result-loading-sub">预计需要 <span class="result-loading-sec">${this.estimateSeconds}</span> 秒</div>
              </div>
              <div class="result-loading-bar">
                <div class="result-loading-bar-inner" style="width: ${this.progress*100}%"></div>
              </div>
            </section>
            <section class="result-btns animate-fade-in-up animate-delay-200">
              <button class="btn btn--outline btn--lg result-btn-restart" id="btnRestart">重新开始</button>
              <button class="btn btn--primary btn--lg result-btn-share" id="btnShare">分享结果</button>
            </section>
            <div class="result-tip">本应用基于传统文化体验，仅供娱乐参考，不作为任何决策依据</div>
          </div>
        </main>
      </div>
    `}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.back()});const e=document.getElementById("btnRestart");e&&e.addEventListener("click",()=>{window.router.navigate("/")});const s=document.getElementById("btnShare");s&&s.addEventListener("click",()=>{window.showToast("分享功能开发中~","default")}),this.startProgress(),this.startInterpret()}async startInterpret(){if(!this.isInterpreting){this.isInterpreting=!0;try{const t=window.appState.selectedTarotCards||[];if(t.length!==6){window.showToast("卡牌数据异常","error"),setTimeout(()=>window.router.back(),1500);return}console.log("[塔罗解读] 开始请求，选中的卡牌:",t);const e=await fetch("/api/tarot/interpret",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:this.question,questionType:"综合",selectedCards:t,userInfo:{gender:window.appState.userGender||"",birthDate:window.appState.userBirthday||""}})});if(console.log("[塔罗解读] 响应状态:",e.status),!e.ok){const n=await e.text();throw console.error("[塔罗解读] 请求失败:",n),new Error(`服务器错误: ${e.status}`)}const s=await e.text();console.log("[塔罗解读] 响应内容:",s);let a;try{a=JSON.parse(s)}catch(n){throw console.error("[塔罗解读] JSON解析失败:",n),new Error("服务器返回格式错误")}if(!a.success)throw new Error(a.error||"解读失败");console.log("[塔罗解读] 解读成功:",a.data),this.timer&&(clearInterval(this.timer),this.timer=null),window.appState.tarotInterpretResult={question:this.question,selectedCards:t,result:a.data.result,professionalVersion:a.data.professionalVersion,simpleVersion:a.data.simpleVersion,recordId:a.data.recordId},setTimeout(()=>{window.router.navigate(`/test/${this.matchType.id}/tarot/result`)},500)}catch(t){console.error("[塔罗解读] 解读失败:",t),this.timer&&(clearInterval(this.timer),this.timer=null),window.showToast(t.message||"解读失败，请稍后重试","error"),setTimeout(()=>{window.router.back()},2e3)}finally{this.isInterpreting=!1}}}startProgress(){this.progress=0,this.estimateSeconds=61;const t=document.querySelector(".result-loading-sec"),e=document.querySelector(".result-loading-bar-inner"),s=document.querySelector(".result-loading-spinner svg circle[stroke-dashoffset]");let a=0;this.timer=setInterval(()=>{a++,this.progress=Math.min(1,a/61),this.estimateSeconds=61-a,t&&(t.textContent=this.estimateSeconds),e&&(e.style.width=this.progress*100+"%"),s&&s.setAttribute("stroke-dashoffset",100-this.progress*100),a>=61&&clearInterval(this.timer)},1e3)}}class Et{constructor(t){if(this.matchType=v(t.type),this.resultData=window.appState.tarotInterpretResult||null,this.showVersion="simple",!this.matchType||!this.resultData){window.router.navigate("/");return}}render(){if(!this.resultData)return"";const{question:t,selectedCards:e,simpleVersion:s,professionalVersion:a}=this.resultData,n=this.showVersion==="simple"?s:a;return`
      <div class="page tarot-result-page">
        ${g({title:"解读结果",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 问题卡片 -->
            <section class="result-question-section animate-fade-in-up">
              <div class="result-question-label">所问事项</div>
              <div class="result-question-text">${t}</div>
            </section>

            <!-- 选中的卡牌 -->
            <section class="result-cards-section animate-fade-in-up animate-delay-100">
              <div class="result-cards-title">选中的牌</div>
              <div class="result-cards-grid">
                ${e.map((o,r)=>`
                  <div class="result-card-item">
                    <div class="result-card-slot">${o.label}</div>
                    <div class="result-card-back"></div>
                  </div>
                `).join("")}
              </div>
            </section>

            <!-- 版本切换 -->
            <section class="result-version-switch animate-fade-in-up animate-delay-150">
              <button class="version-btn ${this.showVersion==="simple"?"version-btn--active":""}" 
                      data-version="simple">
                通俗版
              </button>
              <button class="version-btn ${this.showVersion==="professional"?"version-btn--active":""}" 
                      data-version="professional">
                专业版
              </button>
            </section>

            <!-- 解读内容 -->
            <section class="result-content-section animate-fade-in-up animate-delay-200">
              <div class="result-content-title">
                <span class="result-content-icon">💡</span>
                解读
              </div>
              <div class="result-content-text" id="resultContent">
                ${this.formatContent(n)}
              </div>
            </section>

            <!-- 底部按钮 -->
            <section class="result-actions animate-fade-in-up animate-delay-250">
              <button class="btn btn--outline btn--lg" id="btnRestart">
                重新开始
              </button>
              <button class="btn btn--primary btn--lg" id="btnShare">
                分享结果
              </button>
            </section>

            <div class="result-disclaimer">
              本应用基于传统文化体验，仅供娱乐参考，不作为任何决策依据
            </div>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `}formatContent(t){return t.split(`
`).filter(e=>e.trim()).map(e=>`<p>${e}</p>`).join("")}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.navigate("/")}),document.querySelectorAll(".version-btn").forEach(n=>{n.addEventListener("click",o=>{const r=o.target.dataset.version;this.switchVersion(r)})});const s=document.getElementById("btnRestart");s&&s.addEventListener("click",()=>{delete window.appState.tarotInterpretResult,delete window.appState.selectedTarotCards,window.router.navigate("/")});const a=document.getElementById("btnShare");a&&a.addEventListener("click",()=>{this.handleShare()})}switchVersion(t){if(t===this.showVersion)return;this.showVersion=t,document.querySelectorAll(".version-btn").forEach(s=>{s.dataset.version===t?s.classList.add("version-btn--active"):s.classList.remove("version-btn--active")});const e=document.getElementById("resultContent");if(e){const s=t==="simple"?this.resultData.simpleVersion:this.resultData.professionalVersion;e.classList.add("fade-out"),setTimeout(()=>{e.innerHTML=this.formatContent(s),e.classList.remove("fade-out"),e.classList.add("fade-in"),setTimeout(()=>{e.classList.remove("fade-in")},300)},150)}}handleShare(){const t=`【塔罗解读】

问题：${this.resultData.question}

${this.resultData.simpleVersion}

来自小肖AI - 直觉卡牌`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(()=>{window.showToast("结果已复制到剪贴板","success")}).catch(()=>{this.fallbackCopyText(t)}):this.fallbackCopyText(t)}fallbackCopyText(t){const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.select();try{document.execCommand("copy"),window.showToast("结果已复制到剪贴板","success")}catch{window.showToast("复制失败，请手动复制","error")}document.body.removeChild(e)}}const It="modulepreload",kt=function(i){return"/"+i},z={},Bt=function(t,e,s){let a=Promise.resolve();if(e&&e.length>0){let d=function(u){return Promise.all(u.map(p=>Promise.resolve(p).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};var o=d;document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=r?.nonce||r?.getAttribute("nonce");a=d(e.map(u=>{if(u=kt(u),u in z)return;z[u]=!0;const p=u.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${h}`))return;const m=document.createElement("link");if(m.rel=p?"stylesheet":It,p||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),p)return new Promise((k,b)=>{m.addEventListener("load",k),m.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${u}`)))})}))}function n(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&n(l.reason);return t().catch(n)})},S=[{index:0,name:"甲",element:"木",nature:"阳",color:"#4CAF50"},{index:1,name:"乙",element:"木",nature:"阴",color:"#8BC34A"},{index:2,name:"丙",element:"火",nature:"阳",color:"#F44336"},{index:3,name:"丁",element:"火",nature:"阴",color:"#E91E63"},{index:4,name:"戊",element:"土",nature:"阳",color:"#795548"},{index:5,name:"己",element:"土",nature:"阴",color:"#A1887F"},{index:6,name:"庚",element:"金",nature:"阳",color:"#FFD700"},{index:7,name:"辛",element:"金",nature:"阴",color:"#FFC107"},{index:8,name:"壬",element:"水",nature:"阳",color:"#2196F3"},{index:9,name:"癸",element:"水",nature:"阴",color:"#03A9F4"}],_=[{index:0,name:"子",element:"水",nature:"阳",animal:"鼠"},{index:1,name:"丑",element:"土",nature:"阴",animal:"牛"},{index:2,name:"寅",element:"木",nature:"阳",animal:"虎"},{index:3,name:"卯",element:"木",nature:"阴",animal:"兔"},{index:4,name:"辰",element:"土",nature:"阳",animal:"龙"},{index:5,name:"巳",element:"火",nature:"阴",animal:"蛇"},{index:6,name:"午",element:"火",nature:"阳",animal:"马"},{index:7,name:"未",element:"土",nature:"阴",animal:"羊"},{index:8,name:"申",element:"金",nature:"阳",animal:"猴"},{index:9,name:"酉",element:"金",nature:"阴",animal:"鸡"},{index:10,name:"戌",element:"土",nature:"阳",animal:"狗"},{index:11,name:"亥",element:"水",nature:"阴",animal:"猪"}],I={木:{generates:"火",overcomes:"土",generatedBy:"水",overcomedBy:"金",color:"#4CAF50",emoji:"🌳"},火:{generates:"土",overcomes:"金",generatedBy:"木",overcomedBy:"水",color:"#F44336",emoji:"🔥"},土:{generates:"金",overcomes:"水",generatedBy:"火",overcomedBy:"木",color:"#795548",emoji:"🏔️"},金:{generates:"水",overcomes:"木",generatedBy:"土",overcomedBy:"火",color:"#FFD700",emoji:"🔶"},水:{generates:"木",overcomes:"火",generatedBy:"金",overcomedBy:"土",color:"#2196F3",emoji:"💧"}},P=[{name:"立春",month:1,day:4},{name:"惊蛰",month:2,day:6},{name:"清明",month:3,day:5},{name:"立夏",month:4,day:6},{name:"芒种",month:5,day:6},{name:"小暑",month:6,day:7},{name:"立秋",month:7,day:8},{name:"白露",month:8,day:8},{name:"寒露",month:9,day:9},{name:"立冬",month:10,day:8},{name:"大雪",month:11,day:7},{name:"小寒",month:12,day:6}];function Dt(i,t,e){const s=P[0];(t<s.month+1||t===s.month+1&&e<s.day)&&(i-=1);const a=(i-4)%10,n=(i-4)%12;return{tiangan:S[a],dizhi:_[n],ganzhi:S[a].name+_[n].name}}function At(i,t,e){let s=t-1;for(let d=P.length-1;d>=0;d--){const u=P[d];if(t>u.month+1||t===u.month+1&&e>=u.day){s=d;break}}s===11&&t===1&&(i-=1);const a=(i-4)%10,r=([2,4,6,8,0][a%5]+s)%10,l=(s+2)%12;return{tiangan:S[r],dizhi:_[l],ganzhi:S[r].name+_[l].name}}function Mt(i,t,e){const s=new Date(1900,0,31),n=new Date(i,t-1,e).getTime()-s.getTime(),o=Math.floor(n/(1e3*60*60*24)),r=(o%10+10)%10,l=(o%12+12)%12;return{tiangan:S[r],dizhi:_[l],ganzhi:S[r].name+_[l].name}}function F(i){const t=new Date(i),e=t.getFullYear(),s=t.getMonth()+1,a=t.getDate(),n=Dt(e,s,a),o=At(e,s,a),r=Mt(e,s,a);return{year:n,month:o,day:r,fullName:`${n.ganzhi} ${o.ganzhi} ${r.ganzhi}`,elements:Lt(n,o,r)}}function Lt(i,t,e){const s={金:0,木:0,水:0,火:0,土:0};[i,t,e].forEach(o=>{s[o.tiangan.element]+=1,s[o.dizhi.element]+=1});let a={element:"",count:0},n={element:"",count:1/0};return Object.entries(s).forEach(([o,r])=>{r>a.count&&(a={element:o,count:r}),r<n.count&&(n={element:o,count:r})}),{distribution:s,strongest:a,weakest:n,yongshen:n.element}}function qt(i,t){const e={score:0,details:[],conclusion:""};Pt(i.day.tiangan.name,t.day.tiangan.name).isHe&&(e.score+=10,e.details.push({type:"positive",title:"日干相合",description:`${i.day.tiangan.name}${t.day.tiangan.name}相合，性格特质高度契合`})),Rt(i.year.dizhi.name,t.year.dizhi.name).isLiuhe&&(e.score+=8,e.details.push({type:"positive",title:"年支六合",description:`${i.year.dizhi.name}${t.year.dizhi.name}六合，家庭背景融洽`}));const n=Ht(i.elements,t.elements);e.score+=n.score,e.details.push(...n.details);const o=zt(i,t);return e.score-=o.penalty,e.details.push(...o.details),e.score=Math.max(0,Math.min(100,e.score+50)),e.conclusion=Ft(e.score,e.details),e}function Pt(i,t){const e={甲己:"土",己甲:"土",乙庚:"金",庚乙:"金",丙辛:"水",辛丙:"水",丁壬:"木",壬丁:"木",戊癸:"火",癸戊:"火"},s=i+t;return{isHe:s in e,element:e[s]||null}}function Rt(i,t){const e={子丑:"土",丑子:"土",寅亥:"木",亥寅:"木",卯戌:"火",戌卯:"火",辰酉:"金",酉辰:"金",巳申:"水",申巳:"水",午未:"土",未午:"土"},s=i+t;return{isLiuhe:s in e,element:e[s]||null}}function Ht(i,t){const e={score:0,details:[]},s=i.weakest.element,a=t.weakest.element,n=i.strongest.element,o=t.strongest.element;return s===o&&(e.score+=8,e.details.push({type:"positive",title:"五行互补",description:`对方${I[o].emoji}${o}可以弥补你${I[s].emoji}${s}的不足`})),a===n&&(e.score+=8,e.details.push({type:"positive",title:"五行互补",description:`你的${I[n].emoji}${n}可以弥补对方${I[a].emoji}${a}的不足`})),e}function zt(i,t){const e={penalty:0,details:[]},s=["子午","丑未","寅申","卯酉","辰戌","巳亥"];return[{pillarsA:i.year,pillarsB:t.year,name:"年柱"},{pillarsA:i.day,pillarsB:t.day,name:"日柱"}].forEach(({pillarsA:n,pillarsB:o,name:r})=>{const l=n.dizhi.name+o.dizhi.name,d=o.dizhi.name+n.dizhi.name;(s.includes(l)||s.includes(d))&&(e.penalty+=5,e.details.push({type:"negative",title:`${r}相冲`,description:`${n.dizhi.name}${o.dizhi.name}相冲，可能会有意见分歧`}))}),e}function Ft(i,t){const e=t.filter(a=>a.type==="positive").length,s=t.filter(a=>a.type==="negative").length;return i>=80?"A和B互利：双方性格特质高度契合，非常适合建立良好关系。":i>=60?e>s?"A利B，B不利A：你在这段关系中付出较多，但整体是积极的。":"A不利B，B利A：对方在这段关系中获益更多。":i>=40?"A和B相互不利：双方性格有一定差异，需要更多包容和理解。":"A和B相互不利：分析显示双方差异较大，建议谨慎考虑。"}function Gt(i,t,e=50){return new Promise(s=>{let a=0;i.textContent="";const n=setInterval(()=>{a<t.length?(i.textContent+=t.charAt(a),a++):(clearInterval(n),s())},e)})}const U="http://localhost:3000/api";async function y(i,t={}){const e=`${U}${i}`,s={"Content-Type":"application/json"},a=localStorage.getItem("auth_token");a&&(s.Authorization=`Bearer ${a}`);const n={...t,headers:{...s,...t.headers}};try{const o=await fetch(e,n),r=await o.json();if(!o.ok)throw new $(r.error?.message||"请求失败",r.error?.code,o.status);return r}catch(o){throw o instanceof $?o:new $("网络连接失败，请检查网络","NETWORK_ERROR",0)}}class $ extends Error{constructor(t,e,s){super(t),this.code=e,this.status=s}}const Ot={async birthday(i){return y("/analysis/birthday",{method:"POST",body:JSON.stringify(i)})},async birthMatchStream(i,{onChunk:t,onDone:e,onError:s,signal:a}){try{const n=await fetch(`${U}/analysis/birthMatch`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),signal:a});if(!n.ok){const d=await n.json();throw new $(d.error?.message||"请求失败",d.error?.code,n.status)}const o=n.body.getReader(),r=new TextDecoder;let l="";for(;;){const{done:d,value:u}=await o.read();if(d)break;const h=r.decode(u,{stream:!0}).split(`

`).filter(m=>m.trim());for(const m of h)if(m.startsWith("data: ")){const k=m.slice(6);if(k==="[DONE]"){e?.(l);return}try{const b=JSON.parse(k);if(b.content&&(l+=b.content,t?.(b.content,l)),b.error)throw new $(b.error,"STREAM_ERROR",500)}catch(b){if(b instanceof $)throw b}}}e?.(l)}catch(n){throw s?.(n),n}},async hexagram(i){return y("/analysis/hexagram",{method:"POST",body:JSON.stringify(i)})},async getResult(i){return y(`/analysis/result/${i}`)}},q={async createOrder(i){return y("/payment/create-order",{method:"POST",body:JSON.stringify(i)})},async getOrderStatus(i){return y(`/payment/order/${i}`)},async simulatePay(i){return y("/payment/simulate-pay",{method:"POST",body:JSON.stringify({orderId:i})})},async redeem(i){return y("/payment/redeem",{method:"POST",body:JSON.stringify({redeemCode:i})})},async getOrders(){return y("/payment/orders")}};class Nt{constructor(t){if(this.method=t.id,this.testData=window.appState.get("currentTest"),!this.testData){window.router.navigate("/");return}this.matchType=v(this.testData.type),this.result=null,this.isAnalyzing=!0,this.streamContent="",this.useAiAnalysis=!0,this.isStreamComplete=!1,this.isInitialized=!1,this.abortController=null}render(){return`
      <div class="page result-page">
        ${g({title:"分析结果",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 匹配类型标题 -->
            <section class="result-header mt-4 mb-6 animate-fade-in-up">
              <div class="glass-card text-center">
                <span class="result-header__icon">${this.matchType?.icon||"✨"}</span>
                <h2 class="heading-2 mb-1">${this.matchType?.title||"匹配分析"}</h2>
                <p class="small-text" style="color: var(--color-text-tertiary);">
                  ${this.method==="birthday"?"生日匹配分析":"直觉卡牌分析"}
                </p>
              </div>
            </section>

            <!-- 分析中状态 -->
            <section class="analysis-section" id="analysis-container">
              ${this.isAnalyzing?this.renderAnalyzing():this.renderResult()}
            </section>

          </div>
        </main>

        <!-- 底部操作栏 -->
        ${this.renderBottomBar()}
      </div>
    `}renderAnalyzing(){return`
      <div class="analyzing-state animate-fade-in-up">
        <!-- AI头像消息 -->
        <div class="message message--ai">
          <div class="message__avatar">✨</div>
          <div class="message__bubble">
            <div class="loading-dots">
              <span class="loading-dots__dot"></span>
              <span class="loading-dots__dot"></span>
              <span class="loading-dots__dot"></span>
            </div>
          </div>
        </div>
        
        <div class="analyzing-tips text-center mt-6">
          <p class="body-text-secondary" id="analyzing-text">正在分析中...</p>
          <div class="analyzing-steps mt-4">
            <div class="step-item active" data-step="1">
              <span class="step-icon">📊</span>
              <span>收集信息</span>
            </div>
            <div class="step-item" data-step="2">
              <span class="step-icon">🧮</span>
              <span>特质计算</span>
            </div>
            <div class="step-item" data-step="3">
              <span class="step-icon">🤖</span>
              <span>分析中</span>
            </div>
            <div class="step-item" data-step="4">
              <span class="step-icon">📝</span>
              <span>生成报告</span>
            </div>
          </div>
        </div>
      </div>
    `}renderResult(){if(!this.result&&!this.streamContent)return"";if(this.useAiAnalysis&&this.method==="birthday")return this.renderAiResult();const{score:t,conclusion:e,details:s,personA:a,personB:n}=this.result;return this.getConclusionType(t),`
      <div class="result-content animate-fade-in-up">
        <!-- 匹配分数 -->
        <div class="glass-card score-card mb-4">
          <div class="score-circle-container">
            <svg class="score-circle" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#8B7FD8"/>
                  <stop offset="100%" style="stop-color:#FFB5D8"/>
                </linearGradient>
              </defs>
              <circle 
                class="score-circle__track" 
                cx="50" cy="50" r="45"
                fill="none" stroke-width="8"
              />
              <circle 
                class="score-circle__fill progress-ring__circle" 
                cx="50" cy="50" r="45"
                fill="none" stroke-width="8"
                stroke="url(#scoreGradient)"
                stroke-dasharray="${t*2.83} 283"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <!-- 分数显示在圆圈中间 -->
            <div class="score-value">
              <span class="score-number-gradient">${t}</span>
              <span class="score-unit-gradient">%</span>
            </div>
          </div>
          <p class="score-label">匹配度</p>
        </div>

        <!-- 结论卡片 -->
        <div class="glass-card conclusion-card-simple mb-4">
          <p class="body-text">${e}</p>
        </div>

        <!-- 详细分析 -->
        <div class="glass-card details-card mb-4">
          <h4 class="heading-3 mb-4">📋 详细分析</h4>
          
          ${this.method==="birthday"?this.renderBaziDetails():this.renderHexagramDetails()}
          
          <div class="analysis-points mt-4">
            ${s.map(o=>`
              <div class="analysis-point ${o.type}">
                <span class="point-icon">${o.type==="positive"?"✅":"⚠️"}</span>
                <div class="point-content">
                  <p class="point-title">${o.title}</p>
                  <p class="point-description">${o.description}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 温馨提示 -->
        <div class="glass-card suggestion-card mb-4">
          <h4 class="heading-3 mb-3">💡 温馨提示</h4>
          <div class="suggestion-content" id="suggestion-text">
            ${this.result.suggestion||""}
          </div>
        </div>

        <!-- 分享提示 -->
        <div class="glass-card glass-card--light share-prompt mb-4">
          <p class="small-text text-center">
            📱 分享给好友，邀请TA一起测试
          </p>
        </div>
      </div>
    `}renderBaziDetails(){const{personA:t,personB:e,pillarsA:s,pillarsB:a}=this.result;return!s||!a?"":`
      <div class="bazi-comparison">
        <!-- 人物A -->
        <div class="person-bazi">
          <div class="person-header">
            <span class="person-avatar">${t.gender==="male"?"👨":"👩"}</span>
            <span class="person-name">${t.name||"你"}</span>
          </div>
          <div class="pillars-display">
            ${this.renderPillars(s)}
          </div>
          <div class="elements-display">
            ${this.renderElements(s.elements)}
          </div>
        </div>
        
        <div class="vs-divider">
          <span>VS</span>
        </div>
        
        <!-- 人物B -->
        <div class="person-bazi">
          <div class="person-header">
            <span class="person-avatar">${e.gender==="male"?"👨":"👩"}</span>
            <span class="person-name">${e.name||"对方"}</span>
          </div>
          <div class="pillars-display">
            ${this.renderPillars(a)}
          </div>
          <div class="elements-display">
            ${this.renderElements(a.elements)}
          </div>
        </div>
      </div>
    `}renderPillars(t){return`
      <div class="pillars-row">
        <div class="pillar">
          <span class="pillar-label">年柱</span>
          <span class="pillar-ganzhi">${t.year.ganzhi}</span>
        </div>
        <div class="pillar">
          <span class="pillar-label">月柱</span>
          <span class="pillar-ganzhi">${t.month.ganzhi}</span>
        </div>
        <div class="pillar">
          <span class="pillar-label">日柱</span>
          <span class="pillar-ganzhi">${t.day.ganzhi}</span>
        </div>
      </div>
    `}renderElements(t){return`
      <div class="elements-bar">
        ${Object.entries(t.distribution).map(([e,s])=>`
          <div class="element-item">
            <span class="element-emoji">${I[e].emoji}</span>
            <span class="element-name">${e}</span>
            <span class="element-count">${s}</span>
          </div>
        `).join("")}
      </div>
    `}renderHexagramDetails(){if(this.testData.allCards&&this.testData.reading)return this.renderTarotDetails();const{hexagram:t}=this.testData;return t?`
      <div class="hexagram-display">
        <div class="hexagram-main">
          <div class="hexagram-symbol text-center">
            <span class="hexagram-icon">${t.upper?.symbol||"☰"}${t.lower?.symbol||"☷"}</span>
            <h4 class="hexagram-name">${t.name}符号</h4>
            <p class="hexagram-meaning">${t.meaning}</p>
          </div>
        </div>
      </div>
    `:""}renderTarotDetails(){const{allCards:t,reading:e}=this.testData;return`
      <div class="tarot-display">
        <!-- 能量类型 -->
        <div class="energy-type text-center mb-4">
          <span class="energy-symbol">${e.energy.symbol}</span>
          <h4 class="energy-name">${e.energy.name}</h4>
          <p class="energy-desc small-text">${e.energy.description}</p>
        </div>
        
        <!-- 抽取的牌 -->
        <div class="tarot-cards-detail mt-4">
          <p class="small-text mb-3" style="color: var(--color-primary);">抽取的卡牌：</p>
          <div class="tarot-cards-grid">
            ${t.map((s,a)=>`
              <div class="tarot-card-item">
                <div class="card-header">
                  <span class="card-num">${a+1}</span>
                  <span class="card-symbol">${s.symbol}</span>
                </div>
                <div class="card-body">
                  <p class="card-name">${s.name}</p>
                  <p class="card-position ${s.isUpright?"upright":"reversed"}">${s.position}</p>
                </div>
                <p class="card-meaning small-text">${s.meaning}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}getConclusionType(t){return t>=80?{class:"conclusion--excellent",icon:"🌟",title:"A和B互利"}:t>=60?{class:"conclusion--good",icon:"👍",title:t>70?"A利B，B不利A":"A不利B，B利A"}:t>=40?{class:"conclusion--neutral",icon:"⚖️",title:"A和B相互不利"}:{class:"conclusion--caution",icon:"⚠️",title:"A和B相互不利"}}renderBottomBar(){return this.isAnalyzing?"":`
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__buttons">
          <div class="btn-group-left">
            <button class="btn btn--secondary" data-action="share">
              <span>📤</span> 分享
            </button>
            <button class="btn btn--secondary" data-action="export-png">
              <span>🖼️</span> 导出匹配结果
            </button>
          </div>
          <button class="btn btn--primary" data-action="new-test">
            再测一次
          </button>
        </div>
      </div>
    `}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{window.router.navigate("/")});const e=document.querySelector('[data-action="share"]');e&&e.addEventListener("click",()=>{this.handleShare()});const s=document.querySelector('[data-action="export-png"]');s&&s.addEventListener("click",()=>{this.handleExportPng()});const a=document.querySelector('[data-action="new-test"]');a&&a.addEventListener("click",()=>{window.router.navigate("/")})}async init(){if(this.testData){if(this.isInitialized){console.log("页面已初始化，跳过重复初始化");return}if(this.isInitialized=!0,this.method==="birthday"&&this.useAiAnalysis){await this.analyzeWithAi();return}await this.simulateAnalysis(),this.method==="birthday"?this.analyzeBirthday():this.analyzeHexagram(),this.isAnalyzing=!1,this.rerender(),setTimeout(()=>{const t=document.getElementById("suggestion-text");t&&this.result?.suggestion&&Gt(t,this.result.suggestion,30)},500)}}async simulateAnalysis(){const t=["1","2","3","4"],e=["正在收集信息...","正在进行特质计算...","正在分析中...","正在生成报告..."];for(let s=0;s<t.length;s++){await this.delay(800);const a=document.getElementById("analyzing-text");a&&(a.textContent=e[s]);const n=document.querySelector(`[data-step="${t[s]}"]`);n&&n.classList.add("active")}await this.delay(500)}analyzeBirthday(){const{personA:t,personB:e}=this.testData,s=F(t.birthDate),a=F(e.birthDate),n=qt(s,a);this.result={personA:t,personB:e,pillarsA:s,pillarsB:a,score:n.score,conclusion:n.conclusion,details:n.details,suggestion:this.generateSuggestion(n)}}analyzeHexagram(){if(this.testData.reading){const{reading:s,allCards:a}=this.testData;this.result={allCards:a,reading:s,score:s.score,conclusion:s.reading,details:this.getTarotDetails(a),suggestion:s.reading+`

`+s.disclaimer};return}const{hexagram:t}=this.testData;if(!t){this.result={score:50,conclusion:"数据解析异常，请重新测试。",details:[],suggestion:"建议重新进行测试。"};return}const e=this.calculateHexagramScore(t);this.result={hexagram:t,score:e,conclusion:this.getHexagramConclusion(t,e),details:this.getHexagramDetails(t),suggestion:this.generateHexagramSuggestion(t)}}getTarotDetails(t){const e=[],s=t.filter(n=>n.isUpright),a=t.filter(n=>!n.isUpright);return s.length>0&&e.push({type:"positive",title:`正位牌 (${s.length}张)`,description:s.map(n=>`${n.name}：${n.upright}`).join("；")}),a.length>0&&e.push({type:a.length<=3?"positive":"negative",title:`逆位牌 (${a.length}张)`,description:a.map(n=>`${n.name}：${n.reversed}`).join("；")}),e}calculateHexagramScore(t){const e=["乾","坤","泰","同人","大有","谦","咸","恒","益","萃"],s=["否","讼","剥","困","蹇","睽","明夷"];let a=60;return e.includes(t.name)?a+=20:s.includes(t.name)&&(a-=15),t.hasChanging&&(a+=t.changingPositions.length<=2?5:-5),Math.max(20,Math.min(95,a))}getHexagramConclusion(t,e){return e>=75?`${t.name}符号显示双方关系积极向好，有互利共赢的趋势。`:e>=55?`${t.name}符号提示需要双方共同努力，关系可以改善。`:`${t.name}符号暗示当前时机不太适合，建议谨慎行事。`}getHexagramDetails(t){const e=[];return e.push({type:"positive",title:`${t.name}符号`,description:t.meaning}),t.upper&&t.lower&&e.push({type:"positive",title:"上下符号分析",description:`上符号${t.upper.name}（${t.upper.nature}），下符号${t.lower.name}（${t.lower.nature}）`}),t.hasChanging&&e.push({type:t.changingPositions.length<=2?"positive":"negative",title:"变化分析",description:`第${t.changingPositions.join("、")}轮为变化轮，表示事情会有变化`}),e}generateSuggestion(t){const{score:e,details:s}=t;s.filter(o=>o.type==="positive");const a=s.filter(o=>o.type==="negative");let n="";return e>=80?n="这是非常好的契合度！双方在性格特质上高度互补，建议珍惜这份关系，共同维护。注意保持沟通，互相理解和包容。":e>=60?(n="整体关系是积极的，但也存在一些需要注意的地方。",a.length>0&&(n+=`特别是${a[0].title}方面，需要双方多一些耐心和理解。`),n+="只要用心经营，这段关系会越来越好。"):e>=40?n="双方存在一定的差异，但并非不可调和。建议：1) 增加沟通频率；2) 尊重对方的差异；3) 寻找共同兴趣。如果双方都愿意付出努力，关系是可以改善的。":n="从性格分析角度看，双方确实存在较大的差异。建议在做重要决定前，多观察、多了解对方。如果是合作关系，建议寻找其他机会；如果是感情关系，请谨慎考虑。",n}generateHexagramSuggestion(t){return`${t.name}符号的核心含义是"${t.meaning}"。根据分析结果提示，当前最重要的是保持平和的心态，不要急于求成。遇事多思考，听从内心的指引。如果有变化，说明事情会有转机，保持耐心等待合适的时机。`}delay(t){return new Promise(e=>setTimeout(e,t))}async analyzeWithAi(){const{personA:t,personB:e}=this.testData;this.abortController=new AbortController;const s=["1","2","3"],a=["正在收集信息...","正在进行特质计算...","正在请求 AI 分析..."];for(let n=0;n<s.length;n++){await this.delay(600);const o=document.getElementById("analyzing-text");o&&(o.textContent=a[n]);const r=document.querySelector(`[data-step="${s[n]}"]`);r&&r.classList.add("active")}try{await Ot.birthMatchStream({partyA:t,partyB:e},{onChunk:(n,o)=>{if(this.streamContent=o,this.isAnalyzing){this.isAnalyzing=!1;const r=document.querySelector('[data-step="4"]');r&&r.classList.add("active"),this.updateToResultView()}else this.updateStreamContent()},onDone:n=>{this.streamContent=n,this.isAnalyzing=!1,this.isStreamComplete=!0;const o=document.getElementById("ai-stream-content");o&&(o.innerHTML=this.formatMarkdown(this.streamContent)+this.renderCompleteIndicator(),this.scrollToBottom(),setTimeout(()=>{const r=document.getElementById("stream-complete-indicator");r&&(r.style.opacity="0",setTimeout(()=>r.remove(),300))},1e3)),this.rerender()},onError:n=>{if(n.name==="AbortError"){console.log("请求已取消");return}console.error("AI 分析失败:",n),this.streamContent="分析失败，请稍后重试！",this.isAnalyzing=!1,this.isStreamComplete=!0;const o=document.getElementById("stream-loading-indicator");o&&o.remove(),this.rerender()},signal:this.abortController.signal})}catch(n){if(n.name==="AbortError"){console.log("请求已取消");return}console.error("AI 分析失败:",n),this.streamContent="分析失败，请稍后重试。",this.isAnalyzing=!1,this.isStreamComplete=!0,this.rerender()}}updateToResultView(){const t=document.getElementById("analysis-container");t&&(t.innerHTML=this.renderResult())}renderAiResult(){const{personA:t,personB:e}=this.testData;return`
      <div class="result-content animate-fade-in-up">
        <!-- 双方信息 -->
        <div class="glass-card persons-card mb-4">
          <div class="persons-row">
            <div class="person-info">
              <span class="person-avatar">${t.gender==="男"?"👨":"👩"}</span>
              <span class="person-name">${t.name||"你"}</span>
              <span class="person-birth small-text">${t.birthDate}</span>
            </div>
            <div class="vs-badge">VS</div>
            <div class="person-info">
              <span class="person-avatar">${e.gender==="男"?"👨":"👩"}</span>
              <span class="person-name">${e.name||"对方"}</span>
              <span class="person-birth small-text">${e.birthDate}</span>
            </div>
          </div>
        </div>

        <!-- AI 分析结果 -->
        <div class="glass-card ai-result-card mb-4">
          <h4 class="heading-3 mb-4">🤖 分析报告</h4>
          <p class="ai-intro-text">我将根据您提供的信息，对匹配情况进行详细分析，请稍等...</p>
          <div class="ai-content" id="ai-stream-content">
            ${this.formatMarkdown(this.streamContent)}${this.isStreamComplete?"":this.renderLoadingIndicator()}
          </div>
        </div>

        <!-- 温馨提示 -->
        <div class="glass-card glass-card--light disclaimer-card mb-4">
          <p class="small-text text-center" style="color: var(--color-text-tertiary);">
            ⚠️ 以上分析仅供娱乐参考，不构成任何决策建议
          </p>
        </div>
      </div>
    `}renderLoadingIndicator(){return`
      <div class="stream-loading-indicator" id="stream-loading-indicator">
        <span class="loading-dot"></span>
        <span class="loading-text">分析中...</span>
      </div>
    `}updateStreamContent(){const t=document.getElementById("ai-stream-content");if(!t)return;const e=this.formatMarkdown(this.streamContent),s=this.renderLoadingIndicator(),a=document.createElement("div");a.innerHTML=e;const n=Array.from(a.children),o=Array.from(t.children).filter(r=>!r.classList.contains("stream-loading-indicator"));if(n.length>o.length){for(let l=o.length;l<n.length;l++){const d=n[l].cloneNode(!0);d.classList.add("stream-fade-in");const u=t.querySelector(".stream-loading-indicator");u?t.insertBefore(d,u):t.appendChild(d)}t.querySelector(".stream-loading-indicator")||t.insertAdjacentHTML("beforeend",s)}else if(o.length>0){const r=o[o.length-1],l=n[n.length-1];l&&r.innerHTML!==l.innerHTML&&(r.innerHTML=l.innerHTML)}else t.innerHTML=e+s;this.scrollToBottom()}renderCompleteIndicator(){return`
      <div class="stream-complete-indicator" id="stream-complete-indicator">
        <span class="complete-icon">✅</span>
        <span class="complete-text">已完成</span>
      </div>
    `}scrollToBottom(){const t=document.getElementById("ai-stream-content");t&&(t.scrollTop=t.scrollHeight),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}formatMarkdown(t){return t?this.splitIntoSections(t).map((s,a)=>{const n=this.formatSectionContent(s);return n.replace(/<[^>]*>/g,"").replace(/\s+/g,"").trim()?`
        <div class="analysis-block animate-fade-in-up" style="animation-delay: ${a*.1}s;">
          ${n}
        </div>
      `:""}).filter(Boolean).join(""):""}splitIntoSections(t){const e=[];let s="";const a=t.split(`
`);for(const n of a){if(/^总结[：:.]?\s*$/.test(n.trim())||/^\*?\*?总结\*?\*?[：:.]?\s*$/.test(n.trim()))continue;/^【[^】]+】/.test(n)?(s.trim()&&e.push(s.trim()),s=n):s+=`
`+n}return s.trim()&&e.push(s.trim()),e.length<=1&&t.includes(`

`)?t.split(/\n\n+/).filter(n=>n.trim()):e.length>0?e:[t]}formatSectionContent(t){const e=a=>a.includes("第一步")||a.includes("坐标")||a.includes("确立")?"📍":a.includes("第二步")||a.includes("输出")||a.includes("判定")?"🔍":a.includes("第三步")||a.includes("打分")||a.includes("量化")?"⭐":a.includes("第四步")||a.includes("判词")||a.includes("结论")||a.includes("综合")?"🎯":a.includes("需求")||a.includes("用神")||a.includes("清单")?"📋":a.includes("资产")||a.includes("核定")?"💎":a.includes("评分")||a.includes("细则")?"⭐":a.includes("建议")||a.includes("提示")?"💡":a.includes("甲方")||a.includes("乙方")?"":"📌";let s=t.replace(/^[\*\-]?\s*\*?\*?第([一二三四五六七八九十]+)步[：:]\s*(.+)$/gm,(a,n,o)=>`<div class="block-header"><span class="block-icon">${e(`第${n}步`)}</span><span class="block-title">第${n}步：${o}</span></div>`).replace(/^[\*\-]?\s*\*?\*?([甲乙])方\*?\*?$/gm,(a,n)=>`<div class="person-header"><span class="person-emoji">${n==="甲"?"👨":"👩"}</span><span class="person-label">${n}方</span></div>`).replace(/^\[([^\]]+)\](?![\(\[])/gm,(a,n)=>`<div class="block-subheader"><span class="block-icon">${e(n)}</span><span class="block-subtitle">${n}</span></div>`).replace(/^【([^】]+)】/gm,(a,n)=>`<div class="block-header"><span class="block-icon">${e(n)}</span><span class="block-title">${n}</span></div>`).replace(/^###\s+(.+)$/gm,'<div class="block-header"><span class="block-icon">📌</span><span class="block-title">$1</span></div>').replace(/^##\s+(.+)$/gm,'<div class="block-header"><span class="block-icon">📋</span><span class="block-title">$1</span></div>').replace(/^#\s+(.+)$/gm,'<div class="block-header main-header"><span class="block-icon">📊</span><span class="block-title">$1</span></div>').replace(/^([一二三四五六七八九十]+)[、.]\s*(.+)$/gm,'<div class="block-subheader"><span class="block-num">$1</span><span class="block-subtitle">$2</span></div>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/^\*\s{3}(.+)$/gm,'<li class="sub-item">$1</li>').replace(/^[-*•]\s*([^\s].*)$/gm,"<li>$1</li>").replace(/^(\d+)[.)、]\s*(.+)$/gm,'<li class="numbered"><span class="list-num">$1.</span> $2</li>').replace(/([^<>\n]+?)：([^<>\n]+)/g,'<span class="label-text">$1：</span><span class="value-text">$2</span>').replace(/\n/g,"<br>");return s=s.replace(/(<li[^>]*>.*?<\/li>)(<br>)?/g,"$1"),s=s.replace(/(<li[^>]*>.*?<\/li>)+/g,a=>'<ul class="block-list">'+a+"</ul>"),s=s.replace(/(<br>){2,}/g,"<br>"),s=s.replace(/^(<br>|\s)+/,""),s=s.replace(/(<br>|\s)+$/,""),s=s.replace(/<li[^>]*>\s*<\/li>/g,""),s=s.replace(/<li[^>]*>\s*[-–—]+\s*<\/li>/g,""),s=s.replace(/<ul class="block-list">\s*<\/ul>/g,""),s=s.replace(/<br>\s*[-–—]+\s*<br>/g,"<br>"),s=s.replace(/<br>\s*[•●○]\s*[-–—]*\s*<br>/g,"<br>"),s=s.replace(/(<\/div>)(<br>)+/g,"$1"),s=s.replace(/(<br>)+(<div)/g,"$2"),`<div class="block-content">${s}</div>`}rerender(){const t=document.getElementById("app");t.innerHTML=this.render(),this.attachEvents()}handleShare(){const t=`我刚刚在匹配游戏进行了${this.matchType?.title}测试，匹配度${this.result?.score}%！快来试试吧~`;navigator.share?navigator.share({title:"匹配游戏 - 趣味性格测试",text:t,url:window.location.origin}):navigator.clipboard.writeText(t).then(()=>{window.showToast("链接已复制，快去分享吧！")})}async handleExportPng(){const t=this.testData?.personA?.name||"甲方",e=this.testData?.personB?.name||"乙方",s=this.matchType?.title||"匹配",a=`${t}_${e}_${s}结果.png`;window.showToast("正在生成图片，请稍候...");try{const n=document.querySelector(".page-content");if(!n){window.showToast("导出失败：找不到内容区域");return}const o=document.querySelector(".bottom-action-bar");o&&(o.style.display="none"),n.classList.add("export-mode");const l=(await Bt(()=>import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js"),[])).default,d=await l(n,{scale:2,useCORS:!0,allowTaint:!0,backgroundColor:null,logging:!1});n.classList.remove("export-mode"),o&&(o.style.display="");const u=d.toDataURL("image/png"),p=document.createElement("a");p.download=a,p.href=u,p.click(),window.showToast("图片导出成功！")}catch(n){console.error("导出图片失败:",n);const o=document.querySelector(".page-content");o&&o.classList.remove("export-mode");const r=document.querySelector(".bottom-action-bar");r&&(r.style.display=""),window.showToast("导出失败，请稍后重试")}}}class Qt{constructor(t){this.testType=t.type,this.matchType=v(this.testType),this.orderId=null,this.paymentMethod="alipay",this.qrCodeData=null,this.redeemCode=null,this.status="selecting",this.pollingTimer=null}render(){return`
      <div class="page payment-page">
        ${g({title:"支付",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            ${this.renderContent()}
          </div>
        </main>
      </div>
    `}renderContent(){switch(this.status){case"selecting":return this.renderPaymentSelect();case"paying":return this.renderPaymentQR();case"success":return this.renderSuccess();default:return""}}renderPaymentSelect(){const t=this.matchType||{title:"测试服务",price:29.9};return`
      <section class="payment-info mt-4 mb-6 animate-fade-in-up">
        <div class="glass-card">
          <div class="payment-product">
            <span class="product-icon">${t.icon||"🔮"}</span>
            <div class="product-info">
              <h3 class="product-name">${t.title}</h3>
              <p class="product-desc">${t.description||""}</p>
            </div>
            <div class="product-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">${t.price||29.9}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="payment-method-section mb-6 animate-fade-in-up animate-delay-100">
        <h4 class="section-title mb-4">选择支付方式</h4>
        
        <div class="payment-methods">
          <div class="payment-method-card ${this.paymentMethod==="alipay"?"active":""}" 
               data-method="alipay">
            <div class="method-icon alipay-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#1677FF">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold">支</text>
              </svg>
            </div>
            <div class="method-name">支付宝</div>
            <div class="method-check">✓</div>
          </div>

          <div class="payment-method-card ${this.paymentMethod==="wechat"?"active":""}" 
               data-method="wechat">
            <div class="method-icon wechat-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#07C160">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold">微</text>
              </svg>
            </div>
            <div class="method-name">微信支付</div>
            <div class="method-check">✓</div>
          </div>
        </div>
      </section>

      <section class="payment-notice mb-6 animate-fade-in-up animate-delay-200">
        <div class="glass-card glass-card--light">
          <div class="notice-header">
            <span>💡</span>
            <span class="small-text">支付说明</span>
          </div>
          <ul class="notice-list">
            <li>支付成功后将获得一个8位核销码</li>
            <li>核销码可用于解锁测试结果</li>
            <li>请妥善保管核销码，每个码只能使用一次</li>
          </ul>
        </div>
      </section>

      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__buttons">
          <button class="btn btn--primary btn--full" data-action="create-order">
            立即支付 ¥${t.price||29.9}
          </button>
        </div>
      </div>
    `}renderPaymentQR(){return`
      <section class="qr-section mt-4 animate-fade-in-up">
        <div class="glass-card text-center">
          <h3 class="heading-3 mb-4">
            ${this.paymentMethod==="alipay"?"支付宝":"微信"}扫码支付
          </h3>
          
          <div class="qr-container">
            <div class="qr-code">
              <img src="${this.qrCodeData}" alt="支付二维码" />
            </div>
            <p class="qr-tip small-text mt-3">
              请使用${this.paymentMethod==="alipay"?"支付宝":"微信"}扫描二维码完成支付
            </p>
          </div>
          
          <div class="payment-amount mt-4">
            <span class="amount-label">支付金额</span>
            <span class="amount-value">¥ ${this.matchType?.price||29.9}</span>
          </div>
          
          <div class="order-info mt-4">
            <p class="small-text">订单号: ${this.orderId}</p>
          </div>
        </div>
      </section>

      <section class="payment-status mt-4 animate-fade-in-up animate-delay-100">
        <div class="glass-card glass-card--light">
          <div class="status-indicator">
            <div class="loading-dots">
              <span class="loading-dots__dot"></span>
              <span class="loading-dots__dot"></span>
              <span class="loading-dots__dot"></span>
            </div>
            <p class="status-text">等待支付中...</p>
          </div>
        </div>
      </section>

      <!-- 开发环境：模拟支付按钮 -->
      ${this.renderDevPayButton()}
      
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__buttons">
          <button class="btn btn--secondary" data-action="cancel-order">
            取消支付
          </button>
          <button class="btn btn--primary" data-action="check-status">
            我已支付
          </button>
        </div>
      </div>
    `}renderDevPayButton(){return`
      <section class="dev-section mt-4">
        <div class="glass-card text-center" style="border: 2px dashed var(--color-warning);">
          <p class="small-text mb-3" style="color: var(--color-warning);">🛠️ 开发模式</p>
          <button class="btn btn--primary btn--sm" data-action="simulate-pay">
            模拟支付成功
          </button>
        </div>
      </section>
    `}renderSuccess(){return`
      <section class="success-section mt-6 animate-fade-in-up">
        <div class="glass-card text-center">
          <div class="success-icon animate-bounce-in">✅</div>
          <h2 class="heading-2 mb-2">支付成功</h2>
          <p class="body-text-secondary mb-6">感谢您的购买！</p>
          
          <div class="redeem-code-card">
            <p class="small-text mb-2">您的核销码</p>
            <div class="redeem-code">${this.redeemCode}</div>
            <button class="btn btn--secondary btn--sm mt-3" data-action="copy-code">
              📋 复制核销码
            </button>
          </div>
          
          <div class="code-notice mt-4">
            <p class="small-text" style="color: var(--color-text-tertiary);">
              请妥善保管此核销码，用于解锁测试结果
            </p>
          </div>
        </div>
      </section>

      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__buttons">
          <button class="btn btn--secondary" data-action="back-home">
            返回首页
          </button>
          <button class="btn btn--primary" data-action="use-code">
            立即使用
          </button>
        </div>
      </div>
    `}attachEvents(){const t=document.querySelector(".navbar__back-btn");t&&t.addEventListener("click",()=>{this.cleanup(),window.router.back()}),document.querySelectorAll(".payment-method-card").forEach(d=>{d.addEventListener("click",()=>{this.selectPaymentMethod(d.dataset.method)})});const e=document.querySelector('[data-action="create-order"]');e&&e.addEventListener("click",()=>this.createOrder());const s=document.querySelector('[data-action="cancel-order"]');s&&s.addEventListener("click",()=>this.cancelOrder());const a=document.querySelector('[data-action="check-status"]');a&&a.addEventListener("click",()=>this.checkPaymentStatus());const n=document.querySelector('[data-action="simulate-pay"]');n&&n.addEventListener("click",()=>this.simulatePay());const o=document.querySelector('[data-action="copy-code"]');o&&o.addEventListener("click",()=>this.copyRedeemCode());const r=document.querySelector('[data-action="back-home"]');r&&r.addEventListener("click",()=>{window.router.navigate("/")});const l=document.querySelector('[data-action="use-code"]');l&&l.addEventListener("click",()=>{window.appState.set("redeemCode",this.redeemCode),window.router.navigate(`/result/${this.testType}?code=${this.redeemCode}`)})}selectPaymentMethod(t){this.paymentMethod=t,document.querySelectorAll(".payment-method-card").forEach(e=>{e.classList.toggle("active",e.dataset.method===t)})}async createOrder(){try{window.showToast("正在创建订单...");const t=await q.createOrder({productId:"test-standard",paymentMethod:this.paymentMethod,testType:this.testType});t.success&&(this.orderId=t.data.orderId,this.qrCodeData=t.data.qrCode,this.status="paying",this.rerender(),this.startPolling())}catch(t){window.showToast(t.message||"创建订单失败","error")}}cancelOrder(){this.cleanup(),this.status="selecting",this.orderId=null,this.qrCodeData=null,this.rerender()}startPolling(){this.pollingTimer=setInterval(()=>{this.checkPaymentStatus(!0)},3e3)}stopPolling(){this.pollingTimer&&(clearInterval(this.pollingTimer),this.pollingTimer=null)}async checkPaymentStatus(t=!1){try{const e=await q.getOrderStatus(this.orderId);e.success&&e.data.status==="paid"?(this.stopPolling(),this.redeemCode=e.data.redeemCode,this.status="success",this.rerender(),t||window.showToast("支付成功！","success")):t||window.showToast("暂未收到支付，请稍候重试")}catch{t||window.showToast("查询失败，请稍候重试","error")}}async simulatePay(){try{const t=await q.simulatePay(this.orderId);t.success&&(this.stopPolling(),this.redeemCode=t.data.redeemCode,this.status="success",this.rerender(),window.showToast("模拟支付成功！","success"))}catch(t){window.showToast(t.message||"模拟支付失败","error")}}copyRedeemCode(){this.redeemCode&&navigator.clipboard.writeText(this.redeemCode).then(()=>{window.showToast("核销码已复制！","success")}).catch(()=>{window.showToast("复制失败，请手动复制")})}cleanup(){this.stopPolling()}rerender(){const t=document.getElementById("app");t.innerHTML=this.render(),this.attachEvents()}}let c={question:"",lunarDate:"",benGuaInfo:null,bianGuaInfo:null,hasMovingYao:!1,movingPositions:[],yaos:[],aiResponse:"",professionalVersion:"",simpleVersion:"",aiPrompt:"",isLoading:!1,showPrompt:!1,viewMode:"simple",remainingTime:60,progressPercent:0,loadingTip:"正在连接服务器..."};const G=["正在分析卦象...","推演六亲关系...","计算世应位置...","解读六神含义...","综合动爻变化...","生成专业解读...","整理通俗版本...","即将完成..."];function w(i,t={}){jt(t),i.innerHTML=`
        <div class="divination-result-page">
            <!-- 问题显示 -->
            <div class="question-card">
                <span class="question-label">所问事项</span>
                <span class="question-text">${c.question||"未知问题"}</span>
                <span class="date-text">${c.lunarDate||""}</span>
            </div>

            <!-- 卦象展示区域 -->
            ${Vt()}

            <!-- 动爻说明 -->
            ${Xt()}

            <!-- 解读区域 -->
            <div class="ai-section">
                <div class="section-title">🔮 解读结果</div>
                
                <!-- 视图切换 -->
                <div class="view-mode-tabs">
                    <button class="mode-tab ${c.viewMode==="simple"?"active":""}" 
                            data-mode="simple">💡 通俗版</button>
                    <button class="mode-tab ${c.viewMode==="professional"?"active":""}" 
                            data-mode="professional">📚 专业版</button>
                    <button class="mode-tab ${c.viewMode==="both"?"active":""}" 
                            data-mode="both">📖 双版本</button>
                </div>

                <!-- AI提示词（可折叠） -->
                <div class="prompt-card">
                    <div class="prompt-header" id="toggle-prompt">
                        <span>解读提示词</span>
                        <span class="prompt-arrow">${c.showPrompt?"▼":"▶"}</span>
                    </div>
                    <div class="prompt-content ${c.showPrompt?"show":""}">
                        <pre class="prompt-text">${X(c.aiPrompt||"暂无提示词")}</pre>
                        <button class="btn-copy" id="copy-prompt">复制提示词</button>
                    </div>
                </div>

                <!-- 加载状态 -->
                ${Jt()}

                <!-- AI响应结果 -->
                ${Kt()}
            </div>

            <!-- 免责声明 -->
            <div class="disclaimer">
                本应用基于传统文化体验，仅供娱乐参考，不作为任何决策依据
            </div>

            <!-- 底部按钮 -->
            <div class="bottom-buttons">
                <button class="btn-restart" id="btn-restart">🔄 重新开始</button>
                <button class="btn-share" id="btn-share">📤 分享结果</button>
            </div>
        </div>
    `,Zt(i)}function jt(i){if(i.data){const e=i.data;c.question=e.question||"",c.aiResponse=e.result||"",c.professionalVersion=e.professionalVersion||"",c.simpleVersion=e.simpleVersion||"",c.aiPrompt=e.aiPrompt||""}const t=localStorage.getItem("divinationResult");if(t&&!i.data)try{const e=JSON.parse(t);e.success&&e.data&&(c.aiResponse=e.data.result||"",c.professionalVersion=e.data.professionalVersion||"",c.simpleVersion=e.data.simpleVersion||"",c.aiPrompt=e.data.aiPrompt||"")}catch(e){console.error("解析缓存数据失败:",e)}c.aiPrompt&&Yt(c.aiPrompt)}function Yt(i){const t=i.match(/我要问"([^"]+)"的问题/);t&&(c.question=t[1]);const e=i.match(/在农历([^\s]+)问事/);e&&(c.lunarDate=e[1]);const s=i.match(/得到([^（]+)（([^，]+)，属([^）]+)）为本卦/);s&&(c.benGuaInfo={name:s[1],palace:s[2],wuxing:s[3]});const a=i.match(/【卦辞】([^\n]+)/);a&&c.benGuaInfo&&(c.benGuaInfo.info=a[1]);const n=i.match(/世爻在第(\d)爻，应爻在第(\d)爻/);n&&c.benGuaInfo&&(c.benGuaInfo.shi=parseInt(n[1]),c.benGuaInfo.ying=parseInt(n[2]));const o=/(上爻|五爻|四爻|三爻|二爻|初爻)：([^\s]+)\s+(阳|阴)爻，([^，\n]+)/g,r=[];let l;for(;(l=o.exec(i))!==null;)r.push({position:l[1],liuShen:l[2],type:l[3],info:l[4]});r.length>0&&(c.yaos=r),c.hasMovingYao=i.includes("动爻")&&!i.includes("无动爻")}function Vt(){return c.benGuaInfo?`
        <div class="gua-section">
            <!-- 本卦 -->
            <div class="gua-card">
                <div class="gua-title">本卦</div>
                <div class="gua-name">${c.benGuaInfo.name||""}</div>
                <div class="gua-palace">${c.benGuaInfo.palace||""} · ${c.benGuaInfo.wuxing||""}</div>
                
                <!-- 六爻图形 -->
                <div class="gua-diagram">
                    ${Wt()}
                </div>
                
                <div class="gua-ci">${c.benGuaInfo.info||""}</div>
            </div>

            <!-- 变卦（如果有动爻） -->
            ${c.hasMovingYao&&c.bianGuaInfo?`
                <div class="gua-card">
                    <div class="gua-title">变卦</div>
                    <div class="gua-name">${c.bianGuaInfo.name||""}</div>
                    <div class="gua-palace">${c.bianGuaInfo.palace||""} · ${c.bianGuaInfo.wuxing||""}</div>
                    <div class="gua-diagram">
                        ${Ut()}
                    </div>
                    <div class="gua-ci">${c.bianGuaInfo.info||""}</div>
                </div>
            `:""}
        </div>
    `:""}function Wt(){return!c.yaos||c.yaos.length===0?'<div class="no-yao-info">暂无六爻详细信息</div>':c.yaos.map((i,t)=>{const e=c.benGuaInfo?.shi===6-t,s=c.benGuaInfo?.ying===6-t,a=i.type==="阳"?"▬▬▬":"▬ ▬";return`
            <div class="yao-line ${e?"shi":""} ${s?"ying":""}">
                <span class="yao-liushen">${i.liuShen||""}</span>
                <span class="yao-symbol">${a}</span>
                <span class="yao-info">${i.info||""}</span>
                ${e?'<span class="yao-tag shi-tag">世</span>':""}
                ${s?'<span class="yao-tag ying-tag">应</span>':""}
            </div>
        `}).join("")}function Ut(){return'<div class="no-yao-info">变卦信息</div>'}function Xt(){return c.hasMovingYao?`
            <div class="moving-info">
                <span class="moving-label">动爻：</span>
                <span class="moving-text">${c.movingPositions.length>0?c.movingPositions.map(t=>`第${t}爻`).join("、"):"有动爻"}</span>
            </div>
        `:`
            <div class="moving-info">
                <span class="moving-text">静卦（无动爻）</span>
            </div>
        `}function Jt(){return c.isLoading?`
        <div class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <span class="loading-title">师傅正在推算中...</span>
                <span class="loading-hint">预计需要 ${c.remainingTime} 秒</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${c.progressPercent}%"></div>
                </div>
                <span class="loading-tip">${c.loadingTip}</span>
            </div>
        </div>
    `:""}function Kt(){if(!c.aiResponse&&!c.simpleVersion&&!c.professionalVersion)return`
            <div class="no-response">
                <p>暂无解读结果</p>
                <button class="btn-ai" id="btn-ask-ai">🔮 开始解读</button>
            </div>
        `;const i=c.viewMode==="professional"||c.viewMode==="both",t=c.viewMode==="simple"||c.viewMode==="both";return`
        <div class="ai-response">
            <!-- 专业版解读 -->
            ${i?`
                <div class="version-section professional">
                    <div class="response-title">📚 专业版解读</div>
                    <div class="response-content">${O(c.professionalVersion||c.aiResponse)}</div>
                </div>
            `:""}
            
            <!-- 通俗版解读 -->
            ${t?`
                <div class="version-section simple">
                    <div class="response-title">💡 通俗版解读</div>
                    <div class="response-content">${O(c.simpleVersion||c.aiResponse)}</div>
                </div>
            `:""}
            
            <!-- 咨询入口 -->
            <div class="consult-section">
                <div class="consult-title">💬 有疑惑？欢迎咨询</div>
                <p class="consult-tip">如需进一步解读，请联系专业顾问</p>
            </div>
        </div>
    `}function O(i){if(!i)return"";let t=X(i);return t=t.replace(/### (.+)/g,"<h4>$1</h4>"),t=t.replace(/## (.+)/g,"<h3>$1</h3>"),t=t.replace(/# (.+)/g,"<h2>$1</h2>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/^\* (.+)/gm,"<li>$1</li>"),t=t.replace(/^- (.+)/gm,"<li>$1</li>"),t=t.replace(/^\d+\.\s+(.+)/gm,"<li>$1</li>"),t=t.replace(/^---$/gm,"<hr>"),t=t.replace(/\n\n/g,"</p><p>"),t=t.replace(/\n/g,"<br>"),`<p>${t}</p>`}function X(i){if(!i)return"";const t=document.createElement("div");return t.textContent=i,t.innerHTML}function Zt(i){i.querySelectorAll(".mode-tab").forEach(o=>{o.addEventListener("click",r=>{const l=r.target.dataset.mode;c.viewMode=l,w(i,{data:c})})});const t=i.querySelector("#toggle-prompt");t&&t.addEventListener("click",()=>{c.showPrompt=!c.showPrompt,w(i,{data:c})});const e=i.querySelector("#copy-prompt");e&&e.addEventListener("click",()=>{navigator.clipboard.writeText(c.aiPrompt).then(()=>{alert("提示词已复制到剪贴板")}).catch(o=>{console.error("复制失败:",o)})});const s=i.querySelector("#btn-restart");s&&s.addEventListener("click",()=>{confirm("确定要重新开始吗？")&&(localStorage.removeItem("divinationResult"),tt("home"))});const a=i.querySelector("#btn-share");a&&a.addEventListener("click",()=>{te()});const n=i.querySelector("#btn-ask-ai");n&&n.addEventListener("click",()=>{ee(i)})}function te(){const i=`🔮 六爻解读结果

问：${c.question}

${c.simpleVersion||c.aiResponse}`;navigator.share?navigator.share({title:"六爻解读结果",text:i}).catch(t=>{console.log("分享取消:",t),N(i)}):N(i)}function N(i){navigator.clipboard.writeText(i).then(()=>{alert("结果已复制到剪贴板，可以粘贴分享")}).catch(t=>{console.error("复制失败:",t)})}async function ee(i){c.isLoading=!0,c.progressPercent=0,c.remainingTime=60;const t=()=>{c.isLoading&&(c.remainingTime=Math.max(0,c.remainingTime-1),c.progressPercent=Math.min(95,c.progressPercent+1.5),c.loadingTip=G[Math.floor(c.progressPercent/12)]||G[0],w(i,{data:c}),c.isLoading&&setTimeout(t,1e3))};w(i,{data:c}),setTimeout(t,1e3);try{c.isLoading=!1,c.progressPercent=100,w(i,{data:c})}catch(e){console.error("解卦失败:",e),c.isLoading=!1,alert("解卦失败，请重试"),w(i,{data:c})}}function se(i,t={}){return w(i,t)}function Q(){const i=new Date,t=i.getFullYear(),e=String(i.getMonth()+1).padStart(2,"0"),s=String(i.getDate()).padStart(2,"0"),a=String(i.getHours()).padStart(2,"0"),n=String(i.getMinutes()).padStart(2,"0"),o=String(i.getSeconds()).padStart(2,"0");return`${t}-${e}-${s} ${a}:${n}:${o}`}function j(){console.log(`[${Q()}] ✨ 匹配游戏启动中...`),ae(),ne(),B.start(),console.log(`[${Q()}] ✨ 匹配游戏启动完成！`)}function ae(){B.register("/",at).register("/test/:type",nt).register("/test/:type/birthday",ut).register("/test/:type/tarot",gt).register("/test/:type/tarot/taboo",ft).register("/test/:type/tarot/principle",yt).register("/test/:type/tarot/shuffle",St).register("/test/:type/tarot/pick",_t).register("/test/:type/tarot/select/:slot",Tt).register("/test/:type/tarot/result-loading",Ct).register("/test/:type/tarot/result",Et).register("/pay/:type",Qt).register("/result/:id",Nt).register("/divination/result",se)}function ne(){window.showToast=ie,window.appState=D,window.router=B,document.body.addEventListener("touchmove",function(i){i.target.closest(".page-content")||i.preventDefault()},{passive:!1})}function ie(i,t="default",e=2500){const s=document.querySelector(".toast");s&&s.remove();const a=document.createElement("div");a.className=`toast ${t!=="default"?`toast--${t}`:""}`,a.textContent=i,document.body.appendChild(a),requestAnimationFrame(()=>{a.classList.add("toast--visible")}),setTimeout(()=>{a.classList.remove("toast--visible"),setTimeout(()=>a.remove(),300)},e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j();
