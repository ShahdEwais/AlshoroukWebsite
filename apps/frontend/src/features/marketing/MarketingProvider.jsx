import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { newsStories } from "../news/newsData";
import { projectBimPhaseAssignments, projectDetails, projects } from "../projects/projectsData";
import {
  aboutDefaults,
  footerDefaults,
  partnersDefaults,
  projectsSectionDefaults,
  servicesDefaults,
  testimonialsDefaults,
} from "./marketingDefaults";

const STORAGE_KEY = "alshorouk.marketing.v1";
const MarketingContext = createContext(null);

export function getTextValue(value, lang = "ar") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const textAr = typeof value.ar === "string" ? value.ar.trim() : "";
    const textEn = typeof value.en === "string" ? value.en.trim() : "";
    if (lang === "en") return textEn || textAr;
    return textAr || textEn;
  }
  return String(value);
}

export function normalizeLocalePair(value) {
  const text = getTextValue(value, "ar");
  const textEn = getTextValue(value, "en");
  return {
    ar: String(text || ""),
    en: String(textEn || ""),
  };
}

function normalizeHeroSlide(slide) {
  const bilingual = normalizeLocalePair(slide?.title);
  const title = getTextValue(slide?.title, "ar") || getTextValue(slide?.title, "en") || "";
  return {
    ...slide,
    title,
    titleAr: bilingual.ar,
    titleEn: bilingual.en,
    active: slide?.active !== false,
  };
}

function normalizeProject(project) {
  const bilingual = normalizeLocalePair(project?.title);
  const title = getTextValue(project?.title, "ar") || getTextValue(project?.title, "en") || "";
  return {
    ...project,
    title,
    titleAr: bilingual.ar,
    titleEn: bilingual.en,
    bimPhaseIds: Array.isArray(project?.bimPhaseIds) && project.bimPhaseIds.length > 0
      ? project.bimPhaseIds
      : projectBimPhaseAssignments[project?.id] || [],
    published: project?.published !== false,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export const heroDefaults = [
  {
    id: "financial-district",
    type: "panorama",
    title: { ar: "ميدان الحي المالي", en: "FINANCIAL DISTRICT SQUARE" },
    src: "/panoramas/hero-360.jpg?v=4096",
    active: true,
  },
  {
    id: "sallum-port",
    type: "video",
    title: { ar: "ميناء السلوم", en: "SALLUM LAND PORT" },
    src: "/videos/hero.mp4",
    active: true,
  },
  {
    id: "midtown-condo",
    type: "image",
    title: { ar: "ميدتاون كوندو", en: "MIDTOWN CONDO" },
    src: "src/assets/images/50.png",
    active: true,
  },
];

export const projectCategories = [
  "Infrastructure",
  "Commercial Buildings",
  "Road And Generalist",
];

function seed() {
  return {
    news: newsStories.map((story) => ({ ...story, published: true })),
    projects: projects.map((project) =>
      normalizeProject({
        id: project.id,
        title: project.title,
        status: project.status,
        category: project.category,
        src: project.src,
        gallery: Array.isArray(project.gallery) ? project.gallery : [],
        bimPhaseIds: projectBimPhaseAssignments[project.id] || [],
        published: true,
      })
    ),
    hero: heroDefaults.map((slide) => normalizeHeroSlide(slide)),
    about: clone(aboutDefaults),
    services: clone(servicesDefaults),
    projectsSection: clone(projectsSectionDefaults),
    testimonials: clone(testimonialsDefaults),
    partners: clone(partnersDefaults),
    footer: clone(footerDefaults),
    inquiries: [],
  };
}


function mergeListSection(parsed, key, fallback) {
  if (parsed && parsed[key] && typeof parsed[key] === "object") {
    const base = clone(fallback);
    const incoming = parsed[key];
    const next = { ...base, ...incoming };
    for (const listKey of Object.keys(base)) {
      if (Array.isArray(base[listKey])) {
        next[listKey] = Array.isArray(incoming[listKey]) ? incoming[listKey] : base[listKey];
      }
    }
    return next;
  }
  return clone(fallback);
}
function mergeSection(parsed, key, fallback) {
  if (parsed && parsed[key] && typeof parsed[key] === "object") {
    return { ...clone(fallback), ...parsed[key] };
  }
  return clone(fallback);
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    const base = seed();
    return {
      news: Array.isArray(parsed.news) ? parsed.news : base.news,
      projects: Array.isArray(parsed.projects)
        ? parsed.projects.map(normalizeProject)
        : base.projects,
      hero:
        Array.isArray(parsed.hero) && parsed.hero.length
          ? parsed.hero.map(normalizeHeroSlide)
          : base.hero,
      about: mergeListSection(parsed, "about", aboutDefaults),
      services: mergeListSection(parsed, "services", servicesDefaults),
      projectsSection: mergeSection(parsed, "projectsSection", projectsSectionDefaults),
      testimonials: mergeListSection(parsed, "testimonials", testimonialsDefaults),
      partners: mergeListSection(parsed, "partners", partnersDefaults),
      footer: mergeListSection(parsed, "footer", footerDefaults),
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    return seed();
  }
}

function withDetails(project) {
  return { ...project, ...(projectDetails[project.id] || {}) };
}

/* المشاريع اللي تظهر في الهوم، بالترتيب اللي اختارته الأدمن.
   لو لسه محدّدتش حاجة (مفيش مشروع عنده onHome) بنعرض كل المشاريع الظاهرة زي الأول،
   عشان الهوم ما يفضلش فاضي. */
export function selectHomeProjects(items = []) {
  const configured = items.some((p) => typeof p.onHome === "boolean");
  const list = configured ? items.filter((p) => p.onHome === true) : items;
  return list
    .filter((p) => p.published !== false)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.homeOrder ?? a.i) - (b.p.homeOrder ?? b.i))
    .map(({ p }) => p);
}

export function useMarketing() {
  const context = useContext(MarketingContext);
  if (!context) throw new Error("useMarketing must be used inside MarketingProvider");
  return context;
}

export function usePublishedProjects() {
  const { projects: items } = useMarketing();
  return useMemo(
    () => items.filter((project) => project.published !== false).map(withDetails),
    [items]
  );
}

export function useHomeProjects() {
  const { projects: items } = useMarketing();
  return useMemo(() => selectHomeProjects(items).map(withDetails), [items]);
}

export function usePublishedNews() {
  const { news } = useMarketing();
  return useMemo(() => news.filter((story) => story.published !== false), [news]);
}

export function useHeroSlides() {
  const { hero } = useMarketing();
  return useMemo(() => {
    const active = hero.filter((slide) => slide.active !== false);
    return active.length ? active : hero;
  }, [hero]);
}

export function useAboutContent() {
  const { about } = useMarketing();
  return about;
}

export function useServicesContent() {
  const { services } = useMarketing();
  return services;
}

export function useProjectsSectionContent() {
  const { projectsSection } = useMarketing();
  return projectsSection;
}

export function useTestimonialsContent() {
  const { testimonials } = useMarketing();
  return testimonials;
}

export function usePartnersContent() {
  const { partners } = useMarketing();
  return partners;
}

export function useFooterContent() {
  const { footer } = useMarketing();
  return footer;
}

export default function MarketingProvider({ children }) {
  const [data, setData] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const api = useMemo(() => {
    const update = (recipe) => setData((current) => recipe(current));
    return {
      ...data,
      saveNews(story) {
        update((current) => {
          const index = current.news.findIndex((item) => item.id === story.id);
          const news = [...current.news];
          if (index === -1) news.unshift(story);
          else news[index] = story;
          return { ...current, news };
        });
      },
      deleteNews(id) {
        update((current) => ({
          ...current,
          news: current.news.filter((item) => item.id !== id),
        }));
      },
      saveProject(project) {
        update((current) => {
          const index = current.projects.findIndex((item) => item.id === project.id);
          const nextProjects = [...current.projects];
          if (index === -1) nextProjects.unshift(project);
          else nextProjects[index] = project;
          return { ...current, projects: nextProjects };
        });
      },
      deleteProject(id) {
        update((current) => ({
          ...current,
          projects: current.projects.filter((item) => item.id !== id),
        }));
      },
            setHomeProjects(ids) {
        const order = ids.map(String);
        update((current) => ({
          ...current,
          projects: current.projects.map((project) => {
            const i = order.indexOf(String(project.id));
            return i === -1
              ? { ...project, onHome: false }
              : { ...project, onHome: true, homeOrder: i };
          }),
        }));
      },
      saveHero(hero) {
        update((current) => ({ ...current, hero }));
      },
      saveAbout(about) {
        update((current) => ({ ...current, about }));
      },
      saveServices(services) {
        update((current) => ({ ...current, services }));
      },
      saveProjectsSection(projectsSection) {
        update((current) => ({ ...current, projectsSection }));
      },
      saveTestimonials(testimonials) {
        update((current) => ({ ...current, testimonials }));
      },
      savePartners(partners) {
        update((current) => ({ ...current, partners }));
      },
      saveFooter(footer) {
        update((current) => ({ ...current, footer }));
      },
      addInquiry(inquiry) {
        update((current) => ({
          ...current,
          inquiries: [
            {
              id: `inquiry-${Date.now()}`,
              createdAt: new Date().toISOString(),
              read: false,
              ...inquiry,
            },
            ...current.inquiries,
          ],
        }));
      },
      setInquiryRead(id, read) {
        update((current) => ({
          ...current,
          inquiries: current.inquiries.map((item) =>
            item.id === id ? { ...item, read } : item
          ),
        }));
      },
      deleteInquiry(id) {
        update((current) => ({
          ...current,
          inquiries: current.inquiries.filter((item) => item.id !== id),
        }));
      },
      resetContent() {
        const fresh = seed();
        setData({ ...fresh, inquiries: data.inquiries });
      },
    };
  }, [data]);

  return <MarketingContext.Provider value={api}>{children}</MarketingContext.Provider>;
}
