/**
 * InvoiceSpark — invoice-generator.js
 * Renders five premium invoice templates into the live preview panel.
 * Each template is pure HTML/CSS inserted into #invoicePreview.
 */

'use strict';

const { formatCurrency, formatDate, nl2br, escapeHtml } = window.InvoiceUtils;

/* ─── Shared sub-renderers ─── */

/**
 * Render line items table rows
 */
function renderTableRows(items, currency) {
  if (!items.length) {
    return `<tr><td colspan="4" style="text-align:center; color:#bbb; padding:24px 0; font-size:13px; font-style:italic;">No items added yet</td></tr>`;
  }
  return items.map(item => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const lineTotal = qty * price;
    return `
      <tr>
        <td>
          <span class="item-desc">${escapeHtml(item.description) || '<span style="color:#bbb;font-style:italic">No description</span>'}</span>
        </td>
        <td><span class="item-qty">${qty}</span></td>
        <td><span class="item-price">${formatCurrency(price, currency)}</span></td>
        <td><span class="item-price" style="font-weight:600">${formatCurrency(lineTotal, currency)}</span></td>
      </tr>`;
  }).join('');
}

/**
 * Render totals block
 */
function renderTotals(data, accentColor) {
  const { subtotal, taxAmount, total, currency, taxRate } = data;
  return `
    <div class="inv-totals">
      <div class="inv-totals-row">
        <span class="inv-total-label">Subtotal</span>
        <span class="inv-amount">${formatCurrency(subtotal, currency)}</span>
      </div>
      ${taxRate > 0 ? `
      <div class="inv-totals-row">
        <span class="inv-total-label">Tax (${taxRate}%)</span>
        <span class="inv-amount">${formatCurrency(taxAmount, currency)}</span>
      </div>` : ''}
      <div class="inv-totals-row" style="border-top: 2px solid ${accentColor}; margin-top:4px; padding-top:12px;">
        <span style="font-weight:700; font-size:15px; text-transform:uppercase; letter-spacing:0.06em;">Total Due</span>
        <span class="inv-total-amount inv-amount" style="color:${accentColor}; font-size:20px; font-family:'DM Mono',monospace; font-weight:700;">${formatCurrency(total, currency)}</span>
      </div>
    </div>`;
}

/**
 * Render notes block
 */
function renderNotes(notes, terms) {
  if (!notes && !terms) return '';
  return `
    <div class="inv-notes">
      ${notes ? `<h4>Notes</h4><p>${nl2br(notes)}</p>` : ''}
      ${terms ? `<h4 style="margin-top:${notes ? '12px' : '0'}">Payment Terms</h4><p style="font-family:'DM Mono',monospace; font-size:12px;">${escapeHtml(terms)}</p>` : ''}
    </div>`;
}

/**
 * Render logo or brand name
 */
function renderBrandOrLogo(logoSrc, brandName, opts = {}) {
  const { size = '26px', color = '#0f0f1a', logoMax = '52px' } = opts;
  if (logoSrc) {
    return `<img src="${logoSrc}" alt="Logo" style="max-height:${logoMax}; max-width:180px; object-fit:contain; display:block;" />`;
  }
  if (brandName) {
    return `<div style="font-family:'Playfair Display',serif; font-size:${size}; font-weight:700; color:${color}; letter-spacing:-0.02em; line-height:1.1;">${escapeHtml(brandName)}</div>`;
  }
  return `<div style="font-family:'Playfair Display',serif; font-size:20px; color:#ccc; font-style:italic;">Your Business Name</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 1: MINIMAL
   Pure white, generous spacing, thin lines, elegant typography
   ═══════════════════════════════════════════════════════════════ */
function templateMinimal(data) {
  const { accentColor } = data;
  return `
  <div class="invoice-template-minimal" id="invoiceInner">
    <!-- Header -->
    <div class="inv-header">
      <div>
        ${renderBrandOrLogo(data.logoSrc, data.fromName)}
        ${data.fromEmail ? `<div style="font-size:12px; color:#999; margin-top:4px;">${escapeHtml(data.fromEmail)}</div>` : ''}
      </div>
      <div style="text-align:right;">
        <div style="font-family:'DM Mono',monospace; font-size:11px; color:#999; text-transform:uppercase; letter-spacing:0.15em;">Invoice</div>
        <div style="font-family:'DM Mono',monospace; font-size:22px; font-weight:500; color:${accentColor}; letter-spacing:0.02em;">${escapeHtml(data.invoiceNumber) || 'INV-001'}</div>
      </div>
    </div>

    <!-- Accent Line -->
    <div style="height:2px; background:${accentColor}; width:100%; margin-bottom:36px; border-radius:99px;"></div>

    <!-- Meta: From / To / Dates -->
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:28px; margin-bottom:44px;">
      <div>
        <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#aaa; margin-bottom:8px;">From</div>
        <div style="font-size:13px; color:#333; line-height:1.7;">
          <div style="font-weight:600; color:#1a1a2e;">${escapeHtml(data.fromName) || '—'}</div>
          ${data.fromAddress ? `<div>${nl2br(data.fromAddress)}</div>` : ''}
          ${data.fromPhone ? `<div>${escapeHtml(data.fromPhone)}</div>` : ''}
        </div>
      </div>
      <div>
        <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#aaa; margin-bottom:8px;">Bill To</div>
        <div style="font-size:13px; color:#333; line-height:1.7;">
          <div style="font-weight:600; color:#1a1a2e;">${escapeHtml(data.toName) || '—'}</div>
          ${data.toCompany ? `<div>${escapeHtml(data.toCompany)}</div>` : ''}
          ${data.toEmail ? `<div>${escapeHtml(data.toEmail)}</div>` : ''}
          ${data.toAddress ? `<div>${nl2br(data.toAddress)}</div>` : ''}
        </div>
      </div>
      <div>
        <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#aaa; margin-bottom:8px;">Details</div>
        <div style="font-size:12px; line-height:1.8;">
          <div style="display:flex; justify-content:space-between; gap:8px;">
            <span style="color:#aaa;">Issued</span>
            <span style="font-family:'DM Mono',monospace; font-size:11.5px; color:#444;">${formatDate(data.issueDate) || '—'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; gap:8px;">
            <span style="color:#aaa;">Due</span>
            <span style="font-family:'DM Mono',monospace; font-size:11.5px; color:${accentColor}; font-weight:600;">${formatDate(data.dueDate) || '—'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="inv-items-table" style="--accent:${accentColor}">
      <thead>
        <tr>
          <th style="color:${accentColor};">Description</th>
          <th style="color:${accentColor}; text-align:right;">Qty</th>
          <th style="color:${accentColor}; text-align:right;">Unit Price</th>
          <th style="color:${accentColor}; text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${renderTableRows(data.items, data.currency)}
      </tbody>
    </table>

    ${renderTotals(data, accentColor)}
    ${renderNotes(data.notes, data.terms)}

    <!-- Footer -->
    <div class="inv-footer">
      <div class="inv-footer-terms">${data.terms ? escapeHtml(data.terms) : 'Thank you for your business'}</div>
      <div class="inv-footer-thank" style="color:${accentColor};">Thank you ✦</div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 2: MODERN
   Coloured header band, clean white body, bold numbers
   ═══════════════════════════════════════════════════════════════ */
function templateModern(data) {
  const { accentColor } = data;
  const textOnAccent = window.InvoiceUtils.isLightColor(accentColor) ? '#1a1a2e' : 'white';
  return `
  <div class="invoice-template-modern" id="invoiceInner">
    <!-- Colored Header Band -->
    <div class="inv-header-band" style="background:${accentColor};">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; position:relative; z-index:1;">
        <div>
          ${renderBrandOrLogo(data.logoSrc, data.fromName, { size:'28px', color: textOnAccent, logoMax:'52px' })}
          ${data.fromEmail ? `<div style="font-size:12px; color:${textOnAccent}; opacity:0.75; margin-top:4px;">${escapeHtml(data.fromEmail)}</div>` : ''}
          ${data.fromAddress ? `<div style="font-size:11px; color:${textOnAccent}; opacity:0.6; margin-top:4px; line-height:1.5;">${nl2br(data.fromAddress)}</div>` : ''}
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px; color:${textOnAccent}; opacity:0.6; text-transform:uppercase; letter-spacing:0.2em; font-weight:600;">Invoice</div>
          <div style="font-family:'DM Mono',monospace; font-size:28px; font-weight:700; color:${textOnAccent}; letter-spacing:0.01em; margin-top:2px;">${escapeHtml(data.invoiceNumber) || 'INV-001'}</div>
          <div style="font-size:11px; color:${textOnAccent}; opacity:0.6; margin-top:6px;">
            Issued: ${formatDate(data.issueDate) || '—'}
          </div>
          <div style="font-size:11px; color:${textOnAccent}; opacity:0.85; font-weight:600;">
            Due: ${formatDate(data.dueDate) || '—'}
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="inv-body">
      <!-- Bill To -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-bottom:36px;">
        <div>
          <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:${accentColor}; margin-bottom:8px; border-bottom:2px solid ${accentColor}; padding-bottom:4px; display:inline-block;">Bill To</div>
          <div style="font-size:14px; font-weight:700; color:#1a1a2e; margin-top:8px;">${escapeHtml(data.toName) || '—'}</div>
          ${data.toCompany ? `<div style="font-size:13px; color:#555;">${escapeHtml(data.toCompany)}</div>` : ''}
          ${data.toEmail ? `<div style="font-size:12px; color:#888;">${escapeHtml(data.toEmail)}</div>` : ''}
          ${data.toAddress ? `<div style="font-size:12px; color:#888; margin-top:4px; line-height:1.6;">${nl2br(data.toAddress)}</div>` : ''}
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:${accentColor}; margin-bottom:8px; border-bottom:2px solid ${accentColor}; padding-bottom:4px; display:inline-block;">Amount Due</div>
          <div style="font-family:'DM Mono',monospace; font-size:36px; font-weight:700; color:${accentColor}; line-height:1; margin-top:8px;">${formatCurrency(data.total, data.currency)}</div>
          <div style="font-size:11px; color:#aaa; margin-top:6px;">Due by ${formatDate(data.dueDate) || '—'}</div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="inv-items-table" style="--accent:${accentColor}">
        <thead>
          <tr>
            <th style="color:${accentColor}; border-bottom-color:${accentColor};">Description</th>
            <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Qty</th>
            <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Price</th>
            <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Total</th>
          </tr>
        </thead>
        <tbody>
          ${renderTableRows(data.items, data.currency)}
        </tbody>
      </table>

      ${renderTotals(data, accentColor)}
      ${renderNotes(data.notes, data.terms)}

      <div style="margin-top:28px; padding-top:20px; border-top:1px solid #f0f0f5; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:11px; color:#bbb; font-family:'DM Mono',monospace;">${data.terms || 'Payment due on receipt'}</div>
        <div style="font-family:'Playfair Display',serif; font-style:italic; font-size:13px; color:${accentColor};">Thank you ✦</div>
      </div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 3: ELEGANT
   Framed with corner ornaments, editorial luxury feel
   ═══════════════════════════════════════════════════════════════ */
function templateElegant(data) {
  const { accentColor } = data;
  return `
  <div class="invoice-template-elegant" id="invoiceInner">
    <div class="inv-elegant-border" style="border-color:${accentColor};">
      <!-- Corner ornaments -->
      <div class="inv-corner inv-corner-tl" style="border-color:${accentColor};"></div>
      <div class="inv-corner inv-corner-tr" style="border-color:${accentColor};"></div>
      <div class="inv-corner inv-corner-bl" style="border-color:${accentColor};"></div>
      <div class="inv-corner inv-corner-br" style="border-color:${accentColor};"></div>

      <!-- Elegant header -->
      <div style="text-align:center; margin-bottom:36px;">
        <div style="font-size:10px; letter-spacing:0.4em; text-transform:uppercase; color:${accentColor}; font-weight:600; margin-bottom:10px;">★ ─────── ★</div>
        <div style="font-family:'Playfair Display',serif; font-size:32px; font-weight:400; color:#1a1a2e; letter-spacing:0.04em;">INVOICE</div>
        <div style="font-family:'DM Mono',monospace; font-size:13px; color:${accentColor}; letter-spacing:0.2em; margin-top:4px;">${escapeHtml(data.invoiceNumber) || 'INV-001'}</div>
        <div style="height:1px; background:linear-gradient(90deg, transparent, ${accentColor}, transparent); margin:16px 0;"></div>
      </div>

      <!-- From / To side by side -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-bottom:36px;">
        <div>
          <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:${accentColor}; margin-bottom:10px;">From</div>
          <div style="font-family:'Playfair Display',serif; font-size:17px; font-weight:600; color:#1a1a2e; margin-bottom:4px;">${escapeHtml(data.fromName) || '—'}</div>
          <div style="font-size:12.5px; color:#666; line-height:1.7;">
            ${data.fromEmail ? `<div>${escapeHtml(data.fromEmail)}</div>` : ''}
            ${data.fromAddress ? `<div>${nl2br(data.fromAddress)}</div>` : ''}
            ${data.fromPhone ? `<div>${escapeHtml(data.fromPhone)}</div>` : ''}
          </div>
        </div>
        <div>
          <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:${accentColor}; margin-bottom:10px;">To</div>
          <div style="font-family:'Playfair Display',serif; font-size:17px; font-weight:600; color:#1a1a2e; margin-bottom:4px;">${escapeHtml(data.toName) || '—'}</div>
          <div style="font-size:12.5px; color:#666; line-height:1.7;">
            ${data.toCompany ? `<div>${escapeHtml(data.toCompany)}</div>` : ''}
            ${data.toEmail ? `<div>${escapeHtml(data.toEmail)}</div>` : ''}
            ${data.toAddress ? `<div>${nl2br(data.toAddress)}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Dates row -->
      <div style="display:flex; gap:32px; justify-content:flex-end; margin-bottom:28px;">
        <div style="text-align:right;">
          <div style="font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:0.15em;">Issue Date</div>
          <div style="font-family:'DM Mono',monospace; font-size:12px; color:#444; margin-top:2px;">${formatDate(data.issueDate) || '—'}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:0.15em;">Due Date</div>
          <div style="font-family:'DM Mono',monospace; font-size:12px; color:${accentColor}; font-weight:600; margin-top:2px;">${formatDate(data.dueDate) || '—'}</div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="inv-items-table">
        <thead>
          <tr>
            <th style="color:${accentColor}; border-bottom-color:${accentColor};">Description</th>
            <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Qty</th>
            <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Price</th>
            <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${renderTableRows(data.items, data.currency)}
        </tbody>
      </table>

      ${renderTotals(data, accentColor)}
      ${renderNotes(data.notes, data.terms)}

      <div style="text-align:center; margin-top:36px; padding-top:20px; border-top:1px solid #f0f0f5;">
        <div style="font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:${accentColor}; font-weight:600;">✦ ─── Thank You ─── ✦</div>
      </div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 4: BOLD
   Dark sidebar with white text, strong accent, impact numbers
   ═══════════════════════════════════════════════════════════════ */
function templateBold(data) {
  const { accentColor } = data;
  return `
  <div class="invoice-template-bold" id="invoiceInner">
    <div class="inv-sidebar">
      <!-- Dark Left Sidebar -->
      <div class="inv-sidebar-left" style="background:#0f0f1a;">
        <!-- Logo / Name -->
        <div style="margin-bottom:32px;">
          ${data.logoSrc
            ? `<img src="${data.logoSrc}" alt="Logo" style="max-height:44px; max-width:120px; object-fit:contain; margin-bottom:12px; filter:brightness(2);" />`
            : `<div style="font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:white; line-height:1.2; margin-bottom:4px;">${escapeHtml(data.fromName) || 'Your Business'}</div>`}
          ${data.fromEmail ? `<div style="font-size:10px; color:rgba(255,255,255,0.45); word-break:break-all;">${escapeHtml(data.fromEmail)}</div>` : ''}
          ${data.fromAddress ? `<div style="font-size:10px; color:rgba(255,255,255,0.35); margin-top:6px; line-height:1.6;">${nl2br(data.fromAddress)}</div>` : ''}
          ${data.fromPhone ? `<div style="font-size:10px; color:rgba(255,255,255,0.4); margin-top:4px;">${escapeHtml(data.fromPhone)}</div>` : ''}
        </div>

        <!-- Invoice Number -->
        <div style="margin-bottom:24px;">
          <div style="font-size:9px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.2em; margin-bottom:4px;">Invoice</div>
          <div style="font-family:'DM Mono',monospace; font-size:18px; font-weight:600; color:${accentColor};">${escapeHtml(data.invoiceNumber) || 'INV-001'}</div>
        </div>

        <!-- Dates -->
        <div style="margin-bottom:24px;">
          <div style="font-size:9px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.2em; margin-bottom:6px;">Issued</div>
          <div style="font-family:'DM Mono',monospace; font-size:11px; color:rgba(255,255,255,0.6);">${formatDate(data.issueDate) || '—'}</div>
        </div>
        <div style="margin-bottom:32px;">
          <div style="font-size:9px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.2em; margin-bottom:6px;">Due</div>
          <div style="font-family:'DM Mono',monospace; font-size:11px; color:${accentColor}; font-weight:600;">${formatDate(data.dueDate) || '—'}</div>
        </div>

        <!-- Bill To -->
        <div>
          <div style="font-size:9px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.2em; margin-bottom:8px;">Bill To</div>
          <div style="font-size:13px; font-weight:600; color:white; margin-bottom:2px;">${escapeHtml(data.toName) || '—'}</div>
          ${data.toCompany ? `<div style="font-size:11px; color:rgba(255,255,255,0.5);">${escapeHtml(data.toCompany)}</div>` : ''}
          ${data.toEmail ? `<div style="font-size:10px; color:rgba(255,255,255,0.4); margin-top:4px; word-break:break-all;">${escapeHtml(data.toEmail)}</div>` : ''}
          ${data.toAddress ? `<div style="font-size:10px; color:rgba(255,255,255,0.3); margin-top:4px; line-height:1.6;">${nl2br(data.toAddress)}</div>` : ''}
        </div>

        <!-- Total Amount pill at bottom of sidebar -->
        <div style="margin-top:auto; padding-top:36px;">
          <div style="font-size:9px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.2em; margin-bottom:6px;">Total Due</div>
          <div style="font-family:'DM Mono',monospace; font-size:22px; font-weight:700; color:${accentColor}; line-height:1;">${formatCurrency(data.total, data.currency)}</div>
        </div>
      </div>

      <!-- Right Content -->
      <div class="inv-sidebar-right">
        <!-- Big header -->
        <div style="border-bottom:3px solid ${accentColor}; padding-bottom:16px; margin-bottom:28px;">
          <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.25em; color:#aaa;">Invoice Statement</div>
          <div style="font-family:'Playfair Display',serif; font-size:36px; font-weight:700; color:#0f0f1a; letter-spacing:-0.02em; line-height:1; margin-top:4px;">INVOICE</div>
        </div>

        <!-- Items Table -->
        <table class="inv-items-table">
          <thead>
            <tr>
              <th style="color:${accentColor}; border-bottom-color:${accentColor};">Description</th>
              <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Qty</th>
              <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Price</th>
              <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Total</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(data.items, data.currency)}
          </tbody>
        </table>

        ${renderTotals(data, accentColor)}
        ${renderNotes(data.notes, data.terms)}

        <div style="margin-top:28px; padding-top:20px; border-top:1px solid #f0f0f5; font-family:'Playfair Display',serif; font-style:italic; color:${accentColor}; font-size:13px; text-align:right;">Thank you for your business ✦</div>
      </div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 5: LUXURY
   Warm premium feel, subtle gradient bg, ornate details
   ═══════════════════════════════════════════════════════════════ */
function templateLuxury(data) {
  const { accentColor } = data;
  const accentRgba = window.InvoiceUtils.hexToRgba(accentColor, 0.07);
  return `
  <div class="invoice-template-luxury" id="invoiceInner" style="background:linear-gradient(135deg, #fefefe 0%, ${accentRgba} 100%);">
    <!-- Luxury Top ornament -->
    <div style="text-align:center; margin-bottom:32px;">
      <div style="display:inline-flex; align-items:center; gap:12px;">
        <div style="height:1px; width:60px; background:linear-gradient(90deg, transparent, ${accentColor});"></div>
        <div style="width:8px; height:8px; background:${accentColor}; transform:rotate(45deg);"></div>
        <div style="font-size:9px; letter-spacing:0.4em; text-transform:uppercase; color:${accentColor}; font-weight:700;">Premium Invoice</div>
        <div style="width:8px; height:8px; background:${accentColor}; transform:rotate(45deg);"></div>
        <div style="height:1px; width:60px; background:linear-gradient(90deg, ${accentColor}, transparent);"></div>
      </div>
    </div>

    <!-- Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
      <div>
        ${renderBrandOrLogo(data.logoSrc, data.fromName, { size:'30px', color: '#0a0a14' })}
        ${data.fromEmail ? `<div style="font-size:12px; color:#888; margin-top:4px;">${escapeHtml(data.fromEmail)}</div>` : ''}
        ${data.fromAddress ? `<div style="font-size:11.5px; color:#999; margin-top:4px; line-height:1.6;">${nl2br(data.fromAddress)}</div>` : ''}
        ${data.fromPhone ? `<div style="font-size:11.5px; color:#999;">${escapeHtml(data.fromPhone)}</div>` : ''}
      </div>
      <div style="text-align:right;">
        <div style="font-family:'DM Mono',monospace; font-size:11px; color:#aaa; letter-spacing:0.2em; text-transform:uppercase;">Invoice Number</div>
        <div style="font-family:'Playfair Display',serif; font-size:28px; font-weight:600; color:${accentColor}; letter-spacing:0.02em;">${escapeHtml(data.invoiceNumber) || 'INV-001'}</div>
      </div>
    </div>

    <!-- Gold line -->
    <div style="height:2px; background:linear-gradient(90deg, ${accentColor}, ${window.InvoiceUtils.hexToRgba(accentColor, 0.2)}, transparent); border-radius:99px; margin:16px 0 32px;"></div>

    <!-- Billing info -->
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:28px; margin-bottom:36px;">
      <div>
        <div style="font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.25em; color:${accentColor}; margin-bottom:10px;">Bill To</div>
        <div style="font-family:'Playfair Display',serif; font-size:16px; font-weight:600; color:#1a1a2e; margin-bottom:4px;">${escapeHtml(data.toName) || '—'}</div>
        <div style="font-size:12.5px; color:#666; line-height:1.7;">
          ${data.toCompany ? `<div>${escapeHtml(data.toCompany)}</div>` : ''}
          ${data.toEmail ? `<div>${escapeHtml(data.toEmail)}</div>` : ''}
          ${data.toAddress ? `<div>${nl2br(data.toAddress)}</div>` : ''}
        </div>
      </div>
      <div>
        <div style="font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.25em; color:${accentColor}; margin-bottom:10px;">Issue Date</div>
        <div style="font-family:'DM Mono',monospace; font-size:13px; color:#444;">${formatDate(data.issueDate) || '—'}</div>
        <div style="font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.25em; color:${accentColor}; margin-bottom:10px; margin-top:16px;">Due Date</div>
        <div style="font-family:'DM Mono',monospace; font-size:13px; color:${accentColor}; font-weight:600;">${formatDate(data.dueDate) || '—'}</div>
      </div>
      <div style="text-align:right; display:flex; flex-direction:column; justify-content:center; align-items:flex-end;">
        <div style="font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.25em; color:${accentColor}; margin-bottom:8px;">Amount Due</div>
        <div style="font-family:'DM Mono',monospace; font-size:32px; font-weight:700; color:${accentColor}; line-height:1;">${formatCurrency(data.total, data.currency)}</div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="inv-items-table">
      <thead>
        <tr>
          <th style="color:${accentColor}; border-bottom-color:${accentColor};">Description</th>
          <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Qty</th>
          <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Unit Price</th>
          <th style="color:${accentColor}; text-align:right; border-bottom-color:${accentColor};">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${renderTableRows(data.items, data.currency)}
      </tbody>
    </table>

    ${renderTotals(data, accentColor)}
    ${renderNotes(data.notes, data.terms)}

    <!-- Luxury footer -->
    <div style="margin-top:36px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.08); text-align:center;">
      <div style="display:inline-flex; align-items:center; gap:10px;">
        <div style="height:1px; width:40px; background:linear-gradient(90deg, transparent, ${accentColor});"></div>
        <div style="font-family:'Playfair Display',serif; font-style:italic; font-size:14px; color:${accentColor};">Thank you for your business</div>
        <div style="height:1px; width:40px; background:linear-gradient(90deg, ${accentColor}, transparent);"></div>
      </div>
      ${data.terms ? `<div style="margin-top:8px; font-size:11px; color:#bbb; font-family:'DM Mono',monospace;">${escapeHtml(data.terms)}</div>` : ''}
    </div>
  </div>`;
}

/* ─── Template Map ─── */
const TEMPLATES = {
  minimal: templateMinimal,
  modern:  templateModern,
  elegant: templateElegant,
  bold:    templateBold,
  luxury:  templateLuxury
};

/**
 * Render an invoice template into the DOM
 * @param {string} templateName
 * @param {Object} data
 */
function renderInvoice(templateName, data) {
  const preview = document.getElementById('invoicePreview');
  if (!preview) return;

  // Build template class
  const cls = `invoice-template-${templateName}`;

  // Add switching animation
  preview.classList.add('template-switching');

  setTimeout(() => {
    // Set template CSS class
    preview.className = `invoice-preview-container ${cls}`;
    preview.innerHTML = TEMPLATES[templateName]?.(data) ?? TEMPLATES.minimal(data);
    preview.classList.remove('template-switching');
  }, 180);
}

/* ─── Export ─── */
window.InvoiceGenerator = { renderInvoice, TEMPLATES };
