import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { TestimonialsSkeleton } from "@/components/sections/testimonials";

export default function TestimonialsLoading(): ReactElement {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <TestimonialsSkeleton />
      </main>
    </>
  );
}
