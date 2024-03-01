export interface TokenData {
    name: string;
    symbol: string;
    chainId?: number;
    decimals: number;
    logoURI: string;
    balance: string;
    price?: number; 
  }
  
  export interface AllTokenInfo {
    [address: string]: TokenData;
  }
  
  export interface AllTokenChainInfo {
    [chainId: string]: TokenData; 
  }
  
  export interface WalletData {
    [address: string]: {
      allTokenInfo: AllTokenInfo;
      allTokenChainInfo: AllTokenChainInfo;
    };
  }
  
  export interface DashboardProps {
    walletData: WalletData;
    isSyncing: boolean;
    isSyncingPrices: boolean;
    onFetchPrices: () => void;
  }
  
  export interface SideBarProps {
    onSelectAddresses: (selectedAddresses: string[]) => void;
    walletData: WalletData;
  }
  
  export interface ChainPrices {
    [key: string]: {
      usd: number;
    };
  }
  
  export interface TokenPrices {
    [key: string]: {
      usd: number;
    };
  }
  
  export interface PieChartData {
    symbol: string; 
    total: number;
  }
  
  export interface PieChartProps {
    data: PieChartData[];
  }