import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/app/hooks/Auth";
import { LinearGradient } from "expo-linear-gradient";

interface Comment {
  author: string;
  comment: string;
}

interface FreelancerProfileData {
  id: string;
  name: string;
  profile_picture?: string;
  workCategory?: {
    name: string;
  };
  totalServices?: number;      // Quantidade de serviços pelo app
  link_portfolio?: string;
  average_rating?: number;
  comments: Comment[];
}

const FreelancerProfile = () => {
  const { id } = useLocalSearchParams(); // id do freelancer
  const { user } = useAuth();
  console.log("🔍 FreelancerProfile › useAuth().user =", user);
  const [data, setData] = useState<FreelancerProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<FreelancerProfileData>(`/freelancers/profile/${id}`);
        setData(response.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!data) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#777" />
        <Text style={styles.loaderText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#5d5d5d", "#777777"]}
      style={styles.gradientContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* === Foto e Nome === */}
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri:
                data.profile_picture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>{data.name}</Text>
        </View>

        {/* === Profissão === */}
        {data.workCategory?.name && (
          <View style={styles.professionContainer}>
            <Text style={styles.label}>Profissão:</Text>
            <Text style={styles.value}>{data.workCategory.name}</Text>
          </View>
        )}

        {/* === Quantidade de serviços pelo app === */}
        <View style={styles.servicesContainer}>
          <Text style={styles.label}>Serviços realizados:</Text>
          <Text style={styles.value}>
            {typeof data.totalServices === "number"
              ? data.totalServices
              : "—"}
          </Text>
        </View>

        {/* === Link do Portfólio === */}
        {data.link_portfolio && (
          <TouchableOpacity
            onPress={() => Linking.openURL(data.link_portfolio!)}
            style={styles.portfolioContainer}
          >
            <Text style={styles.portfolioText}>Ver portfólio</Text>
          </TouchableOpacity>
        )}

        {/* === Avaliação Média === */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Avaliação média</Text>
          <Text style={styles.ratingValue}>
            {(data.average_rating ?? 0).toFixed(1)}{" "}
            <Text style={styles.star}>⭐</Text>
          </Text>
        </View>

        {/* === Comentários === */}
        <Text style={styles.commentsTitle}>Comentários:</Text>
        {data.comments.length === 0 ? (
          <Text style={styles.noCommentsText}>Nenhum comentário ainda.</Text>
        ) : (
          data.comments.map((c, idx) => (
            <View key={idx} style={styles.singleCommentContainer}>
              <Text style={styles.commentAuthor}>{c.author} disse:</Text>
              <Text style={styles.commentContent}>{c.comment}</Text>
            </View>
          ))
        )}

        {/* === Botão “Enviar Mensagem” === */}
        {user && (
  <TouchableOpacity
    onPress={() => {
      console.log("→ navegando para chat com:", {
        senderId: user.id,
        receiverId: data.id,
      });
      if (!user.id) {
        // Aparece um alerta ou aviso rápido, indicando que ainda não carregou user.id
        Alert.alert("Atenção", "Usuário ainda não carregado. Tente novamente em alguns instantes.");
        return;
      }
      router.push({
        pathname: "/screens/Chat",
        params: { senderId: user.id, receiverId: data.id },
      });
    }}
    style={styles.chatButton}
  >
    <Text style={styles.chatButtonText}>Enviar Mensagem</Text>
  </TouchableOpacity>
)}
      </ScrollView>
    </LinearGradient>
  );
};

export default FreelancerProfile;

// === Estilos ===
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40, // espaço extra para rolar tudo
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 8,
    color: "#777",
    fontSize: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 12,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  professionContainer: {
    marginBottom: 16,
  },
  servicesContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#ddd",
  },
  portfolioContainer: {
    marginBottom: 24,
    alignSelf: "center",
  },
  portfolioText: {
    color: "#34ace0",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 32,
    color: "#ffd32a",
    fontWeight: "bold",
  },
  star: {
    fontSize: 24,
    color: "#ffd32a",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 24,
  },
  singleCommentContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingBottom: 8,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 15,
    color: "#ddd",
  },
  chatButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
