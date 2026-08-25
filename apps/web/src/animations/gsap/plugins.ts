import gsap from "gsap";

const registeredPlugins = new WeakSet<object>();

export function registerGsapPlugins(...plugins: Array<object>): void {
  if (typeof window === "undefined" || plugins.length === 0) {
    return;
  }

  const nextPlugins = plugins.filter(
    (plugin): boolean => !registeredPlugins.has(plugin),
  );

  if (nextPlugins.length === 0) {
    return;
  }

  for (const plugin of nextPlugins) {
    gsap.registerPlugin(plugin);
    registeredPlugins.add(plugin);
  }
}
