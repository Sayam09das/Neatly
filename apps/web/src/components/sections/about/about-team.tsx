import { cn } from "@neatly/utils";
import Image from "next/image";
import type { ReactElement } from "react";
import { aboutTeam } from "@/config/about";

export function AboutTeam(): ReactElement {
  return (
    <section
      aria-labelledby={aboutTeam.headingId}
      className="about-people bg-muted text-foreground"
      data-people-section
      id="people"
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12">
          <div className="lg:col-span-8">
            <p
              className="about-people-eyebrow text-label text-primary uppercase"
              data-about-team-eyebrow
              data-people-eyebrow
            >
              {aboutTeam.eyebrow}
            </p>
            <h2
              aria-label={aboutTeam.heading}
              className="about-people-heading mt-4 text-display tracking-tight"
              data-about-team-heading
              data-people-heading
              id={aboutTeam.headingId}
            >
              {aboutTeam.headingLines.map((line, index) => {
                const isAccent = index === aboutTeam.headingLines.length - 1;

                return (
                  <span
                    aria-hidden="true"
                    className={cn("block", isAccent && "text-primary")}
                    key={line}
                  >
                    {line}
                  </span>
                );
              })}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:row-start-2">
            <p
              className="about-people-copy max-w-xl text-body text-muted-foreground"
              data-about-team-copy
              data-people-copy
            >
              {aboutTeam.intro}
            </p>
          </div>
          <div className="lg:col-span-7 lg:row-start-2">
            <figure className="group m-0">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-background sm:aspect-[5/4] lg:aspect-[4/5]"
                data-about-team-mask
              >
                <div
                  className="absolute inset-0 origin-center motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard group-hover:scale-105"
                  data-about-team-image
                  data-people-image
                >
                  <Image
                    alt={aboutTeam.image.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    src={aboutTeam.image.src}
                    style={{
                      objectPosition: aboutTeam.image.objectPosition,
                    }}
                  />
                </div>
              </div>
              <figcaption className="mt-4 max-w-md text-caption text-muted-foreground">
                {aboutTeam.emptyMessage}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
