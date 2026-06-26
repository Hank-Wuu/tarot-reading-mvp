import type { PaymentOrder } from "@/lib/tarot/types";

const ORDER_STORAGE_KEY = "tarot-payment-orders";

export function getPaymentOrders(): PaymentOrder[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as PaymentOrder[];
  } catch {
    return [];
  }
}

export function getPaymentOrderById(id: string) {
  return getPaymentOrders().find((item) => item.id === id) ?? null;
}

export function savePaymentOrder(order: PaymentOrder) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getPaymentOrders();
  const next = [order, ...current.filter((item) => item.id !== order.id)].slice(0, 30);
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next));
}

export function updatePaymentOrder(id: string, updater: (order: PaymentOrder) => PaymentOrder) {
  if (typeof window === "undefined") {
    return null;
  }

  const current = getPaymentOrders();
  let updatedOrder: PaymentOrder | null = null;
  const next = current.map((order) => {
    if (order.id !== id) {
      return order;
    }

    updatedOrder = updater(order);
    return updatedOrder;
  });

  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next));
  return updatedOrder;
}
