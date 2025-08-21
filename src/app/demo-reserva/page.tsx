import { DemoReservationProcess } from "@/components/sections/demo-reservation-process";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DemoReservaPage() {
  return (
    <>
      <Navbar isAuthenticated={false} showAuthButtons={false} />
      <div className="min-h-screen bg-gray-50" style={{ paddingTop: "80px" }}>
        <DemoReservationProcess />
        <Footer />
      </div>
    </>
  );
}
