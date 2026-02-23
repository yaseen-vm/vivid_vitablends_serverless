export const authStorage = {
  getToken: () => sessionStorage.getItem("adminToken"),
  setToken: (token: string) => sessionStorage.setItem("adminToken", token),
  getAuth: () => sessionStorage.getItem("adminAuth"),
  setAuth: (value: string) => sessionStorage.setItem("adminAuth", value),
  clear: () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminAuth");
  },
};
