import FloatingAIChat from "@/components/Floating-AI-chatbot";
import { CartProvider } from "@/hooks/use-cart";
import Header from "@/ui/organisms/header/Header";
import CategoryBasedBags from "@/ui/organisms/products/CategoryBasedBags";

const HomePage = () => {
  return (
    <div>
      <CartProvider>
        <Header />
        <CategoryBasedBags />
        <FloatingAIChat />
      </CartProvider>
    </div>
  );
};

export default HomePage;
