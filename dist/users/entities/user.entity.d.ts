export declare enum LeadStatus {
    NEW = "new",
    CONTACTED = "contacted",
    QUALIFIED = "qualified",
    CLOSED_WON = "closed_won",
    CLOSED_LOST = "closed_lost"
}
export declare enum ServiceType {
    LEGAL = "legal",
    INSTA_ADS = "insta_ads",
    BUSINESS_CONSULTING = "business_consulting",
    RECRUITMENT = "recruitment",
    WEBSITE = "website",
    SOCIAL_MEDIA = "social_media",
    OTHER = "other"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceInterest?: ServiceType;
    message?: string;
    source?: string;
    practiceArea?: string;
    platform?: string;
    budget?: string;
    currentFollowers?: string;
    annualRevenue?: string;
    primaryChallenge?: string;
    serviceRequired?: string;
    numberOfPositions?: string;
    projectType?: string;
    status: LeadStatus;
    adminNotes?: string;
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}
