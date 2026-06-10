"use client";

import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is FIFA WC 2026 Predictor completely free?",
    a: "No, there is a mandatory registration fee of Rs. 1,000 to enter the tournament. This fee builds the epic prize pool that is distributed to the winners at the end of the competition."
  },
  {
    q: "How does the scoring system work?",
    a: "In the group stages, you earn 3 points for correctly guessing the match outcome (Win/Loss/Draw) and an additional 2 points if you guess the exact score. Points escalate during the knockout rounds, and there are bonuses for guessing the correct game time (Full Time, Extra Time, Penalties) and the final tournament winner."
  },
  {
    q: "When do predictions lock?",
    a: "Predictions for any given match lock exactly 1 hour before the scheduled kickoff time. Once locked, you cannot change your prediction."
  },
  {
    q: "Can I change my Final Winner prediction?",
    a: "No. You must choose your Final Winner when you first register for the platform. This prediction is locked in immediately and cannot be changed for the duration of the tournament."
  },
  {
    q: "What happens during knockout round penalty shootouts?",
    a: "If a match goes to penalties, the final official FIFA score typically includes the penalty goals. Our system adds penalty shootout goals to the 120-minute score. For example, if it's 1-1 after Extra Time, and Team A wins 4-3 on penalties, the final score entered is 5-4 for Team A."
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-vintage-paper border-t border-vintage-gold/10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif text-vintage-charcoal mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-vintage-gold mx-auto" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group bg-vintage-cream rounded-xl border border-vintage-gold/20 [&_summary::-webkit-details-marker]:hidden overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-lg text-vintage-charcoal list-none select-none">
                <span>{faq.q}</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="text-vintage-gold" />
                </span>
              </summary>
              <div className="p-6 pt-0 text-vintage-charcoal/70 leading-relaxed bg-vintage-cream">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
