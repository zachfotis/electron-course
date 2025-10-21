type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

enum IPC_EVENTS {
  STATISTICS = 'statistics',
  GET_STATIC_DATA = 'getStaticData',
}

type EventPayloadMapping = {
  [IPC_EVENTS.STATISTICS]: Statistics;
  [IPC_EVENTS.GET_STATIC_DATA]: StaticData;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
    getStaticData: () => Promise<StaticData>;
  };
}
