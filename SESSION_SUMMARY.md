# Session Summary — What Was Done, Step by Step

This is a full walkthrough of everything done in this session, in order, with the reasoning behind each step. Read this if you want to deeply understand the process (e.g. to explain it to someone else or repeat it yourself next time).

---

## The goal

You asked for:
1. A normal website with a data-filling form
2. Whenever someone fills the form, the data gets saved into your existing Supabase database
3. The website hosted on Vercel

---

## Step 1 — Looked at what already existed

Before building anything, the project folder was inspected to understand the starting point:

- It was already a **git repository** connected to GitHub (`skafridi8/cloudDemo`).
- It already had a **Supabase project linked** (project ref `epohdjzfrmijgiwhvfqg`), set up via the `supabase/` folder and its migration files.
- There was already a database table called **`test_notes`** with three columns: `id`, `content`, `created_at`. This table already had a few rows of test data in it from before this session.

**Why this mattered:** it meant no new database or new Supabase project needed to be created — the note-taking table already existed, so the website just needed to be built to talk to it.

---

## Step 2 — Built the website files

A new folder `site/` was created with three files:

- **`index.html`** — the page structure: a heading, a text box (`<textarea>`), a Submit button, and an empty list area for notes to appear in.
- **`style.css`** — visual styling (colors, spacing, rounded corners) so it doesn't look like a plain unstyled page.
- **`script.js`** — the logic. This file:
  - Connects to Supabase using the **Supabase JavaScript library** (loaded from a public CDN link in `index.html`)
  - On page load, fetches the 20 most recent notes and displays them
  - On form submit, sends the typed text to Supabase to be inserted as a new row, then refreshes the list

A `vercel.json` file was also added at the top of the project, containing:
```json
{ "outputDirectory": "site" }
```
**Why:** this tells Vercel "the actual website files live inside the `site` folder," since the repository also contains the unrelated `supabase/` folder.

---

## Step 3 — Got the Supabase connection details

To let the website talk to your Supabase project, two pieces of public information were needed:

1. **Project URL** — `https://epohdjzfrmijgiwhvfqg.supabase.co`
2. **Anon (public) API key** — a long token starting with `eyJ...`

You retrieved both from your Supabase Dashboard under **Settings → API**, and pasted them into the chat. These were then placed directly into `script.js`.

**Why this is safe:** the "anon" key is *designed* to be public and embedded in front-end code — it's not a secret password. It only allows the specific actions your database rules (permissions) allow.

---

## Step 4 — Tested the database connection directly (before even opening a browser)

Rather than guessing whether the connection would work, it was tested directly using `curl` (a command-line tool for sending web requests):

- Sent a **POST** request to Supabase's REST API to insert a test note → got back a success response (`HTTP 201`) with the new row's data.
- Sent a **GET** request to fetch the recent notes → got back the list including the new test row.
- Sent a **DELETE** request to remove that test row again, so it wouldn't clutter your real data.

**Why do this first:** it confirms the Supabase URL, key, and table permissions are all correct *before* spending time debugging a full website — isolates "is the backend reachable" from "is the front-end code correct."

---

## Step 5 — Committed and pushed the code to GitHub

The new `site/` folder and `vercel.json` were added to git, committed with a descriptive message, and pushed to the `main` branch on GitHub (`skafridi8/cloudDemo`).

**Why:** Vercel deployments are normally built from what's in your GitHub repository (or, as used here, deployed directly from your local files) — so the code needs to exist somewhere Vercel can read it.

---

## Step 6 — Set up and deployed to Vercel

Since no Vercel command-line tool was installed yet, it was run on-demand using `npx` (a tool that runs a program without permanently installing it):

1. `npx vercel whoami` — checked if already logged in. It wasn't, so it automatically started a **login flow**: it printed a link, and once approved, logged in as your Vercel account (`skafridi8`).
2. `npx vercel --prod` — attempted the first deployment. This **failed** because Vercel auto-generates a project name from your folder name (`cloudDemo`), and Vercel project names must be lowercase — `cloudDemo` has a capital `D`.
3. Fixed by explicitly linking a project with a lowercase name: `npx vercel link --project clouddemo`. This created a new Vercel project called `clouddemo` under your account.
   - It also *tried* to auto-connect your GitHub repo for automatic future deployments, but that particular step failed (likely needs a one-time GitHub permission grant through Vercel's dashboard). This didn't block anything — deployment still works by pushing files directly from your computer.
4. `npx vercel --prod` — ran again, and this time it succeeded, producing a live URL:
   **https://clouddemo-zeta.vercel.app**

---

## Step 7 — Found and fixed a bug by actually testing in a browser

Instead of assuming the deployed site worked, it was opened in a real browser (using browser-automation tools) and checked:

- The page loaded and looked correct, **but** the "Recent Notes" list was empty — it should have shown existing notes.
- Checked the browser's **console** (a developer tool that shows errors) and found:
  ```
  SyntaxError: Identifier 'supabase' has already been declared
  ```
- **The cause:** the Supabase library (loaded via the CDN `<script>` tag) creates its own global variable named `supabase`. The custom code in `script.js` also tried to create its own variable also named `const supabase`. In plain `<script>` tags (not using JavaScript "modules"), these two share the same global space, so declaring the same name twice crashes the whole script — meaning *nothing* in `script.js` ran, including the code that loads and displays notes.
- **The fix:** renamed the local variable from `supabase` to `supabaseClient` throughout `script.js`, so it no longer collides with the library's own global.

This was committed to git, pushed to GitHub, and redeployed to Vercel with `npx vercel --prod`.

---

## Step 8 — Verified the fix actually works, live

Opened the live site again in the browser and confirmed:

1. **No errors** in the console anymore.
2. The **existing notes loaded correctly** in the list.
3. Typed a real note ("Hello from the deployed Vercel site!"), clicked **Submit**, saw a "Saved!" confirmation message, and watched the new note **appear instantly at the top of the list** — proving the full round trip works: browser → Supabase → back to browser.

---

## Step 9 — Wrote plain-language documentation

Created `HOW_IT_WORKS.md` in the project, explaining (for someone new to this) what Supabase and Vercel are, what each file does, how data flows when the form is submitted, and where to view the raw data in Supabase's dashboard.

---

## Summary of tools/concepts used

| Concept | What it means here |
|---|---|
| **Supabase** | Your cloud database (and more) — stores the notes people submit |
| **Vercel** | Hosting service that makes the website publicly accessible via a URL |
| **anon key** | A public, safe-to-expose API key that lets your website read/write to Supabase, governed by permission rules |
| **git / GitHub** | Version control — keeps a saved history of your code and stores it online |
| **`curl`** | A way to test a web request from the command line, used here to verify the database worked before touching the browser |
| **npx** | Runs a command-line tool without installing it permanently — used to run the Vercel tool |
| **Browser console** | Where JavaScript errors show up — this is how the bug was found |
| **Row Level Security (RLS)** | A Supabase feature (not yet turned on for `test_notes`) that would restrict who can read/write specific rows — worth adding if this ever holds real/private data |

---

## What you can point to if explaining this to someone else

- **Live site:** https://clouddemo-zeta.vercel.app
- **Code:** `site/index.html`, `site/style.css`, `site/script.js`, `vercel.json` in your GitHub repo `skafridi8/cloudDemo`
- **Database:** Supabase project `epohdjzfrmijgiwhvfqg`, table `test_notes`, viewable at https://supabase.com/dashboard/project/epohdjzfrmijgiwhvfqg/editor
- **The one bug hit and fixed:** a JavaScript variable name collision between the Supabase library and custom code — a good real-world example of how a single naming clash can silently break an entire script.
