import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH PAYMENT METHODS OF USERS

const fetchPaymentMethodDetails = async ({ signal, entityId }) =>
  await fetch(`${BASE_URL}/library/${entityId}/stripe/status`, { signal, credentials: "include" })
    .then((res) => {
      console.log(res)
      if (!res.ok) {
        throw new Error("Couldn't fetch");
      } else {
        return res.json();
      }
    })
     .catch((err) => {
      if (err.name === "AbortError") {
        return null;
      }
      console.error("Fetch users payment method error:", err);
      throw err;
    });


export const useFetchUserPaymentMethod = (entityId) => {
  
  return useQuery({
    queryKey: ["users-payment", entityId],  
    queryFn: ({ signal }) => fetchPaymentMethodDetails({ signal, entityId }),  
    enabled: !!entityId,  
    retry: false,
  });
};
