import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegisterClientForm from "./RegisterClientForm";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";

// Just an excerpt of teams for the picker
const TEAMS = [
  { code: 'MEX', name: 'Mexico' },
  { code: 'RSA', name: 'South Africa' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'CZE', name: 'Czechia' },
  { code: 'CAN', name: 'Canada' },
  { code: 'BIH', name: 'Bosnia and Herzegovina' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'SUI', name: 'Switzerland' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'MAR', name: 'Morocco' },
  { code: 'HAI', name: 'Haiti' },
  { code: 'SCO', name: 'Scotland' },
  { code: 'USA', name: 'United States' },
  { code: 'PAR', name: 'Paraguay' },
  { code: 'AUS', name: 'Australia' },
  { code: 'TUR', name: 'Türkiye' },
  { code: 'GER', name: 'Germany' },
  { code: 'CUW', name: 'Curaçao' },
  { code: 'CIV', name: 'Ivory Coast' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'NED', name: 'Netherlands' },
  { code: 'JPN', name: 'Japan' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'TUN', name: 'Tunisia' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'IRN', name: 'Iran' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'ESP', name: 'Spain' },
  { code: 'CPV', name: 'Cabo Verde' },
  { code: 'KSA', name: 'Saudi Arabia' },
  { code: 'URU', name: 'Uruguay' },
  { code: 'FRA', name: 'France' },
  { code: 'SEN', name: 'Senegal' },
  { code: 'IRQ', name: 'Iraq' },
  { code: 'NOR', name: 'Norway' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'ALG', name: 'Algeria' },
  { code: 'AUT', name: 'Austria' },
  { code: 'JOR', name: 'Jordan' },
  { code: 'POR', name: 'Portugal' },
  { code: 'COD', name: 'DR Congo' },
  { code: 'UZB', name: 'Uzbekistan' },
  { code: 'COL', name: 'Colombia' },
  { code: 'ENG', name: 'England' },
  { code: 'CRO', name: 'Croatia' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'PAN', name: 'Panama' }
].sort((a, b) => a.name.localeCompare(b.name));

export default async function NewUserPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  if (session.user.hasFinalPrediction || session.user.role === "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 bg-vintage-forest soccer-field-pattern grain-overlay flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <WorldCupTrophy className="mx-auto h-12 w-12 text-vintage-gold" />
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-vintage-cream font-serif">
            One Last Step
          </h2>
          <p className="mt-2 text-center text-sm text-vintage-cream/80">
            Pick your 2026 World Cup Champion
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-vintage-paper py-8 px-4 shadow-vintage sm:rounded-xl sm:px-10 border border-vintage-gold/20">
          <RegisterClientForm teams={TEAMS} />

          <div className="mt-6 border-t border-vintage-gold/20 pt-6">
            <h3 className="text-sm font-semibold text-vintage-charcoal uppercase tracking-wider">
              Registration Fee & Approval
            </h3>
            <p className="mt-2 text-sm text-vintage-charcoal/80">
              Users must pay an entry fee of <strong>Rs. 1,000 offline</strong>.
              Your account will be strictly blocked from prediction access and sign-in until an Admin manually approves and activates your account upon payment receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
