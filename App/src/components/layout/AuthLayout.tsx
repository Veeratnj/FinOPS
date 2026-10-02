import AuthNavbar from "../../components/marketing/AuthNavbar";
import AuthFooter from "../../components/marketing/AuthFooter";

const AuthLayout = ({ children }: any) => {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(124,255,0,0.14),_transparent_35%),_#040404] text-foreground">

      <AuthNavbar />

      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      <AuthFooter />

    </div>
  );
};

export default AuthLayout;