import { TokenInfo } from "@solana/spl-token-registry";
import { Connection, PublicKey } from "@solana/web3.js";
import { FunctionComponent } from "react";
import { UseQueryResult } from "react-query";

export { useQuery, useMutation } from "react-query";

// Hooks
export declare const useTokenAccounts: () => UseQueryResult<
  Map<string, TokenAccount>,
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

export interface ViewProps {
  app: AppContext;
}
export interface View {
  title: string;
  id: string;
  component: FunctionComponent<ViewProps>;
  icon?: React.ReactElement;
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
   * Register PluginSettings to be associated with this plugin
   * Setting a PluginSettings object will enable the settings
   * menu to appear for your Plugin
   */
  setSettings(settings: PluginSettings): void;

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
