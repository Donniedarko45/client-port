/**
 * ──────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — the only file you need to edit.
 *
 *  Every word, link and media path on the site comes from here.
 *  Media lives in /public — replace the files there (keeping the same
 *  names), or point the paths below at new ones.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type Link = { label: string; href: string };

export type VideoSource = { src: string; type: string };

export type Experience = {
  role: string;
  company: string;
  type: string;
  location?: string;
  period: string;
  summary: string;
};

export type Project = {
  title: string;
  client?: string;
  description: string;
  tech: string[];
  image: { src: string; alt: string };
  /** Use "#" while a link is pending — it renders but goes nowhere. */
  links: Link[];
};

/** The animated illustration shown with a service. */
export type ServiceVisual =
  | "layout"
  | "code"
  | "performance"
  | "pen"
  | "timeline"
  | "backup"
  | "network"
  | "growth"
  | "search"
  | "support";

export type Service = {
  title: string;
  summary: string;
  tags: string[];
  visual: ServiceVisual;
};

export type Certification = {
  title: string;
  issuer: string;
  note?: string;
};

export const site = {
  /** Your deployed URL — used for social share previews. */
  url: "http://localhost:3000",

  name: {
    first: "Sourabh",
    last: "Rajput",
    full: "Sourabh (Singh) Rajput",
    pronouns: "He/Him",
  },
  role: "Full-Stack Developer",
  location: "Gurugram, Haryana, India",
  description:
    "Transforming Ideas into Intelligent Code | Bridging Human Vision with Machine Precision | Crafting Tomorrow's Technology Today",

  /** The outlined pill in the navbar. Drop your PDF at public/resume.pdf. */
  resume: "/resume.pdf",

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ] satisfies Link[],

  hero: {
    greeting: "Hi, I'm Sourabh",
    /** Cycles vertically. Each phrase breaks onto two lines at its last space. */
    rotatingRoles: ["Creative Developer", "Full Stack Dev", "Scalable Systems"],
    tagline: [
      "Transforming Ideas into Intelligent Code",
      "Bridging Human Vision with Machine Precision",
      "Crafting Tomorrow's Technology Today",
    ],
    video: {
      /**
       * Scroll-scrubbed portrait. List the best format first; browsers use the
       * first one they can play. For smooth scrubbing, encode with a keyframe
       * on every frame — see README → "Preparing the portrait video".
       */
      sources: [{ src: "/media/portrait-sourabh.webm", type: "video/webm" }] satisfies VideoSource[],
      poster: "/media/portrait-sourabh-poster.jpg",
      label: "Portrait of Sourabh Rajput",
      /** How many screen-heights of scrolling the scrub lasts. */
      scrubScreens: 1.5,
    },
    scrollHint: "Scroll to scrub timeline",
    cta: { label: "Let's Talk", href: "#contact" },
  },

  about: {
    heading: "Problem Solver — Crafting Creativity Into Tangible Art.",
    bio: "I'm a passionate Full-Stack Website Designer & Programmer with 7+ years of hands-on experience delivering responsive, secure, and high-performance web applications for clients across the globe. My focus is on crafting seamless digital experiences — from front-end design precision to back-end architecture — and now extending into AI chat agents and automation.",
    /**
     * Shown in the rounded square. For a seamless hand-off from the hero,
     * use the video's last frame cropped square (crop 30% of the excess from
     * the top, 70% from the bottom).
     */
    photo: { src: "/media/about-sourabh.jpg", alt: "Sourabh Rajput" },
    status: {
      label: "Open to opportunities",
      roles: ["Web Developer", "Full Stack Engineer", "Drupal Developer"],
    },
    stat: { value: "7+", label: "Years in Design and Development" },
    highlights: [
      { label: "Full-Stack", detail: "WordPress · Drupal · MEAN · MERN" },
      { label: "React & Node", detail: "PHP, React, ACF & REST APIs" },
      { label: "Scalable", detail: "Enterprise Drupal architecture" },
    ],
  },

  expertise: {
    heading: "7+ Years in Design and Development",
    /** Scrolls in the marquee band. */
    headlineRoles: [
      "OpenAI, LLM & Chat Agent Expert",
      "MCP, LangChain & n8n",
      "Customer Success Manager",
      "Full Stack WordPress",
      "Drupal 6.x to 10.x",
      "Shopify",
      "MEAN",
      "MERN",
      "PHP, React, ACF, REST API",
    ],
    experience: [
      {
        role: "Senior Drupal Architect",
        company: "Tangentia",
        type: "Full-time",
        location: "On-site, India",
        period: "Apr 2025 — Present",
        summary:
          "Leading end-to-end architecture, development and optimization of enterprise-level Drupal solutions; contributing to AI chat agent automation.",
      },
      {
        role: "Senior WordPress Developer",
        company: "Upwork",
        type: "Freelance",
        location: "Remote",
        period: "Aug 2022 — Present",
        summary: "Website design & development, custom theme development.",
      },
      {
        role: "Happiness Engineer, Customer Support & Success",
        company: "Pressable",
        type: "Freelance",
        location: "Remote",
        period: "Oct 2023 — Mar 2025",
        summary:
          "Resolved 500+ support tickets on installation, troubleshooting and account management with high customer satisfaction.",
      },
      {
        role: "Application Support Engineer",
        company: "Canara HSBC Oriental Bank of Commerce Life Insurance",
        type: "Full-time",
        period: "Dec 2021 — Dec 2022",
        summary: "Control-M job scheduling, managing ~40,000 jobs across production and QA.",
      },
      {
        role: "Senior Business Developer",
        company: "Need2Help IT Solution",
        type: "Full-time",
        location: "Gurugram",
        period: "Aug 2019 — Dec 2021",
        summary:
          "Client acquisition across Upwork, Freelancer, Truelancer, Guru, PPH and Fiverr.",
      },
    ] satisfies Experience[],
    /**
     * Each service gets a one-line summary, a few tags and one of the ten
     * illustrations (see ServiceVisual above). Summaries are draft copy —
     * edit them freely.
     */
    services: [
      {
        title: "WordPress Design",
        summary: "Custom themes and ACF-powered layouts, taken from PSD or Figma to a site your team can edit.",
        tags: ["Custom themes", "ACF", "Figma → WordPress"],
        visual: "layout",
      },
      {
        title: "Custom Software Development",
        summary: "Bespoke plugins, integrations and REST APIs in PHP, React and Node — plus AI chat agents built with LangChain, MCP and n8n.",
        tags: ["Plugins", "REST APIs", "AI agents"],
        visual: "code",
      },
      {
        title: "Web Development",
        summary: "Responsive, secure, high-performance builds on Drupal 6.x to 10.x, WordPress, Shopify, MEAN and MERN.",
        tags: ["Drupal", "Shopify", "MERN"],
        visual: "performance",
      },
      {
        title: "Graphic Design",
        summary: "Layouts, UI and brand assets designed in Figma and ready for development.",
        tags: ["Figma", "UI", "Brand assets"],
        visual: "pen",
      },
      {
        title: "Video Editing",
        summary: "Edits for promos, product walkthroughs and social content.",
        tags: ["Promos", "Walkthroughs", "Social"],
        visual: "timeline",
      },
      {
        title: "Backup & Recovery Systems",
        summary: "Scheduled backups and tested restores, so a bad deploy or a lost server is an inconvenience, not a crisis.",
        tags: ["Scheduled backups", "Restores", "Monitoring"],
        visual: "backup",
      },
      {
        title: "IT Consulting",
        summary: "Architecture and stack decisions, drawn from leading enterprise-level Drupal builds end to end.",
        tags: ["Architecture", "Audits", "Roadmaps"],
        visual: "network",
      },
      {
        title: "Digital Marketing",
        summary: "Landing pages and funnels built to turn traffic into enquiries.",
        tags: ["Landing pages", "Funnels", "Analytics"],
        visual: "growth",
      },
      {
        title: "SEO",
        summary: "Technical SEO, fast pages and clean structure that search engines can read.",
        tags: ["Technical SEO", "Core Web Vitals", "Schema"],
        visual: "search",
      },
      {
        title: "Technical Support",
        summary: "500+ support tickets resolved at Pressable — installation, troubleshooting and account management.",
        tags: ["Troubleshooting", "Hosting", "Accounts"],
        visual: "support",
      },
    ] satisfies Service[],
  },

  skills: {
    heading: "Technologies I Work With",
    /** Rendered first, with a brighter "core" treatment. */
    top: ["Drupal", "WordPress", "Full-Stack Development", "Amazon Web Services (AWS)", "WooCommerce"],
    additional: [
      "OpenAI / LLMs",
      "MCP",
      "LangChain",
      "n8n",
      "Shopify",
      "MEAN",
      "MERN",
      "PHP",
      "React",
      "ACF",
      "REST APIs",
      "Figma",
      "Python/Django",
    ],
    /**
     * The 3D icon cloud. Icons are monochrome SVGs in public/icons, from
     * Simple Icons — to add one, save https://cdn.simpleicons.org/<slug>/f5f5f5
     * as public/icons/<slug>.svg. (AWS, OpenAI and ACF have no Simple Icon.)
     */
    cloud: [
      { label: "Drupal", src: "/icons/drupal.svg" },
      { label: "WordPress", src: "/icons/wordpress.svg" },
      { label: "WooCommerce", src: "/icons/woocommerce.svg" },
      { label: "Shopify", src: "/icons/shopify.svg" },
      { label: "PHP", src: "/icons/php.svg" },
      { label: "HTML", src: "/icons/html5.svg" },
      { label: "React", src: "/icons/react.svg" },
      { label: "Node.js", src: "/icons/nodedotjs.svg" },
      { label: "Express", src: "/icons/express.svg" },
      { label: "MongoDB", src: "/icons/mongodb.svg" },
      { label: "Angular", src: "/icons/angular.svg" },
      { label: "Python", src: "/icons/python.svg" },
      { label: "Django", src: "/icons/django.svg" },
      { label: "Figma", src: "/icons/figma.svg" },
      { label: "LangChain", src: "/icons/langchain.svg" },
      { label: "n8n", src: "/icons/n8n.svg" },
      { label: "MCP", src: "/icons/modelcontextprotocol.svg" },
    ],
  },

  projects: {
    heading: "Featured Engineering Projects",
    items: [
      {
        title: "101 Blockchains",
        description: "PSD to HTML to WordPress — the full front-end and WordPress build.",
        tech: ["PSD", "HTML", "WordPress"],
        image: { src: "/media/projects/101-blockchains-site.jpg", alt: "101 Blockchains website" },
        links: [{ label: "View project", href: "#" }],
      },
      {
        title: "5paisa",
        description:
          "Real-Time Stock Price Update Implementation in Drupal, for a large-scale financial platform.",
        tech: ["Drupal", "Real-Time Data", "FinTech"],
        image: { src: "/media/projects/5paisa.jpg", alt: "5paisa real-time stock prices" },
        links: [{ label: "View project", href: "#" }],
      },
      {
        title: "Custom WordPress Plugin Development",
        description: "A bespoke plugin with advanced custom features, written in PHP.",
        tech: ["WordPress", "PHP", "Plugin"],
        image: { src: "/media/projects/wordpress-plugin.jpg", alt: "Custom WordPress plugin" },
        links: [{ label: "View project", href: "#" }],
      },
      {
        title: "Figma to WordPress E-Commerce Website",
        client: "Kleenly",
        description: "An end-to-end store for Kleenly, from Figma design to WordPress.",
        tech: ["Figma", "WordPress", "E-Commerce"],
        image: { src: "/media/projects/kleenly-site.jpg", alt: "Kleenly e-commerce store" },
        links: [{ label: "View project", href: "#" }],
      },
      {
        title: "Figma to WordPress Website Implementation",
        description: "A fully responsive custom build, from Figma to WordPress.",
        tech: ["Figma", "WordPress", "Responsive"],
        image: { src: "/media/projects/figma-to-wordpress.jpg", alt: "Figma to WordPress website" },
        links: [{ label: "View project", href: "#" }],
      },
    ] satisfies Project[],
  },

  certifications: {
    heading: "Certifications & Recognition",
    items: [
      {
        title: "Advanced WordPress Certification",
        issuer: "Certificate of Appreciation",
      },
      {
        title: "Python Django Development",
        issuer: "Sachtech Solution Pvt. Ltd.",
      },
    ] satisfies Certification[],
    education: {
      title: "Diploma, Information Technology",
      school: "Kurukshetra University",
      period: "Aug 2016 — Jul 2019",
      grade: "9 CGPA",
    },
    review: {
      rating: 5,
      quote: "They did well and were easy to communicate with.",
      source: "5-star Upwork review",
    },
  },

  contact: {
    heading: "Let's Build Something Exceptional.",
    email: "developersourabh98@gmail.com",
    phone: "+91-8295201571",
    linkedin: "https://www.linkedin.com/in/sourabhsinghrajput",
    /**
     * Optional. Paste a form endpoint (Formspree, Getform, your own API) to
     * receive messages directly. Left empty, the form opens the visitor's
     * email app with the message filled in.
     */
    formEndpoint: "",
  },
};

export type Site = typeof site;
