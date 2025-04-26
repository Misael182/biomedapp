import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Importação corrigida!

export default function App() {
  const [telaAtual, setTelaAtual] = useState<"menuEquipamento" | "chatbot">("menuEquipamento");
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<"SIGNA" | "Fabius" | null>(null);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");

  const numeroWhatsApp = "5511913246077";

  const conhecimentoSIGNA = [
    {
      tema: "Peso Máximo",
      sinônimos: ["peso", "quilos", "quantos kg", "suporta", "capacidade de peso"],
      resposta: "160kg padrão ou 200kg mesa reforçada.",
    },
    {
      tema: "Voltagem",
      sinônimos: ["voltagem", "corrente", "energia elétrica", "quantos volts", "tensão"],
      resposta: "380V trifásico, aterramento obrigatório.",
    },
  ];

  const conhecimentoFabius = [
    {
      tema: "Peso dos Acessórios",
      sinônimos: ["peso", "acessórios", "limite de carga", "quanto suporta"],
      resposta: "125kg no teto, 60kg na parede, incluindo acessórios.",
    },
    {
      tema: "Voltagem de Operação",
      sinônimos: ["voltagem", "energia elétrica", "tensão", "quantos volts"],
      resposta: "100V a 240V CA, com aterramento.",
    },
  ];

  function normalizarTexto(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
  }

  function buscarResposta(perguntaUsuario: string) {
    const perguntaNormalizada = normalizarTexto(perguntaUsuario);

    let base = equipamentoSelecionado === "SIGNA" ? conhecimentoSIGNA : conhecimentoFabius;

    for (let item of base) {
      if (item.sinônimos.some(sinonimo => perguntaNormalizada.includes(normalizarTexto(sinonimo)))) {
        return item.resposta;
      }
    }

    return null;
  }

  function enviarPergunta() {
    if (!pergunta.trim()) {
      alert("Por favor, digite sua dúvida.");
      return;
    }
    const respostaEncontrada = buscarResposta(pergunta);
    if (respostaEncontrada) {
      setResposta(respostaEncontrada);
    } else {
      setResposta("");
    }
  }

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent("Olá, estou com uma dúvida sobre um equipamento da Biomed Engenharia. Pode me ajudar?");
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    Linking.openURL(url);
  }

  function selecionarEquipamento(tipo: "SIGNA" | "Fabius") {
    setEquipamentoSelecionado(tipo);
    setTelaAtual("chatbot");
    setPergunta("");
    setResposta("");
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <Image source={require("./assets/logo.png")} style={styles.logo} resizeMode="contain" />

          {telaAtual === "menuEquipamento" && (
            <View style={styles.content}>
              <Text style={styles.title}>Biomed Engenharia</Text>
              <Text style={styles.subtitle}>Escolha o equipamento para consultar:</Text>

              <TouchableOpacity style={styles.buttonPrimary} onPress={() => selecionarEquipamento("SIGNA")}>
                <Text style={styles.buttonText}>🩺 SIGNA Creator (Ressonância)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonPrimary} onPress={() => selecionarEquipamento("Fabius")}>
                <Text style={styles.buttonText}>🛠️ Fabius Plus XL (Anestesia)</Text>
              </TouchableOpacity>
            </View>
          )}

          {telaAtual === "chatbot" && (
            <View style={styles.content}>
              <Text style={styles.title}>
                {equipamentoSelecionado === "SIGNA" ? "SIGNA Creator" : "Fabius Plus XL"}
              </Text>
              <Text style={styles.subtitle}>Digite sua dúvida:</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite aqui..."
                value={pergunta}
                onChangeText={setPergunta}
              />
              <TouchableOpacity style={styles.buttonPrimary} onPress={enviarPergunta}>
                <Text style={styles.buttonText}>Enviar Pergunta</Text>
              </TouchableOpacity>

              {resposta !== "" && (
                <View style={styles.respostaBox}>
                  <Text style={styles.respostaText}>{resposta}</Text>
                </View>
              )}

              {resposta === "" && pergunta !== "" && (
                <View style={styles.respostaBox}>
                  <Text style={styles.respostaText}>
                    ❌ Não encontramos essa informação.{'\n\n'}
                    Clique abaixo para falar com a Biomed Engenharia no WhatsApp.
                  </Text>
                  <TouchableOpacity style={styles.buttonWhatsApp} onPress={abrirWhatsApp}>
                    <Text style={styles.buttonText}>💬 Falar no WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.buttonSecondary} onPress={() => setTelaAtual("menuEquipamento")}>
                <Text style={styles.buttonText}>Voltar ao Menu de Equipamentos</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { alignItems: "center", padding: 24 },
  logo: { width: 150, height: 150, marginBottom: 16 },
  content: { width: "100%", gap: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#007ACC", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "#666", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, backgroundColor: "#f9f9f9", fontSize: 16, width: "100%" },
  buttonPrimary: { backgroundColor: "#007ACC", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, alignItems: "center", width: "100%" },
  buttonSecondary: { backgroundColor: "#6c757d", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, alignItems: "center", width: "100%", marginTop: 10 },
  buttonWhatsApp: { backgroundColor: "#25D366", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10, alignItems: "center", width: "100%", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  respostaBox: { backgroundColor: "#e0f7fa", padding: 16, borderRadius: 10, marginTop: 20, width: "100%" },
  respostaText: { fontSize: 16, color: "#007ACC", textAlign: "left" },
});
