import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";
import { useAuthContext } from "../useAuthContext";

const fetchTransactions = async (entityId) => {
  const response = await fetch(`${BASE_URL}/library/${entityId}/transactions`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
};

export const useFetchTransactions = () => {
  const { auth } = useAuthContext();
  const entityId = auth?.entityId;

  return useQuery({
    queryKey: ["transactions", entityId],
    queryFn: () => fetchTransactions(entityId),
    enabled: !!entityId,
  });
};
