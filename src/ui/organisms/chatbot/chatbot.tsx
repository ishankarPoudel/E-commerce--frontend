import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { useMutation } from "@tanstack/react-query";
import { searchMutation } from "@/api/@tanstack/react-query.gen";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
          const aiTextMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: response.reply || "Here's what I found for you:",
          };

          setMessages((prev) => [...prev, aiTextMessage]);

          if (response.bags && response.bags.length > 0) {
            const bagMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: JSON.stringify(response.bags),
              language: "bags",
            };

            setMessages((prev) => [...prev, bagMessage]);
          }
        },

        onError: () => {
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again later.",
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
                Welcome to AI Assistant
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                Ask me anything about bags. I can help you find products,
                explain features, or provide recommendations.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {JSON.parse(m.content).map((bag: any) => (
                    <div
                      key={bag.id}
                      className="border border-border rounded-2xl bg-muted/30 p-4 shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={bag.bagImages?.[0]?.image || "/placeholder.png"}
                        alt={bag.name}
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                      <h3 className="text-lg font-semibold text-foreground">
                        {bag.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {bag.categories?.[0]?.categoryName}
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        ${bag.price.toFixed(2)}
                      </p>
                      {bag.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {bag.description}
                        </p>
                      )}
                    </div>
                  ))}
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
            <div className="bg-muted/50 border border-border px-6 py-4 rounded-2xl rounded-tl-none">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background px-8 py-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me about bags, recommendations, or deals..."
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
