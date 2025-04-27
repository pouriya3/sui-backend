export enum UserStateEnum {
    AVAILABLE = 'AVAILABLE',
    IN_MATCH = 'IN_MATCH'
}


export class UserStatsResponse {
    totalGameCount: number;
    winCount: number;
    totalWinAmount: number;
    totalLossAmount: number;
    totalJoinTournamentCount: number;
    tournamentWinCount: number;
}


export enum UserFrozenTypeEnum {
    BALANCE = "BALANCE",
    BONUS = "BONUS"
}

export enum VerificationStatusEnum {
    NOT_VERIFIED = 'NOT_VERIFIED',
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED'
}

export enum KycImageTypeStatusEnum {
    ID_CARD = 'ID_CARD',
    BILL = 'BILL',
    SELFIE = 'SELFIE'
}