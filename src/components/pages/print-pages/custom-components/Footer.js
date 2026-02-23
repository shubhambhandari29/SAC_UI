import { Image, Text, View } from "@react-pdf/renderer";
import { styles } from "./CustomStyles";

export default function Footer() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.pageFooter} fixed>
      <View>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          style={styles.footerText}
        />
        <Text style={styles.footerText}>{today}</Text>
      </View>
      {/* Replace with your actual public URL logo path or base64 string */}
      <Image src="/hanover-logo-1.png" style={styles.logo} />
    </View>
  );
}
