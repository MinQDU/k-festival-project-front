// src/types/festival.ts
export interface FestivalItem {
  id: number;
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
  like: boolean;
  likeCount: number;
  category: string[];
}

export interface FestivalSimple {
  id: number;
  name: string;
  imageUrl: string;
  region: string;
}
