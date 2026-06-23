# Skeleton Framework

A lightweight Shopify theme starter for solo freelance builds.

## What it ships with

- Clean global layout and theme settings
- Header announcement bar and footer newsletter defaults
- Image banner, multicolumn trust blocks, rich text, FAQ, contact, and custom liquid sections
- Reusable product and collection cards
- Predictive search, cart drawer, and quick add for simple product cards
- Basic storefront filtering and pagination
- Product page with media gallery, dynamic checkout, SKU/inventory sync, payment icons, and reusable info blocks
- Metafield content section for product, collection, page, and article dynamic content
- App blocks section and country/language localization selectors
- Cart, search, blog, article, password, gift card, and collection templates
- Minimal CSS-first implementation with a tiny variant sync script

## Start

```bash
shopify theme dev
```

## Customer accounts

The theme relies on Shopify-hosted customer accounts by default. Keep account links pointed at Shopify routes such as `routes.account_url`; only add `templates/customers/*` if a project explicitly uses classic customer accounts.

## Dynamic content

Use the Metafield content section for simple product, collection, page, and article metafields. For metaobject references, set the namespace/key and provide the single-line text field to render, such as `name`.

## Notes

- Keep shared behavior in snippets
- Prefer CSS over JS whenever possible
- Use Dawn as a reference for edge cases and richer interactions
- Add project-specific polish in sections before introducing global abstractions
