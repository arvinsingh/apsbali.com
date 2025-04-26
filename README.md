# Personal Website

This is a **modern personal website** built using [Next.js](https://nextjs.org/) and inspired by [Max Leiter's project](https://github.com/maxleiter/maxleiter.com). It serves as a space to showcase my work, share ideas via blog posts, and experiment with new technologies.

## Features
- **Blog Posts**: Create and manage blog posts written in Markdown.
- **Responsive Design**: Fully responsive layout optimized for all device sizes.
- **Dynamic Icons**: Includes feather-style SVG icons for a consistent, clean look.
- **Customizable**: Easy to modify content, structure, and styles to match personal branding.
- **Timezone Display**: Displays time dynamically based on different zones (e.g., London, SF).
- **Analytics Ready**: Supports integration with tools like Supabase for analytics (optional).

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) for building fast, server-rendered React apps.
- **Styling**: Global CSS for consistent design and layout.
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

3. **Set Up Environment Variables**
   - Create a `.env.local` file in the root directory and add necessary variables (e.g., analytics keys or API URLs). Example:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Run Locally**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in browser.

5. **Build for Production**
   ```bash
   pnpm start
   ```
   Start a production instance built via yarn build.

## File Structure
- **`pages/`**: Contains the routes for the site.
- **`app/`**: Houses reusable components.
- **`posts/`**: Blog posts written in Markdown.
- **`public/`**: Static assets like images and icons.
- **`styles/`**: Global CSS for styling.

## How to Add a Blog Post
1. Navigate to the `posts/` directory.
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

## Deployment
1. Commit changes:
   ```bash
   git add .
   git commit -m "Initial setup for personal website"
   ```
2. Push changes to repository:
   ```bash
   git push origin main
   ```
3. Deploy to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/):
   - Link GitHub repository.
   - Follow the deployment steps provided by your chosen platform.

## Contributing
If you'd like to suggest improvements or report issues, feel free to open an issue or a pull request in the repository.

## License
This project is licensed under the [MIT License](LICENSE).
