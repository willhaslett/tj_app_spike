import {
  Box,
  ContextView,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

export default function App({ userContext, environment }: ExtensionContextValue) {
  return (
    <ContextView
      title="Hello World"
      brandColor="#F6F8FA"
    >
      <Box css={{ stack: "y", rowGap: "large" }}>
        <Box css={{ font: "heading" }}>Welcome to my Stripe App!</Box>
        <Box>This is a simple Hello World app.</Box>
      </Box>
    </ContextView>
  );
} 