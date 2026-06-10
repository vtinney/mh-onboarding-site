# Onboarding guide site

This repo publishes the Global Clean Air onboarding guide as a website using
[MkDocs Material](https://squidfunk.github.io/mkdocs-material/). The content lives
as plain Markdown in the `docs/` folder. When you edit a `.md` file and commit it,
a GitHub Action rebuilds the site automatically.

## What is where

```
mkdocs.yml                 site config and left-hand navigation
requirements.txt           the one dependency (mkdocs-material)
.github/workflows/ci.yml   auto-build + publish on every push to main
docs/
  index.md                 Home (title + how to use)
  onboarding.md            Part 0 · Practical onboarding
  glossary.md              Glossary
  primer.md                Part 1 · Air pollution primer
  hia.md                   Part 2 · Health impact assessment
  projects.md              Part 3 · The projects
  people.md                Part 4 · People
  getting-started.md       Part 5 · Getting started
  mentorship.md            Part 6 · Mentorship & expectations
  references.md            References
  stylesheets/extra.css    colors + fonts
```

## One-time setup (about 5 minutes)

1. Create a new repository on GitHub. The simplest option is a **public** repo
   (GitHub Pages is free for public repos; private repos need a paid plan).
   Name it anything, for example `monterrey-onboarding`.

2. Upload these files. Easiest in the browser: on the new repo page choose
   **uploading an existing file**, then drag in the whole contents of this folder
   (keep the folder structure). Or, if you use git locally:
   ```
   git init
   git add .
   git commit -m "Initial onboarding guide site"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/YOURREPO.git
   git push -u origin main
   ```

3. Open `mkdocs.yml` and edit the two marked lines so the **edit pencils** on each
   page point at your repo:
   ```
   repo_url: https://github.com/YOURUSERNAME/YOURREPO
   edit_uri: edit/main/docs/
   ```
   (You can do this right in GitHub: open `mkdocs.yml`, click the pencil, edit, commit.)

4. The first push runs the Action automatically. It builds the site and creates a
   branch called `gh-pages`. Wait for the green check on the **Actions** tab
   (about a minute).

5. Turn on Pages: repo **Settings → Pages → Build and deployment → Source: Deploy
   from a branch**, then choose branch **`gh-pages`** and folder **`/ (root)`**,
   and Save.

Your site will be live at:
```
https://YOURUSERNAME.github.io/YOURREPO/
```
That is the link you share with Mackenzie.

## Editing the wording (the easy part)

Two ways, both keep the site up to date automatically:

- **In the browser:** open any page on the live site and click the pencil
  ("Edit this page") in the top right. It drops you into GitHub's editor on the
  right `.md` file. Make your change, scroll down, and click **Commit changes**.
  The site rebuilds in about a minute.
- **Directly in the repo:** open `docs/whatever.md`, click the pencil, edit, commit.

You are just editing normal Markdown: `#` headings, `-` bullets, `[text](link)`
for links, and blank lines between paragraphs. The fenced ```` ```mermaid ````
blocks are the diagrams; leave the fences alone and you can tweak the labels inside.

## Previewing locally (optional)

If you want to see changes before pushing:
```
pip install -r requirements.txt
mkdocs serve
```
then open http://127.0.0.1:8000 in a browser. Edits show up live as you save.

## Notes

- The bracketed amber items in the guide (for example `[to confirm]` and
  `[Veronica to add ...]`) are intentional placeholders to fill in. Search the
  files for `[` to find them.
- To add or reorder pages, edit the `nav:` block at the bottom of `mkdocs.yml`.
