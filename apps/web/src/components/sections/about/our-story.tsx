import type { ReactElement } from "react";
import { aboutStory } from "@/config/about";
import { OurStoryScene } from "./our-story-scene";

export function OurStory(): ReactElement {
  return (
    <section
      aria-labelledby={aboutStory.headingId}
      className="bg-background text-foreground"
      id="story"
    >
      <OurStoryScene />
    </section>
  );
}
