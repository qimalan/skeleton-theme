class VariantSelects extends HTMLElement {
  connectedCallback() {
    this.form = this.closest('form');
    this.variantData = this.querySelector('[type="application/json"]');
    this.hiddenInput = this.form ? this.form.querySelector('[name="id"]') : null;
    this.submitButton = this.form ? this.form.querySelector('[type="submit"][name="add"]') : null;
    this.status = this.querySelector('[data-variant-status]');
    this.statusAvailableText = this.status ? this.status.dataset.availableText || '' : '';
    this.statusUnavailableText = this.status ? this.status.dataset.unavailableText || '' : '';
    this.variantDataList = this.variantData ? JSON.parse(this.variantData.textContent) : [];
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
      if (this.status) this.status.textContent = this.statusUnavailableText;
      return;
    }

    if (this.hiddenInput) this.hiddenInput.value = matchedVariant.id;
    if (this.submitButton) this.submitButton.disabled = matchedVariant.available === false;
    if (this.status) {
      this.status.textContent = matchedVariant.available ? this.statusAvailableText : this.statusUnavailableText;
    }
  }
}

if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', VariantSelects);
}
