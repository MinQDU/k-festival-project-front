// src/types/festival.ts
export interface FestivalItem {
  festivalName: string;
  holdPlace: string;
  festivalStartDate: string;
  festivalEndDate: string;
  rawContent: string;
  operatorInstitution: string;
  hostInstitution: string;
  sponsorInstitution: string;
  tel: string;
  homepageUrl: string;
  relatedInfo: string;
  roadAddress: string;
  landAddress: string;
  latitude: number;
  longitude: number;
  dataStandardDate: string;
  providerInsttCode: string;
  providerInsttName: string;
  image: string;
  category: string[];
}
