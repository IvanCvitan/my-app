export interface Welcome {
    head:    Head;
    results: Result[];
}

export interface Head {
    counts:    Counts;
    dateRange: DateRange;
    lang:      string;
}

export interface Counts {
    billCount:   number;
    resultCount: number;
}

export interface DateRange {
    start: Date;
    end:   Date;
}

export interface Result {
    bill:        Bill;
    billSort:    BillSort;
    contextDate: Date;
}

export interface Bill {
    act:             Act | null;
    amendmentLists:  AmendmentListElement[];
    billNo:          string;
    billType:        BillType;
    billTypeURI:     string;
    billYear:        string;
    debates:         Debate[];
    events:          EventElement[];
    lastUpdated:     Date;
    longTitleEn:     string;
    longTitleGa:     string;
    method:          Method;
    methodURI:       string;
    mostRecentStage: Stage;
    originHouse:     OriginHouse;
    originHouseURI:  string;
    relatedDocs:     RelatedDoc[];
    shortTitleEn:    string;
    shortTitleGa:    string;
    source:          Source;
    sourceURI:       string;
    sponsors:        SponsorElement[];
    stages:          Stage[];
    status:          Sta;
    statusURI:       string;
    uri:             string;
    versions:        Version[];
}

export interface Act {
    actNo:          string;
    actYear:        string;
    dateSigned:     Date;
    longTitleEn:    string;
    longTitleGa:    string;
    shortTitleEn:   string;
    shortTitleGa:   string;
    statutebookURI: string;
    uri:            string;
}

export interface AmendmentListElement {
    amendmentList: AmendmentListAmendmentList;
}

export interface AmendmentListAmendmentList {
    amendmentTypeUri: AmendmentTypeURI;
    chamber:          OriginHouse;
    date:             Date;
    formats:          Formats;
    showAs:           string;
    stage:            OriginHouse;
    stageNo:          string;
}

export interface AmendmentTypeURI {
    uri: string;
}

export interface OriginHouse {
    showAs: null | string;
    uri:    null | string;
}

export interface Formats {
    pdf: AmendmentTypeURI;
    xml: null;
}

export enum BillType {
    Public = "Public",
}

export interface Debate {
    chamber:         OriginHouse;
    date:            Date;
    debateSectionId: string;
    showAs:          string;
    uri:             string;
}

export interface EventElement {
    event: EventEvent;
}

export interface EventEvent {
    chamber:  Chamber | null;
    dates:    DateElement[];
    eventURI: string;
    showAs:   PurpleShowAs;
    uri:      string;
}

export interface Chamber {
    chamberCode: Code;
    showAs:      ChamberShowAs;
    uri:         string;
}

export enum Code {
    Dail = "dail",
    Seanad = "seanad",
}

export enum ChamberShowAs {
    DáilÉireann = "Dáil Éireann",
    SeanadÉireann = "Seanad Éireann",
}

export interface DateElement {
    date: Date;
}

export enum PurpleShowAs {
    AdmissibilityForIntroduction = "Admissibility for Introduction",
    ApprovedForInitiation = "Approved for Initiation",
    BillLapsed = "Bill Lapsed",
    Enacted = "Enacted",
    Published = "Published",
}

export enum Method {
    Introduced = "Introduced",
    Presented = "Presented",
}

export interface Stage {
    event: MostRecentStageEvent;
}

export interface MostRecentStageEvent {
    chamber:        Chamber | null;
    dates:          DateElement[];
    house:          House | null;
    progressStage:  number;
    showAs:         FluffyShowAs;
    stageCompleted: boolean;
    stageOutcome:   Sta | null;
    stageURI:       string;
    uri:            string;
}

export interface House {
    chamberCode: Code;
    chamberType: ChamberType;
    houseCode:   Code;
    houseNo:     string;
    showAs:      HouseShowAs;
    uri:         string;
}

export enum ChamberType {
    House = "house",
}

export enum HouseShowAs {
    The25ThSeanad = "25th Seanad",
    The26ThSeanad = "26th Seanad",
    The32NdDáil = "32nd Dáil",
    The33RDDáil = "33rd Dáil",
}

export enum FluffyShowAs {
    CommitteeStage = "Committee Stage",
    CreamList = "Cream List",
    Enacted = "Enacted",
    FifthStage = "Fifth Stage",
    FirstStage = "First Stage",
    ReportStage = "Report Stage",
    SecondStage = "Second Stage",
}

export enum Sta {
    Current = "Current",
    Enacted = "Enacted",
}

export interface RelatedDoc {
    relatedDoc: VersionClass;
}

export interface VersionClass {
    date:    Date;
    docType: DocType;
    formats: Formats;
    lang:    Lang;
    showAs:  string;
    uri:     string;
}

export enum DocType {
    Act = "act",
    Bill = "bill",
    Digest = "digest",
    Gluais = "gluais",
    Memo = "memo",
}

export enum Lang {
    Eng = "eng",
    Mul = "mul",
}

export enum Source {
    Government = "Government",
    PrivateMember = "Private Member",
}

export interface SponsorElement {
    sponsor: SponsorSponsor;
}

export interface SponsorSponsor {
    as:        OriginHouse;
    by:        OriginHouse;
    isPrimary: boolean;
}

export interface Version {
    version: VersionClass;
}

export interface BillSort {
    actNoSort:            number | null;
    actShortTitleEnSort:  null | string;
    actShortTitleGaSort:  null | string;
    actYearSort:          number | null;
    billNoSort:           number;
    billShortTitleEnSort: string;
    billShortTitleGaSort: string;
    billYearSort:         number;
}
