export interface KfTradeValueCommonData {
    name: string;
    color?: AntInKungfuColor;
    level?: number;
}

export enum StateStatusEnum {
    online = 'online',
    stopping = 'stopping',
    stopped = 'stopped',
    launching = 'launching',
    errored = 'errored',
    waitingrestart = 'waitingrestart',
    Pending = 0,
    Idle = 1,
    DisConnected = 2,
    Connected = 3,
    LoggedIn = 4,
    LoginFailed = 5,
    Ready = 100,
    Unknown = '',
}

export type AntInKungfuColor =
    | 'default'
    | 'orange'
    | 'pink'
    | 'red'
    | 'blue'
    | 'purple'
    | 'cyan'
    | 'green'
    | 'red'
    | 'kf-color-running'
    | 'kf-color-waiting'
    | 'kf-color-error';

export interface TdRow {
    accountName: string;
    accountId: string;
    sourceId: string;
    stateStatus: StateStatusEnum;
    processStatus: boolean;
    realizedPnl: number;
    unrealizedPnl: number;
    marketValue: number;
    margin: number;
    avail: number;
}

export interface MdRow {
    sourceId: string;
    stateStatus: StateStatusEnum;
    processStatus: boolean;
}

export interface StrategyRow {
    strategyId: string;
    stateStatus: StateStatusEnum;
    processStatus: boolean;
    realizedPnl: number;
    unrealizedPnl: number;
    marketValue: number;
    margin: number;
    avail: number;
    addTime: string;
}

export enum InstrumentTypeEnum {
    Unknown,
    Stock,
    Future,
    Bond,
    StockOption,
    Fund,
    TechStock,
    Index,
    Repo,
    Simu,
}

export type InstrumentTypes = keyof typeof InstrumentTypeEnum;

export enum HedgeFlagEnum {
    Speculation,
    Arbitrage,
    Hedge,
    Covered,
}

export type HedgeFlagTypes = keyof typeof HedgeFlagEnum;

export enum PriceTypeEnum {
    Limit,
    Market,
    FakBest5,
    ForwardBest,
    ReverseBest,
    Fak,
    Fok,
    Unknown,
}

export type PriceTypes = keyof typeof PriceTypeEnum;

export enum VolumeConditionEnum {
    Any,
    Min,
    All,
}

export type VolumeConditionTypes = keyof typeof VolumeConditionEnum;

export enum TimeConditionEnum {
    IOC,
    GFD,
    GTC,
}

export type TimeConditionTypes = keyof typeof TimeConditionEnum;

export enum CommissionModeEnum {
    ByAmount,
    ByVolume,
}

export type CommissionModeTypes = keyof typeof CommissionModeEnum;

export enum OffsetEnum {
    Open,
    Close,
    CloseToday,
    CloseYest,
}

export type OffsetTypes = keyof typeof OffsetEnum;

export enum SideEnum {
    Buy,
    Sell,
    Lock,
    Unlock,
    Exec,
    Drop,
    Purchase,
    Redemption,
    Split,
    Merge,
    MarginTrade,
    ShortSell,
    RepayMargin,
    RepayStock,
    CashRepayMargin,
    StockRepayStock,
    SurplusStockTransfer,
    GuaranteeStockTransferIn,
    GuaranteeStockTransferOut,
}

export type SideTypes = keyof typeof SideEnum;

export enum DirectionEnum {
    Long,
    Short,
}

export type DirectionTypes = keyof typeof DirectionEnum;

export interface SourceData {
    name: string;
    type: InstrumentTypes[];
}

export type KfConfigItemSupportedTypes =
    | 'str'
    | 'password'
    | 'file' // string
    | 'process'
    | 'instrumentId' // search input
    | 'account' // select - string
    | 'source' // select - string
    | 'exchange' // select - string
    | 'select'
    | 'bool'
    | 'int'
    | 'float'
    | 'percent'
    | 'side' // select - number
    | 'offset' // select - number
    | 'direction' // select - number
    | 'priceType' // select - number
    | 'hedgeFlag' // select - number
    | 'volumeCondition' // select - number
    | 'timeCondition' // select - number
    | 'commissionMode' // select - number
    | 'instrumentType'; // select - number

export type KfConfigValue = string | number | boolean;

export interface KfSelectOption {
    value: string | number;
    label: string | number;
}

export interface KfConfigItem {
    key: string;
    name: string;
    type: KfConfigItemSupportedTypes;
    errMsg?: string;
    default?: KfConfigValue;
    required?: boolean;
    primary?: boolean;
    validator?: string[];
    options?: KfSelectOption[];
    args?: Array<{ key: string | number; value: string | number }>; // process
    target?: string; // process
    tip?: string;
}

export interface KfExtConfig {
    key: string;
    name: string;
    config: {
        [key in KfCategoryTypes]?: {
            type: Array<InstrumentTypes> | InstrumentTypes;
            settings: KfConfigItem[];
        };
    };
}

export type KfExtConfigs = {
    [key in KfCategoryTypes]?: {
        [extKey: string]: KfExtConfig['config'][KfCategoryTypes];
    };
};

export interface SetKfConfigPayload {
    type: 'add' | 'update';
    title: string;
    config: KfExtConfig['config'][KfCategoryTypes];
    initValue?: Record<string, KfConfigValue>;
}

export enum KfCategoryEnum {
    md,
    td,
    strategy,
    system,
}

export enum KfModeEnum {
    LIVE,
    DATA,
    REPLAY,
    BACKTEST,
}

export type KfCategoryTypes = keyof typeof KfCategoryEnum;

interface KfLocationBase {
    group: string;
    name: string;
}

export type KfLocation = {
    category: KfCategoryTypes;
    mode: string;
} & KfLocationBase;

export type KfLocationOrigin = {
    category: KfCategoryEnum;
    mode: KfModeEnum;
} & KfLocationBase;

export type KfConfig = KfLocationOrigin & {
    location_uid: number;
    value: string;
};

export interface StrategyData {
    strategy_id: string;
    strategy_path: string;
    add_time: number;
}
