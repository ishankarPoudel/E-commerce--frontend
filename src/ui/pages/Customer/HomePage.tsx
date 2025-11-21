import FloatingAIChat from "@/components/Floating-AI-chatbot";
import Header from "@/ui/organisms/header/Header";
import CategoryBasedBags from "@/ui/organisms/products/CategoryBasedBags";

const HomePage = () => {
  return (
    <div>
      <Header />
      <CategoryBasedBags />
      <FloatingAIChat />
    </div>
  );
};

export default HomePage;
