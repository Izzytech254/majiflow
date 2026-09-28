import { ContentPage, ProseList, ProseSection } from "@/components/shared/content-page";

export default function Privacy() {
  return (
    <ContentPage
      label="Legal"
      title="Privacy Policy"
      description="How MajiFlow handles the personal data of customers, business owners and staff — what we collect, why, and how you stay in control."
      updated="21 September 2026"
    >
      <ProseSection title="What we collect">
        <ProseList
          items={[
            "Account data — name, phone number, email and saved delivery addresses",
            "Order data — products ordered, amounts, delivery addresses and payment records",
            "Business data — business profile, menu, prices, delivery zones and staff accounts",
            "Usage data — pages visited and basic device/browser information for performance",
          ]}
        />
      </ProseSection>

      <ProseSection title="How we use it">
        <ProseList
          items={[
            "To fulfil orders — your name, phone and address are shared with the refill business fulfilling your order",
            "To process payments through M-Pesa or card settlement providers",
            "To send order updates, receipts, reminders and platform notices by SMS, WhatsApp or email",
            "To improve the service — anonymised analytics only",
          ]}
        />
      </ProseSection>

      <ProseSection title="Your control">
        <p>
          You can update or delete your saved addresses and account from your dashboard. Businesses
          can export and delete their data from Billing settings. To request account deletion or
          data correction, email privacy@majiflow.co.ke and we'll act within 30 days.
        </p>
      </ProseSection>

      <ProseSection title="What we don't do">
        <ProseList
          items={[
            "We never sell your personal data.",
            "We never share your data with third parties for their own marketing.",
            "We never require payment card numbers to be typed into our website — payments go through M-Pesa or PCI-compliant processors.",
            "We never use your data to judge a business's ratings.",
          ]}
        />
      </ProseSection>

      <ProseSection title="Data protection">
        <p>
          We follow the Kenya Data Protection Act, 2019. Data is stored on encrypted infrastructure
          with access limited to vetted staff. SMS and delivery records are retained no longer than
          necessary for reconciliation and tax purposes.
        </p>
      </ProseSection>
    </ContentPage>
  );
}