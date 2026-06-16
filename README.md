# BREADBOX Shopify Theme

A buyer-focused Shopify Online Store 2.0 theme for the BREADBOX Arduino starter kit. Built on Shopify's official Skeleton Theme and designed to connect directly to Shopify through GitHub.

## What is included

- Product-first home hero with direct add-to-cart
- BREADBOX project gallery using real OLED previews
- Store-native Arduino UNO code uploader page template
- Kit contents, trust strip, reviews, FAQs and featured collection sections
- Responsive product gallery, variants, quantity and accelerated checkout
- Discount-aware cart and responsive collection pages
- Editable colors, fonts, menus, content, images and products in the theme editor
- Shopify Theme Check configuration for local and Shopify validation

## Connect to Shopify

1. Push this repository to GitHub.
2. In Shopify Admin, open `Online Store > Themes`.
3. Choose `Add theme > Connect from GitHub`.
4. Install or authorize the Shopify GitHub app when prompted.
5. Select this repository and the `main` branch.
6. Open the theme editor and select your BREADBOX product in the `Product hero` section.
7. Select your shop collection in `Featured collection`, then replace placeholder reviews and policy copy before publishing.

## Add the uploader page

1. In Shopify Admin, open `Online Store > Pages`.
2. Create a page called `Uploader`.
3. Set the theme template to `uploader`.
4. Add `/pages/uploader` to your main menu so customers can upload sketches from the same store domain.

The uploader uses Web Serial, so visitors need Chrome or Edge on desktop over HTTPS. A published Shopify domain such as `https://breadbox.fun/pages/uploader` satisfies the HTTPS requirement.

## Add policy pages

1. In Shopify Admin, open `Online Store > Pages`.
2. Create a page called `Shipping Policy` and set the theme template to `shipping-policy`.
3. Create a page called `Return Policy` and set the theme template to `return-policy`.
4. Add both pages to your footer menu in `Online Store > Navigation`.

The product page also includes a concise shipping and returns accordion. Return shipping is set as the customer's cost unless the item is faulty, damaged in transit or incorrect.

## Local preview

Install the latest Shopify CLI, authenticate with your store, then run:

```bash
shopify theme dev
```

Run validation with:

```bash
shopify theme check
```

## Launch checklist

- Add accurate product photos, price, inventory and variants
- Add shipping, returns, privacy and terms pages
- Replace sample testimonials with genuine customer feedback
- Confirm menu links and customer support details
- Test checkout, mobile navigation and all payment methods
- Set the store domain, social preview image and analytics

## Foundation

Based on Shopify's official [Skeleton Theme](https://github.com/Shopify/skeleton-theme), licensed under the MIT License.
