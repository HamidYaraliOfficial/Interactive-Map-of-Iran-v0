import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1280,'height':800}); pg.on('pageerror', lambda e: print('ERR', e))
    pg.goto('file:///home/claude/iran-map/index.html'); pg.wait_for_timeout(500)
    pg.screenshot(path='docs/screenshot-map.png')
    pg.mouse.click(*[int(v) for v in sys.argv[1:3]]); pg.wait_for_timeout(300)
    pg.screenshot(path='docs/screenshot-modal.png'); b.close()
