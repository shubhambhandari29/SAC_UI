import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../custom-components/CustomStyles";
import GreenContainer from "../custom-components/GreenContainer";
import YellowContainer from "../custom-components/YellowContainer";
import GreyContainer from "../custom-components/GreyContainer";
import LabeledText from "../custom-components/LabeledText";
import ContactInfoList from "../custom-components/ContactInfoList";
import Footer from "../custom-components/Footer";

export default function RptAdjusterInstructionsAffinPDF({
  data,
  affinityData,
  sac1,
  sac2,
  riskSol,
  uw,
}) {
  return (
    <Document title="Affinity Program Priority Claim-Handling Details">
      <Page size="A4" style={styles.page}>
        <View>
          <GreenContainer
            title="Affinity Program Priority Claim-Handling Details"
            titleCentered
          >
            <View
              style={[
                styles.col12,
                {
                  textAlign: "left",
                  marginBottom: 8,
                  flexDirection: "row",
                  fontSize: 14,
                },
              ]}
            >
              <Text style={styles.underlinedHeading}>Program Name:</Text>
              <Text
                style={[styles.bodyBlue, styles.bodyBold, { marginLeft: 2 }]}
              >
                {affinityData?.ProgramName}
              </Text>
            </View>

            <View style={[styles.col8, styles.bodyBold, { fontSize: 14 }]}>
              <LabeledText label="Policy Type:" value={data?.PolicyType} />
            </View>
            <View style={styles.col2}>
              <View>
                <Text style={styles.underlinedHeading}>On Board Date: </Text>
                <Text style={[styles.bodyBlue, { marginTop: 2 }]}>
                  {affinityData?.OnBoardDt}
                </Text>
              </View>
            </View>
          </GreenContainer>

          <GreenContainer title="Program Details">
            <View style={styles.col12}>
              <Text style={styles.bodyBlack}>{affinityData?.AcctNotes}</Text>
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
          </GreenContainer>

          <GreenContainer title="Managing Agent Details">
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
                {affinityData?.AgentName || "\u00A0"}
              </Text>
            </View>
            <View
              style={[styles.col6, { alignItems: "center", marginBottom: 10 }]}
            >
              <Text style={styles.underlinedHeading}>Agent Segmentation:</Text>
              <Text
                style={[
                  styles.bodyBlue,
                  styles.bodyBold,
                  { fontSize: 12, marginTop: 2 },
                ]}
              >
                {affinityData?.AgentSegment || "\u00A0"}
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
                {affinityData?.AgentContact1 || "\u00A0"}
              </Text>
              <ContactInfoList
                data={{
                  Phone: affinityData?.WorkTel1,
                  Mobile: affinityData?.CellTel1,
                  "E-Mail": affinityData?.Email1,
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
                {affinityData?.AgentContact2 || "\u00A0"}
              </Text>
              <ContactInfoList
                data={{
                  Phone: affinityData?.WorkTel2,
                  Mobile: affinityData?.CellTel2,
                  "E-Mail": affinityData?.Email2,
                }}
              />
            </View>
          </GreenContainer>

          <GreenContainer title="Claim Handling Instructions">
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
            {data?.PolicyType === "Commercial Auto" && (
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

          <GreenContainer title="Litigation and Insured Preferred Counsel Details">
            <View
              style={[
                styles.col12,
                { flexDirection: "row", alignItems: "center" },
              ]}
            >
              <Text style={[styles.bodyBlack, styles.bodyBold]}>
                Is Insured Preferred Counsel Approved?{" "}
              </Text>
              <Text style={styles.bodyBlue}>{data?.PrefCounselYN}</Text>
              {data?.PrefCounselYN === "Yes" && (
                <Text
                  style={[styles.noteRed, { width: "auto", marginLeft: 8 }]}
                >
                  ... See Litigation Instructions!
                </Text>
              )}
            </View>
          </GreenContainer>
          <GreyContainer title="Litigation Instructions">
            <Text>{data?.LitigationInstruct}</Text>
          </GreyContainer>

          <GreenContainer title="Hanover Contact Details" noWrap>
            <View style={{ width: "80%", marginHorizontal: "auto" }}>
              <YellowContainer title="AFFINITY BUSINESS CLAIM ADMINISTRATIVE HELP">
                <View
                  style={[
                    styles.col12,
                    { alignItems: "center", paddingTop: 4 },
                  ]}
                >
                  <Text style={styles.bodyBlue}>
                    To report corrections or updates to the contents of this
                    document, please e-mail:
                  </Text>
                  <Text
                    style={[
                      styles.noteRed,
                      { fontSize: 12, marginVertical: 6 },
                    ]}
                  >
                    SACHELP@hanover.com
                  </Text>
                  <Text style={styles.bodyBlue}>
                    In the subject of your e-mail please include:
                  </Text>
                  <Text
                    style={[styles.bodyBlue, styles.bodyBold, { marginTop: 4 }]}
                  >
                    Affinity / Program Name / Line of Business
                  </Text>
                </View>
              </YellowContainer>

              <YellowContainer title="AFFINITY BUSINESS">
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <ContactInfoList
                    data={{
                      Primary: affinityData?.SpecAcct1,
                      Title: sac1?.EmpTitle,
                      Phone: sac1?.TelNum,
                      "E-Mail": sac1?.EMailID,
                    }}
                  />
                  <ContactInfoList
                    data={{
                      Secondary: affinityData?.SpecAcct2,
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
                <YellowContainer title="UNDERWRITER" style={{ width: "48%" }}>
                  <ContactInfoList
                    data={{
                      Name: data?.UnderwriterName,
                      Phone: uw?.["UW Phone"],
                      "E-Mail": uw?.["UW Email"],
                    }}
                  />
                </YellowContainer>
                <YellowContainer
                  title="RISK SOLUTION CONSULTANT"
                  style={{ width: "48%" }}
                >
                  <ContactInfoList
                    data={{
                      Name: affinityData?.LossCtl1,
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
