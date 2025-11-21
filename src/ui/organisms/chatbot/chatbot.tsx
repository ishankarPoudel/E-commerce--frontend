import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { useMutation } from "@tanstack/react-query";
import { searchMutation } from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";
import { useNavigate } from "@tanstack/react-router";

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  language?: string;
  queryType?: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    ...searchMutation(),
  });

  const suggestions = [
    "Show me trending backpacks",
    "Find leather tote bags under $100",
    "What are your bestsellers?",
    "Recommend travel bags for women",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleBagClick = (bagId: string) => {
    navigate({ to: `/bags/${bagId}` });
  };

  // Combined function for both manual & suggestion triggers
  const sendMessage = async (message: string) => {
    if (!message.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    mutate(
      {
        body: {
          userMessage: message.trim(),
        },
      },
      {
        onSuccess: (response: any) => {
          console.log("AI Response:", response);

          // Handle different query types
          const queryType = response.intent?.queryType || "product_search";

          // Always add the AI text response
          const aiTextMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              response.reply ||
              (queryType === "greeting"
                ? "Hello! 👋 How can I help you today?"
                : "Here's what I found for you:"),
            queryType,
          };

          setMessages((prev) => [...prev, aiTextMessage]);

          // Add bags if available (for all query types)
          if (response.bags && response.bags.length > 0) {
            const bagMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: JSON.stringify(response.bags),
              language: "bags",
              queryType,
            };

            setMessages((prev) => [...prev, bagMessage]);
          } else if (
            queryType === "product_search" &&
            (!response.bags || response.bags.length === 0)
          ) {
            // Only show "no results" for product searches
            const noResultsMessage: Message = {
              id: (Date.now() + 2).toString(),
              role: "assistant",
            };

            setMessages((prev) => [...prev, noResultsMessage]);
          }
        },

        onError: (error) => {
          console.error("AI Error:", error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Sorry, something went wrong. Please try again or rephrase your question.",
          };

          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth"
      >
        {/* Empty state with suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6 pb-12">
            <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome to AI Shopping Assistant
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                Ask me anything! I can help you find bags, show you bestsellers,
                recommend products, or answer your questions.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {suggestions.map((s, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-sm hover:bg-primary/10 transition"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render messages */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-2xl space-y-3",
                m.role === "user" ? "w-auto" : "w-full"
              )}
            >
              {m.language === "bags" ? (
                <div className="w-full">
                  {/* Section header based on query type */}
                  {m.queryType && (
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {m.queryType === "general_question" && "Our Top Picks"}
                        {m.queryType === "recommendation" &&
                          "Recommended for You"}
                        {m.queryType === "product_search" && "Search Results"}
                        {![
                          "general_question",
                          "recommendation",
                          "product_search",
                        ].includes(m.queryType) && "Available Options"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {JSON.parse(m?.content as string).map((bag: any) => (
                      <div
                        key={bag.id}
                        onClick={() => handleBagClick(bag.id)}
                        className="border border-border rounded-2xl bg-card p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="relative overflow-hidden rounded-xl mb-3">
                          <img
                            src={
                              bag.bagImages?.[0]?.image
                                ? getImageUrl(bag.bagImages[0].image)
                                : "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={bag.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                          />
                        </div>
                        <h3 className="text-base font-semibold text-foreground line-clamp-1 mb-1">
                          {bag.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {bag.categories?.[0]?.categoryName || "Uncategorized"}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-primary">
                            ${bag.price.toFixed(2)}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs hover:bg-primary/10"
                          >
                            View Details
                          </Button>
                        </div>
                        {bag.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {bag.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                      : "bg-muted/50 border border-border rounded-2xl rounded-tl-none",
                    "px-6 py-4 shadow-md"
                  )}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                    {m.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border px-6 py-4 rounded-2xl rounded-tl-none w-full max-w-md">
              <div className="space-y-4">
                {/* Progressive AI status updates */}
                <DynamicStatusMessages />

                {/* Shimmer text placeholder */}
                <div className="space-y-2 mt-3">
                  <div className="h-3 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded-md animate-pulse"></div>
                  <div
                    className="h-3 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded-md animate-pulse w-5/6"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-3 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded-md animate-pulse w-2/3"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background px-8 py-6">
        <div className="mb-4 px-4 py-3 bg-yellow-100 dark:bg-black-900/20  dark:border-black-800 rounded-lg">
          <div className="space-y-2">
            <p className="text-xs text-yellow-700 dark:text-yellow-300 opacity-70">
              We're still training our AI on our database. Some responses might
              not be suitable for you. Consider browsing our catalog directly
              for the best experience. All messages will be lost when you close
              this chat
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me about bags, bestsellers, or get recommendations..."
            className="flex-1 h-12 rounded-full bg-muted border-border focus-visible:ring-2 focus-visible:ring-primary text-base px-6"
            disabled={isPending}
            autoFocus
          />
          <Button
            type="submit"
            disabled={isPending || !input.trim()}
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-md"
            aria-label="Send message"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

function DynamicStatusMessages() {
  const messages = [
    "Analyzing your request...",
    "Searching our database...",
    "Finding the best matches...",
    "Almost ready with your results...",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Progress through each message, stop at the last one
    if (current < messages.length - 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => {
          if (prev < messages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 1500); // switch every 1.5 seconds
      return () => clearInterval(interval);
    }
  }, [current]);

  return (
    <div className="flex items-center gap-2 transition-all">
      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      <span className="text-sm text-muted-foreground font-medium animate-pulse">
        {messages[current]}
      </span>
    </div>
  );
}
