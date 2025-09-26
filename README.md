# Personal Website

This is a **modern personal website** built using [Next.js](https://nextjs.org/) and inspired by [Max Leiter's project](https://github.com/maxleiter/maxleiter.com). It serves as a space to showcase my work, share ideas via blog posts, and experiment with new technologies.

## Want to Create Your Own Website?

**This repository is designed to be easily forkable!** If you want to create your own personal website using this template:


The setup process is simple:
1. Fork this repository
2. Update `repo.config.json` with your repository details  
3. Create your own content repository
4. Deploy to Vercel

## Features
- **Blog Posts**: Create and manage blog posts written in Markdown.
- **Responsive Design**: Fully responsive layout optimized for all device sizes.
- **Dynamic Icons**: Includes feather-style SVG icons for a consistent, clean look.
- **Customizable**: Easy to modify content, structure, and styles to match personal branding.
- **Timezone Display**: Displays time dynamically based on different zones (e.g., London, SF).
- **Analytics Ready**: Supports integration with tools like Supabase for analytics (optional).
- **Content Decoupling**: Content is stored in a separate repository for better organization

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) for building fast, server-rendered React apps.
- **Styling**: Global CSS for consistent design and layout.
- **Content Management**: Git submodules for decoupled content storage
- **Deployment**: Easily deployable on platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

## Installation and Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/arvinsingh/apsbali.com.git
   cd apsbali.com
   ```
2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Fetch Content Submodule**
   ```bash
   git submodule update --init --recursive
   ```
   The `content/` directory is expected to point at your private/public content repository (markdown, config, assets).

4. **Generate Derived Content (optional)**
   ```bash
   pnpm run generate:content-manifests
   ```
   This script snapshots `content/config.json`, produces lightweight post/note manifests for edge routes, and mirrors `content/public/**` into `public/` and `public/content/` (both gitignored). It runs automatically before `pnpm dev` and `pnpm build`, but you can execute it manually after editing content.

5. **Run Locally**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in your browser.

6. **Build for Production**
   ```bash
   pnpm build
   pnpm start
   ```
   The build step statically embeds everything from the content submodule; `pnpm start` serves the production bundle.

7. **Lint & Format**
   ```bash
   pnpm lint
   pnpm format
   ```
   `pnpm lint` runs Next.js linting plus a Prettier check. `pnpm format` will apply Prettier fixes across TypeScript, JavaScript, and Markdown files.

### Environment Variables

If you rely on analytics or external services, create a `.env.local` file and add the necessary keys. Example:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## File Structure (partial)
- **`app/`** – App Router entry points, route groups, and shared components.
- **`app/data/`** – Static configuration helpers plus generated manifests under `app/data/generated/` (created at build time, gitignored).
- **`content/`** – Git submodule containing personal details (`config.json`), markdown (`posts/`, `notes/`), structured data (`projects/projects.json`), and public assets (`public/**`).
- **`public/`** – Static assets used by the Next.js build. The directories `public/blog/` and `public/content/` are generated mirrors of `content/public/**` and are ignored by git.
- **`scripts/`** – Utility scripts (for example, `generate-content-manifests.mjs`).

## How to Add a Blog Post
Clone the following example repo [example content repo](git@github.com:arvinsingh/apsbali.com-example-content.git)

```
git clone git@github.com:arvinsingh/apsbali.com-example-content.git
```

1. Navigate to the `content/posts/` directory inside your content repository (submodule).
2. Create a new Markdown file (`my-new-post.mdx`).
3. Add metadata at the top of the file (example):
   ```markdown
   ---
   title: "My New Blog Post"
   description: "An exciting update about my journey."
   date: "2025-04-26"
   tags: ["update", "personal"]
   ---
   ```
4. Write content below the metadata section.
5. If you reference images, place them under `content/public/` (for example, `content/public/blog/my-post/image.png`). The build tooling will mirror them into `public/` automatically so they can be served statically at runtime.

## Deployment
When deploying on Vercel:

- Provide the integration or a GitHub Personal Access Token with read access to the content repository if it is private with token name `GIT_SUBMODULE_TOKEN`.
- The `pnpm build` script will automatically generate manifests and mirror assets before `next build` runs.

Optional: the `.github/workflows/update-submodule.yml` workflow listens for repository-dispatch events from the content repo and pushes an updated submodule pointer. To use it, set a token with repo write access in the website repo (`GITHUB_TOKEN` is automatic for pushes) and configure the companion workflow in the content repo with a `MAIN_REPO_TOKEN` secret that can dispatch to the main repo.

To redeploy after updating content, push changes to the content repository and trigger a new build (or configure a GitHub Action that updates the submodule reference and kicks off Vercel).

## Contributing
If you'd like to suggest improvements or report issues, feel free to open an issue or a pull request in the repository.

## License
This project is licensed under the [MIT License](LICENSE).
