import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../custom-components/CustomStyles";
import GreenContainer from "../custom-components/GreenContainer";
import YellowContainer from "../custom-components/YellowContainer";
import GreyContainer from "../custom-components/GreyContainer";
import LabeledText from "../custom-components/LabeledText";
import ContactInfoList from "../custom-components/ContactInfoList";
import Footer from "../custom-components/Footer";

export default function RptAdjusterInstructionsPDF({
  data,
  sacData,
  sac1,
  sac2,
  riskSol,
  uw,
}) {
  return (
    <Document title="Special Accounts Priority Claim-Handling Details">
      <Page size="A4" style={styles.page}>
        <View>
          <GreenContainer
            title="Special Accounts Priority Claim-Handling Details"
            titleCentered
          >
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

            <View style={[styles.col12, { marginBottom: 8 }]}>
              <LabeledText
                label="Policy Name:"
                value={data?.AcctOnPolicyName}
              />
            </View>

            <View style={styles.col4}>
              <LabeledText label="Service Level:" value={sacData?.ServLevel} />
            </View>
            <View style={styles.col4}>
              <LabeledText label="Policy Type:" value={data?.PolicyType} />
            </View>
            <View style={styles.col4}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.underlinedHeading}>Policy #: </Text>
                <Text style={styles.bodyBlue}>
                  {data?.PolPref} {data?.PolicyNum}
                </Text>
              </View>
            </View>

            <View style={styles.col4}>
              <LabeledText
                label="On Board Date:"
                value={sacData?.OnBoardDate}
              />
            </View>
            <View style={styles.col4}>
              <LabeledText label="Inception Date:" value={data?.InceptDate} />
            </View>
            <View style={styles.col4}>
              <LabeledText label="Expiration Date:" value={data?.ExpDate} />
            </View>
          </GreenContainer>

          <GreenContainer title="Account Details">
            <View style={styles.col12}>
              <Text style={styles.bodyBlack}>{sacData?.AccountNotes}</Text>
            </View>
          </GreenContainer>

          <GreenContainer title="Insured Contact Details">
            <View style={[styles.col6, { alignItems: "center" }]}>
              <Text style={styles.underlinedHeading}>Primary Contact:</Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { marginVertical: 4 },
                ]}
              >
                {data?.InsuredContact1 || "\u00A0"}
              </Text>
              <ContactInfoList
                data={{
                  Phone: data?.InsuredPhone1,
                  cell: data?.InsuredCell1,
                  "E-Mail": data?.InsuredEMail1,
                }}
              />
            </View>
            <View style={[styles.col6, { alignItems: "center" }]}>
              <Text style={styles.underlinedHeading}>Secondary Contact:</Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { marginVertical: 4 },
                ]}
              >
                {data?.InsuredContact2 || "\u00A0"}
              </Text>
              <ContactInfoList
                data={{
                  Phone: data?.InsuredPhone2,
                  cell: data?.InsuredCell2,
                  "E-Mail": data?.InsuredEMail2,
                }}
              />
            </View>
            <View style={[styles.col12, { marginTop: 10 }]}>
              <LabeledText
                label="Insured Website:"
                value={sacData?.InsuredWebsite}
              />
            </View>
          </GreenContainer>

          <GreenContainer title="Agent Details">
            <View
              style={[styles.col6, { alignItems: "center", marginBottom: 10 }]}
            >
              <Text style={styles.underlinedHeading}>Agent Name:</Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { fontSize: 12, marginTop: 2 },
                ]}
              >
                {data?.AgentName || "\u00A0"}
              </Text>
            </View>
            <View
              style={[styles.col6, { alignItems: "center", marginBottom: 10 }]}
            >
              <Text style={styles.underlinedHeading}>
                Relationship Ranking:
              </Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { fontSize: 12, marginTop: 2 },
                ]}
              >
                {data?.AgentSeg || "\u00A0"}
              </Text>
            </View>

            <View style={[styles.col6, { alignItems: "center" }]}>
              <Text style={styles.underlinedHeading}>
                Primary Agent Contact:
              </Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { marginVertical: 4 },
                ]}
              >
                {data?.AgentContact1 || "\u00A0"}
              </Text>
              <ContactInfoList
                data={{
                  Phone: data?.AgentTel1,
                  cell: data?.AgentCell1,
                  "E-Mail": data?.AgentEmail1,
                }}
              />
            </View>
            <View style={[styles.col6, { alignItems: "center" }]}>
              <Text style={styles.underlinedHeading}>
                Secondary Agent Contact:
              </Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { marginVertical: 4 },
                ]}
              >
                {data?.AgentContact2 || "\u00A0"}
              </Text>
              <ContactInfoList
                data={{
                  Phone: data?.AgentTel2,
                  cell: data?.AgentCell2,
                  "E-Mail": data?.AgentEmail2,
                }}
              />
            </View>
          </GreenContainer>

          <GreenContainer title="Claim Handling Instructions">
            <Text style={styles.noteRed}>
              {sacData?.HCMAccess === "Enrolled"
                ? "The insured HAS access to non-confidential claim notes and financial activity. Claim acronyms should be avoided. It is possible that you will receive e-mails and calls from this insured referencing claim notes and activity"
                : "The insured MAY HAVE access to non-confidential claim notes and financial activity. Claim acronyms should be avoided. It is possible that you will receive e-mails and calls from this insured referencing claim notes and activity"}
            </Text>
            <Text
              style={[
                styles.bodyBlack,
                styles.bodyBold,
                { textAlign: "center", width: "100%", marginVertical: 4 },
              ]}
            >
              Coverage must always be validated in the system by the Adjuster.
            </Text>
            <Text
              style={[
                styles.bodyBlack,
                styles.bodyBold,
                { textAlign: "center", width: "100%" },
              ]}
            >
              Questions regarding policy information should be referred to the
              underwriter.
            </Text>
            {data?.CCTBusLine === "Auto" && (
              <Text
                style={[
                  styles.bodyBlack,
                  { textAlign: "center", width: "100%", marginTop: 4 },
                ]}
              >
                Adjuster must review and update the Total Loss Indicator as Yes
                or No for the insured vehicles on all Claims.
              </Text>
            )}
          </GreenContainer>

          <GreyContainer title="Contact Instructions">
            <Text>{data?.ContactInstruct}</Text>
          </GreyContainer>
          <GreyContainer title="Coverage Instructions">
            <Text>{data?.CoverageInstruct}</Text>
          </GreyContainer>
          <GreyContainer title="Recovery">
            <Text>{data?.RecoveryInstruct}</Text>
          </GreyContainer>
          <GreyContainer title="Additional Adjuster Handling Instructions">
            <Text>{data?.MiscCovInstruct}</Text>
          </GreyContainer>
          <GreyContainer title="Litigation Instructions">
            <Text>{data?.LitigationInstruct}</Text>
          </GreyContainer>

          <GreenContainer title="Hanover Contact Details" noWrap>
            <View style={{ width: "80%", marginHorizontal: "auto" }}>
              <YellowContainer title="Special Accounts Contacts">
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <ContactInfoList
                    data={{
                      Primary: sacData?.SAC_Contact1,
                      Title: sac1?.EmpTitle,
                      Phone: sac1?.TelNum,
                      "E-Mail": sac1?.EMailID,
                    }}
                  />
                  <ContactInfoList
                    data={{
                      Secondary: sacData?.SAC_Contact2,
                      Title: sac2?.EmpTitle,
                      Phone: sac2?.TelNum,
                      "E-Mail": sac2?.EMailID,
                    }}
                  />
                </View>
              </YellowContainer>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <YellowContainer title="Underwriter" style={{ width: "48%" }}>
                  <ContactInfoList
                    data={{
                      Name: data?.UnderwriterName,
                      Phone: uw?.["UW Phone"],
                      "E-Mail": uw?.["UW Email"],
                    }}
                  />
                </YellowContainer>
                <YellowContainer
                  title="Risk Solutions Consultant"
                  style={{ width: "48%" }}
                >
                  <ContactInfoList
                    data={{
                      Name: sacData?.LossCtlRep1,
                      Phone: riskSol?.LCTel,
                      "E-Mail": riskSol?.LCEmail,
                    }}
                  />
                </YellowContainer>
              </View>
            </View>
          </GreenContainer>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
