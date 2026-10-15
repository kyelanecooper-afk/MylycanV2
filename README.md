# My Lycan V2 — signup screen

The first isolated Expo / React Native screen for My Lycan V2. No dashboard,
Shopify integration, live accounts, checkout or customer data is included.

## What is built

- White and light-blue glass, navy copy and an orange email action.
- Apple, Google and email/password choices on one signup screen.
- Email signup uses a separate keyboard-aware screen with inline validation and show/hide password.
- Buttons show default, pressed and disabled states, with brief animation and light haptic feedback.
- Safe-area positioned settings control; reduced clutter around the header and footer.
- Reduced-motion / reduced-transparency support, scrollable layout and keyboard avoidance.
- A native Apple button when supported on iOS; the Google G is bundled from Google's official sign-in asset.

The wordmark is a text placeholder for the approved My Lycan logo.
Account creation, Apple/Google authentication, verification, password recovery,
policy consent and account linking are **not connected**. Use demo information
only. It saves and sends no form data; a notice makes clear that this is a preview. The Sign in link explains that its separate page will follow.

## Run on Windows

Install Node.js LTS and extract this folder. Open PowerShell in the folder:

```powershell
npm.cmd install
npm.cmd run typecheck
npx.cmd expo login
npm.cmd start -- --tunnel
```

Sign into Expo CLI and Expo Go with the same Expo account. Put your laptop and
iPhone on the same Wi-Fi, then scan the terminal QR code with your iPhone camera.
No EAS project, store release or live backend has been created by this starter.

The Expo tunnel helper is included in development dependencies. Native Google authentication will need an Expo development build later.
The package versions follow Expo SDK 57's official bundled module list. If Expo Go
reports a version mismatch, match the project SDK to the installed Expo Go before
changing app code.

## GitHub

This V2 project is stored separately at `kyelanecooper-afk/MylycanV2`; it does
not use or modify the live V1 repository. The repository currently contains the
initial signup-screen preview only. Do not add credentials, signing files,
`node_modules` or `.expo` to version control.

## Validation

The project configuration files parse, and the initial source is committed.
Full type-checking, bundling and on-device layout/accessibility checks require
installing the Expo dependencies and running on the laptop/iPhone.
No live authentication has been tested or enabled.
