import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import { FunctionComponent } from 'react';
import { UseQueryResult } from 'react-query';

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
  hooks: {
    useTokenAccounts: () => UseQueryResult<Map<string, TokenAccount>, unknown>;
    useNFTAccounts: () => UseQueryResult<TokenAccount[], unknown>;
    useTokenMetadata: (addr: string) => UseQueryResult<TokenMetadata, unknown>;
    useConnection: () => Connection;
    usePublicKey: () => PublicKey | undefined;
    useTokenInfos: () => TokenInfo[];
    usePrice: (tokenInfo?: TokenInfo | undefined) => UseQueryResult<number | undefined, unknown>;
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
  constructor(app: AppContext, plugin: Plugin);
  abstract display(): Setting[];
}
export declare enum SettingElementType {
  Text = 'text',
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
  app: AppContext;
  constructor(app: AppContext);
  abstract id: string;
  abstract onload(): Promise<void>;
  addView(view: View): void;
  setSettings(settings: PluginSettings): void;
  loadData(): Promise<any>;
  saveData(data: any): Promise<void>;
}
