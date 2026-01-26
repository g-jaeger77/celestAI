import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Use direct URL navigation to access the Dashboard page to continue testing dark mode theme consistency.
        await page.goto('http://localhost:3000/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate to the Chat page to continue verifying dark mode theme consistency across pages.
        await page.goto('http://localhost:3000/chat', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Scroll down the Chat page to check for any animations or charts and verify their theme consistency.
        await page.mouse.wheel(0, 600)
        

        # -> Navigate to the Synastry page to continue verifying dark mode theme consistency across pages.
        await page.goto('http://localhost:3000/synastry', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Scroll down the Synastry page to check for any animations or charts and verify their theme consistency.
        await page.mouse.wheel(0, 600)
        

        # -> Scroll down the Synastry page further to check for any animations or charts and verify their theme consistency.
        await page.mouse.wheel(0, 600)
        

        # -> Navigate to the Onboarding page to continue verifying dark mode theme consistency across pages.
        await page.goto('http://localhost:3000/onboarding', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Scroll down the Onboarding page to check for any animations or charts and verify their theme consistency.
        await page.mouse.wheel(0, 600)
        

        # -> Scroll down the Onboarding page further to check for any animations or charts and verify their theme consistency.
        await page.mouse.wheel(0, 600)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CELEST AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=O GPS da sua Alma').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Astrologia de precisão suíça unida à inteligência artificial avançada. Descubra sua origem, entenda seu presente e navegue seu futuro.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Efemérides Suíças').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cálculos astronômicos com precisão de segundos, usados pela NASA e astrólogos profissionais.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Psicologia Junguiana').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Interpretações baseadas em arquétipos profundos, focadas em autoconhecimento e não apenas previsão.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=IA Generativa').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Um Oracle que conversa com você. Tire dúvidas, peça conselhos e receba guias personalizados em tempo real.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12k+').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=98%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4.9/5').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tenha acesso vitalício ao Celest AI Vigor durante nossa fase de lançamento. Preço nunca mais será visto.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mapa Astral Completo & Profundo').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Previsões Diárias Personalizadas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Chat Ilimitado com Oracle AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Análise de Compatibilidade (Sinastria)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 97,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 297,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=VITALÍCIO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Garantia de 7 dias ou seu dinheiro de volta.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Garantir Acesso Agora').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2026 Celest Technologies. Todos os direitos reservados.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Termos').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacidade').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contato').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    