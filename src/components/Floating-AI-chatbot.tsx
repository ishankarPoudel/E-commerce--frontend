"use client";

import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { Button } from "@/ui/shadcn/button";
import ChatBot from "@/ui/organisms/chatbot/chatbot";

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
          {/* Chat Container - Large desktop-focused size for showing code and detailed content */}
          <div className="relative w-full h-full max-w-5xl max-h-[95vh] mx-auto flex flex-col bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">
            {/* Professional Header with branding and close button */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
              <div className="flex items-center gap-4">
                {/* AI Assistant Logo/Badge */}
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-foreground">
                    AI Assistant
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Powered by advanced reasoning
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-xl hover:bg-muted transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Content Area - Full height scrollable */}
            <div className="flex-1 overflow-hidden">
              <ChatBot />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 group ${
          open
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:shadow-3xl hover:scale-110 active:scale-95"
        }`}
        aria-label={open ? "Close chat" : "Open AI assistant"}
      >
        {/* Animated badge/indicator */}
        <div className="relative flex items-center justify-center w-6 h-6">
          {!open && (
            <>
              <div className="absolute inset-0 bg-primary-foreground/20 rounded-full animate-pulse" />
              <div className="absolute inset-1 bg-primary-foreground/10 rounded-full animate-pulse animation-delay-100" />
            </>
          )}
          {open ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <MessageCircle className="w-6 h-6 relative z-10" />
          )}
        </div>

        {/* Text label - always visible for clarity */}
        <span className="text-base font-semibold">
          {open ? "Close" : "Chat with AI"}
        </span>
      </button>
    </>
  );
}
