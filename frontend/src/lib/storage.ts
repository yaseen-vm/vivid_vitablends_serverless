let memoryToken: string | null = null;
let memoryAuth: string | null = null;

export const authStorage = {
  getToken: () => memoryToken,
  setToken: (token: string) => {
    memoryToken = token;
  },
  getAuth: () => memoryAuth,
  setAuth: (value: string) => {
    memoryAuth = value;
  },
  clear: () => {
    memoryToken = null;
    memoryAuth = null;
  },
};
