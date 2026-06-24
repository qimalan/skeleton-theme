class VariantSelects extends HTMLElement {
  connectedCallback() {
    this.form = this.closest('form');
    this.root = this.closest('[data-product-root]') || this.form;
    this.variantData = this.querySelector('[type="application/json"]');
    this.hiddenInput = this.form ? this.form.querySelector('[name="id"]') : null;
    this.submitButton = this.form ? this.form.querySelector('[type="submit"][name="add"]') : null;
    this.status = this.root ? this.root.querySelector('[data-variant-status]') : null;
    this.priceContainer = this.root ? this.root.querySelector('[data-price]') : null;
    this.priceCurrent = this.priceContainer ? this.priceContainer.querySelector('[data-price-current]') : null;
    this.priceCompare = this.priceContainer ? this.priceContainer.querySelector('[data-price-compare]') : null;
    this.sku = this.root ? this.root.querySelector('[data-variant-sku]') : null;
    this.statusAvailableText = this.status ? this.status.dataset.availableText || '' : '';
    this.statusUnavailableText = this.status ? this.status.dataset.unavailableText || '' : '';
    this.statusLowStockText = this.status ? this.status.dataset.lowStockText || '' : '';
    this.lowInventoryThreshold = this.status ? Number(this.status.dataset.lowInventoryThreshold || 0) : 0;
    this.skuLabel = this.sku ? this.sku.dataset.skuLabel || '' : '';
    this.addText = this.submitButton ? this.submitButton.dataset.addText || '' : '';
    this.soldOutText = this.submitButton ? this.submitButton.dataset.soldOutText || '' : '';
    this.variantDataList = [];

    if (this.variantData) {
      try {
        this.variantDataList = JSON.parse(this.variantData.textContent);
      } catch (error) {
        this.variantDataList = [];
      }
    }

    this.addEventListener('change', () => this.updateVariant());
    this.updateVariant();
  }

  get selectedOptions() {
    return Array.from(this.querySelectorAll('select')).map((select) => select.value);
  }

  updateVariant() {
    const matchedVariant = this.variantDataList.find((variant) =>
      variant.options.every((option, index) => option === this.selectedOptions[index])
    );

    if (!matchedVariant) {
      if (this.hiddenInput) this.hiddenInput.value = '';
      if (this.submitButton) this.submitButton.disabled = true;
      if (this.submitButton && this.soldOutText) this.submitButton.textContent = this.soldOutText;
      if (this.status) this.status.textContent = this.statusUnavailableText;
      if (this.sku) {
        this.sku.classList.add('visually-hidden');
        this.sku.textContent = '';
      }
      return;
    }

    if (this.hiddenInput) this.hiddenInput.value = matchedVariant.id;
    if (this.submitButton) {
      this.submitButton.disabled = matchedVariant.available === false;
      this.submitButton.textContent = matchedVariant.available ? this.addText : this.soldOutText;
    }
    if (this.status) {
      this.status.textContent = this.getInventoryText(matchedVariant);
    }
    if (this.sku) {
      this.sku.classList.toggle('visually-hidden', !matchedVariant.sku);
      this.sku.textContent = matchedVariant.sku ? `${this.skuLabel}: ${matchedVariant.sku}` : '';
    }
    if (this.priceCurrent) {
      this.priceCurrent.textContent = matchedVariant.price;
    }
    if (this.priceCompare) {
      if (matchedVariant.compareAtPrice) {
        this.priceCompare.hidden = false;
        this.priceCompare.textContent = matchedVariant.compareAtPrice;
      } else {
        this.priceCompare.hidden = true;
      }
    }
    if (this.priceContainer) {
      this.priceContainer.classList.toggle('price--sold-out', matchedVariant.available === false);
      this.priceContainer.classList.toggle(
        'price--sale',
        Boolean(matchedVariant.compareAtPrice) && matchedVariant.compareAtPrice !== matchedVariant.price
      );
    }
  }

  getInventoryText(variant) {
    if (!variant.available) return this.statusUnavailableText;

    const quantity = Number(variant.inventoryQuantity || 0);
    const isManaged = variant.inventoryManagement === 'shopify';
    const isLowStock =
      isManaged &&
      variant.inventoryPolicy !== 'continue' &&
      quantity > 0 &&
      this.lowInventoryThreshold > 0 &&
      quantity <= this.lowInventoryThreshold;

    if (isLowStock && this.statusLowStockText) {
      return this.statusLowStockText.replace('[count]', quantity);
    }

    return this.statusAvailableText;
  }
}

class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('[data-predictive-search-input]');
    this.results = this.querySelector('[data-predictive-search-results]');
    this.url = this.dataset.url;
    this.abortController = null;
    this.activeIndex = -1;

    if (!this.input || !this.results || !this.url) return;

    this.input.addEventListener('input', () => this.queueSearch());
    this.input.addEventListener('keydown', (event) => this.handleKeydown(event));
    this.results.addEventListener('keydown', (event) => this.handleKeydown(event));
  }

  queueSearch() {
    window.clearTimeout(this.searchTimeout);
    this.searchTimeout = window.setTimeout(() => this.search(), 180);
  }

  async search() {
    const term = this.input.value.trim();

    if (term.length < 2) {
      this.results.innerHTML = '';
      return;
    }

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
    this.setAttribute('loading', '');

    try {
      const response = await fetch(`${this.url}?q=${encodeURIComponent(term)}&section_id=predictive-search`, {
        signal: this.abortController.signal,
        headers: { Accept: 'text/html' },
      });

      if (!response.ok) throw new Error(response.status);

      const text = await response.text();
      const html = new DOMParser().parseFromString(text, 'text/html');
      const section = html.querySelector('#shopify-section-predictive-search');
      this.results.innerHTML = section ? section.innerHTML : '';
      this.activeIndex = -1;
    } catch (error) {
      if (error.name !== 'AbortError') this.results.innerHTML = '';
    } finally {
      this.removeAttribute('loading');
    }
  }

  get items() {
    return Array.from(this.results.querySelectorAll('[data-predictive-search-item]'));
  }

  handleKeydown(event) {
    const items = this.items;

    if (event.key === 'Escape') {
      this.results.innerHTML = '';
      this.closest('details')?.removeAttribute('open');
      this.input.focus();
      return;
    }

    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % items.length;
      items[this.activeIndex].focus();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = this.activeIndex <= 0 ? items.length - 1 : this.activeIndex - 1;
      items[this.activeIndex].focus();
    }
  }
}

class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.panel = this.querySelector('.cart-drawer__panel');
    this.items = this.querySelector('[data-cart-items]');
    this.footer = this.querySelector('[data-cart-footer]');
    this.subtotal = this.querySelector('[data-cart-subtotal]');
    this.status = this.querySelector('[data-cart-status]');
    this.cartUrl = this.dataset.cartUrl || '/cart';
    this.changeUrl = this.dataset.cartChangeUrl || '/cart/change';
    this.sectionId = this.dataset.sectionId || 'cart-drawer';
    this.changeTimeout = null;
    this.previousFocus = null;
    this.focusableSelectors = [
      'a[href]:not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      'input:not([type="hidden"]):not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    this.boundClick = (event) => this.handleDocumentClick(event);
    this.boundSubmit = (event) => this.handleDocumentSubmit(event);
    this.boundKeydown = (event) => this.handleKeydown(event);
    this.boundChange = (event) => this.handleChange(event);

    document.addEventListener('click', this.boundClick);
    document.addEventListener('submit', this.boundSubmit);
    document.addEventListener('keydown', this.boundKeydown);
    this.addEventListener('change', this.boundChange);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.boundClick);
    document.removeEventListener('submit', this.boundSubmit);
    document.removeEventListener('keydown', this.boundKeydown);
    this.removeEventListener('change', this.boundChange);
  }

  handleDocumentClick(event) {
    const openButton = event.target.closest('[data-cart-open]');
    const closeButton = event.target.closest('[data-cart-close]');

    if (openButton) {
      event.preventDefault();
      this.open();
      return;
    }

    if (closeButton) {
      event.preventDefault();
      this.close();
      return;
    }

    const removeButton = event.target.closest('[data-cart-remove]');
    if (removeButton && this.contains(removeButton)) {
      event.preventDefault();
      const item = removeButton.closest('[data-line-key]');
      if (item) this.changeLine(item.dataset.lineKey, 0);
    }
  }

  handleDocumentSubmit(event) {
    const form = event.target.closest('form[data-type="add-to-cart-form"]');
    if (!form) return;

    if (event.submitter && event.submitter.name !== 'add') return;

    event.preventDefault();
    this.addItem(form);
  }

  handleChange(event) {
    const input = event.target.closest('[data-cart-quantity]');
    if (!input) return;

    const item = input.closest('[data-line-key]');
    if (!item) return;

    window.clearTimeout(this.changeTimeout);
    this.changeTimeout = window.setTimeout(() => {
      this.changeLine(item.dataset.lineKey, Number(input.value));
    }, 300);
  }

  handleKeydown(event) {
    if (!this.classList.contains('is-open')) return;

    if (event.key === 'Tab') {
      this.trapFocus(event);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  trapFocus(event) {
    if (!this.panel) return;

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      this.panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (!this.contains(activeElement) || activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      return;
    }

    if (!this.contains(activeElement) || activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  getFocusableElements() {
    if (!this.panel) return [];

    return Array.from(this.panel.querySelectorAll(this.focusableSelectors)).filter(
      (element) => element.getClientRects().length > 0
    );
  }

  async addItem(form) {
    const button = form.querySelector('[type="submit"][name="add"]');
    if (button) button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error(response.status);

      await this.refreshFromSection(true);
    } catch (error) {
      if (this.status) this.status.textContent = '';
      form.submit();
    } finally {
      if (button) button.disabled = false;
    }
  }

  async changeLine(key, quantity) {
    const response = await fetch(this.changeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });

    if (!response.ok) return;

    await this.refreshFromSection(this.classList.contains('is-open'));
  }

  async refreshFromSection(openAfterRefresh = false) {
    const activeElement = document.activeElement;
    const focusOrigin =
      this.previousFocus && document.contains(this.previousFocus)
        ? this.previousFocus
        : activeElement && document.contains(activeElement) && !this.contains(activeElement)
          ? activeElement
          : document.querySelector('[data-cart-open]') || document.body;
    const response = await fetch(`${this.cartUrl}?section_id=${encodeURIComponent(this.sectionId)}`, {
      headers: { Accept: 'text/html' },
    });

    if (!response.ok) return null;

    const text = await response.text();
    const html = new DOMParser().parseFromString(text, 'text/html');
    const nextDrawer = html.querySelector('[data-cart-drawer]');

    if (!nextDrawer) return null;

    this.updateCartCount(nextDrawer.dataset.cartItemCount);
    this.outerHTML = nextDrawer.outerHTML;
    const replacement = document.querySelector('[data-cart-drawer]');

    if (replacement && openAfterRefresh) {
      replacement.open(focusOrigin);
    }

    return replacement;
  }

  updateCartCount(count) {
    const itemCount = Number(count || 0);
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
      element.textContent = itemCount;
      element.hidden = itemCount === 0;
    });
  }

  open(focusOrigin = document.activeElement) {
    this.previousFocus = focusOrigin;
    this.classList.add('is-open');
    document.documentElement.classList.add('cart-drawer-open');
    if (this.panel) this.panel.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => {
      this.querySelector('[data-cart-close]')?.focus();
    }, 0);
  }

  close() {
    this.classList.remove('is-open');
    document.documentElement.classList.remove('cart-drawer-open');
    if (this.panel) this.panel.setAttribute('aria-hidden', 'true');
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }
}

class ProductMediaGallery extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector('[data-media-modal]');
    this.addEventListener('click', (event) => this.handleClick(event));
  }

  handleClick(event) {
    const openButton = event.target.closest('[data-media-modal-open]');
    const closeButton = event.target.closest('[data-media-modal-close]');

    if (openButton) {
      event.preventDefault();
      this.openModal(openButton.dataset.mediaIndex);
    }

    if (closeButton) {
      event.preventDefault();
      this.closeModal();
    }
  }

  openModal(index) {
    if (!this.dialog) return;

    if (!this.dialog.open) this.dialog.showModal();

    const item = this.dialog.querySelector(`[data-media-slide="${index}"]`);
    if (item) {
      window.setTimeout(() => item.scrollIntoView({ block: 'start' }), 0);
    }
  }

  closeModal() {
    if (!this.dialog) return;

    this.dialog.close();
  }
}

if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', VariantSelects);
}

if (!customElements.get('predictive-search')) {
  customElements.define('predictive-search', PredictiveSearch);
}

if (!customElements.get('cart-drawer')) {
  customElements.define('cart-drawer', CartDrawer);
}

if (!customElements.get('product-media-gallery')) {
  customElements.define('product-media-gallery', ProductMediaGallery);
}
