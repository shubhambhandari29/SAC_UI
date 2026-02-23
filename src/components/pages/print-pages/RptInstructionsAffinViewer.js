import { PDFViewer } from "@react-pdf/renderer";
import Loader from "../../ui/Loader";
import useDropdownData from "../../../hooks/useDropdownData";
import RptAdjusterInstructionsAffinPDF from "./reports/RptAdjusterInstructionsAffinPDF";
import RptAgentInstructionsAffinPDF from "./reports/RptAgentInstructionsAffinPDF";

const getContact = (data, nameToSearch, searchByColumn) => {
  if (!data || data.length < 1 || !nameToSearch) return undefined;
  return data.find((i) => i[searchByColumn] === nameToSearch);
};

export default function RptInstructionsAffinViewer({
  data,
  affinityData,
  type,
}) {
  const { data: SACContacts, loading: SACContactsLoading } = useDropdownData(
    "/dropdowns/SAC_Contact2",
  );
  const { data: RiskSolutions, loading: RiskSolutionsLoading } =
    useDropdownData("/dropdowns/LossCtlRep1");
  const { data: Underwriters, loading: UnderwritersLoading } = useDropdownData(
    "/dropdowns/Underwriters",
  );

  // Calculate mappings before passing to PDF
  const sac1 = getContact(SACContacts, affinityData?.SpecAcct1, "SACName");
  const sac2 = getContact(SACContacts, affinityData?.SpecAcct2, "SACName");
  const riskSol = getContact(RiskSolutions, affinityData?.LossCtl1, "RepName");
  const uw = getContact(Underwriters, data?.UnderwriterName, "UW Last");

  if (SACContactsLoading || RiskSolutionsLoading || UnderwritersLoading) {
    return <Loader size={40} height="600px" />;
  }

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <PDFViewer width="100%" height="100%">
        {type === "Adjuster" ? (
          <RptAdjusterInstructionsAffinPDF
            data={data}
            affinityData={affinityData}
            sac1={sac1}
            sac2={sac2}
            riskSol={riskSol}
            uw={uw}
          />
        ) : (
          <RptAgentInstructionsAffinPDF
            data={data}
            affinityData={affinityData}
            sac1={sac1}
            sac2={sac2}
            riskSol={riskSol}
            uw={uw}
          />
        )}
      </PDFViewer>
    </div>
  );
}
