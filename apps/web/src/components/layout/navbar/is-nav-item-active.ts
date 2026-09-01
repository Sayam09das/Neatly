export function getNavItemPathname(href: string): string {
  const hashIndex = href.indexOf("#");
  const pathname = hashIndex === -1 ? href : href.slice(0, hashIndex);

  return pathname === "" ? "/" : pathname;
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href.includes("#")) {
    return false;
  }

  const hrefPathname = getNavItemPathname(href);

  if (hrefPathname === "/") {
    return pathname === "/";
  }

  return pathname === hrefPathname || pathname.startsWith(`${hrefPathname}/`);
}
