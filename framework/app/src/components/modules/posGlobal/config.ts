import { LedgerCategoryEnum } from '@kungfu-trader/kungfu-js-api/typings/enums';
import { KfCategoryRegisterProps } from '@kungfu-trader/kungfu-app/src/renderer/assets/methods/uiExtraLocationUtils';

export const columns: AntTableColumns = [
  {
    title: '代码',
    dataIndex: 'instrument_id',
    align: 'left',
    width: 120,
    fixed: 'left',
    minWidth: 120,
  },
  {
    title: '',
    dataIndex: 'direction',
    width: 40,
    align: 'left',
    fixed: 'left',
    minWidth: 40,
  },
  {
    title: '昨',
    dataIndex: 'yesterday_volume',
    align: 'right',
    width: 80,
  },
  {
    title: '今',
    dataIndex: 'today_volume',
    align: 'right',
    width: 80,
  },
  {
    title: '总',
    dataIndex: 'volume',
    align: 'right',
    width: 80,
  },
  {
    title: '开仓均价',
    dataIndex: 'avg_open_price',
    align: 'right',
    width: 110,
  },
  {
    title: '最新价',
    dataIndex: 'last_price',
    align: 'right',
    width: 110,
  },
  {
    title: '浮动盈亏',
    dataIndex: 'unrealized_pnl',
    align: 'right',
    width: 110,
    fixed: 'right',
  },
];

export const categoryRegisterConfig: KfCategoryRegisterProps = {
  name: 'globalPos',
  commonData: {
    name: '持仓汇总',
    color: 'pink',
  },
  order: {
    getter(orders, kfLocation: KungfuApi.KfExtraLocation) {
      const { group, name } = kfLocation;
      return orders
        .filter('exchange_id', group)
        .filter('instrument_id', name)
        .sort('update_time');
    },
  },
  trade: {
    getter(trades, kfLocation: KungfuApi.KfExtraLocation) {
      const { group, name } = kfLocation;
      return trades
        .filter('exchange_id', group)
        .filter('instrument_id', name)
        .sort('trade_time');
    },
  },
  position: {
    getter(position, kfLocation: KungfuApi.KfExtraLocation) {
      const { group, name } = kfLocation;
      return position
        .nofilter('volume', BigInt(0))
        .filter('ledger_category', LedgerCategoryEnum.td)
        .filter('exchange_id', group)
        .filter('instrument_id', name)
        .sort('instrument_id')
        .reverse();
    },
  },
};
