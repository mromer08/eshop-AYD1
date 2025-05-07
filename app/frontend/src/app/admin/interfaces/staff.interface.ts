import { CurrentPermission } from "../../auth/interfaces/user.interface"

export interface Staff {
  name:         string;
  lastname:     string;
  email:        string;
  password:     string;
  role:         string;
  permissions:  CurrentPermission[]
}