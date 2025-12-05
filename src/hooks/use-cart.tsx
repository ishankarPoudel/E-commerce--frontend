import { createContext, useContext, useEffect, useReducer } from "react";

export interface CartItem {
  productId: string;
  quantity: number;
  color: string;
  size?: string;
}
interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | {
      type: "REMOVE_ITEM";
      payload: { productId: string; color: string; size?: string };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        color: string;
        size?: string;
        quantity: number;
      };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_FROM_STORAGE"; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, size?: string) => void;
  updateQuantity: (
    productId: string,
    color: string,
    size: string | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  getItemCount: () => number;
} | null>(null);

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += action.payload.quantity;
        return { items: updated };
      }

      return { items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.productId === action.payload.productId &&
              i.color === action.payload.color &&
              i.size === action.payload.size
            )
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    case "LOAD_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart-storage");
    if (stored) {
      dispatch({
        type: "LOAD_FROM_STORAGE",
        payload: JSON.parse(stored),
      });
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart-storage", JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });

  const removeItem = (productId: string, color: string, size?: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { productId, color, size } });

  const updateQuantity = (
    productId: string,
    color: string,
    size: string | undefined,
    quantity: number
  ) =>
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, color, size, quantity },
    });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const getItemCount = () =>
    state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
