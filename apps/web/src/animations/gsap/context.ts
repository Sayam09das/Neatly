import gsap from "gsap";

export function createGsapContext(
  setup: gsap.ContextFunc,
  scope?: Element | string | object,
): gsap.Context {
  return gsap.context(setup, scope);
}
