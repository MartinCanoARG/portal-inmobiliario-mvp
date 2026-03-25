export type Plan = {
  id: number;
  name: string;
  slug: string;
  priority: number;
  max_properties: number;
  max_images_per_property: number;
  badge_label: string;
  highlighted_home: boolean;
};

export type AdvertiserProfile = {
  id: number;
  advertiser_type: "agency" | "owner";
  advertiser_type_label: string;
  visible_name: string;
  business_name: string;
  public_display_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  license_number: string;
  logo_url: string;
  description: string;
  plan: Plan;
  is_active: boolean;
};

export type PropertyImage = {
  id: number;
  image_url: string;
  caption: string;
  position: number;
};

export type PropertyRecord = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  price: string;
  currency: "USD" | "ARS";
  operation_type: "sale" | "rent";
  operation_label: string;
  property_type: string;
  property_type_label: string;
  city: string;
  zone: string;
  address: string;
  square_meters: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  garage: boolean;
  patio: boolean;
  pool: boolean;
  age: number;
  state: string;
  state_label?: string;
  published_at: string | null;
  cover_image_url: string;
  advertiser: AdvertiserProfile;
  plan: Plan;
  latitude: string;
  longitude: string;
  images?: PropertyImage[];
};

export type AuthPayload = {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
  };
  profile: AdvertiserProfile | null;
};
