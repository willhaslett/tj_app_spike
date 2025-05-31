import type {ExtensionContextValue} from "@stripe/ui-extension-sdk/context";
import Layout from "./pages/layout/Layout";
import {Router} from "./pages/layout/Router";

const App = ({userContext, environment, appContext}: ExtensionContextValue) => {
    return (
        <Router>
            <Layout  userContext={userContext} environment={environment} appContext={appContext}/>
        </Router>
    );
};

export default App;
