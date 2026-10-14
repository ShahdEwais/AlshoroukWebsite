// import { motion, useReducedMotion } from "motion/react";
// import { useLanguage } from "../../locales/LanguageContext/LanguageContext";
// import { bimPhases } from "../../features/projects/bimPhases";
// import "./ProjectBimJourney.css";

// const positions = [
//   { x: 50, y: 8 },
//   { x: 81, y: 20 },
//   { x: 92, y: 50 },
//   { x: 70, y: 85 },
//   { x: 30, y: 85 },
//   { x: 8, y: 50 },
//   { x: 19, y: 20 },
// ];

// const phaseConnections = positions.map((point, index) => {
//   const next = positions[(index + 1) % positions.length];
//   const middleX = (point.x + next.x) / 2 - 50;
//   const middleY = (point.y + next.y) / 2 - 50;
//   const length = Math.hypot(middleX, middleY) || 1;
//   const controlX = 50 + (middleX / length) * 42;
//   const controlY = 50 + (middleY / length) * 42;
//   return `M ${point.x} ${point.y} Q ${controlX} ${controlY} ${next.x} ${next.y}`;
// });

// const copy = {
//   en: {
//     eyebrow: "BIM DELIVERY JOURNEY",
//     title: "A coordinated model. A clearer build.",
//     intro: "Explore the BIM phases assigned to this project.",
//     model: "Illustrative isometric BIM model",
//     modelNote: "Illustrative BIM view",
//     verified: "Phase assignments are being verified for this project.",
//     assigned: "Assigned BIM phases",
//     phase: "Phase",
//   },
//   ar: {
//     eyebrow: "رحلة نمذجة معلومات البناء",
//     title: "نموذج منسق. وتنفيذ أوضح.",
//     intro: "استكشف مراحل نمذجة معلومات البناء المعتمدة لهذا المشروع.",
//     model: "نموذج BIM ثلاثي الأبعاد توضيحي",
//     modelNote: "تصور توضيحي لنموذج BIM",
//     verified: "يجري التحقق من مراحل نمذجة المعلومات الخاصة بهذا المشروع.",
//     assigned: "مراحل نمذجة المعلومات المعتمدة",
//     phase: "المرحلة",
//   },
// };

// export default function ProjectBimJourney({ project }) {
//   const { language } = useLanguage();
//   const t = copy[language] || copy.en;
//   const reduceMotion = useReducedMotion();
//   const projectPhaseList = Array.isArray(project.bimPhaseIds)
//     ? project.bimPhaseIds
//     : Array.isArray(project.phases) ? project.phases : [];
//   const projectPhaseIds = projectPhaseList.map((item) => (typeof item === "object" ? item.id : item));
//   const configuredPhaseIds = bimPhases
//     .filter((phase) => phase.projectIds.map(Number).includes(Number(project.id)))
//     .map((phase) => phase.id);
//   const assignedIds = [...projectPhaseIds, ...configuredPhaseIds];
//   const hasAssignments = assignedIds.length > 0;
//   const activePhases = bimPhases.map((phase, index) =>
//     assignedIds.includes(phase.id) || assignedIds.includes(index + 1) || assignedIds.includes(String(index + 1))
//   );

//   return (
//     <section className="project-bim" aria-labelledby="project-bim-title" dir={language === "ar" ? "rtl" : "ltr"}>
//       <div className="project-bim__inner">
//         <motion.header
//           className="project-bim__header"
//           initial={reduceMotion ? false : { opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.35 }}
//           transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
//         >
//           <p className="project-bim__eyebrow"><span />{t.eyebrow}</p>
//           <h2 id="project-bim-title">{t.title}</h2>
//           <p>{t.intro}</p>
//         </motion.header>

//         <div className="project-bim__diagram" aria-label={t.assigned}>
//           <motion.svg className="project-bim__orbit" viewBox="0 0 100 100" role="presentation" aria-hidden="true">
//             <motion.circle
//               cx="50"
//               cy="50"
//               r="42"
//               initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
//               whileInView={{ pathLength: 1, opacity: 1 }}
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 1.3, ease: "easeInOut" }}
//             />
//             {phaseConnections.map((path, index) => {
//               const connected = activePhases[index] && activePhases[(index + 1) % activePhases.length];
//               return (
//                 <motion.path
//                   key={`connection-${index}`}
//                   d={path}
//                   className="project-bim__connection"
//                   initial={false}
//                   animate={{ pathLength: connected ? 1 : 0, opacity: connected ? 1 : 0 }}
//                   transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
//                 />
//               );
//             })}
//           </motion.svg>

//           <div className="project-bim__model">
//             <motion.div
//               className="project-bim__model-content"
//               initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
//               whileInView={{ opacity: 1, scale: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.25 }}
//               transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <img
//                 src="/images/bim/isometric-campus.jpg"
//                 alt={t.model}
//               />
//               <span>{t.modelNote}</span>
//             </motion.div>
//           </div>

//           {bimPhases.map((phase, index) => {
//             const active = hasAssignments && activePhases[index];
//             const point = positions[index];
//             return (
//               <div
//                 key={phase.id}
//                 className={`project-bim__phase${active ? " is-assigned" : ""}${index === 5 || index === 6 ? " is-left" : ""}${index === 1 || index === 2 ? " is-right" : ""}`}
//                 style={{ left: `${point.x}%`, top: `${point.y}%` }}
//                 role="img"
//                 aria-label={`${t.phase} ${index + 1}: ${phase.label} ${phase.detail}`}
//               >
//                 <motion.span
//                   className="project-bim__phase-content"
//                   initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 5 }}
//                   whileInView={{ opacity: 1, scale: 1, y: 0 }}
//                   viewport={{ once: true, amount: 0.2 }}
//                   transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.18 + index * 0.07 }}
//                 >
//                   <span className="project-bim__dot">{index + 1}</span>
//                   <span className="project-bim__phase-copy">
//                     <strong>{phase.label}</strong>
//                     {phase.detail && <small>{phase.detail}</small>}
//                   </span>
//                 </motion.span>
//               </div>
//             );
//           })}
//         </div>

//         {!hasAssignments && <p className="project-bim__notice">{t.verified}</p>}
//       </div>
//     </section>
//   );
// }



import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../../locales/LanguageContext/LanguageContext";
import { bimPhases } from "../../features/projects/bimPhases";
import "./ProjectBimJourney.css";

/* ------------------------------------------------------------------ */
/*  Orbit geometry                                                     */
/*  الـ phases متوزعة على شكل ellipse (قطع ناقص) بدل ما نكتب الأماكن    */
/*  بإيدينا، فلو عدد الـ phases اتغير الشكل يفضل متناسق لوحده.          */
/* ------------------------------------------------------------------ */
const RX = 35; // نصف القطر الأفقي (% من عرض الدايجرام)
const RY = 38; // نصف القطر الرأسي (% من ارتفاع الدايجرام)

const positions = bimPhases.map((_, index) => {
  const angle = ((-90 + (360 / bimPhases.length) * index) * Math.PI) / 180;
  return {
    x: +(50 + RX * Math.cos(angle)).toFixed(2),
    y: +(50 + RY * Math.sin(angle)).toFixed(2),
  };
});

// كل خط بيوصل phase بالّلي بعدها، ماشي على نفس الـ ellipse بالظبط (Arc)
const connections = positions.map((point, index) => {
  const next = positions[(index + 1) % positions.length];
  return `M ${point.x} ${point.y} A ${RX} ${RY} 0 0 1 ${next.x} ${next.y}`;
});

// الـ label يطلع جنب النقطة (يمين/شمال) أو تحتها حسب مكانها
const getSide = (x) => (x > 72 ? "right" : x < 28 ? "left" : "center");

const copy = {
  en: {
    eyebrow: "BIM Delivery Journey",
    title: "A coordinated model. A clearer build.",
    intro: "Explore the BIM phases assigned to this project.",
    model: "Illustrative isometric BIM model",
    verified: "Phase assignments are being verified for this project.",
    assigned: "Assigned BIM phases",
    phase: "Phase",
  },
  ar: {
    eyebrow: "رحلة نمذجة معلومات البناء",
    title: "نموذج منسق. وتنفيذ أوضح.",
    intro: "استكشف مراحل نمذجة معلومات البناء المعتمدة لهذا المشروع.",
    model: "نموذج BIM ثلاثي الأبعاد توضيحي",
    verified: "يجري التحقق من مراحل نمذجة المعلومات الخاصة بهذا المشروع.",
    assigned: "مراحل نمذجة المعلومات المعتمدة",
    phase: "المرحلة",
  },
};

const EASE = [0.22, 1, 0.36, 1];

export default function ProjectBimJourney({ project }) {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  const reduceMotion = useReducedMotion();

  /* ---------- تحديد الـ phases المعتمدة للمشروع (زي ما كانت) ---------- */
  const projectPhaseList = Array.isArray(project.bimPhaseIds)
    ? project.bimPhaseIds
    : Array.isArray(project.phases)
      ? project.phases
      : [];
  const projectPhaseIds = projectPhaseList.map((item) =>
    typeof item === "object" ? item.id : item
  );
  const configuredPhaseIds = bimPhases
    .filter((phase) => phase.projectIds.map(Number).includes(Number(project.id)))
    .map((phase) => phase.id);
  const assignedIds = [...projectPhaseIds, ...configuredPhaseIds];
  const hasAssignments = assignedIds.length > 0;
  const activePhases = bimPhases.map(
    (phase, index) =>
      assignedIds.includes(phase.id) ||
      assignedIds.includes(index + 1) ||
      assignedIds.includes(String(index + 1))
  );

  return (
    <section
      className="project-bim"
      aria-labelledby="project-bim-title"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="project-bim__inner">
        {/* ------------------------------ Header ------------------------------ */}
        <motion.header
          className="project-bim__header"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <p className="project-bim__eyebrow">
            <span />
            {t.eyebrow}
          </p>
          <h2 id="project-bim-title">{t.title}</h2>
          <p className="project-bim__intro">{t.intro}</p>
        </motion.header>

        {/* ------------------------------ Diagram ----------------------------- */}
        <div className="project-bim__diagram" role="list" aria-label={t.assigned}>
          {/* الخطوط اللي بتوصل الـ phases ببعض (ديسكتوب فقط) */}
          <svg
            className="project-bim__orbit"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <ellipse
              className="project-bim__orbit-inner"
              cx="50"
              cy="50"
              rx={RX - 10}
              ry={RY - 10}
            />

            {connections.map((d, index) => {
              const connected =
                activePhases[index] &&
                activePhases[(index + 1) % activePhases.length];

              return (
                <g key={`connection-${index}`}>
                  {/* خط أساسي خفيف بيظهر دايمًا عشان الـ phases تبان متوصلة */}
                  <path d={d} className="project-bim__link" />

                  {connected && (
                    <>
                      {/* الخط الأساسي اللي بيترسم وقت ما السيكشن يظهر */}
                      <motion.path
                        d={d}
                        className="project-bim__link-active"
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.45 + index * 0.14,
                          ease: "easeInOut",
                        }}
                      />
                      {/* نقط صغيرة بتتحرك على الخط (إحساس إن الداتا بتنتقل) */}
                      <path d={d} className="project-bim__link-flow" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* الصورة: من غير إطار ولا كارت، بتدوب في خلفية السيكشن */}
          <div className="project-bim__model">
            <motion.div
              className="project-bim__model-content"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              <img src="/images/bim/isometric-campus.jpg" alt={t.model} />
            </motion.div>
          </div>

          {/* ------------------------------ Phases ----------------------------- */}
          {bimPhases.map((phase, index) => {
            const active = hasAssignments && activePhases[index];
            const nextActive =
              hasAssignments && activePhases[(index + 1) % activePhases.length];
            const point = positions[index];
            const side = getSide(point.x);

            return (
              <div
                key={phase.id}
                className={[
                  "project-bim__phase",
                  `is-${side}`,
                  active ? "is-assigned" : "",
                  active && nextActive ? "is-linked" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ "--x": `${point.x}%`, "--y": `${point.y}%`, "--i": index }}
                role="listitem"
                aria-label={`${t.phase} ${index + 1}: ${phase.label} ${phase.detail || ""}`}
              >
                <motion.div
                  className="project-bim__phase-content"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: reduceMotion ? 0 : 0.2 + index * 0.1,
                    ease: EASE,
                  }}
                >
                  <span className="project-bim__dot">{index + 1}</span>
                  <span className="project-bim__phase-copy">
                    <strong>{phase.label}</strong>
                    {phase.detail && <small>{phase.detail}</small>}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {!hasAssignments && <p className="project-bim__notice">{t.verified}</p>}
      </div>
    </section>
  );
}