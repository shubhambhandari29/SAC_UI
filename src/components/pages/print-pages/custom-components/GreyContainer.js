import { Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function GreyContainer({ title, children }) {
  return (
    <View style={styles.sectionSpacing}>
      <View wrap={false}>
        <Text style={styles.greyHeader}>{title}</Text>
        <View style={{ height: 40, width: "100%" }} />
      </View>
      <View style={[styles.container, { padding: 4, marginTop: -40 }]}>
        {children}
      </View>
    </View>
  );
}
