import { openAlert } from "@/app/components/client/AlertModal";
import { create } from "zustand";

interface AlertStore {
      message: string;
      message2: string;
      status: "error" | "success",
      modalType: "message" | "dialog",
      modalAlertMessage: string;
      setMessage: (message: string, status?: "error" | "success") => void;
      setMessage2: (message: string, status?: "error" | "success") => void;
      setModalMessage: (message: string, type?: "message" | "dialog" | null) => Promise<boolean>;
      resolve: ((confirmed: boolean) => void) | null;
      setModalResp: (resp: boolean) => void
}

const useAlertStore = create<AlertStore>((set) => {

      let timeout: NodeJS.Timeout;

      return {

            message: "",
            message2: "",
            modalAlertMessage: "",
            status: "success",
            resolve: null,
            modalType: "message",

            setMessage: (message, status = "success") => {

                  set(() => ({ message }));

                  set(() => ({ status }));

                  if (timeout) clearTimeout(timeout);

                  timeout = setTimeout(() => {
                        set(() => ({ message: "" }));
                  }, 5000);
            },

            setMessage2: (message2, status = "success") => {

                  set(() => ({ message2 }));

                  set(() => ({ status }));

                  if (timeout) clearTimeout(timeout);

                  timeout = setTimeout(() => {
                        set(() => ({ message2: "" }));
                  }, 5000);
            },

            setModalMessage: (modalAlertMessage, type = null) => {
                  return new Promise((resolve) => {
                        set(() => ({ modalAlertMessage, resolve, modalType: type ?? "message" }));
                        if (modalAlertMessage != "") {
                              openAlert();
                        } else {
                              resolve(false);
                        }
                  })
            },

            setModalResp: (resp: boolean) => {
                  set((state) => {
                        state.resolve?.(resp);
                        return { resolve: null, modalAlertMessage: '' };
                  })
            }
      };
});

export default useAlertStore;

