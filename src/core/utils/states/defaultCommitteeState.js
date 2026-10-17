// Cuenta incluida para la demostración local del comité organizador.
export const defaultCommitteeAccount = {
  userId: 'default-committee',
  names: 'Comité',
  surnames: 'organizador',
  name: 'Comité organizador',
  email: 'admin@aloe.ulima.edu.pe',
  institution: 'Universidad de Lima',
  role: 'committee',
}

export const defaultCommitteeCredential = {
  email: defaultCommitteeAccount.email,
  salt: 'ba733bd5148a4013068f73c20d9ccb1e',
  hash: '05ee5f89bca51f762bde2fedcaa0a38e47b413b22e3fa6dde36f30c5de427c92',
  iterations: 210000,
  algorithm: 'PBKDF2-SHA-256',
}
