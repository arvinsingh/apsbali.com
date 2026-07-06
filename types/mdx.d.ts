declare module '*.mdx' {
  const MDXComponent: (_props: Record<string, unknown>) => JSX.Element
  export default MDXComponent
}
