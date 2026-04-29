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
      "Réseaux": { en: "Networks", de: "Netzwerke", ar: "الشبكات" },
      "Analyse": { en: "Analysis", de: "Analyse", ar: "التحليل" },
      "Rigueur": { en: "Rigor", de: "Sorgfalt", ar: "الدقة" },
      "Technique": { en: "Technical", de: "Technisch", ar: "تقني" },
      "Comportemental": { en: "Behavioral", de: "Verhalten", ar: "سلوكي" },
      "Transversal": { en: "Cross-functional", de: "Übergreifend", ar: "مهارات مشتركة" },
      "Projection": { en: "Projection", de: "Ausblick", ar: "التطلع" },
      "Comment je me vois dans 3 à 5 ans": { en: "How I see myself in 3 to 5 years", de: "Wie ich mich in 3 bis 5 Jahren sehe", ar: "كيف أرى نفسي بعد 3 إلى 5 سنوات" },
      "Audit & analyse": { en: "Audit & analysis", de: "Audit & Analyse", ar: "التدقيق والتحليل" },
      "Sécurité réseau": { en: "Network security", de: "Netzwerksicherheit", ar: "أمن الشبكات" },
      "Cloud sécurisé": { en: "Secure cloud", de: "Sichere Cloud", ar: "سحابة آمنة" },
      "Documentation claire": { en: "Clear documentation", de: "Klare Dokumentation", ar: "توثيق واضح" },
      "Mes valeurs": { en: "My values", de: "Meine Werte", ar: "قيمي" },
      "Mes anti-valeurs": { en: "My anti-values", de: "Meine Anti-Werte", ar: "القيم التي أرفضها" },
      "Ce que je construis": { en: "What I am building", de: "Was ich aufbaue", ar: "ما أقوم ببنائه" },
      "Compétences techniques": { en: "Technical skills", de: "Technische Kompetenzen", ar: "المهارات التقنية" },
      "Projets académiques": { en: "Academic projects", de: "Akademische Projekte", ar: "المشاريع الأكاديمية" },
      "Engagements bénévoles": { en: "Volunteer commitments", de: "Ehrenamtliches Engagement", ar: "المشاركات التطوعية" },
      "Explorer les compétences": { en: "Explore skills", de: "Kompetenzen erkunden", ar: "استكشاف المهارات" },
      "Voir les projets": { en: "View projects", de: "Projekte ansehen", ar: "عرض المشاريع" },
      "Découvrir le bénévolat": { en: "Discover volunteering", de: "Ehrenamt entdecken", ar: "اكتشاف التطوع" },
      "Technologies & outils": { en: "Technologies & tools", de: "Technologien & Tools", ar: "التقنيات والأدوات" },
      "Quelques environnements et outils que j’utilise dans mes projets académiques.": { en: "Some environments and tools I use in my academic projects.", de: "Einige Umgebungen und Tools, die ich in meinen akademischen Projekten nutze.", ar: "بعض البيئات والأدوات التي أستخدمها في مشاريعي الأكاديمية." },
      "Les environnements que j’utilise avec les techniques que je développe dans mes projets.": { en: "The environments I use with the techniques I develop in my projects.", de: "Die Umgebungen, die ich mit den Techniken nutze, die ich in meinen Projekten entwickle.", ar: "البيئات التي أستخدمها مع التقنيات التي أطورها في مشاريعي." },
      "Une ligne de code à la fois": { en: "One line of code at a time", de: "Eine Codezeile nach der anderen", ar: "سطر برمجي في كل مرة" },
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
      "🌱 Responsabilité": { en: "🌱 Responsibility", de: "🌱 Verantwortung", ar: "🌱 المسؤولية" }
    };

    const originalText = new WeakMap();

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

    function translatePage(lang){
      getTextNodes(document.body).forEach(node => {
        if(!originalText.has(node)) originalText.set(node, node.nodeValue);
        const original = originalText.get(node);
        const trimmed = original.trim();
        const spacingStart = original.match(/^\s*/)[0];
        const spacingEnd = original.match(/\s*$/)[0];
        const translated = lang === 'fr' ? trimmed : dictionary[trimmed]?.[lang];
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
