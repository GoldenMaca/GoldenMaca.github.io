# Browser-in-Browser (Lumina-style) + VM-like sandbox

You asked for a **browser inside the browser**. This folder contains two browser-only demos:

## 1) Browser-in-Browser iframe demo
**File:** `browser-vm/lumina-iframe.html`
- A UI that loads a URL inside an `<iframe>` (the “browser-in-browser” look).

Open:
```bash
open browser-vm/lumina-iframe.html
```

## 2) VM-like sandbox (terminal + in-memory filesystem)
**File:** `browser-vm/index.html`
- Terminal-style console (`help`, `ls`, `cat`)
- In-memory filesystem
- A tiny built-in overlay app (`run webapp`)

Open:
```bash
open browser-vm/index.html
```

Console commands:
- `help`
- `ls`
- `cat README.txt`
- `run webapp`
- `clear`
- `shutdown`

## Notes
Some websites block iframe embedding via **X-Frame-Options / CSP**, so a URL may fail to load even though the UI works.

