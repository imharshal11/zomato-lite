# Zomato Lite

A lightweight restaurant discovery and review platform — built to demonstrate core product thinking around **trustworthy ratings, dish-level feedback, and honest UX** rather than vanity metrics.

Live: [zomato-lite-wheat.vercel.app](https://zomato-lite-wheat.vercel.app)

---

## 1. Product Overview

Zomato Lite lets users discover restaurants, browse menus, and leave structured feedback — either for a restaurant as a whole or for a specific dish. Every rating shown in the product is **computed live from underlying review data**, never stored as a stale aggregate. This is a deliberate product decision: the moment a user submits a review, it should be reflected everywhere — the average rating, the review count, and the review list itself — with no lag and no manual refresh required.

### Why this matters
Most lightweight review apps fake trust by hardcoding ratings or caching aggregates that drift out of sync with reality. Zomato Lite treats **data integrity as a first-class UX requirement**: what the user sees is always what the database currently holds.

---

## 2. Core Features

| Area | Capability |
|---|---|
| **Discovery** | Browse all restaurants with live-computed average rating and review count, search by name/cuisine/area, filter by category |
| **Restaurant Detail** | Tabbed view — Menu, Reviews, and a combined All view — with an at-a-glance KPI card (overall rating + review count) |
| **Menu** | Dish-level cards showing price, prep time, veg/non-veg indicator, and a live-computed dish rating |
| **Reviews** | Star rating (overall, food, packaging), free-text comment, "recommend to a friend" signal, and optional dish attribution |
| **Filtering** | Filter menu items and reviews by veg/non-veg and by exact star rating — no "and above" ambiguity |
| **Validation** | Client-side validation for a good experience, server-side validation as the actual security boundary (ratings 1–5, non-empty comments, valid restaurant references) |
| **Real-time consistency** | Submitting a review immediately updates the rating, count, and review list — no stale cache, no manual refresh |

---

## 3. Product Principles Behind the Build

These aren't arbitrary engineering choices — they reflect explicit product decisions made during the build:

1. **Store facts, compute answers.** The database never stores an `average_rating` column. Every rating is `AVG()`'d live from the reviews table on every request. This guarantees the number a user sees is never out of date.
2. **Validate twice, for different reasons.** Frontend validation exists purely for user kindness — instant feedback, no wasted round trips. Backend validation exists purely for security — it assumes the frontend can be bypassed and defends accordingly.
3. **Shape the API like the screen.** Endpoints return exactly what a given screen needs, pre-joined and pre-computed, rather than forcing the client to stitch together multiple raw tables.
4. **No dead state.** Wherever the codebase risked showing users a number that didn't match reality (a cached count, a split-off "latest review" that quietly disappeared from the list), we treated that as a P0 bug, not a cosmetic one.

---

## 4. Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Neon (serverless Postgres), raw SQL via `@neondatabase/serverless` — no ORM
- **Hosting:** Vercel (auto-deploys on push to `master`)
- **Version Control:** Git / GitHub

---

## 5. Data Model

Two core tables, kept intentionally simple:

**`restaurants`**
| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| name | text | |
| cuisine | text | |
| area | text | |
| image_url | text, nullable | |
| created_at | timestamp | Powers the "New" badge |

**`reviews`**
| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| restaurant_id | int | FK → restaurants |
| rating | int | 1–5, overall rating |
| comment | text | |
| recommends | boolean | "Would recommend to a friend" |
| food_rating | int, nullable | 1–5 |
| packaging_rating | int, nullable | 1–5 |
| menu_item_id | int, nullable | FK → menu_items — links a review to a specific dish |
| created_at | timestamp | |

**`menu_items`**
| Column | Type | Notes |
|---|---|---|
| id | serial | Primary key |
| restaurant_id | int | FK → restaurants |
| name | text | |
| description | text | |
| price | numeric | |
| category | text | |
| is_veg | boolean | |
| prep_time_minutes | int | |
| image_url | text, nullable | |
| created_at | timestamp | |

No aggregate columns are ever persisted. Averages and counts are computed at query time.

---

## 6. Getting Started

### Prerequisites
- Node.js 18+
- A Neon Postgres database (or any Postgres instance)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/imharshal11/zomato-lite.git
cd zomato-lite

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env.local file in the project root:
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The server will hot-reload as you edit files.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Full Postgres connection string, including credentials |

> **Security note:** Never commit `.env.local` to version control. If a connection string is ever exposed (screenshot, shared terminal, etc.), rotate the database password immediately via the Neon console and update it in both your local environment and your hosting provider's environment variables.

---

## 7. Project Structure

app/
restaurants/ → Restaurant discovery / listing page
restaurant/[id]/ → Restaurant detail page (Menu / Reviews / All tabs)
review/[restaurantId]/ → Review submission form
api/ → Server-side API routes (reviews, restaurant data)
components/ → Shared, reusable UI components
lib/ → Data access and utility functions
db/ → One-off migration and seeding scripts


---

## 8. Deployment

This project deploys to **Vercel** automatically on every push to `master`.

```bash
git add .
git commit -m "Describe your change"
git push
```

Vercel picks up the push, builds, and promotes to production automatically. Environment variables (like `DATABASE_URL`) must be configured separately in the Vercel project settings under **Settings → Environment Variables**, and a new deployment is required for any environment variable change to take effect.

---

## 9. Known Constraints & Roadmap

**Current constraints (by design, for a lightweight scope):**
- No user authentication — reviews are anonymous
- No image upload for reviews
- No pagination on review lists (acceptable at current data volume)

**Roadmap candidates:**
- Bookmark / save-list feature for favorite restaurants
- Full design-token consistency pass across all screens
- Review moderation / reporting flow

---

## 10. Learn More

This project is built on Next.js. Useful references:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
