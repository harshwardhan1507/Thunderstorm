"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  href: string;
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for beginners",
    price: "Free",
    period: "",
    features: [
      "Access to 20+ algorithms",
      "Basic visualizations",
      "Community support",
      "No code execution",
    ],
    highlighted: false,
    cta: "Get Started",
    href: "/sorting",
  },
  {
    name: "Pro",
    description: "For serious learners",
    price: "$9.99",
    period: "/month",
    features: [
      "All Starter features",
      "48+ algorithms",
      "Code execution",
      "Custom test cases",
      "Progress tracking",
      "Email support",
    ],
    highlighted: true,
    cta: "Start Pro Trial",
    href: "/sorting",
  },
  {
    name: "Enterprise",
    description: "For teams & organizations",
    price: "Custom",
    period: "",
    features: [
      "All Pro features",
      "Team collaboration",
      "Custom algorithms",
      "API access",
      "Priority support",
      "SSO & advanced security",
    ],
    highlighted: false,
    cta: "Contact Sales",
    href: "/sorting",
  },
];

export function PricingSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-white/60">
            Choose the perfect plan for your learning journey.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group rounded-2xl transition-all duration-300 ${
                plan.highlighted ? "md:scale-105" : ""
              }`}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary/30 to-purple-600/20 border border-primary/50"
                    : "bg-gradient-to-br from-white/5 to-white/0 border border-white/10 group-hover:border-primary/50"
                }`}
              />

              {/* Highlighted Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                {/* Plan Info */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-white/60">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-primary flex-shrink-0 mt-0.5"
                      />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link href={plan.href}>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-white/60">
            All plans include a 7-day free trial.{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Compare plans →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
