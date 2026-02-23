import { Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function RedContainer({ title, children, titleCentered }) {
  return (
    <View style={styles.sectionSpacing}>
      <Text
        style={[styles.redHeader, titleCentered && { textAlign: "center" }]}
      >
        {title}
      </Text>
      <View style={[styles.container, { padding: 4 }]}>{children}</View>
    </View>
  );
}
