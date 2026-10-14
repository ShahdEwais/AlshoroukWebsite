



import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import ProjectHero from "../../../components/ProjectHero/ProjectHero";
import { usePublishedProjects } from "../../../features/marketing/MarketingProvider";
import ProjectBeforeAfter from "../../../components/ProjectBeforeAfter/ProjectBeforeAfter";
import ProjectHierarchy from "../../../components/ProjectHierarchy/ProjectHierarchy";
import GallerySection from "../../../components/GallerySection/GallerySection";
import ProjectChallenges from "../../../components/ProjectChallenges/ProjectChallenges";
import VisionShowcase from "../../../components/Visionshowcase/Visionshowcase";
import FlowScroll, { FlowSection } from "../../../components/FlowScroll/FlowScroll";
import ProjectBimJourney from "../../../components/ProjectBimJourney/ProjectBimJourney";

export default function ProjectDetails() {
  const { id } = useParams();
  const projectsWithDetails = usePublishedProjects();

  const project = projectsWithDetails.find((p) => String(p.id) === id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [id]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <FlowScroll aria-label="Project Details">
      <FlowSection aria-label="Project Hero">
        <ProjectHero project={project} />
      </FlowSection>

      <FlowSection aria-label="BIM Delivery Journey" className="bg-white">
        <ProjectBimJourney project={project} />
      </FlowSection>

      <FlowSection
        aria-label="Project Vision"
        className="bg-[#1E2432]"
      >
        <VisionShowcase />
      </FlowSection>

      <FlowSection
        aria-label="Project Challenges"
        className="bg-[#1E2432]"
      >
        <ProjectChallenges />
      </FlowSection>

      {project.beforeImage && project.afterImage && (
        <FlowSection
          aria-label="Project Transformation"
          className="bg-[#F8F9FD]"
        >
          <ProjectBeforeAfter project={project} />
        </FlowSection>
      )}

      <FlowSection
        aria-label="Project Hierarchy"
        skipPin
        fit
        className="bg-[#FFFFFF]"
      >
        <ProjectHierarchy project={project} />
      </FlowSection>

      <FlowSection
        aria-label="Project Gallery"
        className="bg-white"
      >
        <GallerySection />
      </FlowSection>
    </FlowScroll>
  );
}
