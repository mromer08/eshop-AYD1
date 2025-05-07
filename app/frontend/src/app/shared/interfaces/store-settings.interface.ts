export interface StoreSettings {
    nit:            string;
    name:           string;
    logo_url:       string;
    address:        string;
    phone_number:   string;
}

export interface UpdateSettings extends Partial<StoreSettings> { }