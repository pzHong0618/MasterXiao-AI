(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();class N{constructor(){this.routes=new Map,this.currentPage=null,this.currentParams={},this.history=[],window.addEventListener("popstate",e=>{this.handleRoute(window.location.pathname,!1)})}register(e,t){return this.routes.set(e,t),this}navigate(e,t={}){this.history.push({path:window.location.pathname,state:this.currentParams}),window.history.pushState(t,"",e),this.handleRoute(e,!0)}back(){this.history.length>0?window.history.back():this.navigate("/")}handleRoute(e,t=!0){const{handler:s,params:a}=this.matchRoute(e);if(!s){console.warn(`路由未找到: ${e}`),e!=="/"&&this.navigate("/");return}this.currentParams=a;const n=document.getElementById("app");if(!n){console.error("找不到 #app 容器");return}const r=n.querySelector(".page");r&&r.classList.add(t?"page-exit":"page-exit-back"),setTimeout(()=>{let o;if(typeof s=="function")try{o=new s(a)}catch{o=s(a)}if(o&&typeof o.render=="function"){n.innerHTML=o.render();const c=n.querySelector(".page");c&&c.classList.add(t?"page-enter":"page-enter-back"),typeof o.attachEvents=="function"&&o.attachEvents(),typeof o.init=="function"&&o.init(),this.currentPage=o}else typeof o=="string"&&(n.innerHTML=o);window.scrollTo(0,0)},r?250:0)}matchRoute(e){if(this.routes.has(e))return{handler:this.routes.get(e),params:{}};for(const[t,s]of this.routes){const a=this.extractParams(t,e);if(a!==null)return{handler:s,params:a}}return{handler:null,params:{}}}extractParams(e,t){const s=e.split("/").filter(Boolean),a=t.split("/").filter(Boolean);if(s.length!==a.length)return null;const n={};for(let r=0;r<s.length;r++)if(s[r].startsWith(":")){const o=s[r].slice(1);n[o]=decodeURIComponent(a[r])}else if(s[r]!==a[r])return null;return n}getParams(){return this.currentParams}start(){this.handleRoute(window.location.pathname,!1)}}const _=new N;window.router=_;class O{constructor(){this.state={},this.listeners=new Map,this.storageKey="matching_game_state",this.loadFromStorage()}get(e,t=null){return e in this.state?this.state[e]:t}set(e,t,s=!1){const a=this.state[e];this.state[e]=t,this.listeners.has(e)&&this.listeners.get(e).forEach(n=>{n(t,a)}),s&&this.saveToStorage()}update(e,t,s=!1){const a=this.get(e,{});this.set(e,{...a,...t},s)}delete(e){delete this.state[e],this.saveToStorage()}subscribe(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>{this.listeners.get(e).delete(t)}}saveToStorage(){try{const e={user:this.state.user,testHistory:this.state.testHistory,settings:this.state.settings};localStorage.setItem(this.storageKey,JSON.stringify(e))}catch(e){console.warn("保存状态失败:",e)}}loadFromStorage(){try{const e=localStorage.getItem(this.storageKey);if(e){const t=JSON.parse(e);this.state={...this.state,...t}}}catch(e){console.warn("加载状态失败:",e)}}clear(){this.state={},localStorage.removeItem(this.storageKey)}}const C=new O;C.set("currentTest",null);C.set("testProgress",{step:0,total:0});window.appState=C;const R=[{id:"love",icon:"💑",title:"感情匹配",description:"测试你们的契合指数",longDescription:"通过生日特质或直觉卡牌分析，深入了解你与TA之间的性格契合度，探索两人性格的互补与摩擦点。",price:29.9,category:"relationship",popular:!0,features:["性格特质分析","性格互补性评估","相处建议"]},{id:"career",icon:"💼",title:"职场关系",description:"解析职场人际关系",longDescription:"分析你与同事、领导之间的相处之道，了解职场中的潜在助力与阻力。",price:29.9,category:"career",popular:!0,features:["领导关系分析","同事相处建议","职场风险提示"]},{id:"cooperation",icon:"🤝",title:"合作关系",description:"看清合作对象，早做决定",longDescription:"评估你与潜在合作伙伴的契合度，分析合作中可能遇到的挑战与机遇。",price:29.9,category:"career",popular:!1,features:["合作契合度评分","风险预警","合作策略建议"]},{id:"thoughts",icon:"💭",title:"TA的想法和态度",description:"揭开TA的真实想法",longDescription:"通过直觉卡牌测试，探索对方内心的真实想法和对你的态度。",price:29.9,category:"relationship",popular:!0,features:["对方心理分析","真实态度解读","沟通建议"]},{id:"job",icon:"📈",title:"职业发展",description:"找到最适合你的职业方向",longDescription:"基于你的性格特征分析，为你推荐最适合的职业发展方向。",price:29.9,category:"career",popular:!1,features:["性格职业匹配","行业推荐","发展路径规划"]},{id:"city",icon:"🗺️",title:"城市方向",description:"哪座城市最适合你发展",longDescription:"根据你的出生地和性格特征，分析最适合你发展的城市方向。",price:29.9,category:"direction",popular:!1,features:["方位适配分析","城市推荐","发展建议"]},{id:"peach",icon:"🌸",title:"社交魅力",description:"测试你的社交魅力值",longDescription:"分析你近期的社交状态，了解提升人际吸引力的方式。",price:29.9,category:"relationship",popular:!0,features:["社交魅力分析","提升建议","人际关系指导"]},{id:"benefactor",icon:"⭐",title:"人脉分析",description:"发现你身边的助力者",longDescription:"分析适合你的人脉特征，帮助你识别和拓展有价值的人际关系。",price:29.9,category:"direction",popular:!1,features:["人脉特征分析","识别方法","社交建议"]},{id:"yesno",icon:"❓",title:"Yes or No",description:"犹豫时，快速帮你判断",longDescription:"面对选择犹豫不决？让直觉卡牌给你一个参考答案。",price:19.9,category:"decision",popular:!0,features:["快速测试","明确答案","行动建议"]},{id:"choice",icon:"⚖️",title:"二选一",description:"左右为难？帮你稳妥选对",longDescription:"两个选择左右为难？直觉卡牌帮你分析每个选择的利弊。",price:19.9,category:"decision",popular:!1,features:["双选对比分析","利弊权衡","最优建议"]}];function w(i){return R.find(e=>e.id===i)}function b(i={}){const{title:e="匹配游戏",showBack:t=!1,showHistory:s=!1,showProfile:a=!0,onBack:n=null}=i;return`
    <nav class="navbar">
      <div class="navbar__left">
        ${t?'<button class="navbar__back-btn" data-action="back">←</button>':""}
        <div class="navbar__logo">${e}</div>
      </div>
      <div class="navbar__actions">
        ${s?'<button class="navbar__icon-btn" data-action="history" title="历史记录">🕐</button>':""}
        ${a?'<button class="navbar__icon-btn navbar__profile-btn" data-action="profile" title="个人中心">👤</button>':""}
      </div>
    </nav>
  `}function F(i={}){const{icon:e="✨",title:t="发现你的性格契合度",subtitle:s="探索人际关系的奥秘",buttonText:a="开始测试",onButtonClick:n=null}=i;return`
    <section class="hero-banner">
      <div class="glass-card text-center animate-fade-in-up">
        <div class="hero-banner__icon animate-float">${e}</div>
        <h1 class="heading-1 mb-2">${t}</h1>
        <p class="body-text-secondary mb-4">${s}</p>
        <button class="btn btn--primary btn--lg" data-action="hero-start">
          <span>✨</span>
          <span>${a}</span>
        </button>
      </div>
    </section>
  `}function M(i,e,t={}){const{showText:s=!0,showSteps:a=!1,stepLabel:n=""}=t,r=Math.min(i/e*100,100),o=n?`<span class="progress-bar__label">${n}</span>`:"",c=s?`<div class="progress-bar__text">${i} / ${e}</div>`:"";return`
    <div class="progress-bar">
      <div class="progress-bar__track-wrapper">
        <div class="progress-bar__track">
          <div class="progress-bar__fill" style="width: ${r}%"></div>
        </div>
        ${o}
        <div class="progress-bar__track">
          <div class="progress-bar__fill" style="width: ${r}%"></div>
        </div>
      </div>
      ${c}
    </div>
  `}function j(i,e={}){const{showPrice:t=!1,showBadge:s=!0,onClick:a=null}=e,n=s&&i.popular?'<span class="feature-card__badge">热门</span>':"",r=t?`<span class="feature-card__price">¥${i.price}</span>`:"";return`
    <div class="glass-card glass-card--interactive feature-card" data-type="${i.id}">
      ${n}
      <div class="feature-card__icon">${i.icon}</div>
      <div class="feature-card__content">
        <h3 class="feature-card__title">${i.title}</h3>
        <p class="feature-card__description">${i.description}</p>
      </div>
      ${r}
      <span class="feature-card__arrow">→</span>
    </div>
  `}function G(i){return`
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
          ${i.features.map(e=>`
            <li class="feature-list__item">
              <span class="feature-list__icon">✓</span>
              <span>${e}</span>
            </li>
          `).join("")}
        </ul>
      </div>
      
    </div>
  `}class U{constructor(){this.matchTypes=R}render(){return`
      <div class="page home-page">
        ${b({title:"匹配游戏",showBack:!1,showHistory:!1,showProfile:!0})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 欢迎横幅 -->
            ${F({icon:"✨",title:"发现你的性格契合度",subtitle:"探索人际关系的奥秘",buttonText:"开始匹配..."})}

            <!-- 场景测试标题 -->
            <section class="section-header mt-6 mb-4">
              <h2 class="heading-2 text-center" style="color: var(--color-text-secondary);">
                趣味测试
              </h2>
            </section>

            <!-- 功能卡片列表 -->
            <section class="feature-list">
              ${this.matchTypes.map((e,t)=>`
                <div class="animate-fade-in-up animate-delay-${Math.min((t+1)*100,500)} animate-hidden">
                  ${j(e,{showBadge:!0})}
                </div>
              `).join("")}
            </section>

            <!-- 底部间距 -->
            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `}attachEvents(){this.initAnimations(),document.querySelectorAll(".feature-card").forEach(t=>{t.addEventListener("click",s=>{const a=t.dataset.type;this.handleFeatureClick(a)})});const e=document.querySelector('[data-action="hero-start"]');e&&e.addEventListener("click",()=>{document.querySelector(".feature-list")?.scrollIntoView({behavior:"smooth"})}),document.querySelectorAll(".navbar__icon-btn").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.action;this.handleNavAction(s)})})}initAnimations(){const e=document.querySelectorAll(".animate-hidden"),t=new IntersectionObserver(s=>{s.forEach(a=>{a.isIntersecting&&(a.target.classList.remove("animate-hidden"),t.unobserve(a.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(s=>t.observe(s))}handleFeatureClick(e){const t=new Date,s=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;console.log(`[${s}] 选择了匹配类型: ${e}`),window.router.navigate(`/test/${e}`)}handleNavAction(e){switch(e){case"history":window.showToast("历史记录功能开发中...");break;case"profile":window.router.navigate("/profile");break}}}class J{constructor(e){if(this.matchType=w(e.type),!this.matchType){window.router.navigate("/");return}}render(){return this.matchType?`
      <div class="page test-select-page">
        ${b({title:this.matchType.title,showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 匹配类型详情 -->
            <section class="mt-4 mb-6 animate-fade-in-up">
              ${G(this.matchType)}
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
    `:""}attachEvents(){const e=document.querySelector(".navbar__back-btn");e&&e.addEventListener("click",()=>{window.router.back()}),document.querySelectorAll(".method-card").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.method;this.handleMethodSelect(s)})})}handleMethodSelect(e){const t=this.matchType.id;e==="birthday"?window.router.navigate(`/test/${t}/birthday`):e==="tarot"&&window.router.navigate(`/test/${t}/tarot`)}}const D=[19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,28309,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,41696,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560],E=["正","二","三","四","五","六","七","八","九","十","冬","腊"],A=["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"],W=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],Y=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],V=["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];function K(i){let e=348;for(let t=32768;t>8;t>>=1)e+=D[i-1900]&t?1:0;return e+q(i)}function q(i){return z(i)?D[i-1900]&65536?30:29:0}function z(i){return D[i-1900]&15}function Q(i,e){return D[i-1900]&65536>>e?30:29}function Z(i,e,t){if(i<1900||i>2100)return null;const s=new Date(1900,0,31),a=new Date(i,e-1,t);let n=Math.floor((a-s)/864e5),r=1900,o=0;for(r=1900;r<2101&&n>0;r++)o=K(r),n-=o;n<0&&(n+=o,r--);const c=z(r);let l=!1,d=1;for(d=1;d<13&&n>0;d++)c>0&&d===c+1&&!l?(--d,l=!0,o=q(r)):o=Q(r,d),l&&d===c+1&&(l=!1),n-=o;n===0&&c>0&&d===c+1&&(l?l=!1:(l=!0,--d)),n<0&&(n+=o,--d);const p=n+1,m=W[(r-4)%10]+Y[(r-4)%12],u=V[(r-4)%12];return{lunarYear:r,lunarMonth:d,lunarDay:p,isLeap:l,ganzhiYear:m,animal:u,yearStr:`${r}年`,monthStr:`${l?"闰":""}${E[d-1]}月`,dayStr:A[p-1],fullStr:`农历${r}年 ${m}年（${u}年） ${l?"闰":""}${E[d-1]}月${A[p-1]}`}}function x(i){if(!i)return"";const[e,t,s]=i.split("-").map(Number),a=Z(e,t,s);return a?a.fullStr:"日期超出范围"}class X{constructor(e){if(this.matchType=w(e.type),!this.matchType){window.router.navigate("/");return}this.formData={personA:{name:"",gender:"",birthDate:"",lunarDate:""},personB:{name:"",gender:"",birthDate:"",lunarDate:""}},this.currentStep=1}render(){return this.matchType?`
      <div class="page birthday-input-page">
        ${b({title:"生日匹配",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示 -->
            <section class="progress-section mt-4 mb-6">
              ${M(this.currentStep,2,{showText:!1,showSteps:!1,stepLabel:`步骤 ${this.currentStep}/2：输入${this.currentStep===1?"你的":"对方的"}信息`})}
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
    `:""}renderPersonAInfo(){const e=this.formData.personA,t=this.formData.personB,s=e.gender==="male"?"👨":e.gender==="female"?"👩":"👤",a=t.gender==="male"?"👨":t.gender==="female"?"👩":"👤";return`
      <section class="persons-info mt-4 animate-fade-in">
        <div class="persons-info__cards">
          <!-- 甲方信息卡片 -->
          <div class="person-card ${this.currentStep===1?"person-card--active":""}" data-person="A">
            <div class="person-card__top">
              <span class="person-avatar">${s}</span>
              <div class="person-card__info">
                <p class="person-card__name">${e.name||"甲方"}</p>
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
          
          <!-- 乙方信息卡片 -->
          <div class="person-card ${this.currentStep===2?"person-card--active":""}" data-person="B">
            <div class="person-card__top">
              <span class="person-avatar">${a}</span>
              <div class="person-card__info">
                <p class="person-card__name">${t.name||"乙方"}</p>
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
        </div>
      </section>
    `}attachEvents(){const e=document.querySelector(".navbar__back-btn");e&&e.addEventListener("click",()=>{this.currentStep===2?this.goBackStep():window.router.back()}),document.querySelectorAll(".person-card").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.person;this.switchToPerson(c)})}),document.querySelectorAll(".gender-btn").forEach(o=>{o.addEventListener("click",()=>{this.selectGender(o.dataset.gender)})});const t=document.getElementById("name"),s=document.getElementById("birthDate"),a=document.getElementById("date-input-wrapper");t&&t.addEventListener("input",()=>this.validateForm()),s&&s.addEventListener("change",()=>{this.updateLunarDate(s.value),this.validateForm()}),a&&s&&a.addEventListener("click",()=>{s.type==="text"&&(s.type="date",s.removeAttribute("readonly")),setTimeout(()=>{s.showPicker?.(),s.focus()},0)});const n=document.querySelector('[data-action="next"]');n&&(n.onclick=o=>{console.log("点击了下一步/开始分析按钮"),console.log("当前步骤:",this.currentStep),console.log("表单数据:",JSON.stringify(this.formData)),this.handleNext()});const r=document.querySelector('[data-action="back-step"]');r&&(r.onclick=()=>{console.log("点击了上一步按钮"),this.goBackStep()})}selectGender(e){document.querySelectorAll(".gender-btn").forEach(t=>{t.classList.toggle("active",t.dataset.gender===e)}),this.currentStep===1?this.formData.personA.gender=e:this.formData.personB.gender=e,this.updatePersonCards(),this.validateForm()}updatePersonCards(){if(document.querySelectorAll(".person-card").length===0)return;const t=document.querySelector('[data-person="A"] .person-avatar');if(t){const a=this.formData.personA.gender;t.textContent=a==="male"?"👨":a==="female"?"👩":"👤"}const s=document.querySelector('[data-person="B"] .person-avatar');if(s){const a=this.formData.personB.gender;s.textContent=a==="male"?"👨":a==="female"?"👩":"👤"}}validateForm(){const e=document.getElementById("name")?.value.trim(),t=document.getElementById("birthDate")?.value,s=this.currentStep===1?this.formData.personA.gender:this.formData.personB.gender,a=e&&t&&s;console.log("validateForm:",{name:e,birthDate:t,gender:s,isValid:a,step:this.currentStep});const n=document.querySelector('[data-action="next"]');return n&&(n.disabled=!a),this.updateCurrentPersonCard(e,t,s),a&&this.autoNavigateNext(),a}autoNavigateNext(){this.autoNavTimer&&clearTimeout(this.autoNavTimer),this.autoNavTimer=setTimeout(()=>{const e=document.getElementById("name")?.value.trim(),t=document.getElementById("birthDate")?.value,s=this.currentStep===1?this.formData.personA.gender:this.formData.personB.gender;if(e&&t&&s){const a=t?x(t):"",n=this.currentStep===1?"personA":"personB";this.formData[n].name=e,this.formData[n].birthDate=t,this.formData[n].lunarDate=a;const r=this.currentStep===1?"personB":"personA",o=this.formData[r],c=o.name&&o.birthDate&&o.gender;this.currentStep===1&&!c&&(this.currentStep=2,this.rerender())}},500)}updateCurrentPersonCard(e,t,s){const a=this.currentStep===1?"A":"B",n=document.querySelector(`[data-person="${a}"]`);if(!n)return;const r=n.querySelector(".person-avatar");r&&(r.textContent=s==="male"?"👨":s==="female"?"👩":"👤");const o=n.querySelector(".person-card__name");o&&(o.textContent=e||(a==="A"?"甲方":"乙方"));const c=n.querySelector(".person-card__date");c&&(c.textContent=t||"未填写");const l=n.querySelector(".person-card__lunar");if(t){const p=x(t);if(l)l.textContent=p;else{const m=document.createElement("p");m.className="person-card__lunar",m.textContent=p,n.appendChild(m)}}else l&&l.remove();const d=n.querySelector(".badge");if(d){const p=e&&t&&s;d.className=`badge ${p?"badge--success":"badge--secondary"}`,d.textContent=p?"已填写":"待填写"}}updateLunarDate(e){const t=document.getElementById("lunar-date"),s=t?.querySelector(".lunar-text");if(!(!t||!s))if(e){const a=x(e);s.textContent=`农历：${a}`,t.style.display="flex"}else t.style.display="none"}handleNext(){if(console.log("handleNext 被调用"),!this.validateForm()){console.log("表单验证未通过，返回");return}const e=document.getElementById("name").value.trim(),t=document.getElementById("birthDate").value,s=t?x(t):"";console.log("表单数据:",{name:e,birthDate:t,lunarDate:s}),this.currentStep===1?(this.formData.personA.name=e,this.formData.personA.birthDate=t,this.formData.personA.lunarDate=s,this.currentStep=2,this.rerender()):(this.formData.personB.name=e,this.formData.personB.birthDate=t,this.formData.personB.lunarDate=s,console.log("准备提交测试，跳转到结果页"),this.submitTest())}goBackStep(){this.currentStep===2&&(this.saveCurrentFormData(),this.currentStep=1,this.rerender())}saveCurrentFormData(){const e=document.getElementById("name")?.value.trim()||"",t=document.getElementById("birthDate")?.value||"",s=t?x(t):"",a=this.currentStep===1?"personA":"personB";this.formData[a].name=e,this.formData[a].birthDate=t,this.formData[a].lunarDate=s}switchToPerson(e){const t=e==="A"?1:2;t!==this.currentStep&&(this.saveCurrentFormData(),this.currentStep=t,this.rerender())}rerender(){const e=document.getElementById("app"),t=document.querySelector(".form-section");t&&t.classList.add("fade-out"),setTimeout(()=>{e.innerHTML=this.render(),this.attachEvents();const s=this.currentStep===1?this.formData.personA:this.formData.personB;if(s.name&&(document.getElementById("name").value=s.name),s.birthDate&&(document.getElementById("birthDate").value=s.birthDate,this.updateLunarDate(s.birthDate)),s.gender)this.selectGender(s.gender);else if(this.currentStep===2&&!this.formData.personB.gender){const n=this.formData.personA.gender==="male"?"female":"male";this.selectGender(n)}this.validateForm();const a=document.querySelector(".form-section");a&&a.classList.add("fade-in")},150)}submitTest(){console.log("submitTest 被调用");const e={type:this.matchType.id,method:"birthday",personA:{name:this.formData.personA.name,gender:this.formData.personA.gender==="male"?"男":"女",birthDate:this.formData.personA.birthDate},personB:{name:this.formData.personB.name,gender:this.formData.personB.gender==="male"?"男":"女",birthDate:this.formData.personB.birthDate},timestamp:Date.now()};console.log("测试数据:",JSON.stringify(e)),window.appState.set("currentTest",e),console.log("准备跳转到 /result/birthday"),window.router.navigate("/result/birthday")}}const ee=[{id:0,name:"愚者",symbol:"🃏",upright:"新的开始、冒险精神、纯真",reversed:"冲动、缺乏计划",element:"风"},{id:1,name:"魔术师",symbol:"🎩",upright:"创造力、自信、技能",reversed:"缺乏方向、能力受限",element:"风"},{id:2,name:"女祭司",symbol:"🌙",upright:"直觉、智慧、内在洞察",reversed:"忽视直觉、信息不足",element:"水"},{id:3,name:"皇后",symbol:"👑",upright:"丰饶、关爱、创造力",reversed:"过度依赖、创造力受阻",element:"土"},{id:4,name:"皇帝",symbol:"🏛️",upright:"权威、稳定、领导力",reversed:"过于控制、缺乏灵活",element:"火"},{id:5,name:"教皇",symbol:"📿",upright:"传统、指导、精神追求",reversed:"思想僵化、缺乏创新",element:"土"},{id:6,name:"恋人",symbol:"💕",upright:"爱情、和谐、选择",reversed:"关系失衡、选择困难",element:"风"},{id:7,name:"战车",symbol:"🏇",upright:"胜利、决心、行动力",reversed:"方向不明、缺乏控制",element:"水"},{id:8,name:"力量",symbol:"🦁",upright:"内在力量、勇气、耐心",reversed:"自我怀疑、缺乏信心",element:"火"},{id:9,name:"隐士",symbol:"🏔️",upright:"内省、寻求智慧、独处",reversed:"孤立、过度封闭",element:"土"},{id:10,name:"机遇之轮",symbol:"🎡",upright:"转变、机遇、新阶段",reversed:"逆境、抗拒改变",element:"火"},{id:11,name:"正义",symbol:"⚖️",upright:"公平、真相、因果",reversed:"不公、逃避责任",element:"风"},{id:12,name:"倒吊人",symbol:"🙃",upright:"新视角、牺牲、等待",reversed:"拖延、无谓牺牲",element:"水"},{id:13,name:"死神",symbol:"🦋",upright:"转变、结束与新生",reversed:"抗拒改变、停滞",element:"水"},{id:14,name:"节制",symbol:"🏺",upright:"平衡、耐心、调和",reversed:"失衡、过度",element:"火"},{id:15,name:"恶魔",symbol:"🔗",upright:"束缚、欲望、物质",reversed:"解脱、摆脱限制",element:"土"},{id:16,name:"塔",symbol:"🗼",upright:"突变、觉醒、重建",reversed:"逃避改变、延迟",element:"火"},{id:17,name:"星星",symbol:"⭐",upright:"希望、灵感、平静",reversed:"失望、缺乏信心",element:"风"},{id:18,name:"月亮",symbol:"🌙",upright:"直觉、潜意识、情绪",reversed:"困惑、恐惧",element:"水"},{id:19,name:"太阳",symbol:"☀️",upright:"快乐、成功、活力",reversed:"暂时受阻、过度乐观",element:"火"},{id:20,name:"审判",symbol:"📯",upright:"觉醒、评估、新阶段",reversed:"自我批判、拒绝改变",element:"火"},{id:21,name:"世界",symbol:"🌍",upright:"完成、整合、成就",reversed:"未完成、缺乏闭合",element:"土"}];function te(i){return i>=5?{type:"very_positive",name:"强正向能量",symbol:"☀️",description:"整体能量非常积极正面",score:85+Math.floor(Math.random()*10)}:i>=4?{type:"positive",name:"正向能量",symbol:"⭐",description:"整体趋势积极向好",score:70+Math.floor(Math.random()*15)}:i>=3?{type:"balanced",name:"平衡能量",symbol:"⚖️",description:"需要双方共同努力",score:55+Math.floor(Math.random()*15)}:i>=2?{type:"challenging",name:"挑战能量",symbol:"🌙",description:"存在一些需要面对的挑战",score:40+Math.floor(Math.random()*15)}:{type:"reflective",name:"反思能量",symbol:"🌑",description:"建议暂时观望，内省调整",score:25+Math.floor(Math.random()*15)}}function se(i=[]){const e=ee.filter(n=>!i.includes(n.id)),t=Math.floor(Math.random()*e.length),s=e[t],a=Math.random()>.5;return{...s,isUpright:a,meaning:a?s.upright:s.reversed,position:a?"正位":"逆位"}}function ae(i=6){const e=[],t=[];for(let s=0;s<i;s++){const a=se(e);e.push(a.id),t.push(a)}return t}function ne(i,e){const t=i.filter(n=>n.isUpright).length,s=te(t),a={love:ie(i,s),career:re(i,s),cooperation:oe(i,s),thoughts:ce(i,s),job:le(i,s),city:de(i,s),peach:pe(i,s),benefactor:ue(i,s),yesno:me(i,s),choice:he(i,s)};return{cards:i,energy:s,reading:a[e]||ge(i,s),score:s.score,disclaimer:"本测试结果仅供娱乐参考，不构成任何专业建议。请理性看待测试结果。"}}function ie(i,e){return{very_positive:"双方性格特质显示出高度的契合与互补，建议珍惜这份默契，通过良好沟通进一步增进了解。",positive:"整体契合度良好，双方在某些方面存在互补优势。建议保持开放的心态，多创造共同话题。",balanced:"双方需要更多的理解与磨合。建议增加沟通频率，尊重彼此的差异性。",challenging:"存在一些性格差异需要面对。建议放慢节奏，先从朋友的角度相互了解。",reflective:"当前可能不是最佳时机，建议先专注于自我提升，给彼此一些空间和时间。"}[e.type]}function re(i,e){return{very_positive:"职场人际关系处于良好状态，团队协作顺利。建议继续保持积极主动的工作态度。",positive:"与同事/领导的关系整体和谐，存在良好的合作基础。建议适时表达自己的想法。",balanced:"职场关系需要更多经营。建议主动沟通，明确各自的职责和期望。",challenging:"可能存在一些沟通障碍。建议换位思考，避免不必要的误解。",reflective:"建议暂时观察，调整自己的工作方式，寻找更合适的切入点。"}[e.type]}function oe(i,e){return{very_positive:"合作前景看好，双方目标一致且互有优势。建议明确分工，发挥各自所长。",positive:"合作基础良好，但需要建立清晰的规则。建议签订书面协议，明确权责。",balanced:"合作需要更多磨合。建议先进行小规模试点，再决定是否深入合作。",challenging:"存在一些潜在风险。建议充分调研，做好风险评估后再做决定。",reflective:"当前时机可能不够成熟。建议暂缓决定，继续观察和收集信息。"}[e.type]}function ce(i,e){return{very_positive:"对方对你持有积极正面的印象，对你的关注度较高。建议主动创造交流机会。",positive:"对方对你有一定好感，但可能还在观察阶段。建议保持自然，展现真实的自己。",balanced:"对方的态度比较中立，需要更多互动来加深印象。建议找到共同话题。",challenging:"对方可能有一些顾虑或保留。建议给对方一些时间和空间。",reflective:"对方当前可能有其他关注的事情。建议暂时减少期待，专注于自我成长。"}[e.type]}function le(i,e){return{very_positive:"职业发展前景乐观，当前方向正确。建议继续精进专业技能，把握机会。",positive:"职业道路整体顺利，有上升空间。建议拓展人脉，增加曝光度。",balanced:"职业发展需要更明确的规划。建议设定阶段性目标，稳步前进。",challenging:"可能遇到一些瓶颈。建议学习新技能，寻找突破点。",reflective:"建议暂停下来思考真正想要的方向，必要时可以寻求职业咨询。"}[e.type]}function de(i,e){return{very_positive:"所选方向非常适合你的发展，建议积极准备，把握机会。",positive:"整体方向不错，有发展潜力。建议做好调研，了解当地情况。",balanced:"各有利弊，需要综合考量。建议列出优缺点，根据自身情况决定。",challenging:"可能存在一些适应挑战。建议先短期尝试，再做长期决定。",reflective:"当前可能不是最佳时机。建议暂缓决定，继续收集信息。"}[e.type]}function pe(i,e){return{very_positive:"社交魅力值很高，人际吸引力强。建议多参加社交活动，展现自我。",positive:"社交状态良好，有不错的人缘。建议保持真诚，拓展社交圈。",balanced:"社交能力需要提升。建议主动学习社交技巧，增加互动。",challenging:"可能有些社交压力。建议放松心态，从小范围社交开始。",reflective:"建议暂时关注内在修养，提升自信后再拓展社交。"}[e.type]}function ue(i,e){return{very_positive:"身边有潜在的助力者，建议留意那些愿意给你建议的人。",positive:"有获得帮助的机会，建议主动寻求指导，虚心请教。",balanced:"需要自己主动出击。建议扩大社交圈，建立有价值的人脉关系。",challenging:"当前主要依靠自己。建议提升自身能力，吸引志同道合的人。",reflective:"建议先专注于自我成长，好的人脉关系自然会到来。"}[e.type]}function me(i,e){return{very_positive:"从测试结果看，可以积极行动，但仍需做好充分准备。",positive:"整体倾向积极，建议在做好规划后行动。",balanced:"需要更多信息才能做出判断。建议收集更多资料后再决定。",challenging:"建议暂缓行动，等待更好的时机。",reflective:"当前不建议仓促决定，给自己更多思考时间。"}[e.type]}function he(i,e){return{very_positive:"两个选择都有其优势，建议选择更符合长期目标的选项。",positive:"其中一个选择略占优势，建议综合考虑后做决定。",balanced:"两个选择各有利弊，建议列出详细对比，理性分析。",challenging:"两个选择都存在挑战，建议寻找第三种可能。",reflective:"建议暂时不做选择，给自己更多时间考虑。"}[e.type]}function ge(i,e){return e.description+"建议保持开放的心态，理性看待测试结果。"}class ve{constructor(e){if(this.matchType=w(e.type),!this.matchType){window.router.navigate("/");return}this.currentRound=0,this.totalRounds=3,this.cardsPerRound=6,this.selectCount=3,this.results=[],this.isFlipping=!1,this.cardStates=new Array(this.cardsPerRound).fill(!1),this.currentCards=[],this.selectedCards=[],this.allSelectedCards=[],this.initRoundCards()}initRoundCards(){this.allSelectedCards.map(e=>e.id),this.currentCards=ae(this.cardsPerRound),this.cardStates=new Array(this.cardsPerRound).fill(!1),this.selectedCards=[]}render(){return this.matchType?`
      <div class="page tarot-page">
        ${b({title:"直觉卡牌测试",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示 -->
            <section class="progress-section mt-4 mb-4">
              ${M(this.currentRound,this.totalRounds,{showText:!0})}
            </section>

            <!-- 指引说明 -->
            <section class="instruction-section mb-4 animate-fade-in-up">
              <div class="glass-card text-center">
                <div class="instruction-icon animate-float">🃏</div>
                <h3 class="heading-3 mb-2">第 ${this.currentRound+1} 轮抽牌</h3>
                <p class="body-text-secondary">
                  ${this.getInstructionText()}
                </p>
              </div>
            </section>

            <!-- 问题展示 -->
            <section class="question-section mb-4 animate-fade-in-up animate-delay-100">
              <div class="glass-card glass-card--light text-center">
                <p class="small-text" style="color: var(--color-primary);">测试问题</p>
                <p class="body-text mt-2">
                  ${this.getQuestionText()}
                </p>
              </div>
            </section>

            <!-- 翻牌区域 -->
            <section class="cards-section mb-4 animate-fade-in-up animate-delay-200">
              <div class="flip-cards-container">
                ${this.renderFlipCards()}
              </div>
              <p class="text-center small-text mt-3" id="card-hint">
                ${this.getCardHint()}
              </p>
            </section>

            <!-- 已完成的轮次展示 -->
            ${this.results.length>0?this.renderCompletedRounds():""}

            <!-- 免责声明 -->
            <section class="disclaimer-section mt-4 mb-4">
              <p class="text-center small-text" style="color: var(--color-text-tertiary);">
                本测试仅供娱乐参考，不构成任何专业建议
              </p>
            </section>

          </div>
        </main>

        <!-- 底部操作栏 -->
        ${this.renderBottomBar()}
      </div>
    `:""}getInstructionText(){const e=["静下心来，凭直觉从下方6张牌中选择3张翻开","继续保持专注，再选择3张牌","最后一轮，完成你的选择"];return e[this.currentRound]||e[0]}getQuestionText(){return{love:"你和TA的性格契合度如何？",career:"你和同事/领导的关系如何？",cooperation:"这次合作是否值得？",thoughts:"TA对你的真实想法是什么？",job:"你的职业发展方向如何？",city:"哪个方向更适合你发展？",peach:"你的社交魅力如何？",benefactor:"谁是你身边的助力者？",yesno:"这件事应该做吗？",choice:"两个选择哪个更好？"}[this.matchType.id]||"你面临的问题将如何发展？"}getCardHint(){const e=this.cardStates.filter(t=>t).length;return e>=this.selectCount?"本轮选择完成，点击下方按钮继续":`请选择 ${this.selectCount-e} 张牌`}renderFlipCards(){return`
      <div class="flip-cards-grid">
        ${this.currentCards.map((e,t)=>`
          <div class="flip-card-wrapper ${this.cardStates[t]?"selected":""}" data-card-index="${t}">
            <div class="flip-card ${this.cardStates[t]?"flipped":""}">
              <!-- 背面 -->
              <div class="flip-card__face flip-card__back">
                <div class="flip-card__pattern">
                  <span class="pattern-symbol">✦</span>
                  <span class="pattern-number">${t+1}</span>
                </div>
              </div>
              <!-- 正面 -->
              <div class="flip-card__face flip-card__front">
                <div class="flip-card__result">
                  ${this.cardStates[t]?e.symbol:""}
                </div>
                <div class="flip-card__name">
                  ${this.cardStates[t]?e.name:""}
                </div>
                <div class="flip-card__label ${this.cardStates[t]?e.isUpright?"upright":"reversed":""}">
                  ${this.cardStates[t]?e.position:""}
                </div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}renderCompletedRounds(){return`
      <section class="completed-rounds mt-4 animate-fade-in">
        <h4 class="small-text text-center mb-3" style="color: var(--color-text-tertiary);">
          已翻开的牌
        </h4>
        <div class="selected-cards-display">
          ${this.allSelectedCards.map((e,t)=>`
            <div class="selected-card-item">
              <span class="card-symbol">${e.symbol}</span>
              <span class="card-name">${e.name}</span>
              <span class="card-position ${e.isUpright?"upright":"reversed"}">${e.position}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `}renderBottomBar(){const e=this.cardStates.filter(s=>s).length;return e>=this.selectCount?`
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__buttons">
          <button class="btn btn--primary btn--full" data-action="next-round">
            ${this.currentRound>=this.totalRounds-1?"查看结果":"下一轮"}
          </button>
        </div>
      </div>
    `:`
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__info text-center">
          <span class="small-text">已选 ${e}/${this.selectCount} 张 · 第 ${this.currentRound+1}/${this.totalRounds} 轮</span>
        </div>
      </div>
    `}attachEvents(){const e=document.querySelector(".navbar__back-btn");e&&e.addEventListener("click",()=>{this.currentRound>0||this.allSelectedCards.length>0?confirm("确定要退出吗？当前进度将丢失。")&&window.router.back():window.router.back()}),document.querySelectorAll(".flip-card-wrapper").forEach(s=>{s.addEventListener("click",()=>{const a=parseInt(s.dataset.cardIndex);this.flipCard(a)})});const t=document.querySelector('[data-action="next-round"]');t&&t.addEventListener("click",()=>{this.handleNextRound()})}flipCard(e){const t=this.cardStates.filter(n=>n).length;if(this.cardStates[e]||this.isFlipping||t>=this.selectCount)return;this.isFlipping=!0,this.cardStates[e]=!0;const s=document.querySelector(`[data-card-index="${e}"]`),a=s.querySelector(".flip-card");a.classList.add("flipped"),s.classList.add("selected"),this.selectedCards.push(this.currentCards[e]),setTimeout(()=>{const n=this.currentCards[e],r=a.querySelector(".flip-card__result"),o=a.querySelector(".flip-card__name"),c=a.querySelector(".flip-card__label");r.textContent=n.symbol,o.textContent=n.name,c.textContent=n.position,c.classList.add(n.isUpright?"upright":"reversed"),this.isFlipping=!1;const l=document.getElementById("card-hint");l&&(l.textContent=this.getCardHint()),this.updateBottomBar(),this.cardStates.filter(p=>p).length>=this.selectCount&&this.completeRound()},300)}updateBottomBar(){const e=document.querySelector(".bottom-action-bar");if(e){const t=this.cardStates.filter(a=>a).length;if(t>=this.selectCount){const a=this.currentRound>=this.totalRounds-1;e.innerHTML=`
          <div class="action-bar__buttons">
            <button class="btn btn--primary btn--full" data-action="next-round">
              ${a?"查看结果":"下一轮"}
            </button>
          </div>
        `;const n=e.querySelector('[data-action="next-round"]');n&&n.addEventListener("click",()=>{this.handleNextRound()})}else e.innerHTML=`
          <div class="action-bar__info text-center">
            <span class="small-text">已选 ${t}/${this.selectCount} 张 · 第 ${this.currentRound+1}/${this.totalRounds} 轮</span>
          </div>
        `}}completeRound(){this.allSelectedCards.push(...this.selectedCards),this.results.push({round:this.currentRound+1,cards:[...this.selectedCards]}),this.updateBottomBar()}handleNextRound(){this.currentRound<this.totalRounds-1?(this.currentRound++,this.initRoundCards(),this.rerender()):this.completeTest()}rerender(){const e=document.getElementById("app");e.innerHTML=this.render(),this.attachEvents()}completeTest(){const e=ne(this.allSelectedCards,this.matchType.id);window.appState.set("currentTest",{type:this.matchType.id,method:"tarot",results:this.results,allCards:this.allSelectedCards,reading:e,timestamp:Date.now()}),window.router.navigate("/result/tarot")}}const fe="modulepreload",ye=function(i){return"/"+i},k={},be=function(e,t,s){let a=Promise.resolve();if(t&&t.length>0){let l=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};var r=l;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");a=l(t.map(d=>{if(d=ye(d),d in k)return;k[d]=!0;const p=d.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const u=document.createElement("link");if(u.rel=p?"stylesheet":fe,p||(u.as="script"),u.crossOrigin="",u.href=d,c&&u.setAttribute("nonce",c),document.head.appendChild(u),p)return new Promise((S,h)=>{u.addEventListener("load",S),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return a.then(o=>{for(const c of o||[])c.status==="rejected"&&n(c.reason);return e().catch(n)})},f=[{index:0,name:"甲",element:"木",nature:"阳",color:"#4CAF50"},{index:1,name:"乙",element:"木",nature:"阴",color:"#8BC34A"},{index:2,name:"丙",element:"火",nature:"阳",color:"#F44336"},{index:3,name:"丁",element:"火",nature:"阴",color:"#E91E63"},{index:4,name:"戊",element:"土",nature:"阳",color:"#795548"},{index:5,name:"己",element:"土",nature:"阴",color:"#A1887F"},{index:6,name:"庚",element:"金",nature:"阳",color:"#FFD700"},{index:7,name:"辛",element:"金",nature:"阴",color:"#FFC107"},{index:8,name:"壬",element:"水",nature:"阳",color:"#2196F3"},{index:9,name:"癸",element:"水",nature:"阴",color:"#03A9F4"}],y=[{index:0,name:"子",element:"水",nature:"阳",animal:"鼠"},{index:1,name:"丑",element:"土",nature:"阴",animal:"牛"},{index:2,name:"寅",element:"木",nature:"阳",animal:"虎"},{index:3,name:"卯",element:"木",nature:"阴",animal:"兔"},{index:4,name:"辰",element:"土",nature:"阳",animal:"龙"},{index:5,name:"巳",element:"火",nature:"阴",animal:"蛇"},{index:6,name:"午",element:"火",nature:"阳",animal:"马"},{index:7,name:"未",element:"土",nature:"阴",animal:"羊"},{index:8,name:"申",element:"金",nature:"阳",animal:"猴"},{index:9,name:"酉",element:"金",nature:"阴",animal:"鸡"},{index:10,name:"戌",element:"土",nature:"阳",animal:"狗"},{index:11,name:"亥",element:"水",nature:"阴",animal:"猪"}],$={木:{generates:"火",overcomes:"土",generatedBy:"水",overcomedBy:"金",color:"#4CAF50",emoji:"🌳"},火:{generates:"土",overcomes:"金",generatedBy:"木",overcomedBy:"水",color:"#F44336",emoji:"🔥"},土:{generates:"金",overcomes:"水",generatedBy:"火",overcomedBy:"木",color:"#795548",emoji:"🏔️"},金:{generates:"水",overcomes:"木",generatedBy:"土",overcomedBy:"火",color:"#FFD700",emoji:"🔶"},水:{generates:"木",overcomes:"火",generatedBy:"金",overcomedBy:"土",color:"#2196F3",emoji:"💧"}},T=[{name:"立春",month:1,day:4},{name:"惊蛰",month:2,day:6},{name:"清明",month:3,day:5},{name:"立夏",month:4,day:6},{name:"芒种",month:5,day:6},{name:"小暑",month:6,day:7},{name:"立秋",month:7,day:8},{name:"白露",month:8,day:8},{name:"寒露",month:9,day:9},{name:"立冬",month:10,day:8},{name:"大雪",month:11,day:7},{name:"小寒",month:12,day:6}];function xe(i,e,t){const s=T[0];(e<s.month+1||e===s.month+1&&t<s.day)&&(i-=1);const a=(i-4)%10,n=(i-4)%12;return{tiangan:f[a],dizhi:y[n],ganzhi:f[a].name+y[n].name}}function $e(i,e,t){let s=e-1;for(let l=T.length-1;l>=0;l--){const d=T[l];if(e>d.month+1||e===d.month+1&&t>=d.day){s=l;break}}s===11&&e===1&&(i-=1);const a=(i-4)%10,o=([2,4,6,8,0][a%5]+s)%10,c=(s+2)%12;return{tiangan:f[o],dizhi:y[c],ganzhi:f[o].name+y[c].name}}function we(i,e,t){const s=new Date(1900,0,31),n=new Date(i,e-1,t).getTime()-s.getTime(),r=Math.floor(n/(1e3*60*60*24)),o=(r%10+10)%10,c=(r%12+12)%12;return{tiangan:f[o],dizhi:y[c],ganzhi:f[o].name+y[c].name}}function L(i){const e=new Date(i),t=e.getFullYear(),s=e.getMonth()+1,a=e.getDate(),n=xe(t,s,a),r=$e(t,s,a),o=we(t,s,a);return{year:n,month:r,day:o,fullName:`${n.ganzhi} ${r.ganzhi} ${o.ganzhi}`,elements:Se(n,r,o)}}function Se(i,e,t){const s={金:0,木:0,水:0,火:0,土:0};[i,e,t].forEach(r=>{s[r.tiangan.element]+=1,s[r.dizhi.element]+=1});let a={element:"",count:0},n={element:"",count:1/0};return Object.entries(s).forEach(([r,o])=>{o>a.count&&(a={element:r,count:o}),o<n.count&&(n={element:r,count:o})}),{distribution:s,strongest:a,weakest:n,yongshen:n.element}}function _e(i,e){const t={score:0,details:[],conclusion:""};Ce(i.day.tiangan.name,e.day.tiangan.name).isHe&&(t.score+=10,t.details.push({type:"positive",title:"日干相合",description:`${i.day.tiangan.name}${e.day.tiangan.name}相合，性格特质高度契合`})),De(i.year.dizhi.name,e.year.dizhi.name).isLiuhe&&(t.score+=8,t.details.push({type:"positive",title:"年支六合",description:`${i.year.dizhi.name}${e.year.dizhi.name}六合，家庭背景融洽`}));const n=Be(i.elements,e.elements);t.score+=n.score,t.details.push(...n.details);const r=Te(i,e);return t.score-=r.penalty,t.details.push(...r.details),t.score=Math.max(0,Math.min(100,t.score+50)),t.conclusion=Ee(t.score,t.details),t}function Ce(i,e){const t={甲己:"土",己甲:"土",乙庚:"金",庚乙:"金",丙辛:"水",辛丙:"水",丁壬:"木",壬丁:"木",戊癸:"火",癸戊:"火"},s=i+e;return{isHe:s in t,element:t[s]||null}}function De(i,e){const t={子丑:"土",丑子:"土",寅亥:"木",亥寅:"木",卯戌:"火",戌卯:"火",辰酉:"金",酉辰:"金",巳申:"水",申巳:"水",午未:"土",未午:"土"},s=i+e;return{isLiuhe:s in t,element:t[s]||null}}function Be(i,e){const t={score:0,details:[]},s=i.weakest.element,a=e.weakest.element,n=i.strongest.element,r=e.strongest.element;return s===r&&(t.score+=8,t.details.push({type:"positive",title:"五行互补",description:`对方${$[r].emoji}${r}可以弥补你${$[s].emoji}${s}的不足`})),a===n&&(t.score+=8,t.details.push({type:"positive",title:"五行互补",description:`你的${$[n].emoji}${n}可以弥补对方${$[a].emoji}${a}的不足`})),t}function Te(i,e){const t={penalty:0,details:[]},s=["子午","丑未","寅申","卯酉","辰戌","巳亥"];return[{pillarsA:i.year,pillarsB:e.year,name:"年柱"},{pillarsA:i.day,pillarsB:e.day,name:"日柱"}].forEach(({pillarsA:n,pillarsB:r,name:o})=>{const c=n.dizhi.name+r.dizhi.name,l=r.dizhi.name+n.dizhi.name;(s.includes(c)||s.includes(l))&&(t.penalty+=5,t.details.push({type:"negative",title:`${o}相冲`,description:`${n.dizhi.name}${r.dizhi.name}相冲，可能会有意见分歧`}))}),t}function Ee(i,e){const t=e.filter(a=>a.type==="positive").length,s=e.filter(a=>a.type==="negative").length;return i>=80?"A和B互利：双方性格特质高度契合，非常适合建立良好关系。":i>=60?t>s?"A利B，B不利A：你在这段关系中付出较多，但整体是积极的。":"A不利B，B利A：对方在这段关系中获益更多。":i>=40?"A和B相互不利：双方性格有一定差异，需要更多包容和理解。":"A和B相互不利：分析显示双方差异较大，建议谨慎考虑。"}function Ae(i,e,t=50){return new Promise(s=>{let a=0;i.textContent="";const n=setInterval(()=>{a<e.length?(i.textContent+=e.charAt(a),a++):(clearInterval(n),s())},t)})}const H="http://localhost:3000/api";async function g(i,e={}){const t=`${H}${i}`,s={"Content-Type":"application/json"},a=localStorage.getItem("auth_token");a&&(s.Authorization=`Bearer ${a}`);const n={...e,headers:{...s,...e.headers}};try{const r=await fetch(t,n),o=await r.json();if(!r.ok)throw new v(o.error?.message||"请求失败",o.error?.code,r.status);return o}catch(r){throw r instanceof v?r:new v("网络连接失败，请检查网络","NETWORK_ERROR",0)}}class v extends Error{constructor(e,t,s){super(e),this.code=t,this.status=s}}const ke={async birthday(i){return g("/analysis/birthday",{method:"POST",body:JSON.stringify(i)})},async birthMatchStream(i,{onChunk:e,onDone:t,onError:s,signal:a}){try{const n=await fetch(`${H}/analysis/birthMatch`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),signal:a});if(!n.ok){const l=await n.json();throw new v(l.error?.message||"请求失败",l.error?.code,n.status)}const r=n.body.getReader(),o=new TextDecoder;let c="";for(;;){const{done:l,value:d}=await r.read();if(l)break;const m=o.decode(d,{stream:!0}).split(`

`).filter(u=>u.trim());for(const u of m)if(u.startsWith("data: ")){const S=u.slice(6);if(S==="[DONE]"){t?.(c);return}try{const h=JSON.parse(S);if(h.content&&(c+=h.content,e?.(h.content,c)),h.error)throw new v(h.error,"STREAM_ERROR",500)}catch(h){if(h instanceof v)throw h}}}t?.(c)}catch(n){throw s?.(n),n}},async hexagram(i){return g("/analysis/hexagram",{method:"POST",body:JSON.stringify(i)})},async getResult(i){return g(`/analysis/result/${i}`)}},B={async createOrder(i){return g("/payment/create-order",{method:"POST",body:JSON.stringify(i)})},async getOrderStatus(i){return g(`/payment/order/${i}`)},async simulatePay(i){return g("/payment/simulate-pay",{method:"POST",body:JSON.stringify({orderId:i})})},async redeem(i){return g("/payment/redeem",{method:"POST",body:JSON.stringify({redeemCode:i})})},async getOrders(){return g("/payment/orders")}};class Le{constructor(e){if(this.method=e.id,this.testData=window.appState.get("currentTest"),!this.testData){window.router.navigate("/");return}this.matchType=w(this.testData.type),this.result=null,this.isAnalyzing=!0,this.streamContent="",this.useAiAnalysis=!0,this.isStreamComplete=!1,this.isInitialized=!1,this.abortController=null}render(){return`
      <div class="page result-page">
        ${b({title:"分析结果",showBack:!0,showHistory:!1,showProfile:!1})}
        
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
    `}renderResult(){if(!this.result&&!this.streamContent)return"";if(this.useAiAnalysis&&this.method==="birthday")return this.renderAiResult();const{score:e,conclusion:t,details:s,personA:a,personB:n}=this.result;return this.getConclusionType(e),`
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
                stroke-dasharray="${e*2.83} 283"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <!-- 分数显示在圆圈中间 -->
            <div class="score-value">
              <span class="score-number-gradient">${e}</span>
              <span class="score-unit-gradient">%</span>
            </div>
          </div>
          <p class="score-label">匹配度</p>
        </div>

        <!-- 结论卡片 -->
        <div class="glass-card conclusion-card-simple mb-4">
          <p class="body-text">${t}</p>
        </div>

        <!-- 详细分析 -->
        <div class="glass-card details-card mb-4">
          <h4 class="heading-3 mb-4">📋 详细分析</h4>
          
          ${this.method==="birthday"?this.renderBaziDetails():this.renderHexagramDetails()}
          
          <div class="analysis-points mt-4">
            ${s.map(r=>`
              <div class="analysis-point ${r.type}">
                <span class="point-icon">${r.type==="positive"?"✅":"⚠️"}</span>
                <div class="point-content">
                  <p class="point-title">${r.title}</p>
                  <p class="point-description">${r.description}</p>
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
    `}renderBaziDetails(){const{personA:e,personB:t,pillarsA:s,pillarsB:a}=this.result;return!s||!a?"":`
      <div class="bazi-comparison">
        <!-- 人物A -->
        <div class="person-bazi">
          <div class="person-header">
            <span class="person-avatar">${e.gender==="male"?"👨":"👩"}</span>
            <span class="person-name">${e.name||"你"}</span>
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
            <span class="person-avatar">${t.gender==="male"?"👨":"👩"}</span>
            <span class="person-name">${t.name||"对方"}</span>
          </div>
          <div class="pillars-display">
            ${this.renderPillars(a)}
          </div>
          <div class="elements-display">
            ${this.renderElements(a.elements)}
          </div>
        </div>
      </div>
    `}renderPillars(e){return`
      <div class="pillars-row">
        <div class="pillar">
          <span class="pillar-label">年柱</span>
          <span class="pillar-ganzhi">${e.year.ganzhi}</span>
        </div>
        <div class="pillar">
          <span class="pillar-label">月柱</span>
          <span class="pillar-ganzhi">${e.month.ganzhi}</span>
        </div>
        <div class="pillar">
          <span class="pillar-label">日柱</span>
          <span class="pillar-ganzhi">${e.day.ganzhi}</span>
        </div>
      </div>
    `}renderElements(e){return`
      <div class="elements-bar">
        ${Object.entries(e.distribution).map(([t,s])=>`
          <div class="element-item">
            <span class="element-emoji">${$[t].emoji}</span>
            <span class="element-name">${t}</span>
            <span class="element-count">${s}</span>
          </div>
        `).join("")}
      </div>
    `}renderHexagramDetails(){if(this.testData.allCards&&this.testData.reading)return this.renderTarotDetails();const{hexagram:e}=this.testData;return e?`
      <div class="hexagram-display">
        <div class="hexagram-main">
          <div class="hexagram-symbol text-center">
            <span class="hexagram-icon">${e.upper?.symbol||"☰"}${e.lower?.symbol||"☷"}</span>
            <h4 class="hexagram-name">${e.name}符号</h4>
            <p class="hexagram-meaning">${e.meaning}</p>
          </div>
        </div>
      </div>
    `:""}renderTarotDetails(){const{allCards:e,reading:t}=this.testData;return`
      <div class="tarot-display">
        <!-- 能量类型 -->
        <div class="energy-type text-center mb-4">
          <span class="energy-symbol">${t.energy.symbol}</span>
          <h4 class="energy-name">${t.energy.name}</h4>
          <p class="energy-desc small-text">${t.energy.description}</p>
        </div>
        
        <!-- 抽取的牌 -->
        <div class="tarot-cards-detail mt-4">
          <p class="small-text mb-3" style="color: var(--color-primary);">抽取的卡牌：</p>
          <div class="tarot-cards-grid">
            ${e.map((s,a)=>`
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
    `}getConclusionType(e){return e>=80?{class:"conclusion--excellent",icon:"🌟",title:"A和B互利"}:e>=60?{class:"conclusion--good",icon:"👍",title:e>70?"A利B，B不利A":"A不利B，B利A"}:e>=40?{class:"conclusion--neutral",icon:"⚖️",title:"A和B相互不利"}:{class:"conclusion--caution",icon:"⚠️",title:"A和B相互不利"}}renderBottomBar(){return this.isAnalyzing?"":`
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
    `}attachEvents(){const e=document.querySelector(".navbar__back-btn");e&&e.addEventListener("click",()=>{window.router.navigate("/")});const t=document.querySelector('[data-action="share"]');t&&t.addEventListener("click",()=>{this.handleShare()});const s=document.querySelector('[data-action="export-png"]');s&&s.addEventListener("click",()=>{this.handleExportPng()});const a=document.querySelector('[data-action="new-test"]');a&&a.addEventListener("click",()=>{window.router.navigate("/")})}async init(){if(this.testData){if(this.isInitialized){console.log("页面已初始化，跳过重复初始化");return}if(this.isInitialized=!0,this.method==="birthday"&&this.useAiAnalysis){await this.analyzeWithAi();return}await this.simulateAnalysis(),this.method==="birthday"?this.analyzeBirthday():this.analyzeHexagram(),this.isAnalyzing=!1,this.rerender(),setTimeout(()=>{const e=document.getElementById("suggestion-text");e&&this.result?.suggestion&&Ae(e,this.result.suggestion,30)},500)}}async simulateAnalysis(){const e=["1","2","3","4"],t=["正在收集信息...","正在进行特质计算...","正在分析中...","正在生成报告..."];for(let s=0;s<e.length;s++){await this.delay(800);const a=document.getElementById("analyzing-text");a&&(a.textContent=t[s]);const n=document.querySelector(`[data-step="${e[s]}"]`);n&&n.classList.add("active")}await this.delay(500)}analyzeBirthday(){const{personA:e,personB:t}=this.testData,s=L(e.birthDate),a=L(t.birthDate),n=_e(s,a);this.result={personA:e,personB:t,pillarsA:s,pillarsB:a,score:n.score,conclusion:n.conclusion,details:n.details,suggestion:this.generateSuggestion(n)}}analyzeHexagram(){if(this.testData.reading){const{reading:s,allCards:a}=this.testData;this.result={allCards:a,reading:s,score:s.score,conclusion:s.reading,details:this.getTarotDetails(a),suggestion:s.reading+`

`+s.disclaimer};return}const{hexagram:e}=this.testData;if(!e){this.result={score:50,conclusion:"数据解析异常，请重新测试。",details:[],suggestion:"建议重新进行测试。"};return}const t=this.calculateHexagramScore(e);this.result={hexagram:e,score:t,conclusion:this.getHexagramConclusion(e,t),details:this.getHexagramDetails(e),suggestion:this.generateHexagramSuggestion(e)}}getTarotDetails(e){const t=[],s=e.filter(n=>n.isUpright),a=e.filter(n=>!n.isUpright);return s.length>0&&t.push({type:"positive",title:`正位牌 (${s.length}张)`,description:s.map(n=>`${n.name}：${n.upright}`).join("；")}),a.length>0&&t.push({type:a.length<=3?"positive":"negative",title:`逆位牌 (${a.length}张)`,description:a.map(n=>`${n.name}：${n.reversed}`).join("；")}),t}calculateHexagramScore(e){const t=["乾","坤","泰","同人","大有","谦","咸","恒","益","萃"],s=["否","讼","剥","困","蹇","睽","明夷"];let a=60;return t.includes(e.name)?a+=20:s.includes(e.name)&&(a-=15),e.hasChanging&&(a+=e.changingPositions.length<=2?5:-5),Math.max(20,Math.min(95,a))}getHexagramConclusion(e,t){return t>=75?`${e.name}符号显示双方关系积极向好，有互利共赢的趋势。`:t>=55?`${e.name}符号提示需要双方共同努力，关系可以改善。`:`${e.name}符号暗示当前时机不太适合，建议谨慎行事。`}getHexagramDetails(e){const t=[];return t.push({type:"positive",title:`${e.name}符号`,description:e.meaning}),e.upper&&e.lower&&t.push({type:"positive",title:"上下符号分析",description:`上符号${e.upper.name}（${e.upper.nature}），下符号${e.lower.name}（${e.lower.nature}）`}),e.hasChanging&&t.push({type:e.changingPositions.length<=2?"positive":"negative",title:"变化分析",description:`第${e.changingPositions.join("、")}轮为变化轮，表示事情会有变化`}),t}generateSuggestion(e){const{score:t,details:s}=e;s.filter(r=>r.type==="positive");const a=s.filter(r=>r.type==="negative");let n="";return t>=80?n="这是非常好的契合度！双方在性格特质上高度互补，建议珍惜这份关系，共同维护。注意保持沟通，互相理解和包容。":t>=60?(n="整体关系是积极的，但也存在一些需要注意的地方。",a.length>0&&(n+=`特别是${a[0].title}方面，需要双方多一些耐心和理解。`),n+="只要用心经营，这段关系会越来越好。"):t>=40?n="双方存在一定的差异，但并非不可调和。建议：1) 增加沟通频率；2) 尊重对方的差异；3) 寻找共同兴趣。如果双方都愿意付出努力，关系是可以改善的。":n="从性格分析角度看，双方确实存在较大的差异。建议在做重要决定前，多观察、多了解对方。如果是合作关系，建议寻找其他机会；如果是感情关系，请谨慎考虑。",n}generateHexagramSuggestion(e){return`${e.name}符号的核心含义是"${e.meaning}"。根据分析结果提示，当前最重要的是保持平和的心态，不要急于求成。遇事多思考，听从内心的指引。如果有变化，说明事情会有转机，保持耐心等待合适的时机。`}delay(e){return new Promise(t=>setTimeout(t,e))}async analyzeWithAi(){const{personA:e,personB:t}=this.testData;this.abortController=new AbortController;const s=["1","2","3"],a=["正在收集信息...","正在进行特质计算...","正在请求 AI 分析..."];for(let n=0;n<s.length;n++){await this.delay(600);const r=document.getElementById("analyzing-text");r&&(r.textContent=a[n]);const o=document.querySelector(`[data-step="${s[n]}"]`);o&&o.classList.add("active")}try{await ke.birthMatchStream({partyA:e,partyB:t},{onChunk:(n,r)=>{if(this.streamContent=r,this.isAnalyzing){this.isAnalyzing=!1;const o=document.querySelector('[data-step="4"]');o&&o.classList.add("active"),this.updateToResultView()}else this.updateStreamContent()},onDone:n=>{this.streamContent=n,this.isAnalyzing=!1,this.isStreamComplete=!0;const r=document.getElementById("ai-stream-content");r&&(r.innerHTML=this.formatMarkdown(this.streamContent)+this.renderCompleteIndicator(),this.scrollToBottom(),setTimeout(()=>{const o=document.getElementById("stream-complete-indicator");o&&(o.style.opacity="0",setTimeout(()=>o.remove(),300))},1e3)),this.rerender()},onError:n=>{if(n.name==="AbortError"){console.log("请求已取消");return}console.error("AI 分析失败:",n),this.streamContent="分析失败，请稍后重试！",this.isAnalyzing=!1,this.isStreamComplete=!0;const r=document.getElementById("stream-loading-indicator");r&&r.remove(),this.rerender()},signal:this.abortController.signal})}catch(n){if(n.name==="AbortError"){console.log("请求已取消");return}console.error("AI 分析失败:",n),this.streamContent="分析失败，请稍后重试。",this.isAnalyzing=!1,this.isStreamComplete=!0,this.rerender()}}updateToResultView(){const e=document.getElementById("analysis-container");e&&(e.innerHTML=this.renderResult())}renderAiResult(){const{personA:e,personB:t}=this.testData;return`
      <div class="result-content animate-fade-in-up">
        <!-- 双方信息 -->
        <div class="glass-card persons-card mb-4">
          <div class="persons-row">
            <div class="person-info">
              <span class="person-avatar">${e.gender==="男"?"👨":"👩"}</span>
              <span class="person-name">${e.name||"你"}</span>
              <span class="person-birth small-text">${e.birthDate}</span>
            </div>
            <div class="vs-badge">VS</div>
            <div class="person-info">
              <span class="person-avatar">${t.gender==="男"?"👨":"👩"}</span>
              <span class="person-name">${t.name||"对方"}</span>
              <span class="person-birth small-text">${t.birthDate}</span>
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
    `}updateStreamContent(){const e=document.getElementById("ai-stream-content");if(!e)return;const t=this.formatMarkdown(this.streamContent),s=this.renderLoadingIndicator(),a=document.createElement("div");a.innerHTML=t;const n=Array.from(a.children),r=Array.from(e.children).filter(o=>!o.classList.contains("stream-loading-indicator"));if(n.length>r.length){for(let c=r.length;c<n.length;c++){const l=n[c].cloneNode(!0);l.classList.add("stream-fade-in");const d=e.querySelector(".stream-loading-indicator");d?e.insertBefore(l,d):e.appendChild(l)}e.querySelector(".stream-loading-indicator")||e.insertAdjacentHTML("beforeend",s)}else if(r.length>0){const o=r[r.length-1],c=n[n.length-1];c&&o.innerHTML!==c.innerHTML&&(o.innerHTML=c.innerHTML)}else e.innerHTML=t+s;this.scrollToBottom()}renderCompleteIndicator(){return`
      <div class="stream-complete-indicator" id="stream-complete-indicator">
        <span class="complete-icon">✅</span>
        <span class="complete-text">已完成</span>
      </div>
    `}scrollToBottom(){const e=document.getElementById("ai-stream-content");e&&(e.scrollTop=e.scrollHeight),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}formatMarkdown(e){return e?this.splitIntoSections(e).map((s,a)=>{const n=this.formatSectionContent(s);return n.replace(/<[^>]*>/g,"").replace(/\s+/g,"").trim()?`
        <div class="analysis-block animate-fade-in-up" style="animation-delay: ${a*.1}s;">
          ${n}
        </div>
      `:""}).filter(Boolean).join(""):""}splitIntoSections(e){const t=[];let s="";const a=e.split(`
`);for(const n of a){if(/^总结[：:.]?\s*$/.test(n.trim())||/^\*?\*?总结\*?\*?[：:.]?\s*$/.test(n.trim()))continue;/^【[^】]+】/.test(n)?(s.trim()&&t.push(s.trim()),s=n):s+=`
`+n}return s.trim()&&t.push(s.trim()),t.length<=1&&e.includes(`

`)?e.split(/\n\n+/).filter(n=>n.trim()):t.length>0?t:[e]}formatSectionContent(e){const t=a=>a.includes("第一步")||a.includes("坐标")||a.includes("确立")?"📍":a.includes("第二步")||a.includes("输出")||a.includes("判定")?"🔍":a.includes("第三步")||a.includes("打分")||a.includes("量化")?"⭐":a.includes("第四步")||a.includes("判词")||a.includes("结论")||a.includes("综合")?"🎯":a.includes("需求")||a.includes("用神")||a.includes("清单")?"📋":a.includes("资产")||a.includes("核定")?"💎":a.includes("评分")||a.includes("细则")?"⭐":a.includes("建议")||a.includes("提示")?"💡":a.includes("甲方")||a.includes("乙方")?"":"📌";let s=e.replace(/^[\*\-]?\s*\*?\*?第([一二三四五六七八九十]+)步[：:]\s*(.+)$/gm,(a,n,r)=>`<div class="block-header"><span class="block-icon">${t(`第${n}步`)}</span><span class="block-title">第${n}步：${r}</span></div>`).replace(/^[\*\-]?\s*\*?\*?([甲乙])方\*?\*?$/gm,(a,n)=>`<div class="person-header"><span class="person-emoji">${n==="甲"?"👨":"👩"}</span><span class="person-label">${n}方</span></div>`).replace(/^\[([^\]]+)\](?![\(\[])/gm,(a,n)=>`<div class="block-subheader"><span class="block-icon">${t(n)}</span><span class="block-subtitle">${n}</span></div>`).replace(/^【([^】]+)】/gm,(a,n)=>`<div class="block-header"><span class="block-icon">${t(n)}</span><span class="block-title">${n}</span></div>`).replace(/^###\s+(.+)$/gm,'<div class="block-header"><span class="block-icon">📌</span><span class="block-title">$1</span></div>').replace(/^##\s+(.+)$/gm,'<div class="block-header"><span class="block-icon">📋</span><span class="block-title">$1</span></div>').replace(/^#\s+(.+)$/gm,'<div class="block-header main-header"><span class="block-icon">📊</span><span class="block-title">$1</span></div>').replace(/^([一二三四五六七八九十]+)[、.]\s*(.+)$/gm,'<div class="block-subheader"><span class="block-num">$1</span><span class="block-subtitle">$2</span></div>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/^\*\s{3}(.+)$/gm,'<li class="sub-item">$1</li>').replace(/^[-*•]\s*([^\s].*)$/gm,"<li>$1</li>").replace(/^(\d+)[.)、]\s*(.+)$/gm,'<li class="numbered"><span class="list-num">$1.</span> $2</li>').replace(/([^<>\n]+?)：([^<>\n]+)/g,'<span class="label-text">$1：</span><span class="value-text">$2</span>').replace(/\n/g,"<br>");return s=s.replace(/(<li[^>]*>.*?<\/li>)(<br>)?/g,"$1"),s=s.replace(/(<li[^>]*>.*?<\/li>)+/g,a=>'<ul class="block-list">'+a+"</ul>"),s=s.replace(/(<br>){2,}/g,"<br>"),s=s.replace(/^(<br>|\s)+/,""),s=s.replace(/(<br>|\s)+$/,""),s=s.replace(/<li[^>]*>\s*<\/li>/g,""),s=s.replace(/<li[^>]*>\s*[-–—]+\s*<\/li>/g,""),s=s.replace(/<ul class="block-list">\s*<\/ul>/g,""),s=s.replace(/<br>\s*[-–—]+\s*<br>/g,"<br>"),s=s.replace(/<br>\s*[•●○]\s*[-–—]*\s*<br>/g,"<br>"),s=s.replace(/(<\/div>)(<br>)+/g,"$1"),s=s.replace(/(<br>)+(<div)/g,"$2"),`<div class="block-content">${s}</div>`}rerender(){const e=document.getElementById("app");e.innerHTML=this.render(),this.attachEvents()}handleShare(){const e=`我刚刚在匹配游戏进行了${this.matchType?.title}测试，匹配度${this.result?.score}%！快来试试吧~`;navigator.share?navigator.share({title:"匹配游戏 - 趣味性格测试",text:e,url:window.location.origin}):navigator.clipboard.writeText(e).then(()=>{window.showToast("链接已复制，快去分享吧！")})}async handleExportPng(){const e=this.testData?.personA?.name||"甲方",t=this.testData?.personB?.name||"乙方",s=this.matchType?.title||"匹配",a=`${e}_${t}_${s}结果.png`;window.showToast("正在生成图片，请稍候...");try{const n=document.querySelector(".page-content");if(!n){window.showToast("导出失败：找不到内容区域");return}const r=document.querySelector(".bottom-action-bar");r&&(r.style.display="none"),n.classList.add("export-mode");const c=(await be(()=>import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js"),[])).default,l=await c(n,{scale:2,useCORS:!0,allowTaint:!0,backgroundColor:null,logging:!1});n.classList.remove("export-mode"),r&&(r.style.display="");const d=l.toDataURL("image/png"),p=document.createElement("a");p.download=a,p.href=d,p.click(),window.showToast("图片导出成功！")}catch(n){console.error("导出图片失败:",n);const r=document.querySelector(".page-content");r&&r.classList.remove("export-mode");const o=document.querySelector(".bottom-action-bar");o&&(o.style.display=""),window.showToast("导出失败，请稍后重试")}}}class Pe{constructor(e){this.testType=e.type,this.matchType=w(this.testType),this.orderId=null,this.paymentMethod="alipay",this.qrCodeData=null,this.redeemCode=null,this.status="selecting",this.pollingTimer=null}render(){return`
      <div class="page payment-page">
        ${b({title:"支付",showBack:!0,showHistory:!1,showProfile:!1})}
        
        <main class="page-content">
          <div class="app-container">
            ${this.renderContent()}
          </div>
        </main>
      </div>
    `}renderContent(){switch(this.status){case"selecting":return this.renderPaymentSelect();case"paying":return this.renderPaymentQR();case"success":return this.renderSuccess();default:return""}}renderPaymentSelect(){const e=this.matchType||{title:"测试服务",price:29.9};return`
      <section class="payment-info mt-4 mb-6 animate-fade-in-up">
        <div class="glass-card">
          <div class="payment-product">
            <span class="product-icon">${e.icon||"🔮"}</span>
            <div class="product-info">
              <h3 class="product-name">${e.title}</h3>
              <p class="product-desc">${e.description||""}</p>
            </div>
            <div class="product-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">${e.price||29.9}</span>
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
            立即支付 ¥${e.price||29.9}
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
    `}attachEvents(){const e=document.querySelector(".navbar__back-btn");e&&e.addEventListener("click",()=>{this.cleanup(),window.router.back()}),document.querySelectorAll(".payment-method-card").forEach(l=>{l.addEventListener("click",()=>{this.selectPaymentMethod(l.dataset.method)})});const t=document.querySelector('[data-action="create-order"]');t&&t.addEventListener("click",()=>this.createOrder());const s=document.querySelector('[data-action="cancel-order"]');s&&s.addEventListener("click",()=>this.cancelOrder());const a=document.querySelector('[data-action="check-status"]');a&&a.addEventListener("click",()=>this.checkPaymentStatus());const n=document.querySelector('[data-action="simulate-pay"]');n&&n.addEventListener("click",()=>this.simulatePay());const r=document.querySelector('[data-action="copy-code"]');r&&r.addEventListener("click",()=>this.copyRedeemCode());const o=document.querySelector('[data-action="back-home"]');o&&o.addEventListener("click",()=>{window.router.navigate("/")});const c=document.querySelector('[data-action="use-code"]');c&&c.addEventListener("click",()=>{window.appState.set("redeemCode",this.redeemCode),window.router.navigate(`/result/${this.testType}?code=${this.redeemCode}`)})}selectPaymentMethod(e){this.paymentMethod=e,document.querySelectorAll(".payment-method-card").forEach(t=>{t.classList.toggle("active",t.dataset.method===e)})}async createOrder(){try{window.showToast("正在创建订单...");const e=await B.createOrder({productId:"test-standard",paymentMethod:this.paymentMethod,testType:this.testType});e.success&&(this.orderId=e.data.orderId,this.qrCodeData=e.data.qrCode,this.status="paying",this.rerender(),this.startPolling())}catch(e){window.showToast(e.message||"创建订单失败","error")}}cancelOrder(){this.cleanup(),this.status="selecting",this.orderId=null,this.qrCodeData=null,this.rerender()}startPolling(){this.pollingTimer=setInterval(()=>{this.checkPaymentStatus(!0)},3e3)}stopPolling(){this.pollingTimer&&(clearInterval(this.pollingTimer),this.pollingTimer=null)}async checkPaymentStatus(e=!1){try{const t=await B.getOrderStatus(this.orderId);t.success&&t.data.status==="paid"?(this.stopPolling(),this.redeemCode=t.data.redeemCode,this.status="success",this.rerender(),e||window.showToast("支付成功！","success")):e||window.showToast("暂未收到支付，请稍候重试")}catch{e||window.showToast("查询失败，请稍候重试","error")}}async simulatePay(){try{const e=await B.simulatePay(this.orderId);e.success&&(this.stopPolling(),this.redeemCode=e.data.redeemCode,this.status="success",this.rerender(),window.showToast("模拟支付成功！","success"))}catch(e){window.showToast(e.message||"模拟支付失败","error")}}copyRedeemCode(){this.redeemCode&&navigator.clipboard.writeText(this.redeemCode).then(()=>{window.showToast("核销码已复制！","success")}).catch(()=>{window.showToast("复制失败，请手动复制")})}cleanup(){this.stopPolling()}rerender(){const e=document.getElementById("app");e.innerHTML=this.render(),this.attachEvents()}}function P(){const i=new Date,e=i.getFullYear(),t=String(i.getMonth()+1).padStart(2,"0"),s=String(i.getDate()).padStart(2,"0"),a=String(i.getHours()).padStart(2,"0"),n=String(i.getMinutes()).padStart(2,"0"),r=String(i.getSeconds()).padStart(2,"0");return`${e}-${t}-${s} ${a}:${n}:${r}`}function I(){console.log(`[${P()}] ✨ 匹配游戏启动中...`),Ie(),Re(),_.start(),console.log(`[${P()}] ✨ 匹配游戏启动完成！`)}function Ie(){_.register("/",U).register("/test/:type",J).register("/test/:type/birthday",X).register("/test/:type/tarot",ve).register("/pay/:type",Pe).register("/result/:id",Le)}function Re(){window.showToast=Me,window.appState=C,window.router=_,document.body.addEventListener("touchmove",function(i){i.target.closest(".page-content")||i.preventDefault()},{passive:!1})}function Me(i,e="default",t=2500){const s=document.querySelector(".toast");s&&s.remove();const a=document.createElement("div");a.className=`toast ${e!=="default"?`toast--${e}`:""}`,a.textContent=i,document.body.appendChild(a),requestAnimationFrame(()=>{a.classList.add("toast--visible")}),setTimeout(()=>{a.classList.remove("toast--visible"),setTimeout(()=>a.remove(),300)},t)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",I):I();
