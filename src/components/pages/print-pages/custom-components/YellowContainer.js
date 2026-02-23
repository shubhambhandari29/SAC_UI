import { Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function YellowContainer({ title, children, style }) {
  return (
    <View style={[styles.yellowContainerWrapper, style]} wrap={false}>
      <Text style={styles.yellowHeader}>{title}</Text>
      <View style={[styles.container, { justifyContent: "center" }]}>
        {children}
      </View>
    </View>
  );
}
