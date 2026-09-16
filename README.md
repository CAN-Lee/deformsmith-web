# DeformSmith project website

Static project page adapted from CAN-Lee/deformmaster-web (MIT), retaining its paper-page layout and blue/purple visual identity. Authors and title follow submission/arxiv.tex at the time of preparation. No framework or build dependencies; all displayed media, CSS, JavaScript, and the paper are local.

## Preview

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://localhost:8766. When using a remote machine, forward port 8766 in VS Code. Serve over HTTP; the interactive comparison loads assets/data.json and does not work from file://.

## Contents

- Overview, four-layer method, and enlarged paper figures.
- Turtle, whale, seal, and rugby ball: four methods and two views, using the source-view rerender set from September 15, 2026.
- Individual playback and shared play/pause/reset controls. Media remains at its recorded playback speed.
- Qualitative robot scene and close-up replays.
- Paper placeholder, copyable BibTeX, responsive layout.

The page does not publish tentative ratings, hypothetical ablation targets, or synthetic human preferences. Code availability follows the current manuscript: coming soon. Add the public repository and arXiv identifier when available. The Paper button returns to the current page while arXiv review is pending; local PDF snapshots are excluded from Git and deployment.

## Publish

The independent repository is CAN-Lee/DeformSmith_web. In Settings → Pages, set Source to GitHub Actions. Pushes to main then deploy the website through .github/workflows/pages.yml. The workflow publishes only the website and its required media.

Expected URL: https://can-lee.github.io/DeformSmith_web/

This checkout retains the original template remote as `template` for provenance; `origin` points to the independent DeformSmith repository.

LICENSE retains the template's MIT attribution. Original DeformMaster media is retained in static/images and static/videos but is not referenced by the new page; only assets/ and static/css/index.css are required for this site.
