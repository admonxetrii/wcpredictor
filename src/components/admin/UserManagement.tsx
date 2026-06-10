"use client";

import { toggleUserActive, updateUserAmount } from "@/app/admin/actions";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function UserManagement({ users }: { users: any[] }) {
  const totalExpected = users.length * 1000;
  const totalCollected = users.reduce((sum, user) => sum + (user.amountPaid || 0), 0);
  const totalRemaining = totalExpected - totalCollected;

  return (
    <div className="space-y-8">
      {/* Financial Audit Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-vintage-gold mb-2">Total Expected</h3>
          <p className="text-4xl font-serif font-bold text-white">Rs. {totalExpected.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-emerald-500/10 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/20 shadow-lg text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-2">Total Collected</h3>
          <p className="text-4xl font-serif font-bold text-emerald-300">Rs. {totalCollected.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-rose-500/10 backdrop-blur-xl p-6 rounded-2xl border border-rose-500/20 shadow-lg text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-rose-400 mb-2">Total Remaining</h3>
          <p className="text-4xl font-serif font-bold text-rose-300">Rs. {totalRemaining.toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/40 text-vintage-cream/60 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="py-5 px-6 font-semibold">Name & Email</th>
                <th className="py-5 px-6 font-semibold">Joined</th>
                <th className="py-5 px-6 font-semibold text-center">Amount Paid</th>
                <th className="py-5 px-6 font-semibold text-center">Remaining</th>
                <th className="py-5 px-6 font-semibold text-center">Login Status</th>
                <th className="py-5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {users.map((user, index) => {
              const remaining = Math.max(0, 1000 - (user.amountPaid || 0));
              return (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={user.id} 
                  className="hover:bg-white/5 transition-colors group align-middle"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-vintage-cream flex items-center justify-center font-bold text-sm shadow-inner group-hover:border-vintage-gold transition-colors overflow-hidden flex-shrink-0">
                        {user.image ? <img src={user.image} className="w-full h-full object-cover" alt={user.name||""} /> : user.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-white/60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-white/60 font-medium text-sm">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                  
                  {/* Amount Paid Form */}
                  <td className="py-5 px-6 text-center">
                    <form action={updateUserAmount} className="flex items-center justify-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <span className="text-vintage-cream/60 text-sm font-medium">Rs.</span>
                      <input 
                        type="number" 
                        name="amountPaid"
                        defaultValue={user.amountPaid || 0}
                        className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-center focus:outline-none focus:border-vintage-gold focus:ring-1 focus:ring-vintage-gold text-vintage-cream font-serif font-bold transition-all shadow-inner"
                      />
                      <SubmitButton className="text-[10px] uppercase tracking-wider font-bold bg-white/5 hover:bg-vintage-gold hover:text-black border border-white/10 hover:border-vintage-gold text-white/70 px-2 py-1.5 rounded-lg transition-colors" loadingText="...">
                        Save
                      </SubmitButton>
                    </form>
                  </td>

                  <td className="py-5 px-6 text-center">
                    <span className={`font-bold font-serif text-lg ${remaining === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {remaining === 0 ? "✓" : `Rs. ${remaining}`}
                    </span>
                  </td>

                  <td className="py-5 px-6 text-center">
                    {user.isActive ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Active</span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Pending</span>
                    )}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex flex-col gap-2 items-end justify-center h-full">
                      <form action={toggleUserActive.bind(null, user.id)}>
                        <SubmitButton className="w-28 text-[11px] uppercase tracking-wider border border-white/20 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg font-bold shadow-sm transition-colors text-white/80 hover:text-white" loadingText="Wait...">
                          {user.isActive ? "Deactivate" : "Approve"}
                        </SubmitButton>
                      </form>
                      <a href={`/admin/predictions/${user.id}`} className="w-28 text-center text-[11px] uppercase tracking-wider border border-vintage-gold/50 bg-vintage-gold/10 hover:bg-vintage-gold hover:text-black text-vintage-gold px-3 py-2 rounded-lg font-bold shadow-sm transition-colors">
                        Manual Log
                      </a>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
