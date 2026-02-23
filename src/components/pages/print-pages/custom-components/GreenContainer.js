import { Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function GreenContainer({
  title,
  children,
  titleCentered,
  noWrap,
}) {
  return (
    <View style={styles.sectionSpacing} wrap={!noWrap}>
      <View wrap={false}>
        <Text
          style={[styles.greenHeader, titleCentered && { textAlign: "center" }]}
        >
          {title}
        </Text>
        <View style={{ height: 40, width: "100%" }} />
      </View>
      <View style={[styles.container, { padding: 4, marginTop: -40 }]}>
        {children}
      </View>
    </View>
  );
}
