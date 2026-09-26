
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";

const FACTORS = {
  Text: { energy: 0.01, co2: 0.005, water: 0.2 },
  Image: { energy: 0.08, co2: 0.04, water: 1.6 },
  Reasoning: { energy: 0.15, co2: 0.075, water: 3.0 },
  Video: { energy: 0.5, co2: 0.25, water: 10.0 },
};

export default function App() {
  const [type, setType] = useState("Text");
  const [sessions, setSessions] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [co2, setCo2] = useState(0);
  const [water, setWater] = useState(0);
  const [scanner, setScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanMessage, setScanMessage] = useState("");

  const addUsage = () => {
    const f = FACTORS[type];
    setSessions((v) => v + 1);
    setEnergy((v) => v + f.energy);
    setCo2((v) => v + f.co2);
    setWater((v) => v + f.water);
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScanMessage("");
    setScanner(true);
  };

  const onBarcodeScanned = ({ data }) => {
    setScanner(false);
    setScanMessage(`QR captured: ${String(data).slice(0, 70)}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>MAAI</Text>
        <Text style={styles.tagline}>HEAL THE MOTHER EARTH • SAVE CARBON</Text>

        <View style={styles.earth}>
          <Text style={styles.earthEmoji}>🌍</Text>
          <Text style={styles.earthLabel}>YOUR AI IMPACT</Text>
          <Text style={styles.earthSub}>Measure • Understand • Act</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroNumber}>{co2.toFixed(3)}</Text>
          <Text style={styles.heroUnit}>kg CO₂e</Text>
          <Text style={styles.heroCaption}>Estimated AI carbon footprint</Text>
        </View>

        <View style={styles.row}>
          <Metric icon="⚡" value={energy.toFixed(2)} label="Wh energy" />
          <Metric icon="💧" value={water.toFixed(1)} label="L water* " />
          <Metric icon="🤖" value={sessions} label="AI sessions" />
        </View>

        <Text style={styles.section}>RECORD AI USE</Text>
        <View style={styles.options}>
          {Object.keys(FACTORS).map((item) => (
            <Pressable
              key={item}
              onPress={() => setType(item)}
              style={[styles.option, type === item && styles.optionSelected]}
            >
              <Text style={styles.optionText}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.primary} onPress={addUsage}>
          <Text style={styles.primaryText}>＋ RECORD {type.toUpperCase()} USE</Text>
        </Pressable>

        <Pressable style={styles.scan} onPress={openScanner}>
          <Text style={styles.scanIcon}>▣</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>SCAN MAAI QR</Text>
            <Text style={styles.scanSub}>
              Scan an impact profile or campaign QR code.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {!!scanMessage && (
          <View style={styles.message}>
            <Text style={styles.messageText}>{scanMessage}</Text>
          </View>
        )}

        <View style={styles.insight}>
          <Text style={styles.insightTitle}>🌱 MAAI INSIGHT</Text>
          <Text style={styles.insightText}>
            AI impact is estimated from workload assumptions. Real production
            measurement should use model telemetry, data-centre efficiency,
            location/time electricity carbon intensity and a transparent
            methodology.
          </Text>
        </View>

        <Text style={styles.footnote}>
          *Water and CO₂e are illustrative estimates in this prototype, not
          universal measured values.
        </Text>
      </ScrollView>

      <Modal visible={scanner} animationType="slide">
        <SafeAreaView style={styles.cameraPage}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={onBarcodeScanned}
          />
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraTitle}>SCAN MAAI QR</Text>
            <View style={styles.scanFrame} />
            <Text style={styles.cameraHint}>
              Place the QR code inside the frame
            </Text>
            <Pressable style={styles.closeButton} onPress={() => setScanner(false)}>
              <Text style={styles.closeText}>CLOSE</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function Metric({ icon, value, label }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#041216" },
  container: { padding: 20, paddingBottom: 50 },
  brand: {
    color: "#fff", fontSize: 40, fontWeight: "900",
    letterSpacing: 5, marginTop: 8
  },
  tagline: {
    color: "#78e5a0", fontSize: 10, fontWeight: "800",
    letterSpacing: 1.7, marginTop: 3, marginBottom: 18
  },
  earth: {
    height: 205, borderRadius: 103, backgroundColor: "#0a3037",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#287566", marginBottom: 18
  },
  earthEmoji: { fontSize: 92 },
  earthLabel: { color: "#fff", fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  earthSub: { color: "#8fb7b1", marginTop: 5 },
  hero: {
    backgroundColor: "#0b2228", borderRadius: 24, padding: 22,
    alignItems: "center", borderWidth: 1, borderColor: "#183d44"
  },
  heroNumber: { color: "#7cf0a5", fontSize: 48, fontWeight: "900" },
  heroUnit: { color: "#fff", fontSize: 17, fontWeight: "800" },
  heroCaption: { color: "#82999e", marginTop: 7 },
  row: { flexDirection: "row", gap: 9, marginTop: 12 },
  metric: {
    flex: 1, backgroundColor: "#0b2228", borderRadius: 17,
    padding: 14, borderWidth: 1, borderColor: "#183d44"
  },
  metricIcon: { fontSize: 20 },
  metricValue: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 7 },
  metricLabel: { color: "#789096", fontSize: 10, marginTop: 3 },
  section: {
    color: "#fff", fontSize: 12, fontWeight: "900",
    letterSpacing: 2, marginTop: 25, marginBottom: 10
  },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    backgroundColor: "#0c292f", paddingVertical: 12, paddingHorizontal: 15,
    borderRadius: 13, borderWidth: 1, borderColor: "#1b4248"
  },
  optionSelected: { backgroundColor: "#17654d", borderColor: "#72e7a0" },
  optionText: { color: "#fff", fontWeight: "800" },
  primary: {
    marginTop: 15, backgroundColor: "#7ce9a2", borderRadius: 17,
    padding: 17, alignItems: "center"
  },
  primaryText: { color: "#062018", fontWeight: "900", letterSpacing: 1 },
  scan: {
    marginTop: 12, flexDirection: "row", alignItems: "center",
    backgroundColor: "#0c292f", borderRadius: 18, padding: 17,
    borderWidth: 1, borderColor: "#28635b"
  },
  scanIcon: { color: "#7ce9a2", fontSize: 30, marginRight: 14 },
  scanTitle: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
  scanSub: { color: "#82999e", fontSize: 11, marginTop: 4 },
  chevron: { color: "#7ce9a2", fontSize: 30 },
  message: {
    marginTop: 10, backgroundColor: "#12372f",
    borderRadius: 12, padding: 12
  },
  messageText: { color: "#bff5cf", fontSize: 12 },
  insight: {
    marginTop: 16, backgroundColor: "#0d2d26", borderRadius: 19,
    padding: 18, borderWidth: 1, borderColor: "#245a48"
  },
  insightTitle: { color: "#7ce9a2", fontWeight: "900", marginBottom: 7 },
  insightText: { color: "#bdd0ca", lineHeight: 20, fontSize: 12 },
  footnote: {
    color: "#50666b", fontSize: 9, textAlign: "center",
    lineHeight: 14, marginTop: 16
  },
  cameraPage: { flex: 1, backgroundColor: "#000" },
  cameraOverlay: {
    flex: 1, alignItems: "center", justifyContent: "space-between",
    paddingVertical: 65
  },
  cameraTitle: {
    color: "#fff", fontSize: 20, fontWeight: "900", letterSpacing: 2
  },
  scanFrame: {
    width: 250, height: 250, borderWidth: 3,
    borderColor: "#7ce9a2", borderRadius: 24
  },
  cameraHint: {
    color: "#fff", backgroundColor: "rgba(0,0,0,.55)",
    padding: 10, borderRadius: 10
  },
  closeButton: {
    backgroundColor: "#fff", paddingVertical: 14,
    paddingHorizontal: 35, borderRadius: 15
  },
  closeText: { color: "#061216", fontWeight: "900" }
});
