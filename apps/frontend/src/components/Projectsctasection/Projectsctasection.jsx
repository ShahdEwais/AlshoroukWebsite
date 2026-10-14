
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HardHat, ArrowRight, PhoneCall } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function CtaContent() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2A317A]/25 bg-[#2A317A]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#2A317A]">
        <HardHat className="h-3.5 w-3.5" />
        Let's Build Together
      </div>

      <h2 className="mb-6 text-[clamp(1.9rem,5vw,3.5rem)] font-bold leading-tight text-black sm:mb-8">
        Ready to break ground
        <br />
        <span className="text-[#2A317A]">on your next landmark?</span>
      </h2>

      <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-[#3C3C3B]/80 sm:text-base">
        From infrastructure to commercial developments across Egypt, our team
        turns ambitious plans into finished, standing structures. Tell us what
        you're building — we'll take it from there.
      </p>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <a
          href="#contact"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2A317A] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(42,49,122,0.3)] active:translate-y-0 sm:w-auto sm:px-9 sm:py-4 sm:text-base"
        >
          Start Your Project
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <a
          href="#contact"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#3C3C3B]/30 bg-transparent px-7 py-3 text-sm font-semibold text-black transition-all duration-300 ease-in-out hover:border-[#2A317A] hover:bg-[#2A317A]/5 sm:w-auto sm:px-9 sm:py-4 sm:text-base"
        >
          <PhoneCall className="h-4 w-4" />
          Talk to Our Team
        </a>
      </div>
    </div>
  );
}

function AnimatedLineDrawing({ svgUrl, className = "", containerRef }) {
  const wrapperRef = useRef(null);
  const [svgMarkup, setSvgMarkup] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(svgUrl)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setSvgMarkup(text);
      })
      .catch((err) => console.error("Failed to load SVG:", err));

    return () => {
      cancelled = true;
    };
  }, [svgUrl]);

  useLayoutEffect(() => {
    const section = containerRef.current;
    const wrapper = wrapperRef.current;

    if (!section || !wrapper || !svgMarkup) return undefined;

    const svgEl = wrapper.querySelector("svg");
    if (!svgEl) return undefined;

    const drawable = Array.from(
      svgEl.querySelectorAll(
        "path, line, polyline, polygon, circle, ellipse, rect"
      )
    );

    if (drawable.length === 0) return undefined;

    drawable.forEach((el) => {
      el.setAttribute("fill", "none");
      el.setAttribute("stroke", "#000000");

      if (!el.getAttribute("stroke-width")) {
        el.setAttribute("stroke-width", "6");
      }

      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("stroke-linejoin", "round");
    });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lengths = drawable.map((el) => {
      if (typeof el.getTotalLength === "function") {
        try {
          return el.getTotalLength();
        } catch {
          return 200;
        }
      }

      return 200;
    });

    drawable.forEach((el, i) => {
      const len = lengths[i];

      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
    });

    if (reduceMotion) {
      drawable.forEach((el) => {
        el.style.strokeDashoffset = "0";
      });

      return undefined;
    }

    const totalLen = lengths.reduce((a, b) => a + b, 0) || 1;
    const totalDuration = 10000;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        once: true,

        onEnter: () => {
          let elapsed = 0;

          drawable.forEach((el, i) => {
            const len = lengths[i];
            const duration = (len / totalLen) * totalDuration;

            el.style.transition = `stroke-dashoffset ${duration}ms ease-in-out ${elapsed}ms`;
            el.style.strokeDashoffset = "0";

            elapsed += duration;
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [containerRef, svgMarkup]);

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none [&_svg]:h-full [&_svg]:w-full ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={
        svgMarkup ? { __html: svgMarkup } : undefined
      }
    />
  );
}

export default function ProjectsCTASection() {
  const sectionRef = useRef(null);

  return (
    <div className="relative w-full bg-white px-3 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
      <div className="relative mx-auto w-full max-w-7xl">
        <section
          ref={sectionRef}
          className="
            relative
            min-h-[650px]
            w-full
            rounded-[1.75rem]
            bg-white
            py-24
            text-black
            shadow-[0_25px_60px_-20px_rgba(60,60,59,0.15)]
            sm:min-h-[760px]
            sm:rounded-[2.5rem]
            sm:px-8
            sm:py-32
            lg:min-h-[820px]
            lg:py-40
          "
        >
          <AnimatedLineDrawing
            svgUrl="/images/construction-line.svg"
            containerRef={sectionRef}
            className="
              absolute
              inset-0
              z-0
              flex
              h-full
              w-full
              items-center
              justify-center
              opacity-[0.14]
              sm:opacity-[0.16]
            "
          />

          <div className="relative z-10 flex min-h-[600px] items-center justify-center sm:min-h-[700px] lg:min-h-[760px]">
            <CtaContent />
          </div>
        </section>
      </div>
    </div>
  );
}