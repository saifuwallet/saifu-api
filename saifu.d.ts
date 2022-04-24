import { TokenInfo } from "@solana/spl-token-registry";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { FunctionComponent } from "react";
import { UseQueryResult } from "react-query";

// Re-export react-query
export { useQuery, useMutation } from "react-query";

// Re-export React Router Link
export { Link } from 'react-router-dom';

// Hooks
export declare const useTokenAccounts: () => UseQueryResult<
  TokenAccount[],
  unknown
>;
export declare const useNFTAccounts: () => UseQueryResult<
  TokenAccount[],
  unknown
>;
export declare const useTokenMetadata: (
  addr: string
) => UseQueryResult<TokenMetadata, unknown>;
export declare const useConnection: () => Connection;
export declare const usePublicKey: () => PublicKey | undefined;
export declare const useTokenInfos: () => TokenInfo[];
export declare const usePrice: (
  tokenInfo?: TokenInfo | undefined
) => UseQueryResult<number | undefined, unknown>;
export declare const useSignAllTransactions: () => (txs: Transaction[]) => void;
export declare const useParams: () => URLSearchParams;

/**
 * Fetches the given image by url from cache, or retrieves it
 * If not found, will retrieve and cache for ttl seconds
 */
export declare const useCachedImage: (
  url: string | undefined,
  ttl?: number | undefined
) => UseQueryResult<string | undefined, unknown>;

interface Attribute {
  trait_type: string;
  value: string;
}

interface File {
  uri: string;
  type: string;
}

interface Creator {
  address: string;
  share: number;
}

export interface TokenAccount {
  pubKey: PublicKey;
  isSol: boolean;
  mint: string;
  amount: string;
  decimals: number;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  external_url: string;
  attributes: Attribute[];
  collection: {
    name: string;
    family: string;
  };
  image: string;
  properties: {
    files: File[];
    creators: Creator[];
    category: string;
    maxSupply: number;
  };
}

/**
 * App object to expose certain parts of the wallet
 * to plugins
 */
export interface AppContext {
  /**
   * @deprecated Import hooks directly from package
   */
  hooks: {
    /**
     * @deprecated Import hooks directly from package
     */
    useTokenAccounts: () => UseQueryResult<Map<string, TokenAccount>, unknown>;
    /**
     * @deprecated Import hooks directly from package
     */
    useNFTAccounts: () => UseQueryResult<TokenAccount[], unknown>;
    /**
     * @deprecated Import hooks directly from package
     */
    useTokenMetadata: (addr: string) => UseQueryResult<TokenMetadata, unknown>;
    /**
     * @deprecated Import hooks directly from package
     */
    useConnection: () => Connection;
    /**
     * @deprecated Import hooks directly from package
     */
    usePublicKey: () => PublicKey | undefined;
    /**
     * @deprecated Import hooks directly from package
     */
    useTokenInfos: () => TokenInfo[];
    /**
     * @deprecated Import hooks directly from package
     */
    usePrice: (
      tokenInfo?: TokenInfo | undefined
    ) => UseQueryResult<number | undefined, unknown>;
  };
}

/**
 * @deprecated Pass app context from Plugin
 */
export interface ViewProps {
  app: AppContext;
}
export interface View {
  title: string;
  id: string;
  component: FunctionComponent | React.ReactElement;
  icon?: React.ReactElement;
}

/**
 * A hook that will be called on dashboard load.
 * Each plugin balance summary will be displayed individually
 */
export interface BalanceSummaryHook {
  (): { isLoading: boolean; data?: PluginBalanceSummary[] };
}

/**
 * A balance summary object that will be used to render a card on the wallet.
 * title, subtitle should ideally describe the balance. E.g Solend Deposits, Lido balance
 * value1, value2 can be arbitrary values 
 * but ideally should be amount, quantity, or currency value of the balance.
 */
export interface PluginBalanceSummary {
  title: string;
  subtitle?: string;
  value1: string;
  value2: string;
  iconUrl?: string;
}

export declare abstract class PluginSettings {
  abstract plugin: Plugin;
  constructor(plugin: Plugin);
  abstract display(): Setting[];
}
export declare enum SettingElementType {
  Text = "text",
}
export declare abstract class SettingsElement {
  abstract type: SettingElementType;
}
export declare class TextSetting extends SettingsElement {
  value: string;
  placeholder: string;
  type: SettingElementType;
  onChangeHandler: ((v: string) => Promise<void>) | undefined;
  setValue(v: string): this;
  setPlaceholder(v: string): this;
  onChange(cb: (v: string) => Promise<void>): this;
}
export declare class Setting {
  name: string;
  description: string;
  elements: SettingsElement[];
  setName(name: string): this;
  setDesc(desc: string): this;
  addText(func: (setting: TextSetting) => TextSetting): this;
}

export interface TokenAccountInfo {
  decimals: number;
  freezeAuthority: string;
  isInitialized: boolean;
  mintAuthority: string;
  supply: string;
}

export interface TokenActionCallbackArgs {
  navigate: (path: string) => void;
  pluginNavigate: (viewId: string, params?: URLSearchParams) => void;
  tokenInfo: TokenInfo;
  tokenAccountInfo: TokenAccountInfo;
}

export type TokenActionCallbackFunc = (args: TokenActionCallbackArgs) => void;

export interface TokenActionFilterArgs {
  tokenInfo: TokenInfo;
}
export type TokenActionFilterFunc = (args: TokenActionFilterArgs) => boolean;

export declare abstract class Plugin {
  /**
   * AppContext holds meta information about the wallet
   */
  app: AppContext;

  constructor(app: AppContext);

  /**
   * Called when the plugin is getting loaded by the wallet
   * Use this to initialize your plugin, register views, etc.
   */
  abstract onload(): Promise<void>;

  /**
   * Adds the given view to the wallet
   * Views are displayed in the Tile section of the wallet
   * One Plugin can have multiple views
   */
  addView(view: View): void;

  /**
   * Adds a balance summary hook to the wallet.
   * This allows plugins to display balance summaries 
   * in the dashboard if needed.
   */
  setSummaryHook(fn: BalanceSummaryHook): void

  /**
   * Register PluginSettings to be associated with this plugin
   * Setting a PluginSettings object will enable the settings
   * menu to appear for your Plugin
   */
  setSettings(settings: PluginSettings): void;

  /**
   * Registers a action to be shown when interacting with a specific token.
   * onClick is a callback that retrieves { navigate, pluginNavigate } for navigating to different parts of the wallet
   * pluginNavigate is scoped to the current plugin and allows easy routing to plugin views
   *
   * @param      {string}   mint    The mint
   * @param      {string}   title   Title to display
   * @param      {onClick}  func    callback to run on click
   */
  addTokenAction(mint: string | TokenActionFilterFunc, title: string, onClick: TokenActionCallbackFunc): void;

  /**
   * Load data from the plugin storage
   * Returns a Promise that resolves with any data that
   * was previously stored
   */
  loadData(): Promise<any>;

  /**
   * Saves the given data in plugin storage
   */
  saveData(data: any): Promise<void>;
}
