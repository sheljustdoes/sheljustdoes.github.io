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

        check("no uncaught page errors", errors, [])
        browser.close()
finally:
    server.terminate()

print()
if failures:
    print(f"{len(failures)} check(s) failed: {', '.join(failures)}")
    sys.exit(1)
print("all interaction checks passed")
