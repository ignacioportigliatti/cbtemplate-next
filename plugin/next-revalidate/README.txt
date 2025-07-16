=== Next.js Revalidation ===
Contributors: 9d8
Tags: next.js, headless, revalidation, cache
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.1
Requires PHP: 7.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Automatically revalidate your Next.js site when WordPress content changes.

== Description ==

Next.js Revalidation is a WordPress plugin designed to work with the `next-wp` Next.js starter template. It triggers revalidation of your Next.js site's cache whenever content is added, updated, or deleted in WordPress.

The plugin sends webhooks to your Next.js site's revalidation API endpoint, ensuring your headless frontend always displays the most up-to-date content.

**Key Features:**

* Automatic revalidation when posts, pages, categories, tags, authors, or media are modified
* Advanced Custom Fields (ACF) integration for field-level revalidation
* Settings page to configure your Next.js site URL and webhook secret
* Manual revalidation option for full site refresh
* Support for custom post types and taxonomies
* Optional admin notifications for revalidation events

== Installation ==

1. Upload the `next-revalidate` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Settings > Next.js Revalidation to configure your Next.js site URL and webhook secret

== Configuration ==

1. Visit Settings > Next.js Revalidation in your WordPress admin
2. Enter your Next.js site URL without a trailing slash (e.g., https://your-site.com)
3. Enter the webhook secret which should match the WORDPRESS_WEBHOOK_SECRET in your Next.js environment
4. Optionally enable admin notifications for revalidation events
5. Click "Save Settings"

== Frequently Asked Questions ==

= What is the webhook secret for? =

The webhook secret provides security for your revalidation API endpoint. It ensures that only your WordPress site can trigger revalidations.

= How do I set up my Next.js site for revalidation? =

Your Next.js site needs an API endpoint at `/api/revalidate` that can process the webhook payloads from this plugin. 
See the README in your Next.js project for more details.

= Does this work with custom post types? =

Yes, the plugin automatically detects and handles revalidation for custom post types and taxonomies.

= Does this work with Advanced Custom Fields (ACF)? =

Yes! The plugin includes full ACF integration. When enabled in settings, it will trigger revalidation whenever:
* Any ACF field is updated on posts, pages, or custom post types
* ACF options pages are modified
* ACF field groups are created, updated, or deleted

This ensures your Next.js site stays in sync with all your custom field content.

== Changelog ==

  = 1.0.5 =
* Added: Advanced Custom Fields (ACF) integration
* Added: ACF field-level revalidation support
* Added: ACF options pages revalidation
* Added: ACF field groups revalidation
* Added: Settings option to enable/disable ACF revalidation
* Enhanced: Better handling of different content types in Next.js API
  = 1.0.1 =
* Fix: Register AJAX actions for manual revalidation
* Fix: Normalize Next.js site URL in settings (remove trailing slash)
= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.0.0 =
Initial release of the Next.js Revalidation plugin.