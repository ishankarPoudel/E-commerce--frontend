import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, ShoppingBag, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { useMutation } from "@tanstack/react-query";
import { searchMutation } from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";
import { Link, useNavigate } from "@tanstack/react-router";

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

  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const { mutate, isPending } = useMutation({
    ...searchMutation(),
  });

  const suggestions = [
    "Show me trending backpacks",
    "Find leather tote bags under $100",
    "What are your bestsellers?",
    "Recommend waterproof bags for travel",
    "Do you have red messenger bags?",
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

  const handleClearChat = () => {
    setMessages([]);
    mutate({
      body: {
        userMessage: "",
        sessionId: "",
      },
    });
  };

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
          sessionId,
        },
      },
      {
        onSuccess: (response: any) => {
          console.log("AI Response:", response);

          const queryType = response.intent?.queryType || "product_search";

          // AI text response
          const aiTextMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: response.reply || "Here's what I found for you:",
            queryType,
          };

          setMessages((prev) => [...prev, aiTextMessage]);

          // Add bags if available
          if (response.bags && response.bags.length > 0) {
            const bagMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: JSON.stringify(response.bags),
              language: "bags",
              queryType,
            };

            setMessages((prev) => [...prev, bagMessage]);
          }
        },

        onError: (error) => {
          console.error("AI Error:", error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Sorry, something went wrong on my end! 😅 Could you try asking that again?",
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
      {messages.length > 0 && (
        <div className="border-b border-border px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Chat with Emma
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear Chat
          </Button>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth"
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6 pb-12">
            <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Hi! I'm Emma, Your Shopping Assistant 👋
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                Ask me anything about bags - from recommendations to product
                searches. Here are some ideas to get you started:
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

        {/* Messages */}
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
                  {m.queryType && (
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {m.queryType === "general_question" && "Our Top Picks"}
                        {m.queryType === "recommendation" &&
                          "Recommended for You"}
                        {m.queryType === "product_search" && "Search Results"}
                        {m.queryType === "follow_up" && "More Options"}
                        {![
                          "general_question",
                          "recommendation",
                          "product_search",
                          "follow_up",
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
                              bag.images?.[0]?.image
                                ? getImageUrl(bag.images[0].image)
                                : "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={bag.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-base font-semibold text-foreground line-clamp-1 mb-1">
                          {bag.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {bag.categories?.[0]?.categoryName || "General"}
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

        {isPending && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border px-6 py-4 rounded-2xl rounded-tl-none w-full max-w-md">
              <DynamicStatusMessages />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background px-8 py-6">
        <div className="mb-4 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                AI Assistant Beta
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Emma is currently in training mode and may occasionally provide
                inaccurate recommendations or product information. Responses are
                AI-generated and should be verified before making purchase
                decisions. For the most accurate and complete product details,
                please browse our catalog directly.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything about bags..."
            className="flex-1 h-12 rounded-full bg-muted border-border focus-visible:ring-2 focus-visible:ring-primary text-base px-6"
            disabled={isPending}
            autoFocus
          />
          <Button
            type="submit"
            disabled={isPending || !input.trim()}
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-md"
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
    "Reading your message...",
    "Searching our catalog...",
    "Finding perfect matches...",
    "Preparing recommendations...",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current < messages.length - 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => Math.min(prev + 1, messages.length - 1));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [current]);

  return (
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      <span className="text-sm text-muted-foreground animate-pulse">
        {messages[current]}
      </span>
    </div>
  );
}
