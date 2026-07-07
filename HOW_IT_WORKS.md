# Your Website — Simple Explanation

This document explains, in plain language, what was built for you and how it works.

## What you now have

A live website where anyone can:
1. Type a short note into a text box
2. Click "Submit"
3. See their note (and everyone else's notes) appear in a list below

**Your live website:** https://clouddemo-zeta.vercel.app

Try it yourself — open that link, type something, hit Submit, and watch it show up in the list.

## Where does the data go?

You're using two services together:

- **Supabase** — this is your database. Think of it like an Excel spreadsheet living in the cloud. It has a "sheet" (called a table) named `test_notes` with three columns: `id`, `content` (the note text), and `created_at` (when it was submitted).
- **Vercel** — this is what makes your website visible on the internet. It takes the website files and gives them a public URL (the link above) that anyone can visit.

So the flow is:

```
You type a note → Website sends it to Supabase → Supabase saves it in the table
                                                          ↓
You see the list  ← Website asks Supabase for recent notes ←
```

## The 3 files that make up your website

All live inside the `site/` folder in this project:

| File | What it does |
|---|---|
| `index.html` | The structure of the page — the title, the text box, the button, the list. Like the skeleton. |
| `style.css` | The colors, spacing, and fonts — makes it look nice instead of plain black-and-white text. |
| `script.js` | The "brain" — when you click Submit, this file sends your note to Supabase, and it also fetches the list of notes to display. |

There's also a `vercel.json` file in the main project folder — this just tells Vercel "the website files are inside the `site` folder," so it knows what to publish.

## How your note gets saved (in plain English)

1. You type text into the box and click **Submit**.
2. `script.js` grabs what you typed.
3. It sends that text to your Supabase project using a special web address (an API) plus a key that identifies your project — like a library card that lets your website talk to your database.
4. Supabase adds a new row to the `test_notes` table with your text and the current time.
5. `script.js` then asks Supabase "give me the latest notes" and redraws the list on the page so you see the update immediately.

## Where to see your raw data

You can look at the actual database table (not just the pretty website) here:
https://supabase.com/dashboard/project/epohdjzfrmijgiwhvfqg/editor

Click on `test_notes` in the table list to see every row that's been submitted, including the ones from testing.

## A couple of things worth knowing

- **The key in `script.js` is meant to be public.** It's called the "anon" (anonymous) key, and it's safe to have it visible in the website's code — it's how every Supabase website talks to its database from the browser. It is NOT your password and doesn't give access to your Supabase account settings.
- **Right now, anyone can write or read notes in this table.** There's no login system, and no restriction (called "Row Level Security" or RLS) turned on. That's fine for a demo/test table like this, but if you ever store anything private, we'd want to add rules that restrict who can see or edit what.

## How to make changes later

- Want to change how it looks? Edit `site/style.css` or `site/index.html`.
- Want to change what happens when you submit? Edit `site/script.js`.
- After editing, the changes need to be:
  1. Saved (committed) to your GitHub repository (`git add`, `git commit`, `git push` — or just ask me to do it)
  2. Re-deployed to Vercel (running `vercel --prod`, or just ask me to do it)

Just tell me what you'd like changed and I can make the edit and publish it for you.
