

// import { useEffect, useRef, useState } from "react";
// import {
//   motion,
//   useInView,
//   useReducedMotion,
//   useScroll,
//   useTransform,
// } from "motion/react";
// import { Layers, Eye, ShieldCheck, Leaf } from "lucide-react";
// import { useLanguage } from "../../locales/LanguageContext/LanguageContext";

// /* حطي الصورة (PNG شفافة) في public/images/bim/bim-layers.png */
// const LAYERS_IMG = "/images/bim/bim-layers.png";

// const EASE = [0.2, 0.7, 0.2, 1];

// /* top = مكان كل layer في الصورة بالنسبة المئوية من فوق */
// const copy = {
//   en: {
//     eyebrow: "Why BIM 3D?",
//     title: "From Layers to a",
//     titleStrong: "Complete Picture.",
//     intro:
//       "BIM 3D brings all project layers together — architectural, structural and MEP — into one coordinated model, helping us build smarter, faster and with fewer risks.",
//     features: [
//       { icon: Layers, title: "Better Coordination", text: "All disciplines, in one model." },
//       { icon: Eye, title: "Clearer Visualization", text: "See the complete picture in 3D." },
//       { icon: ShieldCheck, title: "Fewer Risks", text: "Detect issues early." },
//       { icon: Leaf, title: "Greater Sustainability", text: "Better planning. Less waste." },
//     ],
//     layers: [
//       { top: 24, title: "Architectural Layer", text: "Design & spaces" },
//       { top: 47, title: "Structural Layer", text: "Structure & stability" },
//       { top: 67, title: "MEP Layer", text: "Systems & performance" },
//       { top: 87, title: "Coordinated Model", text: "One model. Less clashes." },
//     ],
//     alt: "Exploded 3D view of the architectural, structural and MEP layers of a building",
//   },
//   ar: {
//     eyebrow: "لماذا BIM ثلاثي الأبعاد؟",
//     title: "من الطبقات إلى",
//     titleStrong: "صورة متكاملة.",
//     intro:
//       "يجمع BIM ثلاثي الأبعاد كل طبقات المشروع — المعمارية والإنشائية والكهروميكانيكية — في نموذج واحد منسّق، لنبني بذكاء وسرعة ومخاطر أقل.",
//     features: [
//       { icon: Layers, title: "تنسيق أفضل", text: "كل التخصصات في نموذج واحد." },
//       { icon: Eye, title: "رؤية أوضح", text: "شاهد الصورة الكاملة بالأبعاد الثلاثة." },
//       { icon: ShieldCheck, title: "مخاطر أقل", text: "اكتشف المشكلات مبكرًا." },
//       { icon: Leaf, title: "استدامة أكبر", text: "تخطيط أفضل وهدر أقل." },
//     ],
//     layers: [
//       { top: 24, title: "الطبقة المعمارية", text: "التصميم والمساحات" },
//       { top: 47, title: "الطبقة الإنشائية", text: "الهيكل والاتزان" },
//       { top: 67, title: "طبقة الكهروميكانيك", text: "الأنظمة والأداء" },
//       { top: 87, title: "النموذج المنسّق", text: "نموذج واحد. تعارضات أقل." },
//     ],
//     alt: "عرض ثلاثي الأبعاد مفكوك للطبقات المعمارية والإنشائية والكهروميكانيكية للمبنى",
//   },
// };

// /* كلمة كلمة بتطلع من ورا قناع */
// function RevealWords({ text, delay = 0, reduce }) {
//   return text.split(" ").map((word, i) => (
//     <span key={`${word}-${i}`}>
//       <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
//         <motion.span
//           className="inline-block"
//           initial={reduce ? false : { y: "110%" }}
//           whileInView={{ y: 0 }}
//           viewport={{ once: true, amount: 0.6 }}
//           transition={{ duration: 0.75, delay: delay + i * 0.08, ease: EASE }}
//         >
//           {word}
//         </motion.span>
//       </span>{" "}
//     </span>
//   ));
// }

// export default function BimLayers() {
//   const { language } = useLanguage();
//   const t = copy[language] || copy.en;
//   const isRtl = language === "ar";
//   const reduce = useReducedMotion();

//   const sectionRef = useRef(null);
//   const inView = useInView(sectionRef, { amount: 0.3 });
//   const [active, setActive] = useState(0);
//   const [paused, setPaused] = useState(false);

//   /* parallax خفيف للصورة مع الـ scroll */
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"],
//   });
//   const parallaxY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

//   /* بيلف على الـ layers لوحده لحد ما حد يعمل hover */
//   useEffect(() => {
//     if (reduce || paused || !inView) return;
//     const id = setInterval(() => setActive((a) => (a + 1) % t.layers.length), 2800);
//     return () => clearInterval(id);
//   }, [reduce, paused, inView, t.layers.length]);

//   const select = (i) => {
//     setActive(i);
//     setPaused(true);
//   };

//   return (
//     <section
//       ref={sectionRef}
//       dir={isRtl ? "rtl" : "ltr"}
//       className="relative isolate w-full overflow-hidden bg-gradient-to-br from-white via-[#F7F8FC] to-[#E9EDF7] px-4 py-14 sm:px-6 lg:py-16"
//     >
//       {/* ---------- خلفية: blueprint grid بتتلاشى من الأطراف ---------- */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 -z-10 opacity-70"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(42,49,122,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,49,122,0.06) 1px, transparent 1px)",
//           backgroundSize: "44px 44px",
//           WebkitMaskImage:
//             "radial-gradient(ellipse 70% 70% at 70% 50%, black 20%, transparent 75%)",
//           maskImage:
//             "radial-gradient(ellipse 70% 70% at 70% 50%, black 20%, transparent 75%)",
//         }}
//       />

//       <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8">
//         {/* ============================ النص ============================ */}
//         <div>
//           <p className="flex items-center gap-3 text-sm font-semibold tracking-widest text-[#3C3C3B]">
//             <motion.span
//               className="h-0.5 bg-[#FEC419]"
//               initial={reduce ? false : { width: 0 }}
//               whileInView={{ width: 40 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7, ease: EASE }}
//             />
//             <motion.span
//               initial={reduce ? false : { opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               {t.eyebrow}
//             </motion.span>
//           </p>

//           <h2 className="mt-5 text-4xl font-light leading-[1.08] tracking-tight text-[#2A317A] sm:text-5xl lg:text-[3.5rem]">
//             <RevealWords text={t.title} reduce={reduce} />
//             <br />
//             <span className="relative inline-block font-bold">
//               <RevealWords text={t.titleStrong} delay={0.3} reduce={reduce} />
//               <motion.span
//                 aria-hidden="true"
//                 className={`absolute -bottom-0.5 h-2 w-full bg-[#FEC419]/70 ${
//                   isRtl ? "right-0 origin-right" : "left-0 origin-left"
//                 }`}
//                 style={{ zIndex: -1 }}
//                 initial={reduce ? false : { scaleX: 0 }}
//                 whileInView={{ scaleX: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
//               />
//             </span>
//           </h2>

//           <motion.p
//             className="mt-6 max-w-lg text-base leading-relaxed text-[#3C3C3B]/85 sm:text-lg"
//             initial={reduce ? false : { opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.6 }}
//             transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
//           >
//             {t.intro}
//           </motion.p>

//           <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
//             {t.features.map(({ icon: Icon, title, text }, i) => (
//               <motion.li
//                 key={title}
//                 className="group flex items-center gap-4 rounded-2xl border border-transparent p-2 transition-colors duration-300 hover:border-[#2A317A]/10 hover:bg-white/70"
//                 initial={reduce ? false : { opacity: 0, x: isRtl ? 24 : -24 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, amount: 0.5 }}
//                 transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: EASE }}
//               >
//                 <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#2A317A]/15 bg-white text-[#2A317A] shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#2A317A] group-hover:text-white group-hover:shadow-lg">
//                   <Icon className="h-6 w-6" strokeWidth={1.7} />
//                 </span>
//                 <span>
//                   <span className="block text-lg font-bold leading-tight text-[#2A317A]">
//                     {title}
//                   </span>
//                   <span className="mt-0.5 block text-[15px] text-[#3C3C3B]/75">{text}</span>
//                 </span>
//               </motion.li>
//             ))}
//           </ul>
//         </div>

//         {/* ============================ الصورة ============================ */}
//         <div className="relative mx-auto w-full max-w-[700px]">
//           {/* توهّج خلف الصورة عشان تندمج مع الخلفية */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute left-[30%] top-1/2 -z-10 h-[85%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(42,49,122,0.22),rgba(42,49,122,0.06)_60%,transparent)] blur-2xl md:left-[31%]"
//           />

//           <motion.div
//             style={{ y: parallaxY }}
//             className="relative mx-auto w-[74%] md:mx-0 md:w-[62%]"
//             onMouseEnter={() => setPaused(true)}
//             onMouseLeave={() => setPaused(false)}
//           >
//             {/* ظل أرضي ناعم تحت الصورة */}
//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute -bottom-3 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[100%] bg-[#2A317A]/25 blur-xl"
//             />

//             <motion.div
//               initial={reduce ? false : { opacity: 0, scale: 0.92, filter: "blur(14px)" }}
//               whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{ duration: 1, ease: EASE }}
//             >
//               <motion.img
//                 src={LAYERS_IMG}
//                 alt={t.alt}
//                 loading="lazy"
//                 draggable="false"
//                 className="relative block w-full select-none drop-shadow-[0_24px_30px_rgba(42,49,122,0.18)]"
//                 style={{
//                   WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent)",
//                   maskImage: "linear-gradient(to bottom, black 88%, transparent)",
//                 }}
//                 animate={reduce ? undefined : { y: [0, -10, 0] }}
//                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//               />
//             </motion.div>

//             {/* خط المسح اللي بينزل على كل layer */}
//             {!reduce && (
//               <motion.div
//                 aria-hidden="true"
//                 className="pointer-events-none absolute -inset-x-4 z-20"
//                 initial={false}
//                 animate={{ top: `${t.layers[active].top}%` }}
//                 transition={{ type: "spring", stiffness: 70, damping: 16 }}
//               >
//                 <span className="block h-px w-full bg-gradient-to-r from-transparent via-[#2A317A] to-transparent" />
//                 <span className="absolute inset-x-0 -top-4 h-8 bg-gradient-to-r from-transparent via-[#2A317A]/25 to-transparent blur-md" />
//               </motion.div>
//             )}
//           </motion.div>

//           {/* ---------- Labels: ديسكتوب/تابلت ---------- */}
//           <div
//             className={`absolute inset-y-0 hidden w-[38%] md:block ${
//               isRtl ? "left-0" : "right-0"
//             }`}
//           >
//             {t.layers.map((layer, i) => {
//               const on = active === i;
//               return (
//                 <motion.button
//                   key={layer.title}
//                   type="button"
//                   aria-pressed={on}
//                   onMouseEnter={() => select(i)}
//                   onMouseLeave={() => setPaused(false)}
//                   onFocus={() => select(i)}
//                   onBlur={() => setPaused(false)}
//                   onClick={() => select(i)}
//                   className={`absolute inset-x-0 flex -translate-y-1/2 items-center text-start outline-none ${
//                     isRtl ? "text-right" : "text-left"
//                   }`}
//                   style={{ top: `${layer.top}%` }}
//                   initial={reduce ? false : { opacity: 0, x: isRtl ? -20 : 20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true, amount: 0.3 }}
//                   transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: EASE }}
//                 >
//                   <motion.span
//                     aria-hidden="true"
//                     className="h-px bg-[#2A317A]"
//                     initial={false}
//                     animate={{ width: on ? 56 : 28, opacity: on ? 1 : 0.35 }}
//                     transition={{ duration: 0.4, ease: EASE }}
//                   />
//                   <span className="relative grid h-3 w-3 shrink-0 place-items-center">
//                     {on && (
//                       <span className="absolute inline-flex h-full w-full rounded-full bg-[#2A317A]/40 motion-safe:animate-ping" />
//                     )}
//                     <motion.span
//                       className="relative h-2.5 w-2.5 rounded-full bg-[#2A317A]"
//                       animate={{ scale: on ? 1.35 : 1 }}
//                       transition={{ duration: 0.3 }}
//                     />
//                   </span>
//                   <span className="ms-3 block">
//                     <span
//                       className={`block text-base font-bold leading-tight transition-colors duration-300 lg:text-lg ${
//                         on ? "text-[#2A317A]" : "text-[#3C3C3B]"
//                       }`}
//                     >
//                       {layer.title}
//                     </span>
//                     <span
//                       className={`block text-sm leading-tight transition-opacity duration-300 ${
//                         on ? "text-[#3C3C3B] opacity-100" : "text-[#3C3C3B] opacity-60"
//                       }`}
//                     >
//                       {layer.text}
//                     </span>
//                   </span>
//                 </motion.button>
//               );
//             })}
//           </div>

//           {/* ---------- Labels: موبايل (2×2) ---------- */}
//           <ul className="mt-6 grid grid-cols-2 gap-2.5 md:hidden">
//             {t.layers.map((layer, i) => {
//               const on = active === i;
//               return (
//                 <li key={layer.title}>
//                   <button
//                     type="button"
//                     aria-pressed={on}
//                     onClick={() => select(i)}
//                     className={`flex h-full w-full items-start gap-2.5 rounded-xl border p-3 text-start transition-all duration-300 ${
//                       on
//                         ? "border-[#2A317A]/30 bg-white shadow-md"
//                         : "border-[#3C3C3B]/10 bg-white/50"
//                     }`}
//                   >
//                     <span
//                       className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300 ${
//                         on ? "scale-125 bg-[#2A317A] ring-4 ring-[#2A317A]/20" : "bg-[#2A317A]/40"
//                       }`}
//                     />
//                     <span>
//                       <span className="block text-[15px] font-bold leading-tight text-[#2A317A]">
//                         {layer.title}
//                       </span>
//                       <span className="mt-0.5 block text-[13px] leading-snug text-[#3C3C3B]/75">
//                         {layer.text}
//                       </span>
//                     </span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }


import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Layers, Eye, ShieldCheck, Leaf } from "lucide-react";
import { useLanguage } from "../../locales/LanguageContext/LanguageContext";

/* حطي الصورة (PNG شفافة) في public/images/bim/bim-layers.png */
const LAYERS_IMG = "/images/bim/bim-layers.png";

const EASE = [0.2, 0.7, 0.2, 1];

/* top = مكان كل layer في الصورة بالنسبة المئوية من فوق */
const copy = {
  en: {
    eyebrow: "Why BIM 3D?",
    title: "From Layers to a",
    titleStrong: "Complete Picture.",
    intro:
      "BIM 3D brings all project layers together — architectural, structural and MEP — into one coordinated model, helping us build smarter, faster and with fewer risks.",
    features: [
      { icon: Layers, title: "Better Coordination", text: "All disciplines, in one model." },
      { icon: Eye, title: "Clearer Visualization", text: "See the complete picture in 3D." },
      { icon: ShieldCheck, title: "Fewer Risks", text: "Detect issues early." },
      { icon: Leaf, title: "Greater Sustainability", text: "Better planning. Less waste." },
    ],
    layers: [
      { top: 24, title: "Architectural Layer", text: "Design & spaces" },
      { top: 47, title: "Structural Layer", text: "Structure & stability" },
      { top: 67, title: "MEP Layer", text: "Systems & performance" },
      { top: 87, title: "Coordinated Model", text: "One model. Less clashes." },
    ],
    alt: "Exploded 3D view of the architectural, structural and MEP layers of a building",
  },
  ar: {
    eyebrow: "لماذا BIM ثلاثي الأبعاد؟",
    title: "من الطبقات إلى",
    titleStrong: "صورة متكاملة.",
    intro:
      "يجمع BIM ثلاثي الأبعاد كل طبقات المشروع — المعمارية والإنشائية والكهروميكانيكية — في نموذج واحد منسّق، لنبني بذكاء وسرعة ومخاطر أقل.",
    features: [
      { icon: Layers, title: "تنسيق أفضل", text: "كل التخصصات في نموذج واحد." },
      { icon: Eye, title: "رؤية أوضح", text: "شاهد الصورة الكاملة بالأبعاد الثلاثة." },
      { icon: ShieldCheck, title: "مخاطر أقل", text: "اكتشف المشكلات مبكرًا." },
      { icon: Leaf, title: "استدامة أكبر", text: "تخطيط أفضل وهدر أقل." },
    ],
    layers: [
      { top: 24, title: "الطبقة المعمارية", text: "التصميم والمساحات" },
      { top: 47, title: "الطبقة الإنشائية", text: "الهيكل والاتزان" },
      { top: 67, title: "طبقة الكهروميكانيك", text: "الأنظمة والأداء" },
      { top: 87, title: "النموذج المنسّق", text: "نموذج واحد. تعارضات أقل." },
    ],
    alt: "عرض ثلاثي الأبعاد مفكوك للطبقات المعمارية والإنشائية والكهروميكانيكية للمبنى",
  },
};

/* كلمة كلمة بتطلع من ورا قناع */
function RevealWords({ text, delay = 0, reduce }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        <motion.span
          className="inline-block"
          initial={reduce ? false : { y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.75, delay: delay + i * 0.08, ease: EASE }}
        >
          {word}
        </motion.span>
      </span>{" "}
    </span>
  ));
}

export default function BimLayers() {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  const isRtl = language === "ar";
  const reduce = useReducedMotion();

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /* parallax خفيف للصورة مع الـ scroll */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24]);

  /* بيلف على الـ layers لوحده لحد ما حد يعمل hover */
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % t.layers.length), 2800);
    return () => clearInterval(id);
  }, [reduce, paused, inView, t.layers.length]);

  const select = (i) => {
    setActive(i);
    setPaused(true);
  };

  return (
    <section
      ref={sectionRef}
      dir={isRtl ? "rtl" : "ltr"}
      className="relative isolate w-full overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12 lg:py-14"
    >
      {/* ---------- خلفية: blueprint grid بتتلاشى من الأطراف (بنفسجي #2A317A شفاف) ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(42,49,122,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,49,122,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 70% 50%, black 20%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 70% 50%, black 20%, transparent 75%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        {/* ============================ النص ============================ */}
        <div>
          {/* العنوان الصغير (Why BIM 3D?) بقى أكبر وأوضح */}
          <p className="flex items-center gap-4">
            <motion.span
              aria-hidden="true"
              className="h-[3px] rounded-full bg-[#2A317A]"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: 56 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <motion.span
              className={`text-lg font-extrabold text-[#2A317A] sm:text-xl lg:text-2xl ${
                isRtl ? "" : "uppercase tracking-[0.18em]"
              }`}
              initial={reduce ? false : { opacity: 0, x: isRtl ? 12 : -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              {t.eyebrow}
            </motion.span>
          </p>

          <h2
            className={`mt-4 text-[clamp(2.25rem,1.5rem+3.2vw,4rem)] font-light leading-[1.1] text-black ${
              isRtl ? "" : "tracking-tight"
            }`}
          >
            <RevealWords text={t.title} reduce={reduce} />
            <br />
            <span className="relative inline-block font-bold text-[#2A317A]">
              <RevealWords text={t.titleStrong} delay={0.3} reduce={reduce} />
              <motion.span
                aria-hidden="true"
                className={`absolute -bottom-0.5 h-2.5 w-full bg-[#2A317A]/10 ${
                  isRtl ? "right-0 origin-right" : "left-0 origin-left"
                }`}
                style={{ zIndex: -1 }}
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              />
            </span>
          </h2>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-[#3C3C3B] sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            {t.intro}
          </motion.p>

          {/* 4 مميزات: كروت 2×2 (الـ hover على div جوه الـ li عشان مايتعارضش مع حركة motion) */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.features.map(({ icon: Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: EASE }}
              >
                <div className="group flex h-full items-center gap-4 rounded-2xl border border-[#3C3C3B]/10 bg-white p-4 shadow-[0_8px_24px_-16px_rgba(42,49,122,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2A317A]/30 hover:shadow-[0_18px_34px_-18px_rgba(42,49,122,0.5)] sm:flex-col sm:items-start sm:gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#2A317A]/10 text-[#2A317A] transition-colors duration-300 group-hover:bg-[#2A317A] group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block text-lg font-bold leading-tight text-[#2A317A]">
                      {title}
                    </span>
                    <span className="mt-1 block text-[15px] leading-snug text-[#3C3C3B]">
                      {text}
                    </span>
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ============================ الصورة ============================ */}
        <div className="relative mx-auto w-full max-w-[700px]">
          {/* توهّج خلف الصورة عشان تندمج مع الخلفية */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[30%] top-1/2 -z-10 h-[85%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(42,49,122,0.18),rgba(42,49,122,0.05)_60%,transparent)] blur-2xl md:left-[31%]"
          />

          <motion.div
            style={{ y: parallaxY }}
            className="relative mx-auto w-[74%] md:mx-0 md:w-[62%]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* ظل أرضي ناعم تحت الصورة */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-3 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[100%] bg-[#2A317A]/25 blur-xl"
            />

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.92, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <motion.img
                src={LAYERS_IMG}
                alt={t.alt}
                loading="lazy"
                draggable="false"
                className="relative block w-full select-none drop-shadow-[0_24px_30px_rgba(42,49,122,0.18)]"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent)",
                  maskImage: "linear-gradient(to bottom, black 88%, transparent)",
                }}
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* خط المسح اللي بينزل على كل layer */}
            {!reduce && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-4 z-20"
                initial={false}
                animate={{ top: `${t.layers[active].top}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 16 }}
              >
                <span className="block h-px w-full bg-gradient-to-r from-transparent via-[#2A317A] to-transparent" />
                <span className="absolute inset-x-0 -top-4 h-8 bg-gradient-to-r from-transparent via-[#2A317A]/25 to-transparent blur-md" />
              </motion.div>
            )}
          </motion.div>

          {/* ---------- Labels: ديسكتوب/تابلت ---------- */}
          <div
            className={`absolute inset-y-0 hidden w-[38%] md:block ${
              isRtl ? "left-0" : "right-0"
            }`}
          >
            {t.layers.map((layer, i) => {
              const on = active === i;
              return (
                <motion.button
                  key={layer.title}
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => select(i)}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => select(i)}
                  onBlur={() => setPaused(false)}
                  onClick={() => select(i)}
                  className={`absolute inset-x-0 flex -translate-y-1/2 items-center text-start outline-none ${
                    isRtl ? "text-right" : "text-left"
                  }`}
                  style={{ top: `${layer.top}%` }}
                  initial={reduce ? false : { opacity: 0, x: isRtl ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: EASE }}
                >
                  <motion.span
                    aria-hidden="true"
                    className="h-px bg-[#2A317A]"
                    initial={false}
                    animate={{ width: on ? 56 : 28, opacity: on ? 1 : 0.35 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                  <span className="relative grid h-3 w-3 shrink-0 place-items-center">
                    {on && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#2A317A]/40 motion-safe:animate-ping" />
                    )}
                    <motion.span
                      className="relative h-2.5 w-2.5 rounded-full bg-[#2A317A]"
                      animate={{ scale: on ? 1.35 : 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                  <span className="ms-3 block">
                    {/* رقم الـ layer: 01, 02, ... */}
                    <span
                      className={`block text-xs font-bold tabular-nums tracking-widest transition-colors duration-300 ${
                        on ? "text-[#2A317A]" : "text-[#3C3C3B]/50"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`block text-base font-bold leading-tight transition-colors duration-300 lg:text-lg ${
                        on ? "text-[#2A317A]" : "text-[#3C3C3B]"
                      }`}
                    >
                      {layer.title}
                    </span>
                    <span
                      className={`block text-[15px] leading-tight text-[#3C3C3B] transition-opacity duration-300 ${
                        on ? "opacity-100" : "opacity-65"
                      }`}
                    >
                      {layer.text}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* ---------- Labels: موبايل (2×2) ---------- */}
          <ul className="mt-6 grid grid-cols-2 gap-2.5 md:hidden">
            {t.layers.map((layer, i) => {
              const on = active === i;
              return (
                <li key={layer.title}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => select(i)}
                    className={`flex h-full w-full items-start gap-2.5 rounded-xl border p-3 text-start transition-all duration-300 ${
                      on
                        ? "border-[#2A317A]/30 bg-white shadow-md"
                        : "border-[#3C3C3B]/10 bg-white/60"
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300 ${
                        on ? "scale-125 bg-[#2A317A] ring-4 ring-[#2A317A]/20" : "bg-[#2A317A]/40"
                      }`}
                    />
                    <span>
                      <span className="block text-[15px] font-bold leading-tight text-[#2A317A]">
                        {layer.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-[#3C3C3B]">
                        {layer.text}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}