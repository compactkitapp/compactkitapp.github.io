# Wishlist Google Sheets Setup

The landing page is ready to submit wishlist emails to a Google Apps Script web app.

## 1. Create the Apps Script

1. Open your spreadsheet:
   `https://docs.google.com/spreadsheets/d/1ecbqP-WGnNmOlud94Znf81QssB4I4zcFk0sgvOL8NF8/edit?usp=sharing`
2. In Google Sheets, open `Extensions` > `Apps Script`.
3. Replace the default script with the contents of [wishlist-apps-script.gs](/Users/huym4/Documents/WIP/huynguyennovem/COMPRESS-KIT/compactkitapp.github.io/docs/wishlist-apps-script.gs).

## 2. Deploy as a web app

1. Click `Deploy` > `New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Deploy and copy the generated `/exec` URL.

## 3. Connect the site

Paste that `/exec` URL into `webAppUrl` in [assets/wishlist-config.js](/Users/huym4/Documents/WIP/huynguyennovem/COMPRESS-KIT/compactkitapp.github.io/assets/wishlist-config.js).

After that, the `Join wishlist` form will post new emails into a `Wishlist` tab in the spreadsheet.
