import { CRM } from "@/components/atomic-crm/root/CRM";

/**
 * CPlay Comercial application entry point.
 *
 * The Atomic CRM core remains isolated under components/atomic-crm so we can
 * keep upstream compatibility while applying CPlay-specific configuration
 * from this application layer.
 */
const App = () => <CRM title="CPlay Comercial" />;

export default App;
