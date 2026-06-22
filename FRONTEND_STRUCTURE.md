# Frontend Structure

This document explains the current frontend folder structure of the project and the purpose of each important folder.

## Overview

The project uses the Next.js App Router. The `app/` directory is the main frontend entry point, and route groups are used to split the codebase by domain so multiple developers can work in parallel with fewer merge conflicts.

Route groups such as `(auth)` or `(admin)` help organize the code, but they do not appear in the final URL.

## Current Frontend Tree

```text
Enginex_React/
|- app/
|  |- (admin)/
|  |  |- admin/
|  |  |  |- console/
|  |  |  |  |- delete/
|  |  |  |  |  |- page.tsx
|  |  |  |  |- edit/
|  |  |  |  |  |- page.tsx
|  |  |  |  |- insert/
|  |  |  |  |  |- page.tsx
|  |  |  |  |- page.tsx
|  |  |  |- home/
|  |  |  |  |- page.tsx
|  |  |  |- marketplace/
|  |  |  |  |- [postId]/
|  |  |  |  |  |- edit/
|  |  |  |  |  |  |- page.tsx
|  |  |  |  |- page.tsx
|  |  |  |- page.tsx
|  |  |- layout.tsx
|  |- (auth)/
|  |  |- forgot-password/
|  |  |  |- page.tsx
|  |  |- login/
|  |  |  |- page.tsx
|  |  |- register/
|  |  |  |- page.tsx
|  |  |- layout.tsx
|  |- (client)/
|  |  |- client/
|  |  |  |- dashboard/
|  |  |  |  |- page.tsx
|  |  |  |- home/
|  |  |  |  |- page.tsx
|  |  |  |- marketplace/
|  |  |  |  |- page.tsx
|  |  |  |- profile/
|  |  |  |  |- page.tsx
|  |  |  |- page.tsx
|  |  |- layout.tsx
|  |- (engineer)/
|  |  |- engineer/
|  |  |  |- dashboard/
|  |  |  |  |- page.tsx
|  |  |  |- marketplace/
|  |  |  |  |- [postId]/
|  |  |  |  |  |- edit/
|  |  |  |  |  |  |- page.tsx
|  |  |  |  |- new/
|  |  |  |  |  |- page.tsx
|  |  |  |  |- page.tsx
|  |  |  |- profile/
|  |  |  |  |- page.tsx
|  |  |  |- page.tsx
|  |  |- layout.tsx
|  |- (public)/
|  |  |- marketplace/
|  |  |  |- [postId]/
|  |  |  |  |- page.tsx
|  |  |  |- page.tsx
|  |  |- layout.tsx
|  |  |- page.tsx
|  |- (team)/
|  |  |- team/
|  |  |  |- dashboard/
|  |  |  |  |- page.tsx
|  |  |  |- marketplace/
|  |  |  |  |- [postId]/
|  |  |  |  |  |- edit/
|  |  |  |  |  |  |- page.tsx
|  |  |  |  |- new/
|  |  |  |  |  |- page.tsx
|  |  |  |  |- page.tsx
|  |  |  |- page.tsx
|  |  |- layout.tsx
|  |- favicon.ico
|  |- globals.css
|  |- layout.tsx
|- public/
|  |- file.svg
|  |- globe.svg
|  |- next.svg
|  |- vercel.svg
|  |- window.svg
|- eslint.config.mjs
|- next.config.ts
|- package.json
|- postcss.config.mjs
|- tsconfig.json
```

## Top-Level Frontend Folders

### `app/`

This is the main application folder for the Next.js App Router.

Purpose:
- Defines all frontend routes.
- Holds shared layouts and page files.
- Organizes the application into route groups by domain and access level.

### `public/`

This folder stores static assets that are served directly by Next.js.

Purpose:
- Holds icons, SVGs, and other static frontend files.
- Makes assets available by URL, such as `/next.svg`.

## Core Files Inside `app/`

### `app/layout.tsx`

This is the root layout of the entire frontend.

Purpose:
- Wraps every page in the app.
- Defines global HTML and body structure.
- Loads global fonts and shared page-level setup.

### `app/globals.css`

This is the global stylesheet for the frontend.

Purpose:
- Applies base styles across all routes.
- Holds shared CSS rules used by the whole application.

### `app/favicon.ico`

This is the site favicon.

Purpose:
- Provides the browser tab icon for the app.

## Route Groups Inside `app/`

### `app/(public)/`

This route group contains public-facing pages that do not require authentication.

Purpose:
- Holds the landing page and public marketplace browsing experience.
- Separates public pages from logged-in application areas.

Important routes:
- `/` from `app/(public)/page.tsx`
- `/marketplace` from `app/(public)/marketplace/page.tsx`
- `/marketplace/[postId]` from `app/(public)/marketplace/[postId]/page.tsx`

### `app/(auth)/`

This route group contains authentication-related screens.

Purpose:
- Keeps login and account recovery flows isolated.
- Lets one developer or team own auth UI without touching business domains.

Important routes:
- `/login`
- `/register`
- `/forgot-password`

### `app/(client)/`

This route group contains the client-side user experience.

Purpose:
- Holds routes used by regular users of the marketplace platform.
- Separates the client app from engineer, team, and admin areas.

Important routes:
- `/client`
- `/client/home`
- `/client/dashboard`
- `/client/marketplace`
- `/client/profile`

### `app/(engineer)/`

This route group contains routes owned by engineers on the platform.

Purpose:
- Gives engineers their own workspace.
- Keeps engineer dashboard, profile, and marketplace management separate from other roles.

Important routes:
- `/engineer`
- `/engineer/dashboard`
- `/engineer/profile`
- `/engineer/marketplace`
- `/engineer/marketplace/new`
- `/engineer/marketplace/[postId]/edit`

### `app/(team)/`

This route group contains routes used by teams that post or manage opportunities.

Purpose:
- Provides a separate workspace for team-based accounts.
- Reduces overlap with engineer-specific features.

Important routes:
- `/team`
- `/team/dashboard`
- `/team/marketplace`
- `/team/marketplace/new`
- `/team/marketplace/[postId]/edit`

### `app/(admin)/`

This route group contains admin-only routes and moderation tools.

Purpose:
- Holds platform-wide management and moderation features.
- Centralizes operations such as console actions and marketplace oversight.

Important routes:
- `/admin`
- `/admin/home`
- `/admin/marketplace`
- `/admin/marketplace/[postId]/edit`
- `/admin/console`
- `/admin/console/insert`
- `/admin/console/edit`
- `/admin/console/delete`

## Nested Folder Purposes

### `marketplace/`

This folder represents marketplace-related routes.

Purpose:
- Public side: browse listings and view post details.
- Engineer and team side: manage their own marketplace posts.
- Admin side: moderate or update marketplace records.

### `dashboard/`

This folder contains dashboard views for each role.

Purpose:
- Gives each role a central overview page.
- Usually becomes the place for analytics, quick actions, and recent activity.

### `profile/`

This folder contains role-specific profile pages.

Purpose:
- Stores personal or organization profile views.
- Keeps account identity pages separate from dashboard and marketplace flows.

### `console/`

This folder exists only under admin.

Purpose:
- Groups global management actions such as insert, edit, and delete operations.
- Keeps admin platform controls separate from normal user-facing routes.

### `new/`

This folder represents the create flow for a new marketplace post.

Purpose:
- Gives engineer and team roles a dedicated route for creating new posts.
- Prevents public marketplace browsing from being mixed with content creation.

### `[postId]/`

This is a dynamic route segment for a specific marketplace post.

Purpose:
- Public side: open a single marketplace detail page.
- Role-owned side: open edit flows for a specific post.

### `edit/`

This folder represents the update flow for an existing record.

Purpose:
- Gives engineer, team, or admin users a dedicated edit page for a selected marketplace post.

### `insert/` and `delete/`

These folders are admin operation routes inside the console.

Purpose:
- Separate different platform actions clearly.
- Make admin workflows easy to find and maintain.

## Why This Structure Works

Purpose:
- Reduces merge conflicts by splitting the codebase into clear ownership areas.
- Keeps public browsing separate from authenticated management flows.
- Makes access control easier because routes are grouped by role.
- Helps scale the frontend as more pages, layouts, and shared modules are added.

## Suggested Team Ownership

- Public and marketing developer:
  `app/(public)/`
- Authentication developer:
  `app/(auth)/`
- Client app developer:
  `app/(client)/`
- Engineer workspace developer:
  `app/(engineer)/`
- Team workspace developer:
  `app/(team)/`
- Admin platform developer:
  `app/(admin)/`

## Future Structure Recommendation

As the project grows, it will help to add private implementation folders inside each route group, for example:

```text
app/
|- (engineer)/
|  |- engineer/
|  |  |- marketplace/
|  |  |  |- _components/
|  |  |  |- _lib/
|  |  |  |- new/
|  |  |  |- [postId]/
```

Purpose:
- `_components/` can hold UI used only by that route area.
- `_lib/` can hold helpers, validators, API calls, or local business logic.
- This keeps route files small and makes the frontend easier to maintain.
