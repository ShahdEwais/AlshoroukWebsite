import { useRef, useState } from "react";
import { ArrowUpRight, MoveRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../locales/LanguageContext/LanguageContext";
import { usePublishedProjects } from "../../features/marketing/MarketingProvider";
import { bimPhases } from "../../features/projects/bimPhases";
import "./Bimhero.css";
import { getProjectPhaseIds } from "../../components/SectorFilterSection/PhaseFilter"; 
const copy = {
  en: {
    eyebrow: "SHOROUK · BIM UNIT",
    title: <><span>Every Project Has Its</span><em>Own Journey</em></>,
    intro: "Explore the BIM phases behind our work and discover how each project follows its own technical workflow.",
    timeline: "BIM delivery sequence",
    explore: "Select a phase to explore",
    hint: "Hover, focus or tap any point on the timeline",
    selected: "Selected phase",
    empty: "Project assignments for this phase are being verified.",
    emptyHint: "Confirmed project work will appear here.",
    view: "View project",
    phaseProjects: "Projects in this phase",
    allProjects: "View all projects",
  },
  ar: {
    eyebrow: "الشروق · وحدة نمذجة معلومات البناء",
    title: <>لكل مشروع<br /><em>رحلته الخاصة.</em></>,
    intro: "اكتشف مراحل نمذجة معلومات البناء في مشروعاتنا، وتعرّف على مسار العمل الفني لكل مشروع.",
    timeline: "تسلسل مراحل العمل بنمذجة المعلومات",
    explore: "اختر مرحلة لاستكشافها",
    hint: "مرّر أو انتقل بلوحة المفاتيح أو اضغط على أي نقطة",
    selected: "المرحلة المختارة",
    empty: "يجري التحقق من المشروعات المرتبطة بهذه المرحلة.",
    emptyHint: "ستظهر هنا المشروعات المعتمدة لهذه المرحلة.",
    view: "عرض المشروع",
    phaseProjects: "مشروعات هذه المرحلة",
    allProjects: "عرض كل المشروعات",
  },
};

export default function BIMHero() {
  const { language } = useLanguage();
  const projectsWithDetails = usePublishedProjects();
  const heroProject = projectsWithDetails.find((project) => project.id === 4) || projectsWithDetails.find((project) => project.src);
  const t = copy[language] || copy.en;
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);
  const projectTrack = useRef(null);
  const activeIndex = hovered ?? selected;
  const activePhase = activeIndex === null ? null : bimPhases[activeIndex];
  // const activeProjects = activePhase
  //   ? activePhase.projectIds.map((id) => projectsWithDetails.find((project) => project.id === id)).filter(Boolean)
  //   : [];
  const activeProjects = activePhase
  ? projectsWithDetails.filter((project) =>
      getProjectPhaseIds(project).includes(activePhase.id)
    )
  : [];

  return (
    <section className="bim-hero" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="bim-hero__inner">
        <div className="bim-hero__intro">
          <p className="bim-hero__eyebrow"><span />{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="bim-hero__lede">{t.intro}</p>
          <a className="bim-hero__explore" href="#bim-process"><span aria-hidden="true"><MoveRight size={17} /></span>{language === "ar" ? "اكتشف مراحل BIM" : "Explore Our BIM Process"}<i><ArrowUpRight size={15} /></i></a>
        </div>
        <div className="bim-architecture" aria-hidden="true">
          <span className="bim-architecture__note">DIGITAL MODEL / 01</span>
          {heroProject?.src && <img className="bim-architecture__photo" src={heroProject.src} alt="" />}
          <svg viewBox="0 0 520 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 264H492M83 245V143L202 91L455 144V253M83 143L202 181L455 144M202 91V181M111 152V238M143 162V247M174 172V254M230 117V246M265 124V246M300 132V247M336 139V248M372 146V250M408 151V252" />
            <path d="M83 177L202 213L455 176M83 210L202 238L455 208M83 143L202 91L455 144M202 91L202 264M83 143L83 264M455 144V264M65 264V133L202 73L475 132V264" />
            <path d="M101 143L202 101L438 150M101 177L202 208L438 176M101 209L202 234L438 208M101 143V244M126 153V250M158 166V256M188 179V260M216 119V254M248 126V255M281 133V256M315 140V257M350 147V258M385 153V259M420 159V260" />
            <path className="bim-architecture__accent" d="M70 270H467M69 270V258M467 270V258M53 137L202 70L481 130M202 70V57M481 130V117" />
            <path className="bim-architecture__dimension" d="M61 141V257M57 141H68M57 257H68M202 52V70M196 52H208M202 264V276M196 276H208" />
            <text x="36" y="204">FLOOR LEVEL</text><text x="208" y="289">FACADE ELEVATION / BIM MODEL</text><text x="218" y="67">GRID B</text>
          </svg>
          <span className="bim-architecture__caption">COORDINATED GEOMETRY <i>·</i> CONSTRUCTION INTENT</span>
        </div>

        <div className="bim-timeline-wrap" id="bim-process">
          <div className="bim-timeline-heading">
            <span>{t.timeline}</span>
            <span className="bim-timeline-heading__count">07 <i>/ 07</i></span>
          </div>
          <div className="bim-timeline-scroll" tabIndex={0} aria-label={t.timeline}>
            <ol className="bim-timeline">
              {bimPhases.map((phase, index) => {
                const isActive = activeIndex === index;
                return (
                  <li className={`bim-timeline__item${isActive ? " is-active" : ""}`} key={phase.id}>
                    <button
                      type="button"
                      className="bim-phase"
                      aria-pressed={selected === index}
                      aria-label={`${index + 1}: ${phase.label}${phase.detail ? `, ${phase.detail}` : ""}`}
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(index)}
                    >
                      <span className="bim-phase__top"><span className="bim-phase__node" aria-hidden="true"><span className="bim-phase__node-number">{index + 1}</span></span></span>
                      <span className="bim-phase__label" dir="auto">{phase.label}</span>
                      {phase.detail && <span className="bim-phase__detail">{phase.detail}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="bim-timeline-hint"><span aria-hidden="true">↔</span>{t.hint}</p>
        </div>

        <section className={`bim-results${activePhase ? " is-revealed" : ""}`} aria-live="polite" aria-label={activePhase ? activePhase.label : t.explore}>
          <div className="bim-results__label">
            <span className="bim-results__index">{activePhase ? String(activeIndex + 1).padStart(2, "0") : "BIM"}</span>
            <div>
              <p>{activePhase ? t.phaseProjects : t.explore}</p>
              <h2>{activePhase ? activePhase.label : t.hint}</h2>
              {activeProjects.length > 0 && <span className="bim-results__count"><strong>{String(activeProjects.length).padStart(2, "0")}</strong> {language === "ar" ? "مشروعات" : "Projects"}</span>}
              <Link className="bim-results__all" to="/projects">{t.allProjects}<ArrowUpRight size={15} /></Link>
            </div>
          </div>
          {activePhase && activeProjects.length > 0 ? (
            <div className="bim-projects" ref={projectTrack} key={activePhase.id}>
              {activeProjects.map((project) => (
                <Link className="bim-project" to={`/projects/${project.id}`} key={project.id}>
                  <span className="bim-project__image"><img src={project.src} alt={project.title.trim()} loading="lazy" /><span className="bim-project__arrow" aria-label={t.view}><ArrowUpRight size={18} /></span></span>
                  <span className="bim-project__copy"><small>{project.location || project.category}</small><strong>{project.title.trim()}</strong></span>
                </Link>
              ))}
            </div>
          ) : activePhase ? (
            <div className="bim-empty"><strong>{t.empty}</strong><span>{t.emptyHint}</span></div>
          ) : (
            <div className="bim-results__prompt"><span className="bim-results__rule" /><span>{t.explore}</span><MoveRight size={17} aria-hidden="true" /></div>
          )}
          {activePhase && activeProjects.length > 0 && <div className="bim-project-controls" aria-label="Project carousel controls">
            <button type="button" aria-label="Previous projects" onClick={() => projectTrack.current?.scrollBy({ left: language === "ar" ? 290 : -290, behavior: "smooth" })}><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Next projects" onClick={() => projectTrack.current?.scrollBy({ left: language === "ar" ? -290 : 290, behavior: "smooth" })}><ChevronRight size={18} /></button>
          </div>}
        </section>
      </div>
    </section>
  );
}
