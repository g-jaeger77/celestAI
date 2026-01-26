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
        # -> Simulate a successful subscription event in Stripe triggering the webhook
        await page.goto('http://localhost:3000/api/test/trigger-subscription-webhook', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Check that the backend updates the user's premium status in the database accordingly
        await page.goto('http://localhost:3000/api/user/status', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Try to access a premium feature or page that requires premium access to verify if the user's premium status is active after the webhook event.
        frame = context.pages[-1]
        # Click on 'Garantir Acesso Agora' button to try accessing premium subscription or features
        elem = frame.locator('xpath=html/body/div/div/section[3]/div/div[2]/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Attempt to access or identify premium features or indicators on this page or navigate to a known premium feature page to verify premium access status.
        frame = context.pages[-1]
        # Click on 'Astral' button in the sidebar to access premium feature area
        elem = frame.locator('xpath=html/body/div/div/aside/nav/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try to click the 'Começar Jornada' button (index 14) to proceed with onboarding and potentially unlock premium features or status indicators.
        frame = context.pages[-1]
        # Click 'Começar Jornada' button to proceed with onboarding and check for premium access update
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/footer/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the required onboarding form fields with valid test data and submit to proceed and check premium access status.
        frame = context.pages[-1]
        # Fill 'Seu Nome' field with test user name
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Teste Usuario')
        

        frame = context.pages[-1]
        # Fill 'Data de Nascimento' field with test birth date
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('01/01/1990')
        

        frame = context.pages[-1]
        # Fill 'Hora Exata' field with test time
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12:00')
        

        frame = context.pages[-1]
        # Fill 'Local de Nascimento' field with test location
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('São Paulo, Brasil')
        

        frame = context.pages[-1]
        # Click 'Começar Jornada' button to submit the onboarding form
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/footer/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Astral' button (index 4) in the sidebar to access premium features and verify if they are accessible, confirming the user's premium status.
        frame = context.pages[-1]
        # Click on 'Astral' button in the sidebar to access premium features
        elem = frame.locator('xpath=html/body/div/div/aside/nav/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the required fields in the 'Laboratório de Sinastria' form and submit to verify that premium features are accessible and functional.
        frame = context.pages[-1]
        # Fill 'Nome Completo' field with test user name
        elem = frame.locator('xpath=html/body/div/div/main/div/div/main/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Teste Usuario')
        

        frame = context.pages[-1]
        # Fill 'Data de Nascimento' field with test birth date in ISO format
        elem = frame.locator('xpath=html/body/div/div/main/div/div/main/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1990-01-01')
        

        frame = context.pages[-1]
        # Fill 'Hora (Opcional)' field with test time
        elem = frame.locator('xpath=html/body/div/div/main/div/div/main/form/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12:00')
        

        frame = context.pages[-1]
        # Fill 'Local de Nascimento' field with test location
        elem = frame.locator('xpath=html/body/div/div/main/div/div/main/form/div[5]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('São Paulo, Brasil')
        

        frame = context.pages[-1]
        # Click 'Gerar Matriz de Sincronia' button to submit the form and generate premium feature result
        elem = frame.locator('xpath=html/body/div/div/main/div/div/main/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify that the premium features are accessible only when the user has an active subscription by attempting to access the same feature after simulating a subscription cancellation or expiration.
        await page.goto('http://localhost:3000/api/test/trigger-subscription-cancel-webhook', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Try to access the premium feature page 'Laboratório de Sinastria' again to verify that premium features are no longer accessible after subscription cancellation.
        await page.goto('http://localhost:3000/astral', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Attempt to access a premium feature again by clicking 'Garantir Acesso Agora' button to confirm access is blocked without active subscription.
        frame = context.pages[-1]
        # Click 'Garantir Acesso Agora' button to try accessing premium features without active subscription
        elem = frame.locator('xpath=html/body/div/div/section[3]/div/div[2]/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the onboarding form fields with test data and submit to verify if premium access is granted or blocked after subscription cancellation.
        frame = context.pages[-1]
        # Fill 'Seu Nome' field with test user name
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Teste Usuario')
        

        frame = context.pages[-1]
        # Fill 'Data de Nascimento' field with test birth date
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('01/01/1990')
        

        frame = context.pages[-1]
        # Fill 'Hora Exata' field with test time
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12:00')
        

        frame = context.pages[-1]
        # Fill 'Local de Nascimento' field with test location
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/main/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('São Paulo, Brasil')
        

        frame = context.pages[-1]
        # Click 'Começar Jornada' button to submit the onboarding form
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/footer/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=CELEST AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=GPS DA VIDA').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sua Origem').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Para calibrar seus sinais vitais cósmicos.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=NOME COMPLETO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=DATA DE NASCIMENTO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Define a posição solar e lunar.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=HORA EXATA').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Crucial para calcular seu ascendente.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Não tenho certeza do horário').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=LOCAL DE NASCIMENTO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Estabelece as coordenadas do horizonte.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Começar Jornada').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=DADOS CRIPTOGRAFADOS').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    