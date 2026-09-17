import { CRM } from "@/components/atomic-crm/root/CRM";
import { CPlayLayout } from "@/components/cplay/layout/CPlayLayout";
import {
  cplayBrand,
  cplayCurrency,
  cplayDealPipelineStatuses,
  cplayDealStages,
} from "@/cplay/config";

/**
 * CPlay Comercial application entry point.
 *
 * The Atomic CRM core remains isolated under components/atomic-crm so we can
 * keep upstream compatibility while applying CPlay-specific configuration
 * and presentation from this application layer.
 */
const App = () => (
  <CRM
    title={cplayBrand.title}
    currency={cplayCurrency}
    dealPipelineStatuses={cplayDealPipelineStatuses}
    dealStages={[...cplayDealStages]}
    layout={CPlayLayout}
  />
);

export default App;
