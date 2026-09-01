import { landingBlogHighlights, landingCtas } from "@/config/landing";

export const blogPageMetadata = {
  description: landingBlogHighlights.intro,
  title: "Journal",
} as const;

export const blogPageCopy = {
  emptyMessage: landingBlogHighlights.emptyMessage,
  errorMessage: landingBlogHighlights.errorMessage,
  eyebrow: landingBlogHighlights.eyebrow,
  heading: landingBlogHighlights.heading,
  headingId: "blog-index-heading",
  readArticleLabel: "Read note",
  unavailableHeading: "Journal notes are unavailable",
} as const;

export const blogPostPageCopy = {
  backLabel: landingCtas.readJournal.label,
  unavailableHeading: "This journal note is unavailable",
  unavailableMessage:
    "The article could not be loaded. Try the journal index, or request a quote if you are ready for a visit.",
} as const;
