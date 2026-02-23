import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../custom-components/CustomStyles";
import GreenContainer from "../custom-components/GreenContainer";
import RedContainer from "../custom-components/RedContainer";
import YellowContainer from "../custom-components/YellowContainer";
import Footer from "../custom-components/Footer";
import ContactInfoList from "../custom-components/ContactInfoList";

export default function RptUnderConstructionShiCctPDF({
  data,
  sacData,
  acctOwner,
}) {
  return (
    <Document title="Special Account Under Construction">
      <Page size="A4" style={styles.page}>
        <RedContainer title="Special Account Under Construction" titleCentered>
          <View
            style={[styles.col12, { textAlign: "center", marginBottom: 8 }]}
          >
            <Text style={styles.underlinedHeading}>Customer Name:</Text>
            <Text
              style={[
                styles.bodyBlue,
                styles.bodyBold,
                { fontSize: 14, marginTop: 2 },
              ]}
            >
              {data?.AccountName}
            </Text>
          </View>
        </RedContainer>

        <GreenContainer title="Handling Instructions" titleCentered>
          <View style={styles.col12}>
            <Text
              style={[
                styles.bodyBlack,
                { width: "100%", textAlign: "center", marginVertical: 4 },
              ]}
            >
              This account is new addition to Special Account Claims. The
              Special Handling Instructions are still being developed.
            </Text>
          </View>

          <View style={styles.col12}>
            <Text
              style={[
                styles.bodyBlack,
                { width: "100%", textAlign: "center", marginVertical: 4 },
              ]}
            >
              Proceed with claim handling per Best Practices. If you have any
              questions, please contact the Account Owner shown below.
            </Text>
          </View>

          <View
            style={{ width: "80%", marginHorizontal: "auto", marginTop: 4 }}
          >
            <YellowContainer title="SPECIAL ACCOUNT OWNER">
              <ContactInfoList
                data={{
                  Name: sacData?.AcctOwner,
                  Title: acctOwner?.EmpTitle,
                  Phone: acctOwner?.TelNum,
                  "E-Mail": acctOwner?.EMailID,
                }}
              />
            </YellowContainer>
          </View>

          <View style={styles.col12}>
            <Text
              style={[
                styles.bodyBlack,
                { width: "100%", textAlign: "center", marginVertical: 4 },
              ]}
            >
              As soon as the Special handling Instructions are complete, the
              document will be uploaded to your file.
            </Text>
          </View>

          <View style={styles.col12}>
            <Text
              style={[
                styles.bodyBlack,
                { width: "100%", textAlign: "center", marginVertical: 4 },
              ]}
            >
              Please watch for you Special Claim Handling document activity.
            </Text>
          </View>
        </GreenContainer>

        <Footer />
      </Page>
    </Document>
  );
}
