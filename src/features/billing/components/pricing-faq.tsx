import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/features/billing/constants/pricing-faq";

const PricingFaq = () => {
  return (
    <section className="max-w-3xl mx-auto w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-semibold">
          Frequently asked <span className="text-primary-200">questions</span>
        </h2>
        <p className="text-gray-500">
          Everything you need to know before you upgrade.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((faq, i) => (
          <AccordionItem key={faq.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold text-gray-900 hover:text-primary-200">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default PricingFaq;
