import { PDFViewer } from "@react-pdf/renderer";
import Loader from "../../ui/Loader";
import useDropdownData from "../../../hooks/useDropdownData";
import RptUnderConstructionShiCctPDF from "./reports/RptUnderConstructionShiCctPDF";

const getContact = (data, nameToSearch, searchByColumn) => {
  if (!data || data.length < 1 || !nameToSearch) return undefined;
  return data.find((i) => i[searchByColumn] === nameToSearch);
};

export default function RptUnderConstructionShiCctViewer({ data, sacData }) {
  const { data: AcctOwner, loading: AcctOwnerLoading } = useDropdownData(
    "/dropdowns/AcctOwner",
  );

  // Calculate mappings before passing to PDF
  const acctOwner = getContact(AcctOwner, sacData?.AcctOwner, "SACName");

  if (AcctOwnerLoading) return <Loader size={40} height="600px" />;

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <PDFViewer width="100%" height="100%">
        <RptUnderConstructionShiCctPDF
          data={data}
          sacData={sacData}
          acctOwner={acctOwner}
        />
      </PDFViewer>
    </div>
  );
}
