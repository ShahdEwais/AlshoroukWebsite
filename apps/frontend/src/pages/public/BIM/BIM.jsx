

// import { lazy, Suspense } from "react";
// import BIMHero from "../../../components/BIM/Bimhero";


// const lazyDefault = (loader, name) =>
//   lazy(() =>
//     loader().then((m) => {
//       if (m.default) return m;
//       const keys = Object.keys(m);
//       console.error(`[${name}] مفيهوش default export. الموجود:`, keys);
//       return { default: keys.length ? m[keys[0]] : () => null };
//     })
//   );

// const sections = [
// //   lazyDefault(() => import("../../../components/BIM/Bimhero"), "Bimhero"),
//   // lazyDefault(() => import("../../../components/BIM/Bimbenefits"), "BIMBenefits"),
//      lazyDefault(() => import("../../../components/BIM/BimLayers"), "BimLayers"),
//   lazyDefault(() => import("../../../components/BIM/Bimdisciplines"), "BIMDisciplines"),
// //   lazyDefault(() => import("../../../components/BIM/Bimclashdetection"), "Bimclashdetection"),
//   // lazyDefault(() => import("../../../components/BIM/Bimworkflow"), "BIMWorkflow"),
// //   lazyDefault(() => import("../../../components/BIM/Bimelements"), "BIMElements"),
//   lazyDefault(() => import("../../../components/BIM/Bimservices"), "Bimservices"),
// //   lazyDefault(() => import("../../../components/BIM/Bimcta"), "Bimcta"),
// ];

// export default function BIM() {
//   return (
//     <main className="overflow-x-hidden">
//       <BIMHero />
//       <Suspense fallback={null}>
//         {sections.map((Section, i) => (
//           <Section key={i} />
//         ))}
//       </Suspense>
//     </main>
//   );
// }


import { lazy, Suspense } from "react";
import BIMHero from "../../../components/BIM/Bimhero";
import FlowScroll, { FlowSection } from "../../../components/FlowScroll/FlowScroll";

const lazyDefault = (loader, name) =>
  lazy(() =>
    loader().then((m) => {
      if (m.default) return m;
      const keys = Object.keys(m);
      console.error(`[${name}] مفيهوش default export. الموجود:`, keys);
      return { default: keys.length ? m[keys[0]] : () => null };
    })
  );

/* className = لون خلفية الـ FlowSection (لازم يطابق خلفية السيكشن نفسه) */
const sections = [
  {
    name: "Layers",
    className: "bg-[#F8F9FD]",
    Component: lazyDefault(() => import("../../../components/BIM/BimLayers"), "BimLayers"),
  },
  {
    name: "Disciplines",
    className: "bg-[#F8F9FD]",
    Component: lazyDefault(() => import("../../../components/BIM/Bimdisciplines"), "BIMDisciplines"),
  },
  // {
  //   name: "Workflow",
  //   className: "bg-[#F8F9FD]",
  //   Component: lazyDefault(() => import("../../../components/BIM/Bimworkflow"), "BIMWorkflow"),
  // },
  {
    name: "Services",
    className: "bg-[#F8F9FD]",
    Component: lazyDefault(() => import("../../../components/BIM/Bimservices"), "Bimservices"),
  },
];

export default function BIM() {
  return (
    <FlowScroll aria-label="BIM Sections">
      <FlowSection aria-label="BIM Hero" className="bg-[#F8F9FD]" flat skipPin>
        <BIMHero />
      </FlowSection>

      {sections.map(({ name, className, Component }) => (
        <FlowSection key={name} aria-label={name} className={className}>
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </FlowSection>
      ))}
    </FlowScroll>
  );
}