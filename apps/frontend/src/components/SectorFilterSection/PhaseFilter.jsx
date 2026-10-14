
// import { useEffect, useRef } from "react";
// import { AnimatePresence, motion, useReducedMotion } from "motion/react";
// import { LayoutGrid, Layers } from "lucide-react";
// import { projectBimPhaseAssignments } from "../../features/projects/projectsData";

// /* ------------------------------------------------------------------ */
// /*  الـ 7 phases بنفس الـ ids (slugs) المستخدمة في projectsData.js      */
// /*  الترتيب هو نفس ترتيب الرحلة في سيكشن الـ BIM                        */
// /* ------------------------------------------------------------------ */
// export const PHASES = [
//   { id: "model-creation", label: "Model Creation", detail: "LOD 300" },
//   { id: "construction-model", label: "Develop Construction Model", detail: "LOD 400" },
//   { id: "quantification", label: "Quantification", detail: "BOQ" },
//   { id: "constructability", label: "Assess Constructability", detail: "LOD 350" },
//   { id: "shop-drawings", label: "Shop Drawing Extraction", detail: "" },
//   { id: "as-built-model", label: "As-Built Model", detail: "LOD 500" },
//   { id: "as-built-drawings", label: "As-Built Drawing Extraction", detail: "" },
// ];

// /* بترجّع الـ phases بتاعة المشروع:
//    من المشروع نفسه (bimPhaseIds) ولو مش موجودة تجيبها من projectBimPhaseAssignments */
// export function getProjectPhaseIds(project) {
//   if (Array.isArray(project.bimPhaseIds) && project.bimPhaseIds.length > 0) {
//     return project.bimPhaseIds;
//   }
//   return projectBimPhaseAssignments[project.id] || [];
// }

// /* ------------------------------------------------------------------ */
// /*  Compact version: صف واحد بس (~130px ارتفاع) وارتفاعه ثابت مهما      */
// /*  اخترتي، يعني الفلتر مبيغيّرش طول السيكشن لما تدوسي على phase.        */
// /*                                                                     */
// /*  value: "all" أو id بتاع phase                                      */
// /*  counts: { [phaseId]: number }                                      */
// /*  total: عدد المشاريع (للزرار "All phases")                          */
// /* ------------------------------------------------------------------ */
// export default function PhaseFilter({ value, onChange, counts, total }) {
//   const reduceMotion = useReducedMotion();
//   const trackRef = useRef(null);
//   const firstRender = useRef(true);

//   const maxCount = Math.max(1, ...PHASES.map((phase) => counts[phase.id] ?? 0));
//   const selectedIndex = PHASES.findIndex((phase) => phase.id === value);
//   const selectedPhase = selectedIndex >= 0 ? PHASES[selectedIndex] : null;

//   // لما الـ tiles تبقى scroll أفقي: الـ phase المختارة تتوسّط لوحدها
//   useEffect(() => {
//     if (firstRender.current) {
//       firstRender.current = false;
//       return;
//     }
//     const track = trackRef.current;
//     if (!track || track.scrollWidth <= track.clientWidth) return;

//     track.querySelector('[data-active="true"]')?.scrollIntoView({
//       behavior: reduceMotion ? "auto" : "smooth",
//       inline: "center",
//       block: "nearest",
//     });
//   }, [value, reduceMotion]);

//   return (
//     <div className="relative mb-8 rounded-2xl border border-[#3C3C3B]/15 bg-white p-3 shadow-sm sm:p-4">
//       {/* ------------------------------ Header ------------------------------ */}
//       <div className="mb-3 flex items-center justify-between gap-3">
//         <div className="flex min-w-0 items-center gap-2.5">
//           <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#2A317A] text-white">
//             <Layers className="h-4 w-4" />
//           </span>

//           <div className="min-w-0">
//             <h3 className="text-xs font-bold uppercase tracking-widest text-[#2A317A]">
//               Filter by BIM phase
//             </h3>

//             {/* ارتفاع ثابت (h-5) عشان تغيير النص مايحرّكش اللي تحته */}
//             <div className="h-5 overflow-hidden">
//               <AnimatePresence mode="wait" initial={false}>
//                 {selectedPhase ? (
//                   <motion.p
//                     key="selected"
//                     initial={reduceMotion ? false : { opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.15 }}
//                     className="flex items-center gap-2 truncate text-xs leading-5 text-[#3C3C3B]"
//                   >
//                     <span className="truncate">
//                       <b className="text-[#2A317A]">{counts[selectedPhase.id] ?? 0}</b> projects
//                       · Phase {selectedIndex + 1} of {PHASES.length}
//                     </span>
//                     <span className="hidden gap-1 sm:flex" aria-hidden="true">
//                       {PHASES.map((phase, k) => (
//                         <span
//                           key={phase.id}
//                           className={`h-1.5 w-4 rounded-full transition-colors duration-300 ${
//                             k === selectedIndex
//                               ? "bg-[#2A317A]"
//                               : k < selectedIndex
//                                 ? "bg-[#2A317A]/35"
//                                 : "bg-[#3C3C3B]/15"
//                           }`}
//                         />
//                       ))}
//                     </span>
//                   </motion.p>
//                 ) : (
//                   <motion.p
//                     key="hint"
//                     initial={reduceMotion ? false : { opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -8 }}
//                     transition={{ duration: 0.15 }}
//                     className="truncate text-xs leading-5 text-[#3C3C3B]/70"
//                   >
//                     Pick a phase to see the projects that went through it.
//                   </motion.p>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>

//         <button
//           type="button"
//           aria-pressed={value === "all"}
//           onClick={() => onChange("all")}
//           className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A317A] ${
//             value === "all"
//               ? "border-[#2A317A] bg-[#2A317A] text-white"
//               : "border-[#3C3C3B]/20 bg-white text-[#3C3C3B] hover:border-[#2A317A] hover:text-[#2A317A]"
//           }`}
//         >
//           <LayoutGrid className="h-3.5 w-3.5" />
//           <span className="hidden sm:inline">All phases</span>
//           <span className="sm:hidden">All</span>
//           <span
//             className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
//               value === "all" ? "bg-white/20 text-white" : "bg-[#3C3C3B]/10 text-[#3C3C3B]"
//             }`}
//           >
//             {total}
//           </span>
//         </button>
//       </div>

//       {/* ------------------------------ Tiles ------------------------------ */}
//       <div className="relative">
//         {/* scroll أفقي لحد lg، وبعدها 7 أعمدة في صف واحد */}
//         <div
//           ref={trackRef}
//           role="group"
//           aria-label="Filter by BIM phase"
//           className="-mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 py-1.5 [scrollbar-width:none] lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
//         >
//           {PHASES.map((phase, index) => {
//             const active = value === phase.id;
//             const count = counts[phase.id] ?? 0;
//             const empty = count === 0;

//             return (
//             //   <button
//             //     key={phase.id}
//             //     type="button"
//             //     data-active={active}
//             //     aria-pressed={active}
//             //     title={phase.detail ? `${phase.label} · ${phase.detail}` : phase.label}
//             //     onClick={() => onChange(active ? "all" : phase.id)}
//             //     className={`group relative flex min-w-[152px] shrink-0 snap-center items-center gap-2 rounded-xl border px-2.5 pb-3.5 pt-2.5 text-left outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[#2A317A]/30 md:min-w-[176px] lg:min-w-0 ${
//             //       active
//             //         ? "border-[#2A317A] text-white shadow-[0_12px_24px_-10px_rgba(42,49,122,0.6)]"
//             //         : "border-[#3C3C3B]/15 bg-white text-[#3C3C3B] hover:-translate-y-0.5 hover:border-[#2A317A]/60 hover:shadow-[0_10px_22px_-12px_rgba(42,49,122,0.4)]"
//             //     } ${empty && !active ? "opacity-55 hover:opacity-100" : ""} ${
//             //       index < PHASES.length - 1
//             //         ? "lg:after:absolute lg:after:-right-3 lg:after:top-1/2 lg:after:h-0.5 lg:after:w-3 lg:after:-translate-y-1/2 lg:after:bg-[#2A317A]/25 lg:after:content-['']"
//             //         : ""
//             //     }`}
//             //   >
//             //     {/* الخلفية الزرقا بتنزلق من tile للتانية */}
//             //     {active && (
//             //       <motion.span
//             //         layoutId="phase-tile-active"
//             //         className="absolute -inset-px rounded-xl bg-gradient-to-br from-[#3A44A8] to-[#2A317A]"
//             //         transition={{ type: "spring", stiffness: 350, damping: 30 }}
//             //       />
//             //     )}

//             //     <span
//             //       className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-300 ${
//             //         active
//             //           ? "bg-white text-[#2A317A]"
//             //           : "bg-[#2A317A]/10 text-[#2A317A] group-hover:bg-[#2A317A] group-hover:text-white"
//             //       }`}
//             //     >
//             //       {index + 1}
//             //     </span>

//             //     <span className="relative z-10 line-clamp-2 min-w-0 flex-1 text-[13px] font-semibold leading-tight">
//             //       {phase.label}
//             //     </span>

//             //     <span className="relative z-10 overflow-hidden">
//             //       <AnimatePresence mode="wait" initial={false}>
//             //         <motion.span
//             //           key={count}
//             //           className="block text-lg font-extrabold leading-none tabular-nums"
//             //           initial={reduceMotion ? false : { y: 12, opacity: 0 }}
//             //           animate={{ y: 0, opacity: 1 }}
//             //           exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
//             //           transition={{ duration: 0.15 }}
//             //         >
//             //           {count}
//             //           <span className="sr-only"> projects</span>
//             //         </motion.span>
//             //       </AnimatePresence>
//             //     </span>

//             //     {/* شريط نسبي: عدد مشاريع الـ phase دي مقارنة بأكتر phase */}
//             //     <span
//             //       aria-hidden="true"
//             //       className={`absolute inset-x-2.5 bottom-1.5 z-10 h-[3px] overflow-hidden rounded-full ${
//             //         active ? "bg-white/25" : "bg-[#3C3C3B]/10"
//             //       }`}
//             //     >
//             //       <motion.span
//             //         className={`block h-full rounded-full ${active ? "bg-white" : "bg-[#2A317A]"}`}
//             //         initial={reduceMotion ? false : { width: 0 }}
//             //         animate={{ width: `${(count / maxCount) * 100}%` }}
//             //         transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
//             //       />
//             //     </span>
//             //   </button>

//             <button
//   key={phase.id}
//   type="button"
//   data-active={active}
//   aria-pressed={active}
//   title={phase.detail ? `${phase.label} · ${phase.detail}` : phase.label}
//   onClick={() => onChange(active ? "all" : phase.id)}
//   className={`group relative flex min-w-[148px] shrink-0 snap-center flex-col items-stretch gap-2 rounded-xl border px-3 pb-4 pt-3 text-left outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[#2A317A]/30 md:min-w-[170px] lg:min-w-0 ${
//     active
//       ? "border-[#2A317A] text-white shadow-[0_12px_24px_-10px_rgba(42,49,122,0.6)]"
//       : "border-[#3C3C3B]/15 bg-white text-[#3C3C3B] hover:-translate-y-0.5 hover:border-[#2A317A]/60 hover:shadow-[0_10px_22px_-12px_rgba(42,49,122,0.4)]"
//   } ${empty && !active ? "opacity-55 hover:opacity-100" : ""} ${
//     index < PHASES.length - 1
//       ? "lg:after:absolute lg:after:-right-3 lg:after:top-1/2 lg:after:h-0.5 lg:after:w-3 lg:after:-translate-y-1/2 lg:after:bg-[#2A317A]/25 lg:after:content-['']"
//       : ""
//   }`}
// >
//   {active && (
//     <motion.span
//       layoutId="phase-tile-active"
//       className="absolute -inset-px rounded-xl bg-gradient-to-br from-[#3A44A8] to-[#2A317A]"
//       transition={{ type: "spring", stiffness: 350, damping: 30 }}
//     />
//   )}

//   {/* الصف اللي فوق: الرقم + العدد */}
//   <span className="relative z-10 flex items-center justify-between">
//     <span
//       className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-300 ${
//         active
//           ? "bg-white text-[#2A317A]"
//           : "bg-[#2A317A]/10 text-[#2A317A] group-hover:bg-[#2A317A] group-hover:text-white"
//       }`}
//     >
//       {index + 1}
//     </span>

//     <span className="overflow-hidden">
//       <AnimatePresence mode="wait" initial={false}>
//         <motion.span
//           key={count}
//           className="block text-lg font-extrabold leading-none tabular-nums"
//           initial={reduceMotion ? false : { y: 12, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
//           transition={{ duration: 0.15 }}
//         >
//           {count}
//           <span className="sr-only"> projects</span>
//         </motion.span>
//       </AnimatePresence>
//     </span>
//   </span>

//   {/* الاسم كامل على أكتر من سطر + الـ detail في سطر لوحده */}
//   <span className="relative z-10 block text-[13px] font-semibold leading-snug">
//     {phase.label}
//     {phase.detail && (
//       <span
//         className={`mt-0.5 block text-[12px] font-medium ${
//           active ? "text-white/75" : "text-[#3C3C3B]/60"
//         }`}
//       >
//         {phase.detail}
//       </span>
//     )}
//   </span>

//   {/* الشريط النسبي زي ما هو */}
//   <span
//     aria-hidden="true"
//     className={`absolute inset-x-3 bottom-2 z-10 h-[3px] overflow-hidden rounded-full ${
//       active ? "bg-white/25" : "bg-[#3C3C3B]/10"
//     }`}
//   >
//     <motion.span
//       className={`block h-full rounded-full ${active ? "bg-white" : "bg-[#2A317A]"}`}
//       initial={reduceMotion ? false : { width: 0 }}
//       animate={{ width: `${(count / maxCount) * 100}%` }}
//       transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
//     />
//   </span>
// </button>
//             );
//           })}
//         </div>

//         {/* تلميح إن فيه scroll (لحد lg) */}
//         <span
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent lg:hidden"
//         />
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LayoutGrid, Layers } from "lucide-react";
import { projectBimPhaseAssignments } from "../../features/projects/projectsData";

export const PHASES = [
  { id: "model-creation", label: "Model Creation", detail: "LOD 300" },
  { id: "construction-model", label: "Develop Construction Model", detail: "LOD 400" },
  { id: "quantification", label: "Quantification", detail: "BOQ" },
  { id: "constructability", label: "Assess Constructability", detail: "LOD 350" },
  { id: "shop-drawings", label: "Shop Drawing Extraction", detail: "" },
  { id: "as-built-model", label: "As-Built Model", detail: "LOD 500" },
  { id: "as-built-drawings", label: "As-Built Drawing Extraction", detail: "" },
];

export function getProjectPhaseIds(project) {
  if (Array.isArray(project.bimPhaseIds) && project.bimPhaseIds.length > 0) {
    return project.bimPhaseIds;
  }
  return projectBimPhaseAssignments[project.id] || [];
}

export default function PhaseFilter({ value, onChange, counts, total }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef(null);
  const firstRender = useRef(true);

  const selectedIndex = PHASES.findIndex((phase) => phase.id === value);
  const selectedPhase = selectedIndex >= 0 ? PHASES[selectedIndex] : null;

  // في الشاشات الصغيرة: الـ phase المختارة تتوسّط في الـ scroll الأفقي
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth) return;

    track.querySelector('[data-active="true"]')?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [value, reduceMotion]);

  return (
    <div className="relative mb-5 rounded-2xl border border-[#3C3C3B]/15 bg-white px-3 pb-2 pt-3 shadow-sm sm:px-4">
      {/* ------------------------------ Header ------------------------------ */}
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#2A317A] text-white">
            <Layers className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2A317A]">
              Filter by BIM phase
            </h3>

            <div className="min-h-5 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {selectedPhase ? (
                  <motion.p
                    key="selected"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs leading-5 text-[#3C3C3B]"
                  >
                    <b className="text-[#2A317A]">{counts[selectedPhase.id] ?? 0}</b> projects
                    · Phase {selectedIndex + 1} of {PHASES.length}
                  </motion.p>
                ) : (
                  <motion.p
                    key="hint"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs leading-5 text-[#3C3C3B]/70"
                  >
                    Pick a phase to filter the projects.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-pressed={value === "all"}
          onClick={() => onChange("all")}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A317A] ${
            value === "all"
              ? "border-[#2A317A] bg-[#2A317A] text-white"
              : "border-[#3C3C3B]/20 bg-white text-[#3C3C3B] hover:border-[#2A317A] hover:text-[#2A317A]"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">All phases</span>
          <span className="sm:hidden">All</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
              value === "all" ? "bg-white/20 text-white" : "bg-[#3C3C3B]/10 text-[#3C3C3B]"
            }`}
          >
            {total}
          </span>
        </button>
      </div>

      {/* ------------------------------ Timeline ------------------------------ */}
      <div className="relative">
        <div
          ref={trackRef}
          role="group"
          aria-label="Filter by BIM phase"
          className="-mx-1 flex snap-x overflow-x-auto px-1 py-1 [scrollbar-width:none] lg:grid lg:grid-cols-7 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {PHASES.map((phase, index) => {
            const active = value === phase.id;
            const passed = selectedIndex > index;
            const count = counts[phase.id] ?? 0;
            const empty = count === 0;

            return (
              <button
                key={phase.id}
                type="button"
                data-active={active}
                aria-pressed={active}
                title={phase.detail ? `${phase.label} · ${phase.detail}` : phase.label}
                onClick={() => onChange(active ? "all" : phase.id)}
                className={`group relative flex w-[124px] shrink-0 snap-center flex-col items-center rounded-lg px-1.5 pb-2 text-center outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#2A317A]/40 sm:w-[138px] lg:w-auto ${
                  empty && !active ? "opacity-60 hover:opacity-100" : ""
                }`}
              >
                {/* خلفية خفيفة بتنزلق بين الـ phases */}
                {active && (
                  <motion.span
                    layoutId="phase-tile-active"
                    className="absolute inset-0 rounded-lg bg-[#2A317A]/[0.07] ring-1 ring-[#2A317A]/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* صف النقطة + الخط (متصل على كل الشاشات) */}
                <span className="relative z-10 -mx-1.5 flex h-8 items-center justify-center self-stretch">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                        selectedIndex >= index ? "bg-[#2A317A]" : "bg-[#3C3C3B]/20"
                      }`}
                    />
                  )}
                  {index < PHASES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                        selectedIndex > index ? "bg-[#2A317A]" : "bg-[#3C3C3B]/20"
                      }`}
                    />
                  )}

                  <span
                    className={`relative grid h-6 w-6 place-items-center rounded-full border-2 text-[11px] font-bold transition-all duration-300 ${
                      active
                        ? "scale-110 border-[#2A317A] bg-[#2A317A] text-white ring-4 ring-[#2A317A]/20"
                        : passed
                          ? "border-[#2A317A] bg-white text-[#2A317A]"
                          : "border-[#3C3C3B]/30 bg-white text-[#3C3C3B] group-hover:border-[#2A317A] group-hover:text-[#2A317A]"
                    }`}
                  >
                    {index + 1}
                  </span>
                </span>

                {/* الاسم كامل + الـ detail */}
                <span className="relative z-10 mt-1 block">
                  <span
                    className={`block text-[12px] font-semibold leading-tight sm:text-[13px] ${
                      active ? "text-[#2A317A]" : "text-[#3C3C3B]"
                    }`}
                  >
                    {phase.label}
                  </span>
                  {phase.detail && (
                    <span className="mt-0.5 block text-[11px] font-medium text-[#3C3C3B]/60">
                      {phase.detail}
                    </span>
                  )}
                </span>

                {/* عدد المشاريع */}
                <span
                  className={`relative z-10 mt-auto inline-flex overflow-hidden rounded-full px-2 py-0.5 pt-1 text-[11px] font-bold leading-none tabular-nums transition-colors duration-300 ${
                    active ? "bg-[#2A317A] text-white" : "bg-[#2A317A]/10 text-[#2A317A]"
                  }`}
                  style={{ marginTop: "0.4rem" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={count}
                      className="block"
                      initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { y: -10, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {count}
                      <span className="sr-only"> projects</span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            );
          })}
        </div>

        {/* تلميح إن فيه scroll (لحد lg) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent lg:hidden"
        />
      </div>
    </div>
  );
}