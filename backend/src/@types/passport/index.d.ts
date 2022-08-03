import { User as AppUser } from '../../users/user.entity';

declare global {
  namespace Express {
    class User extends AppUser {}
  }
}
