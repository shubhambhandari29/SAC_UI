import { Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function ContactInfoList({ data }) {
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <View style={{ marginTop: 4, width: "100%" }} wrap={false}>
      {Object.entries(data).map(([key, value]) => (
        <View style={styles.contactRow} key={key}>
          <Text style={styles.contactLabel}>{key}:</Text>
          <Text style={styles.contactValue}>{value || " "}</Text>
        </View>
      ))}
    </View>
  );
}
