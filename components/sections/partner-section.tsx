import { SectionHeading } from '@/components/ui/section-heading';

export function PartnerSection() {
  return (
    <section className="section-pad bg-card/30">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Partnership"
          title="Our Partner"
          subtitle="Rentora Mobility is proud to be associated with Western Way Rides Pvt Ltd."
          center
        />
        <div className="mt-10 flex flex-col items-center">
          <div className="luxury-card flex w-full max-w-2xl items-center justify-center p-8 md:p-12">
            <img
              src="/brand/western way rides pvt ltd.png"
              alt="Western Way Rides Pvt Ltd — Rentora Mobility partner"
              className="max-h-28 w-auto object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-6 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Western Way Rides Pvt Ltd
          </p>
        </div>
      </div>
    </section>
  );
}
