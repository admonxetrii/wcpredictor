import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-vintage-forest relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-vintage-paper rounded-3xl p-10 md:p-16 text-center border-2 border-vintage-gold/30 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-vintage-charcoal mb-6">
            Ready to Make Your Predictions?
          </h2>
          <p className="text-lg text-vintage-charcoal/70 mb-10 max-w-2xl mx-auto">
            Join thousands of football fans around the world. Secure your spot, lock in your final champion pick, and prepare for the biggest World Cup in history.
          </p>
          
          <Link 
            href="/auth/signin" 
            className="inline-block btn-glow px-10 py-5 rounded-xl bg-vintage-forest text-vintage-gold font-bold text-xl hover:bg-vintage-forest-light transition-colors shadow-lg"
          >
            Enter the Tournament Now
          </Link>
          <p className="mt-6 text-sm text-vintage-charcoal/50">
            NRS. 1,000 Entry Fee Required.
          </p>
        </div>
      </div>
    </section>
  );
}
