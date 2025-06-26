export class JwtPayload {
  sub?: string;
  email?: string;
  tenant?: string;
  provider?: string;
  role?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}
