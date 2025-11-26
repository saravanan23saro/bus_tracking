Vercel deploy instructions

This repo already contains a `public/` folder and `vercel.json` so Vercel can serve the static site.

Quick deploy steps (interactive):

1. Install Vercel CLI if needed

   npm i -g vercel

2. Login (interactive)

   vercel login

3. Run a production deploy

   vercel --prod

Or use the provided PowerShell helper (non-interactive if you set `VERCEL_TOKEN`):

   # from repo root in PowerShell
   .\scripts\deploy-vercel.ps1

Notes:
- For local testing of geolocation use `localhost` or `ngrok` to provide HTTPS to remote devices.
- If you want me to run the deploy from this environment, I can try, but you will need to provide a `VERCEL_TOKEN` with deploy permissions or run `vercel login` locally and run the script yourself.
