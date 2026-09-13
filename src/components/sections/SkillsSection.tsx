// src/components/sections/SkillsSection.tsx
"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Stack from "@/components/ui/Stack";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

const certificateImages = [
  "Certificate of Completion Ivanna Putri Paramitha (1).jpg",
  "Certificate of Participation Ivanna Putri Paramitha (1).jpg",
  "Ivanna Putri (1)_page-0001.jpg",
  "Ivanna Putri P (1).png",
  "Ivanna Putri Paramitha.png",
  "Ivanna Putri Paramitha_page-0001.jpg",
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const certificates = skills.slice(0, certificateImages.length);

  return (
    <section id="skills" className="border-t border-[var(--border)] py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeader
            title="Certificates"
            tag="/ credentials"
            subtitle="Proof of my proficiency in technology and other areas"
          />
        </FadeIn>

        <div className="flex justify-center">
          <FadeIn
            className="h-[240px] w-[320px] max-w-full sm:h-[360px] sm:w-[480px]"
            direction="left"
          >
            <Stack
              randomRotation
              sensitivity={180}
              sendToBackOnClick
              cards={certificates.map((skill, index) => (
                <CertificateCard
                  key={skill.id}
                  skill={skill}
                  index={index}
                  image={`/certificate/${encodeURIComponent(certificateImages[index % certificateImages.length])}`}
                />
              ))}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function CertificateCard({
  skill,
  index,
  image,
}: {
  skill: Skill;
  index: number;
  image: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.25)]">
      <img
        src={image}
        alt={`${skill.name} certificate`}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
