
import ScamAlert from "../components/client/ScamAlert";
import AppHeader from "../components/server/partials/AppHeader";
import Footer from "../components/server/partials/Footer/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {

      return (
            <>
                  <ScamAlert />
                  <AppHeader />
                  {children}
                  <Footer />
            </>
      );
}

