# SuiDev Labs Blog

A technical blog about Sui blockchain development, DeFi protocols, and Move programming. Built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

**Live Site**: https://suidev-labs.github.io

## Features

- Clean, minimal design with developer-docs aesthetic
- Dark mode toggle (respects system preference)
- Syntax highlighting for code blocks
- RSS feed (`/feed.xml`)
- Sitemap (`/sitemap.xml`)
- Paginated archives
- Category pages
- Responsive design
- Fast builds with Eleventy

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/suidev-labs/suidev-labs.github.io.git
cd suidev-labs.github.io/blog

# Install dependencies
npm install
# or
make install
```

### Development

```bash
# Start development server with hot reload
npm run dev
# or
make dev
```

The site will be available at `http://localhost:8080` with live reload enabled.

### Production Build

```bash
# Build the site
npm run build
# or
make build
```

The built site will be in the `_site/` directory.

## Writing Posts

### Creating a New Post

1. Create a new Markdown file in `src/posts/YYYY/MM/`:

```bash
# Example: Create a new post for January 2025
mkdir -p src/posts/2025/01
touch src/posts/2025/01/my-new-post.md
```

2. Add frontmatter at the top of the file:

```yaml
---
title: "My Post Title"
date: 2025-01-15
categories:
  - Tutorials
  - Move
tags:
  - sui
  - smart-contracts
excerpt: "A brief description of the post for the listing pages."
---

Your post content here...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `categories` | No | Array of categories |
| `tags` | No | Array of tags |
| `excerpt` | No | Custom excerpt (otherwise auto-generated) |

### Code Blocks

Use fenced code blocks with language identifiers for syntax highlighting:

````markdown
```move
module example::hello {
    public fun greet(): String {
        string::utf8(b"Hello, Sui!")
    }
}
```
````

Supported languages include: `move`, `rust`, `javascript`, `typescript`, `bash`, `json`, `toml`, `yaml`, and many more.

## Project Structure

```
blog/
├── .eleventy.js        # Eleventy configuration
├── package.json        # Node.js dependencies
├── Makefile            # Build commands
├── src/
│   ├── _data/          # Global data files
│   │   └── site.json   # Site configuration
│   ├── _includes/
│   │   ├── layouts/    # Page layouts
│   │   └── partials/   # Reusable components
│   ├── assets/
│   │   ├── css/        # Stylesheets
│   │   └── js/         # JavaScript
│   ├── posts/          # Blog posts (YYYY/MM/slug.md)
│   ├── index.njk       # Home page
│   ├── archives.njk    # Paginated archives
│   ├── categories.njk  # Category listing
│   ├── category.njk    # Individual category page
│   ├── about.md        # About page
│   ├── feed.njk        # RSS feed
│   └── sitemap.njk     # XML sitemap
├── _site/              # Built output (git-ignored)
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

## Deployment

### GitHub Pages (Recommended)

The repository is configured for automatic deployment to GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://suidev-labs.github.io`

#### Setting Up GitHub Pages

1. Go to repository Settings > Pages
2. Under "Build and deployment", select "GitHub Actions"
3. Push to `main` branch to trigger deployment

### VPS with nginx

For self-hosted deployment:

1. Build the site:
```bash
make build
```

2. Copy `_site/` contents to your web root:
```bash
rsync -avz _site/ user@yourserver:/var/www/suidev-labs/
```

3. Configure nginx:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name suidev-labs.io www.suidev-labs.io;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name suidev-labs.io www.suidev-labs.io;

    # SSL configuration (use certbot for Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/suidev-labs.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/suidev-labs.io/privkey.pem;

    root /var/www/suidev-labs;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve files, fall back to 404
    location / {
        try_files $uri $uri/ =404;
    }

    # Custom error pages
    error_page 404 /404.html;
}
```

4. Set up SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d suidev-labs.io -d www.suidev-labs.io
```

## Customization

### Site Configuration

Edit `src/_data/site.json` to update:

- Site title and description
- Author information
- Navigation links
- Social links

### Styling

The main stylesheet is at `src/assets/css/style.css`. It uses CSS custom properties for theming, making it easy to customize colors and spacing.

### Adding Pages

Create new `.md` or `.njk` files in `src/` with appropriate frontmatter:

```yaml
---
layout: page.njk
title: My New Page
permalink: /my-page/
---
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production site |
| `npm run clean` | Remove `_site/` directory |
| `make install` | Install dependencies |
| `make dev` | Start development server |
| `make build` | Build production site |
| `make clean` | Clean build directory |
| `make serve` | Build and serve locally |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with [Eleventy](https://www.11ty.dev/) | Deployed on [GitHub Pages](https://pages.github.com/)
