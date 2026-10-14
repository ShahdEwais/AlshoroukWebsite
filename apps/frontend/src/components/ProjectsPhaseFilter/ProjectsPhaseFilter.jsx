import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, HardHat, LayoutGrid, X } from "lucide-react";
import { useLanguage } from "../../locales/LanguageContext/LanguageContext";
import { bimPhases } from "../../features/projects/bimPhases";

/* ------------------------------------------------------------------ */
/*  Helpers: أي مشروع مر بأنهي phases                                  */
/*  (نفس المنطق اللي كان في ProjectBimJourney)                          */
/* ------------------------------------------------------------------ */
const getAssignedIds = (item) => {
  const list = Array.isArray(item.bimPhaseIds)
    ? item.bimPhaseIds
    : Array.isArray(item.phases)
      ? item.phases
      : [];
  const own = list.map((entry) => (typeof entry === "object" ? entry.id : entry));
  const configured = bimPhases
    .filter((phase) => (phase.projectIds ?? []).map(Number).includes(Number(item.id)))
    .map((phase) => phase.id);
  return [...own, ...configured];
};

const hasPhase = (ids, phase, index) =>
  ids.includes(phase.id) || ids.includes(index + 1) || ids.includes(String(index + 1));

/* ------------------------------------------------------------------ */
/*  Adapter: لو أسماء الحقول في داتا المشاريع عندك مختلفة عدّليها هنا   */
/* ------------------------------------------------------------------ */
const pick = (value, language) =>
  value && typeof value === "object" ? (value[language] ?? value.en ?? "") : value;

const getProjectView = (item, language) => ({
  id: item.id,
  title: pick(item.title, language) || pick(item.name, language) || `#${item.id}`,
  location: pick(item.location, language) || "",
  status: pick(item.status, language) || "",
  image: item.image || item.cover || item.thumbnail || "",
  href: item.href || `/projects/${item.id}`,
});

const copy = {
  en: {
    filterBy: "Filter by BIM phase",
    all: "All phases",
    allDetail: "Every project",
    phase: "Phase",
    showing: (n, total) => `Showing ${n} of ${total} ${total === 1 ? "project" : "projects"}`,
    count: (n) => `${n} ${n === 1 ? "project" : "projects"}`,
    clear: "Clear filter",
    emptyTitle: "No projects in this phase yet",
    emptyText: "Try another phase, or view all projects.",
    view: "View project",
  },
  ar: {
    filterBy: "تصفية حسب مرحلة BIM",
    all: "كل المراحل",
    allDetail: "كل المشاريع",
    phase: "المرحلة",
    showing: (n, total) => `عرض ${n} من ${total} ${total === 1 ? "مشروع" : "مشاريع"}`,
    count: (n) => `${n} ${n === 1 ? "مشروع" : "مشاريع"}`,
    clear: "مسح التصفية",
    emptyTitle: "لا توجد مشاريع في هذه المرحلة بعد",
    emptyText: "جرّب مرحلة أخرى، أو اعرض كل المشاريع.",
    view: "عرض المشروع",
  },
};

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/*  زرار واحد في شريط الفلتر                                           */
/* ------------------------------------------------------------------ */
function FilterItem({ active, onClick, badge, label, detail, count, countLabel, dimmed }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative z-10 flex min-w-[136px] shrink-0 snap-start flex-col items-center px-2 text-center outline-none lg:min-w-0 ${
        dimmed && !active ? "opacity-60 hover:opacity-100" : ""
      }`}
    >
      <span
        className={`relative grid h-14 w-14 place-items-center rounded-full border-2 text-lg font-bold transition-all duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-4 group-focus-visible:ring-[#2A317A]/30 ${
          active
            ? "border-[#2A317A] bg-[#2A317A] text-white shadow-[0_10px_24px_rgba(42,49,122,0.35)]"
            : "border-[#2A317A]/25 bg-white text-[#2A317A] group-hover:border-[#2A317A] group-hover:bg-[#F1F3FB]"
        }`}
      >
        {badge}
        {/* الحلقة دي بتتحرك (بتنزلق) من زرار للتاني لما تختاري phase */}
        {active && (
          <motion.span
            layoutId="bim-filter-ring"
            className="pointer-events-none absolute -inset-1.5 rounded-full border-2 border-[#2A317A]/45"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </span>

      <span
        className={`mt-3 text-[15px] font-bold leading-snug transition-colors duration-300 sm:text-base ${
          active ? "text-[#2A317A]" : "text-black group-hover:text-[#2A317A]"
        }`}
      >
        {label}
      </span>

      {detail && (
        <span className="mt-0.5 text-xs font-semibold text-[#3C3C3B]/70 sm:text-sm">{detail}</span>
      )}

      <span
        className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors duration-300 ${
          active ? "bg-[#2A317A] text-white" : "bg-[#3C3C3B]/10 text-[#3C3C3B]"
        }`}
      >
        {countLabel(count)}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  شريط الفلتر لوحده (تقدري تستخدميه مع أي grid عندك)                  */
/*  selected: null = كل المراحل، أو رقم الـ phase (0..6)                */
/* ------------------------------------------------------------------ */
export function PhaseFilterBar({ selected, onChange, counts, total }) {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;

  return (
    <div>
      <p className="mb-4 text-sm font-bold text-[#2A317A] sm:text-base">{t.filterBy}</p>

      <div
        role="group"
        aria-label={t.filterBy}
        className="relative -mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-2 [scrollbar-width:none] lg:grid lg:grid-cols-8 lg:gap-0 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {/* الخط اللي بيوصل الدواير ببعض (ديسكتوب فقط) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[6.25%] top-[35px] z-0 hidden h-0.5 bg-[#2A317A]/15 lg:block"
        />

        <FilterItem
          active={selected === null}
          onClick={() => onChange(null)}
          badge={<LayoutGrid className="h-6 w-6" aria-hidden="true" />}
          label={t.all}
          detail={t.allDetail}
          count={total}
          countLabel={t.count}
        />

        {bimPhases.map((phase, index) => (
          <FilterItem
            key={phase.id}
            active={selected === index}
            onClick={() => onChange(selected === index ? null : index)}
            badge={index + 1}
            label={phase.label}
            detail={phase.detail}
            count={counts[index]}
            countLabel={t.count}
            dimmed={counts[index] === 0}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  الكارت الافتراضي (لو عندك كارت خاص بيكي استخدمي renderProject)      */
/* ------------------------------------------------------------------ */
function ProjectCard({ item, flags, selected, t, language }) {
  const view = getProjectView(item, language);

  return (
    <a
      href={view.href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#2A317A]/10 bg-white shadow-[0_10px_30px_-14px_rgba(42,49,122,0.25)] transition duration-300 hover:-translate-y-1.5 hover:border-[#2A317A]/40 hover:shadow-[0_24px_44px_-16px_rgba(42,49,122,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2A317A]"
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#E9EDFA] to-[#CFD8F3]">
        {view.image && (
          <img
            src={view.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        {view.status && (
          <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#2A317A] backdrop-blur sm:text-sm">
            {view.status}
          </span>
        )}
      </span>

      <span className="flex flex-1 flex-col gap-1.5 p-5">
        <strong className="text-lg font-bold leading-snug text-[#2A317A] sm:text-xl">
          {view.title}
        </strong>
        {view.location && (
          <span className="text-sm text-[#3C3C3B]/80 sm:text-base">{view.location}</span>
        )}

        {/* شريط صغير بيوري المشروع ده مر بأنهي phases */}
        <span aria-hidden="true" className="relative mt-4 flex items-center justify-between px-1">
          <span className="absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 bg-[#2A317A]/15" />
          {flags.map((on, k) => (
            <i
              key={bimPhases[k].id}
              className={`relative h-3 w-3 rounded-full border-2 transition-transform duration-300 ${
                on ? "border-[#2A317A] bg-[#2A317A]" : "border-[#2A317A]/25 bg-white"
              } ${k === selected ? "scale-150 ring-4 ring-[#2A317A]/20" : ""}`}
            />
          ))}
        </span>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-[#2A317A] sm:text-base">
          {t.view}
          <ArrowUpRight
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </span>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  الكومبوننت الرئيسي: فلتر + grid المشاريع                           */
/* ------------------------------------------------------------------ */
export default function ProjectsPhaseFilter({ projects = [], renderProject }) {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(null); // null = الكل

  // لكل مشروع: مصفوفة 7 true/false بتقول مر بالـ phase دي ولا لأ
  const projectFlags = useMemo(
    () =>
      projects.map((item) => {
        const ids = getAssignedIds(item);
        return { item, flags: bimPhases.map((phase, index) => hasPhase(ids, phase, index)) };
      }),
    [projects]
  );

  const counts = useMemo(
    () => bimPhases.map((_, index) => projectFlags.filter((p) => p.flags[index]).length),
    [projectFlags]
  );

  const visible =
    selected === null ? projectFlags : projectFlags.filter((p) => p.flags[selected]);

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="w-full rounded-[1.75rem] bg-white p-5 shadow-[0_25px_60px_-20px_rgba(60,60,59,0.15)] sm:rounded-[2.5rem] sm:p-8 lg:p-10"
    >
      <PhaseFilterBar
        selected={selected}
        onChange={setSelected}
        counts={counts}
        total={projects.length}
      />

      {/* سطر النتيجة + زرار مسح الفلتر */}
      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#2A317A]/10 pt-6">
        <p aria-live="polite" className="text-sm font-semibold text-[#3C3C3B] sm:text-base">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${selected}-${visible.length}`}
              className="inline-block"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {t.showing(visible.length, projects.length)}
            </motion.span>
          </AnimatePresence>
        </p>

        <AnimatePresence>
          {selected !== null && (
            <motion.button
              type="button"
              onClick={() => setSelected(null)}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#2A317A]/25 bg-[#2A317A]/5 px-4 py-2 text-sm font-bold text-[#2A317A] transition-colors duration-300 hover:bg-[#2A317A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A317A]"
            >
              {t.phase} {selected + 1} · {bimPhases[selected].label}
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{t.clear}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* المشاريع: الكروت بتتحرك لأماكنها الجديدة بسلاسة لما الفلتر يتغير */}
      {visible.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map(({ item, flags }, cardIndex) => (
              <motion.li
                key={item.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : Math.min(cardIndex * 0.05, 0.3),
                  ease: EASE,
                }}
                className="flex"
              >
                {renderProject ? (
                  renderProject(item, { flags, selectedPhase: selected })
                ) : (
                  <ProjectCard
                    item={item}
                    flags={flags}
                    selected={selected}
                    t={t}
                    language={language}
                  />
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <motion.div
          key="empty"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-[#2A317A]/20 px-6 py-12 text-center"
        >
          <HardHat className="h-10 w-10 text-[#2A317A]" aria-hidden="true" />
          <p className="text-lg font-bold text-black sm:text-xl">{t.emptyTitle}</p>
          <p className="text-sm text-[#3C3C3B]/80 sm:text-base">{t.emptyText}</p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mt-2 rounded-lg bg-[#2A317A] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(42,49,122,0.3)] sm:text-base"
          >
            {t.all}
          </button>
        </motion.div>
      )}
    </section>
  );
}