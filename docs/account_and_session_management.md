# Account and Session Management

## Overview
This document outlines the design for account creation, linking, and session management for the TaxJar Stripe App.

## Account Creation and Linking
- **Initial POST Call:**
  - On installation, the app sends a one-time POST request to the backend with the user's Stripe email address and account ID.
  - This establishes the link between the user's Stripe account and their TaxJar account.

- **No Polling:**
  - The app does not wait for the backend to complete account creation.
  - Instead, it immediately shows a useful onboarding interface to guide the user.

## Authentication Flow
- **Stripe-Signed Requests:**
  - When the user clicks a button to visit the TaxJar site, the request is signed by Stripe.
  - This ensures the request is secure and authenticated.

- **TaxJar Login:**
  - The TaxJar login screen includes a "Log in with Stripe" button.
  - This redirects the user to authenticate with Stripe, and upon success, Stripe redirects them back to TaxJar with a session token.

## Session Management
- **Session Expiration:**
  - Sessions expire after a fixed time (e.g., 24 hours) or after a period of inactivity (e.g., 30 minutes).
  - Expired sessions require re-authentication.

- **Session Closure:**
  - Users can explicitly log out via a "Logout" button, which invalidates the session token.
  - Sessions are also considered closed if the user closes the browser or tab.

- **Backend Management:**
  - Session tokens are stored securely in the database along with their expiration time.
  - Each request to the TaxJar backend validates the session token.
  - Invalid or expired tokens result in a 401 Unauthorized response.

## Security Considerations
- **HTTPS:**
  - All communication between the user and TaxJar is over HTTPS to protect session tokens.

- **CSRF Protection:**
  - CSRF protection is implemented to prevent malicious sites from using the user's session token.

## User Experience
- **Clear Feedback:**
  - Users are clearly informed when their session has expired or been closed.
  - A seamless re-authentication flow is provided.

- **Remember Me Option:**
  - An optional "Remember Me" feature can extend the session duration for user convenience. 