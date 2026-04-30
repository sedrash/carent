// Scroll reveal + staggered animations
(function(){
  function initReveals(){
  // Select elements we want animated (extended for site-wide animation)
  const selector = ['.brand', '.site-title', '.site-sub', 'header', '.hero h1', '.hero p', 'h1', 'h2', 'p', 'section', '.card-light', '.btn-custom', '.main-nav a', 'img', 'figure', 'figcaption', '.site-footer'];
  const els = Array.from(document.querySelectorAll(selector.join(','))).filter(Boolean);

    if(els.length === 0) return;

    // apply base class and incremental delays
    els.forEach((el, i) => {
      // don't overwrite existing inline delay if set
      if(!el.classList.contains('reveal')) el.classList.add('reveal');
      // set a gentle stagger, clamp to avoid huge delays
      const delay = Math.min(700, i * 70);
      el.style.animationDelay = `${delay}ms`;
    });

    // Special handling: stagger list items inside any .stagger-list container
    const staggerContainers = Array.from(document.querySelectorAll('.stagger-list'));
    staggerContainers.forEach(container => {
      const items = Array.from(container.querySelectorAll('li'));
      items.forEach((li, idx) => {
        // ensure reveal class present
        if(!li.classList.contains('reveal')) li.classList.add('reveal');
        const base = 220; // base delay for lists
        li.style.animationDelay = `${base + idx * 90}ms`;
      });
    });

    // use IntersectionObserver to reveal on enter
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      // Observe all elements that currently have the reveal class (includes stagger-list items)
      const toObserve = Array.from(document.querySelectorAll('.reveal'));
      toObserve.forEach(el => io.observe(el));
    } else {
      // fallback: show all slowly
      const toShow = Array.from(document.querySelectorAll('.reveal'));
      toShow.forEach((el, idx) => { setTimeout(()=> el.classList.add('show'), 120 + idx * 40); });
    }
  }

  // Run on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initReveals);
  } else {
    initReveals();
  }

  // small helper: animate new elements added dynamically
  window.__reveal = function(node, delay){
    if(!node) return;
    node.classList.add('reveal');
    if(delay) node.style.animationDelay = `${delay}ms`;
    // reveal immediately if visible
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target); } });
      }, { threshold: 0.12 });
      io.observe(node);
    } else {
      setTimeout(()=> node.classList.add('show'), delay || 80);
    }
  };

})();

/* Local translation selector */
(function(){
  function initTranslateWidget(){
    if(document.querySelector('.translate-panel')) return;

    const panel = document.createElement('div');
    panel.className = 'translate-panel';
    panel.innerHTML = `
      <button class="translate-toggle" type="button" aria-expanded="false" aria-controls="language_options">
        Traduire
      </button>
      <div class="translate-box" id="language_options">
        <label for="language_select">Langue</label>
        <select id="language_select">
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    `;
    document.body.appendChild(panel);

    const toggle = panel.querySelector('.translate-toggle');
    const select = panel.querySelector('#language_select');
    const dictionary = {
      "Traduire": { en: "Translate", de: "Übersetzen", ar: "ترجمة" },
      "Langue": { en: "Language", de: "Sprache", ar: "اللغة" },
      "Accueil": { en: "Home", de: "Startseite", ar: "الرئيسية" },
      "Compétences": { en: "Skills", de: "Kompetenzen", ar: "المهارات" },
      "Projets": { en: "Projects", de: "Projekte", ar: "المشاريع" },
      "Expériences": { en: "Experience", de: "Erfahrungen", ar: "الخبرات" },
      "Bénévolat": { en: "Volunteering", de: "Ehrenamt", ar: "التطوع" },
      "Carnet de Compétences": { en: "Skills Portfolio", de: "Kompetenzportfolio", ar: "ملف المهارات" },
      "Sedra Shalhawi": { en: "Sedra Shalhawi", de: "Sedra Shalhawi", ar: "سدرة شلحاوي" },
      "Étudiante Ingénierie & Cybersécurité": { en: "Engineering & Cybersecurity Student", de: "Studentin für Ingenieurwesen & Cybersicherheit", ar: "طالبة هندسة وأمن سيبراني" },
      "Carnet de compétences": { en: "Skills portfolio", de: "Kompetenzportfolio", ar: "ملف المهارات" },
      "Cybersécurité, réseaux et rigueur d’ingénierie pour des systèmes fiables": { en: "Cybersecurity, networks and engineering rigor for reliable systems", de: "Cybersicherheit, Netzwerke und ingenieurmäßige Sorgfalt für zuverlässige Systeme", ar: "الأمن السيبراني والشبكات والدقة الهندسية لبناء أنظمة موثوقة" },
      "Étudiante en 4ᵉ année d’ingénierie informatique & réseaux, spécialisée en cybersécurité. Je construis mon parcours autour de la protection des systèmes, de la qualité réseau et de l’automatisation utile.": { en: "Fourth-year computer engineering and networks student, specialized in cybersecurity. I am building my path around system protection, network quality and useful automation.", de: "Studentin im 4. Jahr Informatik und Netzwerke mit Schwerpunkt Cybersicherheit. Ich entwickle meinen Weg rund um Systemschutz, Netzwerkqualität und sinnvolle Automatisierung.", ar: "طالبة في السنة الرابعة في هندسة المعلوماتية والشبكات، متخصصة في الأمن السيبراني. أبني مساري حول حماية الأنظمة وجودة الشبكات والأتمتة المفيدة." },
      "Voir mes Compétences": { en: "View my Skills", de: "Meine Kompetenzen ansehen", ar: "عرض مهاراتي" },
      "Voir mes Projets": { en: "View my Projects", de: "Meine Projekte ansehen", ar: "عرض مشاريعي" },
      "Cybersécurité": { en: "Cybersecurity", de: "Cybersicherheit", ar: "الأمن السيبراني" },
      "Cloud & réseaux": { en: "Cloud & networks", de: "Cloud & Netzwerke", ar: "السحابة والشبكات" },
      "Python & Web": { en: "Python & Web", de: "Python & Web", ar: "بايثون والويب" },
      "En bref": { en: "In short", de: "Kurz gesagt", ar: "باختصار" },
      "Analyse de vulnérabilités, chiffrement et bonnes pratiques.": { en: "Vulnerability analysis, encryption and best practices.", de: "Schwachstellenanalyse, Verschlüsselung und Best Practices.", ar: "تحليل الثغرات والتشفير وأفضل الممارسات." },
      "Projets académiques en réseau, web et cryptographie.": { en: "Academic projects in networking, web and cryptography.", de: "Akademische Projekte in Netzwerken, Web und Kryptografie.", ar: "مشاريع أكاديمية في الشبكات والويب والتشفير." },
      "Engagements bénévoles orientés impact humain.": { en: "Volunteer commitments focused on human impact.", de: "Ehrenamtliches Engagement mit menschlicher Wirkung.", ar: "مشاركات تطوعية ذات أثر إنساني." },
      "Objectif 2026": { en: "2026 Goal", de: "Ziel 2026", ar: "هدف 2026" },
      "Contribuer à des projets où la sécurité est pensée dès la conception, avec une approche méthodique et mesurable.": { en: "Contribute to projects where security is considered from the design stage, with a methodical and measurable approach.", de: "Zu Projekten beitragen, bei denen Sicherheit von Anfang an mitgedacht wird, mit einem methodischen und messbaren Ansatz.", ar: "المساهمة في مشاريع تُؤخذ فيها الحماية بعين الاعتبار منذ مرحلة التصميم، بمنهجية واضحة وقابلة للقياس." },
      "année": { en: "year", de: "Jahr", ar: "سنة" },
      "spécialité": { en: "specialty", de: "Schwerpunkt", ar: "تخصص" },
      "esprit": { en: "mindset", de: "Denkweise", ar: "نهج" },
      "Mon portrait professionnel": { en: "My Professional Profile", de: "Mein berufliches Profil", ar: "ملفي المهني" },
      "Les éléments clés de mon parcours, de mes valeurs et de mon projet d’évolution.": { en: "Key elements of my background, values and professional growth plan.", de: "Die wichtigsten Elemente meines Werdegangs, meiner Werte und meiner Entwicklung.", ar: "العناصر الأساسية لمساري وقيمي وخطة تطوري المهني." },
      "Profil": { en: "Profile", de: "Profil", ar: "الملف الشخصي" },
      "Une future ingénieure orientée cybersécurité, réseau et fiabilité des systèmes.": { en: "A future engineer focused on cybersecurity, networks and system reliability.", de: "Eine zukünftige Ingenieurin mit Fokus auf Cybersicherheit, Netzwerke und Systemzuverlässigkeit.", ar: "مهندسة مستقبلية موجهة نحو الأمن السيبراني والشبكات وموثوقية الأنظمة." },
      "Je suis étudiante en ingénierie informatique et réseaux, spécialisée en cybersécurité. Mon parcours m’aide à construire une approche complète : comprendre les systèmes, repérer leurs fragilités, documenter clairement mon travail et proposer des solutions utiles.": { en: "I am a computer engineering and networks student, specialized in cybersecurity. My studies help me build a complete approach: understanding systems, identifying their weaknesses, documenting my work clearly and proposing useful solutions.", de: "Ich studiere Informatik und Netzwerke mit Schwerpunkt Cybersicherheit. Mein Werdegang hilft mir, einen umfassenden Ansatz aufzubauen: Systeme verstehen, Schwachstellen erkennen, meine Arbeit klar dokumentieren und nützliche Lösungen vorschlagen.", ar: "أنا طالبة في هندسة المعلوماتية والشبكات، متخصصة في الأمن السيبراني. يساعدني مساري على بناء مقاربة متكاملة: فهم الأنظمة، تحديد نقاط ضعفها، توثيق عملي بوضوح واقتراح حلول مفيدة." },
      "Ce qui me motive, c’est la sécurité appliquée à des situations concrètes : protéger les infrastructures, améliorer les pratiques et apprendre à travailler avec méthode dans des environnements techniques exigeants.": { en: "What motivates me is security applied to real situations: protecting infrastructures, improving practices and learning to work methodically in demanding technical environments.", de: "Mich motiviert Sicherheit in konkreten Situationen: Infrastrukturen schützen, Praktiken verbessern und lernen, in anspruchsvollen technischen Umgebungen methodisch zu arbeiten.", ar: "ما يحفزني هو تطبيق الأمن على مواقف واقعية: حماية البنى التحتية، تحسين الممارسات، وتعلم العمل بمنهجية في بيئات تقنية متطلبة." },
      "Réseaux": { en: "Networks", de: "Netzwerke", ar: "الشبكات" },
      "Analyse": { en: "Analysis", de: "Analyse", ar: "التحليل" },
      "Rigueur": { en: "Rigor", de: "Sorgfalt", ar: "الدقة" },
      "Technique": { en: "Technical", de: "Technisch", ar: "تقني" },
      "Python, Java, web, bases de données, sécurité réseau": { en: "Python, Java, web, databases, network security", de: "Python, Java, Web, Datenbanken, Netzwerksicherheit", ar: "بايثون، جافا، الويب، قواعد البيانات، أمن الشبكات" },
      "Comportemental": { en: "Behavioral", de: "Verhalten", ar: "سلوكي" },
      "Autonomie, curiosité, persévérance, sens des responsabilités": { en: "Autonomy, curiosity, perseverance, sense of responsibility", de: "Selbstständigkeit, Neugier, Ausdauer, Verantwortungsbewusstsein", ar: "الاستقلالية، الفضول، المثابرة، حس المسؤولية" },
      "Transversal": { en: "Cross-functional", de: "Übergreifend", ar: "مهارات مشتركة" },
      "Communication, organisation, documentation, travail en équipe": { en: "Communication, organization, documentation, teamwork", de: "Kommunikation, Organisation, Dokumentation, Teamarbeit", ar: "التواصل، التنظيم، التوثيق، العمل الجماعي" },
      "Projection": { en: "Projection", de: "Ausblick", ar: "التطلع" },
      "Comment je me vois dans 3 à 5 ans": { en: "How I see myself in 3 to 5 years", de: "Wie ich mich in 3 bis 5 Jahren sehe", ar: "كيف أرى نفسي بعد 3 إلى 5 سنوات" },
      "Je me vois évoluer vers un rôle d’ingénieure en cybersécurité ou en infrastructure, capable de sécuriser des environnements techniques tout en gardant une vision claire des usages et des besoins humains.": { en: "I see myself growing into a cybersecurity or infrastructure engineering role, able to secure technical environments while keeping a clear view of user practices and human needs.", de: "Ich sehe mich in eine Rolle als Ingenieurin für Cybersicherheit oder Infrastruktur hineinwachsen, mit der Fähigkeit, technische Umgebungen zu sichern und zugleich Nutzung und menschliche Bedürfnisse im Blick zu behalten.", ar: "أرى نفسي أتطور نحو دور مهندسة في الأمن السيبراني أو البنية التحتية، قادرة على تأمين البيئات التقنية مع الحفاظ على رؤية واضحة للاستخدامات والاحتياجات الإنسانية." },
      "Audit & analyse": { en: "Audit & analysis", de: "Audit & Analyse", ar: "التدقيق والتحليل" },
      "Sécurité réseau": { en: "Network security", de: "Netzwerksicherheit", ar: "أمن الشبكات" },
      "Cloud sécurisé": { en: "Secure cloud", de: "Sichere Cloud", ar: "سحابة آمنة" },
      "Documentation claire": { en: "Clear documentation", de: "Klare Dokumentation", ar: "توثيق واضح" },
      "Mes valeurs": { en: "My values", de: "Meine Werte", ar: "قيمي" },
      "Ce sont les repères que je veux garder dans mes projets et dans ma manière de travailler.": { en: "These are the reference points I want to keep in my projects and in the way I work.", de: "Das sind die Orientierungspunkte, die ich in meinen Projekten und in meiner Arbeitsweise bewahren möchte.", ar: "هذه هي المبادئ التي أريد الحفاظ عليها في مشاريعي وفي طريقة عملي." },
      "Respect": { en: "Respect", de: "Respekt", ar: "الاحترام" },
      "Fiabilité": { en: "Reliability", de: "Zuverlässigkeit", ar: "الموثوقية" },
      "Apprentissage": { en: "Learning", de: "Lernen", ar: "التعلم" },
      "Entraide": { en: "Mutual support", de: "Gegenseitige Hilfe", ar: "المساعدة المتبادلة" },
      "Mes anti-valeurs": { en: "My anti-values", de: "Meine Anti-Werte", ar: "القيم التي أرفضها" },
      "Ce sont les attitudes que je veux éviter, car elles fragilisent la qualité du travail et la confiance dans une équipe.": { en: "These are the attitudes I want to avoid, because they weaken work quality and trust within a team.", de: "Das sind die Haltungen, die ich vermeiden möchte, weil sie die Qualität der Arbeit und das Vertrauen im Team schwächen.", ar: "هذه هي السلوكيات التي أريد تجنبها لأنها تضعف جودة العمل والثقة داخل الفريق." },
      "Négligence": { en: "Negligence", de: "Nachlässigkeit", ar: "الإهمال" },
      "Manque d’écoute": { en: "Lack of listening", de: "Mangelndes Zuhören", ar: "قلة الإصغاء" },
      "Désorganisation": { en: "Disorganization", de: "Unordnung", ar: "الفوضى" },
      "Travail bâclé": { en: "Sloppy work", de: "Nachlässige Arbeit", ar: "عمل غير متقن" },
      "Individualisme": { en: "Individualism", de: "Individualismus", ar: "الفردية" },
      "Ce que je construis": { en: "What I am building", de: "Was ich aufbaue", ar: "ما أقوم ببنائه" },
      "Des compétences solides, un portfolio lisible, et un profil orienté sécurité appliquée.": { en: "Solid skills, a clear portfolio and a profile focused on applied security.", de: "Solide Kompetenzen, ein übersichtliches Portfolio und ein Profil mit Fokus auf angewandte Sicherheit.", ar: "مهارات قوية، ملف واضح، وملف شخصي موجه نحو الأمن التطبيقي." },
      "Compétences techniques": { en: "Technical skills", de: "Technische Kompetenzen", ar: "المهارات التقنية" },
      "Cybersécurité, réseau, web, automatisation : un socle robuste pour des projets concrets.": { en: "Cybersecurity, networking, web and automation: a strong foundation for concrete projects.", de: "Cybersicherheit, Netzwerk, Web und Automatisierung: eine robuste Grundlage für konkrete Projekte.", ar: "الأمن السيبراني، الشبكات، الويب، والأتمتة: أساس قوي لمشاريع عملية." },
      "Projets académiques": { en: "Academic projects", de: "Akademische Projekte", ar: "المشاريع الأكاديمية" },
      "Réseaux, cryptographie, web dynamique : apprendre en construisant et en documentant.": { en: "Networks, cryptography and dynamic web: learning by building and documenting.", de: "Netzwerke, Kryptografie und dynamisches Web: Lernen durch Aufbau und Dokumentation.", ar: "الشبكات، التشفير، والويب الديناميكي: التعلم من خلال البناء والتوثيق." },
      "Engagements bénévoles": { en: "Volunteer commitments", de: "Ehrenamtliches Engagement", ar: "المشاركات التطوعية" },
      "Communication, organisation, impact social : des valeurs qui complètent le technique.": { en: "Communication, organization and social impact: values that complement technical skills.", de: "Kommunikation, Organisation und soziale Wirkung: Werte, die die Technik ergänzen.", ar: "التواصل، التنظيم، والأثر الاجتماعي: قيم تكمل الجانب التقني." },
      "Explorer les compétences": { en: "Explore skills", de: "Kompetenzen erkunden", ar: "استكشاف المهارات" },
      "Voir les projets": { en: "View projects", de: "Projekte ansehen", ar: "عرض المشاريع" },
      "Découvrir le bénévolat": { en: "Discover volunteering", de: "Ehrenamt entdecken", ar: "اكتشاف التطوع" },
      "Technologies & outils": { en: "Technologies & tools", de: "Technologien & Tools", ar: "التقنيات والأدوات" },
      "Quelques environnements et outils que j’utilise dans mes projets académiques.": { en: "Some environments and tools I use in my academic projects.", de: "Einige Umgebungen und Tools, die ich in meinen akademischen Projekten nutze.", ar: "بعض البيئات والأدوات التي أستخدمها في مشاريعي الأكاديمية." },
      "Les environnements que j’utilise avec les techniques que je développe dans mes projets.": { en: "The environments I use with the techniques I develop in my projects.", de: "Die Umgebungen, die ich mit den Techniken nutze, die ich in meinen Projekten entwickle.", ar: "البيئات التي أستخدمها مع التقنيات التي أطورها في مشاريعي." },
      "Analyse de vulnérabilités, bonnes pratiques OWASP, tests SQLi/XSS.": { en: "Vulnerability analysis, OWASP best practices, SQLi/XSS testing.", de: "Schwachstellenanalyse, OWASP Best Practices, SQLi/XSS-Tests.", ar: "تحليل الثغرات، أفضل ممارسات OWASP، واختبارات SQLi/XSS." },
      "Nmap": { en: "Nmap", de: "Nmap", ar: "Nmap" },
      "Scan de ports, découverte réseau et lecture des services exposés.": { en: "Port scanning, network discovery and analysis of exposed services.", de: "Port-Scanning, Netzwerkerkennung und Analyse exponierter Dienste.", ar: "فحص المنافذ، اكتشاف الشبكة، وقراءة الخدمات المكشوفة." },
      "Wireshark": { en: "Wireshark", de: "Wireshark", ar: "Wireshark" },
      "Analyse de paquets, compréhension TCP/IP et diagnostic réseau.": { en: "Packet analysis, TCP/IP understanding and network diagnosis.", de: "Paketanalyse, TCP/IP-Verständnis und Netzwerkdiagnose.", ar: "تحليل الحزم، فهم TCP/IP، وتشخيص الشبكة." },
      "Burp Suite": { en: "Burp Suite", de: "Burp Suite", ar: "Burp Suite" },
      "Tests web, interception de requêtes et analyse de comportements.": { en: "Web testing, request interception and behavior analysis.", de: "Webtests, Abfangen von Anfragen und Verhaltensanalyse.", ar: "اختبارات الويب، اعتراض الطلبات، وتحليل السلوكيات." },
      "Python": { en: "Python", de: "Python", ar: "بايثون" },
      "Scripts d’automatisation, traitement de fichiers et prototypes sécurité.": { en: "Automation scripts, file processing and security prototypes.", de: "Automatisierungsskripte, Dateiverarbeitung und Sicherheitsprototypen.", ar: "سكربتات أتمتة، معالجة ملفات، ونماذج أولية أمنية." },
      "Web": { en: "Web", de: "Web", ar: "الويب" },
      "HTML, CSS, JavaScript, PHP et interfaces responsives.": { en: "HTML, CSS, JavaScript, PHP and responsive interfaces.", de: "HTML, CSS, JavaScript, PHP und responsive Benutzeroberflächen.", ar: "HTML وCSS وJavaScript وPHP وواجهات متجاوبة." },
      "Bases de données": { en: "Databases", de: "Datenbanken", ar: "قواعد البيانات" },
      "MySQL, modélisation, requêtes et gestion des données applicatives.": { en: "MySQL, modeling, queries and application data management.", de: "MySQL, Modellierung, Abfragen und Verwaltung von Anwendungsdaten.", ar: "MySQL، النمذجة، الاستعلامات، وإدارة بيانات التطبيقات." },
      "Cloud & DevOps": { en: "Cloud & DevOps", de: "Cloud & DevOps", ar: "السحابة وDevOps" },
      "Azure, Docker, Kubernetes et déploiement de services.": { en: "Azure, Docker, Kubernetes and service deployment.", de: "Azure, Docker, Kubernetes und Bereitstellung von Diensten.", ar: "Azure وDocker وKubernetes ونشر الخدمات." },
      "Identité & accès": { en: "Identity & access", de: "Identität & Zugriff", ar: "الهوية والوصول" },
      "Keycloak, contrôle d’accès, authentification et sécurité applicative.": { en: "Keycloak, access control, authentication and application security.", de: "Keycloak, Zugriffskontrolle, Authentifizierung und Anwendungssicherheit.", ar: "Keycloak، التحكم في الوصول، المصادقة، وأمن التطبيقات." },
      "Traefik": { en: "Traefik", de: "Traefik", ar: "Traefik" },
      "Reverse proxy, routage sécurisé et exposition de services.": { en: "Reverse proxy, secure routing and service exposure.", de: "Reverse Proxy, sicheres Routing und Veröffentlichung von Diensten.", ar: "وكيل عكسي، توجيه آمن، وإتاحة الخدمات." },
      "Cisco PT": { en: "Cisco PT", de: "Cisco PT", ar: "Cisco PT" },
      "VLAN, routage, topologies réseau et dépannage méthodique.": { en: "VLANs, routing, network topologies and methodical troubleshooting.", de: "VLANs, Routing, Netzwerktopologien und methodische Fehlerbehebung.", ar: "VLAN، التوجيه، طوبولوجيا الشبكات، واستكشاف الأعطال بمنهجية." },
      "Linux / Bash": { en: "Linux / Bash", de: "Linux / Bash", ar: "لينكس / باش" },
      "Commandes système, scripts Shell et administration de base.": { en: "System commands, shell scripts and basic administration.", de: "Systembefehle, Shell-Skripte und grundlegende Administration.", ar: "أوامر النظام، سكربتات Shell، والإدارة الأساسية." },
      "Une ligne de code à la fois": { en: "One line of code at a time", de: "Eine Codezeile nach der anderen", ar: "سطر برمجي في كل مرة" },
      "Je cherche des défis où la sécurité, la clarté et la collaboration font la différence.": { en: "I am looking for challenges where security, clarity and collaboration make a difference.", de: "Ich suche Herausforderungen, bei denen Sicherheit, Klarheit und Zusammenarbeit den Unterschied machen.", ar: "أبحث عن تحديات تصنع فيها الحماية والوضوح والتعاون فارقاً." },
      "Voir mes Expériences": { en: "View my Experience", de: "Meine Erfahrungen ansehen", ar: "عرض خبراتي" },
      "Mes Compétences": { en: "My Skills", de: "Meine Kompetenzen", ar: "مهاراتي" },
      "Techniques • Transversales • Comportementales": { en: "Technical • Cross-functional • Behavioral", de: "Technisch • Übergreifend • Verhalten", ar: "تقنية • مشتركة • سلوكية" },
      "Compétences Techniques": { en: "Technical Skills", de: "Technische Kompetenzen", ar: "المهارات التقنية" },
      "Compétences Transversales": { en: "Cross-functional Skills", de: "Übergreifende Kompetenzen", ar: "المهارات المشتركة" },
      "Compétences Comportementales": { en: "Behavioral Skills", de: "Verhaltenskompetenzen", ar: "المهارات السلوكية" },
      "Outils & Technologies": { en: "Tools & Technologies", de: "Tools & Technologien", ar: "الأدوات والتقنيات" },
      "Outils cyber": { en: "Cyber tools", de: "Cyber-Tools", ar: "أدوات الأمن السيبراني" },
      "Projets Cyber & GitHub": { en: "Cyber Projects & GitHub", de: "Cyber-Projekte & GitHub", ar: "مشاريع الأمن السيبراني و GitHub" },
      "Mes projets cyber récents": { en: "My recent cyber projects", de: "Meine neuesten Cyber-Projekte", ar: "مشاريعي الحديثة في الأمن السيبراني" },
      "Voir mon GitHub": { en: "View my GitHub", de: "Mein GitHub ansehen", ar: "عرض حسابي على GitHub" },
      "Expériences Professionnelles": { en: "Professional Experience", de: "Berufserfahrungen", ar: "الخبرات المهنية" },
      "Stages et Jobs Étudiants": { en: "Internships and Student Jobs", de: "Praktika und Studentenjobs", ar: "التدريبات والوظائف الطلابية" },
      "Outils & techniques mobilisés": { en: "Tools & techniques used", de: "Eingesetzte Tools & Techniken", ar: "الأدوات والتقنيات المستخدمة" },
      "Les environnements utilisés dans mes stages, mes missions IT et mes pratiques liées à la sécurité.": { en: "The environments used in my internships, IT missions and security-related practices.", de: "Die Umgebungen, die ich in meinen Praktika, IT-Aufgaben und sicherheitsbezogenen Praktiken nutze.", ar: "البيئات المستخدمة في تدريباتي ومهامي التقنية وممارساتي المرتبطة بالأمن." },
      "ML embarqué": { en: "Embedded ML", de: "Embedded ML", ar: "تعلم آلي مدمج" },
      "Support Système": { en: "System Support", de: "Systemsupport", ar: "دعم الأنظمة" },
      "Audit config": { en: "Config audit", de: "Konfigurationsaudit", ar: "تدقيق الإعدادات" },
      "Analyse de logs": { en: "Log analysis", de: "Loganalyse", ar: "تحليل السجلات" },
      "Stage — KU Leuven (Belgique 2025)": { en: "Internship — KU Leuven (Belgium 2025)", de: "Praktikum — KU Leuven (Belgien 2025)", ar: "تدريب — جامعة KU Leuven (بلجيكا 2025)" },
      "Lieu :": { en: "Location:", de: "Ort:", ar: "المكان:" },
      "Période :": { en: "Period:", de: "Zeitraum:", ar: "الفترة:" },
      "Louvain, Belgique •": { en: "Leuven, Belgium •", de: "Löwen, Belgien •", ar: "لوفان، بلجيكا •" },
      "Été 2025": { en: "Summer 2025", de: "Sommer 2025", ar: "صيف 2025" },
      "Stage de recherche en": { en: "Research internship in", de: "Forschungspraktikum in", ar: "تدريب بحثي في" },
      "Machine Learning distribué": { en: "distributed Machine Learning", de: "verteiltem Machine Learning", ar: "التعلم الآلي الموزع" },
      "sur microcontrôleurs": { en: "on microcontrollers", de: "auf Mikrocontrollern", ar: "على المتحكمات الدقيقة" },
      "STM32/ESP32": { en: "STM32/ESP32", de: "STM32/ESP32", ar: "STM32/ESP32" },
      ", axé sur l’optimisation mémoire et le déploiement embarqué.": { en: ", focused on memory optimization and embedded deployment.", de: ", mit Fokus auf Speicheroptimierung und Embedded Deployment.", ar: "، مع التركيز على تحسين الذاكرة والنشر المدمج." },
      "Missions principales": { en: "Main tasks", de: "Hauptaufgaben", ar: "المهام الرئيسية" },
      "Optimisation de modèles ML pour microcontrôleurs à ressources limitées.": { en: "Optimization of ML models for resource-limited microcontrollers.", de: "Optimierung von ML-Modellen für ressourcenbeschränkte Mikrocontroller.", ar: "تحسين نماذج التعلم الآلي للمتحكمات الدقيقة محدودة الموارد." },
      "Compression et quantification pour réduire la mémoire et la latence.": { en: "Compression and quantization to reduce memory use and latency.", de: "Kompression und Quantisierung zur Reduzierung von Speicherbedarf und Latenz.", ar: "الضغط والتكميم لتقليل استهلاك الذاكرة وزمن الاستجابة." },
      "Déploiement d’algorithmes sur STM32/ESP32 et analyse des performances.": { en: "Deployment of algorithms on STM32/ESP32 and performance analysis.", de: "Bereitstellung von Algorithmen auf STM32/ESP32 und Leistungsanalyse.", ar: "نشر الخوارزميات على STM32/ESP32 وتحليل الأداء." },
      "Compétences développées": { en: "Skills developed", de: "Entwickelte Kompetenzen", ar: "المهارات المكتسبة" },
      "Techniques :": { en: "Technical:", de: "Technisch:", ar: "تقنية:" },
      "programmation embarquée, optimisation de modèles, gestion des ressources matérielles.": { en: "embedded programming, model optimization, hardware resource management.", de: "Embedded-Programmierung, Modelloptimierung, Verwaltung von Hardwareressourcen.", ar: "البرمجة المدمجة، تحسين النماذج، إدارة الموارد المادية." },
      "Transversales :": { en: "Cross-functional:", de: "Übergreifend:", ar: "مشتركة:" },
      "autonomie, communication en anglais, rigueur scientifique.": { en: "autonomy, English communication, scientific rigor.", de: "Selbstständigkeit, Kommunikation auf Englisch, wissenschaftliche Sorgfalt.", ar: "الاستقلالية، التواصل بالإنجليزية، الدقة العلمية." },
      "Helpline — Crédit Agricole": { en: "Helpline — Crédit Agricole", de: "Helpline — Crédit Agricole", ar: "الدعم الفني — Crédit Agricole" },
      "Angers, France •": { en: "Angers, France •", de: "Angers, Frankreich •", ar: "أنجيه، فرنسا •" },
      "Juillet - Août 2024": { en: "July - August 2024", de: "Juli - August 2024", ar: "يوليو - أغسطس 2024" },
      "Assistance informatique aux employés du Crédit Agricole, avec support à distance et gestion d’appels en débordement.": { en: "IT assistance for Crédit Agricole employees, with remote support and overflow call handling.", de: "IT-Unterstützung für Mitarbeitende von Crédit Agricole, mit Fernsupport und Bearbeitung zusätzlicher Anrufe.", ar: "دعم تقني لموظفي Crédit Agricole، مع دعم عن بعد وإدارة المكالمات الزائدة." },
      "Support utilisateur à distance (Windows, logiciels internes, réseau).": { en: "Remote user support (Windows, internal software, network).", de: "Remote-Support für Benutzer (Windows, interne Software, Netzwerk).", ar: "دعم المستخدمين عن بعد (ويندوز، برامج داخلية، شبكة)." },
      "Résolution d’incidents et suivi via outils de ticketing.": { en: "Incident resolution and follow-up using ticketing tools.", de: "Lösung von Vorfällen und Nachverfolgung über Ticketing-Tools.", ar: "حل الحوادث ومتابعتها عبر أدوات التذاكر." },
      "Documentation et amélioration des procédures internes.": { en: "Documentation and improvement of internal procedures.", de: "Dokumentation und Verbesserung interner Verfahren.", ar: "توثيق وتحسين الإجراءات الداخلية." },
      "dépannage système/réseau, gestion de tickets, support à distance.": { en: "system/network troubleshooting, ticket management, remote support.", de: "System-/Netzwerk-Fehlerbehebung, Ticketverwaltung, Fernsupport.", ar: "استكشاف أعطال الأنظمة والشبكات، إدارة التذاكر، الدعم عن بعد." },
      "Comportementales :": { en: "Behavioral:", de: "Verhalten:", ar: "سلوكية:" },
      "communication, gestion du stress, écoute active, service client.": { en: "communication, stress management, active listening, customer service.", de: "Kommunikation, Stressmanagement, aktives Zuhören, Kundenservice.", ar: "التواصل، إدارة الضغط، الاستماع الفعال، خدمة العملاء." },
      "Expérience humaine": { en: "Human experience", de: "Menschliche Erfahrung", ar: "خبرة إنسانية" },
      "Mes actions bénévoles complètent mon parcours professionnel": { en: "My volunteer work complements my professional path", de: "Mein Ehrenamt ergänzt meinen beruflichen Weg", ar: "تجاربي التطوعية تكمل مساري المهني" },
      "En plus des stages et jobs étudiants, mes engagements bénévoles m’ont appris à travailler avec méthode, à communiquer avec des publics variés et à rester fiable dans des missions concrètes.": { en: "In addition to internships and student jobs, my volunteer commitments taught me to work methodically, communicate with varied audiences and stay reliable in concrete missions.", de: "Neben Praktika und Studentenjobs haben mich meine ehrenamtlichen Tätigkeiten gelehrt, methodisch zu arbeiten, mit unterschiedlichen Zielgruppen zu kommunizieren und in konkreten Aufgaben zuverlässig zu bleiben.", ar: "إلى جانب التدريبات والوظائف الطلابية، علمتني مشاركاتي التطوعية العمل بمنهجية، والتواصل مع فئات مختلفة، والبقاء موثوقة في مهام عملية." },
      "Buddy Language : pédagogie et adaptation": { en: "Buddy Language: teaching approach and adaptation", de: "Buddy Language: Pädagogik und Anpassung", ar: "Buddy Language: التوجيه والتكيف" },
      "Resto du Cœur : logistique et coordination": { en: "Resto du Cœur: logistics and coordination", de: "Resto du Cœur: Logistik und Koordination", ar: "Resto du Cœur: اللوجستيات والتنسيق" },
      "Mairie d’Avrillé : accompagnement et planification": { en: "Avrillé Town Hall: support and planning", de: "Rathaus Avrillé: Begleitung und Planung", ar: "بلدية أفرييه: المرافقة والتخطيط" },
      "Voir mes Actions Bénévoles": { en: "View my Volunteer Work", de: "Mein Ehrenamt ansehen", ar: "عرض أعمالي التطوعية" },
      "Expériences et Valeurs": { en: "Experience and Values", de: "Erfahrungen und Werte", ar: "الخبرات والقيم" },
      "Engagement de terrain": { en: "Field commitment", de: "Engagement vor Ort", ar: "التزام ميداني" },
      "Actions bénévoles": { en: "Volunteer work", de: "Ehrenamtliche Aktionen", ar: "الأعمال التطوعية" },
      "Mes expériences bénévoles montrent ma capacité à agir concrètement, à m’adapter à des publics différents et à travailler avec rigueur dans des contextes humains.": { en: "My volunteer experiences show my ability to take concrete action, adapt to different audiences and work rigorously in human contexts.", de: "Meine ehrenamtlichen Erfahrungen zeigen meine Fähigkeit, konkret zu handeln, mich an unterschiedliche Zielgruppen anzupassen und in menschlichen Kontexten sorgfältig zu arbeiten.", ar: "تُظهر تجاربي التطوعية قدرتي على العمل بشكل عملي، والتكيف مع فئات مختلفة، والعمل بدقة في سياقات إنسانية." },
      "missions": { en: "missions", de: "Aufgaben", ar: "مهام" },
      "compétences clés": { en: "key skills", de: "Schlüsselkompetenzen", ar: "مهارات أساسية" },
      "engagement actif": { en: "active commitment", de: "aktives Engagement", ar: "التزام نشط" },
      "Missions bénévoles": { en: "Volunteer missions", de: "Ehrenamtliche Aufgaben", ar: "المهام التطوعية" },
      "Accompagnement linguistique pour aider les étudiants à pratiquer l’oral, prendre confiance et créer des échanges culturels.": { en: "Language support to help students practice speaking, gain confidence and create cultural exchanges.", de: "Sprachliche Unterstützung, damit Studierende mündlich üben, Selbstvertrauen gewinnen und kulturellen Austausch schaffen.", ar: "دعم لغوي لمساعدة الطلاب على ممارسة المحادثة، واكتساب الثقة، وخلق تبادل ثقافي." },
      "Arabe oral": { en: "Spoken Arabic", de: "Arabisch mündlich", ar: "العربية الشفوية" },
      "Français oral": { en: "Spoken French", de: "Französisch mündlich", ar: "الفرنسية الشفوية" },
      "Échanges interculturels": { en: "Intercultural exchanges", de: "Interkultureller Austausch", ar: "تبادل ثقافي" },
      "Impact :": { en: "Impact:", de: "Wirkung:", ar: "الأثر:" },
      "faciliter l’intégration, l’expression orale et l’entraide entre étudiants.": { en: "facilitate integration, speaking practice and mutual support between students.", de: "Integration, mündlichen Ausdruck und gegenseitige Hilfe zwischen Studierenden erleichtern.", ar: "تسهيل الاندماج والتعبير الشفهي والتعاون بين الطلاب." },
      "Compétences liées au travail": { en: "Work-related skills", de: "Arbeitsbezogene Kompetenzen", ar: "مهارات مرتبطة بالعمل" },
      "Communication claire, pédagogie, adaptation au niveau de l’interlocuteur.": { en: "Clear communication, teaching approach, adaptation to the other person’s level.", de: "Klare Kommunikation, pädagogischer Ansatz, Anpassung an das Niveau des Gegenübers.", ar: "تواصل واضح، أسلوب تعليمي، والتكيف مع مستوى الطرف الآخر." },
      "Action solidaire • Distribution alimentaire": { en: "Solidarity action • Food distribution", de: "Solidarische Aktion • Lebensmittelausgabe", ar: "عمل تضامني • توزيع غذائي" },
      "Participation à la logistique et à la distribution alimentaire auprès de personnes en difficulté, dans un cadre organisé et collectif.": { en: "Participation in logistics and food distribution for people in difficulty, within an organized and collective setting.", de: "Mitarbeit in Logistik und Lebensmittelausgabe für Menschen in schwierigen Situationen, in einem organisierten und kollektiven Rahmen.", ar: "المشاركة في اللوجستيات وتوزيع الغذاء للأشخاص المحتاجين ضمن إطار منظم وجماعي." },
      "Gestion des stocks": { en: "Stock management", de: "Bestandsverwaltung", ar: "إدارة المخزون" },
      "Distribution": { en: "Distribution", de: "Ausgabe", ar: "التوزيع" },
      "Coordination équipe": { en: "Team coordination", de: "Teamkoordination", ar: "تنسيق الفريق" },
      "contribuer à une aide concrète, utile et respectueuse pour des publics fragilisés.": { en: "contribute to concrete, useful and respectful support for vulnerable groups.", de: "zu konkreter, nützlicher und respektvoller Hilfe für verletzliche Gruppen beitragen.", ar: "المساهمة في مساعدة عملية ومفيدة ومحترمة للفئات الهشة." },
      "Organisation, priorisation, communication, fiabilité dans une mission terrain.": { en: "Organization, prioritization, communication and reliability in a field mission.", de: "Organisation, Priorisierung, Kommunikation und Zuverlässigkeit in einer Aufgabe vor Ort.", ar: "التنظيم، تحديد الأولويات، التواصل، والموثوقية في مهمة ميدانية." },
      "Mairie d’Avrillé • Vie locale": { en: "Avrillé Town Hall • Local life", de: "Rathaus Avrillé • Lokales Leben", ar: "بلدية أفرييه • الحياة المحلية" },
      "Accompagnement des seniors": { en: "Support for seniors", de: "Begleitung von Senioren", ar: "مرافقة كبار السن" },
      "Accompagnement de seniors dans des activités quotidiennes et participation à l’organisation d’événements communaux.": { en: "Supporting seniors in daily activities and helping organize municipal events.", de: "Begleitung von Senioren bei täglichen Aktivitäten und Mitwirkung an der Organisation kommunaler Veranstaltungen.", ar: "مرافقة كبار السن في الأنشطة اليومية والمشاركة في تنظيم الفعاليات البلدية." },
      "Présence active": { en: "Active presence", de: "Aktive Präsenz", ar: "حضور فعّال" },
      "Planification": { en: "Planning", de: "Planung", ar: "التخطيط" },
      "Événements locaux": { en: "Local events", de: "Lokale Veranstaltungen", ar: "فعاليات محلية" },
      "soutenir le lien social et participer au bon déroulement d’activités collectives.": { en: "support social connection and contribute to the smooth running of collective activities.", de: "soziale Bindungen stärken und zum reibungslosen Ablauf gemeinsamer Aktivitäten beitragen.", ar: "دعم الروابط الاجتماعية والمساهمة في حسن سير الأنشطة الجماعية." },
      "Patience, rigueur, gestion du temps, coordination avec plusieurs interlocuteurs.": { en: "Patience, rigor, time management and coordination with several stakeholders.", de: "Geduld, Sorgfalt, Zeitmanagement und Koordination mit mehreren Ansprechpartnern.", ar: "الصبر، الدقة، إدارة الوقت، والتنسيق مع عدة أطراف." },
      "Ce que ces missions m’apportent": { en: "What these missions bring me", de: "Was mir diese Aufgaben bringen", ar: "ما تضيفه لي هذه المهام" },
      "Valeurs et compétences développées": { en: "Values and skills developed", de: "Entwickelte Werte und Kompetenzen", ar: "القيم والمهارات المكتسبة" },
      "Ces engagements renforcent mon parcours : ils développent une posture professionnelle humaine, fiable et attentive aux besoins réels.": { en: "These commitments strengthen my path: they develop a human, reliable professional attitude attentive to real needs.", de: "Diese Engagements stärken meinen Weg: Sie entwickeln eine menschliche, zuverlässige berufliche Haltung, die auf reale Bedürfnisse achtet.", ar: "تعزز هذه الالتزامات مساري، فهي تطور موقفاً مهنياً إنسانياً وموثوقاً ومنتبهاً للاحتياجات الحقيقية." },
      "🤝 Travail en équipe": { en: "🤝 Teamwork", de: "🤝 Teamarbeit", ar: "🤝 العمل الجماعي" },
      "💬 Communication": { en: "💬 Communication", de: "💬 Kommunikation", ar: "💬 التواصل" },
      "🗂️ Organisation": { en: "🗂️ Organization", de: "🗂️ Organisation", ar: "🗂️ التنظيم" },
      "🫶 Empathie": { en: "🫶 Empathy", de: "🫶 Empathie", ar: "🫶 التعاطف" },
      "⏱️ Gestion du temps": { en: "⏱️ Time management", de: "⏱️ Zeitmanagement", ar: "⏱️ إدارة الوقت" },
      "🌱 Responsabilité": { en: "🌱 Responsibility", de: "🌱 Verantwortung", ar: "🌱 المسؤولية" },
      "Internationaux & Académiques": { en: "International & Academic", de: "International & akademisch", ar: "دولية وأكاديمية" },
      "Projets Internationaux": { en: "International Projects", de: "Internationale Projekte", ar: "مشاريع دولية" },
      "République Tchèque 2024–2025 —": { en: "Czech Republic 2024–2025 —", de: "Tschechien 2024–2025 —", ar: "جمهورية التشيك 2024-2025 —" },
      "Projet universitaire axé sur la génération automatique de résumés de dialogues et la représentation vectorielle des mots, afin de faciliter la lecture et l’analyse de conversations longues.": { en: "University project focused on automatic dialogue summarization and word vector representation to make long conversations easier to read and analyze.", de: "Universitätsprojekt zur automatischen Zusammenfassung von Dialogen und zur Vektordarstellung von Wörtern, um lange Gespräche leichter lesbar und analysierbar zu machen.", ar: "مشروع جامعي يركز على التلخيص التلقائي للحوارات والتمثيل الشعاعي للكلمات لتسهيل قراءة المحادثات الطويلة وتحليلها." },
      "Objectifs et réalisations": { en: "Objectives and achievements", de: "Ziele und Ergebnisse", ar: "الأهداف والإنجازات" },
      "Développement d’un modèle": { en: "Development of a", de: "Entwicklung eines", ar: "تطوير نموذج" },
      "(Continuous Bag of Words) pour la représentation vectorielle des mots.": { en: "(Continuous Bag of Words) model for word vector representation.", de: "(Continuous Bag of Words) zur Vektordarstellung von Wörtern.", ar: "(Continuous Bag of Words) لتمثيل الكلمات شعاعياً." },
      "Mise en place d’un système de dialogue summarization avec DistilBART et évaluation ROUGE (dataset SAMSum).": { en: "Implementation of a dialogue summarization system with DistilBART and ROUGE evaluation using the SAMSum dataset.", de: "Einrichtung eines Systems zur Dialogzusammenfassung mit DistilBART und ROUGE-Bewertung auf dem SAMSum-Datensatz.", ar: "إنشاء نظام لتلخيص الحوارات باستخدام DistilBART وتقييم ROUGE على مجموعة بيانات SAMSum." },
      "Application des embeddings à des tâches de": { en: "Application of embeddings to", de: "Anwendung von Embeddings auf", ar: "تطبيق التضمينات على مهام" },
      "et d’analyse sémantique.": { en: "and semantic analysis tasks.", de: "und semantische Analyse.", ar: "والتحليل الدلالي." },
      "Analyse des performances et interprétation des résultats.": { en: "Performance analysis and interpretation of results.", de: "Leistungsanalyse und Interpretation der Ergebnisse.", ar: "تحليل الأداء وتفسير النتائج." },
      "NLP, embeddings, Transformers, ROUGE evaluation, PyTorch, HuggingFace.": { en: "NLP, embeddings, Transformers, ROUGE evaluation, PyTorch, HuggingFace.", de: "NLP, Embeddings, Transformers, ROUGE-Bewertung, PyTorch, HuggingFace.", ar: "معالجة اللغة الطبيعية، التضمينات، Transformers، تقييم ROUGE، PyTorch، HuggingFace." },
      "expérimentation, rigueur scientifique, structuration de projet, documentation GitHub.": { en: "experimentation, scientific rigor, project structuring, GitHub documentation.", de: "Experimentieren, wissenschaftliche Sorgfalt, Projektstrukturierung, GitHub-Dokumentation.", ar: "التجريب، الدقة العلمية، هيكلة المشروع، وتوثيق GitHub." },
      "Projets en entreprise": { en: "Company Projects", de: "Unternehmensprojekte", ar: "مشاريع في الشركة" },
      "Projet réalisé en équipe dans le cadre de l’alternance, à raison d’une semaine par mois en entreprise.": { en: "Team project completed as part of the work-study program, with one week per month in the company.", de: "Teamprojekt im Rahmen des dualen Studiums, mit einer Woche pro Monat im Unternehmen.", ar: "مشروع جماعي ضمن برنامج التناوب، بمعدل أسبوع واحد شهرياً داخل الشركة." },
      "Travail collaboratif autour de thématiques IA et cybersécurité, comprenant plusieurs laboratoires pratiques (5 labs IA au total).": { en: "Collaborative work around AI and cybersecurity topics, including several practical labs (5 AI labs in total).", de: "Kollaborative Arbeit zu KI- und Cybersicherheitsthemen mit mehreren Praxislaboren (insgesamt 5 KI-Labs).", ar: "عمل تعاوني حول موضوعات الذكاء الاصطناعي والأمن السيبراني، ويتضمن عدة مختبرات عملية (5 مختبرات ذكاء اصطناعي إجمالاً)." },
      "Lors de la première semaine, mise en place d’un reverse proxy Traefik, incluant la configuration du routage, la gestion des services et l’exposition sécurisée des applications.": { en: "During the first week, setup of a Traefik reverse proxy, including routing configuration, service management and secure application exposure.", de: "In der ersten Woche Einrichtung eines Traefik-Reverse-Proxys mit Routing-Konfiguration, Dienstverwaltung und sicherer Veröffentlichung von Anwendungen.", ar: "خلال الأسبوع الأول، تم إعداد وكيل عكسي Traefik، بما يشمل ضبط التوجيه وإدارة الخدمات وإتاحة التطبيقات بشكل آمن." },
      "Travail en équipe et gestion de projet.": { en: "Teamwork and project management.", de: "Teamarbeit und Projektmanagement.", ar: "العمل الجماعي وإدارة المشاريع." },
      "Bases en cybersécurité et infrastructure réseau.": { en: "Basics in cybersecurity and network infrastructure.", de: "Grundlagen der Cybersicherheit und Netzwerkinfrastruktur.", ar: "أساسيات الأمن السيبراني والبنية التحتية للشبكات." },
      "Déploiement de services et exposition sécurisée via Traefik.": { en: "Service deployment and secure exposure through Traefik.", de: "Bereitstellung von Diensten und sichere Veröffentlichung über Traefik.", ar: "نشر الخدمات وإتاحتها بشكل آمن عبر Traefik." },
      "Projets Académiques": { en: "Academic Projects", de: "Akademische Projekte", ar: "مشاريع أكاديمية" },
      "Simulation Réseau —": { en: "Network Simulation —", de: "Netzwerksimulation —", ar: "محاكاة الشبكات —" },
      "Conception et dépannage de topologies complexes intégrant routeurs, switches, VLAN et protocoles de routage.": { en: "Design and troubleshooting of complex topologies integrating routers, switches, VLANs and routing protocols.", de: "Entwurf und Fehlerbehebung komplexer Topologien mit Routern, Switches, VLANs und Routing-Protokollen.", ar: "تصميم واستكشاف أعطال طوبولوجيات معقدة تضم موجهات ومبدلات وVLAN وبروتوكولات توجيه." },
      "Configuration": { en: "Configuration", de: "Konfiguration", ar: "إعداد" },
      ", trunking, routage statique et dynamique.": { en: ", trunking, static and dynamic routing.", de: ", Trunking, statisches und dynamisches Routing.", ar: "، trunking، والتوجيه الثابت والديناميكي." },
      "Dépannage méthodique des couches OSI.": { en: "Methodical troubleshooting of OSI layers.", de: "Methodische Fehlerbehebung der OSI-Schichten.", ar: "استكشاف منهجي لأعطال طبقات OSI." },
      "Documentation du réseau et optimisation des performances.": { en: "Network documentation and performance optimization.", de: "Netzwerkdokumentation und Leistungsoptimierung.", ar: "توثيق الشبكة وتحسين الأداء." },
      "Cryptographie Appliquée —": { en: "Applied Cryptography —", de: "Angewandte Kryptografie —", ar: "التشفير التطبيقي —" },
      "Implémentation de protocoles de chiffrement et de vérification d’intégrité pour sécuriser les échanges de données.": { en: "Implementation of encryption and integrity verification protocols to secure data exchanges.", de: "Implementierung von Verschlüsselungs- und Integritätsprüfungsprotokollen zur Sicherung des Datenaustauschs.", ar: "تنفيذ بروتوكولات التشفير والتحقق من السلامة لتأمين تبادل البيانات." },
      "Utilisation de primitives :": { en: "Use of primitives:", de: "Verwendung von Primitiven:", ar: "استخدام بدائيات:" },
      ", chiffrement symétrique et asymétrique.": { en: ", symmetric and asymmetric encryption.", de: ", symmetrische und asymmetrische Verschlüsselung.", ar: "، التشفير المتماثل وغير المتماثل." },
      "Tests de sécurité et validation des algorithmes.": { en: "Security testing and algorithm validation.", de: "Sicherheitstests und Validierung von Algorithmen.", ar: "اختبارات أمنية والتحقق من الخوارزميات." },
      "Scripts de chiffrement, génération de clés et contrôle d’intégrité.": { en: "Encryption scripts, key generation and integrity checks.", de: "Verschlüsselungsskripte, Schlüsselerzeugung und Integritätskontrolle.", ar: "سكربتات تشفير، توليد مفاتيح، والتحقق من السلامة." },
      "Développement Web": { en: "Web Development", de: "Webentwicklung", ar: "تطوير الويب" },
      "Dynamique": { en: "Dynamic", de: "Dynamisch", ar: "الديناميكي" },
      "Création d’applications web interactives avec gestion des utilisateurs et interface responsive.": { en: "Creation of interactive web applications with user management and responsive interfaces.", de: "Erstellung interaktiver Webanwendungen mit Benutzerverwaltung und responsiven Oberflächen.", ar: "إنشاء تطبيقات ويب تفاعلية مع إدارة المستخدمين وواجهات متجاوبة." },
      "Technologies :": { en: "Technologies:", de: "Technologien:", ar: "التقنيات:" },
      "Développement full-stack avec gestion des sessions et sécurité.": { en: "Full-stack development with session management and security.", de: "Full-Stack-Entwicklung mit Sitzungsverwaltung und Sicherheit.", ar: "تطوير كامل الواجهة والخلفية مع إدارة الجلسات والأمان." },
      "Conception d’interfaces modernes et intuitives.": { en: "Design of modern and intuitive interfaces.", de: "Gestaltung moderner und intuitiver Benutzeroberflächen.", ar: "تصميم واجهات حديثة وبديهية." },
      "Portfolio technique": { en: "Technical portfolio", de: "Technisches Portfolio", ar: "ملف تقني" },
      "Je regroupe sur GitHub mes projets académiques et personnels liés à la cybersécurité, au réseau et à l’automatisation. L’objectif est de documenter mes démarches, les outils utilisés et les résultats obtenus.": { en: "I gather on GitHub my academic and personal projects related to cybersecurity, networking and automation. The goal is to document my process, the tools used and the results obtained.", de: "Auf GitHub bündele ich meine akademischen und persönlichen Projekte zu Cybersicherheit, Netzwerken und Automatisierung. Ziel ist es, mein Vorgehen, die verwendeten Tools und die erzielten Ergebnisse zu dokumentieren.", ar: "أجمع على GitHub مشاريعي الأكاديمية والشخصية المرتبطة بالأمن السيبراني والشبكات والأتمتة. الهدف هو توثيق منهجيتي والأدوات المستخدمة والنتائج المحققة." },
      "Sécurité web": { en: "Web security", de: "Websicherheit", ar: "أمن الويب" },
      "Analyse de vulnérabilités web": { en: "Web vulnerability analysis", de: "Analyse von Web-Schwachstellen", ar: "تحليل ثغرات الويب" },
      "Tests sur une application web volontairement vulnérable afin d’identifier les failles courantes et de proposer des corrections.": { en: "Tests on an intentionally vulnerable web application to identify common flaws and propose fixes.", de: "Tests an einer absichtlich verwundbaren Webanwendung, um häufige Schwachstellen zu identifizieren und Korrekturen vorzuschlagen.", ar: "اختبارات على تطبيق ويب ضعيف عمداً لتحديد الثغرات الشائعة واقتراح التصحيحات." },
      "Réseau": { en: "Network", de: "Netzwerk", ar: "الشبكة" },
      "Scan et cartographie réseau": { en: "Network scanning and mapping", de: "Netzwerkscan und Kartierung", ar: "فحص الشبكة ورسم خريطتها" },
      "Découverte d’hôtes, analyse de ports ouverts et lecture des services exposés pour mieux comprendre la surface d’attaque.": { en: "Host discovery, open-port analysis and review of exposed services to better understand the attack surface.", de: "Host-Erkennung, Analyse offener Ports und Prüfung exponierter Dienste, um die Angriffsfläche besser zu verstehen.", ar: "اكتشاف المضيفين، تحليل المنافذ المفتوحة وقراءة الخدمات المكشوفة لفهم سطح الهجوم بشكل أفضل." },
      "Automatisation": { en: "Automation", de: "Automatisierung", ar: "الأتمتة" },
      "Scripts Python de sécurité": { en: "Python security scripts", de: "Python-Sicherheitsskripte", ar: "سكربتات أمنية ببايثون" },
      "Création de scripts simples pour automatiser des vérifications, analyser des fichiers et générer des rapports exploitables.": { en: "Creation of simple scripts to automate checks, analyze files and generate usable reports.", de: "Erstellung einfacher Skripte zur Automatisierung von Prüfungen, Analyse von Dateien und Erstellung nutzbarer Berichte.", ar: "إنشاء سكربتات بسيطة لأتمتة التحقق، تحليل الملفات، وتوليد تقارير قابلة للاستخدام." },
      "Infrastructure": { en: "Infrastructure", de: "Infrastruktur", ar: "البنية التحتية" },
      "Déploiement sécurisé de services": { en: "Secure service deployment", de: "Sichere Dienstbereitstellung", ar: "نشر آمن للخدمات" },
      "Mise en place de services avec reverse proxy, routage et premières bonnes pratiques de sécurisation d’accès.": { en: "Setup of services with reverse proxy, routing and initial best practices for access security.", de: "Einrichtung von Diensten mit Reverse Proxy, Routing und ersten Best Practices zur Zugriffssicherung.", ar: "إعداد خدمات باستخدام وكيل عكسي وتوجيه وأول ممارسات جيدة لتأمين الوصول." },
      "& chiffrement :": { en: "& encryption:", de: "& Verschlüsselung:", ar: "والتشفير:" },
      "Connaissance des principes OWASP et des vulnérabilités web (ex. SQL Injection, XSS).": { en: "Knowledge of OWASP principles and web vulnerabilities (e.g. SQL Injection, XSS).", de: "Kenntnis der OWASP-Prinzipien und Web-Schwachstellen (z. B. SQL Injection, XSS).", ar: "معرفة بمبادئ OWASP وثغرات الويب مثل SQL Injection وXSS." },
      "Attaques réseau et interception : MITM, analyse de trafic.": { en: "Network attacks and interception: MITM, traffic analysis.", de: "Netzwerkangriffe und Abfangen: MITM, Traffic-Analyse.", ar: "هجمات الشبكات والاعتراض: MITM وتحليل حركة المرور." },
      "Chiffrement, hachage et protocoles cryptographiques (mise en œuvre et compréhension théorique).": { en: "Encryption, hashing and cryptographic protocols (implementation and theoretical understanding).", de: "Verschlüsselung, Hashing und kryptografische Protokolle (Umsetzung und theoretisches Verständnis).", ar: "التشفير، التجزئة، والبروتوكولات التشفيرية مع التنفيذ والفهم النظري." },
      "Analyse de vulnérabilités et bonnes pratiques de remédiation.": { en: "Vulnerability analysis and remediation best practices.", de: "Schwachstellenanalyse und Best Practices zur Behebung.", ar: "تحليل الثغرات وأفضل ممارسات المعالجة." },
      "Initiation aux tests d’intrusion web, à l’audit de configuration et à la lecture de rapports de sécurité.": { en: "Introduction to web penetration testing, configuration auditing and reading security reports.", de: "Einführung in Web-Penetrationstests, Konfigurationsaudits und das Lesen von Sicherheitsberichten.", ar: "مقدمة في اختبارات الاختراق للويب، تدقيق الإعدادات وقراءة تقارير الأمن." },
      "& réseaux :": { en: "& networks:", de: "& Netzwerke:", ar: "والشبكات:" },
      "Expérience générale avec services cloud et orchestrateurs (": { en: "General experience with cloud services and orchestrators (", de: "Allgemeine Erfahrung mit Cloud-Diensten und Orchestratoren (", ar: "خبرة عامة مع خدمات السحابة وأنظمة التنسيق (" },
      ",": { en: ",", de: ",", ar: "،" },
      "/ k3s).": { en: "/ k3s).", de: "/ k3s).", ar: "/ k3s)." },
      "Gestion d'identités et d'accès :": { en: "Identity and access management:", de: "Identitäts- und Zugriffsverwaltung:", ar: "إدارة الهوية والوصول:" },
      ", reverse-proxy et routage (Traefik).": { en: ", reverse proxy and routing (Traefik).", de: ", Reverse Proxy und Routing (Traefik).", ar: "، وكيل عكسي وتوجيه (Traefik)." },
      "Simulations et certifications réseaux : Cisco Packet Tracer, notions CCNA.": { en: "Network simulations and certifications: Cisco Packet Tracer, CCNA basics.", de: "Netzwerksimulationen und Zertifizierungen: Cisco Packet Tracer, CCNA-Grundlagen.", ar: "محاكاة وشهادات شبكية: Cisco Packet Tracer ومفاهيم CCNA." },
      "Administration réseau : VLAN, VPN, pare-feu et Active Directory.": { en: "Network administration: VLANs, VPNs, firewalls and Active Directory.", de: "Netzwerkadministration: VLANs, VPNs, Firewalls und Active Directory.", ar: "إدارة الشبكات: VLAN وVPN والجدران النارية وActive Directory." },
      "& analyse :": { en: "& analysis:", de: "& Analyse:", ar: "والتحليل:" },
      "Analyse réseau avec": { en: "Network analysis with", de: "Netzwerkanalyse mit", ar: "تحليل الشبكة باستخدام" },
      "et découverte de services avec": { en: "and service discovery with", de: "und Diensterkennung mit", ar: "واكتشاف الخدمات باستخدام" },
      ".": { en: ".", de: ".", ar: "." },
      "Tests de sécurité web avec": { en: "Web security testing with", de: "Web-Sicherheitstests mit", ar: "اختبارات أمن الويب باستخدام" },
      "et référentiel": { en: "and the", de: "und dem", ar: "ومرجع" },
      "Travail en environnement": { en: "Work in a", de: "Arbeit in einer", ar: "العمل في بيئة" },
      ", commandes Shell/Bash et gestion de versions avec Git/GitHub.": { en: "environment, Shell/Bash commands and version control with Git/GitHub.", de: "Umgebung, Shell/Bash-Befehle und Versionsverwaltung mit Git/GitHub.", ar: "، أوامر Shell/Bash وإدارة الإصدارات باستخدام Git/GitHub." },
      "Notions de journalisation, analyse de logs, durcissement système et contrôle des accès.": { en: "Basics of logging, log analysis, system hardening and access control.", de: "Grundlagen von Protokollierung, Loganalyse, Systemhärtung und Zugriffskontrolle.", ar: "مفاهيم التسجيل، تحليل السجلات، تقوية الأنظمة والتحكم في الوصول." },
      "& conformité sécurité :": { en: "& security compliance:", de: "& Sicherheitskonformität:", ar: "والامتثال الأمني:" },
      "Analyse de configuration, vérification des droits, durcissement système et contrôle des accès.": { en: "Configuration analysis, permission checks, system hardening and access control.", de: "Konfigurationsanalyse, Rechteprüfung, Systemhärtung und Zugriffskontrolle.", ar: "تحليل الإعدادات، التحقق من الصلاحيات، تقوية النظام والتحكم في الوصول." },
      "Utilisation de référentiels et guides de bonnes pratiques :": { en: "Use of standards and best-practice guides:", de: "Nutzung von Referenzen und Best-Practice-Leitfäden:", ar: "استخدام المراجع وأدلة أفضل الممارسات:" },
      ", CIS Benchmarks, ISO 27001 et RGPD.": { en: ", CIS Benchmarks, ISO 27001 and GDPR.", de: ", CIS Benchmarks, ISO 27001 und DSGVO.", ar: "، CIS Benchmarks وISO 27001 وRGPD." },
      "Lecture et structuration de rapports d'audit : constats, risques, niveau de criticité et recommandations.": { en: "Reading and structuring audit reports: findings, risks, criticality level and recommendations.", de: "Lesen und Strukturieren von Auditberichten: Feststellungen, Risiken, Kritikalität und Empfehlungen.", ar: "قراءة وهيكلة تقارير التدقيق: الملاحظات، المخاطر، مستوى الخطورة والتوصيات." },
      "Outils associés : OpenVAS / Greenbone, Lynis, Nessus, Nmap NSE et tableaux de suivi de remédiation.": { en: "Related tools: OpenVAS / Greenbone, Lynis, Nessus, Nmap NSE and remediation tracking tables.", de: "Zugehörige Tools: OpenVAS / Greenbone, Lynis, Nessus, Nmap NSE und Tabellen zur Maßnahmenverfolgung.", ar: "الأدوات المرتبطة: OpenVAS / Greenbone وLynis وNessus وNmap NSE وجداول متابعة المعالجة." },
      "& analyse d'incidents :": { en: "& incident analysis:", de: "& Vorfallsanalyse:", ar: "وتحليل الحوادث:" },
      "Collecte d'indices techniques : journaux système, traces réseau, événements applicatifs et historiques d'accès.": { en: "Collection of technical evidence: system logs, network traces, application events and access history.", de: "Sammlung technischer Hinweise: Systemprotokolle, Netzwerkspuren, Anwendungsereignisse und Zugriffshistorien.", ar: "جمع الأدلة التقنية: سجلات النظام، آثار الشبكة، أحداث التطبيقات وتاريخ الوصول." },
      "Analyse de logs avec grep, journalctl, Event Viewer et notions de SIEM.": { en: "Log analysis with grep, journalctl, Event Viewer and SIEM basics.", de: "Loganalyse mit grep, journalctl, Event Viewer und SIEM-Grundlagen.", ar: "تحليل السجلات باستخدام grep وjournalctl وEvent Viewer ومفاهيم SIEM." },
      "Première approche forensic : chronologie d'incident, recherche d'IOC, conservation des preuves et synthèse claire.": { en: "First forensic approach: incident timeline, IOC search, evidence preservation and clear summary.", de: "Erster forensischer Ansatz: Vorfallchronologie, IOC-Suche, Beweissicherung und klare Zusammenfassung.", ar: "مقاربة أولية للتحليل الجنائي الرقمي: تسلسل الحادث، البحث عن مؤشرات الاختراق، حفظ الأدلة وتلخيص واضح." },
      "Outils associés : Wireshark, Sysinternals, Volatility, Autopsy, Splunk ou ELK selon le contexte.": { en: "Related tools: Wireshark, Sysinternals, Volatility, Autopsy, Splunk or ELK depending on context.", de: "Zugehörige Tools: Wireshark, Sysinternals, Volatility, Autopsy, Splunk oder ELK je nach Kontext.", ar: "الأدوات المرتبطة: Wireshark وSysinternals وVolatility وAutopsy وSplunk أو ELK حسب السياق." },
      "& sécurité applicative :": { en: "& application security:", de: "& Anwendungssicherheit:", ar: "وأمن التطبيقات:" },
      "Intégration de contrôles sécurité dans le cycle de développement : revue de code, dépendances et secrets.": { en: "Integration of security controls into the development cycle: code review, dependencies and secrets.", de: "Integration von Sicherheitskontrollen in den Entwicklungszyklus: Code Review, Abhängigkeiten und Secrets.", ar: "دمج ضوابط الأمن في دورة التطوير: مراجعة الكود، الاعتماديات والأسرار." },
      "Notions de CI/CD avec GitHub Actions, tests automatisés, analyse statique et scans de conteneurs.": { en: "CI/CD basics with GitHub Actions, automated tests, static analysis and container scans.", de: "CI/CD-Grundlagen mit GitHub Actions, automatisierten Tests, statischer Analyse und Container-Scans.", ar: "مفاهيم CI/CD باستخدام GitHub Actions، اختبارات آلية، تحليل ثابت وفحص الحاويات." },
      "Outils associés : Git/GitHub, Docker, Trivy, SonarQube, Dependabot, OWASP ZAP et bonnes pratiques de pipeline.": { en: "Related tools: Git/GitHub, Docker, Trivy, SonarQube, Dependabot, OWASP ZAP and pipeline best practices.", de: "Zugehörige Tools: Git/GitHub, Docker, Trivy, SonarQube, Dependabot, OWASP ZAP und Pipeline-Best-Practices.", ar: "الأدوات المرتبطة: Git/GitHub وDocker وTrivy وSonarQube وDependabot وOWASP ZAP وأفضل ممارسات خطوط التطوير." },
      "Documentation des choix techniques pour rendre les projets plus fiables, maintenables et sécurisés.": { en: "Documentation of technical choices to make projects more reliable, maintainable and secure.", de: "Dokumentation technischer Entscheidungen, um Projekte zuverlässiger, wartbarer und sicherer zu machen.", ar: "توثيق الخيارات التقنية لجعل المشاريع أكثر موثوقية وقابلية للصيانة وأماناً." },
      "& web :": { en: "& web:", de: "& Web:", ar: "والويب:" },
      "Langages :": { en: "Languages:", de: "Sprachen:", ar: "اللغات:" },
      "— scripts, outils d'automatisation et prototypes.": { en: "- scripts, automation tools and prototypes.", de: "- Skripte, Automatisierungstools und Prototypen.", ar: "- سكربتات، أدوات أتمتة ونماذج أولية." },
      "Front / Back web :": { en: "Front / Back web:", de: "Front / Back Web:", ar: "واجهة أمامية / خلفية ويب:" },
      "— développement d'interfaces responsives et intégration serveur.": { en: "- responsive interface development and server integration.", de: "- Entwicklung responsiver Oberflächen und Serverintegration.", ar: "- تطوير واجهات متجاوبة وتكامل مع الخادم." },
      "Bases de données :": { en: "Databases:", de: "Datenbanken:", ar: "قواعد البيانات:" },
      "modélisation UML pour structurer les applications.": { en: "UML modeling to structure applications.", de: "UML-Modellierung zur Strukturierung von Anwendungen.", ar: "نمذجة UML لهيكلة التطبيقات." },
      "& Sécurité :": { en: "& Security:", de: "& Sicherheit:", ar: "والأمن:" },
      "Configuration d'équipements": { en: "Configuration of", de: "Konfiguration von", ar: "إعداد معدات" },
      "(routeurs, commutateurs) et dépannage réseau.": { en: "equipment (routers, switches) and network troubleshooting.", de: "Geräten (Router, Switches) und Netzwerk-Fehlerbehebung.", ar: "(موجهات ومبدلات) واستكشاف أعطال الشبكة." },
      "Mise en place et maintenance de VPN et règles de pare-feu.": { en: "Setup and maintenance of VPNs and firewall rules.", de: "Einrichtung und Wartung von VPNs und Firewall-Regeln.", ar: "إعداد وصيانة VPN وقواعد الجدار الناري." },
      "Utilisation du Shell pour automatisation et administration système.": { en: "Use of Shell for automation and system administration.", de: "Nutzung der Shell für Automatisierung und Systemadministration.", ar: "استخدام Shell للأتمتة وإدارة النظام." },
      "& engagement :": { en: "& commitment:", de: "& Engagement:", ar: "والالتزام:" },
      "Organisation d'événements et participation aux actions locales (logistique, distribution, soutien).": { en: "Event organization and participation in local actions (logistics, distribution, support).", de: "Organisation von Veranstaltungen und Teilnahme an lokalen Aktionen (Logistik, Verteilung, Unterstützung).", ar: "تنظيم فعاليات والمشاركة في أنشطة محلية (لوجستيات، توزيع، دعم)." },
      "Tutorat et accompagnement : aide pédagogique et soutien aux étudiants.": { en: "Tutoring and mentoring: educational help and student support.", de: "Tutoring und Begleitung: pädagogische Hilfe und Unterstützung von Studierenden.", ar: "تدريس ومرافقة: مساعدة تعليمية ودعم للطلاب." },
      "Implication durable : respect des engagements et travail collectif.": { en: "Sustained involvement: respect for commitments and collective work.", de: "Nachhaltiges Engagement: Einhaltung von Verpflichtungen und kollektive Arbeit.", ar: "التزام مستمر: احترام التعهدات والعمل الجماعي." },
      "à différents milieux :": { en: "to different environments:", de: "an verschiedene Umgebungen:", ar: "مع بيئات مختلفة:" },
      "Capacité à s'intégrer rapidement dans des équipes variées et environnements multiculturels.": { en: "Ability to integrate quickly into varied teams and multicultural environments.", de: "Fähigkeit, sich schnell in unterschiedliche Teams und multikulturelle Umgebungen zu integrieren.", ar: "القدرة على الاندماج بسرعة في فرق متنوعة وبيئات متعددة الثقافات." },
      "Apprentissage d'outils et de méthodes nouveaux selon le contexte (procédures, frameworks, outils collaboratifs).": { en: "Learning new tools and methods depending on context (procedures, frameworks, collaborative tools).", de: "Erlernen neuer Tools und Methoden je nach Kontext (Verfahren, Frameworks, kollaborative Tools).", ar: "تعلم أدوات ومنهجيات جديدة حسب السياق (إجراءات، أطر عمل، أدوات تعاونية)." },
      "& collaboration :": { en: "& collaboration:", de: "& Zusammenarbeit:", ar: "والتعاون:" },
      "Communication claire, répartition des tâches et coordination pour atteindre les objectifs du projet.": { en: "Clear communication, task distribution and coordination to reach project goals.", de: "Klare Kommunikation, Aufgabenverteilung und Koordination zur Erreichung der Projektziele.", ar: "تواصل واضح، توزيع المهام والتنسيق لتحقيق أهداف المشروع." },
      "Pratiques collaboratives : revues de travail, partage des connaissances et assistance mutuelle.": { en: "Collaborative practices: work reviews, knowledge sharing and mutual assistance.", de: "Kollaborative Praktiken: Arbeitsreviews, Wissensaustausch und gegenseitige Unterstützung.", ar: "ممارسات تعاونية: مراجعة العمل، مشاركة المعرفة والمساعدة المتبادلة." },
      "efficace :": { en: "effective:", de: "effektiv:", ar: "فعّال:" },
      "Expression orale et écrite claire, adaptation du discours selon l'interlocuteur.": { en: "Clear oral and written expression, adapting communication to the audience.", de: "Klare mündliche und schriftliche Ausdrucksweise, Anpassung der Sprache an das Gegenüber.", ar: "تعبير شفهي وكتابي واضح وتكييف الخطاب حسب المخاطب." },
      "Rédaction de documents techniques et présentations synthétiques.": { en: "Writing technical documents and concise presentations.", de: "Erstellung technischer Dokumente und zusammenfassender Präsentationen.", ar: "كتابة وثائق تقنية وعروض مختصرة." },
      "& résolution de problèmes :": { en: "& problem solving:", de: "& Problemlösung:", ar: "وحل المشكلات:" },
      "Approche méthodique : collecte d'informations, isolation des causes et définition de solutions testées.": { en: "Methodical approach: collecting information, isolating causes and defining tested solutions.", de: "Methodischer Ansatz: Informationssammlung, Eingrenzung der Ursachen und Definition getesteter Lösungen.", ar: "نهج منهجي: جمع المعلومات، عزل الأسباب وتحديد حلول مجربة." },
      "Capacité à prioriser les actions et à proposer des correctifs robustes.": { en: "Ability to prioritize actions and propose robust fixes.", de: "Fähigkeit, Maßnahmen zu priorisieren und robuste Korrekturen vorzuschlagen.", ar: "القدرة على ترتيب الأولويات واقتراح تصحيحات قوية." },
      "& curiosité :": { en: "& curiosity:", de: "& Neugier:", ar: "والفضول:" },
      "Veille technologique régulière et expérimentation de nouvelles technologies.": { en: "Regular technology monitoring and experimentation with new technologies.", de: "Regelmäßige Technologiebeobachtung und Experimentieren mit neuen Technologien.", ar: "متابعة تقنية منتظمة وتجربة تقنيات جديدة." },
      "Goût de l'apprentissage autonome et de l'amélioration continue.": { en: "Interest in autonomous learning and continuous improvement.", de: "Freude am selbstständigen Lernen und an kontinuierlicher Verbesserung.", ar: "حب التعلم الذاتي والتحسين المستمر." },
      "Audit sécurité": { en: "Security audit", de: "Sicherheitsaudit", ar: "تدقيق أمني" },
      "OpenVAS / Lynis": { en: "OpenVAS / Lynis", de: "OpenVAS / Lynis", ar: "OpenVAS / Lynis" },
      "Trivy / ZAP": { en: "Trivy / ZAP", de: "Trivy / ZAP", ar: "Trivy / ZAP" }
    };

    const originalText = new WeakMap();
    const originalElementText = new WeakMap();
    const normalizedDictionary = new Map(
      Object.entries(dictionary).map(([key, value]) => [normalizeText(key), value])
    );
    const fragmentTranslations = Object.entries(dictionary)
      .filter(([key]) => normalizeText(key).length > 3 && !/^[,.:;!?()/#\s-]+$/.test(normalizeText(key)))
      .sort((a, b) => normalizeText(b[0]).length - normalizeText(a[0]).length);

    function normalizeText(text){
      return text.replace(/\s+/g, ' ').trim();
    }

    function findTranslation(text, lang){
      const entry = dictionary[text] || normalizedDictionary.get(normalizeText(text));
      return entry?.[lang];
    }

    function translateFragments(text, lang){
      if(lang === 'fr') return text;
      let translatedText = text;
      fragmentTranslations.forEach(([key, value]) => {
        const translated = value?.[lang];
        if(translated && translatedText.includes(key)) {
          translatedText = translatedText.split(key).join(translated);
        }
      });
      return translatedText;
    }

    function getTextNodes(root){
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node){
          const parent = node.parentElement;
          if(!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE'].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      return nodes;
    }

    function getTextElements(root){
      const selector = 'h1, h2, h3, h4, h5, p, a, strong, figcaption, span, button, label';
      return Array.from(root.querySelectorAll(selector)).filter(el => {
        if(el.closest('.translate-panel')) return false;
        if(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE'].includes(el.tagName)) return false;
        if(el.children.length > 0) return false;
        return normalizeText(el.textContent);
      });
    }

    function translatePage(lang){
      getTextElements(document.body).forEach(el => {
        if(!originalElementText.has(el)) originalElementText.set(el, el.textContent);
        const original = originalElementText.get(el);
        const trimmed = original.trim();
        const spacingStart = original.match(/^\s*/)[0];
        const spacingEnd = original.match(/\s*$/)[0];
        const translated = lang === 'fr' ? trimmed : findTranslation(trimmed, lang) || translateFragments(trimmed, lang);
        if(translated) el.textContent = `${spacingStart}${translated}${spacingEnd}`;
      });

      getTextNodes(document.body).forEach(node => {
        if(!originalText.has(node)) originalText.set(node, node.nodeValue);
        const original = originalText.get(node);
        const trimmed = original.trim();
        const spacingStart = original.match(/^\s*/)[0];
        const spacingEnd = original.match(/\s*$/)[0];
        const translated = lang === 'fr' ? trimmed : findTranslation(trimmed, lang) || translateFragments(trimmed, lang);
        node.nodeValue = translated ? `${spacingStart}${translated}${spacingEnd}` : original;
      });

      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('portfolio-language', lang);
      select.value = lang;
      toggle.textContent = dictionary.Traduire[lang] || 'Traduire';
    }

    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    select.addEventListener('change', () => translatePage(select.value));

    const savedLanguage = localStorage.getItem('portfolio-language') || 'fr';
    translatePage(savedLanguage);
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslateWidget);
  } else {
    initTranslateWidget();
  }
})();

/* Lightbox + micro-tilt for gallery images */
(function(){
  function buildLightbox(){
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.innerHTML = `
      <div class="lb-content">
        <button class="lb-close" aria-label="Fermer">✕</button>
        <img src="" alt="" />
        <div class="lb-caption"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  const overlay = buildLightbox();
  const lbImg = overlay.querySelector('img');
  const lbCaption = overlay.querySelector('.lb-caption');
  const lbClose = overlay.querySelector('.lb-close');

  function openLightbox(src, alt, caption){
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = caption || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    overlay.classList.remove('active');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e)=>{ if(e.target === overlay || e.target === lbClose) closeLightbox(); });

  // Attach handlers to gallery images
  function initGallery(){
    const imgs = Array.from(document.querySelectorAll('.gallery img'));
    imgs.forEach(img => {
      img.classList.add('tilt');
      // preserve existing reveal behaviour
      img.addEventListener('click', ()=> openLightbox(img.src, img.alt, img.dataset.caption || img.alt || ''));
      // keyboard accessibility
      img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.src, img.alt, img.dataset.caption || img.alt || ''); } });
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGallery); else initGallery();

})();
