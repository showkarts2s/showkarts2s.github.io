import { assetUrl } from "@/lib/assets";
import { motion, useReducedMotion } from "motion/react";

export default function BrandLogo() {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-flex shrink-0 items-center gap-2.5">
      <span className="relative grid size-11 shrink-0 place-items-center sm:size-12">
        <motion.span
          className="absolute inset-1 rounded-xl bg-gradient-to-br from-violet-500/30 via-cyan-400/20 to-amber-300/20 blur-md"
          animate={
            reduceMotion ? undefined : { scale: [0.85, 1.12, 0.85], opacity: [0.3, 0.75, 0.3] }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.img
          src={assetUrl("/showkart-mark.svg")}
          alt=""
          width={48}
          height={48}
          className="relative size-11 shrink-0 drop-shadow-[0_5px_10px_rgba(6,182,212,0.2)] sm:size-12"
          animate={reduceMotion ? undefined : { y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          whileHover={reduceMotion ? undefined : { scale: 1.07 }}
        />
      </span>
      <span className="flex flex-col gap-1 whitespace-nowrap">
        <span className="font-heading text-[20px] font-extrabold leading-none tracking-[-0.04em] sm:text-[23px]">
          <span className="text-[#FAF7EC]">Show</span>
          <span className="text-[#D8B45A]">Kart</span>
        </span>
        <span className="text-[8px] font-semibold uppercase leading-none tracking-[0.2em] text-[#D8BD73] sm:text-[9px]">
          From Stage to Seat
        </span>
      </span>
    </span>
  );
}
