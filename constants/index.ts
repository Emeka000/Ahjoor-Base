// Contract deployed on Base chain
export const CONTRACT_ADDRESS = "0x1f79E558E2811F87377C202464763d5172027e2b";

// Token addresses on Base
export const ETH_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; 
export const USDC_TOKEN_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; 

// Token options for UI
export const TOKEN_OPTIONS = [
  { name: "ETH", address: ETH_TOKEN_ADDRESS, symbol: "ETH", decimals: 18 },
  { name: "USDC", address: USDC_TOKEN_ADDRESS, symbol: "USDC", decimals: 6 },
] as const;

// Helper to normalize address for comparison (Ethereum standard)
const normalizeAddress = (address: string): string => {
  try {
    return address.toLowerCase().trim();
  } catch {
    return address.toLowerCase();
  }
};

// Helper to get token info by address
export const getTokenByAddress = (address: string) => {
  const normalizedInput = normalizeAddress(address);
  return TOKEN_OPTIONS.find(
    (token) => normalizeAddress(token.address) === normalizedInput
  ) || { name: "Unknown", symbol: "Unknown", decimals: 18, address: "0x0" };
};