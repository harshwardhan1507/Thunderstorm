"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    image: "🧑‍💼",
    content: "ThunderStorm completely changed how I approach algorithm interviews. The visualizations made complex concepts click instantly.",
    rating: 5,
  },
  {
    name: "Alex Rodriguez",
    role: "Senior Developer",
    company: "Meta",
    image: "👨‍💻",
    content: "The interactive step-by-step execution helped me understand time complexity in ways textbooks never could.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Tech Lead",
    company: "Amazon",
    image: "👩‍🔬",
    content: "I've recommended ThunderStorm to my entire team. It's the best DSA learning tool I've ever used.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Full Stack Developer",
    company: "Microsoft",
    image: "🧑‍🏫",
    content: "Finally, a platform that makes algorithm visualization engaging and fun. Worth every second spent.",
    rating: 5,
  },
];

export function TestimonialsSection() {
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
            Loved by Developers Worldwide
          </h2>
          <p className="text-lg text-white/60">
            Join thousands of engineers from top tech companies who've mastered algorithms with ThunderStorm.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 group-hover:border-primary/50 transition-colors duration-300" />
              
              {/* Card Content */}
              <div className="relative p-8 rounded-2xl">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/80 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-purple-600/50 flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/60">
                      {testimonial.role} at <span className="font-medium text-white/80">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
