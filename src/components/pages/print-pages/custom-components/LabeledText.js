import { Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function LabeledText({ label, value, valueBlack = false }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 4 }}>
      <Text style={styles.underlinedHeading}>{label} </Text>
      <Text style={valueBlack ? styles.bodyBlack : styles.bodyBlue}>
        {value || " "}
      </Text>
    </View>
  );
}
