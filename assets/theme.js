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
    this.statusAvailableText = this.status ? this.status.dataset.availableText || '' : '';
    this.statusUnavailableText = this.status ? this.status.dataset.unavailableText || '' : '';
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
      return;
    }

    if (this.hiddenInput) this.hiddenInput.value = matchedVariant.id;
    if (this.submitButton) {
      this.submitButton.disabled = matchedVariant.available === false;
      this.submitButton.textContent = matchedVariant.available ? this.addText : this.soldOutText;
    }
    if (this.status) {
      this.status.textContent = matchedVariant.available ? this.statusAvailableText : this.statusUnavailableText;
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
}

if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', VariantSelects);
}
