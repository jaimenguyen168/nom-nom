"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const TermsAndPrivacyView = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pb-20">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-gray-600 hover:text-gray-800"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black font-semibold">
              Terms & Privacy
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Terms of Use Section */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          TERMS OF USE
        </h1>

        <div className="space-y-8">
          {/* Section 1 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              • Acceptance of Terms and Use of Services
            </h3>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using NomNom, you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to
              abide by the above, please do not use this service. We reserve the
              right to modify these terms at any time without prior notice. Your
              continued use of the service constitutes acceptance of any changes
              to these terms.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              • User Content and Recipe Sharing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Users may submit recipes, comments, photos, and other content to
              NomNom. By submitting content, you grant us a non-exclusive,
              royalty-free, worldwide license to use, modify, and distribute
              your content on our platform. You retain ownership of your
              original content but are responsible for ensuring you have the
              right to share any recipes or materials you post. We reserve the
              right to remove any content that violates our community
              guidelines.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              • Prohibited Uses and Community Guidelines
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Users agree not to use NomNom for any unlawful purpose or in any
              way that could damage, disable, or impair the service. This
              includes posting spam, harassment, copyrighted material without
              permission, or any content that is offensive, threatening, or
              inappropriate. We maintain the right to suspend or terminate
              accounts that violate these guidelines. Commercial use of our
              platform requires explicit written permission.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Cookies Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          PRIVACY & COOKIES
        </h1>

        <div className="space-y-8">
          {/* Section 1 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              • Information We Collect and How We Use It
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We collect information you provide directly to us, such as when
              you create an account, post recipes, or contact us. This includes
              your name, email address, profile information, and any content you
              submit. We also automatically collect certain information about
              your device and how you interact with our service, including IP
              address, browser type, and usage patterns. This information helps
              us improve our service and provide personalized recommendations.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              • Cookies and Tracking Technologies
            </h3>
            <p className="text-gray-600 leading-relaxed">
              NomNom uses cookies and similar tracking technologies to enhance
              your experience on our platform. Cookies help us remember your
              preferences, keep you logged in, and analyze how our service is
              used. You can control cookie settings through your browser, but
              disabling cookies may limit some functionality. We also use
              analytics tools to understand user behavior and improve our
              service, always in accordance with applicable privacy laws.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              • Data Security and Your Rights
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. You have the right to
              access, update, or delete your personal information at any time
              through your account settings. We will never sell your personal
              information to third parties. For users in certain jurisdictions,
              additional rights may apply under local privacy laws such as GDPR
              or CCPA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyView;
