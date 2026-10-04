#!/usr/bin/env python3
"""Interaction smoke test for the homepage graph.

Screenshots cannot catch broken event handling — a page can render perfectly and
still be inert. This drives a real browser against the production build and
asserts the interactions actually fire.

    npm run build && npm run test:ui

Requires playwright (`pip install playwright`); uses the installed Chrome via
channel="chrome", so no browser download is needed.
"""
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

PORT = 8231
URL = f"http://127.0.0.1:{PORT}/"
failures: list[str] = []


def check(label: str, got, want) -> None:
    ok = got == want
    print(f"  {'PASS' if ok else 'FAIL'}  {label}: {got!r}" + ("" if ok else f" (expected {want!r})"))
    if not ok:
        failures.append(label)


server = subprocess.Popen(
    ["npx", "--yes", "http-server", "out", "-p", str(PORT), "-s"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
try:
    time.sleep(4)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport={"width": 1500, "height": 1000})
        errors: list[str] = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL, wait_until="networkidle")

        open_ = lambda: page.locator(".panel.is-open").count() > 0
        check("panel closed on load", open_(), False)

        # The regression this exists for: pointer capture on the wrapper used to
        # retarget the click away from the node, leaving the graph inert.
        page.get_by_role("button", name="iridis — Project").click()
        page.wait_for_timeout(500)
        check("clicking a node opens the panel", open_(), True)
        check("panel shows the node", page.locator(".panel-title").inner_text(), "iridis")
        check("detail bullets render", page.locator(".panel-points li").count() > 0, True)
        check("vocabulary renders", page.locator(".kw").count() > 0, True)

        page.locator(".tag").first.click()
        page.wait_for_timeout(400)
        check("connection tag navigates", page.locator(".panel-title").inner_text() != "iridis", True)

        page.locator(".kw").first.click()
        page.wait_for_timeout(300)
        check("vocabulary term filters the graph", page.locator(".kwbar").count() > 0, True)

        page.keyboard.press("Escape")
        page.wait_for_timeout(400)
        check("escape closes the panel", open_(), False)

        # A drag must pan rather than register as a selection.
        page.mouse.move(300, 300)
        page.mouse.down()
        page.mouse.move(560, 400, steps=12)
        page.mouse.up()
        page.wait_for_timeout(300)
        check("dragging does not select", open_(), False)

        # Nodes have fixed homes: the authored layout, identical on every load.
        disc = lambda id_: page.locator(f'[data-id="{id_}"] .g-disc')
        pos = lambda id_: (float(disc(id_).get_attribute("cx")), float(disc(id_).get_attribute("cy")))
        home = {id_: pos(id_) for id_ in ("iridis", "perceptual-color")}
        page.reload(wait_until="networkidle")
        check("layout is the same on reload", {id_: pos(id_) for id_ in home}, home)

        # Dragging a node moves it, tugs a neighbor, and springs both back home.
        box = disc("iridis").bounding_box()
        cx, cy = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 160, cy - 140, steps=16)
        page.wait_for_timeout(400)
        moved = pos("iridis")
        neighbor = pos("perceptual-color")
        page.mouse.up()
        check("dragging a node moves it", moved != home["iridis"], True)
        check("dragging a node tugs its neighbor", neighbor != home["perceptual-color"], True)
        check("dragging a node does not select it", open_(), False)
        page.wait_for_timeout(4000)
        back = all(abs(a - b) < 6 for id_ in home for a, b in zip(pos(id_), home[id_]))
        check("nodes spring back home on release", back, True)

        check("no uncaught page errors", errors, [])
        browser.close()
finally:
    server.terminate()

print()
if failures:
    print(f"{len(failures)} check(s) failed: {', '.join(failures)}")
    sys.exit(1)
print("all interaction checks passed")
