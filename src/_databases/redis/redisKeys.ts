export enum RdKeysEnum {
    GAME_FROM_MAIN = 'gameTablesFromMainDb',
    GAME_FREE_TABLES = 'freeTables',
    FULL_TABLES = 'fullTables',
    GAME_TABLES_WITH_ERRORS = 'tablesWithErrors',

    TOURNAMENT_FROM_MAIN = 'tournamentTablesFromMainDb',
    TOURNAMENT_FREE_TABLES = 'tournamentFreeTables',
    TOURNAMENT_FULL_TABLES = 'tournamentFullTables',
    TOURNAMENT_TABLES_WITH_ERRORS = 'tournamentTablesWithErrors',

    NONCE_HOLDER = 'nonceHolder',

    PAYMASTERS = 'paymasters',
    HASH_MAP = 'hashMap',

    NOT_INITIALIZED_WALLETS = 'notInitializedWallets',
    USER_INFO = 'userInfo',

    SWAPS_ON_SWAP_SPACE = 'swapsOnSwapSpace',
    SWAPS_TO_USER = 'swapsToUser',
    TX_HASH_TO_SWAP = 'txHashToSwap',
    SWAP_TO_TRANSACTION = 'swapToTransaction',

    SMART_TO_WALLET = 'smartToWallet',

    MORALIS_USERS = 'moralisUsers',

    GAS_SENDED_TO_MEMPOOL = 'gasSendedToMempool',

    SCHEDULER_INTERVALS = 'schedulerIntervals',

    SCHEDULER_TIME_OUTS = 'schedulerTimeOuts',
}

export enum RdQueuesEnum {
    TOURNAMENT_JOIN_QUEUE = 'tournamentJoinQueue', // UNIQ
    TOURNAMENT_JOIN_IN_PROCESS_QUEUE = 'tournamentJoinInProcessQueue',
    TOURNAMENT_JOIN_ERROR_QUEUE = 'tournamentJoinErrorQueue',
    TOURNAMENT_JOINED_SUCCESSFULLY_QUEUE = 'tournamentJoinedSuccessfullyQueue', // UNIQ
    TOURNAMENT_RESERVED_FOR_TEAM = 'tournamentReservedForTeam',
    TOURNAMENT_RECEIVED_FAKE_ACCOUNTS = 'tournamentReceivedFakeAccounts',
}
