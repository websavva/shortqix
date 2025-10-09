# Shortqix

![Shortqix Banner](./public/og.png)

**Fast, reliable URL shortening service built with Nuxt 4**

Transform long URLs into short, shareable links with advanced analytics and premium features.

🔗 **[Live Demo](https://sqix.pro)**

---

## ✨ Features

- 🚀 **Fast URL Shortening** - Create short links instantly
- 📊 **Analytics Dashboard** - Track link performance and clicks
- 🔒 **Magic Link Authentication** - Passwordless login via email
- 💎 **Premium Plans** - Custom slugs, extended limits, and advanced analytics
- 💳 **Bitcoin Payments** - Cryptocurrency payment integration
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌐 **Real-time Updates** - WebSocket-powered notifications
- 📧 **Email Templates** - Beautiful email notifications with Vue Email
- 🔐 **Secure** - Built-in security best practices
- 📱 **QR Code Generation** - Download QR codes for your short links

---

## 🛠️ Tech Stack

- **Frontend**: [Nuxt 4](https://nuxt.com/), [Vue 3](https://vuejs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Nitro](https://nitro.unjs.io/), [H3](https://h3.unjs.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/)
- **Email**: [Nodemailer](https://nodemailer.com/), [Vue Email](https://vuemail.net/)
- **Payments**: Bitcoin integration
- **Testing**: [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/)
- **DevOps**: Docker, Docker Compose, Nginx, GitHub Actions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL 16+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/websavva/shortqix.git
   cd shortqix
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL and SMTP server** (using Docker)
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Deployment

### Development
```bash
docker compose -f docker-compose.dev.yml up
```

### Production
```bash
docker compose -f deployment/docker-compose.yml up -d
```

---

## 📦 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run all tests
pnpm test:e2e     # Run e2e tests
pnpm test:unit    # Run unit tests
pnpm lint         # Lint code
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Drizzle Studio
```

---


## 👨‍💻 Author

**Savva** - [@websavva](https://github.com/websavva)

---
