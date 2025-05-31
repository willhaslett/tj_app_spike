# Taxually Stripe Marketplace Stripe App

This Stripe App provides tax filing functionality for Taxually in the Stripe Marketplace. 
It integrates directly with Stripe Dashboard to streamline tax management for users.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Development](#development)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Usage](#usage)
7. [Troubleshooting](#troubleshooting)
8. [Support](#support)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (20.13.1)
- npm (10.8.1)
- Stripe CLI (1.19.5)

You'll also need a Stripe account with access to the Stripe Apps platform.

## Installation

1. Clone this repository:
   ```
   git clone git@github.com:lumatax-inc/stripe-marketplace-tax-app.git
   cd stripe-marketplace-tax-app
   ```
2. Install Stripe CLI and Plugin: https://docs.stripe.com/stripe-apps/create-app

3. Install dependencies:
   ```
   npm install
   ```

## Development

1. Start the development server:
   ```
   stripe apps start --manifest stripe-app.dev.json
   ```

2. Open the Stripe Dashboard in your browser and navigate to the app's location to see your changes in real-time.

3. Edit the files in the `src` directory. The app will automatically reload when you make changes.

Note: You will need to use a browser that supports the Stripe Dashboard. Safari doesn't support the Dashboard.

## Deployment

1. Build the app for production:
   ```
   stripe apps build
   ```

2. Deploy the app:
   ```
   stripe apps deploy
   ```

3. Follow the prompts to submit your app for review.


## Usage

After installation, users can access the Taxually Stripe Tax Filing app from their Stripe Dashboard. 
The app allows users to:

- View and manage registered jurisdictions
- View and approve tax returns
- Track filing status and deadlines
- View tax summaries

## Troubleshooting

- If you encounter issues with the Stripe CLI, ensure you're using the latest version:
  ```
  stripe --version
  npm install -g @stripe/stripe-cli@latest
  ```

- For app-specific errors, check the browser console and the Stripe CLI output for error messages.

## Support

For Stripe-related questions, refer to the [Stripe Apps documentation](https://docs.stripe.com/stripe-apps).
