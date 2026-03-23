import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('CRUD Operations Validation', () => {

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`PAGE LOG [${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto(BASE_URL);
  });

  test('News CRUD', async ({ page }) => {
    await page.click('button:has-text("News")');
    await expect(page.locator('h2').filter({ hasText: 'Noticias y Actualidad' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nueva Noticia")');
    await page.fill('#news-title', 'Test News Title');
    await page.fill('textarea', 'Test News Content');

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
    });

    await page.click('button:has-text("Publicar Noticia")');
    await expect(page.locator('td:has-text("Test News Title")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test News Title")').first().locator('button').first().click(); // Edit button
    await page.fill('#news-title', 'Updated News Title');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated News Title")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated News Title")').first().locator('button').last().click(); // Delete button
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated News Title")')).not.toBeVisible();
  });

  test('Clubes CRUD', async ({ page }) => {
    await page.click('button:has-text("Clubes")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Clubes' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nuevo Club")');
    await page.fill('#club-name', 'Test Club');
    await page.fill('input[placeholder*="Santo Domingo"]', 'Test Location');
    await page.click('button:has-text("Guardar Club")');
    await expect(page.locator('td:has-text("Test Club")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Club")').first().hover();
    await page.locator('tr:has-text("Test Club")').first().locator('button[title="Editar"]').click();
    await page.fill('#club-name', 'Updated Club');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Club")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Club")').first().hover();
    await page.locator('tr:has-text("Updated Club")').first().locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Club")')).not.toBeVisible();
  });

  test('Colegios CRUD', async ({ page }) => {
    await page.click('button:has-text("Colegios")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Colegios' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nuevo Colegio")');
    await page.fill('#school-name', 'Test Colegio');
    await page.fill('input[placeholder*="120"]', '50');
    await page.click('button:has-text("Guardar Colegio")');
    await expect(page.locator('td:has-text("Test Colegio")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Colegio")').first().hover();
    await page.locator('tr:has-text("Test Colegio")').first().locator('button[title="Editar"]').click();
    await page.fill('#school-name', 'Updated Colegio');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Colegio")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Colegio")').first().hover();
    await page.locator('tr:has-text("Updated Colegio")').first().locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Colegio")')).not.toBeVisible();
  });

  test('Entrenadores CRUD', async ({ page }) => {
    await page.click('button:has-text("Entrenadores")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Entrenadores' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nuevo Entrenador")');
    await page.fill('#coach-name', 'Test Coach');
    await page.fill('input[placeholder*="carlos@luntu.com"]', 'testcoach@example.com');
    await page.click('button:has-text("Guardar Entrenador")');
    await expect(page.locator('td:has-text("Test Coach")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Coach")').first().hover();
    await page.locator('tr:has-text("Test Coach")').first().locator('button[title="Editar"]').click();
    await page.fill('#coach-name', 'Updated Coach');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Coach")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Coach")').first().hover();
    await page.locator('tr:has-text("Updated Coach")').first().locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Coach")')).not.toBeVisible();
  });

  test('Categorías CRUD', async ({ page }) => {
    await page.click('button:has-text("Categorías")');
    await expect(page.locator('h2').filter({ hasText: 'Categorías Deportivas' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nueva Categoría")');
    await page.fill('#category-name', 'Test Category');
    const select = page.locator('select').last();
    await expect(select.locator('option')).not.toHaveCount(0, { timeout: 10000 });
    await select.selectOption({ index: 0 });
    await page.click('button:has-text("Guardar Categoría")');
    await expect(page.locator('td:has-text("Test Category")').first()).toBeVisible({ timeout: 10000 });

    // Update
    await page.locator('tr:has-text("Test Category")').first().locator('.edit-category-btn').click();
    await page.fill('#category-name', 'Updated Category');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Category")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Category")').first().locator('button').last().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Category")')).not.toBeVisible();
  });

  test('Deportistas CRUD', async ({ page }) => {
    await page.locator('aside button:has-text("Deportistas")').click();
    await expect(page.locator('h2:has-text("Deportistas Destacados")')).toBeVisible({ timeout: 15000 });

    // Create
    await page.click('button:has-text("Nuevo Atleta")');
    await page.fill('input[placeholder*="Lucas Rivera"]', 'Test Athlete');
    await page.fill('input[placeholder*="15"]', '20');
    await page.click('button:has-text("Crear Atleta")');
    await expect(page.locator('td:has-text("Test Athlete")').first()).toBeVisible({ timeout: 10000 });

    // Update
    await page.locator('tr:has-text("Test Athlete")').first().locator('button:has-text("Editar")').click();
    await page.fill('input[placeholder*="Lucas Rivera"]', 'Updated Athlete');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Athlete")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Athlete")').first().locator('button:has-text("Eliminar")').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Athlete")')).not.toBeVisible();
  });

  test('Highlights CRUD', async ({ page }) => {
    await page.click('button:has-text("Highlights")');
    await expect(page.locator('h2').filter({ hasText: 'LUNTU Highlights' })).toBeVisible();

    // Create
    await page.click('button:has-text("Subir Video")');
    await page.selectOption('select', { index: 1 }); // Select first athlete
    await page.fill('#highlight-title', 'Test Highlight');
    await page.fill('input[placeholder*="https://"]', 'https://example.com/video');
    await page.click('button:has-text("Guardar Video")');
    await expect(page.locator('td:has-text("Test Highlight")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Highlight")').first().locator('button').first().click();
    await page.fill('#highlight-title', 'Updated Highlight');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Highlight")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Highlight")').first().locator('button').last().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Highlight")')).not.toBeVisible();
  });

  test('Agendas CRUD', async ({ page }) => {
    await page.click('button:has-text("Agendas")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Agendas' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nueva Agenda")');
    await page.fill('#agenda-title', 'Test Event');
    await page.fill('input[type="date"]', '2025-12-31');
    await page.fill('input[type="time"]', '10:00');
    await page.fill('input[placeholder*="Cancha 1"]', 'Test Location');
    await page.click('button:has-text("Guardar Agenda")');
    await expect(page.locator('td:has-text("Test Event")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Event")').first().hover();
    await page.locator('tr:has-text("Test Event")').first().locator('button[title="Editar"]').click();
    await page.fill('#agenda-title', 'Updated Event');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Event")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Event")').first().hover();
    await page.locator('tr:has-text("Updated Event")').first().locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Event")')).not.toBeVisible();
  });

  test('Suscripciones CRUD', async ({ page }) => {
    await page.click('button:has-text("Suscripciones")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Suscripciones' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nueva Suscripción")');
    await page.fill('#subscription-entity', 'Test Entity');
    await page.fill('input[placeholder*="Premium Anual"]', 'Test Plan');
    await page.fill('input[placeholder*="0.00"]', '100');
    await page.click('button:has-text("Guardar Suscripción")');
    await expect(page.locator('td:has-text("Test Entity")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Entity")').first().hover();
    await page.locator('tr:has-text("Test Entity")').first().locator('button[title="Editar"]').click();
    await page.fill('#subscription-entity', 'Updated Entity');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Entity")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Entity")').first().hover();
    await page.locator('tr:has-text("Updated Entity")').first().locator('button[title="Eliminar"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Entity")')).not.toBeVisible();
  });

  test('Entrevistas CRUD', async ({ page }) => {
    await page.locator('aside button:has-text("Entrevistas")').click();
    await expect(page.locator('h2:has-text("Entrevistas Exclusivas")')).toBeVisible();

    // Create
    await page.click('button:has-text("Crear Entrevista")');
    await page.fill('#interview-title', 'Test Interview');
    await page.fill('#interview-person', 'Test Person');
    await page.fill('#interview-date', '2025-12-31');
    await page.fill('textarea', 'Test Content');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
    });

    await expect(page.locator('img[alt="Preview"]')).toBeVisible({ timeout: 10000 });
    // Wait for state to catch up
    await page.waitForTimeout(1000);
    const saveBtn = page.locator('button:has-text("Guardar Entrevista")');
    await expect(saveBtn).toBeEnabled({ timeout: 10000 });
    await saveBtn.click();
    await expect(page.locator('td:has-text("Test Interview")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Interview")').first().locator('button').nth(1).click();
    await page.fill('#interview-title', 'Updated Interview');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Interview")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Interview")').first().locator('button').last().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Interview")')).not.toBeVisible();
  });

  test('Guía para Padres CRUD', async ({ page }) => {
    await page.click('button:has-text("Guía para Padres")');
    await expect(page.locator('h2').filter({ hasText: 'Guía para Padres' })).toBeVisible();

    // Create
    await page.click('button:has-text("Nuevo Artículo")');
    await page.fill('#guide-title', 'Test Article');
    await page.fill('input[placeholder*="Dra. María Gómez"]', 'Test Author');
    await page.fill('input[type="date"]', '2025-12-31');
    await page.fill('textarea', 'Test Content');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
    });

    await page.click('button:has-text("Guardar Artículo")');
    await expect(page.locator('td:has-text("Test Article")').first()).toBeVisible();

    // Update
    await page.locator('tr:has-text("Test Article")').first().locator('button').first().click();
    await page.fill('#guide-title', 'Updated Article');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Article")').first()).toBeVisible();

    // Delete
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Article")').first().locator('button').last().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Article")')).not.toBeVisible();
  });

  test('Publicidad CRUD', async ({ page }) => {
    await page.click('button:has-text("Publicidad")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Publicidad' })).toBeVisible();

    // Create Client
    await page.click('button:has-text("Nuevo Cliente")');
    await page.fill('#client-name', 'Test Client');
    await page.fill('input[placeholder*="correo@empresa.com"]', 'test@client.com');
    await page.click('button:has-text("Guardar Cliente")');
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Test Client")').first()).toBeVisible();

    // Update Client
    await page.locator('tr:has-text("Test Client")').first().locator('button[title="Editar Cliente"]').click();
    await page.fill('#client-name', 'Updated Client');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Client")').first()).toBeVisible();

    // Create Campaign
    await page.click('button:has-text("Nueva Campaña")');
    await page.selectOption('select', { label: 'Updated Client' });
    await page.fill('#campaign-title', 'Test Campaign');
    await page.fill('input[type="date"]', '2025-01-01');
    await page.locator('input[type="date"]').nth(1).fill('2025-12-31');
    await page.fill('input[placeholder="0.00"]', '1000');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
    });

    await page.click('button:has-text("Crear Campaña")');
    await expect(page.locator('td:has-text("Test Campaign")').first()).toBeVisible();

    // Update Campaign
    await page.locator('tr:has-text("Test Campaign")').first().locator('button[title="Editar Campaña"]').click();
    await page.fill('#campaign-title', 'Updated Campaign');
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator('td:has-text("Updated Campaign")').first()).toBeVisible();

    // Delete Campaign
    page.on('dialog', dialog => dialog.accept());
    await page.locator('tr:has-text("Updated Campaign")').first().locator('button[title="Eliminar Campaña"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Campaign")')).not.toBeVisible();

    // Delete Client
    await page.locator('tr:has-text("Updated Client")').first().locator('button[title="Eliminar Cliente"]').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('td:has-text("Updated Client")')).not.toBeVisible();
  });

  test('Solicitudes Registration Update', async ({ page }) => {
    await page.click('button:has-text("Solicitudes")');
    await expect(page.locator('h2').filter({ hasText: 'Gestión de Solicitudes' })).toBeVisible();

    // Find a pending request
    await page.click('button:has-text("Pendientes")');
    if (await page.locator('tr').count() > 1) {
        const name = await page.locator('tr').nth(1).locator('td').first().locator('span').first().textContent();
        await page.locator('tr').nth(1).locator('button[title="Ver Detalles"]').click();
        await page.click('button:has-text("Aprobar Solicitud")');
        await expect(page.locator('div:has-text("Solicitud aprobada exitosamente")')).toBeVisible();

        await page.click('button:has-text("Aprobadas")');
        await expect(page.locator(`td:has-text("${name}")`)).toBeVisible();
    }
  });

});
