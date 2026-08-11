export interface NavLink {
  title: string;
  path: string;
}

export interface NavSection {
  label: string;
  links: NavLink[];
}

export const NAV: NavSection[] = [
  {
    label: "Guide",
    links: [
      { title: "Getting started", path: "/docs/getting-started" },
      { title: "Concepts", path: "/docs/concepts" },
      { title: "Validation", path: "/docs/validation" },
    ],
  },
  {
    label: "API",
    links: [
      { title: "toJsonLd", path: "/docs/api/serialize" },
      { title: "Site & navigation", path: "/docs/api/site" },
      { title: "Creative work", path: "/docs/api/creative-work" },
      { title: "Person", path: "/docs/api/person" },
      { title: "Organization", path: "/docs/api/organization" },
      { title: "Education", path: "/docs/api/education" },
    ],
  },
  {
    label: "Recipes",
    links: [
      { title: "SvelteKit", path: "/docs/recipes/sveltekit" },
      { title: "React & Next.js", path: "/docs/recipes/react" },
      { title: "Plain HTML & SSR", path: "/docs/recipes/plain-html" },
      { title: "Breadcrumbs", path: "/docs/recipes/breadcrumbs" },
      { title: "Person entity graph", path: "/docs/recipes/person-graph" },
      { title: "Multi-node @graph", path: "/docs/recipes/graph" },
    ],
  },
];

/** Section label for a docs path, used for breadcrumb middles. */
export const sectionLabelFor = (pathname: string): string | undefined =>
  NAV.find((section) => section.links.some((link) => link.path === pathname))?.label;
